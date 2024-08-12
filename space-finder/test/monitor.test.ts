import { SNSEvent } from 'aws-lambda'
import { handler } from '../src/services/monitor/handler'

const snsEvent: SNSEvent = {
  Records: [
    {
      Sns: {
        Message: 'This is AWS Sns test',
      },
    },
  ],
} as any

handler(snsEvent, {})
