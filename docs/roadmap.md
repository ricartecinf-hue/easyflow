# Roadmap do EasyFlow

> Implementado no código em agosto de 2026. A publicação em produção depende
> da migração do banco e da configuração das variáveis do administrador/Asaas
> descritas em `docs/easypanel.md`.

## Desativação do projeto antigo

- [x] Pasta local do Sloth removida do Mac em 13/08/2026.
- [ ] Confirmar e remover o antigo serviço Sloth do Easypanel.
- [ ] Confirmar e remover o antigo repositório Sloth do GitHub.
- [ ] Confirmar que não restam URLs do Sloth configuradas no app da Meta.

## Próximo módulo: administração de usuários e cobrança pelo Asaas

Objetivo: permitir que o administrador acompanhe o uso do EasyFlow, libere ou
bloqueie contas manualmente e automatize o acesso conforme o pagamento no
Asaas.

### Painel administrativo global

- Acesso exclusivo aos e-mails definidos como administradores do sistema.
- Indicadores de usuários cadastrados, contas com Instagram conectado,
  campanhas ativas, usuários ativos em 7 e 30 dias e DMs enviadas.
- Registrar e exibir a data do último acesso de cada usuário.
- Listar usuário, espaço de trabalho, Instagram conectado, campanhas, data de
  cadastro, último acesso e situação da cobrança.
- Permitir buscar e filtrar por nome, e-mail, status e tipo de acesso.

### Controle manual de acesso

- Ativar ou desativar um espaço de trabalho pelo painel administrativo.
- Permitir acesso gratuito/manual para parceiros e usuários de teste.
- O acesso gratuito pode ter validade opcional ou permanecer sem vencimento.
- Registrar motivo, data e administrador responsável por cada alteração.
- Uma conta marcada como gratuita/manual não pode ser bloqueada por um evento
  de cobrança do Asaas.

### Cobrança automática pelo Asaas

- Relacionar cada espaço de trabalho ao cliente e à assinatura do Asaas.
- Receber webhooks do Asaas e processá-los de forma idempotente.
- Ativar o acesso após a confirmação do pagamento.
- Aplicar período de tolerância configurável quando houver atraso.
- Bloquear automaticamente após o fim da tolerância ou cancelamento da
  assinatura.
- Reativar automaticamente quando o pagamento for regularizado.
- Guardar o histórico dos eventos de cobrança e das mudanças de acesso.
- Validar na documentação oficial do Asaas os eventos e a autenticação do
  webhook antes da implementação.

### Regras de bloqueio

- O bloqueio deve impedir acesso ao painel e criação/edição de campanhas.
- Webhooks de comentários não devem enfileirar novos envios para contas
  bloqueadas.
- O worker deve verificar novamente o status antes de enviar cada DM, evitando
  que itens que já estavam na fila sejam enviados depois do bloqueio.
- Login, página de cobrança, políticas públicas e webhook do Asaas devem
  continuar acessíveis quando a conta estiver bloqueada.
- O usuário bloqueado deve ver uma tela clara com o motivo e a forma de
  regularizar o acesso.

### Ordem sugerida de implementação

1. Status de acesso, último acesso e histórico no banco de dados.
2. Proteção global do painel, webhook do Instagram e worker.
3. Painel administrativo com ativação, bloqueio e acesso gratuito.
4. Integração de clientes, assinaturas e webhooks do Asaas.
5. Testes de pagamento, atraso, cancelamento, reativação e acesso gratuito.
