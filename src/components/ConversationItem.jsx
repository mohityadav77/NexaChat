import Icon from './Icon.jsx';

function ConversationItem({ conversation, isActive, onSelect, onRename, onDelete }) {
  return (
    <div className={`conversation-item ${isActive ? 'conversation-item--active' : ''}`}>
      <button className="conversation-select" type="button" onClick={() => onSelect(conversation.id)} aria-current={isActive ? 'page' : undefined}>
        <span className="conversation-icon"><Icon name="file" size={16} /></span>
        <span className="conversation-copy"><strong>{conversation.title}</strong><span>{conversation.preview}</span></span>
        <span className="conversation-time">{conversation.timestamp}</span>
      </button>
      <span className="conversation-actions">
        <button type="button" aria-label={`Rename ${conversation.title}`} onClick={() => onRename(conversation.id, conversation.title)}><Icon name="edit" size={13} /></button>
        <button type="button" aria-label={`Delete ${conversation.title}`} onClick={() => onDelete(conversation.id)}><Icon name="trash" size={13} /></button>
      </span>
    </div>
  );
}

export default ConversationItem;
