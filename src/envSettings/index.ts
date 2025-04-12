import { cleanEnv, str } from 'envalid'

export const env = cleanEnv(process.env, {
  PORT: str({ default: '4000' }),
  TELEGRAM_BOT_TOKEN: str({
    default: '7288856534:AAG6SN0Cpbo_kPo35hnHNhcFXSWBA84w76w'
  }),
  ADMIN_TELEGRAM_ID: str({ default: '165652330' })
})
