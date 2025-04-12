import { BotContext } from '../services/bot-service'
import { env } from '../envSettings'
import { prepareFeedbackMessage } from '../messages/feedback-message'

export async function feedbackHandler(ctx: BotContext) {
  try {
    ctx.session.isFeedbackMode = true

    await ctx.replyWithMarkdownV2(
      'Напишите сюда ваши пожелания\\. Для отмены используйте команду \n/cancel\\_feedback'
    )
  } catch (err) {
    console.error(err)
  }
}

export async function sendFeedbackHandler(ctx: BotContext) {
  try {
    if (ctx.session.isFeedbackMode && ctx.from) {
      ctx.session.isFeedbackMode = false

      const resultMessage = prepareFeedbackMessage({
        fromId: ctx.from.id,
        fromUsername: ctx.from.username || 'NO_NAME',
        message: ctx.message?.text || 'NO_MESSAGE'
      })

      await ctx.api.sendMessage(env.ADMIN_TELEGRAM_ID, resultMessage, {
        parse_mode: 'MarkdownV2'
      })
      await ctx.reply('Спасибо за обратную связь!')
    }
  } catch (err) {
    console.error(err)
  }
}

export async function cancelFeedback(ctx: BotContext) {
  try {
    if (ctx.session.isFeedbackMode) {
      ctx.session.isFeedbackMode = false
      ctx.reply('Отменено')
    }
  } catch (err) {
    console.error(err)
  }
}
