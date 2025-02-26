import { Context } from 'grammy'

export async function startHandler(ctx: Context) {
  try {
    const tgUsername = ctx.from?.username

    if (!tgUsername) {
      console.error('tgUsername is not defined')
      return
    }
  } catch (err) {}
}
