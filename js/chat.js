// ─── Portfolio Chat Widget ────────────────────────────────────
// Connects to the portfolio-chat-api on Railway.
// The API URL is the only thing that needs updating after deploy.

const CHAT_API_URL = 'https://portfolio-chat-api-production.up.railway.app/chat';

const SUGGESTED_QUESTIONS = [
  'What does his 0-to-1 process look like?',
  'What\'s the most complex problem he\'s shipped a solution to?',
  'What makes him different from other PMs?',
  'What\'s his experience with growth and metrics?',
  'How does he balance user needs with business goals?',
];

// ─── State ────────────────────────────────────────────────────
let chatHistory = []; // [{ role: 'user'|'assistant', content: string }]
let isStreaming  = false;

// ─── Build DOM ────────────────────────────────────────────────
function buildWidget() {
  // FAB trigger button
  const fab = document.createElement('button');
  fab.id = 'chat-fab';
  fab.setAttribute('aria-label', 'Chat with Seb');
  fab.innerHTML = `
    <svg id="chat-icon-open" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <svg id="chat-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  `;

  // Panel
  const panel = document.createElement('div');
  panel.id = 'chat-panel';
  panel.setAttribute('aria-label', 'Chat panel');
  panel.innerHTML = `
    <div id="chat-header">
      <div id="chat-header-info">
        <div>
          <div id="chat-name">Chat with Seb 👋</div>
          <div id="chat-status"></div>
        </div>
      </div>
    </div>
    <div id="chat-messages" role="log" aria-live="polite"></div>
    <div id="chat-suggestions"></div>
    <div id="chat-input-row">
      <input id="chat-input" type="text" placeholder="Don't be shy…" maxlength="500" autocomplete="off"/>
      <button id="chat-send" aria-label="Send message">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  injectStyles();
  bindEvents(fab, panel);
  renderSuggestions();
}

// ─── Styles ───────────────────────────────────────────────────
function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* ── FAB ── */
    #chat-fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      width: 52px;
      height: 52px;
      border-radius: 999px;
      background: var(--text-primary, #f0f0f0);
      color: var(--bg, #181818);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 24px rgba(0,0,0,0.5);
      transition: transform 150ms ease, background 150ms ease;
      isolation: isolate;
    }
    #chat-fab::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 999px;
      background: conic-gradient(from 0deg, transparent 55%, rgba(240,240,240,0.9) 75%, transparent 100%);
      animation: fab-spin 2s linear infinite;
      z-index: -1;
    }
    #chat-fab.open::before { animation: none; opacity: 0; }
    @keyframes fab-spin { to { transform: rotate(360deg); } }
    #chat-fab:hover { transform: scale(1.08); }
    #chat-fab:active { transform: scale(0.96); }
    #chat-icon-close { display: none; }

    #chat-fab.open #chat-icon-open  { display: none; }
    #chat-fab.open #chat-icon-close { display: block; }

    /* ── Panel ── */
    #chat-panel {
      position: fixed;
      bottom: 92px;
      right: 28px;
      z-index: 9998;
      width: 400px;
      max-height: 520px;
      background: #1c1c1c;
      border: 1px solid #3a3a3a;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 16px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04);
      overflow: hidden;
      /* hidden by default */
      opacity: 0;
      pointer-events: none;
      transform: translateY(12px);
      transition: opacity 200ms ease, transform 200ms ease;
    }
    #chat-panel.open {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0);
    }

    /* ── Header ── */
    #chat-header {
      padding: 14px 16px;
      background: #272727;
      border-bottom: 1px solid #3a3a3a;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    #chat-header-info { display: flex; align-items: center; gap: 10px; }
    #chat-avatar {
      width: 34px; height: 34px;
      border-radius: 999px;
      overflow: hidden;
      flex-shrink: 0;
    }
    #chat-avatar img {
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
    }
    #chat-name { font-size: 15px; font-weight: 400; color: var(--text-primary, #f0f0f0); text-align: left; }
    #chat-status { font-size: 11px; color: var(--text-secondary, #888); display: flex; align-items: center; gap: 5px; margin-top: 1px; }
    #chat-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #4ade80;
      display: inline-block;
    }
    #chat-dot.thinking { background: #facc15; animation: pulse 1s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

    /* ── Messages ── */
    #chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    }
    #chat-messages:empty { padding: 0; flex: 0; }
    #chat-messages::-webkit-scrollbar { width: 4px; }
    #chat-messages::-webkit-scrollbar-track { background: transparent; }
    #chat-messages::-webkit-scrollbar-thumb { background: var(--border, #2a2a2a); border-radius: 2px; }

    .chat-msg {
      max-width: 82%;
      font-size: 13px;
      line-height: 1.5;
      padding: 9px 12px;
      border-radius: 10px;
      word-break: break-word;
    }
    .chat-msg.user {
      align-self: flex-end;
      background: var(--text-primary, #f0f0f0);
      color: var(--bg, #181818);
      border-bottom-right-radius: 3px;
    }
    .chat-msg.assistant {
      align-self: flex-start;
      background: #272727;
      color: var(--text-primary, #f0f0f0);
      border: 1px solid #3a3a3a;
      border-bottom-left-radius: 3px;
    }
    .chat-msg.error {
      align-self: flex-start;
      background: #2a1111;
      color: #f87171;
      border: 1px solid #3d1515;
      border-bottom-left-radius: 3px;
    }

    /* streaming cursor */
    .chat-cursor::after {
      content: '▋';
      animation: blink 0.7s step-end infinite;
      margin-left: 1px;
      opacity: 0.7;
    }
    @keyframes blink { 0%,100%{opacity:0.7} 50%{opacity:0} }

    /* ── Suggestions ── */
    #chat-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 36px 16px;
    }
    .chat-suggestion {
      font-size: 11px;
      padding: 5px 10px;
      border-radius: 999px;
      border: 1px solid #555;
      background: transparent;
      color: var(--text-secondary, #888);
      cursor: pointer;
      font-family: inherit;
      transition: border-color 150ms, color 150ms;
      white-space: nowrap;
    }
    .chat-suggestion:hover { border-color: var(--text-primary, #f0f0f0); color: var(--text-primary, #f0f0f0); }

    /* ── Input ── */
    #chat-input-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #272727;
      border-top: 1px solid #3a3a3a;
      flex-shrink: 0;
    }
    #chat-input {
      flex: 1;
      background: #242424;
      border: 1px solid #3a3a3a;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 13px;
      color: var(--text-primary, #f0f0f0);
      font-family: inherit;
      outline: none;
      transition: border-color 150ms;
    }
    #chat-input::placeholder { color: var(--text-secondary, #888); }
    #chat-input:focus { border-color: var(--text-primary, #f0f0f0); }

    #chat-send {
      width: 34px; height: 34px;
      border-radius: 6px;
      background: var(--text-primary, #f0f0f0);
      color: var(--bg, #181818);
      border: none;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: opacity 150ms;
    }
    #chat-send:disabled { opacity: 0.35; cursor: not-allowed; }

    /* ── Mobile ── */
    @media (max-width: 480px) {
      #chat-panel {
        right: 12px;
        left: 12px;
        width: auto;
        bottom: 84px;
      }
      #chat-fab { bottom: 20px; right: 20px; }
    }
  `;
  document.head.appendChild(style);
}

