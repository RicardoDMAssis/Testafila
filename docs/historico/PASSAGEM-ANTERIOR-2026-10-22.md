# TestaFila — passagem completa para o novo coordenador

Data da passagem: 22/10/2026. Idioma de trabalho com o usuário: português do Brasil.

## 1. Missão e instrução mais recente

O usuário chamou outro agente para assumir porque a conversa antiga apresentava problemas
de vínculo entre aplicativos/terminais. Pedido final: “anota tudo que eu te passei em um
.md pra ele ler e virar o novo coordenador. n deixe NENHUM detalhe de fora”.

Você deve assumir a coordenação do desenvolvimento funcional do MVP TestaFila descrito
integralmente abaixo, mantendo fases, dependências e divisão de arquivos sem sobreposição.
Não reduzir o trabalho a um protótipo de telas. Não pedir novamente o fluxo de uso:
o usuário já o forneceu por completo.

**Todos os agentes devem ser chamados exclusivamente pelo canvas do Maestri.** O usuário
corrigiu explicitamente o coordenador anterior: “é pra vc chamar pelo canvas do maestri
todos”. Não usar spawn_agent/collaboration interno como substituto. Não usar Orca.

## 2. Workspace, projeto e materiais

- Raiz: `C:\Users\joaot\OneDrive\Área de Trabalho\testafila`.
- Shell usado: PowerShell, Windows. Fuso: America/Sao_Paulo.
- Repositório de código: subpasta `Testafila/`, com `.git` próprio; a raiz do workspace
  não foi identificada como repositório Git.
- Último commit observado: `70745cc Remove PDF files from repository and add to .gitignore`.
- PDFs na raiz, todos lidos pelo coordenador anterior:
  - `One_Page_Concept_TestaFila_UnicaPagina.pdf` (92.663 bytes).
  - `Plano_de_Projeto - TestaFila.pdf` (157.626 bytes).
  - `XR_Design_Document_TestaFila.pdf` (136.105 bytes).
- Pasta de referência visual adicionada pelo usuário: `slide-cintia/`.
  Contém `DESIGN.md`, `styles.css`, `index.html`, `apresentacao_pitch_testafila.html`,
  `app.js`, `simulation.js`, `README.md`, `roteiro.md`, `SLIDES_PITCH_TESTAFILA.md`,
  `serve.cjs`, `test-model.cjs`, `verify.cjs`, `qa/`, `original/`, cópias dos três PDFs
  e um instalador antigo limitado a MengTo. Não confundir esse instalador antigo com
  o instalador atualizado que está na raiz do workspace.

O pedido inicial foi ler a skill maestri, ler os três PDFs, comparar com o que já existia,
informar o que faltava e preparar-se para receber o fluxo de uso. Depois o usuário
enviou a especificação completa e pediu que o coordenador organizasse tudo por fases.

## 3. Escolha de agentes/modelos — pedido do usuário

Texto original: “Quero que pras features, vc chame um luna medium e agys dependendo do
nivel da task(tasksmasi dificeis o flash 3.8 high, mais faceis o 3.8 low)”.

Interpretação operacional adotada, ainda sujeita a conferir nomes reais de presets:
- Luna Medium para tarefas médias/componentes e apoio delimitado.
- Agys/Flash 3.8 High para tarefas difíceis: geometria, autenticação/persistência,
  rastreamento e alinhamento espacial.
- Agys/Flash 3.8 Low para tarefas fáceis e ajustes delimitados.
- Coordenador organiza arquitetura, contratos, dependências, integração e revisão.

Nunca afirmar que um preset/modelo foi usado sem conferir. Nenhum preset de Agys/Flash
foi listado com sucesso durante a conversa antiga. Não substituir silenciosamente.

Um Luna Medium (`gpt-6-luna`, esforço medium) chegou a ser chamado pelo recurso interno
em uma revisão somente leitura. Isso ocorreu ANTES da correção do usuário exigindo canvas.
Ele terminou; não há implementação dele nem agente interno trabalhando. Não repetir.
Os achados estão na seção de pendências e nos anexos desta passagem.

## 4. Skills solicitadas, instalação e estado atual

O usuário pediu instalação global dos seguintes três repositórios/packs de design:
1. https://github.com/MengTo/Skills
2. https://github.com/codeswithroh/tastemaker
3. https://github.com/Owl-Listener/designer-skills

Comandos específicos de 3D fornecidos pelo usuário:

```powershell
npx skills add https://github.com/openai/plugins --skill react-three-fiber-game
npx skills add https://github.com/emalorenzo/three-agent-skills --skill r3f-best-practices
npx skills add https://github.com/openai/plugins --skill web-3d-asset-pipeline
```

**A instalação global terminou com sucesso na última execução feita pelo usuário.**
Destino: `C:\Users\joaot\.agents\skills`.
Os packs de MengTo e Owl-Listener, tastemaker e as três skills 3D estão instalados.
O catálogo de skills da sessão passou a mostrar inclusive react-three-fiber-game e
web-3d-asset-pipeline. Não voltar a dizer que as skills estão pendentes.

Artefatos de instalação:
- `instalar-skills-global.ps1` na raiz do workspace (criado/ajustado nesta conversa).
- `skills-install-manifest.json` na raiz, produzido pelo usuário após sucesso.
  Contém Repo, Ref (SHA), Path, Name e Exists por item. Exists representa o estado
  ANTES daquela execução; portanto False nas duas últimas skills NÃO significa que
  continuam ausentes após instalação. A verificação final do script confirmou ambas.
- Instalador oficial usado por trás: `~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py`.
- O script descobre árvore GitHub, fixa SHA, preserva diretórios existentes e verifica
  SKILL.md ao final. Packs são coleções de muitas skills, não três arquivos isolados.
- Não segue os outros repositórios agregados no marketplace Owl-Listener: somente o
  repositório de design explicitamente pedido.
- Para openai/plugins foi adicionado `--method git` (sparse checkout), porque o ZIP
  completo falhou em um caminho longo de um plugin que nem era solicitado.
- Erro anterior: FileNotFoundError na extração de
  `plugins/creative-production/skills/produce/helpers/moodboards/assets/mood-board-app/components/empty-state-grid/assets/bg-make-logo-from-scratch-01.svg`.
  Não tratar como skill inexistente; o problema de extração foi contornado e instalado.
- O script foi validado sintaticamente com o parser de PowerShell.
- Saída de acentos no PowerShell do usuário teve mojibake (ex.: “instalaÃ§Ã£o”);
  isso não impediu a instalação. Os documentos foram escritos em UTF-8.

Uso esperado: ler o SKILL.md pertinente antes da tarefa e mandar cada agente ler
as skills relevantes. Não carregar centenas em toda tarefa. A referência visual do
usuário prevalece sobre sugestões conflitantes de paletas, gradientes e efeitos.
Skills disponíveis globalmente não provam descoberta automática por todos os CLIs;
confirmar no ambiente dos agentes ou passar os caminhos absolutos para leitura.

Skills particularmente pertinentes:
- `editorial-tech`, `design-first-ui-prompting`, `tastemaker`.
- Pack Owl: tokens, responsividade, formulários, estados, interação e revisão.
- `r3f-best-practices`, `react-three-fiber-game`, `web-3d-asset-pipeline`.
- `maestri`, `maestri-manager`, e demais skills Maestri conforme necessidade.

## 5. Identidade e design a seguir

Instrução explícita do usuário: “na raiz agora coloquei a pasta slide-cintia - siga o
design de la. use essas skills de design pro front. use essas pro 3d”.

Direção confirmada em slide-cintia/DESIGN.md e styles.css:
- Marfim, verde fechado, regras finas, composição editorial, espaço e hierarquia clara.
- Sem gradientes, neon, emojis decorativos, depoimentos ou resultados inventados.
- Sans-serif com trechos em Georgia itálica; rótulos utilitários/medidas em monoespaçada.
- Tokens: fundo `#f5f4ef`; texto `#242d29`; secundário `#606963`; verde `#214b40`;
  borda `#d8dcd4`; superfície `#e8ece4`; alerta `#9b3f31`.
- Fontes: Segoe UI/Arial, Georgia/Times nos destaques, Consolas/Cascadia Code nas medidas.
- Aplicar a linguagem ao produto mobile-first; não copiar a navegação de slides.
- Logo definitiva e demais arquivos da marca podem ser fornecidos posteriormente;
  não inventar uma nova identidade definitiva. Marca textual provisória é aceitável.

A apresentação tem uma simulação Canvas 2D/axonométrica ilustrativa, não AR ou 3D real:
hall 10×8m, três traçados, deslocamento lateral, espaçamento/ocupação, planta e grid de
um metro. Ela serve de referência visual/conceitual, não prova funcionalidades do MVP.
Seu README registra que a validação visual automatizada anterior foi bloqueada (Edge
EPERM/sem navegador), e não existem screenshots aprovados conhecidos nesta passagem.

## 6. O que já havia no projeto e o que foi verificado

Aplicação existente: Vite + JavaScript ES Modules + Three.js.
package.json observado:
- name testafila-webar; versão 1.0.0; private true; type module.
- Dependência three ^0.170.0.
- Dev dependencies vite ^6.0.0 e @vitejs/plugin-basic-ssl ^1.1.0.
- scripts dev: vite --host; build: vite build; preview: vite preview --host.

Arquivos principais: src/main.js, src/geometry.js, src/arObjects.js, src/style.css,
index.html, vite.config.js, README.md, package-lock.json.

Implementado no código antigo:
- Cena/simulador Three.js com OrbitControls, piso/grid e retículo.
- Inserção de postes, fitas automáticas entre postes consecutivos e medidas por trecho.
- Zonas restritas poligonais semitransparentes (35%).
- Cálculo XZ de extensão, capacidade com densidade padrão 0,6m/pessoa, vazão/espera.
- Detecção linha/polígono e alertas verde/vermelho, HUD e vibração quando disponível.
- Código de sessão WebXR immersive-ar com hit-test e dom-overlay opcional.
- Câmera via getUserMedia e heurística de giroscópio/altura como alternativa aproximada.
- Preset serpentina (chamado “caracol”), cenário demonstrativo 18m/30 pessoas e colisão
  intencional no terceiro segmento; pontos fazem trechos 6m + 3m + 9m, não 3×6m apesar
  de um comentário incorreto no código.
- Modal de relatório, ajustes de densidade, vazão, altura, comparação com trena,
  exportação JSON e botões de limpar/desfazer.

Problemas/lacunas identificados:
- “AR universal” é apenas câmera+projeção aproximada, sem tracking 6DoF equivalente
  a WebXR; não vender como medida real confiável nem suporte universal.
- Retículo fallback é recalculado por raycast no plano artificial Y=0; o movimento
  heurístico do giroscópio não comprova calibração/precisão espacial.
- Botão de inserir no retículo não possui guard robusto de posição XR válida.
- Desfazer não usa state.history; prioriza retirar vértice ativo/poste/zona e pode
  desfazer algo diferente da última ação; presets/fechamento não são revertidos de fato.
- Não há selecionar/mover/remover elementos arbitrários de forma completa.
- Opção ABNT desenha faixa de 0,90m, não valida largura livre/conformidade normativa.
- `segmentsIntersectXZ` usa orientação estrita; sobreposição colinear retorna false.
  Verificação real via Node: AB (0,0)-(2,0), CD (1,0)-(3,0) => false.
- Verificação real via Node: segmento 18m => totalLength 18, capacity 30,
  marginError 2, estimatedWaitMinutes 8 com vazão padrão 4/min.
- Margem ±5% da capacidade é fórmula arbitrária do código, não erro físico medido.
- Rebuild remove meshes sem dispose observado; considerar memória/performance.
- Não existe ainda ambiente/perímetro de paredes mapeado, caminho independente,
  pessoas 3D reais, autenticação, dashboard persistente, banco, salvar/reabrir completo,
  importação ou realinhamento de projeto salvo.

Não foi feito build, instalação npm ou teste completo de navegador/celular nesta
conversa. Nenhuma alegação de precisão AR foi validada em aparelho real.

## 7. Documentos dos PDFs — contexto acadêmico preservado

Projeto Checa Fila (TestaFila), Projeto Aplicado V — Realidade Virtual e Aumentada,
semestre 2026.2, professora Profª. Cintia/Cíntia da Costa Souza.
Equipe: João Paulo (WebAR/3D), Lucas Vinícius (lógica/geometria e UX/UI),
Ricardo Daniel (PM, QA e documentação).

Público: organizadores de eventos, produtores culturais, gestores de feiras/shows,
gerentes de bancos/comércio e técnicos de segurança/brigadistas. Planejamento no local
via smartphone, sem app store, com medidas/capacidade e prevenção de obstrução de rotas.

Fluxo original dos PDFs: abrir URL HTTPS -> câmera/WebXR -> mapear piso -> zonas
restritas -> postes -> metragem/capacidade/alertas -> ajustar/limpar/desfazer.
Cenários: show com 18m e 30 pessoas, terceiro segmento cruzando corredor; hall comercial
com fila caracol/serpentina sem bloquear caixas eletrônicos.

Metas: erro <=5% frente a trena em 20m; colisão <200ms; estabilidade/FPS em smartphone
intermediário; SUS com cinco usuários reais do público-alvo; documentar falhas no Trello.
Kanban: Backlog, A Fazer, Em Desenvolvimento, Em Teste/QA, Concluído. Comunicação
original da equipe: WhatsApp/Discord, alinhamento duas vezes por semana, decisões por
consenso com PM decidindo impasses de escopo em função do prazo.

Marcos acadêmicos: conceito/plano/XRD/Trello até 15/10; protótipo até 05/11;
prévia funcional até 26/11; entrega final/documentação/apresentação até 17/12/2026.
Entrega: produto online mobile estável, código/assets organizados no GitHub,
documentação alinhada, cartões MVP concluídos e evidência de precisão.

Divergências: plano cita AR Foundation em uma linha, enquanto arquitetura geral é
WebXR; risco cita ±10%, enquanto aceitação define <=5%. Adotar meta <=5% sem afirmar
que foi alcançada. Plano prevê AR.js com marcadores como mitigação de incompatibilidade
e ajuste manual de plano quando sensor falhar. Especificação NOVA abaixo é a referência
principal e amplia o escopo: os PDFs originais excluíam banco/colaboração multiusuário,
mas agora autenticação e persistência são requisitos expressos do usuário.

## 8. Arquitetura e arquivos preparados, sem implementação nova

