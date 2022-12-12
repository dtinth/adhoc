import { config } from 'dotenv'
import { randomBytes } from 'crypto'
import { existsSync, writeFileSync } from 'fs'

if (!existsSync('.env')) {
  const env = [
    '# Add password here to protect app',
    'BASIC_AUTH_PASSWORD=',
    '',
    '# Secret used to encrypt values',
    'ENCRYPTION_SECRET=' + randomBytes(32).toString('base64'),
  ].join('\n')

  writeFileSync('.env', env)
  console.log('==> Initialized `.env` file with these values:')
  console.log(env)
  console.log()
}

config()
