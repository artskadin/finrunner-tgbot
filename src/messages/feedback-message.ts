import { escapeMarkdownV2 } from '../utils/escape-markdown-v2'

export function prepareFeedbackMessage({
  fromId,
  fromUsername,
  message
}: {
  fromId: number
  fromUsername: string
  message: string
}) {
  const title = `Сообщение от пользователя @${fromUsername} id:[\`${fromId}\`]`

  return `${title} \n\n ${escapeMarkdownV2(message)}`
}
