import 'reflect-metadata';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { DatabaseService } from '../database/database.service.ts';
import { runMigrations } from '../database/migrations.ts';
import { createAuth } from '../auth/auth.service.ts';

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });
  const db = new DatabaseService();
  try {
    const email = process.env.ADMIN_EMAIL ?? await rl.question('Email: ');
    const name = process.env.ADMIN_NAME ?? await rl.question('Nome: ');
    const password = process.env.ADMIN_PASSWORD;
    if (!password) throw new Error('Defina ADMIN_PASSWORD no ambiente; a senha nunca é aceita por argv.');
    runMigrations(db);
    const auth = createAuth(db, { allowProvisioning: true });
    const result = await auth.api.signUpEmail({ body: { email, name, password } });
    console.log(`Usuário criado: ${result.user.email} (${result.user.id})`);
  } finally { rl.close(); db.close(); }
}
main().catch((e: unknown) => { console.error('Falha ao provisionar usuário:', e); process.exitCode = 1; });
