import EmptyChat from './EmptyChat.jsx';
import MessageInput from './MessageInput.jsx';
import MessageList from './MessageList.jsx';
import Icon from './Icon.jsx';

function ChatWindow({ conversation, composerValue, messageSearch, isLoading, error, onComposerChange, onPromptSelect, onSendMessage, onRetry, onRegenerate, onMessageAction }) {
  const hasMessages = conversation?.messages?.length > 0;
  return <section className={`chat-window ${hasMessages ? '' : 'chat-window--empty'}`}>
    <div className="chat-content">
      {hasMessages ? <MessageList messages={conversation.messages} searchTerm={messageSearch} isLoading={isLoading} onRegenerate={onRegenerate} onMessageAction={onMessageAction} /> : <EmptyChat onPromptSelect={onPromptSelect} />}
      {error && <div className="error-banner" role="alert"><span className="error-icon">!</span><span><strong>Something went wrong</strong>{error}</span><button type="button" onClick={onRetry}><Icon name="refresh" size={14} /> Retry</button></div>}
    </div>
    <MessageInput value={composerValue} onChange={onComposerChange} onSubmit={onSendMessage} disabled={isLoading} />
  </section>;
}

export default ChatWindow;
