export const schema = {
  type: 'object',
  required: ['TELEGRAM_BOT_TOKEN', 'PORT'],
  properties: {
    ['TELEGRAM_BOT_TOKEN']: {
      type: 'string'
    },
    ['PORT']: {
      type: 'string',
      default: 4000
    }
  }
}

export type Envs = {
  TELEGRAM_BOT_TOKEN: string
  PORT: string
}
