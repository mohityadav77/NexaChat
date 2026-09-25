import Icon from './Icon.jsx';
import ConversationItem from './ConversationItem.jsx';

function Sidebar({ conversations, activeConversationId, searchValue, isOpen, user, onSearchChange, onNewChat, onSelectConversation, onRenameConversation, onDeleteConversation, onOpenAuth, onClose }) {
  const recentConversations = conversations.filter(({ group }) => group === 'Recent');
  const earlierConversations = conversations.filter(({ group }) => group === 'Earlier');

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`} aria-label="Conversation navigation">
      <div className="sidebar-topline">
        <a className="brand" href="/" aria-label="NexaChat home" onClick={(event) => event.preventDefault()}>
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /><span /></span>
          <span className="brand-name">nexa<span>chat</span></span>
        </a>
        <button className="icon-button mobile-only" type="button" aria-label="Close navigation" onClick={onClose}><Icon name="close" /></button>
      </div>
      <button className="new-chat-button" type="button" onClick={onNewChat}><Icon name="plus" size={17} strokeWidth={2.2} /><span>New conversation</span><kbd>⌘ K</kbd></button>
      <label className="sidebar-search">
        <Icon name="search" size={17} /><span className="sr-only">Search conversations</span>
        <input type="search" value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search conversations" />
        <kbd>/</kbd>
      </label>
      <div className="conversation-scroll-area">
        <ConversationSection label="Recent" conversations={recentConversations} activeConversationId={activeConversationId} onSelectConversation={onSelectConversation} onRenameConversation={onRenameConversation} onDeleteConversation={onDeleteConversation} />
        <ConversationSection label="Earlier" conversations={earlierConversations} activeConversationId={activeConversationId} onSelectConversation={onSelectConversation} onRenameConversation={onRenameConversation} onDeleteConversation={onDeleteConversation} />
        {!conversations.length && <div className="no-results"><span className="no-results-icon"><Icon name="search" size={17} /></span><p>No conversations found</p><span>Try a different search term.</span></div>}
      </div>
      <div className="sidebar-footer">
        <div className="usage-card"><div className="usage-heading"><span className="usage-icon"><Icon name="sparkleSmall" size={15} /></span><span>Workspace usage</span><strong>64%</strong></div><div className="usage-track"><span /></div><p>1,280 of 2,000 monthly credits</p></div>
        <button className="profile-button" type="button" onClick={onOpenAuth}>
          <span className="avatar avatar--user">{user?.name?.slice(0, 2).toUpperCase() || 'AR'}</span>
          <span className="profile-copy"><strong>{user?.name || 'Arjun Rao'}</strong><small>{user ? 'Connected account' : 'Sign in for sync'}</small></span>
          <Icon name="dots" size={17} />
        </button>
      </div>
    </aside>
  );
}

function ConversationSection({ label, conversations, activeConversationId, onSelectConversation, onRenameConversation, onDeleteConversation }) {
  if (!conversations.length) return null;
  return <section className="conversation-section" aria-labelledby={`section-${label}`}>
    <div className="section-label" id={`section-${label}`}><span>{label}</span><span className="section-count">{conversations.length}</span></div>
    <div className="conversation-list">
      {conversations.map((conversation) => <ConversationItem key={conversation.id} conversation={conversation} isActive={conversation.id === activeConversationId} onSelect={onSelectConversation} onRename={onRenameConversation} onDelete={onDeleteConversation} />)}
    </div>
  </section>;
}

export default Sidebar;
