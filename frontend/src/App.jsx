import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Trophy, Phone, Mail, User, Ticket, Send, CheckCircle, Star, Clock, AlertTriangle, ChevronRight, MapPin, ArrowUpRight } from 'lucide-react';
import axios from 'axios';

// Soccer Ball Icon fallback if not available in lucide-react
const SoccerIcon = ({ size = 24, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m6.7 6.7 10.6 10.6"></path><path d="m6.7 17.3 10.6-10.6"></path><path d="M12 2v20"></path><path d="M2 12h20"></path><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path></svg>
);

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

const ParallaxElement = ({ children, offset = 100, className = "" }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset]);
  return (
    <motion.div style={{ y }} className={`absolute pointer-events-none z-0 ${className}`}>
      {children}
    </motion.div>
  );
};

const getFlagUrl = (countryName) => {
  if (!countryName) return '';
  const cleanName = countryName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  switch (cleanName) {
    case 'brasil':
      return 'https://flagcdn.com/w640/br.png';
    case 'marrocos':
      return 'https://flagcdn.com/w640/ma.png';
    case 'haiti':
      return 'https://flagcdn.com/w640/ht.png';
    case 'escocia':
      return 'https://flagcdn.com/w640/gb-sct.png';
    default:
      return `https://flagcdn.com/w640/${cleanName.substring(0, 2)}.png`;
  }
};