// ─── Events ───────────────────────────────────────────────────
function bindEvents(fab, panel) {
  fab.addEventListener('click', () => togglePanel(fab, panel));

  const input  = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');

  sendBtn.addEventListener('click', () => submitMessage());
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !fab.contains(e.target)) {
      closePanel(fab, panel);
    }
  });
}

function togglePanel(fab, panel) {
  if (panel.classList.contains('open')) {
    closePanel(fab, panel);
  } else {
    openPanel(fab, panel);
  }
}

function openPanel(fab, panel) {
  fab.classList.add('open');
  panel.classList.add('open');
  document.getElementById('chat-input').focus();
}

function closePanel(fab, panel) {
  fab.classList.remove('open');
  panel.classList.remove('open');
}

// ─── Suggestions ─────────────────────────────────────────────
function renderSuggestions() {
  const container = document.getElementById('chat-suggestions');
  SUGGESTED_QUESTIONS.forEach(q => {
    const btn = document.createElement('button');
    btn.className = 'chat-suggestion';
    btn.textContent = q;
    btn.addEventListener('click', () => {
      hideSuggestions();
      sendMessage(q);
    });
    container.appendChild(btn);
  });
}

function hideSuggestions() {
  const container = document.getElementById('chat-suggestions');
  container.style.display = 'none';
}

// ─── Messaging ────────────────────────────────────────────────
function submitMessage() {
  const input = document.getElementById('chat-input');
  const text  = input.value.trim();
  if (!text || isStreaming) return;
  input.value = '';
  hideSuggestions();
  sendMessage(text);
}

async function sendMessage(text) {
  if (isStreaming) return;
  isStreaming = true;

  setStatusThinking(true);
  setSendDisabled(true);

  appendMessage('user', text);
  chatHistory.push({ role: 'user', content: text });

  const assistantEl = appendMessage('assistant', '');
  assistantEl.classList.add('chat-cursor');

  try {
    const res = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        history: chatHistory.slice(0, -1), // exclude the message we just added
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Server error' }));
      throw new Error(err.error || 'Server error');
    }

    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let   buffer  = '';
    let   fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') break;

        try {
          const parsed = JSON.parse(data);
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.token) {
            fullText += parsed.token;
            assistantEl.innerHTML = renderMarkdown(fullText);
            assistantEl.classList.add('chat-cursor');
            scrollToBottom();
          }
        } catch (parseErr) {
          if (parseErr.message !== 'Unexpected end of JSON input') {
            throw parseErr;
          }
        }
      }
    }

    assistantEl.classList.remove('chat-cursor');
    chatHistory.push({ role: 'assistant', content: fullText });

  } catch (err) {
    assistantEl.remove();
    appendMessage('error', err.message || 'Something went wrong. Please try again.');
    // Remove the failed user message from history
    chatHistory.pop();
  } finally {
    isStreaming = false;
    setStatusThinking(false);
    setSendDisabled(false);
  }
}

// ─── DOM helpers ─────────────────────────────────────────────
function renderMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function appendMessage(type, text) {
  const el = document.createElement('div');
  el.className = `chat-msg ${type}`;
  if (type === 'assistant') {
    el.innerHTML = renderMarkdown(text);
  } else {
    el.textContent = text;
  }
  document.getElementById('chat-messages').appendChild(el);
  scrollToBottom();
  return el;
}

function scrollToBottom() {
  const msgs = document.getElementById('chat-messages');
  msgs.scrollTop = msgs.scrollHeight;
}

function setStatusThinking(thinking) {
  const dot    = document.getElementById('chat-dot');
  const status = document.getElementById('chat-status');
  dot.className = thinking ? 'thinking' : '';
  const textNode = status.lastChild;
  if (textNode && textNode.nodeType === Node.TEXT_NODE) {
    textNode.textContent = thinking ? 'Thinking…' : '';
  } else {
    status.appendChild(document.createTextNode(thinking ? 'Thinking…' : ''));
  }
}

function setSendDisabled(disabled) {
  document.getElementById('chat-send').disabled = disabled;
  document.getElementById('chat-input').disabled = disabled;
}

// ─── Init ────────────────────────────────────────────────────
buildWidget();