Criados no repositório Testafila:
- `AGENTS.md` — regras de coordenação/design/escopo.
- `docs/ARCHITECTURE.md` — decisões iniciais (anexado integralmente adiante).
- `docs/DELIVERY.md` — fases/donos/dependências/aceite (anexado integralmente).
- `docs/SKILLS.md` — instruções de instalação/uso (tem estado antigo, ver aviso abaixo).
- `contracts/project.ts` — tipos TS de referência; não integrados ao app.

Criados na raiz: instalador global e este documento. Manifesto global foi produzido
pela execução do usuário. A pasta tmp surgiu em tentativas de instalar pypdf/uv local.

Último git status observado em Testafila:
```text
?? AGENTS.md
?? contracts/
?? docs/
```
Não houve commit, push, deploy, migração Next.js, banco ou feature nova integrada.
Nenhum implementador do canvas chegou a ser recrutado. O protótipo original permanece.

IMPORTANTE: docs/DELIVERY.md, docs/SKILLS.md e slide-cintia/DESIGN.md têm trechos de
status antigos dizendo “skills não instaladas”/“MAESTRI_PIPE ausente”. Esta passagem
é posterior: skills INSTALADAS; conexão CLI foi testada com dados manuais e funcionou,
mas o terminal usado ainda não tinha permissão Maestro. Atualizar esses status antes
de usá-los como fonte operacional; não alterar o registro histórico como se nada falhou.

Decisões de arquitetura propostas pelo coordenador anterior, NÃO exigências literais
do usuário: Next App Router, PostgreSQL+Prisma, biblioteca de auth mantida (preferência
inicial Better Auth a validar), sessões HttpOnly e isolamento por proprietário;
domínio puro separado de React/Three; R3F cliente; documento JSONB versionado/revision;
percurso de pessoas separado das fitas; transformação rígida XR apenas por sessão;
conta inicial provisionada administrativamente se cadastro público não for requerido.
Novo coordenador pode refinar com evidência e consistência com a especificação.

Achados da revisão Luna, ainda NÃO aplicados ao contrato:
1. SessionAlignment tem maxResidualMeters, mas não diagnósticos por correspondência,
   tolerância aprovada e resultados de conferência por dimensão. Definir derivação
   determinística ou acrescentar campos para UI/validação não divergirem.
2. MeasurementEvidence.observedErrorPercent global não define agregação de vários
   checks. Especificar erro por medição versus agregado e significado do percentual.

## 9. Maestri — regras e histórico completo do problema de conexão

O usuário quer que VOCÊ seja o coordenador dentro do Maestri. Não mandar ele reenviar
o fluxo, nem afirmar que ele está fora do aplicativo só porque faltou variável no
processo de ferramenta. Ele informou estar dentro do Maestri desde o começo.

No ambiente de ferramentas anterior, nenhuma MAESTRI_* era herdada. O CLI não estava
no PATH, mas foi localizado em:
`C:\Users\joaot\AppData\Local\Programs\Maestri\resources\cli\maestri.exe`.
Fallback documentado: variável MAESTRI_CLI.

O sandbox tinha escrita somente no workspace e temporários, rede desabilitada
(`CODEX_SANDBOX_NETWORK_DISABLED=1`), proxies HTTP/HTTPS/Git em `http://127.0.0.1:9`,
e aprovação de escalada indisponível. Não tentar contornar sandbox, editar ACLs,
remover proxies ou delegar uma ação bloqueada para escapar da restrição.
O usuário instalou as skills no PowerShell normal e isso resolveu a instalação.
Get-CimInstance Win32_Process retornou acesso negado; não usar essa falha como prova
de ausência de aplicativo. Era possível enumerar nomes de pipes.

Diagnóstico do usuário no PowerShell do canvas: RestrictedToken=no, CreateFile OK,
HTTP /list status 200. Diagnóstico desta ferramenta: RestrictedToken=yes, mas após
passar variáveis fornecidas pelo usuário, CreateFile também OK e HTTP /list 200.
Portanto não era necessário alterar segurança do pipe. CLI versão observada: 1bf806c5.

Histórico de IDs (NÃO assumir que os antigos continuam válidos):
- Pipe inicial `\\.\pipe\maestri-5d1fd066`.
- Terminal inicial `d870bc2e-4519-42d3-ba1f-3feb2a3c5717`: list funcionou e identificou
  “Shell”, sem conectados, mas preset list/role list retornaram “This terminal is not
  the Maestro. Toggle Maestro on the terminal in the canvas to unlock this command.”
- Usuário disse que já estava Maestro e desligou/religou. Novo ID fornecido:
  `01048ccf-f789-43ee-be1e-5e9957273161`. Com o pipe anterior, retornou “No active
  workspace”/“Manager terminal not found”. Faltava o conjunto completo atualizado.
- Usuário relatou aviso “aberto em outro app”, disse que naquele momento de fato abriu
  no VS Code mas o aviso já existia antes, apagou terminal antigo e criou outro.
  A causa desse aviso NÃO foi determinada. Não afirmar que apagar terminal libera
  sessão/conversa ou que o lock foi resolvido.
- Pipe atual na última verificação: `\\.\pipe\maestri-4054327e`.
- Último conjunto completo enviado pelo usuário:

```powershell
$env:MAESTRI_DATA_DIR = 'C:\Users\joaot\.maestri'
$env:MAESTRI_PIPE = '\\.\pipe\maestri-4054327e'
$env:MAESTRI_CLI = 'C:\Users\joaot\AppData\Local\Programs\Maestri\resources\cli\maestri.exe'
$env:MAESTRI_WORKSPACE_ID = '69ac0759-1053-4ec2-b30f-89f75abcb495'
$env:MAESTRI_TERMINAL_ID = '5b7abb59-27ba-40c9-8761-555494034130'
& $env:MAESTRI_CLI list
```

Resultado verificado: You name “Shell”, sem agentes/notas/portais conectados.
preset list/role list continuaram dizendo que ESTE terminal não era Maestro.
O usuário agora chamou outro agente; usar prioritariamente as variáveis nativas do NOVO
terminal/coordenador, não se passar pelo terminal Shell antigo. O trecho acima é só
registro para diagnóstico; obter dados atuais se mudou daemon/terminal.

Procedimento da skill:
1. Ler maestri e maestri-manager. Sempre list antes de perguntar/recrutar.
2. debug primeiro se comando falhar por conexão/pipe, antes de adivinhar causa.
3. Listar presets/roles antes de usar flags; não inventar nomes ou parâmetros.
4. Reutilizar agente com papel adequado; só recrutar quando faltar papel necessário.
5. Tarefas independentes podem ser ask --batch; cada agente tem escopo de arquivos.
6. Toda delegação termina pedindo ask back: agente responde com
   `maestri ask "NOME EXATO DO COORDENADOR" "resultado completo"`.
   O nome vem de You em maestri list; endereços entre workspaces incluem @ Workspace.
7. Timeout não é motivo para reenviar/interromper; usar check e aguardar.
8. Não editar arquivos enquanto outro agente os estiver modificando.
9. Só criar band se o usuário pedir uma band; ele pediu equipe, não band.
10. Não usar notify sem pedido explícito de notificação. Não apagar notas sem pedido.
11. Se usar floors, ler maestri-workspace e manter status; não criar floors à toa.

## 10. Próximos passos para quem assume

1. Confirmar conexão/identidade Maestro do seu próprio terminal usando list/preset list.
2. Ler as skills globais de coordenação e os documentos/contratos já preparados.
3. Reconhecer que as skills estão instaladas e corrigir status antigo dos documentos.
4. Refinar os dois pontos da revisão de contratos e fechar arquitetura antes de código.
5. Conferir presets Luna/Agys/Flash e criar/reutilizar equipe PELO CANVAS.
6. Primeiro lote: fundação Next/TS/tokens; domínio métrico puro e testes; UI em caminhos
   separados; spike XR isolado. Um único responsável por package/lockfile/contratos.
7. Implementar módulos pela sequência abaixo, com evidências reais; não afirmar MVP
   pronto até persistência, interações e reabertura funcionarem de fato.

## 11. Especificação integral fornecida pelo usuário

O texto a seguir preserva os requisitos do usuário; deve ser a referência principal.

# TestaFila — Especificação do MVP

## 1. Visão geral do produto

O **TestaFila** é uma aplicação para planejar, visualizar e simular filas em ambientes físicos reais utilizando mapeamento espacial, realidade aumentada (AR) e visualização 3D.

O objetivo é permitir que qualquer usuário consiga:

1. Mapear um ambiente físico e obter suas dimensões em metros.
2. Criar uma representação virtual desse ambiente.
3. Definir áreas restritas onde não poderão existir filas.
4. Posicionar postes, fitas de demarcação e pessoas.
5. Simular diferentes capacidades e configurações de fila.
6. Alternar entre visualização pela câmera e visualização 3D.
7. Salvar os projetos e visualizá-los posteriormente.

A aplicação deve priorizar uma experiência **extremamente simples, intuitiva, rápida e visual**. O usuário não deve precisar entender modelagem 3D para utilizar o produto.

## 2. Stack e diretrizes técnicas

- **Frontend:** Next.js com React e TypeScript.
- **Interface:** responsiva, mobile-first, com foco no uso da câmera de smartphones.
- **Estilização:** Tailwind CSS ou alternativa equivalente.
- **Ambiente 3D:** Three.js / React Three Fiber ou tecnologia equivalente.
- **Realidade aumentada:** avaliar WebXR e as capacidades de rastreamento espacial dos dispositivos.
- **Backend:** autenticação, banco de dados e persistência de projetos.
- **Identidade visual:** será fornecida posteriormente em uma apresentação, juntamente com logo, cores, tipografia e demais elementos da marca.

**Requisito técnico essencial:** o ambiente virtual precisa usar medidas reais em metros. O sistema não deve simplesmente converter pixels da câmera em metros por estimativa arbitrária.

Antes de implementar o mapeamento, validar a viabilidade da medição espacial no navegador e nos dispositivos-alvo. Caso o dispositivo não ofereça recursos adequados, disponibilizar um mecanismo de calibração ou medição manual, deixando explícito quando as dimensões forem estimadas.

Se a captura espacial em realidade aumentada não for viável de forma confiável usando apenas Next.js no navegador, avaliar uma integração nativa ou abordagem híbrida, preservando o Next.js para a interface principal.

## 3. Fluxo principal da aplicação

### Etapa 1 — Tela de login

A primeira tela deve apresentar a identidade visual do TestaFila.

Elementos:
- Logo do TestaFila.
- Campo de e-mail.
- Campo de senha.
- Botão para entrar.
- Validação dos campos e mensagens de erro.

Após a autenticação, o usuário é direcionado ao dashboard.

### Etapa 2 — Dashboard

O dashboard deve ser minimalista, contendo duas operações principais:

**Ação 1: Criar nova fila**

Inicia o processo de mapeamento e planejamento de um novo ambiente.

**Ação 2: Visualizar filas anteriores**

Exibe os projetos já criados e salvos.

Cada projeto salvo deve apresentar:
- Nome da fila/projeto.
- Data de criação ou última atualização.
- Prévia visual 3D do ambiente e da fila, quando disponível.
- Botão para abrir a simulação.

A navegação deve ser direta, sem menus excessivamente complexos.

## 4. Criação de nova fila

A criação será organizada como um fluxo guiado, com etapas claras.

### Etapa 4.1 — Mapeamento espacial do ambiente

Ao clicar em **Criar nova fila**, o sistema solicita acesso à câmera.

O primeiro objetivo é criar um modelo espacial do ambiente físico real.

**Experiência desejada:**
1. O usuário abre a câmera.
2. A interface orienta a identificar a primeira quina do ambiente.
3. O usuário aponta para uma quina e marca sua posição.
4. Repete o processo, seguindo as quinas e os limites das paredes.
5. O sistema conecta os pontos para formar o perímetro do ambiente.
6. O mapeamento é finalizado quando o perímetro estiver fechado.

O fluxo deve ter orientações visuais curtas, como:
- "Aponte para a primeira quina."
- "Marque a próxima quina."
- "Continue até completar o ambiente."
- "Finalize o mapeamento."

**Requisitos funcionais:**
- Permitir marcar, desfazer e corrigir pontos.
- Conectar automaticamente os pontos do perímetro.
- Permitir verificar e corrigir medidas.
- Armazenar coordenadas em uma escala espacial baseada em metros.
- Gerar uma representação virtual proporcional ao ambiente real.
- Exibir dimensões estimadas ou medidas das paredes.
- Permitir confirmar o mapeamento antes de continuar.

O objetivo do MVP não é produzir uma reconstrução fotográfica detalhada. Inicialmente, basta criar um **modelo geométrico fiel às dimensões do espaço**, com piso e paredes simplificados.

### Etapa 4.2 — Visualização do ambiente mapeado

Após concluir o mapeamento, a aplicação apresenta o espaço em um visualizador 3D.

O usuário deve conseguir:
- Visualizar o ambiente de cima.
- Girar a câmera virtual.
- Aplicar zoom.
- Alterar a perspectiva.
- Ver um grid com medidas em metros.
- Conferir a proporção e o tamanho do espaço.

Essa representação será a base do planejamento da fila.

## 5. Definição de áreas restritas

Antes de posicionar os elementos da fila, o sistema pergunta:

**"Você deseja adicionar alguma área restrita?"**

Opções: **Adicionar área restrita** ou **Continuar sem áreas restritas**.

As áreas restritas devem ser criadas diretamente no visualizador espacial 3D, e não sobre a imagem da câmera.

**Interação desejada:**
1. O usuário seleciona "Adicionar área restrita".
2. Escolhe ou desenha uma região dentro da planta virtual.
3. Arrasta, redimensiona e posiciona essa região.
4. Visualiza suas dimensões usando o grid métrico.
5. Confirma a área restrita.

Permitir múltiplas regiões restritas.

Exemplos de aplicação: balcões, corredores bloqueados, mobiliário, espaços reservados e áreas onde pessoas não podem permanecer.

Essas regiões devem aparecer visualmente destacadas e ser respeitadas pelo planejamento da fila, impedindo o posicionamento de elementos dentro delas.

Ao concluir, o usuário avança para a montagem da fila.

## 6. Planejamento da fila em realidade aumentada

Essa é a principal funcionalidade do produto.

Após mapear o ambiente e definir as áreas restritas, o usuário acessa uma interface de planejamento com câmera.

A câmera deve exibir os elementos virtuais alinhados ao espaço físico, sempre que o dispositivo oferecer os recursos necessários.

