import Icon from './Icon.jsx';

function highlightText(text, searchTerm) {
  if (!searchTerm.trim()) return text;
  const escaped = searchTerm.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'ig'));
  return parts.map((part, index) => part.toLowerCase() === searchTerm.toLowerCase() ? <mark key={index}>{part}</mark> : part);
}

function InlineText({ text, searchTerm }) {
  return <>{text.split(/(`[^`]+`)/g).map((part, index) => part.startsWith('`') && part.endsWith('`') ? <code key={index}>{highlightText(part.slice(1, -1), searchTerm)}</code> : <span key={index}>{highlightText(part, searchTerm)}</span>)}</>;
}

function MarkdownContent({ content, searchTerm = '' }) {
  const blocks = content.split(/```([\w-]*)\n?([\s\S]*?)```/g);
  const nodes = [];
  for (let index = 0; index < blocks.length; index += 3) {
    const text = blocks[index];
    if (text) text.split(/\n{2,}/g).forEach((paragraph, paragraphIndex) => {
      const lines = paragraph.split('\n');
      nodes.push(<p key={`p-${index}-${paragraphIndex}`}>{lines.map((line, lineIndex) => <span key={lineIndex}>{lineIndex ? <br /> : null}<InlineText text={line} searchTerm={searchTerm} /></span>)}</p>);
    });
    if (blocks[index + 2] !== undefined) {
      const language = blocks[index + 1] || 'code';
      const code = blocks[index + 2].trim();
      nodes.push(<div className="code-block" key={`code-${index}`}><div className="code-header"><span>{language}</span><button type="button" onClick={() => navigator.clipboard?.writeText(code)}><Icon name="copy" size={13} /> Copy code</button></div><pre><code>{code}</code></pre></div>);
    }
  }
  return <div className="markdown-content">{nodes}</div>;
}

export default MarkdownContent;
