import type { SeoPageConfig } from "@/components/seo-page-shell";

const templateLinks = [
  { label: "Modelo de link de produto", href: "/templates/dtc-product-link" },
  { label: "Modelo para captação imobiliária", href: "/templates/real-estate-lead-form" },
  { label: "Modelo de plano fitness", href: "/templates/fitness-plan" },
  { label: "Ver todos os modelos", href: "/templates" },
];

export const manychatAlternativePage: SeoPageConfig = {
  eyebrow: "Alternativa ao Manychat",
  title: "Uma alternativa objetiva ao Manychat para campanhas de comentários para DM",
  description:
    "O EasyFlow transforma comentários com palavras-chave em respostas privadas pela Meta, links rastreados, análises de campanha e relatórios para clientes.",
  primaryCta: "Experimentar o EasyFlow",
  bullets: [
    "Criado para comentários, publicações, reels e respostas privadas no Instagram.",
    "Integração pela API oficial da Meta, sem scraping ou compartilhamento de senha.",
    "Modelos de campanhas, links rastreados e relatórios compartilháveis.",
    "Núcleo de código aberto com hospedagem própria.",
  ],
  sections: [
    {
      title: "Objetivo por definição",
      body: "O EasyFlow mantém o caminho da campanha simples: palavra-chave, publicação, resposta, link e resultado.",
    },
    {
      title: "Resultados para clientes",
      body: "Links rastreados e relatórios compartilháveis mostram o que aconteceu após o comentário, além do simples envio da mensagem.",
    },
    {
      title: "Entrega pela Meta",
      body: "Os comentários passam por webhooks, filas, deduplicação e limites antes do envio da resposta privada pela API oficial.",
    },
  ],
  comparisonTitle: "EasyFlow e construtores amplos de chatbot",
  comparisons: [
    {
      label: "Configuração",
      ours: "Crie uma campanha por palavra-chave para uma publicação ou reel.",
      other: "Crie e mantenha um fluxo maior de automação de chatbot.",
    },
    {
      label: "Relatórios",
      ours: "Envios, descartes, falhas, cliques, CTR e relatórios por campanha.",
      other: "Análises amplas de conversas que exigem tratamento para apresentar ao cliente.",
    },
    {
      label: "Foco",
      ours: "Automação de campanhas do Instagram para equipes e agências.",
      other: "Automação geral de DMs em diversos canais e casos de uso.",
    },
  ],
  templateLinks,
  faqs: [
    {
      title: "O EasyFlow substitui totalmente o Manychat?",
      body: "Não. O EasyFlow é focado em campanhas de comentários para DM no Instagram. Para um chatbot completo, use uma plataforma ampla; para campanhas rápidas e mensuráveis, use o EasyFlow.",
    },
    {
      title: "Funciona para agências?",
      body: "Sim. O sistema oferece várias contas do Instagram, membros no espaço de trabalho, filtros, análises e relatórios compartilháveis.",
    },
  ],
};

export const templatesSeoPage: SeoPageConfig = {
  eyebrow: "Modelos de comentários para DM",
  title: "Modelos para responder comentários interessados por DM no Instagram",
  description:
    "Comece com campanhas para links de produtos, materiais gratuitos, preços, listas de espera, consultorias, eventos e serviços locais.",
  primaryCta: "Usar um modelo",
  bullets: [
    "O modelo escolhido acompanha o usuário até a criação da campanha.",
    "Cada modelo inclui palavras-chave, objetivo e texto de resposta.",
    "Links rastreados transformam respostas em cliques mensuráveis.",
    "Agências podem reutilizar modelos em diferentes contas.",
  ],
  sections: [
    {
      title: "Links de produtos",
      body: "Use comentários como LINK, COMPRAR ou TAMANHO para enviar a página exata do produto, oferta ou coleção.",
    },
    {
      title: "Materiais gratuitos",
      body: "Use GUIA, CHECKLIST, PLANO ou COMEÇAR para entregar materiais e ofertas de acompanhamento.",
    },
    {
      title: "Serviços locais",
      body: "Use PREÇO, AGENDAR, INFO ou VISITA para entregar agendamentos, orçamentos e páginas de ofertas.",
    },
  ],
  comparisonTitle: "Campanhas com modelos e respostas manuais",
  comparisons: [
    {
      label: "Velocidade",
      ours: "Lance modelos reutilizáveis de campanhas em minutos.",
      other: "Responda manualmente ou reescreva a campanha a cada vez.",
    },
    {
      label: "Medição",
      ours: "Use links rastreados e análises de palavras-chave por campanha.",
      other: "Dependa de capturas de tela, memória ou dados espalhados.",
    },
    {
      label: "Reutilização",
      ours: "Duplique a estratégia entre publicações, reels e contas de clientes.",
      other: "Repita toda a configuração a cada campanha.",
    },
  ],
  templateLinks,
  faqs: [
    {
      title: "Posso editar o texto do modelo?",
      body: "Sim. Você pode alterar palavras-chave, resposta privada, endereço de destino e estado da campanha antes de publicá-la.",
    },
    {
      title: "Os modelos funcionam em reels?",
      body: "Sim. As campanhas podem usar publicações ou reels da conta profissional conectada.",
    },
  ],
};

