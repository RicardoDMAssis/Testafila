# TestaFila

Editor manual e simulador 3D para planejar filas em metros, com login, projetos
por proprietário e persistência SQLite. Aplicação atual: Next.js + NestJS.

**O MVP WebAR ainda não está concluído.** Câmera, mapeamento por hit-test e
realinhamento não estão integrados ao editor. O diagnóstico `/xr-check` é um
spike experimental separado, cuja validação física continua pendente.

## Comece aqui

- [Documentação e índice](docs/README.md)
- [Relatório para o colega](docs/PASSAGEM-COLEGA.md)
- [Instalar, configurar, criar login e executar](docs/EXECUCAO-LOCAL.md)
- [O que falta e diferença em relação aos PDFs](docs/REQUISITOS-ESTADO-ATUAL.md)

Não há conta ou senha fixa no código. Cada instalação cria uma conta pelo CLI.

## Comandos

Na raiz deste repositório, depois de seguir a configuração de ambiente:

```powershell
npm ci
npm run migrate:api
npm run dev:api
```

Em outro terminal:

```powershell
npm run dev:web
```

Acesse `http://localhost:3000`. Os comandos genéricos `npm run dev` e
`npm run build` ainda pertencem ao protótipo Vite preservado do colega.
Para a aplicação atual, use `dev:web`, `dev:api`, `build:web` e `build:api`.

Documentação detalhada está em `docs`; `AGENTS.md` permanece na raiz como
instrução operacional dos agentes. Não versionar `.env`, SQLite ou credenciais.
