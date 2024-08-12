import { SNSEvent } from 'aws-lambda'

const webHookUrl =
  'https://hooks.slack.com/services/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'

async function handler(event: SNSEvent, context) {
  for (const record of event.Records) {
    await fetch(webHookUrl, {
      method: 'POST',
      body: JSON.stringify({
        text: `Message: ${record.Sns.Message}`,
      }),
    })
  }
}

export { handler }
