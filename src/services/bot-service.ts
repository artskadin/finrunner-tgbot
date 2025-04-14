import {
  Bot,
  Context,
  GrammyError,
  HttpError,
  session,
  SessionFlavor
} from 'grammy'
import { hydrateReply, parseMode, ParseModeFlavor } from '@grammyjs/parse-mode'

interface SessionData {
  isFeedbackMode: boolean
}

export type BotContext = ParseModeFlavor<Context> & SessionFlavor<SessionData>

class BotService {
  private static instance: BotService | null = null
  private bot: Bot<BotContext>

  constructor(token: string) {
    this.bot = new Bot<BotContext>(token)

    this.bot.use(session({ initial: this.initialSession }))
    this.bot.use(hydrateReply)
    // this.bot.api.config.use(parseMode('MarkdownV2'))
    console.log('Telegram bot was initialized')
  }

  private initialSession(): SessionData {
    return {
      isFeedbackMode: false
    }
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

  getBot(): Bot<BotContext> {
    return this.bot
  }

  start(): void {
    this.bot.start()
  }

  catch(): void {
    this.bot.catch((err) => {
      const ctx = err.ctx
      console.error(`Error while handling update ${ctx.update.update_id}:`)
      const e = err.error
      if (e instanceof GrammyError) {
        console.error('Error in request:', e.description)
      } else if (e instanceof HttpError) {
        console.error('Could not contact Telegram:', e)
      } else {
        console.error('Unknown error:', e)
      }
    })
  }

  stop(): void {
    this.bot.stop()
  }
}

export const getBotService = (token?: string) => BotService.getInstance(token)
