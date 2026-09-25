import { useEffect, useRef } from 'react';
import Message from './Message.jsx';
import LoadingMessage from './LoadingMessage.jsx';

function MessageList({ messages, searchTerm, isLoading, onRegenerate, onMessageAction }) {
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages.length, isLoading]);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleMessages = normalizedSearch ? messages.filter(({ content }) => content.toLowerCase().includes(normalizedSearch)) : messages;

  return <div className="message-list" aria-live="polite">
    <div className="date-divider"><span>{normalizedSearch ? `${visibleMessages.length} matching messages` : 'Conversation history'}</span></div>
    {visibleMessages.length ? visibleMessages.map((message) => <Message key={message.id} message={message} searchTerm={searchTerm} isLast={message.id === messages[messages.length - 1]?.id} onRegenerate={onRegenerate} onMessageAction={onMessageAction} />) : <div className="message-search-empty">No messages match “{searchTerm}”.</div>}
    {isLoading && <LoadingMessage />}
    <div ref={bottomRef} />
  </div>;
}

export default MessageList;
