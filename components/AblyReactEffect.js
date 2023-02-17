import Ably from 'ably/promises'
import { useEffect } from 'react'

// This file makes this API call to get a token with a clientId just once
// Then it provides the function useChannel, which lets users interact with the channel
// using that token. 
const ably = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest'})

export function useChannel(channelName, callbackOnMessage) {
  // Use the token to get the channel from the Ably-JS SDK.
  const channel = ably.channels.get(channelName)

  // This is run each time the component is rendered.
  // We're going to use it to subscribe to a specific channel, and trigger
  // callbackOnMessage whenever a message is received
  const onMount = () => {
    channel.subscribe(msg => { callbackOnMessage(msg)})
  }

  // This is run each time the component is unmounted before it's re-rendered.
  // This is where we unsubscribe from a channel, which stops accidental multiples
  // of connections.
  const onUnmount = () => {
    channel.unsubscribe()
  }

  // This uses the above functions correctly.
  // It also returns onUnmount for React to use
  const useEffectHook = () => {
    onMount()
    return () => { onUnmount () }
  }

  useEffect(useEffectHook)

  return [channel, ably]
}