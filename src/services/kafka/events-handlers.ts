import { getBotService } from '../bot-service'
import {
  KafkaEvent,
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

      //TODO поправить сообщение на человеческое
      await bot.api.sendMessage(telegramId, 'USER_CREATED_FROM_TG_BOT_EVENT')
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

      //TODO поправить сообщение на человеческое
      await bot.api.sendMessage(telegramId, 'USER_UPDATED_FROM_TG_BOT_EVENT')
    } catch (err) {
      throw err
    }
  }
}