### Painel principal de ferramentas

A interface precisa ter apenas três ferramentas principais:

**1. Poste de fila**

Permite posicionar postes virtuais no ambiente. Deve ser possível adicionar, selecionar, mover e remover postes.

**2. Fita de demarcação**

Permite conectar postes com fitas virtuais, simulando a organização física das filas. O usuário seleciona os postes que deseja conectar. A fita deve aparecer no espaço entre eles, respeitando uma altura padronizada.

**3. Pessoas**

Permite adicionar modelos humanos virtuais para simular a ocupação da fila.

O painel pode ficar na parte inferior ou lateral da tela, priorizando a experiência mobile.

### Sequência recomendada de montagem

**Passo 1 — Posicionar os postes**

O usuário distribui os postes no espaço, formando os caminhos da fila.

**Passo 2 — Conectar as fitas**

O usuário conecta os postes para estabelecer a delimitação da fila.

**Passo 3 — Adicionar pessoas**

O usuário adiciona pessoas virtuais para visualizar a ocupação do espaço e a capacidade da fila.

Essa sequência deve ser sugerida pela interface, sem criar restrições desnecessárias para correções posteriores.

## 7. Simulação e preenchimento de pessoas

O preenchimento da fila precisa ser rápido e intuitivo.

Quando a primeira pessoa for posicionada, o sistema deve facilitar a inserção das próximas.

**Funcionalidades obrigatórias:**
- Adicionar uma pessoa individualmente.
- Adicionar outra pessoa com um único toque.
- Preencher automaticamente a fila.
- Alterar o espaçamento entre as pessoas.
- Remover pessoas.
- Mostrar a quantidade total de pessoas simuladas.

O espaçamento deve ser configurado em metros, por exemplo: 0,5 m, 0,8 m ou 1,0 m.

Ao alterar o espaçamento, a aplicação deve atualizar a distribuição das pessoas e recalcular a capacidade simulada, respeitando o caminho definido e os limites disponíveis.

O botão **Preencher fila** deve posicionar automaticamente o máximo de pessoas possível dentro do trajeto configurado, respeitando o espaçamento e evitando áreas restritas.

Para isso, será necessário representar o percurso da fila de forma estruturada, permitindo calcular posições válidas ao longo do caminho.

As pessoas poderão ser inicialmente modelos 3D simplificados, desde que mantenham dimensões humanas proporcionais ao ambiente.

## 8. Alternância entre câmera e ambiente 3D

Durante todo o planejamento, o usuário deve conseguir alternar entre duas visualizações do mesmo projeto.

### Modo 1 — Câmera / realidade aumentada

Exibe a câmera do dispositivo com postes, fitas e pessoas virtuais posicionados no espaço real.

### Modo 2 — Ambiente 3D

Exibe uma representação virtual da mesma cena, sem necessidade de usar a imagem da câmera.

Nesse modo, o usuário poderá:
- Visualizar a fila de cima.
- Girar livremente a perspectiva.
- Aplicar zoom.
- Analisar a disposição dos postes.
- Ver as fitas e as pessoas.
- Identificar problemas de circulação.
- Conferir áreas restritas e proporções.

**Requisito fundamental:** os dois modos devem representar os mesmos dados.

Alterações realizadas em qualquer modo devem refletir no mesmo projeto espacial. Não devem existir duas filas independentes.

As coordenadas de postes, pessoas, fitas e áreas restritas devem ser compartilhadas.

## 9. Finalização e salvamento

Quando o usuário terminar o planejamento, haverá uma ação principal:

**"Finalizar e salvar fila"**

O sistema solicitará um nome para o projeto.

Deverão ser armazenados:
- Nome e identificação do projeto.
- Usuário proprietário.
- Data de criação e atualização.
- Geometria e dimensões do ambiente.
- Coordenadas dos pontos e paredes mapeados.
- Áreas restritas e dimensões.
- Posições dos postes.
- Conexões das fitas.
- Caminho da fila.
- Posições e quantidade de pessoas.
- Espaçamento configurado.
- Configuração necessária para reconstruir a cena 3D.

As informações precisam ser persistidas no banco de dados, permitindo reconstruir a simulação posteriormente.

Após salvar, apresentar uma confirmação e a opção de voltar ao dashboard ou visualizar o projeto.

## 10. Visualização de filas anteriores

Ao acessar **Visualizar filas anteriores**, o usuário encontrará uma galeria dos projetos salvos.

Cada projeto terá uma prévia 3D da simulação.

Ao abrir um projeto, o sistema deverá reconstruir automaticamente o ambiente e exibir:
- Planta do espaço.
- Áreas restritas.
- Postes.
- Fitas.
- Pessoas.
- Dimensões.
- Quantidade de pessoas.
- Espaçamento configurado.

O usuário deverá conseguir explorar o modelo, visualizar a fila de cima e alterar a perspectiva, mesmo sem estar fisicamente no local.

### Reabertura em realidade aumentada

Também deverá existir uma opção:

**"Visualizar novamente no ambiente real"**

Nesse caso, será obrigatório realizar um novo mapeamento ou processo de realinhamento espacial.

**Motivo:** as coordenadas espaciais de uma sessão de câmera anterior não devem ser consideradas automaticamente válidas em uma nova sessão.

Fluxo:
1. Usuário abre uma fila salva.
2. Seleciona "Visualizar no ambiente real".
3. A aplicação inicia um novo mapeamento/alinhamento.
4. O usuário confirma os limites e a escala do ambiente.
5. O sistema associa a simulação salva ao novo referencial espacial.
6. A câmera mostra a fila novamente, alinhada ao espaço real.

O sistema deve verificar se as dimensões do novo mapeamento são compatíveis com o projeto original e alertar sobre divergências.

O projeto original não deve ser sobrescrito automaticamente por um novo mapeamento.

## 11. Diretrizes de experiência e interface

A experiência precisa seguir estes princípios:
- Minimalismo: poucas ações visíveis simultaneamente.
- Mobile-first: pensada para uso com smartphone na mão.
- Clareza: cada etapa deve explicar o que o usuário precisa fazer.
- Feedback visual: indicar qual ferramenta está ativa.
- Consistência: manter a mesma representação espacial entre as visualizações.
- Facilidade de edição: permitir desfazer, remover ou reposicionar elementos.
- Precisão: manter as proporções físicas e indicar eventuais incertezas de medição.
- Continuidade: navegar entre 3D e câmera sem perder a configuração.

A identidade visual será aplicada a partir dos arquivos da marca fornecidos posteriormente.

Não inventar uma identidade visual definitiva antes de receber esses materiais. Utilizar um tema provisório facilmente substituível.

## 12. Telas necessárias para o MVP

1. **Login** — Autenticação com e-mail e senha.
2. **Dashboard** — Criar fila e visualizar filas anteriores.
3. **Mapeamento do ambiente** — Captura das quinas e limites do espaço.
4. **Revisão do mapeamento** — Modelo 3D com grid e medidas.
5. **Áreas restritas** — Criação e edição das regiões bloqueadas.
6. **Editor de fila** — Planejamento com postes, fitas e pessoas, alternando entre câmera e 3D.
7. **Finalização** — Nomear e salvar o projeto.
8. **Projetos salvos** — Listagem e prévias 3D.
9. **Visualizador de projeto** — Simulação salva, com opção de iniciar novo alinhamento em AR.

Essas etapas podem ser organizadas como um fluxo contínuo, evitando excesso de páginas e transições desnecessárias.

## 13. Prioridades de implementação

### Fase 1 — Fundação

Implementar login, dashboard, estrutura de banco de dados, modelos dos projetos e identidade visual provisória.

### Fase 2 — Motor espacial

Desenvolver a representação 3D em metros, sistema de coordenadas, grid, paredes, criação e edição de perímetros e ferramentas de navegação no modelo.

Em paralelo, validar a captura espacial com câmera em um protótipo técnico real.

### Fase 3 — Editor de filas

Implementar áreas restritas, postes, conexões de fitas, modelos de pessoas, caminhos de fila, espaçamento e preenchimento automático.

### Fase 4 — Integração com realidade aumentada

Integrar o editor espacial à câmera, implementar colocação e alinhamento dos objetos no ambiente real e sincronizar as visualizações AR e 3D.

### Fase 5 — Persistência e reabertura

Implementar salvamento de projetos, galeria com prévias 3D, recuperação de simulações e fluxo de remapeamento para reabrir projetos em realidade aumentada.

## 14. Critérios de conclusão do MVP

O MVP estará funcional quando for possível executar este fluxo completo:
1. Fazer login.
2. Criar um novo projeto.
3. Mapear um ambiente e confirmar suas dimensões em metros.
4. Visualizar o espaço em 3D.
5. Adicionar uma ou mais áreas restritas.
6. Posicionar postes de fila.
7. Conectar postes com fitas.
8. Adicionar pessoas e preencher automaticamente uma fila.
9. Alterar o espaçamento das pessoas.
10. Alternar entre câmera e visualização 3D, quando houver suporte AR.
11. Salvar a fila no banco de dados.
12. Voltar ao dashboard e encontrar o projeto salvo.
13. Reabrir e explorar sua simulação 3D.
14. Iniciar um novo mapeamento/alinhamento para visualizar novamente a fila salva pela câmera.

Tudo isso deve funcionar com dados persistentes e interações reais, não apenas com telas ilustrativas.

## 15. Instruções para a IA desenvolvedora

Quero que você utilize esta especificação como referência principal para construir o MVP do TestaFila.

**Orientações obrigatórias:**
- Não construa apenas um protótipo visual. O objetivo é uma aplicação funcional.
- Estruture o código com componentes reutilizáveis e separação entre interface, lógica espacial e persistência.
- Não utilize coordenadas de tela como se fossem medidas físicas reais.
- Utilize um sistema de coordenadas comum para a cena 3D, a câmera e os projetos salvos.
- Separe a representação geométrica do ambiente de sua visualização, para que o mesmo projeto possa ser renderizado em diferentes perspectivas.
- Não simule falsamente funcionalidades de AR ou medição que ainda não estejam operacionais.
- Caso algum requisito dependa de sensores ou capacidades específicas, identifique essa limitação e implemente uma alternativa claramente sinalizada.
- Priorize primeiro a precisão do motor espacial e a consistência dos dados, depois os refinamentos visuais.
- Preserve a simplicidade da experiência do usuário.
- Prepare o sistema para receber a apresentação de identidade visual, logo e demais ativos de marca.

Antes de começar, defina a arquitetura, o modelo de dados, a estratégia de mapeamento espacial e a sequência de implementação. Em seguida, desenvolva o MVP por módulos, mantendo cada funcionalidade testável.

**Resultado esperado:** um aplicativo TestaFila em que um usuário consiga transformar um ambiente real em um modelo espacial, planejar uma fila com postes, fitas e pessoas, analisar sua capacidade em 3D e realidade aumentada, salvar e recuperar a simulação posteriormente.

### Complemento literal do usuário após a especificação

“vc precisa ser o coordenador, logo vc deve organizar as ideias, separar as fases pra n
se atravessarem. na raiz agora coloquei a pasta slide-cintia - siga o design de la.
use essas skills de design pro front. use essas pro 3d” — seguido dos três comandos
npx transcritos na seção de skills desta passagem.

## 12. Anexos de implementação e instruções locais

Os anexos abaixo são cópias dos arquivos preparados nesta conversa, para que a passagem
seja autocontida. As propostas técnicas são do coordenador anterior; as seções de
status antigas devem ser interpretadas à luz das atualizações acima. Nenhuma cópia
anexada torna uma funcionalidade implementada.


### Anexo A — Arquitetura proposta

Fonte: Testafila/docs/ARCHITECTURE.md