const App = () => {
  const { scrollYProgress } = useScroll();
  
  // Game states
  const [activeGame, setActiveGame] = useState(null);
  const [gameLoading, setGameLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [isClosed, setIsClosed] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    cidade: '',
    cupom_fiscal: '',
    placar_brasil: 0,
    placar_adversario: 0,
    primeiro_gol: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const cidades = [
    "Barretos", "Jaboticabal", "Pitangueiras", "Pontal", 
    "Ribeirão Preto", "Santa Rosa de Viterbo", "Sertãozinho"
  ].sort();

  // Load active game on mount
  useEffect(() => {
    const fetchActiveGame = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/jogo-ativo');
        setActiveGame(response.data);
        setHasLoadError(false);
      } catch (err) {
        console.error('Error fetching active game:', err);
        setError('Não foi possível carregar os jogos ativos da Copa.');
        setHasLoadError(true);
      } finally {
        setGameLoading(false);
      }
    };
    fetchActiveGame();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!activeGame) return;

    const updateCountdown = () => {
      const agora = new Date();
      const dataJogo = new Date(activeGame.data_jogo);
      const limitePalpite = new Date(dataJogo.getTime() - 30 * 60 * 1000); // 30 minutes before kickoff

      const diff = limitePalpite.getTime() - agora.getTime();

      if (diff <= 0) {
        setIsClosed(true);
        setTimeLeft('Encerrado');
      } else {
        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        let timeString = '';
        if (days > 0) timeString += `${days}d `;
        if (hours > 0 || days > 0) timeString += `${hours}h `;
        timeString += `${minutes}m e ${seconds}s`;

        setTimeLeft(timeString);
        setIsClosed(false);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeGame]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Mask for Cupom Fiscal: Only numbers
    if (name === 'cupom_fiscal') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }

    // Mask for Telefone: Brazilian phone format (XX) XXXX-XXXX or (XX) XXXXX-XXXX
    if (name === 'telefone') {
      const rawDigits = value.replace(/\D/g, '').slice(0, 11);
      let formatted = '';
      
      if (rawDigits.length <= 2) {
        formatted = rawDigits.length > 0 ? `(${rawDigits}` : '';
      } else if (rawDigits.length <= 6) {
        formatted = `(${rawDigits.slice(0, 2)}) ${rawDigits.slice(2)}`;
      } else if (rawDigits.length <= 10) {
        formatted = `(${rawDigits.slice(0, 2)}) ${rawDigits.slice(2, 6)}-${rawDigits.slice(6)}`;
      } else {
        formatted = `(${rawDigits.slice(0, 2)}) ${rawDigits.slice(2, 7)}-${rawDigits.slice(7)}`;
      }
      
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isClosed || !activeGame) {
      setError('Os palpites para este jogo já foram encerrados.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        jogo_id: activeGame.id
      };
      const response = await axios.post('http://localhost:3001/api/participar', payload);
      if (response.status === 201) {
        setSubmitted(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao enviar palpite. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatGameDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + 
           date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + 'h';
  };

  const formatLockDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(new Date(dateStr).getTime() - 30 * 60 * 1000);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + 'h';
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-hexa-yellow">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 rounded-3xl max-w-md w-full text-center border-4 border-hexa-green bg-white shadow-2xl"
        >
          <div className="flex justify-center mb-6">
             <CheckCircle className="w-20 h-20 text-hexa-green" />
          </div>
          <h1 className="text-3xl font-black text-hexa-green mb-2 font-outfit uppercase italic">Valeu, Campeão!</h1>
          <p className="text-hexa-dark-green text-xl mb-6 font-bold font-outfit">Seu palpite foi registrado.</p>
          <p className="text-hexa-green/70 mb-8 font-outfit font-medium italic">
            Acertando o placar da partida, você participa do desempate pelo primeiro gol do Brasil! Boa sorte no vale-combustível de R$ 200,00!
          </p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setFormData({
                nome: '',
                telefone: '',
                email: '',
                cidade: '',
                cupom_fiscal: '',
                placar_brasil: 0,
                placar_adversario: 0,
                primeiro_gol: ''
              });
            }}
            className="primary w-full py-4 rounded-xl text-lg font-outfit"
          >
            Fazer outro palpite
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hexa-yellow relative overflow-hidden flex flex-col">
      {/* Header Navbar (100px) */}
      <header className="h-[100px] w-full bg-hexa-green border-b-4 border-hexa-yellow shadow-lg flex items-center z-40 shrink-0">
        <div className="w-full flex items-center justify-center md:justify-between px-6 md:px-[150px]">
          {/* Logo (clickable and responsive) */}
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

          {/* External Button (hidden on mobile, visible on desktop) */}
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
      <div className="flex-1 w-full p-4 md:p-8 flex flex-col items-center z-10">


      {/* Parallax Decorations */}
      {/* 1. Camisa 10 (Left Top) */}
      <ParallaxElement offset={-180} className="top-[10%] left-[-2%] sm:left-[4%] md:left-[6%] select-none z-0">
        <motion.img 
          src="/camisa-10.png" 
          alt="" 
          className="w-[120px] sm:w-[180px] md:w-[220px] h-auto object-contain pointer-events-none select-none rotate-[-15deg] scale-105 opacity-90 filter drop-shadow-md"
        />
      </ParallaxElement>

      {/* 2. Palmas (Right Top) */}
      <ParallaxElement offset={-80} className="top-[5%] right-[-1%] sm:right-[5%] md:right-[8%] select-none z-0">
        <motion.img 
          src="/palmas.png" 
          alt="" 
          className="w-[100px] sm:w-[150px] md:w-[180px] h-auto object-contain pointer-events-none select-none rotate-[20deg] scale-95 opacity-80 filter drop-shadow-md"
        />
      </ParallaxElement>

      {/* 3. Chuteira (Right Upper-Middle) */}
      <ParallaxElement offset={220} className="top-[22%] right-[-3%] sm:right-[3%] md:right-[4%] select-none z-0">
        <motion.img 
          src="/chuteira.png" 
          alt="" 
          className="w-[120px] sm:w-[180px] md:w-[230px] h-auto object-contain pointer-events-none select-none rotate-[-25deg] scale-[1.05] opacity-90 filter drop-shadow-md"
        />
      </ParallaxElement>

      {/* 4. Vuvuzela (Left Middle) */}
      <ParallaxElement offset={-230} className="top-[36%] left-[2%] sm:left-[6%] md:left-[10%] select-none z-0">
        <motion.img 
          src="/vuvuzela.png" 
          alt="" 
          className="w-[110px] sm:w-[150px] md:w-[200px] h-auto object-contain pointer-events-none select-none rotate-[35deg] scale-[0.95] opacity-85 filter drop-shadow-md"
        />
      </ParallaxElement>

      {/* 5. Palmas (Right Middle) */}
      <ParallaxElement offset={140} className="top-[49%] right-[-2%] sm:right-[7%] md:right-[11%] select-none z-0">
        <motion.img 
          src="/palmas.png" 
          alt="" 
          className="w-[110px] sm:w-[160px] md:w-[210px] h-auto object-contain pointer-events-none select-none rotate-[-12deg] scale-[1.1] opacity-75 filter drop-shadow-md"
        />
      </ParallaxElement>

      {/* 6. Gol (Left Lower-Middle) */}
      <ParallaxElement offset={-270} className="top-[61%] left-[-4%] sm:left-[1%] md:left-[3%] select-none z-0">
        <motion.img 
          src="/gol.png" 
          alt="" 
          className="w-[140px] sm:w-[200px] md:w-[260px] h-auto object-contain pointer-events-none select-none rotate-[-5deg] scale-[1.15] opacity-90 filter drop-shadow-md"
        />
      </ParallaxElement>

      {/* 7. Camisa 10 (Right Lower-Middle) */}
      <ParallaxElement offset={260} className="top-[73%] right-[-2%] sm:right-[4%] md:right-[7%] select-none z-0">
        <motion.img 
          src="/camisa-10.png" 
          alt="" 
          className="w-[120px] sm:w-[180px] md:w-[220px] h-auto object-contain pointer-events-none select-none rotate-[18deg] scale-[0.9] opacity-85 filter drop-shadow-md"
        />
      </ParallaxElement>

      {/* 8. Chuteira (Left Bottom) */}
      <ParallaxElement offset={-190} className="top-[84%] left-[1%] sm:left-[5%] md:left-[9%] select-none z-0">
        <motion.img 
          src="/chuteira.png" 
          alt="" 
          className="w-[110px] sm:w-[170px] md:w-[220px] h-auto object-contain pointer-events-none select-none rotate-[-35deg] scale-[1.05] opacity-90 filter drop-shadow-md"
        />
      </ParallaxElement>

      {/* 9. Vuvuzela (Right Bottom) */}
      <ParallaxElement offset={320} className="top-[93%] right-[-3%] sm:right-[2%] md:right-[5%] select-none z-0">
        <motion.img 
          src="/vuvuzela.png" 
          alt="" 
          className="w-[100px] sm:w-[150px] md:w-[190px] h-auto object-contain pointer-events-none select-none rotate-[40deg] scale-100 opacity-90 filter drop-shadow-md"
        />
      </ParallaxElement>

      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6 mt-6 max-w-4xl"
      >
        <div className="flex justify-center items-center select-none max-w-full px-4 mb-6">
          <img 
            src="/selecao-logo.png" 
            alt="Seleção Copercana" 
            className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] h-auto object-contain"
          />
        </div>

        {/* Promotion title banner */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-outfit font-black text-hexa-green uppercase italic tracking-tighter mb-6 leading-none select-none drop-shadow-sm">
          Pit Stop do Hexa <br className="sm:hidden" />
          <span className="bg-hexa-green text-hexa-yellow px-5 py-2.5 rounded-2xl inline-block transform -rotate-1.5 shadow-[5px_5px_0px_#001D0E] border-3 border-white mt-3 sm:mt-0 font-outfit font-black">
            Palpite Premiado
          </span>
        </h1>
        
        <div className="space-y-2 text-hexa-green font-extrabold text-lg md:text-2xl font-outfit max-w-2xl mx-auto italic leading-tight">
          <p>Abasteça a partir de <span className="bg-hexa-green text-hexa-yellow px-2">10L</span> e entre em campo.</p>
          <p>Acerte o placar e concorra a <span className="bg-hexa-green text-hexa-yellow px-2 whitespace-nowrap">R$ 200,00 em vale-combustível.</span></p>
        </div>
      </motion.header>

      {gameLoading ? (
        <div className="flex flex-col items-center justify-center p-20">
          <div className="w-12 h-12 border-4 border-hexa-green border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-outfit font-black text-hexa-green uppercase italic">Carregando jogo ativo...</p>
        </div>
      ) : hasLoadError ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl max-w-xl w-full text-center border-4 border-red-600 bg-white shadow-2xl mt-8"
        >
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4 animate-bounce" />
          <h3 className="text-3xl font-black text-red-600 uppercase italic font-outfit mb-3">Erro de Conexão</h3>
          <p className="text-red-800 text-lg font-outfit font-bold mb-4">
            Não foi possível carregar os jogos ativos da Copa.
          </p>
          <p className="text-red-700/80 text-sm font-outfit font-medium italic">
            Por favor, certifique-se de que o servidor backend (porta 3001) e o banco de dados MySQL estão rodando, e tente atualizar a página.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 font-outfit uppercase italic"
          >
            Tentar Novamente
          </button>
        </motion.div>
      ) : activeGame === null ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl max-w-xl w-full text-center border-4 border-hexa-green bg-white shadow-2xl mt-8"
        >
          <Trophy className="w-16 h-16 text-hexa-green mx-auto mb-4 animate-bounce" />
          <h3 className="text-3xl font-black text-hexa-green uppercase italic font-outfit mb-3">Campanha Concluída!</h3>
          <p className="text-hexa-dark-green text-lg font-outfit font-bold">
            Todos os jogos da Copa já foram realizados e avaliados. Obrigado pela sua participação nesta jornada rumo ao Hexa!
          </p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl w-full max-w-2xl mb-12 relative bg-white border-4 border-hexa-green shadow-[0_25px_60px_rgba(0,75,35,0.18)]"
        >
          {/* Real-time Countdown Banner (Fully Responsive Stack/Row) */}
          <div className={`mb-6 p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 font-outfit shadow-md transition-all ${
            isClosed 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : 'bg-hexa-green text-hexa-yellow border-hexa-green'
          }`}>
            <div className="flex items-center space-x-3">
              {isClosed ? <AlertTriangle className="w-6 h-6 shrink-0 text-red-600" /> : <Clock className="w-6 h-6 shrink-0 animate-pulse" />}
              <div>
                <span className={`block text-2xs sm:text-xs font-black uppercase tracking-wider opacity-90 ${isClosed ? 'text-red-500' : 'text-hexa-yellow/80'}`}>
                  {activeGame.adversario} — {formatGameDate(activeGame.data_jogo)}
                </span>
                <span className="block text-base sm:text-lg font-black uppercase italic leading-none mt-1">
                  {isClosed ? 'Palpites Encerrados' : 'Palpites fecham em:'}
                </span>
              </div>
            </div>
            {!isClosed && (
              <div className="text-left sm:text-right shrink-0">
                <span className="inline-block font-mono text-lg sm:text-xl md:text-2xl font-black bg-hexa-dark-green px-4 py-2 rounded-xl border border-hexa-yellow/20 shadow-inner whitespace-nowrap">
                  {timeLeft}
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="bg-[#001D0E] p-4 -mx-5 sm:-mx-8 md:-mx-10 mb-8 shadow-lg flex flex-col justify-center items-center relative overflow-hidden">
              {/* Left Flag (Brasil) with linear fading mask */}
              <div className="absolute inset-y-0 left-0 w-[45%] pointer-events-none select-none z-0">
                <img 
                  src={getFlagUrl('brasil')} 
                  alt="Brasil" 
                  className="h-full w-full object-cover object-left"
                  style={{
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.05) 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.05) 100%)'
                  }}
                />
              </div>

              {/* Right Flag (Adversary) with linear fading mask */}
              <div className="absolute inset-y-0 right-0 w-[45%] pointer-events-none select-none z-0">
                <img 
                  src={getFlagUrl(activeGame.adversario)} 
                  alt={activeGame.adversario} 
                  className="h-full w-full object-cover object-right"
                  style={{
                    maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.05) 100%)',
                    WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.05) 100%)'
                  }}
                />
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-white text-center uppercase italic font-outfit relative z-10">
                Palpite para Brasil x {activeGame.adversario.toUpperCase()}
              </h3>
              <p className="text-3xs sm:text-xs text-white/95 font-outfit font-bold uppercase tracking-wider mt-1 text-center relative z-10">
                Envios abertos até às {formatLockDate(activeGame.data_jogo)} do dia do jogo
              </p>
            </div>

            {/* Score guessing grid (Fully Responsive Mobile Padding & Sizes) */}
            <div className="flex items-center justify-between max-w-sm sm:max-w-md mx-auto mb-8 sm:mb-10 p-4 sm:p-6 rounded-2xl bg-hexa-green/[0.04] border-2 border-hexa-green/15 shadow-inner">
              <div className="text-center flex-1 flex flex-col items-center">
                <span className="block text-hexa-green font-black text-xl sm:text-3xl mb-2 sm:mb-3 font-outfit italic tracking-wider">BRASIL</span>
                <input 
                  disabled={isClosed}
                  type="number"
                  name="placar_brasil"
                  min="0"
                  value={formData.placar_brasil}
                  onChange={handleChange}
                  className="w-16 sm:w-24 text-center text-2xl sm:text-4xl font-black p-3 sm:p-6 rounded-xl shadow-md border-2 border-hexa-green disabled:opacity-50"
                />
              </div>
              <span className="text-4xl sm:text-5xl font-black text-hexa-green mt-6 sm:mt-8 font-outfit italic px-2">X</span>
              <div className="text-center flex-1 flex flex-col items-center">
                <span className="block text-hexa-green font-black text-xl sm:text-3xl mb-2 sm:mb-3 font-outfit italic tracking-wider truncate max-w-[100px] sm:max-w-none">{activeGame.adversario.toUpperCase()}</span>
                <input 
                  disabled={isClosed}
                  type="number"
                  name="placar_adversario"
                  min="0"
                  value={formData.placar_adversario}
                  onChange={handleChange}
                  className="w-16 sm:w-24 text-center text-2xl sm:text-4xl font-black p-3 sm:p-6 rounded-xl shadow-md border-2 border-hexa-green disabled:opacity-50"
                />
              </div>
            </div>

            {/* Tiebreaker first goal */}
            <div className="space-y-3 p-5 rounded-2xl bg-hexa-green/5 border border-hexa-green/10">
              <label className="text-xl font-black italic block text-hexa-green">
                ⭐ Critério de Desempate:
              </label>
              <p className="text-sm text-hexa-green/80 font-outfit font-bold leading-tight mb-2">
                Caso múltiplas pessoas acertem o placar exato, o vencedor será quem acertar o jogador que fará o **primeiro gol do Brasil**!
              </p>
              <input 
                disabled={isClosed}
                required
                type="text"
                name="primeiro_gol"
                value={formData.primeiro_gol}
                onChange={handleChange}
                placeholder="Ex: Vinicius Jr, Neymar, Rodrygo..."
                className="w-full p-4 rounded-xl font-outfit text-lg font-bold border-2 border-hexa-green bg-white disabled:opacity-50"
              />
            </div>

            {/* User details */}
            <div className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-outfit flex items-center font-bold"><User className="w-5 h-5 mr-2" />Nome:</label>
                  <input 
                    disabled={isClosed}
                    required
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl font-outfit font-bold disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-outfit flex items-center font-bold"><Phone className="w-5 h-5 mr-2" />Telefone:</label>
                  <input 
                    disabled={isClosed}
                    required
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    className="w-full p-4 rounded-xl font-outfit font-bold disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-outfit flex items-center font-bold"><Mail className="w-5 h-5 mr-2" />E-mail:</label>
                  <input 
                    disabled={isClosed}
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl font-outfit font-bold disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-outfit flex items-center font-bold"><MapPin className="w-5 h-5 mr-2" />Cidade:</label>
                  <select 
                    disabled={isClosed}
                    required
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl font-outfit font-bold disabled:opacity-50"
                  >
                    <option value="">Selecione...</option>
                    {cidades.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-outfit flex items-center font-bold"><Ticket className="w-5 h-5 mr-2" />Cupom Fiscal:</label>
                <input 
                  disabled={isClosed}
                  required
                  type="text"
                  inputMode="numeric"
                  name="cupom_fiscal"
                  value={formData.cupom_fiscal}
                  onChange={handleChange}
                  placeholder="Apenas números do cupom"
                  className="w-full p-4 rounded-xl font-outfit font-bold disabled:opacity-50"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-600 text-white rounded-xl text-center font-bold flex items-center justify-center space-x-2 shadow-lg"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </motion.div>
            )}

            {isClosed ? (
              <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-200 text-red-800 text-center font-outfit font-bold shadow-md mt-6">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2 animate-bounce" />
                <h4 className="text-lg font-black uppercase italic">Palpites Encerrados</h4>
                <p className="text-sm opacity-85 mt-1">
                  Esta rodada fechou para envios às {formatLockDate(activeGame.data_jogo)} (30 minutos antes do início do jogo). Torça pelo Brasil e boa sorte!
                </p>
              </div>
            ) : (
              <button 
                disabled={loading}
                type="submit"
                className={`primary w-full py-6 rounded-2xl text-2xl font-black flex items-center justify-center space-x-4 mt-6 shadow-xl ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="w-8 h-8 border-4 border-hexa-yellow border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-7 h-7" />
                    <span>Enviar Palpite Premiado</span>
                  </>
                )}
              </button>
            )}
          </form>

          <div className="mt-12 text-center text-hexa-green/60 text-sm font-bold font-outfit italic">
            <p>* Palpites válidos se enviados até 30 minutos antes do pontapé inicial.</p>
            <p>Promoção exclusiva Postos Copercana.</p>
          </div>
        </motion.div>
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

export default App;
