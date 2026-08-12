export interface CampaignTemplate {
  slug: string;
  title: string;
  category: string;
  audience: string;
  summary: string;
  goal: string;
  keywords: string[];
  dmMessage: string;
  triggerExample: string;
  privateReplyPreview: string;
  setupMinutes: number;
  outcome: string;
  bestFor: string[];
  playbook: string[];
  metrics: string[];
  accent: "cyan" | "emerald" | "rose" | "amber";
}

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    slug: "dtc-product-link",
    title: "Link direto do produto",
    category: "Comércio social",
    audience: "Marcas que vendem diretamente ao consumidor",
    summary:
      "Transforme comentários como LINK ou COMPRAR em uma resposta privada com a página exata do produto, guia de tamanhos ou oferta de lançamento.",
    goal: "Solicitação de link do produto",
    keywords: ["LINK", "SHOP", "BUY"],
    dmMessage:
      "Olá, {username}! Aqui está o link do produto que você pediu: https://sualoja.com/produto",
    triggerExample: "LINK, por favor",
    privateReplyPreview:
      "Olá, Maya! Aqui está o link do produto que você pediu: sualoja.com/produto",
    setupMinutes: 4,
    outcome: "Mais conversas sobre produtos a partir de comentários de pessoas interessadas.",
    bestFor: ["Lançamentos de produtos", "Reels de clientes", "Campanhas com influenciadores"],
    playbook: [
      "Escolha o reel ou a publicação que mostra o produto com clareza.",
      "Use LINK, COMPRAR e QUERO como palavras-chave iniciais.",
      "Envie o link direto do produto acompanhado de um benefício curto.",
      "Acompanhe quais publicações geram mais respostas enviadas.",
    ],
    metrics: ["Respostas enviadas", "Duplicidades ignoradas", "CTR do link"],
    accent: "cyan",
  },
  {
    slug: "real-estate-lead-form",
    title: "Formulário para imóveis",
    category: "Geração de leads",
    audience: "Corretores e imobiliárias",
    summary:
      "Envie um formulário de avaliação, link de agendamento ou guia do bairro após um comentário em um reel de imóvel.",
    goal: "Captação de leads interessados",
    keywords: ["HOME", "LISTING", "VALUE"],
    dmMessage:
      "Olá, {username}! Aqui está o formulário com os detalhes do imóvel e os próximos horários de visita: https://seulink.com/imovel",
    triggerExample: "QUERO detalhes",
    privateReplyPreview:
      "Olá, Jordan! Aqui está o formulário com os detalhes do imóvel e horários de visita.",
    setupMinutes: 5,
    outcome: "Capture o interesse no imóvel antes que ele se perca entre os comentários.",
    bestFor: ["Reels de imóveis", "Guias de bairros", "Publicações de avaliação"],
    playbook: [
      "Escolha uma publicação de imóvel ou do mercado local.",
      "Use palavras que indiquem intenção de compra, não emojis genéricos.",
      "Envie um formulário que solicite contato e prazo de interesse.",
      "Continue o atendimento dos leads qualificados pelo formulário.",
    ],
    metrics: ["Aberturas do formulário", "DMs enviadas", "Visitas agendadas"],
    accent: "emerald",
  },
  {
    slug: "fitness-plan",
    title: "Download de plano fitness",
    category: "Funil para criadores",
    audience: "Treinadores e criadores fitness",
    summary:
      "Entregue um plano de treino, guia de alimentação ou formulário de consultoria quando alguém comentar PLANO, FIT ou COMEÇAR.",
    goal: "Entrega de material gratuito",
    keywords: ["PLAN", "FIT", "START"],
    dmMessage:
      "Olá, {username}! Aqui está o plano gratuito do reel: https://seulink.com/plano-fitness",
    triggerExample: "PLAN",
    privateReplyPreview:
      "Olá, Sam! Aqui está o plano gratuito do reel: seulink.com/plano-fitness",
    setupMinutes: 3,
    outcome: "Leve seguidores interessados para uma consultoria ou funil de e-mail.",
    bestFor: ["Reels de treino", "Publicações de transformação", "Lançamentos de desafios"],
    playbook: [
      "Publique um reel que mostre o resultado e peça uma palavra-chave.",
      "Mantenha a DM curta e focada no material prometido.",
      "Acrescente um link de consultoria depois do conteúdo gratuito.",
      "Revise as falhas e os envios ignorados após reels de grande alcance.",
    ],
    metrics: ["Pedidos do guia", "Inscrições no desafio", "Pedidos de consultoria"],
    accent: "rose",
  },
  {
    slug: "course-webinar",
    title: "Convite para aula ou webinar",
    category: "Educação",
    audience: "Produtores de cursos",
    summary:
      "Envie inscrições de webinar ou links de aula para quem comentar WEBINAR, AULA ou APRENDER.",
    goal: "Lista de espera do lançamento",
    keywords: ["WEBINAR", "CLASS", "LEARN"],
    dmMessage:
      "Olá, {username}! Aqui está o link de inscrição para a aula gratuita: https://seulink.com/webinar",
    triggerExample: "WEBINAR",
    privateReplyPreview:
      "Olá, Alex! Aqui está o link de inscrição para a aula gratuita: seulink.com/webinar",
    setupMinutes: 4,
    outcome: "Converta o alcance do conteúdo em inscrições para o webinar ou lista de espera.",
    bestFor: ["Lançamentos de cursos", "Minicursos", "Aulas ao vivo"],
    playbook: [
      "Vincule a campanha a um reel educativo com provas do resultado.",
      "Use uma palavra-chave principal na legenda e duas alternativas.",
      "Envie o link de inscrição com a data ou a promessa da aula.",
      "Compare os resultados orgânicos antes de investir em anúncios.",
    ],
    metrics: ["Inscrições", "DMs enviadas", "Taxa de comparecimento"],
    accent: "amber",
  },
  {
    slug: "beauty-price-list",
    title: "Tabela de preços de beleza",
    category: "Serviços locais",
    audience: "Salões, spas e profissionais de beleza",
    summary:
      "Responda com preços, agendamento e catálogo de serviços quando alguém comentar PREÇO, MENU ou AGENDAR.",
    goal: "Resposta de preço ou disponibilidade",
    keywords: ["PRICE", "MENU", "BOOK"],
    dmMessage:
      "Olá, {username}! Aqui está nosso catálogo de serviços e o link de agendamento: https://seulink.com/agendar",
    triggerExample: "PRICE",
    privateReplyPreview:
      "Olá, Riley! Aqui está nosso catálogo de serviços e o link de agendamento.",
    setupMinutes: 4,
    outcome: "Reduza respostas repetitivas e conduza clientes ao agendamento.",
    bestFor: ["Reels de antes e depois", "Catálogos de serviços", "Publicações de agenda"],
    playbook: [
      "Escolha uma publicação em que as pessoas já perguntem sobre preços.",
      "Adicione um link de agendamento com categorias claras de serviço.",
      "Evite alegações médicas ou promessas exageradas na DM.",
      "Atualize o link sempre que preços ou horários mudarem.",
    ],
    metrics: ["Cliques no agendamento", "DMs enviadas", "Novos agendamentos"],
    accent: "rose",
  },
  {
    slug: "restaurant-menu",
    title: "Cardápio e reserva de restaurante",
    category: "Gastronomia",
    audience: "Restaurantes e cafeterias",
    summary:
      "Envie cardápios, links de reserva ou eventos especiais quando alguém comentar MENU, MESA ou RESERVAR.",
    goal: "Solicitação de cardápio ou reserva",
    keywords: ["MENU", "TABLE", "RESERVE"],
    dmMessage:
      "Olá, {username}! Aqui está nosso cardápio e o link para reserva: https://seulink.com/cardapio",
    triggerExample: "MENU",
    privateReplyPreview:
      "Olá, Taylor! Aqui está nosso cardápio e o link para reserva.",
    setupMinutes: 3,
    outcome: "Transforme reels de comida em reservas e acessos ao cardápio.",
    bestFor: ["Pratos especiais", "Novos cardápios", "Reservas para o fim de semana"],
    playbook: [
      "Use um reel apetitoso com uma chamada clara para comentar.",
      "Envie um cardápio ou página de reserva adaptada ao celular.",
      "Só mencione vagas limitadas quando isso for verdadeiro.",
      "Reaproveite o modelo para pratos sazonais.",
    ],
    metrics: ["Cliques no cardápio", "Reservas", "Respostas da campanha"],
    accent: "amber",
  },
  {
    slug: "event-rsvp",
    title: "Confirmação de presença em evento",
    category: "Eventos",
    audience: "Espaços, comunidades e equipes de lançamento",
    summary:
      "Envie formulários de confirmação, links de calendário ou ingressos após comentários como RSVP, INGRESSO ou PARTICIPAR.",
    goal: "Inscrições para o evento",
    keywords: ["RSVP", "TICKET", "JOIN"],
    dmMessage:
      "Olá, {username}! Aqui está o link de confirmação com os detalhes do evento: https://seulink.com/rsvp",
    triggerExample: "RSVP",
    privateReplyPreview:
      "Olá, Morgan! Aqui está o link de confirmação com os detalhes do evento.",
    setupMinutes: 4,
    outcome: "Converta a atenção no evento em confirmações mensuráveis.",
    bestFor: ["Eventos temporários", "Workshops", "Eventos de comunidades"],
    playbook: [
      "Escolha o anúncio ou reel de apresentação do evento.",
      "Use RSVP como palavra principal e adicione alternativas ligadas ao ingresso.",
      "Envie um único link com data, local e confirmação.",
      "Pause a campanha quando o evento terminar.",
    ],
    metrics: ["Confirmações", "Cliques nos ingressos", "Respostas por publicação"],
    accent: "emerald",
  },
  {
    slug: "creator-media-kit",
    title: "Envio de mídia kit",
    category: "Negócios para criadores",
    audience: "Criadores e agências",
    summary:
      "Envie um mídia kit, tabela comercial ou formulário de parceria quando marcas comentarem COLLAB, KIT ou VALORES.",
    goal: "Captação de parcerias",
    keywords: ["COLLAB", "KIT", "RATES"],
    dmMessage:
      "Olá, {username}! Aqui está meu mídia kit e formulário de parceria: https://seulink.com/media-kit",
    triggerExample: "COLLAB",
    privateReplyPreview:
      "Olá, Casey! Aqui está meu mídia kit e formulário de parceria.",
    setupMinutes: 4,
    outcome: "Capture o interesse de marcas sem pedir que procurem o link na bio.",
    bestFor: ["Reels fixados de portfólio", "Estudos de caso", "Prospecção de marcas"],
    playbook: [
      "Fixe uma publicação de colaboração ou reel de portfólio.",
      "Use palavras profissionais que as marcas comentariam naturalmente.",
      "Envie o mídia kit e uma pergunta de qualificação.",
      "Revise as DMs semanalmente e marque as oportunidades qualificadas.",
    ],
    metrics: ["Contatos de marcas", "Cliques no mídia kit", "Parcerias qualificadas"],
    accent: "cyan",
  },
];

export function getCampaignTemplate(slug: string | null | undefined) {
  if (!slug) return null;
  return CAMPAIGN_TEMPLATES.find((template) => template.slug === slug) ?? null;
}

export function getCampaignTemplateSlugs() {
  return CAMPAIGN_TEMPLATES.map((template) => template.slug);
}
