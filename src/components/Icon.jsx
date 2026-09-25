const paths = {
  arrowUp: <path d="m5 12 7-7 7 7M12 5v14" />,
  bookmark: <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.5L6 21V4.75Z" />,
  check: <path d="m5 12 4 4L19 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6.5A1.5 1.5 0 0 0 14.5 5h-8A1.5 1.5 0 0 0 5 6.5v8A1.5 1.5 0 0 0 6.5 16H8" /></>,
  dots: <><circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.2" fill="currentColor" stroke="none" /></>,
  edit: <><path d="m4 16.75-.75 3 3-.75L18.5 6.75a2.12 2.12 0 0 0-3-3L4 16.75Z" /><path d="m13.5 5.75 3 3" /></>,
  file: <><path d="M6.5 3.5h7l4 4v13h-11a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z" /><path d="M13.5 3.5v4h4M8 12h5M8 15h5" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  moon: <path d="M20.5 15.25A8.5 8.5 0 0 1 8.75 3.5 8.5 8.5 0 1 0 20.5 15.25Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  refresh: <><path d="M20 11a8 8 0 0 0-14.9-3M4 5v4h4M4 13a8 8 0 0 0 14.9 3M20 19v-4h-4" /></>,
  search: <><circle cx="10.75" cy="10.75" r="6.25" /><path d="m16 16 4 4" /></>,
  send: <path d="m4 4 16 8-16 8 3-8-3-8Zm3 8h13" />,
  sparkles: <><path d="m12 3 1.35 4.65L18 9l-4.65 1.35L12 15l-1.35-4.65L6 9l4.65-1.35L12 3ZM19 15l.65 2.35L22 18l-2.35.65L19 21l-.65-2.35L16 18l2.35-.65L19 15ZM5 15l.5 1.5L7 17l-1.5.5L5 19l-.5-1.5L3 17l1.5-.5L5 15Z" /></>,
  sparkleSmall: <path d="m12 3 1.2 5.8L19 10l-5.8 1.2L12 17l-1.2-5.8L5 10l5.8-1.2L12 3Z" />,
  sun: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  thumbsDown: <path d="M7 10V4.75A1.75 1.75 0 0 1 8.75 3h.5a2 2 0 0 1 1.94 1.5L12 8h5.5A1.5 1.5 0 0 1 19 9.7l-1.4 7A1.75 1.75 0 0 1 15.88 18h-3.13l-2.7 2.25A1.5 1.5 0 0 1 7.6 19.1V16H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2Z" />,
  thumbsUp: <path d="M7 14v5.25A1.75 1.75 0 0 0 8.75 21h.5a2 2 0 0 0 1.94-1.5L12 16h5.5a1.5 1.5 0 0 0 1.5-1.7l-1.4-7A1.75 1.75 0 0 0 15.88 6h-3.13l-2.7-2.25A1.5 1.5 0 0 0 7.6 4.9V8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2Z" />,
  trash: <><path d="M4 7h16M10 11v5M14 11v5M9 7V4h6v3M6 7l1 13h10l1-13" /></>,
  upload: <><path d="M12 16V4M7.5 8.5 12 4l4.5 4.5" /><path d="M5 16v3h14v-3" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
};

function Icon({ name, size = 18, strokeWidth = 1.8, className = '' }) {
  return <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default Icon;
