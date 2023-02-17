import Ably from 'ably/promises'

// This function creates a tokenRequest with my API key from the .env file.
// It returns an AblyToken to the client that made the request.
// The client will use that later, in lieu of the 'real' API key.
//
// The clientId is bound to the AblyToken.
// If a clientId is included, Ably authenticates that bearer as that clientId,
// and the AblyToken may only be used to perform operations on behalf of that clientId.
// When that's happening, the client is considered to be an 'identified client'

// clientId docs: https://ably.com/docs/api/realtime-sdk/authentication#token-details
// 'Identified client' docs: https://ably.com/docs/realtime/authentication#identified-clients
// Auth docs: https://ably.com/docs/realtime/authentication#identified-clients

export default async function handler(req, res) {
  const client = new Ably.Realtime(process.env.ABLY_API_KEY_ROOT)
  const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'ably-chat-integration-demo-client-Id' })
  res.status(200).json(tokenRequestData)
}