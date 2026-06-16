import { useState, useEffect, useRef, Component } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 24, color: '#EF4444', background: '#0B0B0F', minHeight: '100vh',
          fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: 16, boxSizing: 'border-box'
        }}>
          <h2 style={{ fontSize: 18, color: '#EF4444' }}>⚠️ Render Crash Detected</h2>
          <pre style={{ background: '#15151C', padding: 12, borderRadius: 8, overflowX: 'auto', fontSize: 12, border: '1px solid #EF444433', color: '#F3F4F6' }}>
            {this.state.error?.toString()}
          </pre>
          <pre style={{ background: '#15151C', padding: 12, borderRadius: 8, overflowX: 'auto', fontSize: 11, border: '1px solid #1F2937', color: '#9CA3AF', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.stack}
          </pre>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{
            background: '#EF4444', color: '#0B0B0F', border: 'none', borderRadius: 8, padding: '12px 20px',
            fontSize: 13, fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit'
          }}>
            Limpar LocalStorage e Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── TOKENS E CONSTANTES ───
const C = {
  bg: '#0B0B0F',
  surface: '#15151C',
  accent: '#00D4FF',
  success: '#10B981',
  warning: '#F59E0B',
  critical: '#EF4444',
  text: '#F3F4F6',
  textMuted: '#9CA3AF',
  border: '#1F2937',
  gold: '#C9A96A'
};

const PONTUACAO = {
  MISSAO_DEFINIDA: 2,
  MISSAO_CONCLUIDA: 3,
  CORRECAO_FUGA: 2,
  REFLEXAO_3_EUS: 1,
  MODO_MINIMO_ATIVADO: 2
};

const LIFE_AREAS = [
  { key: 'fe', label: 'FÉ', icon: '✝️', micro: 'Fé em baixa. Sugestão: [+ 5 MIN ORAÇÃO/MEDITAÇÃO]' },
  { key: 'familia', label: 'FAMÍLIA', icon: '🏠', micro: 'Família negligenciada. Sugestão: [+ 10 MIN CONVERSA INTENCIONAL]' },
  { key: 'saude', label: 'SAÚDE', icon: '❤️', micro: 'Saúde em baixa. Sugestão: [+ MOVIMENTO - CAMINHAR 15 MIN]' },
  { key: 'estudo', label: 'ESTUDO', icon: '📚', micro: 'Estudo lento. Sugestão: [+ RESOLVER 5 QUESTÕES]' },
  { key: 'carreira', label: 'CARREIRA', icon: '💼', micro: 'Carreira parada. Sugestão: [+ CONCLUIR 1 TAREFA DE IMPACTO]' }
];

const PILARES_CONSTITUICAO = [
  { id: 'fe', icon: '✝️', pilar: 'Fé', diretriz: 'Fortalecer a espiritualidade diariamente antes de focar nos negócios.' },
  { id: 'familia', icon: '🏠', pilar: 'Família', diretriz: 'Priorizar tempo de presença e conexão intencional em casa.' },
  { id: 'verdade', icon: '⚖️', pilar: 'Verdade', diretriz: 'Olhar de frente para falhas e problemas, sem justificativas.' },
  { id: 'disciplina', icon: '🔥', pilar: 'Disciplina', diretriz: 'Agir por dever e constância, nunca esperando ter vontade.' },
  { id: 'foco', icon: '🎯', pilar: 'Foco', diretriz: 'Executar a missão crítica antes de consumir qualquer entretenimento.' },
  { id: 'execucao', icon: '⚡', pilar: 'Execução', diretriz: 'Fazer o rascunho rápido. A clareza vem com o movimento.' },
  { id: 'futuro', icon: '📜', pilar: 'Futuro', diretriz: 'O Eu Presente deve proteger e construir a base do Eu Futuro.' },
  { id: 'constancia', icon: '🔗', pilar: 'Constância', diretriz: 'Evitar zerar o dia a todo custo. Manter a corrente ativa.' },
  { id: 'simplicidade', icon: '🪨', pilar: 'Simplicidade', diretriz: 'Dividir grandes projetos em ações simples de 5 minutos.' },
  { id: 'carater', icon: '🛡️', pilar: 'Caráter', diretriz: 'Manter a palavra dada e cumprir as promessas de forma íntegra.' }
];

const THEME_COLORS = [
  { hex: '#00D4FF', name: 'Cyan' },
  { hex: '#10B981', name: 'Verde' },
  { hex: '#F59E0B', name: 'Amarelo' },
  { hex: '#EF4444', name: 'Vermelho' },
  { hex: '#A855F7', name: 'Roxo' },
  { hex: '#EC4899', name: 'Rosa' }
];

const CRONOGRAMA_PILARES = [
  {
    id: 'mente', icon: '🧠', label: 'MENTE', cor: '#818CF8',
    descricao: 'Fortaleça sua capacidade intelectual.',
    atividades: [
      { id: 'mente-0', label: 'Estudar OAB (questões)', micro: 'Resolver pelo menos 10 questões.' },
      { id: 'mente-1', label: 'Estudar ADS (faculdade)', micro: 'Revisar matéria ou fazer atividade.' },
      { id: 'mente-2', label: 'Leitura / estudo livre', micro: 'Ler pelo menos 10 páginas.' },
      { id: 'mente-3', label: 'Resolver problemas / lógica', micro: 'Exercitar raciocínio por 15 min.' },
    ]
  },
  {
    id: 'alma', icon: '✝️', label: 'ALMA', cor: '#C9A96A',
    descricao: 'Cuide da sua conexão espiritual.',
    atividades: [
      { id: 'alma-0', label: 'Oração diária', micro: '5 minutos em oração.' },
      { id: 'alma-1', label: 'Devocional / Bíblia', micro: 'Ler um capítulo e refletir.' },
      { id: 'alma-2', label: 'Gratidão / reflexão', micro: 'Listar 3 motivos de gratidão.' },
      { id: 'alma-3', label: 'Servir alguém hoje', micro: 'Ajudar uma pessoa de forma intencional.' },
    ]
  },
  {
    id: 'trabalho', icon: '💼', label: 'TRABALHO', cor: '#F59E0B',
    descricao: 'Execute com excelência profissional.',
    atividades: [
      { id: 'trabalho-0', label: 'Mais Saúde — tarefa principal', micro: 'Resolver pendência ou avançar projeto.' },
      { id: 'trabalho-1', label: 'ComprasOps / projetos', micro: 'Trabalhar no projeto por pelo menos 30 min.' },
      { id: 'trabalho-2', label: 'Revisar pendências urgentes', micro: 'Checar lista e resolver 1 item.' },
      { id: 'trabalho-3', label: 'Organizar agenda / planejar', micro: 'Definir prioridades de amanhã.' },
    ]
  },
  {
    id: 'saude', icon: '❤️', label: 'SAÚDE', cor: '#EF4444',
    descricao: 'Proteja seu corpo e sua energia.',
    atividades: [
      { id: 'saude-0', label: 'Treino / academia', micro: 'Treino de pelo menos 30 minutos.' },
      { id: 'saude-1', label: 'Alimentação saudável', micro: 'Evitar ultraprocessados hoje.' },
      { id: 'saude-2', label: 'Hidratação (2L+)', micro: 'Beber pelo menos 2 litros de água.' },
      { id: 'saude-3', label: 'Sono adequado (7h+)', micro: 'Dormir até 23h e acordar cedo.' },
    ]
  }
];

function classificarDia(score) {
  if (score <= 3) return { label: "DIA FRACO", color: C.critical };
  if (score <= 5) return { label: "DIA MÍNIMO", color: C.textMuted };
  if (score <= 7) return { label: "DIA BOM", color: C.warning };
  if (score <= 9) return { label: "DIA FORTE", color: C.accent };
  return { label: "DIA ELITE", color: C.success };
}

const dateDisplay = () => {
  const d = new Date(), dd = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'],
    mm = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  return `${dd[d.getDay()]}, ${d.getDate()} ${mm[d.getMonth()]}`;
};

// ─── COMPONENTES UI REUTILIZÁVEIS ───
function Label({ text, color = C.textMuted }) {
  return (
    <div style={{
      fontSize: 10,
      fontFamily: 'monospace',
      letterSpacing: '0.15em',
      color: color,
      textTransform: 'uppercase',
      marginBottom: 10,
      fontWeight: 'bold'
    }}>
      {text}
    </div>
  );
}

function Btn({ label, variant = 'primary', onClick, disabled, full, small, activeColor = C.accent }) {
  const styles = {
    primary: { background: activeColor, color: C.bg, border: 'none' },
    secondary: { background: 'transparent', color: activeColor, border: `1.5px solid ${activeColor}` },
    success: { background: C.success, color: C.bg, border: 'none' },
    critical: { background: C.critical, color: C.text, border: 'none' }
  }[variant];

  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles, borderRadius: 8, padding: small ? '6px 12px' : '12px 18px',
      fontFamily: 'inherit', fontWeight: 700, fontSize: small ? 11 : 13,
      cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.35 : 1,
      width: full ? '100%' : 'auto', transition: 'all 0.15s ease', whiteSpace: 'nowrap',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6
    }}
      onMouseEnter={e => { if (!disabled) e.target.style.filter = 'brightness(1.15)' }}
      onMouseLeave={e => { if (!disabled) e.target.style.filter = 'none' }}>
      {label}
    </button>
  );
}

