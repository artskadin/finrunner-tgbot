import {
  updateUsernameMessage,
  welcomeMessage
} from '../../messages/start-messages'
import { getBotService } from '../bot-service'
import {
  KafkaEvent,
  SendOtpToUserEvent,
  UserCreatedFromTgBotEvent,
  UserUpdatedFromTgBotEvent
} from './event-types'

export interface KafkaEventHandler<T extends KafkaEvent> {
  type: T['type']
  handle(message: T): Promise<void>
}

export class UserCreatedFromTgBotHandler
  implements KafkaEventHandler<UserCreatedFromTgBotEvent>
{
  type = 'USER_CREATED_FROM_TG_BOT_EVENT' as const

  async handle(message: UserCreatedFromTgBotEvent): Promise<void> {
    try {
      const { telegramId } = message.payload

      const botService = getBotService()
      const bot = botService.getBot()

      await bot.api.sendMessage(telegramId, welcomeMessage, {
        parse_mode: 'Markdown'
      })
    } catch (err) {
      throw err
    }
  }
}

export class UserUpdatedFromTgBotHandler
  implements KafkaEventHandler<UserUpdatedFromTgBotEvent>
{
  type = 'USER_UPDATED_FROM_TG_BOT_EVENT' as const

  async handle(message: UserUpdatedFromTgBotEvent): Promise<void> {
    try {
      const { telegramId } = message.payload

      const botService = getBotService()
      const bot = botService.getBot()

      await bot.api.sendMessage(telegramId, updateUsernameMessage, {
        parse_mode: 'Markdown'
      })
    } catch (err) {
      throw err
    }
  }
}

export class SendOtpToUserHandler
  implements KafkaEventHandler<SendOtpToUserEvent>
{
  type = 'SEND_OTP_TO_USER' as const

  async handle(message: SendOtpToUserEvent): Promise<void> {
    try {
      const { telegramId, code } = message.payload

      const botService = getBotService()
      const bot = botService.getBot()

      const text = `Ваш код для входа на сайте: <code>${code}</code>`

      await bot.api.sendMessage(telegramId, text, { parse_mode: 'HTML' })
    } catch (err) {
      throw err
    }
  }
}
