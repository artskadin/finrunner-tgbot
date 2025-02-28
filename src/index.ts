import Fastify from 'fastify'
import fastifyEnv from '@fastify/env'
import { schema, Envs } from './envSettings'
import { startHandler } from './handlers/startHandler'
import { kafkaServie } from './services/kafka/kafka-service'
import { KafkaTopics } from './services/kafka/kafka-topics'
import { getBotService } from './services/bot-service'
import { kafkaEventHandlerRegistry } from './services/kafka/event-handler-registry'
import {
  UserCreatedFromTgBotHandler,
  UserUpdatedFromTgBotHandler
} from './services/kafka/events-handlers'

const options = {
  schema,
  dotenv: true
}

const app = Fastify({
  logger: true
})
app.addHook('onListen', async () => {
  try {
    kafkaEventHandlerRegistry.registerHandler(new UserCreatedFromTgBotHandler())
    kafkaEventHandlerRegistry.registerHandler(new UserUpdatedFromTgBotHandler())

    botService.start()

    await kafkaServie.connect()
    kafkaServie.consume(KafkaTopics.UserEvents)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
})

app.register(fastifyEnv, options)
await app.after()
const envs = app.getEnvs<Envs>()

app.get('/ping', (req, reply) => {
  try {
    reply.send('pong')
  } catch (err) {
    app.log.error(err)
  }
})

const botService = getBotService(envs['TELEGRAM_BOT_TOKEN'])
const bot = botService.getBot()

bot.command('start', startHandler)

const start = async () => {
  try {
    const port = Number(envs['PORT'])
    const address = await app.listen({ port, host: '0.0.0.0' })

    app.log.info(`FinRunner tg bot is running on ${address}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
