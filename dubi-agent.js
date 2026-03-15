/* ═══════════════════════════════════════════════════════════════════════════
   DUBI AGENT — AI Chat Widget
   Icon concept: Stylised Burj Khalifa silhouette merged with a neural
   network / circuit motif — representing AI, Dubai, and the Future.
═══════════════════════════════════════════════════════════════════════════ */
(function () {

  /* ── Styles ── */
  const css = `
    /* ── Floating button ── */
    #dubi-agent-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, #E8450A 0%, #FF7A40 100%);
      border: none; cursor: pointer;
      box-shadow: 0 6px 28px rgba(232,69,10,0.50), 0 0 0 0 rgba(232,69,10,0.3);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
      animation: dubiPulse 3s ease-in-out infinite;
    }
    #dubi-agent-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 10px 36px rgba(232,69,10,0.60);
      animation: none;
    }
    @keyframes dubiPulse {
      0%, 100% { box-shadow: 0 6px 28px rgba(232,69,10,0.50), 0 0 0 0 rgba(232,69,10,0.25); }
      50%       { box-shadow: 0 6px 28px rgba(232,69,10,0.50), 0 0 0 12px rgba(232,69,10,0); }
    }
    #dubi-agent-btn svg { width: 34px; height: 34px; }
    #dubi-agent-badge {
      position: absolute; top: -3px; right: -3px;
      background: #0D0D0D; color: #E8450A;
      font-size: 9px; font-weight: 900; letter-spacing: 0.3px;
      border-radius: 10px; padding: 2px 6px;
      border: 1.5px solid #E8450A;
      font-family: 'Inter', sans-serif;
    }

    /* ── Chat window ── */
    #dubi-agent-window {
      position: fixed; bottom: 106px; right: 28px; z-index: 9998;
      width: 380px; max-width: calc(100vw - 40px);
      background: #fff; border-radius: 22px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08);
      display: none; flex-direction: column;
      overflow: hidden; font-family: 'Inter', -apple-system, sans-serif;
      border: 1px solid #EBEBEB;
    }
    #dubi-agent-window.open {
      display: flex;
      animation: dubiSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes dubiSlideUp {
      from { opacity: 0; transform: translateY(24px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* ── Header ── */
    .dubi-agent-header {
      background: linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%);
      padding: 16px 18px;
      display: flex; align-items: center; gap: 12px;
      border-bottom: 1px solid #2A2A2A;
    }
    .dubi-agent-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, #E8450A, #FF7A40);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(232,69,10,0.4);
    }
    .dubi-agent-avatar svg { width: 26px; height: 26px; }
    .dubi-agent-info { flex: 1; }
    .dubi-agent-name {
      font-size: 15px; font-weight: 800; color: #fff;
      letter-spacing: -0.2px;
    }
    .dubi-agent-name span { color: #E8450A; }
    .dubi-agent-status {
      font-size: 11px; color: #4CAF50;
      display: flex; align-items: center; gap: 5px; margin-top: 2px;
    }
    .dubi-agent-status::before {
      content: ''; width: 6px; height: 6px;
      background: #4CAF50; border-radius: 50%; display: inline-block;
      animation: dubiStatusPulse 2s ease-in-out infinite;
    }
    @keyframes dubiStatusPulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
    .dubi-agent-close {
      background: #2A2A2A; border: none; cursor: pointer; color: #888;
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; transition: background 0.15s, color 0.15s;
    }
    .dubi-agent-close:hover { background: #E8450A; color: #fff; }

    /* ── Messages ── */
    .dubi-agent-messages {
      flex: 1; overflow-y: auto; padding: 16px 14px;
      min-height: 260px; max-height: 360px;
      display: flex; flex-direction: column; gap: 10px;
      background: #F7F7F7;
    }
    .dubi-agent-messages::-webkit-scrollbar { width: 3px; }
    .dubi-agent-messages::-webkit-scrollbar-thumb { background: #DDD; border-radius: 3px; }

    .dubi-msg {
      max-width: 88%; padding: 10px 14px; border-radius: 16px;
      font-size: 13px; line-height: 1.55; word-break: break-word;
    }
    .dubi-msg.agent {
      background: #fff; color: #1A1A1A;
      border: 1px solid #E8E8E8;
      border-bottom-left-radius: 4px; align-self: flex-start;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    .dubi-msg.agent strong { color: #E8450A; }
    .dubi-msg.agent ul { margin: 6px 0 0 0; padding-left: 18px; }
    .dubi-msg.agent li { margin-bottom: 3px; }
    .dubi-msg.user {
      background: linear-gradient(135deg, #E8450A, #FF6030);
      color: #fff;
      border-bottom-right-radius: 4px; align-self: flex-end;
      box-shadow: 0 2px 8px rgba(232,69,10,0.3);
    }
    .dubi-msg.typing {
      background: #fff; border: 1px solid #E8E8E8;
      align-self: flex-start;
      display: flex; align-items: center; gap: 5px;
      padding: 12px 16px; border-radius: 16px; border-bottom-left-radius: 4px;
    }
    .dubi-typing-dot {
      width: 7px; height: 7px; background: #CCC; border-radius: 50%;
      animation: dubiDot 1.3s infinite;
    }
    .dubi-typing-dot:nth-child(2) { animation-delay: 0.18s; }
    .dubi-typing-dot:nth-child(3) { animation-delay: 0.36s; }
    @keyframes dubiDot {
      0%,80%,100% { transform: scale(0.65); opacity: 0.4; }
      40% { transform: scale(1.1); opacity: 1; }
    }

    /* ── Suggestions ── */
    .dubi-agent-suggestions {
      padding: 0 14px 10px;
      display: flex; gap: 6px; flex-wrap: wrap;
      background: #F7F7F7;
    }
    .dubi-suggestion {
      background: #fff; border: 1.5px solid #E0E0E0; border-radius: 20px;
      padding: 5px 11px; font-size: 11px; font-weight: 600; color: #555;
      cursor: pointer; transition: all 0.15s;
      font-family: 'Inter', sans-serif;
    }
    .dubi-suggestion:hover { border-color: #E8450A; color: #E8450A; background: #FFF8F6; }

    /* ── Input row ── */
    .dubi-agent-input-row {
      display: flex; gap: 8px; padding: 10px 12px;
      border-top: 1px solid #EFEFEF; background: #fff;
      align-items: flex-end;
    }
    #dubi-agent-input {
      flex: 1; border: 1.5px solid #E8E8E8; border-radius: 12px;
      padding: 9px 12px; font-size: 13px; font-family: 'Inter', sans-serif;
      outline: none; resize: none; max-height: 80px; overflow-y: auto;
      line-height: 1.4;
    }
    #dubi-agent-input:focus { border-color: #E8450A; }
    #dubi-agent-send {
      background: linear-gradient(135deg, #E8450A, #FF6030);
      border: none; border-radius: 12px;
      width: 38px; height: 38px; cursor: pointer; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.2s; box-shadow: 0 2px 8px rgba(232,69,10,0.35);
    }
    #dubi-agent-send:hover { opacity: 0.88; }
    #dubi-agent-send svg { width: 16px; height: 16px; fill: #fff; }

    /* ── Powered by ── */
    .dubi-agent-powered {
      text-align: center; font-size: 10px; color: #C0C0C0;
      padding: 5px 0 7px; background: #fff;
      letter-spacing: 0.3px;
    }
    .dubi-agent-powered span { color: #E8450A; font-weight: 700; }

    /* ── Mobile ── */
    @media (max-width: 480px) {
      #dubi-agent-btn { bottom: 16px; right: 16px; width: 56px; height: 56px; }
      #dubi-agent-window { bottom: 86px; right: 16px; width: calc(100vw - 32px); }
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ── Burj Khalifa + AI circuit icon SVG ── */
  const agentIconSVG = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Burj Khalifa silhouette (stylised) -->
      <g fill="#fff" opacity="0.95">
        <!-- Spire -->
        <rect x="48.5" y="4" width="3" height="18" rx="1.5"/>
        <!-- Upper tower -->
        <rect x="44" y="20" width="12" height="10" rx="2"/>
        <!-- Mid setback 1 -->
        <rect x="41" y="30" width="18" height="8" rx="1.5"/>
        <!-- Mid setback 2 -->
        <rect x="38" y="38" width="24" height="8" rx="1.5"/>
        <!-- Lower tower -->
        <rect x="35" y="46" width="30" height="28" rx="2"/>
        <!-- Base -->
        <rect x="30" y="74" width="40" height="6" rx="2"/>
        <!-- Ground -->
        <rect x="22" y="80" width="56" height="4" rx="2"/>
      </g>
      <!-- AI circuit nodes on the tower -->
      <g fill="#E8450A">
        <circle cx="50" cy="52" r="3"/>
        <circle cx="42" cy="60" r="2.5"/>
        <circle cx="58" cy="60" r="2.5"/>
        <circle cx="46" cy="68" r="2"/>
        <circle cx="54" cy="68" r="2"/>
      </g>
      <!-- Circuit lines -->
      <g stroke="#E8450A" stroke-width="1.2" fill="none" opacity="0.8">
        <line x1="50" y1="52" x2="42" y2="60"/>
        <line x1="50" y1="52" x2="58" y2="60"/>
        <line x1="42" y1="60" x2="46" y2="68"/>
        <line x1="58" y1="60" x2="54" y2="68"/>
        <line x1="46" y1="68" x2="54" y2="68"/>
      </g>
    </svg>`;

  /* ── Build HTML ── */
  const widget = document.createElement('div');
  widget.innerHTML = `
    <button id="dubi-agent-btn" onclick="dubiAgentToggle()" title="Chat with Dubi Agent">
      ${agentIconSVG}
      <span id="dubi-agent-badge">AI</span>
    </button>

    <div id="dubi-agent-window">
      <div class="dubi-agent-header">
        <div class="dubi-agent-avatar">${agentIconSVG}</div>
        <div class="dubi-agent-info">
          <div class="dubi-agent-name">Dubi <span>Agent</span></div>
          <div class="dubi-agent-status">Online — Ready to help</div>
        </div>
        <button class="dubi-agent-close" onclick="dubiAgentToggle()">✕</button>
      </div>

      <div class="dubi-agent-messages" id="dubi-agent-messages"></div>

      <div class="dubi-agent-suggestions" id="dubi-suggestions">
        <button class="dubi-suggestion" onclick="dubiSend('How do I place an ad?')">How do I place an ad?</button>
        <button class="dubi-suggestion" onclick="dubiSend('What are the listing packages?')">Listing packages</button>
        <button class="dubi-suggestion" onclick="dubiSend('How do I contact a seller?')">Contact a seller</button>
        <button class="dubi-suggestion" onclick="dubiSend('Is finance available?')">Finance options</button>
      </div>

      <div class="dubi-agent-input-row">
        <textarea id="dubi-agent-input" rows="1" placeholder="Ask Dubi Agent anything..." onkeydown="dubiKeydown(event)"></textarea>
        <button id="dubi-agent-send" onclick="dubiSendFromInput()">
          <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
      <div class="dubi-agent-powered">Powered by <span>Dubi AI</span></div>
    </div>
  `;
  document.body.appendChild(widget);

  /* ── State ── */
  let isOpen = false;
  let isTyping = false;
  const history = [];

  /* ── Toggle ── */
  window.dubiAgentToggle = function () {
    isOpen = !isOpen;
    document.getElementById('dubi-agent-window').classList.toggle('open', isOpen);
    if (isOpen && history.length === 0) {
      dubiAddMessage('agent', `Hi! I'm <strong>Dubi Agent</strong> — your AI-powered assistant for DUBIMOTORS.<br><br>I can help you find the right vehicle, understand how listings work, explain pricing, or answer any questions about buying and selling in the UAE. How can I help you today?`);
    }
    if (isOpen) setTimeout(() => document.getElementById('dubi-agent-input').focus(), 120);
  };

  /* ── Markdown-lite renderer ── */
  function renderMarkdown(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  /* ── Add message ── */
  function dubiAddMessage(role, html) {
    const msgs = document.getElementById('dubi-agent-messages');
    const div = document.createElement('div');
    div.className = 'dubi-msg ' + role;
    div.innerHTML = html;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    history.push({ role: role === 'agent' ? 'assistant' : 'user', content: div.textContent });
    return div;
  }

  function dubiShowTyping() {
    const msgs = document.getElementById('dubi-agent-messages');
    const div = document.createElement('div');
    div.className = 'dubi-msg typing'; div.id = 'dubi-typing';
    div.innerHTML = '<div class="dubi-typing-dot"></div><div class="dubi-typing-dot"></div><div class="dubi-typing-dot"></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function dubiHideTyping() {
    const t = document.getElementById('dubi-typing');
    if (t) t.remove();
  }

  /* ── Send ── */
  window.dubiSend = async function (text) {
    if (!text.trim() || isTyping) return;
    document.getElementById('dubi-suggestions').style.display = 'none';
    dubiAddMessage('user', escapeHtml(text));
    isTyping = true;
    dubiShowTyping();
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: history.slice(-10) })
      });
      const data = await res.json();
      dubiHideTyping();
      dubiAddMessage('agent', renderMarkdown(data.reply || 'Sorry, I could not process that. Please try again.'));
    } catch {
      dubiHideTyping();
      dubiAddMessage('agent', "I'm having trouble connecting right now. Please try again in a moment.");
    }
    isTyping = false;
  };

  window.dubiSendFromInput = function () {
    const input = document.getElementById('dubi-agent-input');
    const text = input.value.trim();
    if (text) { input.value = ''; dubiSend(text); }
  };

  window.dubiKeydown = function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); dubiSendFromInput(); }
  };

  function escapeHtml(t) {
    return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
})();