export const agenciesSeoPage: SeoPageConfig = {
  eyebrow: "Automação de DMs para agências",
  title: "Automação de DMs no Instagram para campanhas de clientes",
  description:
    "O EasyFlow oferece várias contas, relatórios para clientes, links rastreados e um fluxo objetivo de comentários para DM.",
  primaryCta: "Criar espaço da agência",
  bullets: [
    "Conecte várias contas profissionais do Instagram.",
    "Filtre painéis, registros, campanhas e configurações por conta.",
    "Convide integrantes como proprietários, administradores ou membros.",
    "Compartilhe relatórios somente para leitura sem expor os controles internos.",
  ],
  sections: [
    {
      title: "Separação por cliente",
      body: "Filtros por conta mantêm campanhas, registros e relatórios organizados quando um espaço administra várias marcas.",
    },
    {
      title: "Ofertas replicáveis",
      body: "Use modelos para oferecer materiais gratuitos, lançamentos, respostas de preço e listas de espera como serviços recorrentes.",
    },
    {
      title: "Comprovação do trabalho",
      body: "Relatórios mostram envios, descartes, falhas, cliques, CTR, palavras-chave e links rastreados.",
    },
  ],
  comparisonTitle: "Fluxo para agências e automação genérica",
  comparisons: [
    {
      label: "Relatório ao cliente",
      ours: "Links públicos e somente para leitura, sem expor controles internos.",
      other: "Capturas manuais ou painéis que mostram informações demais.",
    },
    {
      label: "Papéis da equipe",
      ours: "Proprietário, administrador e membro com convites individuais.",
      other: "Uma conta compartilhada ou permissões excessivas.",
    },
    {
      label: "Operação das contas",
      ours: "Filtros por conta para campanhas, registros, estatísticas e configurações.",
      other: "Trabalhos de clientes podem se misturar em espaços genéricos.",
    },
  ],
  templateLinks,
  faqs: [
    {
      title: "Quantas contas do Instagram posso conectar?",
      body: "O EasyFlow aceita várias contas profissionais dentro do mesmo espaço de trabalho.",
    },
    {
      title: "O cliente pode ver relatórios sem entrar no sistema?",
      body: "Sim. Os relatórios compartilháveis são páginas públicas somente para leitura e não exibem os controles privados.",
    },
  ],
};

export const commentLinkSeoPage: SeoPageConfig = {
  eyebrow: "Automação do comentário LINK",
  title: "Automatize comentários com LINK em publicações e reels do Instagram",
  description:
    "Permita que seguidores comentem LINK, COMPRAR, GUIA ou outra palavra e recebam a resposta privada correta com um endereço rastreado.",
  primaryCta: "Automatizar comentários",
  bullets: [
    "Identifique palavras exatas ou frases completas.",
    "Envie respostas privadas compatíveis com a Meta a partir do comentário.",
    "Inclua links rastreados com análise de cliques.",
    "Evite duplicidades e registre envios, descartes e falhas.",
  ],
  sections: [
    {
      title: "Para links de produtos",
      body: "Transforme comentários com LINK em visitas rastreadas para produtos, páginas de venda, listas de espera ou ofertas.",
    },
    {
      title: "Para ofertas de criadores",
      body: "Envie guias, materiais gratuitos, cursos e formulários de consultoria sem acompanhar a caixa de entrada manualmente.",
    },
    {
      title: "Para picos de lançamento",
      body: "Enfileire as respostas enquanto o reel ganha alcance, com verificações de volume e limites no worker.",
    },
  ],
  comparisonTitle: "Automação do comentário LINK e respostas manuais",
  comparisons: [
    {
      label: "Precisão",
      ours: "Cada comentário identificado recebe a resposta ligada àquela publicação.",
      other: "Respostas manuais se perdem facilmente durante picos de comentários.",
    },
    {
      label: "Rastreamento",
      ours: "Links rastreados conectam as respostas privadas aos cliques.",
      other: "Links comuns raramente mostram o desempenho por campanha.",
    },
    {
      label: "Conformidade",
      ours: "Criado para respostas privadas oficiais e filas que respeitam limites.",
      other: "Scraping ou automação de navegador podem colocar a conta em risco.",
    },
  ],
  templateLinks,
  faqs: [
    {
      title: "Posso usar palavras diferentes de LINK?",
      body: "Sim. Cada campanha aceita várias palavras, como PREÇO, COMPRAR, GUIA, PLANO, LISTA, VISITA ou uma frase personalizada.",
    },
    {
      title: "O EasyFlow envia uma DM normal do Instagram?",
      body: "Ele envia uma resposta privada compatível com a Meta, acionada pelo comentário e vinculada ao identificador desse comentário.",
    },
  ],
};
