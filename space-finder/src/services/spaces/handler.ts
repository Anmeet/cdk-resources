import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda'

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let message: string
  switch (event.httpMethod) {
    case 'GET':
      message = 'hello from Get'
      break
    case 'POST':
      message = 'hello from Post'
      break
    default:
      break
  }
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  }

  return response
}

export { handler }
