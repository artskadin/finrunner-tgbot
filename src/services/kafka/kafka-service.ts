import { Kafka, Producer, Consumer } from 'kafkajs'
import { KafkaEvent } from './event-types'
import { KafkaTopics } from './kafka-topics'
import { kafkaEventHandlerRegistry } from './event-handler-registry'

class KafkaService {
  private static instance: KafkaService | null = null
  private kafka: Kafka
  private producer: Producer
  private consumer: Consumer
  private isConnected: boolean = false

  private constructor(brokers: string[], clientId: string, groupId: string) {
    this.kafka = new Kafka({
      clientId,
      brokers
    })

    this.producer = this.kafka.producer()
    this.consumer = this.kafka.consumer({ groupId })
  }

  public static getInstance(
    brokers: string[],
    clientId: string,
    groupId: string
  ): KafkaService {
    if (!KafkaService.instance) {
      KafkaService.instance = new KafkaService(brokers, clientId, groupId)
    }

    return KafkaService.instance
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Kafka is already connected')
      return
    }

    try {
      await this.producer.connect()
      await this.consumer.connect()
      this.isConnected = true
      console.log('Kafka connected successfully')
    } catch (err) {
      console.error('Failed to connect to Kafka', err)
      throw err
    }
  }

  async send<T extends KafkaEvent>(
    topic: KafkaTopics,
    message: T
  ): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka is not connected. Call connect() first')
    }

    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }]
      })
    } catch (err) {
      throw err
    }
  }

  async consume(topic: KafkaTopics): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka is not connected. Call connect() first')
    }

    try {
      await this.consumer.subscribe({ topic, fromBeginning: true })

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const data = JSON.parse(message.value!.toString()) as KafkaEvent
          const handler = kafkaEventHandlerRegistry.getHandler(data.type)

          if (handler) {
            await handler.handle(data)
          }
        }
      })
    } catch (err) {
      throw err
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka is already disconnected')
    }

    try {
      await this.producer.disconnect()
      await this.consumer.disconnect()
      this.isConnected = false

      console.log('Kafka disconnected successfully')
    } catch (err) {
      console.error('Failed to disconnect from Kafka', err)
      throw err
    }
  }
}

const brokers = ['localhost:29092']
const clientId = 'tg-bot-service'
const groupId = 'tg-bot-group'

export const kafkaServie = KafkaService.getInstance(brokers, clientId, groupId)
