import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, Link } from 'react-router-dom';
import { Sun, Moon, LogOut, Settings, Users, Hash, MessageSquare, Shield, Home, ExternalLink, ChevronRight, Check, X, Bell, Lock, Trash2, User, BarChart3, Ticket, Gift, Star, Zap, DollarSign, Gamepad2, Wrench, Crown, TrendingUp, Award, Clock, Terminal, ChevronDown } from 'lucide-react';
import './index.css';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

// Context per autenticazione
const AuthContext = createContext(null);

const useAuth = () => useContext(AuthContext);

// Funzione fetch API
async function api(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  return res.json();
}

// Hook per tema
function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  return { theme, toggle };
}

// Toothless SVG Icon Component
function ToothlessIcon({ size = 32, className = "", style = {} }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      style={style}
      fill="currentColor"
    >
      {/* Dragon head shape */}
      <ellipse cx="50" cy="55" rx="35" ry="30" fill="currentColor" />
      {/* Ears */}
      <ellipse cx="25" cy="25" rx="12" ry="18" fill="currentColor" transform="rotate(-20 25 25)" />
      <ellipse cx="75" cy="25" rx="12" ry="18" fill="currentColor" transform="rotate(20 75 25)" />
      {/* Eyes */}
      <ellipse cx="35" cy="50" rx="10" ry="12" fill="#1a1a1a" />
      <ellipse cx="65" cy="50" rx="10" ry="12" fill="#1a1a1a" />
      {/* Green eye highlights */}
      <ellipse cx="35" cy="50" rx="6" ry="8" fill="#57F287" />
      <ellipse cx="65" cy="50" rx="6" ry="8" fill="#57F287" />
      {/* Pupils */}
      <ellipse cx="35" cy="50" rx="3" ry="5" fill="#1a1a1a" />
      <ellipse cx="65" cy="50" rx="3" ry="5" fill="#1a1a1a" />
      {/* Nose */}
      <circle cx="45" cy="70" r="3" fill="#333" />
      <circle cx="55" cy="70" r="3" fill="#333" />
      {/* Smile */}
      <path d="M 35 75 Q 50 85 65 75" stroke="#333" strokeWidth="2" fill="none" />
    </svg>
  );
}

// ===============================
// COMPONENTI UI
// ===============================