```markdown
# TestaFila — arquitetura do MVP

Status: decisões iniciais para implementação; aplicação atual ainda é o protótipo Vite.
Referência principal: especificação de MVP enviada pelo usuário em 22/10/2026.
Ela amplia e substitui o escopo funcional dos PDFs quando houver divergência.

## Organização

Migrar incrementalmente este repositório para Next.js App Router, React e TypeScript.
Não manter duas aplicações de produção nem apagar o protótipo antes de portar suas funções úteis.
O coordenador controla package.json, lockfile, configuração, contratos e integração.

Estrutura de destino:

```text
src/app/                     rotas, layouts e endpoints
src/components/ui/           componentes e tokens da apresentação
src/features/auth/           login, validação e sessão
src/features/projects/       dashboard, galeria, salvar e abrir
src/features/mapping/        perímetro, revisão e medidas manuais
src/features/editor/         ferramentas e comandos reversíveis
src/domain/                  geometria e modelo sem React, Three ou banco
src/scene/                   visualização R3F do domínio
src/platform/xr/             capacidades, captura e alinhamento por sessão
src/server/                  autenticação, repositório, autorização e validação
prisma/                      schema e migrações
tests/                       domínio, integração e fluxo completo
```

Tailwind para layout e tokens CSS para identidade. Three.js/R3F para renderização,
Drei para navegação. Cena carregada apenas no cliente. Estado do documento separado
do estado transitório de seleção, câmera, arraste, sessão XR e histórico.
Não serializar Mesh, Vector3, streams de câmera nem objetos de sessão XR.

## Backend e autenticação

Decisão inicial: PostgreSQL com Prisma; autenticação por biblioteca mantida com
sessão em cookie HttpOnly, Secure em produção e proteção CSRF nas mutações.
Antes de codificar, verificar versões e integração de uma biblioteca de autenticação
com credenciais (preferência inicial: Better Auth). Não construir autenticação caseira.
Provisionamento inicial de conta por comando administrativo documentado; cadastro
público e recuperação de senha não fazem parte da especificação recebida.
O login de demonstração não pode ser um bypass ou senha fixa no frontend.

Toda operação de projeto exige sessão; o servidor deriva ownerId da sessão.
Consultas e mutações filtram por id E ownerId. Nunca aceitar ownerId do cliente.
Validar JSON e limites de tamanho antes de persistir. Senhas não entram no documento
do projeto nem nos logs. Segredos apenas em variáveis de ambiente no servidor.

Tabelas: User/Session/Account conforme biblioteca; Project (id, ownerId, name,
createdAt, updatedAt, revision, schemaVersion, scene JSONB); Preview opcional com
chave de armazenamento privado. Índice em (ownerId, updatedAt).
Salvar é transação atômica. Atualização usa revision esperada; divergência retorna
conflito sem sobrescrever silenciosamente. Prévia falhando não impede salvar a cena.
Galeria mostra preview pregenerado ou miniatura sob demanda; não abre um Canvas por card.

## Modelo espacial

Documento versionado descrito em contracts/project.ts. Uma unidade equivale a um metro.
Sistema destro: Y para cima; piso em XZ, Y=0; origem e orientação locais do projeto.
Pontos persistidos em números finitos; precisão visual não implica precisão de sensor.

- Ambiente: polígono simples fechado, vértices com IDs estáveis, altura das paredes,
  fonte de medição e observações de dimensões conferidas.
- Área restrita: polígono no piso; retângulos editáveis são convertidos em vértices.
- Poste: ID, posição, dimensões físicas padronizadas.
- Fita: conexão explícita entre dois IDs de postes. Não ligar todos automaticamente.
- Percurso: polilinha independente, ordenada, por onde passam os centros das pessoas.
  Fita é barreira física; não assumir que a pessoa ocupa a linha da fita. No MVP, o
  usuário desenha/confirma o percurso com prévia e validação dentro da área delimitada.
- Pessoas: distribuição ao longo do percurso por distância acumulada e dimensões
  proporcionais. Alterar espaçamento redistribui e recalcula posições válidas.

Validar ambiente e zonas sem auto-interseção, pontos repetidos ou arestas nulas.
Considerar contato com borda restrita como conflito. Aplicar footprint e folga aos
objetos e pessoas, e não apenas testar o centro. Toda inclusão/edição exige validação
atômica. Arraste inválido mostra prévia vermelha e restaura a última posição válida.
Edição de zona/ambiente não pode tornar objetos existentes inválidos silenciosamente.

Espaçamento é distância entre centros em metros; MVP inicial aceita 0,5 / 0,8 / 1,0 m,
com validação da largura corporal. Não somar capacidades dos segmentos isoladamente:
usar comprimento acumulado, evitando pessoas duplicadas em quinas e auto-sobreposição.
Preencher fila percorre amostras ordenadas, respeita ambiente, zonas, barreiras e outras
pessoas; se o percurso cruza bloqueio, interrompe no bloqueio e pede correção, sem
teletransportar pessoas. Contagem real simulada e capacidade geométrica são distintas.

## Captura e confiabilidade

Pré-requisito antes do editor AR: spike técnico em aparelhos-alvo reais. HTTPS,
isSessionSupported('immersive-ar'), requestSession com hit-test obrigatório e poses
válidas. Suporte não é inferido pelo nome do navegador nem pelo acesso à câmera.
Não prometer suporte universal Android/iOS.

Mapeamento XR: localizar piso horizontal, estabelecer origem, marcar quinas em uma
única sessão, projetar no plano estável, fechar perímetro, revisar e confirmar.
Sem pose válida, bloquear marcação. Suspender inserção se tracking ficar indisponível.
Testar deriva, estabilidade, encerramento e retorno de background.

Alternativa funcional: desenhar planta e informar coordenadas/dimensões em metros
medidos com trena. Retângulo por largura/profundidade; polígono por coordenadas
métricas editáveis. Não converter arbitrariamente pixels em metros. Calibrar um
rascunho requer referência física e conferência de outras dimensões; uma distância
isolada não comprova precisão de um polígono inteiro. Rotular fonte como manual,
calibrada ou XR; erro só é informado quando observado, nunca inventado.

getUserMedia isolado é prévia de câmera, não mapeamento ou AR com alinhamento.
Se o spike não passar nos alvos obrigatórios, registrar decisão para adaptador nativo/
híbrido (ARCore/ARKit) mantendo frontend web e domínio; não declarar AR concluída.

## Mesmos dados em 3D e AR

Os dois renderizadores consomem o mesmo documento. O adaptador XR aplica transformação
rígida transitória projectToSession (translação + yaw), sem alterar as coordenadas
persistidas. Não escalar o projeto para esconder divergência entre ambientes.

Reabrir projeto sempre começa sem alinhamento. Exigir dois pontos correspondentes
distintos para orientação/posição e pelo menos um terceiro ponto de conferência,
além de revisar dimensões. Sem correspondências suficientes, exigir remapeamento.
Medir resíduos, distâncias e tolerâncias em metros e porcentagem, exibir divergências;
tolerância deve ser definida/validada no spike, não confundida com erro garantido.
Novo alinhamento fica apenas na sessão. Remapear cria cópia explícita se houver
alteração do documento; nunca sobrescrever o original automaticamente.

## Fluxo e desfazer

login -> dashboard -> mapear -> revisar -> áreas restritas opcionais -> editor ->
nomear/salvar -> projeto ou dashboard. Galeria abre cena em 3D e oferece realinhamento.
Etapas com guards: perímetro válido e confirmado antes de restrições/editor; sessão
alinhada antes de inserir em AR; documento válido antes de salvar.

Comandos com antes/depois para adicionar, mover, remover, conectar, preencher,
alterar espaçamento e editar perímetro/zona. Um arraste equivale a uma ação no histórico.
Desfazer/refazer restaura documento completo da operação, incluindo referências
dependentes. Remover poste remove suas fitas; percurso separado só muda por ação
explícita e deve continuar válido. Navegar entre modos não perde alterações.

## Design

Fonte: ../../slide-cintia/DESIGN.md e styles.css. Fundo #f5f4ef, texto #242d29,
secundário #606963, verde #214b40, borda #d8dcd4, superfície #e8ece4, alerta #9b3f31.
Segoe UI/Arial, Georgia itálica nos destaques, Consolas nas medidas.
Poucas ações por etapa; alvos de toque de 44px; foco visível, erros junto ao campo,
feedback por texto/ícone além de cor, reduced-motion. Sem gradientes/neon ou resultados
inventados. Preservar a linguagem dos slides sem copiar a estrutura de apresentação.
Não gerar nova logo; marca textual provisória até ativos oficiais.

## Validação

Domínio: polígonos côncavos, tangência/colinearidade, footprint, quinas, comprimento,
distribuição de pessoas, escala e transformações de alinhamento.
Integração: login/logout, proprietário isolado, schema inválido, persistência e conflito.
E2E: login -> planta manual métrica -> restrições -> postes -> fitas -> percurso ->
pessoas -> espaçamento -> salvar -> recarregar -> reabrir com os mesmos dados.
AR: matriz aparelho/navegador/HTTPS, 20m com trena e meta <=5%, tracking e realinhamento.
Desempenho: medir latência de colisão (meta <200ms), FPS e memória em aparelho real.
Não substituir evidência física por testes unitários ou pelo cálculo de ±5% da capacidade.

Fontes técnicas consultadas em 22/10/2026:
- https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/isSessionSupported
- https://developer.mozilla.org/en-US/docs/Web/API/XRSession/requestHitTestSource
- https://raw.githubusercontent.com/emalorenzo/three-agent-skills/main/skills/r3f-best-practices/SKILL.md

```


### Anexo B — Fases e coordenação

Fonte: Testafila/docs/DELIVERY.md

```markdown
# Coordenação e sequência de entrega

## Estado em 22/10/2026

Concluído: leitura dos PDFs, especificação e referência visual; diagnóstico do código;
arquitetura inicial e contratos de referência. Aplicação nova ainda não implementada.

Bloqueios verificados: MAESTRI_PIPE ausente (CLI não conectado ao canvas); GitHub pelo
terminal falha no proxy 127.0.0.1; escrita global fora do workspace não permitida.
Skills solicitadas não instaladas. Presets Flash/Agys não verificados.
Não iniciar implementadores por nomes/modelos presumidos.

## Responsabilidades

Coordenador: contratos, integração, dependências/lockfile, critérios de aceite e revisão.
Luna Medium: componentes e tarefas médias de escopo fechado; apoio em testes e revisão.
Agys/Flash 3.8 Low: ajustes simples e documentação delimitada.
Agys/Flash 3.8 High: geometria, persistência/autorização, captura e alinhamento espacial.
Confirmar presets com maestri list e maestri preset list antes de recrutar. Reutilizar
agentes existentes. Não substituir silenciosamente modelo solicitado por outro.

## Fases e dependências

| ID | Entrega | Depende | Dono previsto | Evidência para avançar |
|---|---|---|---|---|
| F0 | Contratos, design e tarefas | — | Coordenador | Revisão de arquitetura e modelo |
| F1a | Bootstrap Next/TS e tokens | F0 | Coordenador + Luna Medium | build/typecheck e telas base acessíveis |
| F1b | Banco, migrações, sessão e autorização | F1a | Flash High | Login real, logout e isolamento entre usuários |
| F1c | Dashboard e estados de projetos | F1b | Luna Medium | Lista real, vazio, erro e carregamento |
| F2a | Geometria métrica, perímetro, paredes/grid | F1a | Flash High | Testes de domínio + planta manual editável |
| F2b | Spike WebXR em dispositivo | F0 | Flash High | Relatório real de suporte, erro e estabilidade |
| F2c | Mapeamento/revisão manual e XR aprovado | F2a, F2b | Luna + Flash High em arquivos separados | Perímetro confirmado, origem e fonte das medidas |
| F3a | Zonas, validação e comandos undo/redo | F2a | Flash High | Edições inválidas impedidas e undo atômico |
| F3b | Postes e conexões explícitas de fitas | F3a | Luna Medium | Criar/mover/remover e integridade referencial |
| F3c | Percurso e pessoas com preenchimento | F3b | Flash High | Espaçamento, footprint e capacidade testados |
| F4 | AR/3D com documento comum | F2b aprovado, F3c | Flash High | Mesma cena, perda de tracking segura, realinhamento |
| F5 | Salvar, galeria, abrir e conflitos | F1b, F3c | Flash High + Luna em arquivos separados | Recarregar recupera cena completa; outro usuário não acessa |
| F6 | QA integrado e validação em campo | F4, F5 | Coordenador + revisores | Fluxo completo e evidências reais |

Persistência é contratada em F1 e integrada cedo; não deixar autorização para a última fase.
F2a e F2b podem correr em paralelo. F5 pode integrar editor antes de F4 terminar.
Falha do spike bloqueia apenas AR confiável; modo 3D/manual segue funcional.

## Divisão sem colisão

Primeiro lote após infraestrutura disponível:
1. Coordenador migra scaffold e fixa versões/contratos. Só ele altera manifest/lockfile.
2. Flash High recebe domínio puro e testes: src/domain/**; não altera UI ou servidor.
3. Luna Medium recebe componentes/tokens e login visual: src/components/ui/** e
   src/features/auth/components/**; consome contratos, não inventa endpoints.
4. Spike AR isolado em experiments/xr/** e relatório; não altera editor de produção.

Servidor só inicia com dependências do scaffold fixadas. Contratos compartilhados só
mudam via coordenador. Um arquivo não pode ter dois responsáveis simultâneos.
Coordenador revisa e integra cada entrega antes de liberar tarefas dependentes.

## Contrato de tarefa para agentes

Cada despacho contém: ID, objetivo, pré-requisitos, caminhos permitidos, arquivos
proibidos, contratos, skills a ler, critérios de aceite e comandos de validação.
Relato de conclusão inclui arquivos alterados, verificações executadas, limitações e
pendências. Quando Maestri estiver conectado, terminar com ask back para o nome exato
do coordenador retornado por maestri list. Não reenviar tarefa após timeout; usar check.

Frontend: ler a referência slide-cintia, editorial-tech e skills relevantes dos packs
MengTo/tastemaker/designer-skills após instalar. Não aplicar todas as centenas de skills.
3D: ler r3f-best-practices, react-three-fiber-game e web-3d-asset-pipeline após verificar
disponibilidade. Recursos de jogos não justificam física/animação extra no MVP.

## Matriz de conclusão do usuário

| Passos | Módulos | Aceite |
|---|---|---|
| 1–2 Login e criar | F1 | Sessão real e projeto do proprietário |
| 3–4 Mapear e revisar | F2 | Dimensões métricas, fonte explícita e perímetro editável |
| 5 Áreas restritas | F3a | Múltiplos polígonos editáveis e posicionamento impedido |
| 6–7 Postes e fitas | F3b | Selecionar, mover, remover e conectar por IDs |
| 8–9 Pessoas/espaçamento | F3c | Inserir, preencher, redistribuir e contar corretamente |
| 10 Alternar AR/3D | F4 | Documento único; AR apenas em dispositivo validado |
| 11–13 Salvar/encontrar/abrir | F5 | Banco real e reconstrução após recarga |
| 14 Realinhar | F4/F5 | Nova sessão, correspondências e alerta sem sobrescrita |

```


### Anexo C — Contratos de dados ainda não integrados

Fonte: Testafila/contracts/project.ts

```typescript
/** Contrato de referência v1. Ainda não integrado ao protótipo Vite. */
export type EntityId = string;
export type Meters = number; // Runtime: número finito; limites específicos por campo.
export interface PointXZ { x: Meters; z: Meters }
export interface Vertex extends PointXZ { id: EntityId }
export type MeasurementSource = 'manual' | 'calibrated' | 'webxr';

export interface MeasurementEvidence {
  source: MeasurementSource;
  recordedAt: string;
  // Ausente significa desconhecido, nunca erro zero.
  observedErrorPercent?: number;
  checks: Array<{ fromVertexId: EntityId; toVertexId: EntityId; measuredMeters: Meters }>;
}

export interface Environment {
  // Fechamento implícito último -> primeiro. Não repetir vértice final.
  perimeter: Vertex[];
  wallHeightMeters: Meters;
  measurement: MeasurementEvidence;
  confirmedAt: string | null;
}

export interface RestrictedArea {
  id: EntityId;
  name: string;
  vertices: Vertex[];
}

export interface Stanchion {
  id: EntityId;
  position: PointXZ;
  heightMeters: Meters;
  baseRadiusMeters: Meters;
}

export interface Belt {
  id: EntityId;
  fromPostId: EntityId;
  toPostId: EntityId;
  heightMeters: Meters;
}

export interface QueueRoute {
  id: EntityId;
  // Percurso das pessoas, independente das barreiras (fitas).
  points: Vertex[];
}

export interface PersonPlacement {
  id: EntityId;
  routeId: EntityId;
  distanceAlongRouteMeters: Meters;
  // Cache validado contra percurso no servidor; nunca segunda fonte de posição.
  position: PointXZ;
  yawRadians: number;
}

export interface ProjectScene {
  schemaVersion: 1;
  units: 'meters';
  coordinateSystem: 'right-handed-y-up-xz-floor';
  environment: Environment;
  restrictedAreas: RestrictedArea[];
  posts: Stanchion[];
  belts: Belt[];
  routes: QueueRoute[];
  people: PersonPlacement[];
  simulation: {
    spacingMeters: Meters;
    personHeightMeters: Meters;
    personRadiusMeters: Meters;
    clearanceMeters: Meters;
  };
}

export interface SavedProject {
  id: EntityId;
  ownerId: EntityId; // Somente servidor atribui.
  name: string;
  createdAt: string;
  updatedAt: string;
  revision: number;
  scene: ProjectScene;
  previewKey: string | null;
}

export interface SaveProjectInput {
  name: string;
  scene: ProjectScene;
  // null para criação; atualização exige revisão atual do banco.
  expectedRevision: number | null;
}

/** Apenas memória da sessão; não integrar ao SavedProject. Escala sempre 1. */
export interface SessionAlignment {
  sessionId: string;
  projectId: EntityId;
  yawRadians: number;
  translation: { x: Meters; y: Meters; z: Meters };
  correspondences: Array<{ project: PointXZ; session: { x: Meters; y: Meters; z: Meters } }>;
  maxResidualMeters: Meters;
  confirmedAt: string;
}

```


