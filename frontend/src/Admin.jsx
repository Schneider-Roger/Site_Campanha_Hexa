import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, ArrowLeft, Calendar, User, Search, RefreshCw, 
  Download, Award, CheckCircle, Clock, Trash2, Edit2, Check, ShieldAlert, AlertCircle, ArrowUpRight
} from 'lucide-react';
import axios from 'axios';

// Custom Social Icons to avoid version mismatch in lucide-react exports
const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const FacebookIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const YoutubeIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

const GlobeIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
);

const Admin = () => {
  const [jogos, setJogos] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('todos'); // 'todos', 'ganhadores', 'placar', 'gol'
  
  // App states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Authentication states
  const [adminToken, setAdminToken] = useState(localStorage.getItem('copercana_admin_token') || '');
  const [isAuthorized, setIsAuthorized] = useState(!!adminToken);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Result submission form
  const [scoringGame, setScoringGame] = useState(null);
  const [scoreForm, setScoreForm] = useState({
    placar_real_brasil: 0,
    placar_real_adversario: 0,
    primeiro_gol_real: ''
  });

  const fetchData = async (tokenToUse = adminToken) => {
    if (!tokenToUse) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    setAuthError('');
    try {
      const config = { headers: { 'x-admin-token': tokenToUse } };
      const [jogosRes, partRes] = await Promise.all([
        axios.get('http://localhost:3001/api/admin/jogos', config),
        axios.get('http://localhost:3001/api/admin/participantes', config)
      ]);
      setJogos(jogosRes.data);
      setParticipantes(partRes.data);
      setIsAuthorized(true);
      
      // Auto-select first game for convenience
      if (jogosRes.data.length > 0 && selectedGameId === 'todos') {
        setSelectedGameId(jogosRes.data[0].id.toString());
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      if (err.response && err.response.status === 401) {
        setAuthError('Senha de acesso incorreta ou token inválido.');
        setIsAuthorized(false);
        localStorage.removeItem('copercana_admin_token');
      } else {
        setError('Erro ao carregar dados do painel administrativo.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchData(adminToken);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError('A senha não pode estar vazia.');
      return;
    }
    setAdminToken(passwordInput);
    localStorage.setItem('copercana_admin_token', passwordInput);
    fetchData(passwordInput);
  };

  const handleLogout = () => {
    setAdminToken('');
    setIsAuthorized(false);
    localStorage.removeItem('copercana_admin_token');
    window.location.reload();
  };

  // Fetch results automatically from mock scraper
  const handleAutoPull = async (jogoId) => {
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const config = { headers: { 'x-admin-token': adminToken } };
      const response = await axios.get(`http://localhost:3001/api/admin/jogo/puxar-resultado/${jogoId}`, config);
      if (response.data.success) {
        setScoreForm({
          placar_real_brasil: response.data.placar_real_brasil,
          placar_real_adversario: response.data.placar_real_adversario,
          primeiro_gol_real: response.data.primeiro_gol_real
        });
        setSuccess(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        handleLogout();
      } else {
        setError('Não foi possível obter o resultado do jogo automaticamente.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Submit match result
  const handleSaveResult = async (e) => {
    e.preventDefault();
    if (!scoringGame) return;
    
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const config = { headers: { 'x-admin-token': adminToken } };
      await axios.post(`http://localhost:3001/api/admin/jogos/${scoringGame.id}/resultado`, scoreForm, config);
      setSuccess('Resultado salvo com sucesso! Os palpites foram apurados.');
      setScoringGame(null);
      await fetchData(); // Reload calculations
    } catch (err) {
      if (err.response && err.response.status === 401) {
        handleLogout();
      } else {
        setError('Erro ao salvar resultado da partida.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Reset match status
  const handleResetGame = async (jogoId) => {
    if (!window.confirm('Tem certeza que deseja apagar o resultado real e reabrir os palpites para este jogo?')) return;
    
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const config = { headers: { 'x-admin-token': adminToken } };
      await axios.post(`http://localhost:3001/api/admin/jogos/${jogoId}/reset`, null, config);
      setSuccess('Jogo reaberto para palpites com sucesso!');
      await fetchData();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        handleLogout();
      } else {
        setError('Erro ao reabrir jogo.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const formatGameDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + 
           date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + 'h';
  };

  // Filter participants
  const getFilteredParticipants = () => {
    let list = [...participantes];

    // Filter by game
    if (selectedGameId !== 'todos') {
      list = list.filter(p => p.jogo_id === Number(selectedGameId));
    }

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        (p.nome && p.nome.toLowerCase().includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.telefone && p.telefone.toLowerCase().includes(q)) ||
        (p.cupom_fiscal && p.cupom_fiscal.toLowerCase().includes(q)) ||
        (p.cidade && p.cidade.toLowerCase().includes(q))
      );
    }

    // Filter by win type
    if (filterType === 'ganhadores') {
      list = list.filter(p => p.ganhador);
    } else if (filterType === 'placar') {
      list = list.filter(p => p.acertou_placar);
    } else if (filterType === 'gol') {
      list = list.filter(p => p.acertou_gol);
    }

    return list;
  };

  // Export to CSV
  const handleExportCSV = () => {
    const list = getFilteredParticipants();
    if (list.length === 0) {
      alert('Nenhum dado para exportar.');
      return;
    }

    const headers = ['Nome', 'Telefone', 'E-mail', 'Cidade', 'Cupom Fiscal', 'Adversário', 'Palpite Brasil', 'Palpite Oponente', 'Primeiro Gol', 'Acertou Placar?', 'Acertou Gol?', 'É Ganhador?'];
    const rows = list.map(p => [
      p.nome,
      p.telefone,
      p.email,
      p.cidade,
      p.cupom_fiscal,
      p.adversario,
      p.placar_brasil,
      p.placar_adversario,
      p.primeiro_gol,
      p.acertou_placar ? 'SIM' : 'NÃO',
      p.acertou_gol ? 'SIM' : 'NÃO',
      p.ganhador ? 'GANHADOR' : ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `palpites_hexa_copercana_${selectedGameId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredList = getFilteredParticipants();

  // Statistics calculation for the currently selected game
  const getStats = () => {
    const gameId = selectedGameId === 'todos' ? null : Number(selectedGameId);
    const relevant = gameId ? participantes.filter(p => p.jogo_id === gameId) : participantes;
    
    return {
      total: relevant.length,
      acertaramPlacar: relevant.filter(p => p.acertou_placar).length,
      acertaramGol: relevant.filter(p => p.acertou_gol).length,
      ganhadores: relevant.filter(p => p.ganhador).length
    };
  };

  const stats = getStats();

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-hexa-yellow relative overflow-hidden flex flex-col items-center justify-center font-outfit p-4 select-none">
        {/* Decorative background images */}
        <div className="absolute top-[10%] left-[-5%] sm:left-[-2%] opacity-20 w-32 sm:w-48 md:w-56 pointer-events-none">
          <img src="/camisa-10.png" alt="" className="rotate-[-12deg]" />
        </div>
        <div className="absolute bottom-[10%] right-[-5%] sm:right-[-2%] opacity-20 w-32 sm:w-48 md:w-56 pointer-events-none">
          <img src="/chuteira.png" alt="" className="rotate-[15deg]" />
        </div>

        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 sm:p-10 rounded-3xl border-4 border-hexa-green shadow-[8px_8px_0px_#001D0E] max-w-md w-full z-10 text-center"
        >
          <div className="bg-hexa-green text-hexa-yellow p-4 w-16 h-16 rounded-2xl shadow-md mx-auto mb-6 flex items-center justify-center border border-white/20">
            <Trophy className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase italic text-hexa-green mb-2 tracking-tighter leading-none font-outfit">
            Central de Apuração
          </h1>
          <p className="text-xs font-bold text-hexa-green/70 uppercase tracking-wider mb-8">
            Área de Acesso Restrito • Copercana
          </p>

          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase block text-hexa-green">Senha de Acesso:</label>
              <input 
                required
                type="password"
                placeholder="Insira a senha do administrador..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-4 border-2 border-hexa-green bg-white rounded-xl font-black shadow-inner text-center focus:outline-none focus:ring-3 focus:ring-hexa-yellow text-lg"
              />
            </div>

            {authError && (
              <p className="text-xs font-black text-rose-600 bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-center uppercase tracking-wide">
                ⚠️ {authError}
              </p>
            )}

            <div className="flex gap-3">
              <a 
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(null, '', '/');
                }}
                className="bg-white border-2 border-hexa-green text-hexa-green hover:bg-hexa-green/5 py-4 px-6 rounded-xl font-black text-xs uppercase italic flex items-center justify-center gap-1.5 flex-1 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </a>

              <button
                type="submit"
                className="bg-hexa-green text-hexa-yellow hover:bg-hexa-dark-green py-4 px-6 rounded-xl font-black text-xs uppercase italic flex items-center justify-center gap-1.5 flex-1 shadow-md transition-all border-2 border-hexa-green"
              >
                <span>Entrar</span>
                <ArrowUpRight className="w-4 h-4 animate-pulse" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hexa-yellow relative overflow-hidden flex flex-col font-outfit">
      {/* Header Navbar (100px) */}
      <header className="h-[100px] w-full bg-hexa-green border-b-4 border-hexa-yellow shadow-lg flex items-center z-40 shrink-0">
        <div className="w-full flex items-center justify-center md:justify-between px-6 md:px-[150px]">
          {/* Logo */}
          <div className="flex items-center">
            <a 
              href="https://copercana.com.br/servicos/posto-de-combustivel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center transition-transform active:scale-95 hover:opacity-90"
            >
              <img 
                src="/logo.png" 
                alt="Posto Copercana" 
                className="h-12 w-auto object-contain select-none mix-blend-screen" 
              />
            </a>
          </div>

          {/* External Button */}
          <div className="hidden md:flex items-center">
            <a 
              href="https://copercana.com.br/servicos/posto-de-combustivel"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-hexa-yellow text-hexa-green hover:bg-hexa-yellow/90 hover:scale-105 active:scale-95 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-outfit font-black text-xs sm:text-sm uppercase italic tracking-wider transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              <span>Nossos Postos</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>
      </header>

      {/* Main content wrapper */}
      <div className="flex-1 w-full p-4 md:p-8 flex flex-col z-10">
        {/* Header Nav */}
        <header className="flex flex-col md:flex-row items-center justify-between border-b-4 border-hexa-green pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-hexa-green text-hexa-yellow p-3 rounded-2xl shadow-md">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-none mb-1 text-hexa-green">
                Central de Apuração
              </h1>
              <p className="text-xs md:text-sm font-bold text-hexa-green/70 uppercase tracking-wider">
                Painel Administrativo • Campanha Seleção Copercana
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <a 
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, '', '/');
              }}
              className="bg-white border-2 border-hexa-green text-hexa-green hover:bg-hexa-green hover:text-hexa-yellow px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> Voltar para o Site
            </a>
            
            <button
              onClick={handleLogout}
              className="bg-rose-600 text-white hover:bg-rose-700 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm border-2 border-rose-600 flex items-center gap-1.5"
            >
              Sair
            </button>
          </div>
        </header>


      {/* Main feedback messages */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-emerald-100 border-2 border-emerald-400 text-emerald-800 rounded-2xl font-bold text-center mb-6 flex items-center justify-center gap-2 shadow-sm"
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-rose-100 border-2 border-rose-400 text-rose-800 rounded-2xl font-bold text-center mb-6 flex items-center justify-center gap-2 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-32">
          <div className="w-16 h-16 border-4 border-hexa-green border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-black uppercase italic tracking-widest text-lg animate-pulse">Carregando painel de dados...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left/Middle: Game controls and results apuração */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Matches list card */}
            <div className="bg-white p-6 rounded-3xl border-2 border-hexa-green/10 shadow-lg">
              <h2 className="text-xl font-black uppercase italic border-b-2 border-hexa-green/15 pb-3 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Partidas da Copa
              </h2>
              
              <div className="space-y-4">
                {jogos.map((jogo) => {
                  const isScoring = scoringGame?.id === jogo.id;
                  const isClosed = jogo.status === 'encerrado';
                  
                  return (
                    <div 
                      key={jogo.id}
                      className={`p-4 rounded-2xl border-2 transition-all relative ${
                        isScoring 
                          ? 'border-hexa-yellow bg-hexa-yellow/10 ring-2 ring-hexa-yellow' 
                          : isClosed
                            ? 'border-hexa-green/20 bg-hexa-green/5'
                            : 'border-hexa-green/10 bg-white hover:border-hexa-green/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-outfit font-black text-lg">
                          Brasil x {jogo.adversario}
                        </span>
                        
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                          isClosed 
                            ? 'bg-hexa-green text-hexa-yellow' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isClosed ? 'Apurado' : 'Aberto'}
                        </span>
                      </div>
                      
                      <p className="text-xs text-hexa-green/60 font-bold mb-3">
                        {formatGameDate(jogo.data_jogo)}
                      </p>

                      {isClosed && (
                        <div className="mt-2 p-2 bg-white/80 rounded-xl border border-hexa-green/15 flex items-center justify-between text-xs font-black">
                          <div>
                            Placar Real: <span className="text-base text-hexa-dark-green ml-1">{jogo.placar_real_brasil} x {jogo.placar_real_adversario}</span>
                          </div>
                          <div>
                            Gol: <span className="text-base text-hexa-dark-green ml-1">{jogo.primeiro_gol_real}</span>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex gap-2">
                        {!isClosed ? (
                          <button
                            onClick={() => {
                              setScoringGame(jogo);
                              setScoreForm({
                                placar_real_brasil: jogo.placar_real_brasil || 0,
                                placar_real_adversario: jogo.placar_real_adversario || 0,
                                primeiro_gol_real: jogo.primeiro_gol_real || ''
                              });
                              setSuccess('');
                            }}
                            className="bg-hexa-green text-hexa-yellow hover:bg-hexa-dark-green text-xs font-black uppercase tracking-wider py-2 px-3 rounded-lg flex-1 shadow-sm transition-all"
                          >
                            Digitar Placar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleResetGame(jogo.id)}
                            className="bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-black uppercase tracking-wider py-2 px-3 rounded-lg flex-1 transition-all flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Reabrir Jogo
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Statistics summary card */}
            <div className="bg-white p-6 rounded-3xl border-2 border-hexa-green/10 shadow-lg relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-hexa-yellow/20 rounded-full blur-2xl"></div>

              <h2 className="text-xl font-black uppercase italic border-b-2 border-hexa-green/15 pb-3 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" /> Métricas Rápidas
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-hexa-green/5 p-4 rounded-2xl border border-hexa-green/10">
                  <span className="block text-xs font-bold text-hexa-green/60 uppercase">Palpites Registrados</span>
                  <span className="text-2xl font-black text-hexa-green">{stats.total}</span>
                </div>
                <div className="bg-hexa-green/5 p-4 rounded-2xl border border-hexa-green/10">
                  <span className="block text-xs font-bold text-hexa-green/60 uppercase">Acertaram Placar</span>
                  <span className="text-2xl font-black text-hexa-green">{stats.acertaramPlacar}</span>
                </div>
                <div className="bg-hexa-green/5 p-4 rounded-2xl border border-hexa-green/10">
                  <span className="block text-xs font-bold text-hexa-green/60 uppercase">Acertaram Gol</span>
                  <span className="text-2xl font-black text-hexa-green">{stats.acertaramGol}</span>
                </div>
                <div className="bg-hexa-green text-hexa-yellow p-4 rounded-2xl shadow-inner border border-hexa-green">
                  <span className="block text-xs font-black text-hexa-yellow/80 uppercase">🏆 Ganhadores</span>
                  <span className="text-2xl font-black">{stats.ganhadores}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Area: Apuração Form and Table list */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Real Match scoring section */}
            <AnimatePresence>
              {scoringGame && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white p-6 rounded-3xl border-4 border-hexa-yellow shadow-xl relative overflow-hidden"
                >
                  <button 
                    onClick={() => setScoringGame(null)}
                    className="absolute top-4 right-4 text-hexa-green/60 hover:text-hexa-green font-bold text-sm bg-hexa-green/5 hover:bg-hexa-green/10 p-2 rounded-full"
                  >
                    Fechar
                  </button>

                  <h3 className="text-xl md:text-2xl font-black uppercase italic text-hexa-green mb-1 font-outfit">
                    Apuração: Brasil x {scoringGame.adversario}
                  </h3>
                  <p className="text-xs font-bold text-hexa-green/60 uppercase tracking-wider mb-6">
                    Insira o resultado real oficial ou carregue automaticamente da internet.
                  </p>

                  <form onSubmit={handleSaveResult} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      
                      {/* Interactive Score fields */}
                      <div className="bg-hexa-green/5 p-4 rounded-2xl border border-hexa-green/10 flex items-center justify-between gap-4">
                        <div className="text-center flex-1">
                          <span className="block text-xs font-black uppercase mb-2">Brasil</span>
                          <input 
                            required
                            type="number"
                            min="0"
                            value={scoreForm.placar_real_brasil}
                            onChange={(e) => setScoreForm(prev => ({ ...prev, placar_real_brasil: Number(e.target.value) }))}
                            className="w-16 p-2 text-center text-xl font-black border-2 border-hexa-green bg-white rounded-lg"
                          />
                        </div>
                        <span className="text-2xl font-black italic">X</span>
                        <div className="text-center flex-1">
                          <span className="block text-xs font-black uppercase mb-2">{scoringGame.adversario}</span>
                          <input 
                            required
                            type="number"
                            min="0"
                            value={scoreForm.placar_real_adversario}
                            onChange={(e) => setScoreForm(prev => ({ ...prev, placar_real_adversario: Number(e.target.value) }))}
                            className="w-16 p-2 text-center text-xl font-black border-2 border-hexa-green bg-white rounded-lg"
                          />
                        </div>
                      </div>

                      {/* First scorer field */}
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase block">Autor do Primeiro Gol do Brasil:</label>
                        <input 
                          required
                          type="text"
                          placeholder="Quem marcou o gol do Brasil?"
                          value={scoreForm.primeiro_gol_real}
                          onChange={(e) => setScoreForm(prev => ({ ...prev, primeiro_gol_real: e.target.value }))}
                          className="w-full p-4 border-2 border-hexa-green bg-white rounded-xl font-bold"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-3">
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleAutoPull(scoringGame.id)}
                        className="bg-white border-2 border-hexa-green text-hexa-green hover:bg-hexa-green/5 py-4 px-6 rounded-xl font-black text-sm uppercase italic flex items-center justify-center gap-2 flex-1 shadow-sm transition-all"
                      >
                        <RefreshCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
                        <span>Puxar Resultado Automático</span>
                      </button>

                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="bg-hexa-green text-hexa-yellow hover:bg-hexa-dark-green py-4 px-6 rounded-xl font-black text-sm uppercase italic flex items-center justify-center gap-2 flex-1 shadow-md transition-all border-2 border-hexa-green"
                      >
                        <Check className="w-5 h-5" />
                        <span>Confirmar e Encerrar Jogo</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Participants list container */}
            <div className="bg-white p-6 rounded-3xl border-2 border-hexa-green/10 shadow-lg">
              
              {/* Dynamic Toolbar filters */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b-2 border-hexa-green/10 pb-6 mb-6">
                
                {/* Game filter dropdown */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-xs font-black uppercase shrink-0">Filtrar Jogo:</span>
                  <select
                    value={selectedGameId}
                    onChange={(e) => {
                      setSelectedGameId(e.target.value);
                      setFilterType('todos');
                    }}
                    className="p-3 border-2 border-hexa-green bg-white rounded-xl font-bold w-full md:w-48 text-sm"
                  >
                    <option value="todos">Todos os Jogos</option>
                    {jogos.map(g => (
                      <option key={g.id} value={g.id.toString()}>Brasil x {g.adversario}</option>
                    ))}
                  </select>
                </div>

                {/* Filter tags */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'placar', label: 'Acertaram Placar' },
                    { id: 'gol', label: 'Acertaram Gol' },
                    { id: 'ganhadores', label: '🏆 Ganhadores (Desempate)' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterType(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border-2 transition-all ${
                        filterType === tab.id
                          ? tab.id === 'ganhadores'
                            ? 'bg-hexa-green text-hexa-yellow border-hexa-green ring-2 ring-hexa-yellow'
                            : 'bg-hexa-green text-hexa-yellow border-hexa-green'
                          : 'bg-white border-hexa-green/10 text-hexa-green/60 hover:border-hexa-green/30'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search & CSV Download bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                
                {/* Search Box */}
                <div className="relative w-full md:w-72">
                  <Search className="w-5 h-5 text-hexa-green/40 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    placeholder="Pesquisar participante..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-hexa-green bg-white rounded-xl text-sm font-bold shadow-inner"
                  />
                </div>

                {/* CSV Button */}
                <button
                  onClick={handleExportCSV}
                  className="bg-white border-2 border-hexa-green text-hexa-green hover:bg-hexa-green hover:text-hexa-yellow py-3 px-5 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 w-full md:w-auto shadow-sm"
                >
                  <Download className="w-4 h-4" /> Exportar Filtrados (.csv)
                </button>
              </div>

              {/* Dynamic Table wrapper */}
              <div className="overflow-x-auto rounded-2xl border border-hexa-green/10 shadow-inner bg-white">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-hexa-green/5 text-xs font-black uppercase tracking-wider text-hexa-green border-b border-hexa-green/10">
                      <th className="p-4">Participante</th>
                      <th className="p-4">Cidade / Tel</th>
                      <th className="p-4">Cupom Fiscal</th>
                      <th className="p-4 text-center">Partida</th>
                      <th className="p-4 text-center">Palpite</th>
                      <th className="p-4">Primeiro Gol</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hexa-green/10">
                    {filteredList.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-16 text-center">
                          <AlertCircle className="w-10 h-10 text-hexa-green/20 mx-auto mb-2" />
                          <p className="font-black text-hexa-green/40 uppercase italic tracking-wider">
                            Nenhum palpite corresponde aos filtros selecionados.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredList.map((p) => (
                        <tr 
                          key={p.id} 
                          className={`hover:bg-hexa-green/[0.02] transition-colors ${
                            p.ganhador 
                              ? 'bg-amber-50/50 border-l-4 border-l-amber-500' 
                              : ''
                          }`}
                        >
                          <td className="p-4">
                            <div className="font-bold text-hexa-dark-green flex items-center gap-1.5">
                              {p.nome}
                              {p.ganhador && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest flex items-center shrink-0">
                                  🏆 Ganhador
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-hexa-green/60">{p.email}</div>
                          </td>
                          <td className="p-4 text-xs font-bold">
                            <div>{p.cidade}</div>
                            <div className="text-hexa-green/50">{p.telefone}</div>
                          </td>
                          <td className="p-4 font-mono font-bold text-xs">
                            {p.cupom_fiscal}
                          </td>
                          <td className="p-4 text-center text-xs font-bold">
                            Brasil x {p.adversario}
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-mono font-black bg-hexa-green/5 text-hexa-green px-2.5 py-1 rounded-lg border border-hexa-green/10 shadow-sm text-sm">
                              {p.placar_brasil} x {p.placar_adversario}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-bold capitalize">{p.primeiro_gol}</div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col gap-1 items-center">
                              {p.jogo_status !== 'encerrado' ? (
                                <span className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> Aguardando
                                </span>
                              ) : p.ganhador ? (
                                <span className="bg-amber-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                                  🏆 Venceu
                                </span>
                              ) : p.acertou_placar ? (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1">
                                  ⚽ Acertou Placar
                                </span>
                              ) : (
                                <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                                  Não Ganhou
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>

      {/* Premium Footer */}
      <footer className="w-full bg-hexa-green border-t-4 border-hexa-yellow text-white py-12 px-6 md:px-[150px] mt-auto z-10 shrink-0 shadow-[0_-10px_30px_rgba(0,75,35,0.1)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Column 1: Logo & Copercana Info */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <a 
              href="https://copercana.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center transition-transform hover:scale-105 active:scale-95"
            >
              <img 
                src="/logo.png" 
                alt="Posto Copercana" 
                className="h-10 w-auto object-contain select-none mix-blend-screen" 
              />
            </a>
            <p className="text-2xs sm:text-xs font-outfit font-bold uppercase tracking-wider text-hexa-yellow/80 text-center md:text-left">
              Postos Copercana — Rumo ao Hexa
            </p>
          </div>

          {/* Column 2: Social Networks */}
          <div className="flex flex-col items-center space-y-3">
            <span className="text-2xs sm:text-xs font-outfit font-black uppercase italic tracking-widest text-hexa-yellow">
              Siga Nossas Redes
            </span>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/copercana/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-hexa-dark-green border border-hexa-yellow/30 flex items-center justify-center text-hexa-yellow hover:bg-hexa-yellow hover:text-hexa-green hover:scale-110 hover:border-hexa-yellow transition-all duration-300 shadow-md"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/copercanacoop/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-hexa-dark-green border border-hexa-yellow/30 flex items-center justify-center text-hexa-yellow hover:bg-hexa-yellow hover:text-hexa-green hover:scale-110 hover:border-hexa-yellow transition-all duration-300 shadow-md"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a 
                href="https://www.youtube.com/@CopercanaOficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-hexa-dark-green border border-hexa-yellow/30 flex items-center justify-center text-hexa-yellow hover:bg-hexa-yellow hover:text-hexa-green hover:scale-110 hover:border-hexa-yellow transition-all duration-300 shadow-md"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
              <a 
                href="https://copercana.com.br/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-hexa-dark-green border border-hexa-yellow/30 flex items-center justify-center text-hexa-yellow hover:bg-hexa-yellow hover:text-hexa-green hover:scale-110 hover:border-hexa-yellow transition-all duration-300 shadow-md"
              >
                <GlobeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 3: Regulation link */}
          <div className="flex flex-col items-center md:items-end space-y-3">
            <span className="text-2xs sm:text-xs font-outfit font-black uppercase italic tracking-widest text-hexa-yellow">
              Dúvidas ou Regras?
            </span>
            <a 
              href="/regulamento"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, '', '/regulamento');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-hexa-yellow text-hexa-green hover:bg-white hover:text-hexa-green hover:scale-105 active:scale-95 px-5 py-2.5 rounded-full font-outfit font-black text-xs sm:text-sm uppercase italic tracking-wider transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              <span>Regulamento Oficial</span>
            </a>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-white/40 text-[10px] sm:text-xs font-outfit font-bold uppercase tracking-wider">
          &copy; 2026 Copercana. Todos os direitos reservados. Fica proibida a participação de colaboradores dos postos participantes.
        </div>
      </footer>
    </div>
  );
};

export default Admin;
