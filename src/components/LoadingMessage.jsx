import Icon from './Icon.jsx';

function LoadingMessage() {
  return <div className="message-row message-row--assistant loading-message"><div className="message-avatar message-avatar--assistant"><Icon name="sparkles" size={17} /></div><div className="message-main"><div className="message-meta"><strong>Nexa AI</strong><span>Just now</span></div><div className="loading-bubble"><span /><span /><span /></div><p>AI is thinking...</p></div></div>;
}

export default LoadingMessage;
