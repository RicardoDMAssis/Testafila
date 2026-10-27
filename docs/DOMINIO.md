# Domínio de filas

Este documento descreve o módulo puro de edição de filas em `src/domain/queue/index.ts`.
Ele opera sobre um único `ProjectScene` dos contratos congelados. Não usa React,
Three.js, banco, relógio ou geração aleatória. A revisão não altera as assinaturas
de `contracts/project.ts` ou `contracts/queue-editor.ts`.

## Invariantes

- Todas as medidas são metros no plano XZ; a altura é representada pelos campos do
  contrato, não pela geometria do piso.
- O ambiente e as áreas restritas são polígonos simples. Áreas podem encostar na
  parede, mas toda a área precisa caber no ambiente côncavo. A verificação examina
  arestas e intervalos entre cruzamentos, além dos vértices.
- Postes precisam manter o raio da base mais a folga em relação a paredes e áreas,
  e não podem colidir com outros postes. Fitas são segmentos de conexões explícitas:
  precisam caber no ambiente e evitar áreas, paredes, postes não conectados e outras
  fitas. Os próprios postes de origem e destino são permitidos como extremidades.
- Percurso é uma polilinha independente das fitas. Segmentos e footprint corporal
  devem permanecer dentro do ambiente, com folga, e evitar zonas, postes e fitas.
  Arestas nulas, auto-interseções e retornos adjacentes de 180° são rejeitados.
- Pessoas são amostradas por distância acumulada ao longo do percurso em múltiplos do
  espaçamento configurado. O primeiro ponto fica em distância zero; a ponta final só
  entra quando coincide com essa grade. Caches de posição e yaw são derivados do percurso.
- Contato/conflito com zonas, obstáculos e footprint de outras pessoas invalida a
  cena. Uma edição é atômica: comando inválido devolve a mesma referência de cena.
- IDs de ambiente, áreas, vértices, postes, fitas, percursos e pessoas são únicos
  globalmente na cena. Coordenadas e dimensões precisam ser finitas; dimensões físicas
  são positivas e folga não pode ser negativa.
- `environment.confirmedAt: null` é aceito pelo domínio como documento geometricamente
  válido. A confirmação antes de entrar no editor é uma regra de fluxo da interface.

## Exports

- `validateQueueScene(scene)` verifica geometria, integridade, dimensões, IDs,
  posicionamento e caches, devolvendo `{ valid, errors }`.
- `applyQueueCommand(scene, command)` aplica um comando congelado e valida o documento
  resultante. Sucesso devolve a nova cena; falha devolve a cena original sem mutá-la.
- `createQueueHistory(scene)` inicia histórico imutável.
- `executeQueueCommand(history, command)` registra uma ação válida, limita `past` a
  100 cenas e limpa `future` após uma nova edição. Falhas preservam o histórico.
- `undoQueue(history)` e `redoQueue(history)` restauram cenas completas; sem ação
  disponível, retornam o próprio histórico.
- `getQueueStats(scene)` soma o comprimento dos percursos, conta pessoas presentes e
  estima a capacidade conjunta sem contar duas vezes colocações próximas.

## Comandos

| Comando | Efeito |
| --- | --- |
| `area:add`, `area:update`, `area:remove` | Cria, atualiza ou remove uma área; a validação impede invalidar elementos existentes. |
| `post:add`, `post:move`, `post:remove` | Cria, move ou remove poste; remover também apaga fitas dependentes na mesma ação. |
| `belt:add`, `belt:remove` | Gerencia conexões explícitas sem duplicatas nos dois sentidos. Fita não altera percurso. |
| `route:set`, `route:remove` | Cria/atualiza ou remove percurso; remover limpa as pessoas associadas. |
| `people:add`, `people:fill` | Insere após a última pessoa ou substitui o grupo da rota com IDs determinísticos `<idPrefix><índice>`. Preenchimento para no primeiro bloqueio. |
| `person:remove`, `people:clear` | Remove uma pessoa ou limpa um percurso/a cena. |
| `simulation:spacing` | Aceita 0,5, 0,8 ou 1,0 m e redistribui contagem existente até a capacidade segura. |

## Limites e comportamento numérico

- A tolerância geométrica comum é `EPSILON = 1e-7` (unidades do modelo, metros).
  Tangência é tratada de forma inclusiva nas colisões de zonas, objetos e pessoas.
- Geração de pessoas e validação da cena têm teto defensivo de 10.000 pessoas, alinhado
  ao limite informado da API. O servidor também limita o documento serializado a
  100 KiB antes de persistir.
- Capacidade conjunta usa alocação determinística gulosa na ordem de `scene.routes`.
  Cada rota para no primeiro obstáculo ou posição ocupada; o algoritmo não procura uma
  solução combinatória global e a capacidade pode depender da ordem das rotas.
- `getQueueStats` é uma estimativa geométrica. Não representa vazão, evacuação,
  atendimento, comportamento humano ou validação física do espaço.
- A UI traduz detalhes de validação para mensagens orientadas ao usuário. O domínio
  mantém erros diagnósticos para integração e testes; não substitui guards de fluxo,
  autenticação, validação de payload ou limites de persistência do servidor.

## Cobertura verificada

Em 27/10/2026, a suíte de domínio completa executou 116 testes em 20 suítes, sem
falhas, usando Node 24 com `--experimental-strip-types --experimental-test-isolation=none`.
Os casos cobrem geometria côncava, footprint/folga, tangência, áreas, postes e fitas,
retornos e auto-interseções, quinas e extremos, ocupação entre rotas, IDs e caches,
atomicidade, spacing e undo/redo. Há também teste de geração e validação no teto de
10.000 pessoas. TypeScript isolado do motor e dos testes e `git diff --check` passaram.

## Próximas verificações

- Reexecutar build/typecheck integrado da API e testes Nest no ambiente do coordenador
  após incorporar esta revisão; esses comandos não foram executados nesta tarefa.
- Completar QA manual humano de gestos e legibilidade conforme `docs/QA-FECHAMENTO-LOTE-03.md`.
- WebXR/câmera e realinhamento continuam pendentes de implementação e validação em
  aparelhos reais; ver `docs/REQUISITOS-ESTADO-ATUAL.md`.
