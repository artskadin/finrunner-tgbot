import { KafkaEvent } from './event-types'
import { KafkaEventHandler } from './events-handlers'

class KafkaEventHandlerRegistry {
  private handlers: Map<string, KafkaEventHandler<KafkaEvent>> = new Map()

  registerHandler<T extends KafkaEvent>(handler: KafkaEventHandler<T>): void {
    this.handlers.set(handler.type, handler)
  }

  getHandler<T extends KafkaEvent>(
    type: string
  ): KafkaEventHandler<T> | undefined {
    return this.handlers.get(type) as KafkaEventHandler<T> | undefined
  }
}

export const kafkaEventHandlerRegistry = new KafkaEventHandlerRegistry()
