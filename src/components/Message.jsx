import { useState } from 'react';
import Icon from './Icon.jsx';
import MarkdownContent from './MarkdownContent.jsx';

function Message({ message, searchTerm, isLast, onRegenerate, onMessageAction }) {
  const [isCopied, setIsCopied] = useState(false);
  const isAssistant = message.role === 'assistant';
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(message.content); setIsCopied(true); window.setTimeout(() => setIsCopied(false), 1400); } catch { /* Clipboard permissions are non-blocking. */ }
  };

  return <article className={`message-row ${isAssistant ? 'message-row--assistant' : 'message-row--user'}`}>
    <div className={`message-avatar ${isAssistant ? 'message-avatar--assistant' : 'message-avatar--user'}`}>{isAssistant ? <Icon name="sparkles" size={17} /> : 'AR'}</div>
    <div className="message-main">
      <div className="message-meta"><strong>{isAssistant ? 'Nexa AI' : 'You'}</strong><span>{message.time}</span></div>
      <div className="message-bubble"><MarkdownContent content={message.content} searchTerm={searchTerm} /></div>
      {isAssistant && <div className="message-actions">
        <button type="button" onClick={handleCopy} aria-label="Copy response"><Icon name={isCopied ? 'check' : 'copy'} size={15} />{isCopied ? 'Copied' : 'Copy'}</button>
        <button className={message.liked ? 'is-active' : ''} type="button" aria-label="Like response" onClick={() => onMessageAction(message.id, 'liked')}><Icon name="thumbsUp" size={15} /></button>
        <button className={message.disliked ? 'is-active' : ''} type="button" aria-label="Dislike response" onClick={() => onMessageAction(message.id, 'disliked')}><Icon name="thumbsDown" size={15} /></button>
        <button className={message.bookmarked ? 'is-active' : ''} type="button" aria-label="Bookmark response" onClick={() => onMessageAction(message.id, 'bookmarked')}><Icon name="bookmark" size={15} /></button>
        {isLast && <button type="button" onClick={() => onRegenerate(message.id)} aria-label="Regenerate response"><Icon name="refresh" size={15} /></button>}
      </div>}
    </div>
  </article>;
}

export default Message;