function Navbar({ user, onLogout }) {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')} data-testid="nav-logo">
        <ToothlessIcon size={36} style={{ color: 'var(--accent-success)' }} />
        <span className="navbar-title">Toothless</span>
        <span className="version-badge">v3.0</span>
      </div>
      
      <div className="navbar-actions">
        <button onClick={toggle} className="btn-icon" data-testid="theme-toggle">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        {user && (
          <div className="user-menu">
            <img 
              src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png'} 
              alt={user.username}
              className="user-avatar"
            />
            <span className="user-name">{user.username}</span>
            <button onClick={onLogout} className="btn btn-danger btn-sm" data-testid="logout-btn">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function Sidebar({ guilds, selectedGuild, onSelect }) {
  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">I tuoi Server</h3>
      
      <div className="guild-list">
        {guilds.map(guild => (
          <div
            key={guild.id}
            onClick={() => onSelect(guild)}
            className={`guild-item ${selectedGuild?.id === guild.id ? 'active' : ''}`}
            data-testid={`guild-${guild.id}`}
          >
            {guild.icon ? (
              <img 
                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} 
                alt={guild.name}
                className="guild-icon"
              />
            ) : (
              <div className={`guild-icon-placeholder ${selectedGuild?.id === guild.id ? 'active' : ''}`}>
                {guild.name.charAt(0)}
              </div>
            )}
            <div className="guild-info">
              <div className="guild-name">{guild.name}</div>
              <div className="guild-status">
                {guild.hasBot ? '✓ Bot attivo' : 'Bot non presente'}
              </div>
            </div>
            <ChevronRight size={18} className="guild-arrow" />
          </div>
        ))}
      </div>
    </aside>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="toggle-wrapper">
      <div 
        onClick={() => onChange(!checked)}
        className={`toggle ${checked ? 'active' : ''}`}
      >
        <div className="toggle-knob" />
      </div>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  );
}

function StatCard({ icon: Icon, title, value, color, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}20`, color: color }}>
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <div className="stat-title">{title}</div>
        <div className="stat-value" style={{ color: color }}>{value}</div>
      </div>
      {trend && (
        <div className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
          <TrendingUp size={14} />
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  );
}

// ===============================
// PAGINE
// ===============================

// Landing Page
function LandingPage() {
  const [botInfo, setBotInfo] = useState(null);
  const { theme, toggle } = useTheme();
  
  useEffect(() => {
    api('/api/bot/info').then(data => {
      setBotInfo(data);
    }).catch(console.error);
  }, []);
  
  const handleLogin = async () => {
    try {
      const { url } = await api('/api/auth/discord');
      window.location.href = url;
    } catch (error) {
      console.error('Login error:', error);
      alert('Errore durante il login. Verifica che le credenziali Discord siano configurate.');
    }
  };
  
  const handleInvite = async () => {
    try {
      const { url } = await api('/api/bot/invite');
      window.open(url, '_blank');
    } catch (error) {
      console.error('Invite error:', error);
    }
  };

  const features = [
    { icon: Shield, title: 'Moderazione', desc: 'Ban, kick, warn, timeout, purge e molto altro', color: '#ED4245' },
    { icon: DollarSign, title: 'Economia', desc: 'Daily, work, crime, shop, banca, slot machine', color: '#FFD700' },
    { icon: Gamepad2, title: 'Fun & Games', desc: '8ball, RPS, trivia, polls, meme, dice', color: '#9B59B6' },
    { icon: Wrench, title: 'Utility', desc: 'Avatar, banner, serverinfo, timestamp, remind', color: '#3498DB' },
    { icon: Ticket, title: 'Ticket System', desc: 'Sistema ticket completo con pannello', color: '#E91E63' },
    { icon: Gift, title: 'Giveaways', desc: 'Crea e gestisci giveaway con timer', color: '#FF69B4' },
    { icon: Star, title: 'Sistema Livelli', desc: 'XP, rank, ruoli automatici per livello', color: '#FFD700' },
    { icon: Bell, title: 'Welcomer', desc: 'Messaggi di benvenuto personalizzati', color: '#57F287' }
  ];
  
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-brand">
          <ToothlessIcon size={40} style={{ color: 'var(--accent-success)' }} />
          <span className="landing-title">Toothless</span>
        </div>
        <div className="landing-actions">
          <button onClick={toggle} className="btn btn-secondary" data-testid="landing-theme-toggle">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={handleLogin} className="btn btn-primary" data-testid="login-btn">
            Login con Discord
          </button>
        </div>
      </header>
      
      {/* Hero */}
      <main className="landing-main">
        <div className="hero animate-fadeIn">
          <div className="hero-icon">
            <ToothlessIcon size={80} style={{ color: '#57F287' }} />
          </div>
          <h1 className="hero-title">Toothless Bot v3.0</h1>
          <p className="hero-subtitle">
            Il bot Discord più completo con <strong>50+ comandi</strong>
          </p>
          <p className="hero-features">
            Moderazione • Economia • Livelli • Fun • Tickets • Giveaways • Dashboard
          </p>
          
          <div className="hero-buttons">
            <button onClick={handleInvite} className="btn btn-success btn-lg" data-testid="invite-btn">
              <ExternalLink size={20} />
              Aggiungi al Server
            </button>
            <button onClick={handleLogin} className="btn btn-secondary btn-lg" data-testid="dashboard-btn">
              <Settings size={20} />
              Apri Dashboard
            </button>
          </div>
        </div>
        
        {/* Stats */}
        {botInfo && (
          <div className="stats-grid animate-fadeIn">
            <StatCard icon={Home} title="Server" value={botInfo.guilds} color="#57F287" />
            <StatCard icon={Users} title="Utenti" value={botInfo.users?.toLocaleString()} color="#5865F2" />
            <StatCard icon={Terminal} title="Comandi" value={botInfo.commands} color="#FEE75C" />
            <StatCard icon={Clock} title="Uptime" value={botInfo.uptime ? Math.floor(botInfo.uptime / 3600000) + 'h' : 'N/A'} color="#9B59B6" />
          </div>
        )}
        
        {/* Command Categories from API */}
        {botInfo?.commandCategories && (
          <section className="categories-section">
            <h2 className="section-title">Categorie Comandi ({botInfo.commands} totali)</h2>
            <div className="categories-badges">
              {Object.entries(botInfo.commandCategories).map(([key, cat]) => (
                <div 
                  key={key} 
                  className="category-badge"
                  style={{ 
                    background: `${cat.color}20`, 
                    borderColor: `${cat.color}40`,
                    color: cat.color 
                  }}
                >
                  <span>{cat.emoji}</span>
                  {cat.name} ({cat.count})
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Features */}
        <section className="features-section">
          <h2 className="section-title">Funzionalità</h2>
          <div className="features-grid">
            {features.map((feat, i) => (
              <div key={i} className="feature-card animate-fadeIn" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="feature-icon" style={{ background: `${feat.color}20` }}>
                  <feat.icon size={24} style={{ color: feat.color }} />
                </div>
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="landing-footer">
        <ToothlessIcon size={32} style={{ color: 'var(--accent-success)' }} />
        <p>Toothless Bot v3.0.0 © {new Date().getFullYear()}</p>
        <p className="footer-tagline">Made with ❤️ • 50+ Comandi • Dashboard Completa</p>
      </footer>
    </div>
  );
}

// Callback OAuth
function CallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      api('/api/auth/callback', {
        method: 'POST',
        body: JSON.stringify({ code })
      }).then(data => {
        if (data.user) {
          login(data);
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }).catch(() => navigate('/'));
    } else {
      navigate('/');
    }
  }, [navigate, login]);
  
  return (
    <div className="callback-page">
      <ToothlessIcon size={64} style={{ color: 'var(--accent-success)' }} className="pulse-animation" />
      <div className="spinner" />
      <p>Autenticazione in corso...</p>
    </div>
  );
}

// Dashboard
function DashboardPage() {
  const { user, guilds, logout } = useAuth();
  const [selectedGuild, setSelectedGuild] = useState(null);
  const [guildData, setGuildData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [saveStatus, setSaveStatus] = useState(null);
  const navigate = useNavigate();
  
  // Form states
  const [welcomerForm, setWelcomerForm] = useState({
    enabled: false,
    channelId: '',
    message: '',
    embedTitle: '',
    embedDescription: '',
    embedColor: '#57F287',
    roleId: '',
    leaveEnabled: false,
    leaveMessage: ''
  });
  
  const [logForm, setLogForm] = useState({
    enabled: false,
    channelId: ''
  });

  const [ticketForm, setTicketForm] = useState({
    enabled: false,
    categoryId: '',
    supportRoleId: '',
    welcomeMessage: ''
  });

  const [levelForm, setLevelForm] = useState({
    enabled: false,
    announceChannelId: '',
    xpMin: 15,
    xpMax: 25
  });
  
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    if (selectedGuild) {
      setLoading(true);
      api(`/api/guild/${selectedGuild.id}`)
        .then(data => {
          setGuildData(data);
          
          // Popola form welcomer
          if (data.settings?.welcome) {
            const w = data.settings.welcome;
            setWelcomerForm({
              enabled: w.enabled || false,
              channelId: w.channelId || '',
              message: w.message || '',
              embedTitle: w.embed?.title || '',
              embedDescription: w.embed?.description || '',
              embedColor: w.embed?.color || '#57F287',
              roleId: w.roleId || '',
              leaveEnabled: w.leaveEnabled || false,
              leaveMessage: w.leaveMessage || ''
            });
          }
          
          // Popola form log
          if (data.settings?.log) {
            setLogForm({
              enabled: data.settings.log.enabled || false,
              channelId: data.settings.log.channelId || ''
            });
          }

          // Popola form ticket
          if (data.settings?.tickets) {
            setTicketForm({
              enabled: data.settings.tickets.enabled || false,
              categoryId: data.settings.tickets.categoryId || '',
              supportRoleId: data.settings.tickets.supportRoleId || '',
              welcomeMessage: data.settings.tickets.welcomeMessage || ''
            });
          }

          // Popola form levels
          if (data.settings?.levels) {
            setLevelForm({
              enabled: data.settings.levels.enabled || false,
              announceChannelId: data.settings.levels.announceChannelId || '',
              xpMin: data.settings.levels.xpPerMessage?.min || 15,
              xpMax: data.settings.levels.xpPerMessage?.max || 25
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedGuild]);

  const saveSettings = async (endpoint, data) => {
    setSaveStatus('saving');
    try {
      await api(`/api/guild/${selectedGuild.id}/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (e) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 2000);
    }
  };
  
  const saveWelcomer = () => saveSettings('welcomer', {
    enabled: welcomerForm.enabled,
    channelId: welcomerForm.channelId,
    message: welcomerForm.message,
    embed: welcomerForm.embedTitle ? {
      title: welcomerForm.embedTitle,
      description: welcomerForm.embedDescription,
      color: welcomerForm.embedColor
    } : null,
    roleId: welcomerForm.roleId,
    leaveEnabled: welcomerForm.leaveEnabled,
    leaveMessage: welcomerForm.leaveMessage
  });
  
  const saveLogSettings = () => saveSettings('log', logForm);
  const saveTicketSettings = () => saveSettings('tickets', ticketForm);
  const saveLevelSettings = () => saveSettings('levels', {
    enabled: levelForm.enabled,
    announceChannelId: levelForm.announceChannelId,
    xpPerMessage: { min: levelForm.xpMin, max: levelForm.xpMax }
  });
  
  if (!user) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'welcomer', label: 'Welcomer', icon: Bell },
    { id: 'log', label: 'Log', icon: MessageSquare },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'levels', label: 'Livelli', icon: Star }
  ];
  
  return (
    <div className="dashboard-page">
      <Navbar user={user} onLogout={logout} />
      
      <div className="dashboard-layout">
        <Sidebar guilds={guilds} selectedGuild={selectedGuild} onSelect={setSelectedGuild} />
        
        <main className="dashboard-main">
          {!selectedGuild ? (
            <div className="empty-state">
              <ToothlessIcon size={80} style={{ color: 'var(--accent-success)', opacity: 0.3 }} />
              <h2>Seleziona un Server</h2>
              <p>Scegli un server dalla sidebar per gestire le impostazioni.</p>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <ToothlessIcon size={48} style={{ color: 'var(--accent-success)' }} className="pulse-animation" />
              <div className="spinner" />
            </div>
          ) : guildData && (
            <div className="dashboard-content animate-fadeIn">
              {/* Header Server */}
              <div className="guild-header">
                {guildData.icon ? (
                  <img src={guildData.icon} alt="" className="guild-header-icon" />
                ) : (
                  <div className="guild-header-icon-placeholder">
                    <ToothlessIcon size={40} style={{ color: '#1a1a1a' }} />
                  </div>
                )}
                <div className="guild-header-info">
                  <h1>{guildData.name}</h1>
                  <p>{guildData.memberCount} membri • {guildData.channels?.length || 0} canali</p>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="tabs-container">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    data-testid={`tab-${tab.id}`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="tab-content">
                  <div className="stats-grid">
                    <StatCard icon={Users} title="Membri" value={guildData.memberCount} color="#57F287" />
                    <StatCard icon={Hash} title="Canali" value={guildData.channels?.length || 0} color="#5865F2" />
                    <StatCard icon={Crown} title="Ruoli" value={guildData.roles?.length || 0} color="#FEE75C" />
                    <StatCard icon={Award} title="Categorie" value={guildData.categories?.length || 0} color="#9B59B6" />
                  </div>

                  <div className="card">
                    <h2 className="card-title">
                      <ToothlessIcon size={24} style={{ color: 'var(--accent-success)' }} />
                      Stato Configurazioni
                    </h2>
                    <div className="config-status-grid">
                      {[
                        { name: 'Welcomer', enabled: guildData.settings?.welcome?.enabled, icon: Bell },
                        { name: 'Log', enabled: guildData.settings?.log?.enabled, icon: MessageSquare },
                        { name: 'Tickets', enabled: guildData.settings?.tickets?.enabled, icon: Ticket },
                        { name: 'Livelli', enabled: guildData.settings?.levels?.enabled, icon: Star }
                      ].map((item, i) => (
                        <div key={i} className="config-status-item">
                          <item.icon size={20} style={{ color: item.enabled ? '#57F287' : 'var(--text-muted)' }} />
                          <span>{item.name}</span>
                          <span className={`status-badge ${item.enabled ? 'active' : ''}`}>
                            {item.enabled ? 'Attivo' : 'Disattivo'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'welcomer' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">
                      <ToothlessIcon size={24} style={{ color: 'var(--accent-success)' }} />
                      Configurazione Welcomer
                    </h2>
                    <Toggle checked={welcomerForm.enabled} onChange={v => setWelcomerForm(f => ({ ...f, enabled: v }))} label="Attivo" />
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Canale Benvenuto</label>
                      <select 
                        value={welcomerForm.channelId} 
                        onChange={e => setWelcomerForm(f => ({ ...f, channelId: e.target.value }))}
                        data-testid="welcomer-channel"
                      >
                        <option value="">Seleziona canale...</option>
                        {guildData.channels?.map(ch => (
                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Messaggio Semplice</label>
                      <input 
                        type="text"
                        placeholder="{user} benvenuto in {server}! Siamo ora {memberCount} membri!"
                        value={welcomerForm.message}
                        onChange={e => setWelcomerForm(f => ({ ...f, message: e.target.value }))}
                        data-testid="welcomer-message"
                      />
                      <small>Variabili: {'{user}'} {'{server}'} {'{memberCount}'}</small>
                    </div>
                    
                    <div className="form-section full-width">
                      <h3><Star size={18} style={{ color: '#FFD700' }} /> Embed Personalizzato</h3>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Titolo</label>
                          <input 
                            type="text"
                            placeholder="Benvenuto {user}!"
                            value={welcomerForm.embedTitle}
                            onChange={e => setWelcomerForm(f => ({ ...f, embedTitle: e.target.value }))}
                          />
                        </div>
                        <div className="form-group">
                          <label>Colore</label>
                          <input 
                            type="color"
                            value={welcomerForm.embedColor}
                            onChange={e => setWelcomerForm(f => ({ ...f, embedColor: e.target.value }))}
                            className="color-input"
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Descrizione</label>
                        <textarea 
                          placeholder="Benvenuto nel server {server}! Siamo felici di averti qui."
                          value={welcomerForm.embedDescription}
                          onChange={e => setWelcomerForm(f => ({ ...f, embedDescription: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Ruolo Automatico</label>
                      <select 
                        value={welcomerForm.roleId}
                        onChange={e => setWelcomerForm(f => ({ ...f, roleId: e.target.value }))}
                        data-testid="welcomer-role"
                      >
                        <option value="">Nessun ruolo</option>
                        {guildData.roles?.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-section full-width">
                      <div className="form-section-header">
                        <h3>Messaggio di Uscita</h3>
                        <Toggle checked={welcomerForm.leaveEnabled} onChange={v => setWelcomerForm(f => ({ ...f, leaveEnabled: v }))} />
                      </div>
                      <input 
                        type="text"
                        placeholder="👋 {user} ha lasciato il server."
                        value={welcomerForm.leaveMessage}
                        onChange={e => setWelcomerForm(f => ({ ...f, leaveMessage: e.target.value }))}
                        disabled={!welcomerForm.leaveEnabled}
                      />
                    </div>
                    
                    <button onClick={saveWelcomer} className="btn btn-success" data-testid="save-welcomer">
                      {saveStatus === 'saving' ? <div className="spinner-sm" /> :
                       saveStatus === 'success' ? <><Check size={18} /> Salvato!</> :
                       saveStatus === 'error' ? <><X size={18} /> Errore</> :
                       'Salva Impostazioni'}
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'log' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">
                      <MessageSquare size={24} style={{ color: '#5865F2' }} />
                      Configurazione Log
                    </h2>
                    <Toggle checked={logForm.enabled} onChange={v => setLogForm(f => ({ ...f, enabled: v }))} label="Attivo" />
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Canale Log</label>
                      <select 
                        value={logForm.channelId}
                        onChange={e => setLogForm(f => ({ ...f, channelId: e.target.value }))}
                        data-testid="log-channel"
                      >
                        <option value="">Seleziona canale...</option>
                        {guildData.channels?.map(ch => (
                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="info-box full-width">
                      <h4>Eventi Loggati:</h4>
                      <div className="tag-list">
                        {['Ban', 'Kick', 'Warn', 'Timeout', 'Purge', 'Unban'].map(event => (
                          <span key={event} className="tag">{event}</span>
                        ))}
                      </div>
                    </div>
                    
                    <button onClick={saveLogSettings} className="btn btn-success" data-testid="save-log">
                      {saveStatus === 'saving' ? <div className="spinner-sm" /> :
                       saveStatus === 'success' ? <><Check size={18} /> Salvato!</> :
                       'Salva Impostazioni'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'tickets' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">
                      <Ticket size={24} style={{ color: '#E91E63' }} />
                      Sistema Ticket
                    </h2>
                    <Toggle checked={ticketForm.enabled} onChange={v => setTicketForm(f => ({ ...f, enabled: v }))} label="Attivo" />
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Categoria Ticket</label>
                      <select 
                        value={ticketForm.categoryId}
                        onChange={e => setTicketForm(f => ({ ...f, categoryId: e.target.value }))}
                      >
                        <option value="">Seleziona categoria...</option>
                        {guildData.categories?.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Ruolo Supporto</label>
                      <select 
                        value={ticketForm.supportRoleId}
                        onChange={e => setTicketForm(f => ({ ...f, supportRoleId: e.target.value }))}
                      >
                        <option value="">Seleziona ruolo...</option>
                        {guildData.roles?.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group full-width">
                      <label>Messaggio Benvenuto Ticket</label>
                      <textarea 
                        placeholder="Il nostro team ti risponderà a breve! Descrivi il tuo problema."
                        value={ticketForm.welcomeMessage}
                        onChange={e => setTicketForm(f => ({ ...f, welcomeMessage: e.target.value }))}
                      />
                    </div>

                    <div className="info-box full-width">
                      <h4>Come Usare:</h4>
                      <ol>
                        <li>Configura le impostazioni qui sopra</li>
                        <li>Usa <code>/ticket panel</code> nel canale desiderato</li>
                        <li>Gli utenti potranno aprire ticket cliccando il bottone</li>
                      </ol>
                    </div>
                    
                    <button onClick={saveTicketSettings} className="btn btn-success">
                      {saveStatus === 'saving' ? <div className="spinner-sm" /> :
                       saveStatus === 'success' ? <><Check size={18} /> Salvato!</> :
                       'Salva Impostazioni'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'levels' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">
                      <Star size={24} style={{ color: '#FFD700' }} />
                      Sistema Livelli
                    </h2>
                    <Toggle checked={levelForm.enabled} onChange={v => setLevelForm(f => ({ ...f, enabled: v }))} label="Attivo" />
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Canale Annunci Level Up</label>
                      <select 
                        value={levelForm.announceChannelId}
                        onChange={e => setLevelForm(f => ({ ...f, announceChannelId: e.target.value }))}
                      >
                        <option value="">Canale dove viene scritto il messaggio</option>
                        {guildData.channels?.map(ch => (
                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>XP Minimo per Messaggio</label>
                        <input 
                          type="number"
                          min="1"
                          max="100"
                          value={levelForm.xpMin}
                          onChange={e => setLevelForm(f => ({ ...f, xpMin: parseInt(e.target.value) || 15 }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>XP Massimo per Messaggio</label>
                        <input 
                          type="number"
                          min="1"
                          max="100"
                          value={levelForm.xpMax}
                          onChange={e => setLevelForm(f => ({ ...f, xpMax: parseInt(e.target.value) || 25 }))}
                        />
                      </div>
                    </div>

                    <div className="info-box full-width">
                      <h4>Comandi Livelli:</h4>
                      <ul>
                        <li><code>/rank</code> - Mostra il tuo livello</li>
                        <li><code>/leaderboard livelli</code> - Classifica livelli</li>
                        <li><code>/xpsettings role</code> - Assegna ruoli per livello</li>
                      </ul>
                    </div>
                    
                    <button onClick={saveLevelSettings} className="btn btn-success">
                      {saveStatus === 'saving' ? <div className="spinner-sm" /> :
                       saveStatus === 'success' ? <><Check size={18} /> Salvato!</> :
                       'Salva Impostazioni'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ===============================
// APP PRINCIPALE
// ===============================

function App() {
  const [authState, setAuthState] = useState(() => {
    const saved = localStorage.getItem('toothless_auth');
    return saved ? JSON.parse(saved) : { user: null, guilds: [] };
  });
  
  const login = (data) => {
    const state = { user: data.user, guilds: data.guilds };
    localStorage.setItem('toothless_auth', JSON.stringify(state));
    setAuthState(state);
  };
  
  const logout = () => {
    localStorage.removeItem('toothless_auth');
    setAuthState({ user: null, guilds: [] });
    window.location.href = '/';
  };
  
  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
