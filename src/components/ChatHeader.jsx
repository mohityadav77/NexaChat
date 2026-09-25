import Icon from './Icon.jsx';

function ChatHeader({ conversation, messageSearch, messageSearchOpen, theme, onMessageSearchChange, onToggleMessageSearch, onToggleTheme, onOpenSidebar }) {
  return <header className="chat-header">
    <div className="chat-header-left">
      <button className="icon-button mobile-only" type="button" aria-label="Open navigation" onClick={onOpenSidebar}><Icon name="menu" /></button>
      <div className="breadcrumb desktop-only"><span>My workspace</span><Icon name="chevronDown" size={14} /></div><span className="breadcrumb-divider desktop-only">/</span>
      <div className="current-chat-title"><strong>{conversation?.title || 'New conversation'}</strong><span className="status-pill"><i /> AI online</span></div>
    </div>
    <div className="chat-header-actions">
      {messageSearchOpen && <label className="message-search"><Icon name="search" size={15} /><span className="sr-only">Search current conversation</span><input value={messageSearch} onChange={(event) => onMessageSearchChange(event.target.value)} placeholder="Find in chat" autoFocus /></label>}
      <button className={`header-action ${messageSearchOpen ? 'header-action--active' : ''}`} type="button" onClick={onToggleMessageSearch}><Icon name="search" size={17} /><span className="desktop-only">Search</span><kbd className="desktop-only">⌘ F</kbd></button>
      <button className="icon-button" type="button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={onToggleTheme}><Icon name={theme === 'light' ? 'moon' : 'sun'} size={17} /></button>
      <span className="header-divider" />
      <button className="icon-button" type="button" aria-label="More conversation options"><Icon name="dots" /></button>
    </div>
  </header>;
}

export default ChatHeader;