### Anexo D — Regras locais para agentes

Fonte: Testafila/AGENTS.md

```markdown
# TestaFila

O usuário pediu coordenação com fases e agentes especializados. Antes de alterar código,
leia docs/ARCHITECTURE.md, docs/DELIVERY.md e ../slide-cintia/DESIGN.md.
A especificação de MVP do usuário de 22/10/2026 prevalece sobre o protótipo e os PDFs.

Use o Maestri para equipe quando conectado: list antes de delegar/recrutar, confirmar
presets, reutilizar agentes e pedir ask back. Luna Medium para escopos médios;
Agys/Flash 3.8 High para tarefas difíceis; Flash 3.8 Low para simples, conforme usuário.
Nunca declarar uso de preset/modelo que não foi verificado. Sem MAESTRI_PIPE, relatar
limitação e preparar tarefas; não inventar conexão ou agentes.

Só o coordenador modifica manifest, lockfile e contratos comuns. Cada implementador
recebe escopo exclusivo de arquivos. Não mudar contratos durante tarefas concorrentes.
Antes de dar uma tarefa por concluída, registrar testes e limites reais da verificação.

Frontend segue slide-cintia: tokens, linguagem editorial e mobile-first. Usar skills
de design pedidas quando disponíveis, lendo o SKILL.md relevante. Não gerar identidade
nova. 3D segue as três skills solicitadas quando instaladas; geometria é independente
de renderização. Não afirmar instalação de skills sem verificar os arquivos globais.

Uma unidade espacial = 1 metro. Câmera comum não é medição/AR confiável. Origem do
projeto é persistente; alinhamento XR pertence só à sessão. Nova sessão exige realinhar.
Persistência real por proprietário; nenhum login simulado ou localStorage substituindo
banco. Postes/fitas/pessoas/percurso são entidades distintas; 3D e AR compartilham dados.

```


### Anexo E — Direção visual dos slides

Fonte: slide-cintia/DESIGN.md

```markdown
# TestaFila: decisões de design e conteúdo

## Direção

Apresentação universitária com linguagem de produto. Uma ideia central por slide, parágrafos curtos e títulos que descrevem o argumento. Fundo marfim, verde fechado, regras finas e composição editorial. Títulos em sans-serif com trechos em Georgia itálica. Sem gradientes, neons, emojis decorativos, depoimentos ou resultados inventados.

Skill principal lida e aplicada: [editorial-tech, MengTo/Skills](https://github.com/MengTo/Skills/blob/main/agent-skills/web-design/editorial-tech/SKILL.md). Apoio de [design-first-ui-prompting](https://github.com/MengTo/Skills/blob/main/agent-skills/ui/design-first-ui-prompting/SKILL.md) para hierarquia, restrições e consistência. As sugestões opcionais de brilho e gradiente foram descartadas por instrução do usuário.

Revisão de texto com [remove-ai-slop, davidamitchell/Skills](https://github.com/davidamitchell/Skills/blob/main/remove-ai-slop/SKILL.md): frases específicas, voz ativa, menos repetições e nenhum ganho apresentado como comprovado. Avaliação editorial interna: clareza 9/10, ritmo 8/10, respeito ao leitor 9/10, naturalidade 8/10, densidade 9/10. Isso é uma revisão qualitativa, não uma avaliação independente.

## Fontes do conteúdo

Os três PDFs fornecidos sustentam conceito, equipe, tecnologia, datas e critérios. O XRD e o One-Page Concept definem a meta de erro de 5%; o plano também menciona uma margem de 10% na matriz de risco. A apresentação adota o critério de aceitação de 5% como meta, sem afirmar precisão já alcançada. A menção a AR Foundation em uma linha do cronograma do plano foi alinhada à arquitetura WebXR descrita no restante dos documentos.

O suporte universal a Chrome/Safari da apresentação anterior foi corrigido. Referência: https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API . A compatibilidade precisa ser validada no aparelho e no navegador. O prazo final apresentado é 17/12/2026.

## Simulação

Cena ilustrativa em projeção axonométrica, com opção de planta. Malha de um metro, paredes, janelas, saída, sombras sólidas, postes e fitas. Sem dependências de rede. A apresentação usa Canvas 2D para desenhar a cena; Three.js e WebXR são tecnologias previstas para o produto acadêmico.

Hall de 10 × 8 m, três traçados, deslocamento lateral, espaçamento por pessoa e controle de ocupação. A distância usa a soma euclidiana dos segmentos, a capacidade usa arredondamento para baixo, e a interseção considera contato com o limite da área. A colisão verifica a linha central do percurso, sem simular largura corporal, evacuação ou tempo de atendimento. As pessoas ilustram ocupação estática.

## Skills globais

Documentação consultada pelo acesso web. A instalação global não foi executada: a sessão só permite escrita na pasta do projeto, e o acesso de rede do terminal está bloqueado. Não há skills do repositório instaladas local ou globalmente por este trabalho. O script `instalar-skills-global.ps1` usa o instalador oficial do Codex, descobre todas as skills do repositório e fixa a revisão consultada antes de instalar. Ele preserva diretórios já existentes. Execute-o fora da sessão restrita para concluir a instalação global na conta do Codex.

```


### Anexo F — Registro de skills (status histórico)

Fonte: Testafila/docs/SKILLS.md

```markdown
# Skills pedidas pelo usuário

Estado: instalação global NÃO executada. Terminal sem rede funcional e workspace sem
permissão de escrita global. Não criar cópias incompletas de SKILL.md como se fossem
instalações: referências, scripts e assets também fazem parte de uma skill.

O arquivo ../../instalar-skills-global.ps1 usa o helper oficial do Codex, descobre a
árvore via API GitHub e fixa cada SHA antes de instalar. Instala os packs de MengTo e
Owl-Listener, tastemaker e as três skills 3D explicitamente pedidas. Não segue os outros
repositórios indicados pelo marketplace de Owl-Listener, que não foram solicitados.
Não executa scripts dos repositórios. Preserva skills existentes; nomes conflitantes
ou skills solicitadas ausentes interrompem a instalação sem substituição silenciosa.

Em PowerShell fora da sessão restrita, na raiz do workspace:

```powershell
.\instalar-skills-global.ps1 -ListOnly
.\instalar-skills-global.ps1
```

Destino padrão: ~/.agents/skills (global compartilhado pelo usuário, já usado pelas
skills Maestri). Para Codex com destino específico, passar -Destination apontando
para ~/.codex/skills. Agys/outros CLIs precisam confirmar onde descobrem skills antes
de afirmar disponibilidade; instalação no diretório do Codex não garante uso por eles.

Instalação via CLI skills, se o usuário preferir o instalador que indicou:

```powershell
npx skills add https://github.com/openai/plugins --skill react-three-fiber-game --global
npx skills add https://github.com/emalorenzo/three-agent-skills --skill r3f-best-practices --global
npx skills add https://github.com/openai/plugins --skill web-3d-asset-pipeline --global
```

Confirmar flags com npx skills add --help na máquina com rede antes de usar esta
alternativa. Os comandos acima não foram executados nem verificados nesta sessão.

## Aplicação por tarefa

- Referência visual principal: ../../slide-cintia/DESIGN.md e styles.css.
- MengTo: editorial-tech e design-first-ui-prompting para hierarquia e consistência.
- tastemaker: referência e registro de decisões; não gerar outra paleta que substitua
  os tokens fornecidos pelo usuário.
- designer-skills: escolher módulos pertinentes de tokens, layout responsivo,
  interação, formulários e revisão. Não carregar o pack inteiro em cada tarefa.
- r3f-best-practices: renderização, estado, recursos compartilhados e custo mobile.
- react-three-fiber-game: padrões R3F aplicáveis; não adicionar mecânicas de jogo.
- web-3d-asset-pipeline: escala humana, origem, orientação, licenças e otimização dos assets.

Leituras web realizadas não equivalem a instalação. Editorial-tech e r3f-best-practices
foram consultadas; a estrutura dos outros repositórios deve ser verificada pelo instalador.

```


### Anexo G — Skill Maestri, texto completo

Fonte: C:\Users\joaot\.agents\skills\maestri\SKILL.md