function Toast({ toastObj, onClose, activeColor = C.accent }) {
  useEffect(() => {
    if (toastObj) {
      const id = setTimeout(onClose, 3000);
      return () => clearTimeout(id);
    }
  }, [toastObj, onClose]);

  if (!toastObj) return null;
  const { msg, type } = toastObj;
  
  const icon = {
    success: '✓',
    error: '✗',
    info: 'ℹ',
    warning: '!'
  }[type] || 'ℹ';

  const borderColor = {
    success: C.success,
    error: C.critical,
    info: activeColor,
    warning: C.warning
  }[type] || activeColor;

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      background: C.surface, border: `1px solid ${borderColor}`, borderRadius: 8,
      padding: '12px 20px', zIndex: 9999, display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)', animation: 'slideIn 0.3s ease-out', maxWidth: 360
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', background: `${borderColor}22`,
        border: `1.2px solid ${borderColor}`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 11, fontWeight: 'bold', color: borderColor
      }}>{icon}</div>
      <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{msg}</span>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', color: C.textMuted, fontSize: 14,
        marginLeft: 10, cursor: 'pointer'
      }}>×</button>
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ActionBreathing({ duration = 90, title = "🫁 PROTOCOLO DE RESPIRAÇÃO", subtitle = "", onComplete, onClose, activeColor = C.accent }) {
  const [t, setT] = useState(duration);
  const done = t <= 0;

  useEffect(() => {
    const id = setInterval(() => setT(p => p <= 1 ? 0 : p - 1), 1000);
    return () => clearInterval(id);
  }, []);

  const r = 70, circ = 2 * Math.PI * r, pct = (duration - t) / duration;
  const breatheState = t % 6 < 3 ? 'INSPIRE...' : 'EXPIRE...';

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(11,11,15,0.97)', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: 24
    }}>
      <div style={{ fontSize: 11, fontFamily: 'monospace', color: activeColor, letterSpacing: '0.25em', marginBottom: 20 }}>{title}</div>
      <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <svg width={160} height={160} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <circle cx={80} cy={80} r={r} fill="none" stroke="#222" strokeWidth={3} />
          <circle cx={80} cy={80} r={r} fill="none" stroke={activeColor} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <span style={{ fontSize: 16, fontWeight: 700, color: C.text, letterSpacing: '0.05em', animation: 'pulsing 3s infinite ease-in-out' }}>
          {done ? 'CONCLUÍDO' : breatheState}
        </span>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 30, maxWidth: 300 }}>
        <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.4 }}>{subtitle}</p>
        {!done && <p style={{ color: activeColor, fontFamily: 'JetBrains Mono, monospace', fontSize: 15, marginTop: 10 }}>{t}s</p>}
      </div>
      {done ? (
        <Btn label="RETOMAR FOCO ✓" onClick={onComplete} variant="success" activeColor={activeColor} />
      ) : (
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: 12, cursor: 'pointer', fontFamily: 'monospace' }}>cancelar</button>
      )}
      <style>{`
        @keyframes pulsing {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function SpotlightCard({ children, style = {}, className = "" }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
      className={className}
    >
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, rgba(201, 169, 106, 0.08), transparent 80%)`,
            zIndex: 1
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

// ─── DASHBOARD PRINCIPAL ───
function DashboardMain({ state, setState, triggerToast, score, classObj }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projEmoji, setProjEmoji] = useState('📚');
  const [projColor, setProjColor] = useState('#00D4FF');
  const [projObj, setProjObj] = useState('Aprender');
  const [projTarget, setProjTarget] = useState('ongoing');

  // Identidade states
  const [activePilar, setActivePilar] = useState(null);
  const [editPrincId, setEditPrincId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAction, setEditAction] = useState('');

  const EMOJIS = ['📚', '📱', '🏋️', '💼', '🎯', '🎨', '🚀', '❤️', '💡', '🔥'];

  const handleCreateProject = () => {
    if (!projName.trim()) return;
    const newProj = {
      id: 'proj-' + Date.now(),
      name: projName.trim(),
      description: projDesc.trim(),
      emoji: projEmoji,
      color: projColor,
      objective: projObj,
      target: projTarget,
      defaultTimer: 1500,
      roadmap: [],
      notes: []
    };
    setState(s => ({
      ...s,
      projects: [...(s.projects || []), newProj]
    }));
    setShowCreateModal(false);
    setProjName('');
    setProjDesc('');
    setProjEmoji('📚');
    setProjColor('#00D4FF');
    triggerToast('Projeto criado com sucesso!', 'success');
  };

  const handlePilarCheck = (pilarId) => {
    setState(s => {
      const current = s.constitutionChecks || {};
      return { ...s, constitutionChecks: { ...current, [pilarId]: !current[pilarId] } };
    });
    triggerToast('Pilar atualizado!', 'success');
  };

  const handleSavePrinciple = (id) => {
    if (!editTitle.trim() || !editAction.trim()) return;
    setState(s => {
      const current = s.customPrinciples || [];
      const updated = current.map(p => p.id === id ? { ...p, titulo: editTitle.trim(), acao: editAction.trim() } : p);
      return { ...s, customPrinciples: updated };
    });
    setEditPrincId(null);
    triggerToast('Princípio atualizado!', 'success');
  };

  const handleEusChange = (field, val) => {
    setState(s => {
      const currentEus = s.eus || { passado: '', presente: '', futuro: '' };
      return {
        ...s,
        eus: { ...currentEus, [field]: val },
        eusSaved: false
      };
    });
  };

  const handleSaveEus = () => {
    if (!state.eus?.passado?.trim() || !state.eus?.presente?.trim() || !state.eus?.futuro?.trim()) {
      triggerToast('Preencha os 3 campos da reflexão.', 'warning');
      return;
    }
    setState(s => ({ ...s, eusSaved: true }));
    triggerToast('Reflexão salva! +1 pt', 'success');
  };

  const pct = Math.min(Math.round((score / 10) * 100), 100);

  return (
    <div className="two-col-grid" style={{ padding: '20px 16px 100px' }}>
      
      {/* SEÇÃO METAS GERAIS DO DIA */}
      <div className="full-width-col">
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: C.textMuted }}>STATUS GERAL DE HOJE</span>
              <div style={{ fontSize: 18, fontWeight: 'bold', color: C.text, marginTop: 2 }}>{dateDisplay()}</div>
            </div>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: classObj.color, fontWeight: 'bold', border: `1px solid ${classObj.color}`, borderRadius: 4, padding: '3px 8px' }}>
              {classObj.label}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.textMuted, marginBottom: 8 }}>
            <span>Pontuação Combinada: <b style={{ color: C.text }}>{score}/10 pts</b></span>
            <span>Streak: <b style={{ color: C.accent }}>{state.streak || 0} dias</b></span>
          </div>
          <div style={{ width: '100%', height: 6, background: '#222', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, background: classObj.color, height: '100%', borderRadius: 3, transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </div>

      {/* COLUNA DA ESQUERDA: LISTA DE PROJETOS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Label text="📂 PROJETOS ATIVOS" color={C.accent} />
          <button onClick={() => setShowCreateModal(true)} style={{
            background: 'none', border: 'none', color: C.accent, fontWeight: 'bold', fontSize: 12, cursor: 'pointer'
          }}>➕ NOVO PROJETO</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(state.projects || []).map(p => {
            const projMissions = (state.missions || []).filter(m => m.project_id === p.id);
            const compMissions = projMissions.filter(m => m.status === 'done');
            
            const totalRoadmap = p.roadmap ? p.roadmap.length : 0;
            const compRoadmap = p.roadmap ? p.roadmap.filter(r => r.status === 'completed').length : 0;
            const roadmapPct = totalRoadmap > 0 ? Math.round((compRoadmap / totalRoadmap) * 100) : 0;

            const todayStr = new Date().toISOString().split('T')[0];
            const completedToday = projMissions.filter(m => m.status === 'done' && m.completed_at?.startsWith(todayStr)).length;

            return (
              <div key={p.id} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16,
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: p.color || C.accent }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{p.emoji || '🎯'}</span>
                    <span style={{ fontSize: 15, fontWeight: 'bold', color: C.text }}>{p.name}</span>
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: p.color || C.accent, background: `${p.color || C.accent}15`, padding: '2px 6px', borderRadius: 4, fontWeight: 'bold' }}>
                    {p.objective || 'Executar'}
                  </span>
                </div>

                {p.description && <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 14, lineHeight: 1.4 }}>{p.description}</p>}

                {/* Progresso do Roadmap */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.textMuted, marginBottom: 4 }}>
                    <span>Roadmap: {compRoadmap}/{totalRoadmap} concluídos</span>
                    <span>{roadmapPct}%</span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: '#222', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${roadmapPct}%`, background: p.color || C.accent, height: '100%', borderRadius: 2 }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: C.textMuted, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                  <div>
                    Missões: <b>{compMissions.length}</b> total | Hoje: <b style={{ color: C.text }}>{completedToday}</b>
                  </div>
                  <button onClick={() => setState(s => ({ ...s, activeProjectId: p.id }))} style={{
                    background: p.color || C.accent, border: 'none', borderRadius: 6, color: C.bg,
                    padding: '6px 12px', fontSize: 11, fontWeight: 'bold', cursor: 'pointer'
                  }}>
                    ABRIR →
                  </button>
                </div>
              </div>
            );
          })}

          {(state.projects || []).length === 0 && (
            <div style={{ textTransform: 'uppercase', textAlign: 'center', fontSize: 11, color: C.textMuted, fontFamily: 'monospace', padding: '40px 0', border: `1px dashed ${C.border}`, borderRadius: 12 }}>
              Nenhum projeto ativo. Clique em Novo Projeto para iniciar.
            </div>
          )}
        </div>
      </div>

      {/* COLUNA DA DIREITA: FUNDAMENTOS / HÁBITOS GERAIS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        
        {/* MEUS 3 PRINCÍPIOS */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <Label text="🏛️ MEUS 3 PRINCÍPIOS" color={C.gold} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(state.customPrinciples || []).map(p => (
              <div key={p.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}>
                {editPrincId === p.id ? (
                  <div>
                    <input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Princípio"
                      style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 8px', color: C.text, fontSize: 12, outline: 'none', marginBottom: 6, boxSizing: 'border-box' }} />
                    <input value={editAction} onChange={e => setEditAction(e.target.value)} placeholder="Ação diária"
                      style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 8px', color: C.text, fontSize: 12, outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleSavePrinciple(p.id)} style={{ padding: '4px 10px', background: C.accent, border: 'none', borderRadius: 6, color: C.bg, fontSize: 11, fontWeight: 'bold', cursor: 'pointer' }}>Salvar</button>
                      <button onClick={() => setEditPrincId(null)} style={{ padding: '4px 10px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, fontSize: 11, cursor: 'pointer' }}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{p.id}. {p.titulo}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Ação: <i>{p.acao}</i></div>
                    </div>
                    <button onClick={() => { setEditPrincId(p.id); setEditTitle(p.titulo); setEditAction(p.acao); }}
                      style={{ background: 'none', border: 'none', color: C.accent, fontSize: 11, cursor: 'pointer', fontFamily: 'monospace' }}>editar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ACORDEÃO DA CONSTITUIÇÃO */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <Label text="📜 CONSTITUIÇÃO (10 PILARES)" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PILARES_CONSTITUICAO.map(p => {
              const active = activePilar === p.id;
              const checked = !!state.constitutionChecks?.[p.id];
              return (
                <div key={p.id} style={{ border: `1px solid ${C.border}`, borderRadius: 8, background: active ? C.bg : 'transparent', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px' }}>
                    <button onClick={() => setActivePilar(active ? null : p.id)} style={{
                      background: 'none', border: 'none', flex: 1, textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: C.text
                    }}>
                      <span>{p.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 'bold', fontFamily: 'monospace' }}>{p.pilar.toUpperCase()}</span>
                    </button>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <input type="checkbox" checked={checked} onChange={() => handlePilarCheck(p.id)} style={{ accentColor: C.accent, cursor: 'pointer' }} />
                      <span style={{ fontSize: 9, fontFamily: 'monospace', color: checked ? C.success : C.textMuted }}>VIVI</span>
                    </label>
                  </div>
                  {active && (
                    <div style={{ padding: '4px 12px 12px', borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textMuted, lineHeight: 1.4 }}>
                      {p.diretriz}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* MURAL DOS 3 EUS */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <Label text="⚙️ MURAL DOS 3 EUS" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 'bold', color: C.accent, marginBottom: 4 }}>▼ EU DO PASSADO</div>
              <textarea value={state.eus?.passado || ''} onChange={e => handleEusChange('passado', e.target.value)} placeholder="Ex: Cedi à distração do celular" rows={1}
                style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', color: C.text, fontSize: 12, resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 'bold', color: C.accent, marginBottom: 4 }}>▼ EU DO PRESENTE</div>
              <textarea value={state.eus?.presente || ''} onChange={e => handleEusChange('presente', e.target.value)} placeholder="Ex: Guardei o aparelho na gaveta" rows={1}
                style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', color: C.text, fontSize: 12, resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 'bold', color: C.accent, marginBottom: 4 }}>▼ EU DO FUTURO</div>
              <textarea value={state.eus?.futuro || ''} onChange={e => handleEusChange('futuro', e.target.value)} placeholder="Ex: Um executor extremamente focado" rows={1}
                style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', color: C.text, fontSize: 12, resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <Btn label={state.eusSaved ? "✓ REFLEXÃO SALVA" : "SALVAR REFLEXÃO"} variant={state.eusSaved ? "secondary" : "primary"} onClick={handleSaveEus} full disabled={state.eusSaved} />
          </div>
        </div>

      </div>

      {/* MODAL CRIAR PROJETO */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 450, padding: 20
        }} onClick={() => setShowCreateModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: C.surface, borderRadius: 12, padding: 24, width: '100%', maxWidth: 440,
            border: `1.5px solid ${C.border}`, boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
            <Label text="➕ NOVO PROJETO" color={C.accent} />
            
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 6 }}>NOME DO PROJETO</div>
            <input value={projName} onChange={e => setProjName(e.target.value)} placeholder="Ex: OAB 2026, Academia..."
              style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 14 }} />

            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 6 }}>DESCRIÇÃO (OPCIONAL)</div>
            <textarea value={projDesc} onChange={e => setProjDesc(e.target.value)} placeholder="Foco ou objetivo macro..." rows={2}
              style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 14, resize: 'none', fontFamily: 'inherit' }} />

            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 8 }}>EMOJI / ÍCONE</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {EMOJIS.map(em => (
                <button key={em} onClick={() => setProjEmoji(em)} style={{
                  padding: 8, background: projEmoji === em ? `${C.accent}15` : 'transparent',
                  border: `1.2px solid ${projEmoji === em ? C.accent : C.border}`, borderRadius: 8, fontSize: 18, cursor: 'pointer'
                }}>{em}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 6 }}>OBJETIVO</div>
                <select value={projObj} onChange={e => setProjObj(e.target.value)} style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 8, color: C.text, fontSize: 12, outline: 'none' }}>
                  <option value="Aprender">📚 Aprender</option>
                  <option value="Hábito">🔄 Hábito</option>
                  <option value="Completar">🎯 Completar</option>
                  <option value="Trabalho">💼 Trabalho</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 6 }}>PRAZO</div>
                <select value={projTarget} onChange={e => setProjTarget(e.target.value)} style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 8, color: C.text, fontSize: 12, outline: 'none' }}>
                  <option value="30">30 Dias</option>
                  <option value="60">60 Dias</option>
                  <option value="90">90 Dias</option>
                  <option value="ongoing">Contínuo</option>
                </select>
              </div>
            </div>

            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 8 }}>COR TEMÁTICA</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {THEME_COLORS.map(col => (
                <button key={col.hex} onClick={() => setProjColor(col.hex)} style={{
                  width: 26, height: 26, borderRadius: '50%', background: col.hex, cursor: 'pointer',
                  border: `2px solid ${projColor === col.hex ? '#FFF' : 'transparent'}`
                }} title={col.name} />
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Btn label="CANCELAR" variant="secondary" onClick={() => setShowCreateModal(false)} full />
              <Btn label="CRIAR" variant="primary" onClick={handleCreateProject} full />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── ABA 1: HOJE (EXECUÇÃO) ───
function ProjectHoje({ state, setState, activeProject, triggerToast, timeLeft, setTimeLeft, timerRunning, setTimerRunning, formatTime }) {
  const [showModal, setShowModal] = useState(false);
  const [mTitulo, setMTitulo] = useState('');
  const [mProva, setMProva] = useState('');
  const [mArea, setMArea] = useState('estudo');
  
  const [helpOpen, setHelpOpen] = useState(false);
  const [travarMicro, setTravarMicro] = useState(false);
  const [microText, setMicroText] = useState('');
  const [customMin, setCustomMin] = useState('25');

  const pColor = activeProject.color || C.accent;
  const missions = (state.missions || []).filter(m => m.project_id === activeProject.id);
  const activeMission = missions.find(m => m.status !== 'done');
  const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
  const completedMissions = missions.filter(m => m.status === 'done' && m.completed_at?.startsWith(todayStr));

  const FUGAS = [
    { id: 'infinito', label: 'Planejamento Infinito', acao: 'A clareza vem da prática. Execute 5 minutos agora.' },
    { id: 'perfeccionismo', label: 'Perfeccionismo', acao: 'O feito é melhor que o perfeito. Conclua uma versão simplificada imediatamente.' },
    { id: 'distracao', label: 'Distração / Rede Social', acao: 'Feche todas as abas extras e foque no próximo passo simples.' }
  ];

  const handleAjudaAction = (type) => {
    setHelpOpen(false);
    if (type === 'respirar') {
      setTimerRunning(false);
      setState(s => ({ ...s, opState: 'respirar_90' }));
    } else if (type === 'micro') {
      setTravarMicro(true);
    } else if (type === 'minimo') {
      setState(s => ({
        ...s,
        modoMinimo: true,
        flags: { ...s.flags, naoZerou: true },
        streak: s.flags.naoZerou ? s.streak : s.streak + 1
      }));
      triggerToast('Modo Mínimo Ativado! +2 pts', 'success');
    }
  };

  const handleFugaAction = (fugaId) => {
    setTimerRunning(false);
    setState(s => {
      const currentFugas = s.fixedEscapes || [];
      if (currentFugas.includes(fugaId)) return s;
      return {
        ...s,
        fixedEscapes: [...currentFugas, fugaId],
        flags: { ...s.flags, fuga: true }
      };
    });
    setState(s => ({ ...s, opState: 'fuga_90', fugaTipo: fugaId }));
  };

  const handleMicroActionSubmit = () => {
    if (!microText.trim()) return;
    setState(s => {
      const current = s.missions || [];
      const updated = current.map(m => m.project_id === activeProject.id && m.status !== 'done' ? { ...m, prova: microText.trim() } : m);
      return { ...s, missions: updated };
    });
    setMicroText('');
    setTravarMicro(false);
    triggerToast('Micro-ação adicionada!', 'success');
  };

  const toggleTimer = () => {
    if (!activeMission) {
      triggerToast('Nenhuma missão definida para focar.', 'error');
      return;
    }
    setTimerRunning(!timerRunning);
  };

  const setPreset = (mins) => {
    setTimeLeft(mins * 60);
    setTimerRunning(false);
    triggerToast(`Timer configurado para ${mins} min.`, 'info');
  };

  const setCustomTime = () => {
    const m = parseInt(customMin);
    if (isNaN(m) || m <= 0) return;
    setTimeLeft(m * 60);
    setTimerRunning(false);
    triggerToast(`Timer configurado para ${m} min.`, 'info');
  };

  const handleCompleteMission = () => {
    if (!activeMission) return;
    setTimerRunning(false);
    setTimeLeft(activeProject.defaultTimer || 1500);
    setState(s => {
      const current = s.missions || [];
      const updated = current.map(m => (m.project_id === activeProject.id && m.status !== 'done') ? { ...m, status: 'done', completed_at: new Date().toISOString() } : m);
      
      // Update statistics of corresponding roadmap item if any
      const matchingRoadmapIndex = activeProject.roadmap ? activeProject.roadmap.findIndex(item => item.title.toLowerCase() === activeMission.titulo.toLowerCase() && item.status !== 'completed') : -1;
      
      let updatedProjects = s.projects || [];
      if (matchingRoadmapIndex !== -1) {
        updatedProjects = updatedProjects.map(proj => {
          if (proj.id === activeProject.id) {
            const updatedRoadmap = proj.roadmap.map((item, idx) => idx === matchingRoadmapIndex ? { ...item, status: 'completed', progress: 100 } : item);
            return { ...proj, roadmap: updatedRoadmap };
          }
          return proj;
        });
      }

      return {
        ...s,
        missions: updated,
        projects: updatedProjects,
        flags: { ...s.flags, acao: true, naoZerou: true },
        streak: s.flags.naoZerou ? s.streak : s.streak + 1
      };
    });
    triggerToast('Missão concluída! +3 pts', 'success');
  };

  const confirmMission = () => {
    if (!mTitulo.trim() || !mProva.trim()) return;
    const areaObj = LIFE_AREAS.find(a => a.key === mArea);
    const newMission = {
      titulo: mTitulo.trim(),
      prova: mProva.trim(),
      area: mArea,
      status: 'pendente',
      project_id: activeProject.id,
      created_at: new Date().toISOString()
    };
    setState(s => {
      const current = s.missions || [];
      return {
        ...s,
        missions: [...current, newMission],
        flags: { ...s.flags, missao: true }
      };
    });
    setShowModal(false); setMTitulo(''); setMProva(''); setMArea('estudo');
    setTimeLeft(activeProject.defaultTimer || 1500);
    triggerToast('Missão criada! +2 pts', 'success');
  };

  return (
    <div className="two-col-grid" style={{ paddingBottom: 100 }}>

      {/* DEFINIR MISSÃO MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex',
          alignItems: 'flex-end', justifyContent: 'center', zIndex: 400
        }} onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: C.surface, borderRadius: '16px 16px 0 0',
            padding: '24px 20px 40px', width: '100%', maxWidth: 480, border: `1px solid ${C.border}`
          }}>
            <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: pColor, marginBottom: 20 }}>DEFINIR MISSÃO NO PROJETO</div>
            
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', letterSpacing: '0.05em', marginBottom: 6 }}>O QUE PRECISO FAZER?</div>
            <input value={mTitulo} onChange={e => setMTitulo(e.target.value)} placeholder="Ex: Revisar Artigo Constitucional"
              style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 14px', color: C.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 14 }} />
            
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', letterSpacing: '0.05em', marginBottom: 6 }}>COMO SABEREI QUE FOI FEITO? (PROVA)</div>
            <input value={mProva} onChange={e => setMProva(e.target.value)} placeholder="Ex: Resolver 15 questões e resumo feito"
              style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 14px', color: C.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 14 }} />

            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', letterSpacing: '0.05em', marginBottom: 8 }}>ÁREA DA VIDA</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
              {LIFE_AREAS.map(a => {
                const selected = mArea === a.key;
                return (
                  <button key={a.key} onClick={() => setMArea(a.key)} style={{
                    padding: '6px 12px', borderRadius: 6, fontSize: 11, fontFamily: 'inherit', cursor: 'pointer',
                    border: `1px solid ${selected ? pColor : C.border}`,
                    background: selected ? `${pColor}15` : 'transparent',
                    color: selected ? pColor : C.text, transition: 'all 0.15s'
                  }}>
                    {a.icon} {a.label}
                  </button>
                );
              })}
            </div>

            <Btn label="CONFIRMAR MISSÃO ✓" full disabled={!mTitulo.trim() || !mProva.trim()} onClick={confirmMission} activeColor={pColor} />
          </div>
        </div>
      )}

      {/* INDICADORES DE PROGRESSO DIÁRIO DO PROJETO */}
      <div className="full-width-col" style={{ padding: '0 16px' }}>
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px',
          display: 'flex', justifyContent: 'space-around', alignItems: 'center'
        }}>
          {[
            { label: 'MISSÃO', active: (state.missions || []).some(m => m.project_id === activeProject.id && m.created_at?.startsWith(todayStr)), char: '🎯' },
            { label: 'AÇÃO', active: (state.missions || []).some(m => m.project_id === activeProject.id && m.status === 'done' && m.completed_at?.startsWith(todayStr)), char: '⚔️' },
            { label: 'FUGA', active: state.fixedEscapes && state.fixedEscapes.length > 0, char: '🔍' },
            { label: 'REFLEXÃO', active: state.eusSaved, char: '📜' }
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                title={item.label}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: item.active ? 'rgba(16,185,129,0.15)' : '#1F2937',
                  border: `1.5px solid ${item.active ? '#10B981' : '#374151'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  transition: 'all 0.3s ease'
                }}
              >
                {item.char}
              </div>
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: item.active ? '#10B981' : C.textMuted, fontWeight: 'bold' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* COLUNA ESQUERDA: TIMER E MISSÃO ATIVA */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        
        {/* TIMER DE EXECUÇÃO */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Label text="⏱️ CRONÔMETRO DE FOCO" color={pColor} />
            
            {/* Quick Switch Dropdown */}
            <select value={activeProject.id} onChange={e => setState(s => ({ ...s, activeProjectId: e.target.value }))} style={{
              background: C.bg, border: `1.2px solid ${C.border}`, color: C.text, fontSize: 11, padding: '4px 8px', borderRadius: 6, outline: 'none'
            }}>
              {(state.projects || []).map(p => (
                <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
              ))}
            </select>
          </div>

          {activeMission ? (
            <div>
              <div style={{ fontSize: 18, fontWeight: 'bold', color: C.text, lineHeight: 1.3, marginBottom: 6 }}>{activeMission.titulo}</div>
              
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {(() => {
                  const a = LIFE_AREAS.find(x => x.key === activeMission.area || (activeMission.area === 'empresa' && x.key === 'carreira'));
                  if (!a) return null;
                  return (
                    <span style={{
                      fontSize: 9, fontFamily: 'monospace', color: pColor, fontWeight: 'bold',
                      background: `${pColor}15`, border: `1.2px solid ${pColor}33`, borderRadius: 6,
                      padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4
                    }}>
                      {a.icon} {a.label.toUpperCase()}
                    </span>
                  );
                })()}
              </div>

              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>
                Prova: <i>{activeMission.prova}</i>
              </div>

              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 56, fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: timerRunning ? pColor : C.text, letterSpacing: '0.04em', margin: '10px 0' }}>
                  {formatTime(timeLeft)}
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <Btn label={timerRunning ? "PAUSAR ⏱️" : "INICIAR ⚡"} variant={timerRunning ? "secondary" : "primary"} onClick={toggleTimer} activeColor={pColor} />
                  <Btn label="CONCLUÍDO" variant="success" onClick={handleCompleteMission} activeColor={pColor} />
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                <button onClick={() => setHelpOpen(!helpOpen)} style={{
                  width: '100%', background: 'transparent', border: 'none', color: pColor,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <span>Dificuldades de Foco?</span>
                  <span>{helpOpen ? '▲ ANULAR BLOQUEIO' : '▼ AJUDA'}</span>
                </button>

                {helpOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <button onClick={() => handleAjudaAction('respirar')} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, color: C.text, cursor: 'pointer', textAlign: 'center' }}>
                        <div style={{ fontSize: 14, marginBottom: 4 }}>🫁</div>
                        <div style={{ fontSize: 11, fontWeight: 'bold', color: pColor }}>RESPIRAR 90s</div>
                        <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>Mente em foco</div>
                      </button>
                      <button onClick={() => handleAjudaAction('micro')} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, color: C.text, cursor: 'pointer', textAlign: 'center' }}>
                        <div style={{ fontSize: 14, marginBottom: 4 }}>⚡</div>
                        <div style={{ fontSize: 11, fontWeight: 'bold', color: pColor }}>MICRO-AÇÃO</div>
                        <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>Divida a tarefa</div>
                      </button>
                    </div>
                    <button onClick={() => handleAjudaAction('minimo')} style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 14px', color: C.text, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 11, fontWeight: 'bold', color: pColor }}>📉 MODO MÍNIMO</div>
                        <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>Garanta o essencial nos dias de cansaço extremo</div>
                      </div>
                      <span style={{ fontSize: 10, color: pColor, fontFamily: 'monospace' }}>ATIVAR →</span>
                    </button>
                  </div>
                )}

                {travarMicro && (
                  <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginTop: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 'bold', color: pColor, marginBottom: 4 }}>PASSO DE 5 MINUTOS</div>
                    <input value={microText} onChange={e => setMicroText(e.target.value)} placeholder="Ex: Abrir a pasta com os materiais agora"
                      style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 10px', color: C.text, fontSize: 12, outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={handleMicroActionSubmit} style={{ padding: '6px 12px', background: pColor, color: C.bg, border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 11, cursor: 'pointer' }}>Injetar Prova</button>
                      <button onClick={() => setTravarMicro(false)} style={{ padding: '6px 12px', background: 'transparent', border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 16 }}>Nenhuma missão ativa neste projeto.</p>
              <Btn label="➕ DEFINIR MISSÃO" onClick={() => setShowModal(true)} activeColor={pColor} />
              
              {/* Presets & Custom time configuration */}
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 16 }}>
                <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', letterSpacing: '0.05em', marginBottom: 10 }}>AJUSTAR TEMPO DO TIMER</div>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
                  {[15, 25, 45, 60].map(mins => (
                    <button key={mins} onClick={() => setPreset(mins)} style={{
                      padding: '6px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.bg, color: C.text,
                      fontSize: 11, cursor: 'pointer', fontFamily: 'monospace'
                    }}>{mins} Min</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
                  <input type="number" value={customMin} onChange={e => setCustomMin(e.target.value)}
                    style={{ width: 60, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 6px', color: C.text, textAlign: 'center', fontSize: 12 }} />
                  <span style={{ fontSize: 11, color: C.textMuted }}>Minutos</span>
                  <button onClick={setCustomTime} style={{
                    padding: '4px 10px', background: pColor, color: C.bg, border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 'bold', cursor: 'pointer'
                  }}>Aplicar</button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* COLUNA DIREITA: DETECTOR DE DESVIOS E HISTÓRICO LOCAL */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        
        {/* DETECTOR DE DESVIOS */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <Label text="🔍 ANTÍDOTO COMPORTAMENTAL" color={pColor} />
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 12 }}>Se notar desvio, clique no antídoto abaixo:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {FUGAS.map(f => {
              const corrigido = state.fixedEscapes?.includes(f.id);
              return (
                <button key={f.id} onClick={() => !corrigido && handleFugaAction(f.id)} disabled={corrigido}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8, background: corrigido ? `${C.success}08` : 'transparent',
                    border: `1px solid ${corrigido ? C.success + '4D' : C.border}`, color: corrigido ? C.success : C.textMuted,
                    fontFamily: 'monospace', fontSize: 10, cursor: corrigido ? 'default' : 'pointer', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s'
                  }}>
                  <span>{f.label}</span>
                  <span style={{ color: corrigido ? C.success : pColor }}>{corrigido ? 'CORRIGIDO (+2)' : 'APLICAR'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* HISTÓRICO DIÁRIO DO PROJETO */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <Label text="HISTÓRICO DE HOJE DO PROJETO" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
            {completedMissions.map((m, idx) => {
              const a = LIFE_AREAS.find(x => x.key === m.area || (m.area === 'empresa' && x.key === 'carreira'));
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: `${C.success}0a`, border: `1px solid ${C.success}22`, borderRadius: 8, opacity: 0.7 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 'bold', color: C.text, textDecoration: 'line-through' }}>{m.titulo}</span>
                      {a && (
                        <span style={{
                          fontSize: 8, fontFamily: 'monospace', color: C.success,
                          background: `${C.success}15`, borderRadius: 4, padding: '1px 4px'
                        }}>
                          {a.icon} {a.label}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>Concluída | Prova: {m.prova}</div>
                  </div>
                  <div style={{ color: C.success, fontSize: 11, fontWeight: 'bold' }}>✓ +3 pts</div>
                </div>
              );
            })}
            
            {activeMission && (() => {
              const a = LIFE_AREAS.find(x => x.key === activeMission.area || (activeMission.area === 'empresa' && x.key === 'carreira'));
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: `${pColor}0a`, border: `1px solid ${pColor}33`, borderRadius: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 'bold', color: C.text }}>{activeMission.titulo}</span>
                      {a && (
                        <span style={{
                          fontSize: 8, fontFamily: 'monospace', color: pColor,
                          background: `${pColor}15`, borderRadius: 4, padding: '1px 4px'
                        }}>
                          {a.icon} {a.label}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>Em andamento...</div>
                  </div>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: pColor, animation: 'blinking 1.5s infinite' }} />
                </div>
              );
            })()}

            {missions.length === 0 && (
              <div style={{ textTransform: 'uppercase', textAlign: 'center', fontSize: 10, fontFamily: 'monospace', color: C.textMuted, padding: '12px 0' }}>
                Nenhuma meta cadastrada hoje.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

// ─── ABA 2: ROADMAP ───
function ProjectRoadmap({ state, setState, activeProject, triggerToast }) {
  const [showEditor, setShowEditor] = useState(false);
  const [editItem, setEditItem] = useState(null);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState('todo');
  const [progress, setProgress] = useState(0);
  const [estDays, setEstDays] = useState(2);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const pColor = activeProject.color || C.accent;
  const roadmapItems = activeProject.roadmap || [];

  const handleOpenNew = () => {
    setEditItem(null);
    setTitle('');
    setDesc('');
    setStatus('todo');
    setProgress(0);
    setEstDays(2);
    setTags([]);
    setShowEditor(true);
  };

  const handleOpenEdit = (item) => {
    setEditItem(item);
    setTitle(item.title);
    setDesc(item.description || '');
    setStatus(item.status);
    setProgress(item.progress || 0);
    setEstDays(item.estimated_days || 2);
    setTags(item.tags || []);
    setShowEditor(true);
  };

  const handleAddTag = () => {
    if (!tagInput.trim() || tags.includes(tagInput.trim())) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput('');
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    setState(s => {
      const projects = s.projects.map(p => {
        if (p.id === activeProject.id) {
          const currentRoadmap = p.roadmap || [];
          let updatedRoadmap;
          if (editItem) {
            // Edit mode
            updatedRoadmap = currentRoadmap.map(item => item.id === editItem.id ? {
              ...item, title: title.trim(), description: desc.trim(), status,
              progress: status === 'completed' ? 100 : progress, estimated_days: parseInt(estDays) || 2, tags
            } : item);
          } else {
            // New mode
            const newItem = {
              id: 'road-' + Date.now(),
              title: title.trim(),
              description: desc.trim(),
              status,
              progress: status === 'completed' ? 100 : progress,
              estimated_days: parseInt(estDays) || 2,
              tags
            };
            updatedRoadmap = [...currentRoadmap, newItem];
          }
          return { ...p, roadmap: updatedRoadmap };
        }
        return p;
      });
      return { ...s, projects };
    });
    setShowEditor(false);
    triggerToast('Item do Roadmap salvo!', 'success');
  };

  const handleDelete = () => {
    if (!editItem) return;
    setState(s => {
      const projects = s.projects.map(p => {
        if (p.id === activeProject.id) {
          const updatedRoadmap = (p.roadmap || []).filter(item => item.id !== editItem.id);
          return { ...p, roadmap: updatedRoadmap };
        }
        return p;
      });
      return { ...s, projects };
    });
    setShowEditor(false);
    triggerToast('Item do Roadmap deletado.', 'warning');
  };

  const moveStatus = (item, newStatus) => {
    setState(s => {
      const projects = s.projects.map(p => {
        if (p.id === activeProject.id) {
          const updatedRoadmap = (p.roadmap || []).map(r => r.id === item.id ? {
            ...r, status: newStatus, progress: newStatus === 'completed' ? 100 : r.progress
          } : r);
          return { ...p, roadmap: updatedRoadmap };
        }
        return p;
      });
      return { ...s, projects };
    });
    triggerToast('Item atualizado!', 'success');
  };

  const todoItems = roadmapItems.filter(r => r.status === 'todo');
  const inProgressItems = roadmapItems.filter(r => r.status === 'in_progress');
  const completedItems = roadmapItems.filter(r => r.status === 'completed');

  return (
    <div style={{ padding: '0 16px 100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Label text="📍 ROADMAP DO PROJETO" color={pColor} />
        <Btn label="➕ ADICIONAR ITEM" variant="primary" small onClick={handleOpenNew} activeColor={pColor} />
      </div>

      {/* KANBAN LAYOUT */}
      <div className="roadmap-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        
        {/* TO DO COLUMN */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, minHeight: 260 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 'bold', color: C.critical, fontFamily: 'monospace' }}>🔴 TO DO ({todoItems.length})</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todoItems.map(item => (
              <div key={item.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div onClick={() => handleOpenEdit(item)} style={{ fontSize: 13, fontWeight: 'bold', color: C.text, cursor: 'pointer' }}>{item.title}</div>
                  <button onClick={() => moveStatus(item, 'in_progress')} style={{ background: 'none', border: 'none', color: pColor, fontSize: 10, cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold' }}>FOCAR →</button>
                </div>
                {item.description && <p style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{item.description}</p>}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                  {item.tags?.map(t => <span key={t} style={{ fontSize: 9, background: '#222', color: C.textMuted, padding: '1px 5px', borderRadius: 4 }}>#{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IN PROGRESS COLUMN */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, minHeight: 260 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 'bold', color: C.warning, fontFamily: 'monospace' }}>🟡 EM PROGRESSO ({inProgressItems.length})</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {inProgressItems.map(item => (
              <div key={item.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div onClick={() => handleOpenEdit(item)} style={{ fontSize: 13, fontWeight: 'bold', color: C.text, cursor: 'pointer' }}>{item.title}</div>
                  <button onClick={() => moveStatus(item, 'completed')} style={{ background: 'none', border: 'none', color: C.success, fontSize: 10, cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold' }}>PRONTO ✓</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.textMuted, marginTop: 6, marginBottom: 2 }}>
                  <span>Progresso: {item.progress}%</span>
                  <span>Est: {item.estimated_days}d</span>
                </div>
                <div style={{ width: '100%', height: 4, background: '#222', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ width: `${item.progress}%`, background: pColor, height: '100%' }} />
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {item.tags?.map(t => <span key={t} style={{ fontSize: 9, background: '#222', color: C.textMuted, padding: '1px 5px', borderRadius: 4 }}>#{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPLETED COLUMN */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, minHeight: 260 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 'bold', color: C.success, fontFamily: 'monospace' }}>🟢 CONCLUÍDO ({completedItems.length})</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {completedItems.map(item => (
              <div key={item.id} style={{ background: `${C.success}05`, border: `1px solid ${C.success}33`, borderRadius: 8, padding: 12, opacity: 0.8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div onClick={() => handleOpenEdit(item)} style={{ fontSize: 13, fontWeight: 'bold', color: C.text, textDecoration: 'line-through', cursor: 'pointer' }}>{item.title}</div>
                  <button onClick={() => moveStatus(item, 'todo')} style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: 10, cursor: 'pointer', fontFamily: 'monospace' }}>REFAZER</button>
                </div>
                {item.description && <p style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{item.description}</p>}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                  {item.tags?.map(t => <span key={t} style={{ fontSize: 9, background: '#222', color: C.textMuted, padding: '1px 5px', borderRadius: 4 }}>#{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ROADMAP ITEM EDITOR MODAL */}
      {showEditor && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 400, padding: 20
        }} onClick={() => setShowEditor(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: C.surface, borderRadius: 12, padding: 24, width: '100%', maxWidth: 440,
            border: `1.5px solid ${C.border}`, boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
            <Label text={editItem ? "✏️ EDITAR TAREFA" : "➕ NOVA TAREFA"} color={pColor} />
            
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 6 }}>TÍTULO DA TAREFA</div>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Estudar capítulo de contratos..."
              style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 14 }} />

            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 6 }}>DESCRIÇÃO (OPCIONAL)</div>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Detalhes, links ou lembretes..." rows={2}
              style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 14, resize: 'none', fontFamily: 'inherit' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 6 }}>STATUS</div>
                <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 8, color: C.text, fontSize: 12, outline: 'none' }}>
                  <option value="todo">🔴 To Do</option>
                  <option value="in_progress">🟡 Em progresso</option>
                  <option value="completed">🟢 Concluído</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 6 }}>DIAS ESTIMADOS</div>
                <input type="number" value={estDays} onChange={e => setEstDays(e.target.value)}
                  style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 8, color: C.text, fontSize: 12, outline: 'none' }} />
              </div>
            </div>

            {status === 'in_progress' && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.textMuted, marginBottom: 4 }}>
                  <span>Progresso: {progress}%</span>
                </div>
                <input type="range" min="0" max="100" value={progress} onChange={e => setProgress(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: pColor, cursor: 'pointer' }} />
              </div>
            )}

            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 6 }}>TAGS</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Ex: penal"
                style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 10px', color: C.text, fontSize: 12, outline: 'none' }} />
              <button onClick={handleAddTag} style={{
                padding: '6px 12px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, color: pColor, fontSize: 11, fontWeight: 'bold', cursor: 'pointer'
              }}>+</button>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
              {tags.map(t => (
                <span key={t} onClick={() => handleRemoveTag(t)} style={{
                  fontSize: 10, background: C.bg, border: `1px solid ${C.border}`, color: C.text, padding: '3px 8px', borderRadius: 6, cursor: 'pointer'
                }}>#{t} ×</span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {editItem && <Btn label="DELETAR" variant="critical" onClick={handleDelete} />}
              <Btn label="CANCELAR" variant="secondary" onClick={() => setShowEditor(false)} full={!editItem} />
              <Btn label="SALVAR" variant="primary" onClick={handleSave} full activeColor={pColor} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── ABA 3: EVOLUÇÃO (METRICAS E HEATMAP) ───
function ProjectEvolucao({ state, activeProject, triggerToast }) {
  const pColor = activeProject.color || C.accent;
  
  // Filter history
  const projectMissions = (state.missions || []).filter(m => m.project_id === activeProject.id);
  const completedMissions = projectMissions.filter(m => m.status === 'done');

  // Heatmap rendering logic
  const getPast30Days = () => {
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const offset = d.getTimezoneOffset();
      const localDate = new Date(d.getTime() - offset * 60 * 1000);
      dates.push(localDate.toISOString().split('T')[0]);
    }
    return dates;
  };

  const dates = getPast30Days();

  const getDayClass = (dateStr) => {
    const dayMissions = completedMissions.filter(m => m.completed_at?.startsWith(dateStr));
    const count = dayMissions.length;
    if (count === 0) return { bg: '#161B22', label: 'Inativo' };
    if (count === 1) return { bg: `${pColor}44`, label: '1 missão' };
    if (count === 2) return { bg: `${pColor}88`, label: '2 missões' };
    return { bg: pColor, label: '3+ missões' };
  };

  const totalTimeMinutes = completedMissions.reduce((acc, m) => acc + (m.timer_used_minutes || 25), 0);
  const totalHours = Math.floor(totalTimeMinutes / 60);
  const remainingMinutes = totalTimeMinutes % 60;

  const totalRoadmap = activeProject.roadmap ? activeProject.roadmap.length : 0;
  const compRoadmap = activeProject.roadmap ? activeProject.roadmap.filter(r => r.status === 'completed').length : 0;
  const roadmapPct = totalRoadmap > 0 ? Math.round((compRoadmap / totalRoadmap) * 100) : 0;

  return (
    <div className="two-col-grid" style={{ padding: '0 16px 100px' }}>
      
      {/* SEÇÃO 1: RESUMO DO PROJETO */}
      <div className="full-width-col">
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <Label text="📈 METRICAS DE CONSISTÊNCIA" color={pColor} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 14 }}>
            <div style={{ background: C.bg, border: `1.2px solid ${C.border}`, borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontFamily: 'monospace', color: C.textMuted }}>MÉTAS CONCLUÍDAS</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: C.text, marginTop: 4 }}>{completedMissions.length}</div>
            </div>
            <div style={{ background: C.bg, border: `1.2px solid ${C.border}`, borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontFamily: 'monospace', color: C.textMuted }}>TEMPO TOTAL ACUMULADO</div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: pColor, marginTop: 7 }}>{totalHours}h {remainingMinutes}m</div>
            </div>
            <div style={{ background: C.bg, border: `1.2px solid ${C.border}`, borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontFamily: 'monospace', color: C.textMuted }}>PROGRESSO ROADMAP</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: C.success, marginTop: 4 }}>{roadmapPct}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: HEATMAP DOS DIAS */}
      <div style={{ padding: '0 16px' }} className="full-width-col">
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <Label text="🔥 ATIVIDADE NOS ÚLTIMOS 30 DIAS" color={pColor} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6, margin: '14px 0' }}>
            {dates.map(dateStr => {
              const dayObj = getDayClass(dateStr);
              return (
                <div key={dateStr} style={{
                  width: '100%', aspectRatio: '1', background: dayObj.bg, borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} title={`${dateStr}: ${dayObj.label}`} />
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, fontFamily: 'monospace', color: C.textMuted }}>
            <span>Menos ativo</span>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ width: 8, height: 8, background: '#161B22', borderRadius: 1 }} />
              <span style={{ width: 8, height: 8, background: `${pColor}44`, borderRadius: 1 }} />
              <span style={{ width: 8, height: 8, background: `${pColor}88`, borderRadius: 1 }} />
              <span style={{ width: 8, height: 8, background: pColor, borderRadius: 1 }} />
            </div>
            <span>Mais ativo</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: TIMELINE DE PROGRESSO */}
      <div style={{ padding: '0 16px' }} className="full-width-col">
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <Label text="📊 PROJEÇÃO DE CONCLUSÃO" />
          <div style={{ margin: '14px 0 6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.textMuted, marginBottom: 4 }}>
              <span>Conclusão Geral do Projeto</span>
              <span>{roadmapPct}%</span>
            </div>
            <div style={{ width: '100%', height: 8, background: '#222', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${roadmapPct}%`, background: pColor, height: '100%', borderRadius: 4 }} />
            </div>
          </div>
          <p style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.4, marginTop: 8 }}>
            Projeção: Conclua os itens restantes na aba de **Roadmap** para aumentar a porcentagem geral.
          </p>
        </div>
      </div>

    </div>
  );
}

// ─── ABA 4: ANOTAÇÕES ───
function ProjectAnotacoes({ state, setState, activeProject, triggerToast }) {
  const [noteText, setNoteText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const pColor = activeProject.color || C.accent;
  const notes = activeProject.notes || [];

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    
    const parsedTags = tagInput.split(',').map(t => t.trim().replace('#', '')).filter(t => t.length > 0);
    
    const newNote = {
      id: 'note-' + Date.now(),
      content: noteText.trim(),
      tags: parsedTags.length > 0 ? parsedTags : ['Anotação'],
      created_at: new Date().toISOString()
    };

    setState(s => {
      const projects = s.projects.map(p => {
        if (p.id === activeProject.id) {
          return { ...p, notes: [newNote, ...(p.notes || [])] };
        }
        return p;
      });
      return { ...s, projects };
    });

    setNoteText('');
    setTagInput('');
    triggerToast('Anotação criada!', 'success');
  };

  const handleDeleteNote = (noteId) => {
    setState(s => {
      const projects = s.projects.map(p => {
        if (p.id === activeProject.id) {
          return { ...p, notes: (p.notes || []).filter(n => n.id !== noteId) };
        }
        return p;
      });
      return { ...s, projects };
    });
    triggerToast('Anotação excluída.', 'warning');
  };

  const filteredNotes = notes.filter(n => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    return n.content.toLowerCase().includes(query) || n.tags.some(t => t.toLowerCase().includes(query));
  });

  return (
    <div className="two-col-grid" style={{ padding: '0 16px 100px' }}>
      
      {/* CRIADOR DE ANOTAÇÃO */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
        <Label text="📝 NOVA ANOTAÇÃO" color={pColor} />
        
        <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Escreva notas livres, insights ou tarefas..." rows={3}
          style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 12, resize: 'none', fontFamily: 'inherit' }} />
        
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
          <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Tags separadas por vírgula (ex: Dúvida, STF)"
            style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', color: C.text, fontSize: 12, outline: 'none' }} />
          <Btn label="CADASTRAR" variant="primary" small onClick={handleAddNote} activeColor={pColor} />
        </div>
      </div>

      {/* FILTRO E LISTA DE ANOTAÇÕES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="🔍 Buscar por tag ou termo..."
            style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 14px', color: C.text, fontSize: 13, outline: 'none' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
          {filteredNotes.map(n => (
            <div key={n.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {n.tags?.map(t => <span key={t} style={{ fontSize: 9, background: '#222', color: pColor, padding: '2px 6px', borderRadius: 4, fontWeight: 'bold' }}>#{t}</span>)}
                </div>
                <button onClick={() => handleDeleteNote(n.id)} style={{ background: 'none', border: 'none', color: C.critical, fontSize: 13, cursor: 'pointer' }}>×</button>
              </div>
              <p style={{ fontSize: 12, color: C.text, whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{n.content}</p>
              <div style={{ fontSize: 9, color: C.textMuted, marginTop: 8, textAlign: 'right', fontFamily: 'monospace' }}>
                {new Date(n.created_at).toLocaleDateString('pt-BR')} {new Date(n.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}

          {filteredNotes.length === 0 && (
            <div style={{ textTransform: 'uppercase', textAlign: 'center', fontSize: 10, fontFamily: 'monospace', color: C.textMuted, padding: '24px 0' }}>
              Nenhuma anotação encontrada.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// ─── ABA 5: CONFIGURAÇÕES DO PROJETO ───
function ProjectConfig({ state, setState, activeProject, triggerToast }) {
  const [name, setName] = useState(activeProject.name);
  const [desc, setDesc] = useState(activeProject.description || '');
  const [emoji, setEmoji] = useState(activeProject.emoji || '🎯');
  const [color, setColor] = useState(activeProject.color || '#00D4FF');
  const [defTimer, setDefTimer] = useState(activeProject.defaultTimer ? Math.round(activeProject.defaultTimer / 60) : 25);

  const pColor = activeProject.color || C.accent;
  const EMOJIS = ['📚', '📱', '🏋️', '💼', '🎯', '🎨', '🚀', '❤️', '💡', '🔥'];

  const handleUpdate = () => {
    if (!name.trim()) return;
    setState(s => {
      const updated = s.projects.map(p => {
        if (p.id === activeProject.id) {
          return {
            ...p,
            name: name.trim(),
            description: desc.trim(),
            emoji,
            color,
            defaultTimer: (parseInt(defTimer) || 25) * 60
          };
        }
        return p;
      });
      return { ...s, projects: updated };
    });
    triggerToast('Configurações salvas!', 'success');
  };

  const handleReset = () => {
    if (!window.confirm("Deseja realmente apagar o histórico e roadmap deste projeto?")) return;
    setState(s => {
      const updated = s.projects.map(p => {
        if (p.id === activeProject.id) {
          return { ...p, roadmap: [], notes: [] };
        }
        return p;
      });
      const updatedMissions = (s.missions || []).filter(m => m.project_id !== activeProject.id);
      return { ...s, projects: updated, missions: updatedMissions };
    });
    triggerToast('Projeto resetado com sucesso.', 'warning');
  };

  const handleDelete = () => {
    if (!window.confirm("ATENÇÃO: Deseja realmente excluir este projeto e todos os seus dados permanentemente?")) return;
    setState(s => {
      const updated = s.projects.filter(p => p.id !== activeProject.id);
      const updatedMissions = (s.missions || []).filter(m => m.project_id !== activeProject.id);
      return { ...s, projects: updated, missions: updatedMissions, activeProjectId: null };
    });
    triggerToast('Projeto deletado.', 'warning');
  };

  return (
    <div className="two-col-grid" style={{ padding: '0 16px 100px' }}>
      
      {/* INFORMAÇÕES DO PROJETO */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
        <Label text="⚙️ DEFINIÇÕES DO PROJETO" color={pColor} />

        <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 6, marginTop: 12 }}>NOME DO PROJETO</div>
        <input value={name} onChange={e => setName(e.target.value)}
          style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 14 }} />

        <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 6 }}>DESCRIÇÃO</div>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2}
          style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 14, resize: 'none', fontFamily: 'inherit' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 6 }}>TEMPO TIMER PADRÃO (MINUTOS)</div>
            <input type="number" value={defTimer} onChange={e => setDefTimer(e.target.value)}
              style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 8, color: C.text, fontSize: 12, outline: 'none' }} />
          </div>
        </div>

        <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 8 }}>EMOJI</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {EMOJIS.map(em => (
            <button key={em} onClick={() => setEmoji(em)} style={{
              padding: 8, background: emoji === em ? `${pColor}15` : 'transparent',
              border: `1.2px solid ${emoji === em ? pColor : C.border}`, borderRadius: 8, fontSize: 18, cursor: 'pointer'
            }}>{em}</button>
          ))}
        </div>

        <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace', marginBottom: 8 }}>COR TEMÁTICA</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {THEME_COLORS.map(col => (
            <button key={col.hex} onClick={() => setColor(col.hex)} style={{
              width: 26, height: 26, borderRadius: '50%', background: col.hex, cursor: 'pointer',
              border: `2px solid ${color === col.hex ? '#FFF' : 'transparent'}`
            }} title={col.name} />
          ))}
        </div>

        <Btn label="SALVAR CONFIGURAÇÕES ✓" variant="primary" onClick={handleUpdate} full activeColor={pColor} />
      </div>

      {/* AÇÕES DE EXCLUSÃO */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
        <Label text="⚠️ CONTROLE DE DADOS" color={C.critical} />
        <p style={{ fontSize: 11, color: C.textMuted, marginBottom: 16, lineHeight: 1.4 }}>Ações irreversíveis do projeto.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Btn label="RESTAURAR E RESETAR DADOS DO PROJETO" variant="critical" onClick={handleReset} full />
          <Btn label="EXCLUIR PROJETO DEFINITIVAMENTE" variant="critical" onClick={handleDelete} full />
        </div>
      </div>

    </div>
  );
}

// ─── ABA CRONOGRAMA ───
function TabCronograma({state, setState, toast}) {
  const checked = state.cronograma?.checked || {};
  const totalAtividades = CRONOGRAMA_PILARES.reduce((s,p)=>s+p.atividades.length,0);
  const totalDone = CRONOGRAMA_PILARES.reduce((s,p)=>s+p.atividades.filter(a=>checked[a.id]).length,0);
  const allComplete = totalDone===totalAtividades;

  const [showCelebration, setShowCelebration] = useState(false);
  const [prevAllComplete, setPrevAllComplete] = useState(false);

  useEffect(() => {
    if (allComplete && !prevAllComplete) {
      setShowCelebration(true);
      toast('🏆 CRONOGRAMA COMPLETO! Dia de vitória total.');
      setTimeout(() => setShowCelebration(false), 3000);
    }
    setPrevAllComplete(allComplete);
  }, [allComplete]);

  const toggleAtividade = (atividade, pilar) => {
    const wasChecked = checked[atividade.id];
    const newChecked = { ...checked };
    if (wasChecked) { delete newChecked[atividade.id]; }
    else { newChecked[atividade.id] = true; }

    setState(s => ({ ...s, cronograma: { ...s.cronograma, checked: newChecked } }));

    if (!wasChecked) {
      const pilarDone = pilar.atividades.filter(a => newChecked[a.id]).length;
      const pilarTotal = pilar.atividades.length;
      if (pilarDone === pilarTotal) {
        toast(`${pilar.icon} ${pilar.label} completa! +força espiritual.`);
      } else {
        const msgs = {
          mente: 'Mente fortalecida. Continue evoluindo.',
          alma: 'Alma reforçada. Mantenha a conexão.',
          trabalho: 'Trabalho avançando. Execute com excelência.',
          saude: 'Saúde protegida. Corpo em movimento.',
        };
        toast(`✓ ${atividade.label} concluída. ${msgs[pilar.id]}`);
      }
    }
  };

  return (
    <div style={{ padding: '14px 16px 100px' }}>
      <style>{`
        @keyframes cronogramaGlow {
          0% { box-shadow: 0 0 8px rgba(201,169,106,0.2) }
          50% { box-shadow: 0 0 24px rgba(201,169,106,0.5) }
          100% { box-shadow: 0 0 8px rgba(201,169,106,0.2) }
        }
        @keyframes cronogramaGoldBorder {
          0% { border-color: #1F2937 }
          50% { border-color: #C9A96A }
          100% { border-color: #1F2937 }
        }
        @keyframes checkPop {
          0% { transform: scale(0.8) }
          50% { transform: scale(1.2) }
          100% { transform: scale(1) }
        }
      `}</style>

      {showCelebration && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(11,11,15,0.9)', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: 32
        }}>
          <div style={{ fontSize: 72, marginBottom: 16, animation: 'checkPop 0.5s ease' }}>🏆</div>
          <div style={{ fontSize: 24, fontFamily: 'Georgia,serif', color: C.gold, textAlign: 'center', marginBottom: 8 }}>DIA DE VITÓRIA TOTAL</div>
          <div style={{ fontSize: 13, color: C.textMuted, fontFamily: 'monospace', textAlign: 'center' }}>16/16 atividades concluídas. Você é imparável.</div>
        </div>
      )}

      <SpotlightCard style={{
        background: 'linear-gradient(135deg,#101828,#0D1F35)',
        border: `1.5px solid ${allComplete ? C.gold : C.border}`,
        borderRadius: 16, padding: '14px 16px', marginBottom: 16,
        animation: allComplete ? 'cronogramaGoldBorder 2s ease infinite' : 'none'
      }}>
        <Label text="📋 CRONOGRAMA DO GUERREIRO" color={C.gold} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 28, fontFamily: 'Georgia,serif', color: C.text }}>{totalDone}/{totalAtividades}</div>
          <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace' }}>atividades concluídas</div>
        </div>
        <div style={{ width: '100%', height: 6, background: '#222', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            width: `${(totalDone / totalAtividades) * 100}%`,
            height: '100%',
            background: allComplete ? C.gold : C.success,
            borderRadius: 3,
            transition: 'width 0.4s ease'
          }} />
        </div>
        {allComplete && <div style={{ fontSize: 11, color: C.gold, fontFamily: 'monospace', marginTop: 8, letterSpacing: '0.08em' }}>🏆 CRONOGRAMA COMPLETO — DIA DE VITÓRIA</div>}
      </SpotlightCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {CRONOGRAMA_PILARES.map(pilar => {
          const pilarDone = pilar.atividades.filter(a => checked[a.id]).length;
          const pilarComplete = pilarDone === pilar.atividades.length;
          const pct = pilar.atividades.length > 0 ? (pilarDone / pilar.atividades.length) * 100 : 0;

          return (
            <SpotlightCard key={pilar.id} style={{
              background: pilarComplete ? `linear-gradient(135deg,${pilar.cor}15,${pilar.cor}08)` : C.surface,
              border: `1.5px solid ${pilarComplete ? pilar.cor + '80' : C.border}`,
              borderRadius: 16, padding: '14px 14px',
              transition: 'all 0.3s ease',
              animation: pilarComplete ? 'cronogramaGlow 2s ease infinite' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 18 }}>{pilar.icon}</span>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em', color: pilarComplete ? pilar.cor : C.text }}>{pilar.label}</span>
                </div>
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: pilarComplete ? pilar.cor : C.textMuted, fontWeight: 700 }}>{pilarDone}/{pilar.atividades.length}</span>
              </div>
              <div style={{ fontSize: 9, color: C.textMuted, fontFamily: 'monospace', marginBottom: 10, opacity: 0.7 }}>{pilar.descricao}</div>

              <div style={{ width: '100%', height: 3, background: '#222', borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: pilar.cor,
                  borderRadius: 2,
                  transition: 'width 0.3s ease'
                }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pilar.atividades.map(atv => {
                  const isChecked = checked[atv.id];
                  return (
                    <div key={atv.id} onClick={() => toggleAtividade(atv, pilar)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer',
                        padding: '6px 8px', borderRadius: 8,
                        background: isChecked ? `${pilar.cor}10` : 'transparent',
                        transition: 'background 0.2s ease'
                      }}>
                      <div style={{
                        width: 18, height: 18, minWidth: 18, borderRadius: '50%',
                        border: `2px solid ${isChecked ? pilar.cor : C.textMuted + '60'}`,
                        background: isChecked ? pilar.cor : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        animation: isChecked ? 'checkPop 0.3s ease' : 'none',
                        marginTop: 1
                      }}>
                        {isChecked && (
                          <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4.5 7.5L8 3" stroke="#0B0B0F" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 11, fontFamily: 'monospace', fontWeight: 600,
                          color: isChecked ? pilar.cor : C.text,
                          textDecoration: isChecked ? 'line-through' : 'none',
                          opacity: isChecked ? 0.7 : 1,
                          transition: 'all 0.2s ease'
                        }}>{atv.label}</div>
                        <div style={{ fontSize: 9, color: C.textMuted, fontFamily: 'monospace', marginTop: 2, opacity: isChecked ? 0.4 : 0.7 }}>{atv.micro}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SpotlightCard>
          );
        })}
      </div>

      <SpotlightCard style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 16, padding: '14px 16px', marginTop: 16
      }}>
        <Label text="📊 RESUMO DOS PILARES" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CRONOGRAMA_PILARES.map(p => {
            const done = p.atividades.filter(a => checked[a.id]).length;
            const complete = done === p.atividades.length;
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>{p.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: complete ? p.cor : C.text, letterSpacing: '0.08em' }}>{p.label}</span>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: complete ? p.cor : C.textMuted }}>{done}/{p.atividades.length}</span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: '#222', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${p.atividades.length > 0 ? (done / p.atividades.length) * 100 : 0}%`,
                      height: '100%', background: p.cor, borderRadius: 2, transition: 'width 0.3s ease' }} />
                  </div>
                </div>
                {complete && <span style={{ fontSize: 12, color: C.success }}>✓</span>}
              </div>
            );
          })}
        </div>
      </SpotlightCard>
    </div>
  );
}

