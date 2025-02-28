import { Kafka } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'tgbot-service',
  brokers: ['localhost:29092']
})

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'tgbot-service-group' })

export async function connectKafka() {
  try {
    await producer.connect()
    await consumer.connect()
    await consumer.subscribe({ topic: 'user-events', fromBeginning: true })
  } catch (err) {
    throw err
  }
}
