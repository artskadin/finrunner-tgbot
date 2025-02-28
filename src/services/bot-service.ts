import { Bot } from 'grammy'

class BotService {
  private static instance: BotService | null = null
  private bot: Bot

  constructor(token: string) {
    this.bot = new Bot(token!)
    console.log('Telegram bot was initialized')
  }

  public static getInstance(token?: string): BotService {
    if (!BotService.instance) {
      if (!token) {
        throw new Error('Token must be provided to initialize the BotService')
      }
      BotService.instance = new BotService(token)
    }

    return BotService.instance
  }

  getBot(): Bot {
    return this.bot
  }

  start(): void {
    this.bot.start()
  }

  stop(): void {
    this.bot.stop()
  }
}

export const getBotService = (token?: string) => BotService.getInstance(token)