```markdown
---
name: maestri
description: Send messages to connected AI agents on the Maestri canvas and get their responses. Also read and write connected sticky notes. Use when the user's intent is to collaborate with another agent on the canvas. Look for actions like 'ask [name] to...', 'tell [name] to...', 'check on [name]', or 'create/update a note'.
user-invocable: true
---

# Maestri Inter-Agent Communication

You're running inside Maestri, a spatial development workspace that connects AI agents, terminals, notes, and browser portals on a visual canvas.
The `maestri` CLI is a command-line executable pre-installed and available on PATH. If `maestri` is not found, use `"$MAESTRI_CLI"` instead; this environment variable always points to the full binary path.

Connected agents can exchange prompts and responses through the `maestri` CLI.
Connected notes can be read and written through the `maestri` CLI.

## Commands

- `maestri list` — list connected agents, notes, and portals
- `maestri ask "Agent Name" "your prompt"` — send a prompt to a connected agent and get the response
- `maestri ask --batch '{"Agent A": "prompt", "Agent B": "prompt"}'` — ask several connected agents at once, in parallel
- `maestri ask "Agent Name" --raw "2\n"` — send raw input; use it for interactive menus or to send raw shell commands directly. Escapes: `\n` Enter, `\t` Tab, `\e` ESC, `\xNN` byte (`\x03` Ctrl-C). Special keys are ESC sequences, e.g. `\e[A` up arrow, `\e[Z` Shift-Tab.
- `maestri check "Agent Name"` — read the agent's current terminal output on demand
- `maestri notify "message"`: send the user a system notification. Only when they asked to be notified; otherwise assume they're following along in Maestri.
- `maestri note create ["content"] [--name "Name"] [--stack ["Fichário"]] [--color C]` — create a new note on the canvas and link it to this terminal; `--name` pins a stable name that never changes with content. The response prints the exact assigned name
- `maestri note read "Note Name"` — read the full note with line numbers
- `maestri note read "Note Name" 10 20` — read 20 lines starting from line 10
- `maestri note write "Note Name" "content"` — replace a note's content entirely
- `maestri note edit "Note Name" "old text" "new text"` — replace a substring within a note
- `maestri note stack "Note Name" ["Fichário"]` — file (or move) an existing note into a fichário; `maestri note unstack "Note Name"` frees it
- `maestri note delete "Note Name"` — remove a connected note from the canvas. **Destructive. Only run when the user explicitly asks you to delete the note.** Never delete a note on your own initiative, even to tidy up.
- `maestri arrange "Name" [--name N] [--icon I] [--color C]`: rename yourself, a note, or (as the Maestro) a teammate or band in place, or give it an icon or color. Style what you create; restyle what's already there only when the user asks. `maestri arrange` alone shows current looks, `--help` the choices.

If any maestri command fails (connection or pipe errors), run `maestri debug` FIRST — it reports the exact cause (elevation mismatch, stale pipe, missing env) before you start guessing.
Always run `maestri list` first to get the exact agent and note names. An agent wired in from another workspace is listed as `Name @ Workspace`; that whole string is its name, use it exactly as printed.
The response from `ask` returns as soon as the other agent finishes. Scale the Bash tool timeout to the estimated completion time, usually from 1min (easy) to 10min (most tasks). A plain `ask` is for quick questions. Whenever you hand off a task (implementing, reviewing, investigating, planning, anything on a floor), use the ask back approach detailed below: `ask` returns only the agent's last screen, and a long task outlives your timeout, while an ask back reaches you in full even after your `ask` has timed out.
If the timeout expires before the agent responds, do NOT re-send the prompt. Run `maestri check "Agent Name"` to see their progress, then wait again with an appropriate timeout. Never interrupt an agent that is still working, and do not edit files that the other agent is actively modifying — wait for them to finish first.
An agent on a floor or workspace that was unloaded or not opened since launch is woken by `ask`; if the reply says it is still starting, ask again.
The ask back approach: Tell the agent to report back with `maestri ask "Your Name" "<result>"` when done (your name is under `You:` in `maestri list`; when the agent is in another workspace, quote the `Name @ Workspace` address shown right under `You:` instead). This way their message resolves your waiting `ask` automatically and arrives in full as a new incoming prompt.
Use `check` to read what an agent is currently showing without sending a prompt — useful to check if a previous request completed or to see its current state. Be careful not to misread unsent text in their TUI input area as instructions to you.

## Asking several agents at once

`maestri ask --batch '{"Agent A": "prompt for A", "Agent B": "prompt for B"}'` sends a prompt to multiple connected agents **in parallel** and returns only once every one has finished. The input is a JSON map of agent name → prompt; targets must be distinct (a JSON object can't repeat a key). The result is a JSON array of `{name, output}` objects (plus `{name, error}` for any agent that couldn't be reached) — match each reply by its `name`. Set the Bash tool timeout to fit the **slowest** task in the batch, since the command waits for all of them.

Run `maestri help` to see all available commands, and `maestri <command> --help` (e.g. `maestri recruit --help`) for one command's flags and detail. Never guess a flag. If the user is having connection or setup issues, run `maestri debug` to diagnose the problem.

## Connected Notes

Use `maestri note create` to create a new note on the canvas — it appears to the left of your terminal and is automatically connected. Optional initial content can be provided. Pass `--name "My Note"` to give it a stable name; the response always prints the exact name that was assigned, so use that name in subsequent commands.
`--stack "Name"` and `note stack` file notes into a fichário (a stack of pages), creating it if needed — `maestri list` shows the grouping.
Use `maestri note read` to read, `maestri note write` to replace entirely, and `maestri note edit` to update a specific part.
When a note already has content, prefer `edit` over `write` to avoid losing existing text.
Notes marked `locked: true` by `maestri list` are read-only. You can still read them, but `write` and `edit` will fail until the user unlocks the note in Maestri.
Changes are reflected in the Maestri canvas in real-time. Notes support markdown formatting.
Notes can be chained together. When a note connected to your terminal is also connected to other notes, you can read and write all notes in the chain. Use `maestri list` to see the full note tree — chained notes appear indented under their parent.

**Important:** By default, a note's name is derived from its first line of text. When you write or edit a note and change its first line, the note may be renamed automatically — the command's response tells you the new name when that happens. Notes created with `--name`, or renamed by the user, keep their name regardless of content changes. Prefer `maestri note create --name "..."` when you plan to address the note again later.
```


### Anexo H — Skill Maestri Manager, texto completo

Fonte: C:\Users\joaot\.agents\skills\maestri-manager\SKILL.md

```markdown
---
name: maestri-manager
description: Create and connect agent terminals on the Maestri canvas, manage agent roles. Use when the user asks to assemble a team, delegate parallel work, or spin up additional agents or terminals to help, or to invoke Maestro Mode.
user-invocable: true
---

# Maestri Team Orchestration

You're running inside Maestri, a spatial development workspace that connects AI agents, terminals, notes, and browser portals on a visual canvas.
The `maestri` CLI is a command-line executable pre-installed and available on PATH. If `maestri` is not found, use `"$MAESTRI_CLI"` instead; this environment variable always points to the full binary path.

The verbs below spawn new agent terminals on the canvas, assign them roles, and wire them together. Recruits are auto-connected to your terminal, so once a recruit exists you can `maestri ask "Name" "..."` (from the base `maestri` skill) to delegate work and `maestri check "Name"` to read their output.

## Reuse before recruiting

**Before you call `maestri recruit`, always run `maestri list` first.** If a connected teammate already has a fitting role, delegate to them with `maestri ask "Name" "..."` (from the base `maestri` skill) — do NOT spin up a new recruit for the same role. Recruits cost the user a real terminal slot and a real model session; recreating one you already have is the most common mistake in this flow.

Only recruit when:
- `maestri list` shows nobody whose role covers the task, AND
- the work genuinely needs a new persona (e.g. a reviewer-only voice when your existing teammate is the implementer).

If an existing recruit's role is *close but wrong*, prefer `maestri role edit` over recruiting a duplicate.

## When to use

- The user explicitly asked you to assemble a team or delegate to multiple agents.
- The work splits cleanly into parallel roles (implementer + reviewer, frontend + backend, scout + builder) AND `maestri list` confirms those roles aren't already on the team.
- You need a teammate with a focused role and no existing teammate has it.

Don't use this for one-off questions — `maestri ask` to an existing teammate is cheaper than spinning up a new one.

## Commands

### `maestri recruit "Name" [--preset "Claude Code"] [--role "Reviewer"] [--floor "Experiment"] [--workspace "Frontend"] [--band "Squad"] [--command "claude --resume"] [--dir "/path/to/project"] [--account "Work"] [--icon I] [--color C]`

Spawns a new terminal on the canvas, names it, and auto-connects it to you. When you are in a band, a recruit onto your floor joins that band instead of getting a rope: the band is its connection to you and to everyone in it. Returns when the terminal is created (the agent inside may still be booting — give it a few seconds before the first `ask`).

**Precondition:** run `maestri list` first. If a connected teammate already covers this role, use `maestri ask` instead — don't recruit a duplicate.

- **Name** (positional, **strongly recommended**) — pick a short codename for each teammate. The role already says what the recruit does; the name is its identity. **Invent the name yourself** — don't pull from a fixed list, and don't reuse names across teams. The codename can hint at the recruit's vibe (e.g. for a security reviewer, something watchful; for a UI designer, something visual; for a build-system specialist, something industrial) but should NOT restate the role. Vary your picks each session so two teams the user assembles don't look identical. Avoid reusing the role name (e.g. don't recruit "Frontend Developer" as `"Frontend Developer"`). The canvas appends `(2)`, `(3)`, ... if you happen to collide with an existing terminal.
- **--preset** — one of the user's quick-start presets. Run `maestri preset list` to see what's available before passing this flag. **If omitted, defaults to a copy of yourself** — same agent type the user picked for you, on the same account.
- **--role** — name of an existing role preset. The recruit is launched in `.maestri/roles/<id>/` so the role's prompt becomes its starting context. Run `maestri role list` to see available roles, or `maestri role create` to add a new one before recruiting. Optional: omit when you just need a vanilla teammate and plan to set context via `maestri ask`.
- **--floor**: place the recruit on a different floor of this workspace (run `maestri floor list` from the maestri-workspace skill to see floors; `--floor "Ground"` targets the ground level). When `--dir` is omitted, a git-isolated floor uses its own clone so the recruit's work can't touch the ground checkout. Omit `--floor` to recruit onto your own floor. The rope still connects it to you across floors; `ask`, `check`, and `dismiss` work the same.
- **--workspace**: place the recruit in another workspace (its ground level, or `--floor` there; run `maestri workspace list` from the maestri-workspace skill to see workspaces). The recruit starts in that workspace's directory and runs where that workspace runs, since it is that project's agent. You address it as `Name @ Workspace`, exactly as `maestri list` prints it.
- **--band**: put the recruit in a band you are in or connected to, on the floor it lands on, in another workspace too with `--workspace` (see `maestri band` below). It joins everything the band is connected to. Without it, a recruit onto your floor joins your own band when you are in one.
- **--icon**, **--color**: give the recruit its own look instead of its preset's, picked to fit its codename or job. `maestri arrange --help` lists the choices. Optional.
- **--command** — override the shell command. Almost never needed; use the preset.
- **--dir**: start the recruit in this working directory instead of inheriting yours. When combined with `--floor`, the explicit directory takes precedence over the floor's default checkout path. Omit it to keep the inherited behavior.
- **--account**: run the recruit on one of the user's accounts for its CLI (Claude Code or Codex), so several agents can run side by side on different subscriptions or API keys. `maestri preset list` prints the account names after each preset that has them; `"Default"` is the CLI's existing login. It wins over an account the preset pins. Omit it to use the preset's account, or yours when the recruit is a copy of you (no `--preset`, no `--command`). Each account lives in one place, this computer or a remote environment (`maestri preset list` names the place after a remote one), and only accounts that live where the recruit runs can be picked. `maestri list` shows which account each teammate runs on.

Examples:

```
maestri recruit "<your-codename>" --role "Code Reviewer"
maestri recruit "<your-codename>" --preset "Codex" --role "Test Writer"
maestri recruit "<your-codename>"                  # vanilla teammate, copy of yourself
maestri recruit "<your-codename>" --floor "Experiment" --role "Prototyper"
maestri recruit "<your-codename>" --workspace "Frontend" --role "Reviewer"
maestri recruit "<your-codename>" --dir "/path/to/another/project"
maestri recruit "<your-codename>" --preset "Claude Code" --account "Work"
```

**Isolated-experiment flow:** when the user wants risky or experimental work kept out of the main checkout, create a git-isolated floor first (`maestri floor create "Experiment" --branch feat/idea`, from the maestri-workspace skill), then recruit onto it with `--floor "Experiment"`. The recruit works in the floor's own checkout (a git worktree) on its own branch while you and the user stay on the ground floor. When the work is done and committed, `maestri floor land "Experiment"` (also from the maestri-workspace skill, from the ground) brings the branch back.

**Floor status:** when you hand a recruit a task on a floor, ask it to keep `maestri floor status` current (start, milestones, `--state blocked` when it needs the user, `--state review` when ready), and end every task prompt with the ask back line (`maestri ask "Your Name" "<result>"`, from the base `maestri` skill), so the recruit tells you when it's done instead of waiting to be checked. `maestri floor list` shows every floor's status, so read it to see how the work stands instead of checking each recruit. Post a one-line summary for the user on the ground with `maestri floor status "2 of 3 floors in review" --floor "Ground"`.

### `maestri recruit "New Name" --preset "Codex" --replace "Old Name"`

Swaps which agent runs on an existing teammate, **in place**. The terminal node survives, so its connections (notes, portals, peer ropes), canvas position, and any routines targeting it are all preserved; only the process restarts with the new agent. When the user asks to replace a teammate's agent (say, swap Claude for Codex), always use this instead of `dismiss` + `recruit`: dismissing deletes the node, and a note or portal wired only to that recruit becomes unreachable from the CLI.

- `--preset` or `--command` is required to boot a different agent. Prefer `--preset`; with a bare `--command`, the terminal's type and icon follow the program when it matches one of the user's presets, otherwise the terminal is labeled Custom. Maestro powers only change with an explicit `--preset`.
- `--account` moves the teammate to another account (names from `maestri preset list`; `"Default"` goes back to the CLI's existing login). Alone, it keeps the agent, role, and look and changes only the account; with `--preset`, it overrides the account the preset pins. The process restarts fresh either way.
- The positional name renames the teammate; omit it to keep the current name.
- `--role` reassigns the role in the same swap; omit it to keep the current role.
- `--dir` changes the working directory; `--floor` is not supported because the node stays where it is.
- Chat history does not survive the restart (same as `role assign`), so brief the new agent with `maestri ask` afterwards.

```
maestri recruit "Codex" --preset "Codex" --replace "Claude"
maestri recruit --preset "opencode" --replace "Scout"     # keeps the name "Scout"
maestri recruit --replace "Scout" --account "Work"        # same agent, on the Work account
```

### `maestri band create "Name" ["Agent" ...] [--without-me] [--floor "Experiment"] [--workspace "Frontend"] [--icon I] [--color C]`

Gathers your team into a band: one node on the canvas holding the agents as a team, where every member reaches every other and a member who joins later is wired to everything the band is connected to.

**Only create a band when the user asks for one.** Recruits are easier for the user to follow as separate terminals on the canvas, so leave them loose by default; recruiting a team, or being asked to assemble one, is not a request for a band.

- With no agent names, it gathers **you and everyone connected to you on your floor** who is not already in another band. That is usually what the user wants.
- Name agents to choose who goes in, for example to split your team into several bands.
- **--without-me** leaves you out of the band. Use it when you coordinate several bands, and stay outside them, wired to each, instead of joining one. A terminal is in one band at a time.
- A band lives on one floor. You can only gather agents you are connected to.
- **--floor**, **--workspace**: band the team you recruited onto another floor or into another workspace, there; it gathers the agents you reach on that floor, and anywhere but your own floor you coordinate the band from outside. A band in another workspace goes by `"Band @ Workspace"`, the name every band command takes.
- **--icon**, **--color**: give the band a look that fits its name; `maestri arrange --help` lists the choices. Optional.

When the user asks for their team in a band: recruit the teammates first, then `maestri band create "Name"` gathers you and all of them. Anyone you recruit onto your floor after that joins your band on its own. A band needs at least two agents to be created.

```
maestri band create "Frontend Squad"                         # you + everyone connected to you
maestri band create "Reviewers" "Hawk" "Lynx" --without-me    # a band you coordinate from outside
```

### `maestri band add "Band" "Agent"` / `maestri band remove "Band" "Agent"` / `maestri band dissolve "Band"`

Change a band you are in or connected to. `add` brings in a connected agent from the band's floor (it joins everything the band is connected to). `remove` takes an agent out (you can take yourself out), and `dissolve` breaks the band up. Neither stops anyone: members go back to the canvas, running, with their connections. A band left with one member dissolves on its own. To stop an agent, use `maestri dismiss`.

`maestri list` shows your bands, with their members beneath each, and marks the one you are in.

### `maestri dismiss "Name"`

Stops the recruit's process and removes its terminal from the canvas. You can only dismiss agents you're currently connected to.

**Careful:** dismissing deletes the node, and any note or portal wired only to that recruit is orphaned. Nothing in the CLI can reconnect it afterwards; only the user can, by dragging a rope in the app. To swap a teammate's agent, use `maestri recruit --replace` instead.

```
maestri dismiss "Reviewer"
```

### `maestri connect "From" "To"`

Wires two things together. Each side can be a recruit (agent name), a band, a sticky note, a fichário, or a portal; a rope to a band reaches every member. Without this, recruits can only talk back to you. Both endpoints must be inside your team tree: yourself, a direct recruit, or any note/portal that you or a direct recruit is wired to (exactly what `maestri list` shows you). Note and portal ropes live on a single floor, so those pairs must share a floor; only agent-to-agent connections span floors. A portal can only be wired to an agent (so the agent can drive it via `maestri portal ...`); notes don't connect to portals, and two portals share a session only by linking them on the canvas.

```
maestri connect "Reviewer" "Tester"          # agent ↔ agent — they can `maestri ask` each other
maestri connect "design-spec" "Reviewer"     # note ↔ agent — share a context note with a recruit
maestri connect "design-spec" "scratch-pad"  # note ↔ note — chain notes so each one can read the other
maestri connect "Tester" "Staging Portal"    # agent ↔ portal — let the agent drive that portal
```

Connecting two recruits alone isn't enough — recruits won't know to use the new connection unless their role says so. Bake the collaboration into each peer's role prompt: name the other recruit and instruct it to use `maestri ask "Peer Name" "..."` at the relevant points (e.g. "When you finish a draft, run `maestri ask \"Reviewer\" \"please review\"` and incorporate their feedback"). For shared notes, mention the note name in the recruit's role so it knows to read it. For a connected portal, name it and tell the recruit to drive it with `maestri portal ...` (e.g. "Use the `Staging Portal` to verify the page renders — `maestri portal snapshot \"Staging Portal\"`").

### `maestri preset list`

Lists the agent presets the user has configured (e.g. `Claude Code`, `Codex`, `Shell`, plus any custom presets). Run this before `maestri recruit ... --preset "..."` so you pass a name that actually exists. A preset whose CLI has more than one account lists the account names on its line (`accounts: "Default", "Work"`): those are the values for `--account`. A preset pinned to one adds which (`; starts on "Work"`).

### `maestri preset show / create / set / delete`

Manage the user's presets when they ask you to: the agents on their Quick Start, and the values `--preset` takes.

```
maestri preset show "Claude Code"
maestri preset create "Claude Opus" --command "claude --model opus" --account "Work"
maestri preset set "Claude Opus" --maestro on --quick-start off
maestri preset set "Claude Opus" --name "Opus" --command "claude --model opus --verbose"
maestri preset delete "Opus"
```

- `--command` is one line, run as typed in a new terminal. Without it the preset is a plain shell.
- `--account` takes an account name of that command's CLI, as `maestri preset list` prints them, or `"Default"`.
- `--maestro`, `--chat` (start in chat mode) and `--quick-start` take `on` or `off`. Options you leave out stay as they are.
- `create` and `set` reply with the preset as it now stands, so there's no need to `show` it after.
- You don't pick the color or the icon: a new preset gets a random color, and its CLI's icon when Maestri knows the CLI or else a random one, and the user changes both in Settings.
- Deleting a preset changes nothing for terminals already made from it.

**Keep session resume working.** Maestri resumes an agent's conversation after a restart by reading the resume line the agent prints when it exits, and it finds that line by the name of the program the command launches. When the user wants a wrapper (fixed flags, environment variables, a different shell's config), write it into the command so it still launches the agent directly:

