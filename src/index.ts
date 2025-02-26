import Fastify from 'fastify'
import fastifyEnv from '@fastify/env'
import { Bot } from 'grammy'
import { connectKafka } from './kafka'
import { schema, Envs } from './envSettings'
import { startHandler } from './handlers/startHandler'

const options = {
  schema,
  dotenv: true
}

const app = Fastify({
  logger: true
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

const bot = new Bot(envs['TELEGRAM_BOT_TOKEN'])

bot.command('start', startHandler)

const start = async () => {
  try {
    connectKafka()

    const port = Number(envs['PORT'])
    const address = await app.listen({ port, host: '0.0.0.0' })

    app.log.info(`FinRunner tg bot is running on ${address}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
