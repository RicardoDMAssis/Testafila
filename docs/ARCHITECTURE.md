# Arquitetura atual

Atualizado em 27/10/2026. Este arquivo descreve o código entregue; a proposta
original está em [histórico](historico/ARQUITETURA-PLANEJADA-2026-10-22.md).

## Organização

```text
apps/web/app/            Next App Router, páginas e proxy /api
apps/web/components/     formulários, dashboard e editor
apps/web/scene/          visualizador R3F e interação 3D
apps/web/lib/            cliente HTTP, construção de cena e mensagens
apps/api/src/           Nest, Better Auth, projetos e banco
apps/api/test/          testes Node sobre módulos compilados e Nest real
contracts/              ProjectScene, comandos e props comuns
src/domain/             geometria pura, medição e filas
tests/domain/           testes do domínio, sem React/Three/banco
docs/                   documentação canônica e evidências
src/*.js, index.html    protótipo Vite original preservado
```

O spike `/xr-check` é isolado em `apps/web/app/xr-check` e
`apps/web/components/xr-check`. Ele prepara diagnóstico e validação de
WebXR/hit-test; não transforma o editor em AR nem persiste medições.

## Fluxo de dados

Navegador → Next (porta 3000) → proxy `/api/**` → Nest (127.0.0.1:3001)
→ Better Auth/serviços de projeto → SQLite.

O navegador só usa URLs de mesma origem. `API_BASE_URL` é lida pelo servidor
Next. Cookie/Set-Cookie e Origin são preservados; headers de conexão e
encaminhamento recebidos são filtrados. Timeout upstream: 10 s; falha: 502.

Better Auth gerencia credenciais e sessões. Não há signup público ou senha fixa.
Provisionamento usa instância administrativa de CLI e `ADMIN_PASSWORD` no ambiente.
O Nest deriva ownerId da sessão e filtra leitura/escrita por projeto e proprietário.
Mutações rejeitam origens não confiáveis. Segredo e banco ficam fora do Git.

## Documento e consistência

`contracts/project.ts` define um único ProjectScene JSON versionado: ambiente,
medição, áreas restritas, postes, fitas, percursos, pessoas e simulação.
Uma unidade = um metro; Y aponta para cima, piso em XZ. Câmera, Mesh,
seleção, preview de arraste e histórico não são persistidos.

A UI aplica comandos imutáveis e guarda até 100 ações. Operação inválida
preserva o documento anterior. Frontend e servidor usam `validateQueueScene`.
O servidor valida shape, finitude, limites, geometria e referências antes de salvar.
SQLite grava atomicamente com `expectedRevision`; versão divergente retorna 409.
JSON acima de 100 KiB recebe 413. Não há substituto via localStorage.

Medição manual não atesta precisão física. Evidência vazia não implica erro zero.
Rotas são independentes de fitas; capacidade é geométrica, com alocação gulosa
entre percursos e limite de 10.000 pessoas. Não é certificação de evacuação/ABNT.

## Renderização

R3F é carregado no cliente, com Canvas em `frameloop=demand`, DPR até 1,5,
floor XZ triangulado, paredes translúcidas, grade, vistas e OrbitControls sem
inércia. Cotas/rótulos usam sprites de CanvasTexture local, sem roots Html/Drei.
Cancelamento/captura são tratados no DOM conectado, com limpeza e bloqueio de
clique residual. Geometrias, materiais, texturas e listeners têm descarte.

Identidade: [design de referência](referencias/DESIGN-SLIDE-CINTIA.md).
Não há Tailwind ou Prisma na implementação atual; menções na proposta antiga
são históricas. Dependências efetivas estão nos manifests e package-lock.

## XR e entrega

A implementação de AR no editor, alinhamento de projeto salvo, diagnóstico em
aparelho real, HTTPS e precisão em 20 m permanecem etapas separadas. Um spike
ou acesso à câmera não substitui esses requisitos. Consulte
[pendências XR](XR-PENDENCIAS.md) e [estado dos requisitos](REQUISITOS-ESTADO-ATUAL.md).
