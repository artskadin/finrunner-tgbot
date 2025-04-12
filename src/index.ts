import Fastify from 'fastify'
import { env } from './envSettings'
import { startHandler } from './handlers/startHandler'
import { kafkaServie } from './services/kafka/kafka-service'
import { KafkaTopics } from './services/kafka/kafka-topics'
import { getBotService } from './services/bot-service'
import { kafkaEventHandlerRegistry } from './services/kafka/event-handler-registry'
import {
  SendOtpToUserHandler,
  UserCreatedFromTgBotHandler,
  UserUpdatedFromTgBotHandler
} from './services/kafka/events-handlers'
import {
  cancelFeedback,
  feedbackHandler,
  sendFeedbackHandler
} from './handlers/feedbackHandlers'

const app = Fastify({
  logger: true
})

app.addHook('onReady', async () => {
  try {
    botService.start()

    await kafkaServie.connect()

    kafkaEventHandlerRegistry.registerHandler(new UserCreatedFromTgBotHandler())
    kafkaEventHandlerRegistry.registerHandler(new UserUpdatedFromTgBotHandler())
    kafkaEventHandlerRegistry.registerHandler(new SendOtpToUserHandler())

    kafkaServie.consume(KafkaTopics.UserEvents)
    kafkaServie.consume(KafkaTopics.AuthEvents)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
})

app.get('/ping', (req, reply) => {
  try {
    reply.send('pong')
  } catch (err) {
    app.log.error(err)
  }
})

const botService = getBotService(env.TELEGRAM_BOT_TOKEN)
const bot = botService.getBot()

bot.command('start', startHandler)
bot.command('feedback', feedbackHandler)

bot.command('cancel_feedback', cancelFeedback)
bot.on('message:text', sendFeedbackHandler)

const start = async () => {
  try {
    const port = Number(env.PORT)
    const address = await app.listen({ port, host: '0.0.0.0' })

    app.log.info(`FinRunner tg bot is running on ${address}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
