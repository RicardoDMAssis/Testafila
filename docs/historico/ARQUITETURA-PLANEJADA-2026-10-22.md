# TestaFila — arquitetura do MVP

Status: decisões iniciais para implementação; aplicação atual ainda é o protótipo Vite.
Atualização do usuário: backend NestJS e banco SQLite nesta etapa. Esta decisão
substitui as propostas anteriores de backend Next e PostgreSQL descritas abaixo.
Organização inicial em apps/web (Next), apps/api (Nest), contracts e src/domain.
O protótipo Vite em src/main.js permanece preservado durante a migração.
Next cuida de interface/proxy de mesma origem; autenticação, autorização, validação
e persistência ficam no Nest. SQLite local fora do Git, com migrações versionadas.
Não expor SQLite no navegador nem substituir persistência por localStorage.
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

Decisão atual: NestJS com SQLite; autenticação por biblioteca mantida com
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
createdAt, updatedAt, revision, schemaVersion, scene JSON serializado/validado em SQLite); Preview opcional com
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
