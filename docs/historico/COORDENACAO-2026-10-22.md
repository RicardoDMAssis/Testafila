# Coordenação e sequência de entrega

## Estado em 22/10/2026

Atualização após fechamento do Lote 3: editor manual/3D integrado, com motor de
filas, persistência, conflitos, retomada de sessão e cancelamento de arraste
verificados localmente. Evidências em QA-LOTE-03.md e QA-FECHAMENTO-LOTE-03.md.
Câmera/WebXR ainda NÃO integrados: faltam implementação e testes físicos, não
apenas o aceite do usuário. Auditoria direta dos PDFs e divergências autorizadas
em REQUISITOS-ESTADO-ATUAL.md. Os estados anteriores abaixo são históricos.

Lote3 iniciado por autorização de continuidade. Escopos/contratos congelados em
SPRINT-03.md: Cedro motor de filas, Trama editor/UI, Prumo interação 3D, coordenador
backend e integração. Três Luna Medium --yolo. Não declarar editor concluído antes
de validação de comandos, persistência e QA do fluxo com pessoas.

Atualização de aceite do lote 2: mapeamento manual retangular/poligonal, revisão 3D,
salvar no SQLite, galeria e reabertura passaram no portal do navegador com Next/Nest.
Build Next final aprovado. Evidências e limites em SPRINT-02.md. Editor completo de
filas e AR ainda pendentes; não declarar MVP completo.

Estado atual: infraestrutura instalada e liberada; frontend Next com build/typecheck
aprovados; backend Nest/SQLite/Better Auth com build/typecheck e integração aprovados;
domínio com 90 testes aprovados. Usuário autorizou próximo lote após retorno da quota.
Plano vigente e donos em SPRINT-02.md: mapeamento manual, visualizador 3D e salvar/abrir
planta. Os bloqueios e status de início abaixo são registro histórico.

Lote iniciado pelo usuário: NestJS no backend e SQLite provisório, substituindo a
proposta PostgreSQL/servidor Next. Equipe recrutada e tarefas enviadas pelo canvas:
Cedro (gemini-3.8-flash-high) apps/api; Trama (gpt-6-luna medium) apps/web;
Prumo (gemini-3.8-flash-high) src/domain e tests/domain. Detalhes e contrato HTTP
em SPRINT-01.md. Execução dos modelos confirmada nas telas dos três terminais.
Consulta npm pelo coordenador falhou com ENOTCACHED em modo only-if-cached;
dependências/build ainda não validados. Não delegar instalação para contornar isso.

### Registro anterior à abertura do lote

Atualização da nova coordenação: passagem recebida por Codex. O CLI nativo deste
terminal confirmou `You: Codex, maestro: true`; listagem de presets e roles funcionou.
Não há agentes, notas ou portais conectados, nem roles definidos. Presets disponíveis:
Claude Code, Codex, Antigravity, OpenCode e Shell. Os modelos/esforços específicos
Luna Medium e Agys/Flash High/Low ainda precisam ser conferidos antes do recrutamento.
O usuário posteriormente confirmou por saída de `agy models` os IDs
`gemini-3.8-flash-high` e `gemini-3.8-flash-low`. Luna Medium foi identificado como
`gpt-6-luna` com `model_reasoning_effort=medium` no catálogo local do Codex.
A pendência de identificação dos modelos está resolvida; não houve recrutamento ainda.
As skills foram instaladas pelo usuário, conforme a passagem posterior. O trecho
de bloqueios abaixo é histórico e não descreve a conexão atual.

Concluído: leitura dos PDFs, especificação e referência visual; diagnóstico do código;
arquitetura inicial e contratos de referência. Aplicação nova ainda não implementada.

Bloqueios históricos da sessão anterior: MAESTRI_PIPE ausente (CLI não conectado ao canvas); GitHub pelo
terminal falha no proxy 127.0.0.1; escrita global fora do workspace não permitida.
Skills então não instaladas (instalação e verificação posterior concluídas).
Presets Flash/Agys ainda não verificados.
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