// ─── MAIN APP COMPONENT ───
export default function App() {
  const [mainTab, setMainTab] = useState('dashboard');
  const [projectTab, setProjectTab] = useState('hoje');
  const [toastMsg, setToastMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [history, setHistory] = useState([]);
  
  const [state, setState] = useState({
    cronograma: { checked: {} },
    projects: [],
    activeProjectId: null,
    missions: [],
    mission: null,
    action: null,
    opState: null,
    fugaTipo: null,
    microAction: '',
    modoMinimo: false,
    streak: 0,
    flags: { missao: false, acao: false, fuga: false, eus: false, naoZerou: false },
    fixedEscapes: [],
    eus: { passado: '', presente: '', futuro: '' },
    eusSaved: false,
    conversion: { consumidos: 0, aplicados: 0 },
    panel: { fe: 3, familia: 3, saude: 3, estudo: 3, carreira: 3 },
    customPrinciples: [
      { id: 1, titulo: 'Família acima de tudo', acao: 'Conversar intencionalmente por 10 minutos' },
      { id: 2, titulo: 'Execução mata perfeição', acao: 'Escrever a versão simples em 5 minutos' },
      { id: 3, titulo: 'Consistência vence sempre', acao: 'Resolver 5 questões ou ler 1 página' }
    ],
    customAnchors: [
      { id: 1, titulo: 'Concluí TCC em 2 semanas', cat: 'Estudos', desc: 'Resiliência e velocidade sob pressão.' },
      { id: 2, titulo: 'Mantive treino 90 dias seguidos', cat: 'Saúde', desc: 'Constância física e superação diária.' },
      { id: 3, titulo: 'Passei em 3 disciplinas de Direito', cat: 'Estudo', desc: 'Foco intelectual concentrado e produtividade.' }
    ],
    constitutionChecks: {},
  });

  // Global Timer States
  const [timeLeft, setTimeLeft] = useState(1500);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerProjectId, setTimerProjectId] = useState(null);
  const timerRef = useRef(null);

  const triggerToast = (msg, type = 'info') => {
    setToastMsg({ msg, type });
  };

  const getLocalDateString = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split('T')[0];
  };

  const getDaysDifference = (dateStr1, dateStr2) => {
    const d1 = new Date(dateStr1 + 'T00:00:00');
    const d2 = new Date(dateStr2 + 'T00:00:00');
    const diffTime = Math.abs(d2 - d1);
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPast30Days = () => {
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const offset = d.getTimezoneOffset();
      const localDate = new Date(d.getTime() - offset * 60 * 1000);
      dates.push(localDate.toISOString().split('T')[0]);
    }
    return dates;
  };

  const migrateLegacyState = (parsed) => {
    if (!parsed) return parsed;
    
    // Convert empresa to carreira panel area
    if (parsed.panel && parsed.panel.empresa !== undefined && parsed.panel.carreira === undefined) {
      parsed.panel.carreira = parsed.panel.empresa;
      delete parsed.panel.empresa;
    }

    // Migrate standard single-mission structures to multi-project array
    if (!parsed.projects || parsed.projects.length === 0) {
      const defaultProject = {
        id: 'geral',
        name: 'Geral',
        description: 'Painel Geral de Atividades',
        emoji: '🎯',
        color: '#00D4FF',
        defaultTimer: 1500,
        roadmap: [],
        notes: []
      };
      parsed.projects = [defaultProject];

      // Convert legacy missions
      if (parsed.missions) {
        parsed.missions = parsed.missions.map(m => ({
          ...m,
          project_id: m.project_id || 'geral',
          area: m.area === 'empresa' ? 'carreira' : m.area
        }));
      } else {
        parsed.missions = parsed.mission ? [{
          titulo: parsed.mission.titulo,
          prova: parsed.mission.prova,
          area: parsed.mission.area === 'empresa' ? 'carreira' : parsed.mission.area,
          status: parsed.action?.status || 'pendente',
          project_id: 'geral',
          created_at: new Date().toISOString()
        }] : [];
      }
    } else {
      // Map company to career inside loaded missions
      if (parsed.missions) {
        parsed.missions = parsed.missions.map(m => ({
          ...m,
          area: m.area === 'empresa' ? 'carreira' : m.area
        }));
      }
    }
    return parsed;
  };

  // State loader
  useEffect(() => {
    async function loadState() {
      try {
        const todayStr = getLocalDateString();
        
        // LocalStorage fallback load
        const localData = localStorage.getItem('guerreiro_state');
        if (localData) {
          try {
            let parsed = JSON.parse(localData);
            if (parsed) {
              parsed = migrateLegacyState(parsed);
              setState(prev => ({ ...prev, ...parsed }));
            }
          } catch (e) {
            console.error('LocalStorage load err:', e);
          }
        }

        const localHistData = localStorage.getItem('guerreiro_history');
        if (localHistData) {
          try {
            const parsedHist = JSON.parse(localHistData);
            if (parsedHist) setHistory(parsedHist);
          } catch (e) {
            console.error('LocalStorage history load err:', e);
          }
        }

        // Supabase load
        if (!isSupabaseConfigured) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('guerreiro_daily_states')
          .select('state')
          .eq('date', todayStr)
          .maybeSingle();

        if (error) throw error;

        const { data: histData } = await supabase
          .from('guerreiro_daily_states')
          .select('date, state')
          .order('date', { ascending: false })
          .limit(30);

        if (histData) setHistory(histData);

        if (data && data.state) {
          let loaded = data.state;
          loaded = migrateLegacyState(loaded);
          setState(prev => ({ ...prev, ...loaded }));
        } else {
          // New day load previous stats
          const { data: prevData, error: prevError } = await supabase
            .from('guerreiro_daily_states')
            .select('date, state')
            .lt('date', todayStr)
            .order('date', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (prevError) throw prevError;

          if (prevData && prevData.state) {
            const diff = getDaysDifference(prevData.date, todayStr);
            const yesterdayWasSuccessful = prevData.state.flags?.naoZerou || prevData.state.modoMinimo || prevData.state.flags?.acao;
            const newStreak = (diff === 1 && yesterdayWasSuccessful) ? (prevData.state.streak || 0) : 0;
            
            const migratedPrev = migrateLegacyState(prevData.state);

            setState(prev => ({
              ...prev,
              projects: migratedPrev.projects || [],
              activeProjectId: null,
              missions: [],
              mission: null,
              action: null,
              opState: null,
              fugaTipo: null,
              modoMinimo: false,
              streak: newStreak,
              flags: { missao: false, acao: false, fuga: false, eus: false, naoZerou: false },
              fixedEscapes: [],
              eus: { passado: '', presente: '', futuro: '' },
              eusSaved: false,
              conversion: migratedPrev.conversion || { consumidos: 0, aplicados: 0 },
              panel: migratedPrev.panel || { fe: 3, familia: 3, saude: 3, estudo: 3, carreira: 3 },
              customPrinciples: migratedPrev.customPrinciples || prev.customPrinciples,
              customAnchors: migratedPrev.customAnchors || prev.customAnchors,
              constitutionChecks: {},
            }));
          }
        }
      } catch (err) {
        console.error('Supabase load err:', err);
        triggerToast('Dados locais carregados.', 'info');
      } finally {
        setLoading(false);
      }
    }
    loadState();
  }, []);

  // State saver
  useEffect(() => {
    if (loading) return;
    const todayStr = getLocalDateString();
    
    // Save LocalStorage
    const stateToSave = state;
    localStorage.setItem('guerreiro_state', JSON.stringify(stateToSave));

    let localHist = [];
    try {
      const stored = localStorage.getItem('guerreiro_history');
      localHist = stored ? JSON.parse(stored) : [];
    } catch (e) {}
    localHist = [
      { date: todayStr, state: stateToSave },
      ...localHist.filter(h => h.date !== todayStr)
    ].slice(0, 30);
    localStorage.setItem('guerreiro_history', JSON.stringify(localHist));

    // Save Supabase
    if (!isSupabaseConfigured) return;

    const timeoutId = setTimeout(async () => {
      try {
        await supabase
          .from('guerreiro_daily_states')
          .upsert({
            date: todayStr,
            state: stateToSave,
            updated_at: new Date().toISOString()
          });
      } catch (err) {
        console.error('Supabase save err:', err);
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [state, loading]);

  // Global Timer Tick logic
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            
            // Auto complete active mission in current project
            const missions = state.missions || [];
            const activeMission = missions.find(m => m.project_id === timerProjectId && m.status !== 'done');
            if (activeMission) {
              triggerToast(`Timer finalizado! Missão concluída!`, 'success');
              
              setState(s => {
                const current = s.missions || [];
                const updated = current.map(m => (m.project_id === timerProjectId && m.status !== 'done') ? { ...m, status: 'done', completed_at: new Date().toISOString() } : m);
                
                return {
                  ...s,
                  missions: updated,
                  flags: { ...s.flags, acao: true, naoZerou: true },
                  streak: s.flags.naoZerou ? s.streak : s.streak + 1
                };
              });
            }
            
            const activeProject = state.projects?.find(p => p.id === timerProjectId);
            return activeProject?.defaultTimer || 1500;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timerProjectId, state.missions, state.projects]);

  const activeProject = state.projects?.find(p => p.id === state.activeProjectId);
  const pColor = activeProject?.color || C.accent;

  // Global scores of today
  const todayStr = getLocalDateString();
  const todayMissions = (state.missions || []).filter(m => m.created_at?.split('T')[0] === todayStr || m.completed_at?.split('T')[0] === todayStr);
  const completedToday = todayMissions.filter(m => m.status === 'done');
  const fugaCount = state.fixedEscapes ? state.fixedEscapes.length : 0;
  
  const score = (todayMissions.length * PONTUACAO.MISSAO_DEFINIDA) +
                (completedToday.length * PONTUACAO.MISSAO_CONCLUIDA) +
                (fugaCount * PONTUACAO.CORRECAO_FUGA) +
                (state.eusSaved ? PONTUACAO.REFLEXAO_3_EUS : 0) +
                (state.modoMinimo ? PONTUACAO.MODO_MINIMO_ATIVADO : 0);

  const classObj = classificarDia(score);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Sync Timer settings on project change
  useEffect(() => {
    if (activeProject) {
      if (timerProjectId !== activeProject.id) {
        setTimerProjectId(activeProject.id);
        setTimeLeft(activeProject.defaultTimer || 1500);
        setTimerRunning(false);
      }
    }
  }, [state.activeProjectId, activeProject]);

  if (loading) {
    return (
      <div style={{
        fontFamily: 'inherit', background: C.bg, minHeight: '100vh',
        maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', color: C.text, padding: 24, boxSizing: 'border-box'
      }}>
        <div style={{ position: 'relative', width: 70, height: 70, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: `2.5px solid #222`, borderRadius: '50%' }} />
          <div style={{
            position: 'absolute', width: '100%', height: '100%', border: `2.5px solid transparent`,
            borderTopColor: C.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite'
          }} />
          <span style={{ fontSize: 22 }}>⚡</span>
        </div>
        <div style={{ fontSize: 9, fontFamily: 'monospace', color: C.accent, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 6 }}>Sincronizando</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.textMuted }}>Comando Central</div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div style={{
        background: C.bg, minHeight: '100vh', maxWidth: 480, margin: '0 auto',
        display: 'flex', flexDirection: 'column', color: C.text, position: 'relative'
      }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        .two-col-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        .full-width-col {
          width: 100%;
        }
        input::placeholder, textarea::placeholder {
          color: #555866;
        }
        @keyframes expandLine {
          from { left: 50%; right: 50%; }
          to { left: 0; right: 0; }
        }
        @keyframes blinking {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      <Toast toastObj={toastMsg} onClose={() => setToastMsg(null)} activeColor={pColor} />

      {/* BREATHING & CORRECTION MODALS */}
      {state.opState === 'respirar_90' && (
        <ActionBreathing duration={90}
          onComplete={() => { setState(s => ({ ...s, opState: null })); setTimerRunning(true); }}
          onClose={() => setState(s => ({ ...s, opState: null }))}
          title="🫁 RESPIRAR E RETOMAR FOCO"
          subtitle="Inspire em 4s, segure por 4s, expire em 4s. Acalme o sistema nervoso para prosseguir."
          activeColor={pColor} />
      )}

      {state.opState === 'fuga_90' && (() => {
        const FUGAS = [
          { id: 'infinito', label: 'Planejamento Infinito', acao: 'A clareza vem da prática. Execute 5 minutos agora.' },
          { id: 'perfeccionismo', label: 'Perfeccionismo', acao: 'O feito é melhor que o perfeito. Conclua uma versão simplificada imediatamente.' },
          { id: 'distracao', label: 'Distração / Rede Social', acao: 'Feche todas as abas extras e foque no próximo passo simples.' }
        ];
        const f = FUGAS.find(x => x.id === state.fugaTipo);
        return (
          <ActionBreathing duration={90}
            onComplete={() => setState(s => ({ ...s, opState: null, fugaTipo: null }))}
            onClose={() => setState(s => ({ ...s, opState: null, fugaTipo: null }))}
            title="⚡ ANTÍDOTO DE DESVIO ACIONADO"
            subtitle={`Correção: ${f ? f.acao : ''}`}
            activeColor={pColor} />
        );
      })()}

      {/* HEADER FIXO */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 300, background: C.bg,
        borderBottom: `1px solid ${C.border}`, padding: '0 20px', height: 56,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        {activeProject ? (
          <button onClick={() => setState(s => ({ ...s, activeProjectId: null }))} style={{
            background: 'none', border: 'none', color: pColor, fontSize: 11, fontWeight: 'bold', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace'
          }}>
            ← VOLTAR
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16, color: C.accent }}>⚡</span>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.1em', color: C.text }}>COMANDO CENTRAL</span>
          </div>
        )}

        {/* Global main tabs when activeProject is null */}
        {!activeProject && (
          <div style={{ display: 'flex', height: '100%' }}>
            {[
              { id: 'dashboard', icon: '📂', l: 'PROJETOS' },
              { id: 'cronograma', icon: '📋', l: 'CRONOGRAMA' }
            ].map(t => {
              const active = mainTab === t.id;
              return (
                <button key={t.id} onClick={() => setMainTab(t.id)} style={{
                  background: 'none', border: 'none', height: '100%', padding: '0 12px',
                  display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative',
                  color: active ? C.text : C.textMuted, fontSize: 10, fontWeight: active ? 700 : 500,
                  transition: 'color 0.15s ease'
                }}>
                  <span>{t.l}</span>
                  {active && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                      background: C.accent, animation: 'expandLine 0.2s ease-out'
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Dynamic Project Tabs */}
        {activeProject && (
          <div style={{ display: 'flex', height: '100%' }}>
            {[
              { id: 'hoje', icon: '⚡', l: 'HOJE' },
              { id: 'roadmap', icon: '📍', l: 'ROADMAP' },
              { id: 'evolucao', icon: '📈', l: 'EVOLUÇÃO' },
              { id: 'anotacoes', icon: '📝', l: 'NOTAS' }
            ].map(t => {
              const active = projectTab === t.id;
              return (
                <button key={t.id} onClick={() => setProjectTab(t.id)} style={{
                  background: 'none', border: 'none', height: '100%', padding: '0 8px',
                  display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative',
                  color: active ? C.text : C.textMuted, fontSize: 10, fontWeight: active ? 700 : 500,
                  transition: 'color 0.15s ease'
                }}>
                  <span>{t.l}</span>
                  {active && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                      background: pColor, animation: 'expandLine 0.2s ease-out'
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Indicators in the header (hidden when activeProject has active tabs to avoid overlap) */}
        {!activeProject && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {[
              { label: 'MISSÃO', active: (state.missions || []).some(m => m.created_at?.startsWith(todayStr)), char: '🎯' },
              { label: 'AÇÃO', active: (state.missions || []).some(m => m.status === 'done' && m.completed_at?.startsWith(todayStr)), char: '⚔️' },
              { label: 'FUGA', active: state.fixedEscapes && state.fixedEscapes.length > 0, char: '🔍' },
              { label: 'REFLEXÃO', active: state.eusSaved, char: '📜' }
            ].map(item => (
              <div
                key={item.label}
                title={item.label}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: item.active ? 'rgba(16,185,129,0.15)' : '#1F2937',
                  border: `1px solid ${item.active ? '#10B981' : '#374151'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11
                }}
              >
                {item.char}
              </div>
            ))}
          </div>
        )}

        <button onClick={() => {
          if (activeProject) {
            setProjectTab('configurar');
          } else {
            setShowSettings(!showSettings);
          }
        }} style={{
          background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 15
        }}>
          ⚙️
        </button>
      </div>

      {/* SYSTEM SETTINGS MODAL */}
      {showSettings && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 400, padding: 24
        }} onClick={() => setShowSettings(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: C.surface, borderRadius: 12, padding: 24, width: '100%', maxWidth: 400,
            border: `1.5px solid ${C.border}`, boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
            <Label text="⚙️ CONFIGURAÇÕES DO SISTEMA" color={C.accent} />
            <div style={{ fontSize: 13, lineHeight: 1.5, color: C.text, fontFamily: 'monospace', maxHeight: '50vh', overflowY: 'auto', paddingRight: 6, marginBottom: 20 }}>
              <p style={{ marginBottom: 12 }}><b>Comando Central Multi-Projeto</b></p>
              <p style={{ fontWeight: 700, color: C.accent, marginTop: 16, marginBottom: 6 }}>Informações Gerais:</p>
              <ul style={{ paddingLeft: 16, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Status Supabase: <b style={{ color: isSupabaseConfigured ? C.success : C.warning }}>{isSupabaseConfigured ? 'Conectado' : 'Offline (Local)'}</b></li>
                <li>Projetos Criados: <b style={{ color: C.accent }}>{(state.projects || []).length}</b></li>
                <li>Missões Totais: <b>{(state.missions || []).length}</b></li>
                <li>Streak Atual: <b style={{ color: C.accent }}>{state.streak} dias</b></li>
              </ul>
            </div>
            <Btn label="VOLTAR" full onClick={() => setShowSettings(false)} />
          </div>
        </div>
      )}

      {/* VIEW DE ROTEAMENTO (BODY) */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {!activeProject ? (
          mainTab === 'dashboard' ? (
            <DashboardMain state={state} setState={setState} triggerToast={triggerToast} score={score} classObj={classObj} />
          ) : (
            <TabCronograma state={state} setState={setState} toast={triggerToast} />
          )
        ) : (
          <div>
            {projectTab === 'hoje' && (
              <ProjectHoje state={state} setState={setState} activeProject={activeProject} triggerToast={triggerToast}
                timeLeft={timeLeft} setTimeLeft={setTimeLeft} timerRunning={timerRunning} setTimerRunning={setTimerRunning} formatTime={formatTime} />
            )}
            {projectTab === 'roadmap' && (
              <ProjectRoadmap state={state} setState={setState} activeProject={activeProject} triggerToast={triggerToast} />
            )}
            {projectTab === 'evolucao' && (
              <ProjectEvolucao state={state} activeProject={activeProject} triggerToast={triggerToast} />
            )}
            {projectTab === 'anotacoes' && (
              <ProjectAnotacoes state={state} setState={setState} activeProject={activeProject} triggerToast={triggerToast} />
            )}
            {projectTab === 'configurar' && (
              <ProjectConfig state={state} setState={setState} activeProject={activeProject} triggerToast={triggerToast} />
            )}
          </div>
        )}
      </div>

      </div>
    </ErrorBoundary>
  );
}
