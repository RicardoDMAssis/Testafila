# Executar em outra máquina

## Pré-requisitos

- Node.js 24 ou superior e npm compatível com o lockfile (ambiente da equipe: npm 12).
- Git e acesso ao registro npm na instalação inicial.
- Build nativo de `better-sqlite3`: usar binário compatível com o Node ou ferramentas
  de compilação exigidas pelo pacote, se não houver binário disponível na plataforma.

Todos os comandos abaixo partem da raiz do repositório `Testafila`, que contém
`package.json`. A pasta pai usada pela equipe não é um repositório Git.

```powershell
npm ci
Copy-Item apps/api/.env.example apps/api/.env
```

Não sobrescreva um `.env` existente com segredos reais. Edite `apps/api/.env`:

| Variável | Uso |
| --- | --- |
| `BETTER_AUTH_SECRET` | Obrigatória, aleatória, pelo menos 32 caracteres. |
| `APP_ORIGIN` | Origem pública do Next; localmente `http://localhost:3000`. |
| `BETTER_AUTH_URL` | Opcional; padrão igual a APP_ORIGIN. |
| `DATABASE_PATH` | Opcional; executando pelo workspace, padrão `apps/api/data/testafila.sqlite`. |
| `HOST` / `PORT` | API: `127.0.0.1` e `3001`. |

Para gerar um segredo local, por exemplo:

```powershell
node -p "require('node:crypto').randomBytes(48).toString('base64url')"
```

Guarde o valor no `.env` local, não na documentação. O frontend já usa a API
`http://127.0.0.1:3001` por padrão. Se necessário, copie `apps/web/.env.example`
para `apps/web/.env.local` e ajuste `API_BASE_URL`, somente servidor, sem `/api` final.

## Banco e primeiro login

Não há usuário/senha padrão nem signup público. Cada instalação cria sua conta:

```powershell
npm run migrate:api
$env:ADMIN_EMAIL = Read-Host 'E-mail da conta'
$env:ADMIN_NAME = Read-Host 'Nome da conta'
$senhaDaConta = Read-Host 'Senha da conta (mínimo 8 caracteres)' -AsSecureString
$env:ADMIN_PASSWORD = [System.Net.NetworkCredential]::new('', $senhaDaConta).Password
try {
  npm run user:create
} finally {
  Remove-Item Env:\ADMIN_PASSWORD -ErrorAction SilentlyContinue
  Remove-Item Env:\ADMIN_EMAIL -ErrorAction SilentlyContinue
  Remove-Item Env:\ADMIN_NAME -ErrorAction SilentlyContinue
  Remove-Variable senhaDaConta -ErrorAction SilentlyContinue
}
```

Os scripts de migração e conta compilam a API antes de executar o código com
decorators. Conta duplicada é rejeitada. Credenciais de QA de outra máquina não
são portáveis: o banco local não entra no Git. Para redefinir acesso a uma conta
real, planeje procedimento administrativo específico; não habilite signup público.

## Desenvolvimento

Terminal 1:

```powershell
npm run dev:api
```

Terminal 2:

```powershell
npm run dev:web
```

Acesse `http://localhost:3000` e entre com a conta criada. O Nest oferece
`http://127.0.0.1:3001/api/health`. O navegador usa `/api` pelo Next.

## Build e execução compilada

```powershell
npm run build:api
npm run build:web
```

Em terminais separados:

```powershell
npm run start --workspace @testafila/api
npm run start --workspace @testafila/web
```

O entrypoint real da API é `apps/api/dist/apps/api/src/main.js`, não
`apps/api/dist/main.js`. O script do workspace usa o caminho correto.
Pare o Next servido antes de gerar outro build no mesmo diretório `.next`.

## Verificações

```powershell
npm run typecheck:api
npm run build:api
npm run test:api
npm run typecheck:web
npm run build:web
node --experimental-strip-types --test --experimental-test-isolation=none tests/domain/*.test.ts tests/domain/queue/*.test.ts
node --experimental-strip-types --test apps/web/components/xr-check/xr-check-logic.test.ts
git diff --check
```

Os testes API importam o compilado: sempre faça `build:api` após alterar código.
Os testes Nest criam bancos temporários e não devem tocar no banco de uso local.
O typecheck Next depende dos tipos de rotas gerados pelo Next; em clone novo,
rode o build antes de investigar erro por ausência de `.next/types`.

## Celular, HTTPS e limites

### QA automatizado do editor 3D

Com Next e Nest já iniciados, defina `TEST_EMAIL` e `TEST_PASSWORD` no ambiente
para uma conta administrativa criada localmente e execute `npm run test:editor`.
Não grave essas credenciais no repositório. O teste cria projetos nessa conta.
`TEST_BASE_URL` permite mudar a origem (padrão `http://localhost:3000`).

A configuração usa Edge instalado no Windows e WebGL via SwiftShader. Em outro
ambiente, instale o Chromium do Playwright (`npx playwright install chromium`) ou
defina `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Há projetos desktop 1280×900,
mobile 390×844 e small-mobile 320×568; capturas e traces ficam em `test-results`
(ignorado pelo Git). Viewport/touch emulado não substitui aparelho físico.

`localhost` no celular é o próprio celular. Um acesso pela rede local exige URL
acessível, APP_ORIGIN/BETTER_AUTH_URL coerentes e proxy correto. Para cookies
seguros e WebXR em dispositivo, prepare HTTPS confiável no navegador do aparelho;
HTTP de IP local não equivale ao contexto seguro de localhost do computador.

O spike `/xr-check` não deve pedir sessão AR no carregamento. Use seu botão de
início em aparelho compatível, com acesso HTTPS; veja XR-PENDENCIAS.md.
Não há deploy pronto ou compatibilidade universal Android/iOS comprovada.

## Protótipo preservado

`npm run dev`, `npm run dev:legacy`, `npm run build` e `npm run preview` são do
Vite original. Ele continua em `src/*.js`/`index.html` para consulta. Não confundir
esse protótipo com a aplicação Next/Nest e não usar suas alegações de AR universal
como evidência de funcionalidade entregue.

SQLite depende de disco persistente: produção precisa de hospedagem compatível,
backup e segredos configurados. Um frontend em hospedagem estática não substitui
o servidor Nest nem oferece persistência do arquivo SQLite.
