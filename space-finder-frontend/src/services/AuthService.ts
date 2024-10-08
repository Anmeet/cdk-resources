import { SignInOutput, fetchAuthSession, signIn } from '@aws-amplify/auth'
import { Amplify } from 'aws-amplify'
import { AuthStack } from '../../../space-finder/outputs.json'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'

const awsRegion = 'us-east-1'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: AuthStack.SpaceUserPoolId,
      userPoolClientId: AuthStack.SpaceUserPoolClientId,
      identityPoolId: AuthStack.SpaceIdentityPoolId,
    },
  },
})

export class AuthService {
  private user: SignInOutput | undefined
  public jwtToken: string | undefined
  private temporaryCredentials: object | undefined
  private userName: string = ''

  public isAuthorized() {
    if (this.user) {
      return true
    }
    return false
  }

  /**
   * call only after login
   */
  public async getIdToken() {
    const authSession = await fetchAuthSession()
    return authSession.tokens?.idToken?.toString()
  }

  public async login(
    userName: string,
    password: string
  ): Promise<Object | undefined> {
    try {
      const signInOutput: SignInOutput = await signIn({
        username: userName,
        password: password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH',
        },
      })
      this.user = signInOutput
      this.userName = userName
      this.jwtToken = await this.getIdToken()
      return signInOutput
    } catch (error) {
      console.error(error)
      return undefined
    }
  }

  public async getTemporaryCredentials() {
    if (this.temporaryCredentials) {
      return this.temporaryCredentials
    }
    this.temporaryCredentials = await this.generateTemporaryCredentials()
    return this.temporaryCredentials
  }

  public getUserName() {
    return this.userName
  }

  private async generateTemporaryCredentials() {
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${AuthStack.SpaceUserPoolId}`
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        clientConfig: {
          region: awsRegion,
        },
        identityPoolId: AuthStack.SpaceIdentityPoolId,
        logins: {
          [cognitoIdentityPool]: this.jwtToken!,
        },
      }),
    })
    const credentials = await cognitoIdentity.config.credentials()
    return credentials
  }
}