- the agent's own flags after it: `claude --dangerously-skip-permissions --model opus`
- environment variables in front: `ANTHROPIC_BASE_URL=http://localhost:4000 claude`
- a full path: `/opt/homebrew/bin/codex --yolo`
- a shell wrapper, to load that shell's config: `fish -c "claude --model opus"`

A personal script (`cc`) or a runner in front (`op run -- claude`, `npx …`) hides the agent: its terminals start over instead of resuming. Prefer folding what the script does into the command as above.

### `maestri role list`

Lists the role presets visible from your workspace, grouped into "Current workspace" roles (scoped to the workspace you're in) and "Global" roles (visible everywhere).

### `maestri role create "Name" "Prompt" [--scope current|global]`

Adds a new role preset the user (and you) can assign to recruits. The prompt is the system instruction the recruit sees as `<your_assigned_role>`. Be specific — name + prompt should leave no doubt about the recruit's scope.

New roles are **scoped to your current workspace by default**, since most roles reference one project's context. Make the judgment call: if the role is genuinely reusable across projects (e.g. a generic "Code Reviewer"), pass `--scope global`; if it names files, branches, or conventions of this project, keep the default.

Bake collaboration discoverability into the prompt:

- **Tell the recruit to run `maestri list` before asking anyone anything.** Recruits don't see the team graph automatically — without this nudge they'll either work in isolation or invent peers that don't exist. A single line like "Run `maestri list` to see your connected teammates and any shared notes before delegating or asking questions." is enough.
- If the recruit has a *specific* peer to talk to, also name that peer explicitly: e.g. "When you finish a draft, run `maestri ask \"Reviewer\" \"please review\"` and incorporate their feedback." Specific instructions beat the generic `list` hint when the collaboration pattern is fixed.
- If a shared note is part of the workflow, name it: e.g. "Read `design-spec` before starting and write progress to `scratch-pad`."
- If the recruit owns a portal (you wired one to it, or it created its own), name it and point at the `maestri portal` commands: e.g. "You have the `Staging Portal` — drive it with `maestri portal snapshot/click/fill` to verify the UI."

```
maestri role create "API Specialist" "You own the payments API in this repo. Keep endpoints consistent with docs/api-conventions.md. Run `maestri list` to see your teammates and shared notes."
maestri role create "Code Reviewer" "Review code for correctness, style, and safety. Never edit files — only respond with findings. Run `maestri list` to see who else is on the team and any shared notes you should read." --scope global
```

### `maestri role show "Name"`

Prints a role's full prompt. `maestri role list` only shows a truncated preview.

### `maestri role edit "Name" "old text" "new text" [--scope current|global]`

Replaces a substring inside a role's prompt. `--scope` rescopes the role — `current` limits it to the workspace you're in, `global` makes it visible everywhere — and also works on its own when you only want to change the scope:

```
maestri role edit "Code Reviewer" --scope global
```

You can only scope roles to your own workspace, never to a different one.

### `maestri role write "Name" "full new prompt"`

Replaces a role's prompt entirely.

### `maestri role assign "Recruit Name" "Role Name"`  (or `--none` to clear)

Retargets an existing recruit to a different role *without* dismissing it. The recruit's name, canvas position, and every connection (notes, peer ropes) are preserved; only the agent process restarts so it picks up the new role files. Use this instead of `dismiss` + `recruit` when you just need to swap the role on an existing teammate. To swap the agent program itself (say, Claude to Codex), use `maestri recruit --replace` the same way.

```
maestri role assign "Anvil" "Product Manager"     # swap roles
maestri role assign "Anvil" --none                # clear role, recruit goes back to vanilla
```

Chat history is lost in the restart (same as `role edit`), but the topology survives.

## Workflow

1. **Take stock first** — `maestri list`. If a connected teammate already has a fitting role, skip straight to step 5 and delegate to them. Do not recruit a second copy of someone you already have.
2. **Plan the gaps** — only after step 1, decide which roles are genuinely missing.
3. **Define roles** — `maestri role list` to see what already exists, `maestri role create` to fill gaps.
4. **Recruit** each missing teammate with a distinctive codename and `--role` so each boots into the right mindset and reads as its own character on the canvas. Don't reuse the role name as the recruit name.
5. **Optional** — `maestri connect` recruits to each other when they need to collaborate without you in the middle.
6. **Delegate** with `maestri ask "Name" "task..."` (from the base `maestri` skill), ending each task with the ask back line so the teammate reports to you in full when it's done. To kick off several teammates at once, use `maestri ask --batch '{"Name A": "task...", "Name B": "task..."}'` — it fires the prompts in parallel and returns once every teammate finishes, so independent work runs concurrently instead of one after another.

Use `maestri list` at any point to see your current team and their roles. As a Maestro you also see each teammate's own connections (agents, portals, notes) nested beneath it, so you know exactly what a recruit is wired to before a `--replace` or a rewire. That tree is also your reach, on any floor of your workspace: a teammate's notes and portals resolve by name for you, so you can `note read` a recruit's note or drive its portal directly instead of relaying through `ask`.
```


### Anexo I — Instalador global corrigido

Fonte: instalar-skills-global.ps1

```powershell
# Executar em PowerShell com acesso à rede e à pasta global do usuário.
# Não modifica skills existentes. Usa o instalador oficial do Codex.
[CmdletBinding()]
param(
    [string]$Destination = (Join-Path $env:USERPROFILE '.agents/skills'),
    [string]$PythonPath,
    [switch]$ListOnly
)
$ErrorActionPreference = 'Stop'
$codexRoot = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE '.codex' }
$helper = Join-Path $codexRoot 'skills/.system/skill-installer/scripts/install-skill-from-github.py'
if (-not (Test-Path -LiteralPath $helper)) { throw "Instalador oficial ausente: $helper" }
if (-not $PythonPath) {
    $launcher = Get-Command py -ErrorAction SilentlyContinue
    if ($launcher) { $PythonPath = $launcher.Source }
    else {
        $python = Get-Command python -ErrorAction SilentlyContinue
        if (-not $python) { throw 'Informe -PythonPath com o caminho de um Python funcional.' }
        $PythonPath = $python.Source
    }
}
& $PythonPath --version
if ($LASTEXITCODE -ne 0) { throw 'Python indisponível.' }
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$headers = @{ 'User-Agent' = 'TestaFila-Skills-Installer'; 'Accept' = 'application/vnd.github+json' }
$sources = @(
    @{ Repo = 'MengTo/Skills'; Pattern = '^agent-skills/[^/]+/[^/]+/SKILL\.md$'; Required = @() },
    @{ Repo = 'codeswithroh/tastemaker'; Pattern = '^skills/tastemaker/SKILL\.md$'; Required = @('tastemaker') },
    @{ Repo = 'Owl-Listener/designer-skills'; Pattern = '/skills/[^/]+/SKILL\.md$'; Required = @() },
    @{ Repo = 'emalorenzo/three-agent-skills'; Pattern = '^skills/r3f-best-practices/SKILL\.md$'; Required = @('r3f-best-practices') },
    @{ Repo = 'openai/plugins'; Pattern = '/skills/(react-three-fiber-game|web-3d-asset-pipeline)/SKILL\.md$'; Required = @('react-three-fiber-game', 'web-3d-asset-pipeline') }
)
$plan = @()
foreach ($source in $sources) {
    $repoInfo = Invoke-RestMethod -Uri "https://api.github.com/repos/$($source.Repo)" -Headers $headers
    $commit = Invoke-RestMethod -Uri "https://api.github.com/repos/$($source.Repo)/commits/$($repoInfo.default_branch)" -Headers $headers
    $tree = Invoke-RestMethod -Uri "https://api.github.com/repos/$($source.Repo)/git/trees/$($commit.sha)?recursive=1" -Headers $headers
    if ($tree.truncated) { throw "Árvore incompleta: $($source.Repo)" }
    $paths = @($tree.tree | Where-Object { $_.type -eq 'blob' -and $_.path -match $source.Pattern } |
        ForEach-Object { $_.path -replace '/SKILL\.md$', '' } | Sort-Object -Unique)
    if ($paths.Count -eq 0) { throw "Nenhuma skill no padrão esperado de $($source.Repo). Verifique a estrutura; nada será presumido." }
    foreach ($required in $source.Required) {
        if (-not ($paths | Where-Object { ($_ -split '/')[-1] -eq $required })) {
            throw "Skill solicitada ausente em $($source.Repo): $required. Não substituída por outra."
        }
    }
    # Espelhos do mesmo nome podem existir em integrações diferentes. Preferir caminho menor.
    $paths = @($paths | Group-Object { ($_ -split '/')[-1] } | ForEach-Object {
        $_.Group | Sort-Object Length | Select-Object -First 1
    })
    foreach ($path in $paths) {
        $name = ($path -split '/')[-1]
        $plan += [pscustomobject]@{
            Repo = $source.Repo; Ref = $commit.sha; Path = $path; Name = $name
            Exists = (Test-Path -LiteralPath (Join-Path $Destination $name))
        }
    }
}
$collisions = @($plan | Group-Object Name | Where-Object Count -gt 1)
if ($collisions.Count -gt 0) {
    throw "Nomes duplicados entre repositórios: $($collisions.Name -join ', '). Resolver explicitamente antes de instalar."
}
$plan | Format-Table Repo, Name, Exists -AutoSize
if ($ListOnly) { Write-Host 'Somente inventário. Nenhuma skill instalada.'; return }
New-Item -ItemType Directory -Path $Destination -Force | Out-Null
foreach ($group in ($plan | Group-Object Repo)) {
    $pending = @($group.Group | Where-Object { -not $_.Exists })
    if ($pending.Count -eq 0) { continue }
    $skillPaths = @($pending | ForEach-Object Path)
    # O ZIP de openai/plugins inclui caminhos de plugins não solicitados que podem
    # exceder o limite do Windows. Sparse checkout busca apenas as skills pedidas.
    $method = if ($group.Name -eq 'openai/plugins') { 'git' } else { 'auto' }
    & $PythonPath $helper --repo $group.Name --ref $pending[0].Ref --dest $Destination --method $method --path @skillPaths
    if ($LASTEXITCODE -ne 0) { throw "Falha em $($group.Name). Pode haver instalação parcial; não reportar conclusão." }
}
foreach ($entry in $plan) {
    if (-not (Test-Path -LiteralPath (Join-Path (Join-Path $Destination $entry.Name) 'SKILL.md'))) {
        throw "Verificação final falhou: $($entry.Name)"
    }
}
$manifest = Join-Path $PSScriptRoot 'skills-install-manifest.json'
$plan | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $manifest -Encoding UTF8
Write-Host "Skills verificadas em $Destination. Existentes foram preservadas (origem não revalidada)."
Write-Host 'As novas skills estarão disponíveis no próximo turno do Codex. Outros agentes devem verificar seu diretório de descoberta.'
Write-Host "Inventário/revisões: $manifest"

