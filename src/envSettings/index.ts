import { cleanEnv, str } from 'envalid'
import dotenv from 'dotenv'

dotenv.config()

export const env = cleanEnv(process.env, {
  PORT: str(),
  TELEGRAM_BOT_TOKEN: str(),
  ADMIN_TELEGRAM_ID: str()
})
