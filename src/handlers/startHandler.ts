import { Context } from 'grammy'
import { kafkaServie } from '../services/kafka/kafka-service'
import { KafkaTopics } from '../services/kafka/kafka-topics'

export async function startHandler(ctx: Context) {
  try {
    const tgUsername = ctx.from?.username
    const telegramId = ctx.from?.id

    if (!tgUsername || !telegramId) {
      console.error('tgUsername or tgId is not defined')
      return
    }

    await kafkaServie.send(KafkaTopics.UserEvents, {
      type: 'UPDATE_USER_FROM_TG_BOT_EVENT',
      payload: {
        telegramId: telegramId.toString(),
        tgUsername
      }
    })
  } catch (err) {
    console.error(err)
  }
}
