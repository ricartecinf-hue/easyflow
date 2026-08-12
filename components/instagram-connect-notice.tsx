"use client";

import { useSearchParams } from "next/navigation";

type Tone = "error" | "warning" | "success";

const TONE_CLASSES: Record<Tone, string> = {
  error: "border-error/20 bg-error/10 text-error",
  warning: "border-warning/20 bg-warning/10 text-warning",
  success: "border-success/20 bg-success/10 text-success",
};

const MESSAGES: Record<string, { tone: Tone; title: string; detail: string }> = {
  denied: {
    tone: "warning",
    title: "Conexão com o Instagram cancelada",
    detail:
      "As permissões solicitadas pelo Instagram não foram aceitas. Tente novamente e aceite todas as permissões.",
  },
  invalid: {
    tone: "error",
    title: "Conexão com o Instagram expirada",
    detail:
      "O link de acesso está ausente ou tem mais de 10 minutos. Clique em Conectar Instagram para tentar novamente.",
  },
  forbidden: {
    tone: "error",
    title: "Sem permissão",
    detail:
      "Somente proprietários e administradores podem conectar uma conta do Instagram.",
  },
  already_connected: {
    tone: "warning",
    title: "Conta já conectada",
    detail:
      "Essa conta do Instagram está conectada a outro espaço de trabalho. Desconecte-a primeiro ou use outra conta.",
  },
};

export function InstagramConnectNotice() {
  const searchParams = useSearchParams();
  const status = searchParams.get("instagram");

  if (!status) return null;

  if (status === "misconfigured") {
    const missing = (searchParams.get("missing") ?? "")
      .split(",")
      .filter(Boolean);

    return (
      <Notice tone="error" title="Aplicativo do Instagram não configurado">
        <p>
          Defina{" "}
          {missing.length > 0
            ? "estas variáveis de ambiente"
            : "as variáveis de ambiente obrigatórias"}{" "}
          e reinicie o servidor:
        </p>
        {missing.length > 0 && (
          <ul className="mt-2 space-y-1">
            {missing.map((name) => (
              <li key={name} className="font-mono text-xs">
                {name}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2">
          Consulte <span className="font-mono text-xs">docs/setup.md</span> para
          obter cada valor. A <span className="font-mono text-xs">ENCRYPTION_KEY</span> deve ser
          uma string hexadecimal de 64 caracteres.
        </p>
      </Notice>
    );
  }

  if (status === "failed") {
    const reason = searchParams.get("reason");

    return (
      <Notice tone="error" title="Falha ao conectar o Instagram">
        <p>
          O Instagram aceitou o acesso, mas a conexão não foi concluída. Geralmente
          isso acontece por uma URL de redirecionamento incorreta ou pela falta de permissões.
        </p>
        {reason && (
          <p className="mt-2 font-mono text-xs break-words opacity-80">
            {reason}
          </p>
        )}
      </Notice>
    );
  }

  const known = MESSAGES[status];
  if (!known) return null;

  return (
    <Notice tone={known.tone} title={known.title}>
      <p>{known.detail}</p>
    </Notice>
  );
}

function Notice({
  tone,
  title,
  children,
}: {
  tone: Tone;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded border p-4 text-sm ${TONE_CLASSES[tone]}`}>
      <p className="font-semibold">{title}</p>
      <div className="mt-1 opacity-90">{children}</div>
    </div>
  );
}
