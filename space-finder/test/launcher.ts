import { handler } from '../src/services/spaces/handler'

process.env.AWS_REGION = 'us-east-1'
process.env.TABLE_NAME = 'SpaceTable-0affcfc309cf'

handler(
  {
    httpMethod: 'POST',
    // queryStringParameters: {
    //   id: '94d65a75-0135-4909-b3e9-2bb35bf5a894',
    // },
    body: JSON.stringify({
      location: 'Dublin',
      name: 'asdf',
    }),
  } as any,
  {} as any
).then((result) => console.log('result', result))
