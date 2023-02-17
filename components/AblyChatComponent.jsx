import React, { useEffect, useState } from 'react'
import { useChannel } from './AblyReactEffect'
import styles from './AblyChatComponent.module.css'

const AblyChatComponent = () => {
  // These 
  let inputBox = null;
  let messageEnd = null;

  // messageText will be bound to textarea element, where messages can be typed
  const [messageText, setMessageText] = useState('')
  // receivedMessages holds the on-screen chat history
  const [receivedMessages, setReceivedMessages] = useState([])
  // messageTextIsEmpty is used to disable the send button when the textarea is empty
  const messageTextIsEmpty = messageText.trim().length === 0;

  // useChannel is a react-hook style API.
  // The useChannel hook instances the SDK just once, then provides functions for its use
  // Make sure to use the functions defined in the useChannel hook, otherwise
  // it can instance SKD multiple times, which can make multiple connections and waste
  // Ably account limits.

  // Using useChannel here subscribes a user to messages from an Ably channel.
  // I give it a channel name, and a callback to be invoked when a message hits that channel.
  const [channel, ably] = useChannel('chat-demo', (message) => {
    // Here we're computing the state that'll be drawn into the message history.
    // These are the messages you'll see when looking at the chat interface.
    // We do that by slicing the last 199 messages from the receivedMessages filter.
    const history = receivedMessages.slice(-199)
    setReceivedMessages([...history, message])
    // Then finally, we take the message history, and combine it with the new message.
    // That means we'll always have 199 messages + 1 new message, stored using the
    // setMessages react useState hook.
  })

  // The following functions handle UI interactions.

  // sendChatMessage publishes new messages to a channel.
  // It uses the channel returned by the useChannel hook.
  // Then it clears the input, and focused on the text area so users can send more messages.
  const sendChatMessage = (messageText) => {
    channel.publish({ name: 'chat-message', data: messageText })
    setMessageText('')
    inputBox.focus()
  }

  // This just calls sendChatMessages
  // It's important because it prevents page refreshing with event.preventDefault()
  const handleFormSubmission = (event) => {
    event.preventDefault()
    sendChatMessages(messageText)
  }

  const handleKeyPress = (event) => {
    event.preventDefault()
    // If message text isn't empty and the user hits 'enter', submit the message
    if (event.charCode !== 13 || messageTextIsEmpty) {
      return;
    }
    sendChatMessage(messageText)
  }

  // We're going to display the elements now, so we're going to map them into <span></span>'s
  const messages = receivedMessages.map((message, index) => {
    // If the message Id matches mine, it's my message, so render it as such
    const author = message.connectionId === ably.connection.id ? "me" : "other"
    return <span key={index} className={styles.message} data-author={author}>{message.data}</span>
  })

  useEffect(() => {
    messageEnd.scrollIntoView({ behavior: 'smooth' })
  })

  return (
    <div className={styles.chatHolder}>
      <div className={styles.chatText}>
        {messages}
        {/* This is an empty div at the bottom of all the messages.
        It gives the above useEffect something to 'grab', so it can scroll to the bottom */}
        <div ref={(element) => { messageEnd = element }}></div>
      </div>
      <form onSubmit={handleFormSubmission} className={styles.form}>
        <textarea
          ref={(element) => { inputBox = element }}
          value={messageText}
          placeholder="Type a message..."
          onChange={e => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.textarea}
        ></textarea>
        <button type="submit" className={styles.button} disabled={messageTextIsEmpty}>Send</button>
      </form>
    </div>
  )
}

export default AblyChatComponent