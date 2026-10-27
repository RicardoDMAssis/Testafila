# Frontend TestaFila

Estado do frontend Next.js App Router em 27/10/2026. Este guia descreve as rotas,
integração com a API e limites verificados do cliente. As evidências do QA integrado
estão em [QA-LOTE-03.md](QA-LOTE-03.md) e [QA-FECHAMENTO-LOTE-03.md](QA-FECHAMENTO-LOTE-03.md).

## Rotas de página

| Rota | Uso |
|---|---|
| `/` | Login por e-mail e senha e redirecionamento de sessão existente. |
| `/dashboard` | Galeria dos projetos da conta, com carregamento, erro, estado vazio e logout. |
| `/projects/new` | Planta manual, revisão 3D, áreas restritas opcionais, montagem da fila, nome e salvamento. |
| `/projects/[id]` | Leitura do projeto salvo, dados métricos, cena 3D e acesso à edição. |
| `/projects/[id]/edit` | Carrega a cena salva e permite editar e salvar uma nova revisão. |
| `/xr-check` | Diagnóstico WebXR experimental isolado, sem integração/persistência de projetos; ver XR-PENDENCIAS.md. |

As páginas ficam em `apps/web/app`; os fluxos e estados de interface ficam em
`apps/web/components`. A cena compartilhada é um único `ProjectScene` tipado pelos
contratos do repositório. A interface não guarda projetos em `localStorage`.

## Execução local e proxy

O workspace `@testafila/web` oferece `dev`, `build`, `start` e `typecheck`. `dev` e
`start` escutam na porta 3000 e no host `0.0.0.0`. A API Nest usada no QA local
escuta em `127.0.0.1:3001` por padrão (`HOST` e `PORT` podem ser definidos no
ambiente do processo Nest). Para iniciar os dois processos em desenvolvimento, use
`npm run dev --workspace @testafila/api` e `npm run dev --workspace @testafila/web`.

O cliente chama caminhos de mesma origem, como `/api/projects`. A rota catch-all
`apps/web/app/api/[...path]/route.ts` encaminha método, caminho `/api` e query string
para o Nest. `API_BASE_URL` é lida exclusivamente no servidor Next e, se omitida,
usa `http://127.0.0.1:3001`. A variável deve apontar para a origem/base da API sem
acrescentar `/api`; não existe `NEXT_PUBLIC_API_BASE_URL`.
Quando necessário, configure `API_BASE_URL` em `apps/web/.env.local` ou no ambiente
do processo Next. Arquivos `.env*` locais são ignorados pelo Git; não inclua segredos
nem exponha essa variável ao bundle do navegador.

O proxy preserva `Origin`, encaminha cookies de sessão e retransmite `Set-Cookie`,
status e corpo. Remove `Host`, headers hop-by-hop, os headers nomeados em `Connection`
e headers `Forwarded`/`X-Forwarded-*` recebidos. As respostas são `no-store`; o
upstream tem timeout de 10 segundos e falha de conexão, timeout ou leitura retorna
502 com mensagem neutra. O proxy executa no runtime Node.js.

## Autenticação e dados

O formulário de login envia as credenciais informadas pelo usuário ao endpoint real
`POST /api/auth/sign-in/email`; consulta a sessão por `GET /api/auth/get-session` e
encerra por `POST /api/auth/sign-out`. O frontend não inclui conta, senha ou bypass
fixos. O acesso depende de uma conta provisionada pela equipe; cadastro público e
recuperação de senha não fazem parte do fluxo atual. O cookie HttpOnly é tratado pela
API e pelo proxy, não por armazenamento local no navegador.

A galeria usa `GET /api/projects`. A abertura e edição usam `GET /api/projects/:id`.
A criação envia `POST /api/projects` com `expectedRevision: null`; a edição usa
`PATCH /api/projects/:id` com a revisão carregada como `expectedRevision`. A API
mantém a autoridade sobre autenticação, propriedade, validação e persistência.

## Planta manual e montagem

Em `/projects/new`, o usuário informa altura e escolhe uma planta retangular por
largura/profundidade ou um polígono por coordenadas X/Z. As coordenadas são metros
medidos e editáveis; a aplicação não converte pixels da câmera em dimensões. A
validação acontece antes da revisão. Conferências de medida ficam vazias até haver
uma segunda medida observada; nenhum erro é inventado automaticamente.

Após revisar a visualização 3D, o usuário pode adicionar áreas restritas ou continuar
sem áreas. A montagem tem três ferramentas: Poste, Fita e Pessoas. O percurso é uma
entidade própria. O editor reutiliza a mesma cena durante as etapas; undo/redo e as
validações vêm do domínio compartilhado. Depois de nomear, o cliente cria o projeto
na API. Projeto salvo pode ser aberto, recarregado e editado na rota indicada acima.

## Estados de resposta e recuperação

- **Carregamento, vazio e erro:** o login verifica a sessão; a galeria informa espera,
  falha e ausência de projetos; abertura e edição mostram carregamento e erro de leitura.
- **401:** páginas protegidas redirecionam para login. Se o salvamento da criação ou
  edição expira, a interface pede reautenticação e tenta novamente com o nome/planta
  atuais ou o rascunho mais recente. A sessão não é simulada.
- **400:** a interface apresenta a mensagem de validação retornada pela API e mantém
  o documento aberto para correção.
- **409:** no salvamento inicial, nenhuma navegação destrutiva ocorre e as edições
  permanecem na tela. Na edição de projeto existente, o rascunho fica aberto com
  ações explícitas para mantê-lo ou confirmar o descarte e carregar a versão atual;
  a revisão nunca é avançada automaticamente.
- **413:** criação e edição mantêm os dados na tela e informam que o documento excedeu
  o limite aceito, para que o usuário reduza itens antes de tentar novamente.
- **Rede/502/timeout:** chamadas de API rejeitadas mantêm planta, nome e/ou montagem
  para nova tentativa. A mensagem do proxy é neutra; o cliente não descarta o rascunho.

## Apresentação e limites atuais

A interface segue os tokens e a linguagem editorial de slide-cintia, com layout
mobile-first e alvos de toque de pelo menos 44 px. O QA final verificou no DOM viewports
de 390 px e 320 px sem overflow horizontal e sem alvos visíveis abaixo de 44 px. Isso
não é uma certificação visual ou de uso prolongado: a captura do portal não produziu
uma imagem utilizável, e a legibilidade dos rótulos 3D ainda pede revisão humana.

A visualização 3D apresenta a geometria documentada em metros; ela não mede o espaço
real. Câmera, mapeamento por câmera, alinhamento de sessão WebXR e inserção AR não
estão integrados nesta aplicação. Uma cena salva que indique origem XR não significa
que o fluxo de captura esteja disponível. O suporte, deriva, realinhamento e precisão
AR dependem de spike e testes em aparelhos reais; o modo manual permanece a alternativa
funcional.

Typecheck e build Next foram aprovados no QA final registrado nos documentos de QA.
Nesta atualização, o typecheck também passou. Nenhum build foi iniciado pelo frontend;
a integração e o build final ficam com o coordenador.