```


### Anexo J — Inventário completo das skills solicitadas e revisões

Fonte: skills-install-manifest.json. Coluna Exists omitida porque registra o estado anterior à última execução. Instalação final concluída pelo usuário e verificada pelo script.

| Repositório | SHA | Caminho | Nome |
|---|---|---|---|
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-cloth-material | 3d-cloth-material |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-falling-leaves | 3d-falling-leaves |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-four-seasons | 3d-four-seasons |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-high-poly-models | 3d-high-poly-models |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-high-resolution-textures | 3d-high-resolution-textures |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-metal-material | 3d-metal-material |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-orbit-inspect-demo | 3d-orbit-inspect-demo |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-paper-material | 3d-paper-material |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-retina-resolution | 3d-retina-resolution |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-sky-background | 3d-sky-background |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-sky-rays | 3d-sky-rays |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-ultra-realistic-water | 3d-ultra-realistic-water |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-underwater-god-rays | 3d-underwater-god-rays |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-virtual-tour | 3d-virtual-tour |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-wood-lighting-scorecard | 3d-wood-lighting-scorecard |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/3d/3d-wood-material | 3d-wood-material |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/article-prompts-to-skills | article-prompts-to-skills |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/audit-reference-originality | audit-reference-originality |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/audit-verify-explain-grade-5 | audit-verify-explain-grade-5 |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/browser-video-recording | browser-video-recording |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/build-daily-inspiration-sites | build-daily-inspiration-sites |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/codex-gpt-image-2-5-flare | codex-gpt-image-2-5-flare |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/daily-ui-inspiration-capture | daily-ui-inspiration-capture |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/elevenlabs-tts | elevenlabs-tts |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/generate-reference-inspired-brand-worlds | generate-reference-inspired-brand-worlds |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/html-to-interaction-prompts | html-to-interaction-prompts |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/implement-fog-of-war | implement-fog-of-war |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/iterate-until-verified | iterate-until-verified |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/optimize-web-animations | optimize-web-animations |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/performance-profiling | performance-profiling |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/publish-project-to-github | publish-project-to-github |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/stitched-full-page-capture | stitched-full-page-capture |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/video-to-superprompt | video-to-superprompt |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/web-technique-to-skill | web-technique-to-skill |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/write-like-meng-on-x | write-like-meng-on-x |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/codex/x-bookmark-quote-posts | x-bookmark-quote-posts |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-combat/fire-smoke-skill-vfx | fire-smoke-skill-vfx |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-combat/game-dev-combat-animation | game-dev-combat-animation |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-combat/game-dev-combat-skill-polish | game-dev-combat-skill-polish |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-combat/ice-frost-skill-vfx | ice-frost-skill-vfx |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-combat/lightning-energy-skill-vfx | lightning-energy-skill-vfx |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-combat/water-crystal-skill-vfx | water-crystal-skill-vfx |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/author-game-levels | author-game-levels |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/build-game-audio-feedback | build-game-audio-feedback |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/build-game-camera-controls | build-game-camera-controls |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/build-game-changelog | build-game-changelog |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/build-game-inventory | build-game-inventory |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/build-game-map-editor | build-game-map-editor |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/build-game-monster-system | build-game-monster-system |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/build-hybrid-game-assets | build-hybrid-game-assets |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/build-isometric-arpg | build-isometric-arpg |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/build-mobile-threejs-games | build-mobile-threejs-games |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/build-rigged-game-assets | build-rigged-game-assets |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/build-threejs-enemy-systems | build-threejs-enemy-systems |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/build-vesperfall-review-assets | build-vesperfall-review-assets |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/create-game-vfx | create-game-vfx |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/design-action-combat | design-action-combat |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/design-game-encounters | design-game-encounters |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/optimize-threejs-games | optimize-threejs-games |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/ship-web-games | ship-web-games |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/test-playable-web-games | test-playable-web-games |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/game-development/tune-enemy-ai | tune-enemy-ai |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/illustration/illustration-bold-pop | illustration-bold-pop |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/illustration/illustration-flat | illustration-flat |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/illustration/illustration-flat-with-black | illustration-flat-with-black |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/illustration/illustration-framed-panel | illustration-framed-panel |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/illustration/illustration-grainy-gouache | illustration-grainy-gouache |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/illustration/illustration-halftone-line | illustration-halftone-line |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/illustration/illustration-ink-sketch | illustration-ink-sketch |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/illustration/illustration-isometric-mono | illustration-isometric-mono |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/illustration/illustration-line-interior | illustration-line-interior |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/illustration/illustration-one-line | illustration-one-line |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/illustration/illustration-outlined-cartoon | illustration-outlined-cartoon |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/illustration/illustration-teal-spot | illustration-teal-spot |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/illustration/illustration-two-colour-brush | illustration-two-colour-brush |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/illustration/illustration-vintage-emblem | illustration-vintage-emblem |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/media/aura-asset-images | aura-asset-images |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/media/unsplash-asset-images | unsplash-asset-images |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/ui/audit-ai-design-slop | audit-ai-design-slop |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/ui/design-first-ui-prompting | design-first-ui-prompting |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/ui/no-ai-design-slop | no-ai-design-slop |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/add-mouse-driven-orbit | add-mouse-driven-orbit |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/add-shader-cursor-trail | add-shader-cursor-trail |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/agency-grid-layout-minimal | agency-grid-layout-minimal |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/ambient-section-particles | ambient-section-particles |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/animation-on-scroll | animation-on-scroll |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/animation-systems | animation-systems |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/atmosphere-background | atmosphere-background |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/background-grid-webgl | background-grid-webgl |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/beam-glow-states | beam-glow-states |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/beautiful-shadows | beautiful-shadows |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/blue-cloudy-clean-modern | blue-cloudy-clean-modern |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/blue-laser-clean-glass-layout | blue-laser-clean-glass-layout |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/book-serif-index | book-serif-index |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/bright-green-tech-system-webgl | bright-green-tech-system-webgl |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/build-awwwards-quality-sites | build-awwwards-quality-sites |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/build-interactive-particle-trail | build-interactive-particle-trail |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/build-threejs-scroll-worlds | build-threejs-scroll-worlds |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/build-wireframe-scan-reveal | build-wireframe-scan-reveal |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/cinematic-gsap-lenis-motion-system | cinematic-gsap-lenis-motion-system |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/cinematic-scroll-storytelling | cinematic-scroll-storytelling |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/clean-minimal-beige-light-mode | clean-minimal-beige-light-mode |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/cobejs | cobejs |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/company-logos | company-logos |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/container-lines | container-lines |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/corner-diagonals | corner-diagonals |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/corner-lasers | corner-lasers |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/css-alpha-masking | css-alpha-masking |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/css-border-gradient | css-border-gradient |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/dark-blue-contrasting-clean | dark-blue-contrasting-clean |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/dark-glass-clean-layout | dark-glass-clean-layout |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/dither-background | dither-background |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/dither-laser-dark-mode | dither-laser-dark-mode |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/documentary-brutalist-agency | documentary-brutalist-agency |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/editorial-portfolio-chapters | editorial-portfolio-chapters |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/editorial-service-booking | editorial-service-booking |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/editorial-tech | editorial-tech |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/falling-leaves | falling-leaves |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/fire-paper-loader | fire-paper-loader |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/framed-grid-layout | framed-grid-layout |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/framed-tech-dark-border-gradient | framed-tech-dark-border-gradient |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/funky-purple-container-tech | funky-purple-container-tech |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/glass-dark-mode-clock | glass-dark-mode-clock |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/glass-dark-ui | glass-dark-ui |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/globe-gl | globe-gl |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/globe-particles | globe-particles |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/gooey-blob-system | gooey-blob-system |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/gsap | gsap |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/gsap-scrolltrigger-storytelling | gsap-scrolltrigger-storytelling |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/high-contrast-skeuomorphic-clean | high-contrast-skeuomorphic-clean |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/horizontal-scroll-scenes | horizontal-scroll-scenes |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/html-demo | html-demo |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/image-first-grid-layout | image-first-grid-layout |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/landing-page | landing-page |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/light-mode-paper-technical | light-mode-paper-technical |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/liquid-metal-border | liquid-metal-border |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/marquee-loop | marquee-loop |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/masked-reveal | masked-reveal |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/matterjs | matterjs |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/mesh-gradient-dark-blue-clean | mesh-gradient-dark-blue-clean |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/nested-container-clean-agency | nested-container-clean-agency |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/nested-container-frames | nested-container-frames |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/number-details | number-details |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/operational-enterprise-ai | operational-enterprise-ai |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/orange-clean-paper-saas | orange-clean-paper-saas |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/paper-cinder-transition | paper-cinder-transition |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/pointer-trail-emitter | pointer-trail-emitter |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/pricing-page | pricing-page |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/product-proof-saas | product-proof-saas |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/progressive-blur | progressive-blur |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/reveal-hover-effect | reveal-hover-effect |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/scroll-progress-timeline | scroll-progress-timeline |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/scroll-scrubbed-visual-sequence | scroll-scrubbed-visual-sequence |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/scroll-scrubbed-word-reveal | scroll-scrubbed-word-reveal |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/scroll-world-storytelling | scroll-world-storytelling |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/shaders-cursor-ripples | shaders-cursor-ripples |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/skeuomorphic-ui | skeuomorphic-ui |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/solar-duotone-bold | solar-duotone-bold |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/split-layout-technical | split-layout-technical |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/staggered-word-reveal | staggered-word-reveal |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/tailwindcss | tailwindcss |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/tech-green-dark-mode-modern | tech-green-dark-mode-modern |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/technical-wireframe-info-layout | technical-wireframe-info-layout |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/thinking-orbs | thinking-orbs |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/threejs | threejs |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/threejs-landscape | threejs-landscape |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/threejs-towers | threejs-towers |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/threejs-weather | threejs-weather |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/unicorn-studio | unicorn-studio |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/vantajs | vantajs |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/webgl-3d-object | webgl-3d-object |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/webgl-landing-steering | webgl-landing-steering |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/web-design/webgl-laser | webgl-laser |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/workflow/workflow-progress-screenshots | workflow-progress-screenshots |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/workflow/workflow-score-to-target | workflow-score-to-target |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/workflow/workflow-ship-change | workflow-ship-change |
| MengTo/Skills | 398cd41c86ba42fbb30e944ae507f463648f08b7 | agent-skills/workflow/workflow-threads-manager | workflow-threads-manager |
| codeswithroh/tastemaker | 792a28a820ec4e9159ef8621c21a6c88528bbf2e | skills/tastemaker | tastemaker |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | designer-toolkit/skills/case-study | case-study |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | designer-toolkit/skills/design-negotiation | design-negotiation |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | designer-toolkit/skills/design-rationale | design-rationale |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | designer-toolkit/skills/design-system-adoption | design-system-adoption |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | designer-toolkit/skills/design-token-audit | design-token-audit |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | designer-toolkit/skills/presentation-deck | presentation-deck |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | designer-toolkit/skills/ux-writing | ux-writing |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-ops/skills/design-critique | design-critique |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-ops/skills/design-debt-audit | design-debt-audit |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-ops/skills/design-impact-reporting | design-impact-reporting |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-ops/skills/design-qa-checklist | design-qa-checklist |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-ops/skills/design-review-process | design-review-process |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-ops/skills/design-sprint-plan | design-sprint-plan |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-ops/skills/handoff-spec | handoff-spec |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-ops/skills/team-workflow | team-workflow |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-ops/skills/version-control-strategy | version-control-strategy |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-research/skills/affinity-diagram | affinity-diagram |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-research/skills/behavioural-analytics | behavioural-analytics |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-research/skills/card-sort-analysis | card-sort-analysis |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-research/skills/diary-study-plan | diary-study-plan |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-research/skills/empathy-map | empathy-map |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-research/skills/interview-script | interview-script |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-research/skills/jobs-to-be-done | jobs-to-be-done |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-research/skills/journey-map | journey-map |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-research/skills/qual-quant-triangulation | qual-quant-triangulation |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-research/skills/research-repository | research-repository |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-research/skills/summarize-interview | summarize-interview |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-research/skills/survey-design | survey-design |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-research/skills/usability-test-plan | usability-test-plan |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-research/skills/user-persona | user-persona |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-systems/skills/accessibility-audit | accessibility-audit |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-systems/skills/component-spec | component-spec |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-systems/skills/design-system-governance | design-system-governance |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-systems/skills/design-token | design-token |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-systems/skills/documentation-template | documentation-template |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-systems/skills/icon-system | icon-system |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-systems/skills/localization-design | localization-design |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-systems/skills/motion-system | motion-system |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-systems/skills/naming-convention | naming-convention |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-systems/skills/pattern-library | pattern-library |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | design-systems/skills/theming-system | theming-system |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/animation-principles | animation-principles |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/conversational-ux | conversational-ux |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/doherty-threshold | doherty-threshold |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/error-handling-ux | error-handling-ux |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/feedback-patterns | feedback-patterns |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/fitts-law | fitts-law |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/form-design | form-design |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/gesture-patterns | gesture-patterns |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/hicks-law | hicks-law |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/interfaces-that-feel | interfaces-that-feel |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/jakobs-law | jakobs-law |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/loading-states | loading-states |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/micro-interaction-spec | micro-interaction-spec |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/millers-law | millers-law |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/navigation-patterns | navigation-patterns |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/onboarding-design | onboarding-design |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/peak-end-rule | peak-end-rule |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/search-ux | search-ux |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/serial-position-effect | serial-position-effect |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/state-machine | state-machine |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/teslers-law | teslers-law |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | interaction-design/skills/zeigarnik-effect | zeigarnik-effect |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | prototyping-testing/skills/a-b-test-design | a-b-test-design |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | prototyping-testing/skills/accessibility-test-plan | accessibility-test-plan |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | prototyping-testing/skills/click-test-plan | click-test-plan |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | prototyping-testing/skills/concept-selection | concept-selection |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | prototyping-testing/skills/heuristic-evaluation | heuristic-evaluation |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | prototyping-testing/skills/parallel-concepts | parallel-concepts |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | prototyping-testing/skills/prototype-strategy | prototype-strategy |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | prototyping-testing/skills/test-scenario | test-scenario |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | prototyping-testing/skills/user-flow-diagram | user-flow-diagram |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | prototyping-testing/skills/wireframe-spec | wireframe-spec |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/aesthetic-usability | aesthetic-usability |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/color-system | color-system |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/dark-mode-design | dark-mode-design |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/data-visualization | data-visualization |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/illustration-style | illustration-style |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/law-of-closure | law-of-closure |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/law-of-common-region | law-of-common-region |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/law-of-continuity | law-of-continuity |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/law-of-figure-ground | law-of-figure-ground |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/law-of-proximity | law-of-proximity |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/law-of-similarity | law-of-similarity |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/layout-grid | layout-grid |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/platform-conventions | platform-conventions |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/readable-measure | readable-measure |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/responsive-design | responsive-design |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/spacing-system | spacing-system |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/typography-scale | typography-scale |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/visual-hierarchy | visual-hierarchy |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ui-design/skills/von-restorff-effect | von-restorff-effect |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ux-strategy/skills/business-design | business-design |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ux-strategy/skills/competitive-analysis | competitive-analysis |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ux-strategy/skills/content-strategy | content-strategy |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ux-strategy/skills/design-brief | design-brief |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ux-strategy/skills/design-principles | design-principles |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ux-strategy/skills/experience-map | experience-map |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ux-strategy/skills/information-architecture | information-architecture |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ux-strategy/skills/metrics-definition | metrics-definition |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ux-strategy/skills/north-star-vision | north-star-vision |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ux-strategy/skills/opportunity-framework | opportunity-framework |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ux-strategy/skills/service-blueprint | service-blueprint |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | ux-strategy/skills/stakeholder-alignment | stakeholder-alignment |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | visual-critique/skills/critique-affordance | critique-affordance |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | visual-critique/skills/critique-brand-consistency | critique-brand-consistency |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | visual-critique/skills/critique-color | critique-color |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | visual-critique/skills/critique-composition | critique-composition |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | visual-critique/skills/critique-information-density | critique-information-density |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | visual-critique/skills/critique-typography | critique-typography |
| Owl-Listener/designer-skills | 9a6930cf84a822eb458624bd11c61aac5bbdf224 | visual-critique/skills/critique-visual-hierarchy | critique-visual-hierarchy |
| emalorenzo/three-agent-skills | f950f95ae3b13581546e6d6d8b2f88a08eb3e577 | skills/r3f-best-practices | r3f-best-practices |
| openai/plugins | 0722921d5542fc593105c27bd52630babd8b8c2a | plugins/game-studio/skills/react-three-fiber-game | react-three-fiber-game |
| openai/plugins | 0722921d5542fc593105c27bd52630babd8b8c2a | plugins/game-studio/skills/web-3d-asset-pipeline | web-3d-asset-pipeline |
