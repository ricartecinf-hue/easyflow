import { after, NextRequest, NextResponse } from "next/server";
import { getCurrentWorkspaceId } from "@/lib/auth";
import { getWorkspaceInstagramAccount } from "@/lib/instagram-accounts";
import { getRedisConnection } from "@/lib/queue/client";
import {
  getConversations,
  sendDirectMessage,
  MetaApiError,
} from "@/lib/meta/client";
import { decryptToken } from "@/lib/meta/oauth";

export interface ConversationListItem {
  id: string;
  contact: { id: string; username: string | null };
  updatedTime: string | null;
  lastMessage: {
    text: string;
    fromMe: boolean;
    createdTime: string | null;
  } | null;
}

export interface ConversationsResponse {
  conversations: ConversationListItem[];
  account: { id: string; username: string; instagramId: string };
}

type InboxAccount = {
  id: string;
  username: string;
  instagramId: string;
  accessToken: string;
};

interface CachedConversations {
  data: ConversationsResponse;
  cachedAt: number;
}

// Meta's expanded Conversations request can take several seconds. Keep the
// last successful response available for a week, but refresh it in the
// background after 15 seconds so navigating to the inbox never waits on Meta.
const CACHE_FRESH_MS = 15_000;
const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60;
const REFRESH_LOCK_SECONDS = 30;

function conversationsCacheKey(accountId: string): string {
  return `easyflow:inbox:conversations:v1:${accountId}`;
}

function conversationsLockKey(accountId: string): string {
  return `${conversationsCacheKey(accountId)}:refreshing`;
}

function mapConversations(
  account: InboxAccount,
  raw: Awaited<ReturnType<typeof getConversations>>
): ConversationsResponse {
  const conversations: ConversationListItem[] = raw.map((c) => {
    const participants = c.participants?.data ?? [];
    const contact =
      participants.find((p) => p.id !== account.instagramId) ??
      participants[0] ??
      null;
    const last = c.messages?.data?.[0] ?? null;

    return {
      id: c.id,
      contact: {
        id: contact?.id ?? "",
        username: contact?.username ?? null,
      },
      updatedTime: c.updated_time ?? null,
      lastMessage: last
        ? {
            text: last.message ?? "",
            fromMe: last.from?.id === account.instagramId,
            createdTime: last.created_time ?? null,
          }
        : null,
    };
  });

  return {
    conversations,
    account: {
      id: account.id,
      username: account.username,
      instagramId: account.instagramId,
    },
  };
}

async function fetchAndCacheConversations(
  account: InboxAccount
): Promise<ConversationsResponse> {
  const accessToken = decryptToken(account.accessToken);
  const raw = await getConversations(accessToken, account.instagramId);
  const data = mapConversations(account, raw);

  try {
    const cached: CachedConversations = { data, cachedAt: Date.now() };
    await getRedisConnection().set(
      conversationsCacheKey(account.id),
      JSON.stringify(cached),
      "EX",
      CACHE_TTL_SECONDS
    );
  } catch (err) {
    console.error("[Conversations] Cache write error:", err);
  }

  return data;
}

async function refreshConversationsInBackground(account: InboxAccount) {
  const redis = getRedisConnection();
  const acquired = await redis.set(
    conversationsLockKey(account.id),
    "1",
    "EX",
    REFRESH_LOCK_SECONDS,
    "NX"
  );
  if (!acquired) return;

  try {
    await fetchAndCacheConversations(account);
  } catch (err) {
    console.error("[Conversations] Background refresh error:", err);
  } finally {
    await redis.del(conversationsLockKey(account.id)).catch(() => undefined);
  }
}

// List the account's DM conversations for the inbox.
export async function GET(request: NextRequest) {
  const workspaceId = await getCurrentWorkspaceId();
  if (!workspaceId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const account = await getWorkspaceInstagramAccount(
    workspaceId,
    request.nextUrl.searchParams.get("instagramAccountId")
  );
  if (!account) {
    return NextResponse.json(
      { success: false, error: "Instagram account not connected." },
      { status: 400 }
    );
  }

  try {
    try {
      const rawCached = await getRedisConnection().get(
        conversationsCacheKey(account.id)
      );
      if (rawCached) {
        const cached = JSON.parse(rawCached) as CachedConversations;
        if (Date.now() - cached.cachedAt > CACHE_FRESH_MS) {
          after(() => refreshConversationsInBackground(account));
        }
        return NextResponse.json({ success: true, data: cached.data });
      }
    } catch (err) {
      // Redis is an acceleration layer here. Fall back to Meta when unavailable.
      console.error("[Conversations] Cache read error:", err);
    }

    const data = await fetchAndCacheConversations(account);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Conversations] Error:", err);
    const message =
      err instanceof MetaApiError
        ? err.message
        : "Failed to load conversations";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Send a direct message reply.
export async function POST(request: NextRequest) {
  const workspaceId = await getCurrentWorkspaceId();
  if (!workspaceId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: { instagramAccountId?: string; recipientId?: string; text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const text = body.text?.trim();
  if (!body.recipientId || !text) {
    return NextResponse.json(
      { success: false, error: "A recipient and message are required." },
      { status: 400 }
    );
  }

  const account = await getWorkspaceInstagramAccount(
    workspaceId,
    body.instagramAccountId ?? null
  );
  if (!account) {
    return NextResponse.json(
      { success: false, error: "Instagram account not connected." },
      { status: 400 }
    );
  }

  try {
    const accessToken = decryptToken(account.accessToken);
    const result = await sendDirectMessage(
      accessToken,
      account.instagramId,
      body.recipientId,
      text
    );
    // Force the next list refresh to include the newly sent preview.
    await getRedisConnection()
      .del(conversationsCacheKey(account.id))
      .catch(() => undefined);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("[Conversations] Send error:", err);
    // Surface Meta's own message — the common case is the 24-hour messaging
    // window having closed, which the user needs to see explicitly.
    const message =
      err instanceof MetaApiError ? err.message : "Failed to send message";
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
