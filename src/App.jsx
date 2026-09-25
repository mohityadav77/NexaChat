import { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import ChatHeader from './components/ChatHeader.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import AuthModal from './components/AuthModal.jsx';
import { starterConversations } from './data/starterConversations.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { getAssistantReply } from './services/aiService.js';
import { useTheme } from './context/ThemeContext.jsx';

const createConversation = () => ({
  id: `conversation-${Date.now()}`,
  title: 'New conversation',
  preview: 'Start a new conversation...',
  timestamp: 'Now',
  group: 'Recent',
  messages: [],
});

function App() {
  const [conversations, setConversations] = useLocalStorage('nexachat-conversations', starterConversations);
  const [activeConversationId, setActiveConversationId] = useLocalStorage('nexachat-active-conversation', 'react-performance');
  const [preferences, setPreferences] = useLocalStorage('nexachat-preferences', { messageSearchOpen: false });
  const [conversationSearch, setConversationSearch] = useState('');
  const [messageSearch, setMessageSearch] = useState('');
  const [composerValue, setComposerValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryPayload, setRetryPayload] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authUser, setAuthUser] = useLocalStorage('nexachat-user', null);
  const { theme, toggleTheme } = useTheme();

  const activeConversation = conversations.find(({ id }) => id === activeConversationId) || conversations[0];

  useEffect(() => {
    if (!activeConversation && conversations[0]) setActiveConversationId(conversations[0].id);
  }, [activeConversation, conversations, setActiveConversationId]);

  const filteredConversations = useMemo(() => {
    const normalizedSearch = conversationSearch.trim().toLowerCase();
    if (!normalizedSearch) return conversations;
    return conversations.filter(({ title, preview, messages }) => {
      const messageText = messages.map(({ content }) => content).join(' ');
      return `${title} ${preview} ${messageText}`.toLowerCase().includes(normalizedSearch);
    });
  }, [conversationSearch, conversations]);

  const updateConversation = useCallback((conversationId, updater) => {
    setConversations((currentConversations) => currentConversations.map((conversation) => (
      conversation.id === conversationId ? updater(conversation) : conversation
    )));
  }, [setConversations]);

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setIsSidebarOpen(false);
    setComposerValue('');
    setError('');
  };

  const handleNewChat = () => {
    const newConversation = createConversation();
    setConversations((currentConversations) => [newConversation, ...currentConversations]);
    setActiveConversationId(newConversation.id);
    setConversationSearch('');
    setComposerValue('');
    setError('');
    setIsSidebarOpen(false);
  };

  const handleRenameConversation = (conversationId, currentTitle) => {
    const nextTitle = window.prompt('Rename conversation', currentTitle);
    if (!nextTitle?.trim()) return;
    updateConversation(conversationId, (conversation) => ({ ...conversation, title: nextTitle.trim() }));
  };

  const handleDeleteConversation = (conversationId) => {
    const remaining = conversations.filter(({ id }) => id !== conversationId);
    if (!remaining.length) {
      const replacement = createConversation();
      setConversations([replacement]);
      setActiveConversationId(replacement.id);
      return;
    }
    setConversations(remaining);
    if (conversationId === activeConversationId) setActiveConversationId(remaining[0].id);
  };

  const appendAssistantReply = useCallback(async ({ conversationId, messages, retry = false }) => {
    setIsLoading(true);
    setError('');
    try {
      const reply = await getAssistantReply({ messages, conversationId });
      const assistantMessage = {
        id: `message-${Date.now()}`,
        role: 'assistant',
        content: reply,
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      };
      updateConversation(conversationId, (conversation) => ({
        ...conversation,
        preview: reply.replace(/\s+/g, ' ').slice(0, 54) + (reply.length > 54 ? '...' : ''),
        timestamp: 'Just now',
        messages: retry ? [...messages.slice(0, -1), assistantMessage] : [...messages, assistantMessage],
      }));
      setRetryPayload(null);
    } catch (requestError) {
      setError(requestError.message || 'Nexa could not respond right now.');
      setRetryPayload({ conversationId, messages, retry });
    } finally {
      setIsLoading(false);
    }
  }, [updateConversation]);

  const handleSendMessage = async () => {
    const content = composerValue.trim();
    if (!content || isLoading || !activeConversation) return;

    const userMessage = {
      id: `message-${Date.now()}`,
      role: 'user',
      content,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };
    const nextMessages = [...activeConversation.messages, userMessage];

    updateConversation(activeConversation.id, (conversation) => ({
      ...conversation,
      title: conversation.messages.length ? conversation.title : content.slice(0, 34),
      preview: content.slice(0, 54) + (content.length > 54 ? '...' : ''),
      timestamp: 'Just now',
      messages: nextMessages,
    }));
    setComposerValue('');
    await appendAssistantReply({ conversationId: activeConversation.id, messages: nextMessages });
  };

  const handleRegenerate = async (messageId) => {
    if (!activeConversation || isLoading) return;
    const messageIndex = activeConversation.messages.findIndex(({ id }) => id === messageId);
    const messagesBeforeReply = activeConversation.messages.slice(0, messageIndex);
    if (!messagesBeforeReply.length) return;
    await appendAssistantReply({ conversationId: activeConversation.id, messages: messagesBeforeReply, retry: true });
  };

  const handleMessageAction = (messageId, action) => {
    updateConversation(activeConversation.id, (conversation) => ({
      ...conversation,
      messages: conversation.messages.map((message) => (
        message.id === messageId
          ? { ...message, [action]: action === 'bookmarked' ? !message.bookmarked : true }
          : message
      )),
    }));
  };

  const toggleMessageSearch = () => {
    setPreferences((current) => ({ ...current, messageSearchOpen: !current.messageSearchOpen }));
    if (preferences.messageSearchOpen) setMessageSearch('');
  };

  return (
    <div className="app-shell">
      <Sidebar
        conversations={filteredConversations}
        activeConversationId={activeConversationId}
        searchValue={conversationSearch}
        isOpen={isSidebarOpen}
        user={authUser}
        onSearchChange={setConversationSearch}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        onOpenAuth={() => setAuthOpen(true)}
        onClose={() => setIsSidebarOpen(false)}
      />
      {isSidebarOpen && <button className="sidebar-backdrop" type="button" aria-label="Close navigation" onClick={() => setIsSidebarOpen(false)} />}
      <main className="chat-shell">
        <ChatHeader
          conversation={activeConversation}
          messageSearch={messageSearch}
          messageSearchOpen={preferences.messageSearchOpen}
          theme={theme}
          onMessageSearchChange={setMessageSearch}
          onToggleMessageSearch={toggleMessageSearch}
          onToggleTheme={toggleTheme}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
        <ChatWindow
          conversation={activeConversation}
          composerValue={composerValue}
          messageSearch={messageSearch}
          isLoading={isLoading}
          error={error}
          onComposerChange={setComposerValue}
          onPromptSelect={setComposerValue}
          onSendMessage={handleSendMessage}
          onRetry={() => retryPayload && appendAssistantReply(retryPayload)}
          onRegenerate={handleRegenerate}
          onMessageAction={handleMessageAction}
        />
      </main>
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onAuthenticated={(user) => { setAuthUser(user); setAuthOpen(false); }} />}
    </div>
  );
}

export default App;
