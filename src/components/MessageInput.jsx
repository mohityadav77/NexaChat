import Icon from './Icon.jsx';

function MessageInput({ value, onChange, onSubmit, disabled }) {
  const handleSubmit = (event) => { event.preventDefault(); onSubmit(); };
  const handleKeyDown = (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } };
  return <div className="composer-wrap">
    <form className="composer" onSubmit={handleSubmit}>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={handleKeyDown} placeholder="Ask Nexa anything..." rows="1" aria-label="Message Nexa AI" disabled={disabled} />
      <div className="composer-footer"><div className="composer-tools"><button type="button" className="composer-tool" aria-label="Attach a file"><Icon name="upload" size={17} /><span className="desktop-only">Attach</span></button><button type="button" className="composer-tool" aria-label="Add a prompt"><Icon name="sparkles" size={16} /><span className="desktop-only">Enhance</span></button></div><div className="composer-hint desktop-only"><kbd>Shift</kbd><span>+</span><kbd>Enter</kbd><span>for new line</span></div><button className="send-button" type="submit" aria-label="Send message" disabled={disabled || !value.trim()}><Icon name="arrowUp" size={18} strokeWidth={2.2} /></button></div>
    </form>
    <p className="composer-disclaimer">Nexa can make mistakes. Check important info.</p>
  </div>;
}

export default MessageInput;
