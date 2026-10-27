# API TestaFila

NestJS + Better Auth + SQLite. Execute os comandos na raiz do monorepo com npm workspaces; o diretório de trabalho do script é `apps/api`.

## Configuração

Copie `apps/api/.env.example` para `apps/api/.env` e preencha `BETTER_AUTH_SECRET` com pelo menos 32 caracteres aleatórios. Gere o segredo criptográfico conforme EXECUCAO-LOCAL.md; guarde-o apenas no arquivo local ignorado pelo Git ou no gerenciador de segredos do deploy. `APP_ORIGIN` é a origem pública do Next, que encaminha `/api/**` ao Nest. `BETTER_AUTH_URL` é opcional e, quando omitida, usa `APP_ORIGIN`, de modo que URLs e cookies de autenticação apontem para a mesma origem pública. O proxy deve preservar `Origin`, cookies e `Set-Cookie`.

`DATABASE_PATH` opcional aponta para o arquivo SQLite. Sem ela, o caminho é `apps/api/data/testafila.sqlite`, quando os scripts são executados pelo workspace npm. O diretório e banco são criados localmente e não entram no Git.

## Comandos

```sh
npm run migrate:api
npm run user:create
npm run build:api
npm run typecheck:api
npm run test:api
npm run start --workspace @testafila/api
```

O provisionamento pede `ADMIN_EMAIL`, `ADMIN_NAME` e `ADMIN_PASSWORD` pelo ambiente ou solicita email/nome interativamente; a senha nunca é aceita por argumento de linha de comando. Não habilite cadastro público.

O parser JSON padrão do Nest/Express limita o corpo HTTP a 100 KiB; cenas acima desse limite recebem HTTP 413 antes da validação Zod. A validação semântica também limita a quantidade de entidades e coordenadas métricas.

## Testes e configuração completa

Siga [EXECUCAO-LOCAL.md](EXECUCAO-LOCAL.md) para gerar segredo, criar conta e iniciar os processos.
Os testes oficiais importam o compilado; execute build:api antes de test:api.
O comando atual inclui migrações e validação, além das duas integrações Nest.
