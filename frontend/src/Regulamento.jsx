import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Trophy, FileText, ArrowLeft, Fuel, Calendar, Award, Gift, PhoneCall, ShieldAlert, Star, ArrowUpRight } from 'lucide-react';

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


const Regulamento = () => {
  const rules = [
    {
      id: 1,
      icon: <Fuel className="w-6 h-6 text-hexa-green" />,
      title: "Critério de Abastecimento",
      text: "A cada abastecimento a partir de 10 litros (gasolina, etanol ou diesel), o cliente ganha 01 (um) \"Card de Palpite\" por venda."
    },
    {
      id: 2,
      icon: <Calendar className="w-6 h-6 text-hexa-green" />,
      title: "Registro de Palpite",
      text: "O palpite deve ser registrado até 30 minutos antes de cada jogo do Brasil. O participante deve acertar o placar exato e indicar qual jogador fará o primeiro gol do Brasil (ex.: Brasil 2 x 1 adversário - gol de Rafinha). Palpites de 0 a 0 não serão aceitos."
    },
    {
      id: 3,
      icon: <Award className="w-6 h-6 text-hexa-green" />,
      title: "Regra de Desempate",
      text: "Em caso de acerto do placar por mais de 1 pessoa, o critério de desempate será o acerto do marcador do primeiro gol do Brasil. Se ainda houver empate, o prêmio será decidido por sorteio."
    },
    {
      id: 4,
      icon: <Gift className="w-6 h-6 text-hexa-green" />,
      title: "Prêmio Vale-Combustível",
      text: "O ganhador receberá um Vale-Combustível de R$ 200,00 (duzentos reais). O prêmio é nominal e deve ser utilizado em até 30 dias corridos após a data da apuração. Após esse período o voucher expira."
    },
    {
      id: 5,
      icon: <PhoneCall className="w-6 h-6 text-hexa-green" />,
      title: "Validação & Retirada",
      text: "Após a apuração do resultado, a equipe do Posto Copercana entrará em contato com o ganhador através do telefone e/ou e-mail informados no cupom. O ganhador terá um prazo de 03 (três) dias úteis para responder ao contato e validar o prêmio. Caso o ganhador não seja localizado ou não responda dentro desse prazo, será desclassificado e automaticamente, faremos uma nova apuração/sorteio entre os demais palpites válidos para definir o novo vencedor."
    },
    {
      id: 6,
      icon: <ShieldAlert className="w-6 h-6 text-hexa-green" />,
      title: "Impedimento de Participação",
      text: "Ficam impedidos de participar desta promoção os funcionários dos postos participantes, seus cônjuges e companheiros."
    }
  ];

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
      <div className="flex-1 w-full p-4 md:p-8 flex flex-col items-center z-10 overflow-hidden">
      
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

      {/* Button to go back */}
      <div className="w-full max-w-3xl flex justify-start mb-6 z-10">
        <a 
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState(null, '', '/');
          }}
          className="inline-flex items-center space-x-2 bg-hexa-green text-hexa-yellow px-5 py-2.5 rounded-full font-outfit font-black text-sm uppercase italic hover:bg-hexa-dark-green transition-all shadow-lg hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Bolão</span>
        </a>
      </div>

      <motion.header 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10 max-w-4xl px-2 z-10"
      >
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-hexa-green uppercase italic tracking-tighter font-outfit leading-none mb-2">
          Regulamento Oficial
        </h1>
        <h2 className="text-xl sm:text-3xl font-black text-hexa-green/80 uppercase italic tracking-tighter font-outfit leading-none">
          Campanha Seleção Copercana
        </h2>
      </motion.header>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl w-full max-w-3xl mb-12 relative bg-white border-4 border-hexa-green shadow-[0_25px_60px_rgba(0,75,35,0.18)] z-10"
      >
        <div className="bg-hexa-green p-4 -mx-5 sm:-mx-8 md:-mx-10 mb-8 transform -rotate-1 shadow-lg flex justify-center items-center space-x-3">
          <FileText className="w-7 h-7 text-hexa-yellow" />
          <h3 className="text-xl sm:text-2xl font-black text-hexa-yellow uppercase italic font-outfit">
            Critérios de Participação e Regras
          </h3>
        </div>

        <div className="space-y-8">
          {rules.map((rule) => (
            <div 
              key={rule.id} 
              className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-hexa-green/[0.03] border border-hexa-green/10 hover:border-hexa-green/30 transition-all hover:bg-hexa-green/[0.05]"
            >
              {/* Custom numeric scoreboard badge */}
              <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-3 shrink-0">
                <div className="w-12 h-12 rounded-xl bg-hexa-green text-hexa-yellow flex items-center justify-center font-mono text-2xl font-black shadow-md border border-hexa-yellow/20">
                  {String(rule.id).padStart(2, '0')}
                </div>
                <div className="p-2.5 rounded-full bg-white border border-hexa-green/10 shadow-inner">
                  {rule.icon}
                </div>
              </div>

              {/* Rule description */}
              <div className="flex-1 space-y-1">
                <h4 className="text-lg font-outfit font-black text-hexa-green uppercase italic tracking-wide">
                  {rule.title}
                </h4>
                <p className="text-hexa-dark-green font-outfit font-bold text-base leading-relaxed">
                  {rule.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 rounded-2xl bg-hexa-green text-hexa-yellow border-2 border-hexa-yellow/30 shadow-inner text-center font-outfit font-bold italic">
          <Trophy className="w-8 h-8 mx-auto mb-2 animate-bounce text-hexa-yellow" />
          <p className="text-lg font-black uppercase">Participe, palpite e venha acelerar rumo ao Hexa!</p>
          <p className="text-xs opacity-75 mt-1">Postos Copercana — Todos os direitos reservados.</p>
        </div>
      </motion.div>

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

export default Regulamento;
