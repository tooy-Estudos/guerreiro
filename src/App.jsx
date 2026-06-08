import { useState, useEffect } from "react";

const C = {
  bg:'#0B0B0F', bgCard:'#101828', bgSub:'#1F2937', gold:'#C9A96A',
  green:'#22C55E', yellow:'#F59E0B', red:'#EF4444', text:'#F8FAFC',
  textSub:'#94A3B8', border:'#1F2937',
};

const CONSTITUTION = [
  {n:1,icon:'✝️',titulo:'FÉ',principio:'A fé vem antes da produtividade.',pergunta:'Estou fortalecendo minha base ou apenas correndo atrás de resultados?',acao:'5 minutos de oração.'},
  {n:2,icon:'🏠',titulo:'FAMÍLIA',principio:'A família vem antes do trabalho.',pergunta:'Estou presente ou apenas ocupado?',acao:'Conversa intencional de 10 minutos.'},
  {n:3,icon:'⚖️',titulo:'VERDADE',principio:'A verdade vem antes do conforto.',pergunta:'Estou sendo honesto comigo mesmo?',acao:'Nomear o problema real.'},
  {n:4,icon:'🔥',titulo:'DISCIPLINA',principio:'A disciplina vale mais que a motivação.',pergunta:'Estou esperando vontade ou escolhendo agir?',acao:'Executar 5 minutos da missão principal.'},
  {n:5,icon:'📜',titulo:'OAB',principio:'A OAB permanece prioridade até aprovação.',pergunta:'Minha agenda reflete essa prioridade?',acao:'Resolver 5 questões agora.'},
  {n:6,icon:'⚡',titulo:'EXECUÇÃO',principio:'Não consumir conteúdo antes de executar a missão.',pergunta:'Estou aprendendo ou apenas acumulando?',acao:'Aplicar algo imediatamente.'},
  {n:7,icon:'🎯',titulo:'FUTURO',principio:'O Eu Presente protege o Eu Futuro.',pergunta:'Essa escolha ajuda ou prejudica meu futuro?',acao:'Escolher a opção de benefício composto.'},
  {n:8,icon:'🔗',titulo:'CONSTÂNCIA',principio:'Nunca zerar voluntariamente.',pergunta:'Qual é a menor ação que mantém a corrente viva?',acao:'Executar versão mínima.'},
  {n:9,icon:'🪨',titulo:'SIMPLICIDADE',principio:'Pequena execução vale mais que plano perfeito.',pergunta:'Estou complicando o que poderia ser simples?',acao:'Executar uma versão reduzida.'},
  {n:10,icon:'🛡️',titulo:'CARÁTER',principio:'Nenhum resultado compensa perda de caráter.',pergunta:'Essa decisão preserva meus valores?',acao:'Escolher a opção correta, não a confortável.'},
];

const WAR_CARDS = [
  {id:'ms',titulo:'11 ANOS NA MAIS SAÚDE',cat:'Liderança',prova:'Você sabe permanecer e construir ao longo do tempo.',identidade:'Líder.',atitude:'Executar uma decisão difícil hoje.'},
  {id:'cas',titulo:'CASAMENTO SÓLIDO',cat:'Família',prova:'Você é capaz de compromisso, presença e aliança.',identidade:'Homem de palavra.',atitude:'Estar presente de verdade hoje.'},
  {id:'lid',titulo:'LIDERANÇA NA EMPRESA',cat:'Gestão',prova:'Você carrega pessoas, processos e resultados.',identidade:'Gestor confiável.',atitude:'Resolver algo que protege sua equipe.'},
  {id:'aca',titulo:'APROVAÇÕES ACADÊMICAS',cat:'Direito',prova:'Constância produz resultado comprovado.',identidade:'Estudante disciplinado.',atitude:'Resolver questões antes de consumir.'},
  {id:'tit',titulo:'TÍTULO MUNICIPAL',cat:'Superação',prova:'Disciplina coletiva gera vitória real.',identidade:'Competidor resiliente.',atitude:'Sustentar o esforço sem vontade hoje.'},
  {id:'pro',titulo:'PROJETOS IMPLANTADOS',cat:'Execução',prova:'Você transforma ideias em estrutura.',identidade:'Executor.',atitude:'Concluir uma versão simples hoje.'},
];

const ESCAPES = [
  {id:'plan',label:'Planejamento infinito',diag:'Você está usando organização como substituto da execução.',verdade:'Já existe clareza suficiente para agir.',acao:'Execute 5 minutos da missão principal agora.',btn:'EXECUTAR AGORA'},
  {id:'pesq',label:'Pesquisa excessiva',diag:'Você está buscando mais informação do que precisa.',verdade:'O próximo ganho vem da prática.',acao:'Aplicar imediatamente o que já aprendeu.',btn:'APLICAR AGORA'},
  {id:'perf',label:'Perfeccionismo',diag:'Você está esperando a condição perfeita.',verdade:'Progresso imperfeito gera resultado.',acao:'Concluir uma versão simples agora.',btn:'FINALIZAR VERSÃO SIMPLES'},
];

const PANEL_AREAS = [
  {key:'fe',label:'Fé',icon:'✝️',micro:'Oração de 5 minutos.'},
  {key:'familia',label:'Família',icon:'🏠',micro:'Conversa intencional de 10 minutos.'},
  {key:'saude',label:'Saúde',icon:'❤️',micro:'Caminhar 10 minutos.'},
  {key:'estudo',label:'Estudo',icon:'📚',micro:'Resolver 5 questões.'},
  {key:'empresa',label:'Empresa',icon:'💼',micro:'Resolver uma pendência crítica.'},
];

const scoreColor = s => s<=3?C.red:s<=5?C.yellow:s<=7?C.text:s<=9?C.green:C.gold;
const scoreLabel = s => s<=3?'DIA FRACO':s<=5?'DIA MÍNIMO':s<=7?'DIA BOM':s<=9?'DIA FORTE':'DIA ELITE';
const dateDisplay = () => {
  const d=new Date(),dd=['DOM','SEG','TER','QUA','QUI','SEX','SÁB'],
  mm=['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
  return `${dd[d.getDay()]}, ${d.getDate()} ${mm[d.getMonth()]}`;
};

function Label({text,color=C.textSub}){
  return <div style={{fontSize:10,fontFamily:'monospace',letterSpacing:'0.2em',color,textTransform:'uppercase',marginBottom:8}}>{text}</div>;
}

function Btn({label,variant='primary',onClick,disabled,full,small}){
  const v={primary:{background:C.gold,color:'#0B0B0F',border:'none'},
    secondary:{background:'transparent',color:C.gold,border:`1.5px solid ${C.gold}`},
    critical:{background:C.red,color:C.text,border:'none'}}[variant];
  return <button onClick={onClick} disabled={disabled} style={{...v,borderRadius:12,
    padding:small?'8px 14px':'13px 20px',fontFamily:'monospace',fontWeight:700,
    fontSize:small?10:12,letterSpacing:'0.08em',cursor:disabled?'default':'pointer',
    opacity:disabled?0.4:1,width:full?'100%':'auto',transition:'opacity 0.15s',whiteSpace:'nowrap'}}
    onMouseEnter={e=>{if(!disabled)e.target.style.opacity='0.82'}}
    onMouseLeave={e=>{if(!disabled)e.target.style.opacity='1'}}>{label}</button>;
}

function Toast({msg}){
  if(!msg)return null;
  return <div style={{position:'fixed',top:72,left:'50%',transform:'translateX(-50%)',
    background:C.bgCard,border:`1px solid ${C.green}66`,borderRadius:10,padding:'10px 20px',
    zIndex:9999,display:'flex',alignItems:'center',gap:8}}>
    <div style={{width:6,height:6,borderRadius:'50%',background:C.green}}/>
    <span style={{fontSize:12,color:C.text,fontFamily:'monospace',letterSpacing:'0.04em'}}>{msg}</span>
  </div>;
}

function Timer90({onClose,onComplete}){
  const [t,setT]=useState(90);
  const done=t<=0;
  useEffect(()=>{const id=setInterval(()=>setT(p=>p<=1?0:p-1),1000);return()=>clearInterval(id)},[]);
  const r=72,circ=2*Math.PI*r,pct=(90-t)/90;
  return <div style={{position:'fixed',inset:0,background:'rgba(11,11,15,0.97)',display:'flex',
    flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:500,padding:32}}>
    <div style={{fontSize:10,fontFamily:'monospace',color:C.textSub,letterSpacing:'0.2em',marginBottom:24}}>PROTOCOLO DE 90 SEGUNDOS</div>
    <div style={{position:'relative',width:168,height:168,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:32}}>
      <svg width={168} height={168} style={{position:'absolute',transform:'rotate(-90deg)'}}>
        <circle cx={84} cy={84} r={r} fill="none" stroke={C.bgSub} strokeWidth={4}/>
        <circle cx={84} cy={84} r={r} fill="none" stroke={C.gold} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} style={{transition:'stroke-dashoffset 1s linear'}}/>
      </svg>
      <span style={{fontFamily:'monospace',fontSize:56,fontWeight:700,color:C.text}}>{done?'✓':t}</span>
    </div>
    <div style={{textAlign:'center',marginBottom:32}}>
      <p style={{color:C.text,fontSize:18,fontWeight:600,margin:'0 0 8px'}}>Respire.</p>
      <p style={{color:C.textSub,fontSize:14,margin:'0 0 4px'}}>Pare de negociar.</p>
      <p style={{color:C.textSub,fontSize:14,margin:0}}>Faça a primeira ação.</p>
    </div>
    {done?<Btn label="INICIAR AÇÃO DO GUERREIRO ⚔️" onClick={()=>{onComplete();onClose()}}/>
      :<button onClick={onClose} style={{background:'none',border:'none',color:C.textSub,fontSize:12,cursor:'pointer',fontFamily:'monospace'}}>cancelar</button>}
  </div>;
}

// ─── ABA HOJE ───
function TabHoje({state,setState,toast}){
  const [showModal,setShowModal]=useState(false);
  const [mTitulo,setMTitulo]=useState('');
  const [mProva,setMProva]=useState('');
  const [showTimer,setShowTimer]=useState(false);
  const [activeEscape,setActiveEscape]=useState(null);
  const [escapeOpen,setEscapeOpen]=useState(false);

  const f=state.flags;
  const score=(f.missao?2:0)+(f.acao?3:0)+(f.fuga?2:0)+(f.eus?1:0)+(f.naoZerou?2:0);
  const actionDone=state.action?.status==='done';

  // Diagnóstico Vivo — regra fixa, sem IA: primeira fuga não corrigida
  const pendingEscape=ESCAPES.find(e=>!state.fixedEscapes.includes(e.id));
  const diagnostico=pendingEscape
    ?{risco:pendingEscape.label.toLowerCase(),acao:pendingEscape.acao}
    :{risco:null,acao:'Mantenha o foco na missão. Execute antes de consumir.'};

  const setFlag=(k,v=true)=>setState(s=>({...s,flags:{...s.flags,[k]:v}}));

  const confirmMission=()=>{
    if(!mTitulo.trim()||!mProva.trim())return;
    setState(s=>({...s,mission:{titulo:mTitulo.trim(),prova:mProva.trim()},
      action:{desc:`Resolver a prova: ${mProva.trim()}`,status:'pendente'},
      flags:{...s.flags,missao:true}}));
    setShowModal(false);setMTitulo('');setMProva('');toast('Missão definida. +2 pontos.');
  };

  const opState=state.opState;
  const setOp=v=>setState(s=>({...s,opState:s.opState===v?null:v}));

  // contagem de fugas pendentes para o cabeçalho do detector
  const pendingCount=ESCAPES.filter(e=>!state.fixedEscapes.includes(e.id)).length;

  return <div style={{padding:'14px 16px 100px',display:'flex',flexDirection:'column',gap:8}}>
    {showTimer&&<Timer90 onClose={()=>{setShowTimer(false);setOp(null)}} onComplete={()=>setShowTimer(false)}/>}

    {/* MODAL MISSÃO */}
    {showModal&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',
      alignItems:'flex-end',justifyContent:'center',zIndex:400}} onClick={()=>setShowModal(false)}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.bgCard,borderRadius:'20px 20px 0 0',
        padding:'24px 20px 40px',width:'100%',maxWidth:480,border:`1px solid ${C.gold}4D`}}>
        <div style={{width:40,height:4,background:C.bgSub,borderRadius:2,margin:'0 auto 24px'}}/>
        <Label text="⚡ DEFINIR MISSÃO DO DIA" color={C.gold}/>
        <div style={{fontSize:11,color:C.textSub,fontFamily:'monospace',letterSpacing:'0.08em',marginBottom:6}}>QUAL É SUA MISSÃO HOJE?</div>
        <input value={mTitulo} onChange={e=>setMTitulo(e.target.value)} placeholder="Aprovação OAB..."
          style={{width:'100%',background:C.bgSub,border:`1px solid ${C.border}`,borderRadius:10,padding:'12px 14px',color:C.text,fontSize:14,outline:'none',boxSizing:'border-box',marginBottom:14}}/>
        <div style={{fontSize:11,color:C.textSub,fontFamily:'monospace',letterSpacing:'0.08em',marginBottom:6}}>QUAL É A PROVA DE EXECUÇÃO?</div>
        <input value={mProva} onChange={e=>setMProva(e.target.value)} placeholder="Resolver 10 questões..."
          style={{width:'100%',background:C.bgSub,border:`1px solid ${C.border}`,borderRadius:10,padding:'12px 14px',color:C.text,fontSize:14,outline:'none',boxSizing:'border-box',marginBottom:24}}/>
        <Btn label="CONFIRMAR MISSÃO ✓" full disabled={!mTitulo.trim()||!mProva.trim()} onClick={confirmMission}/>
      </div>
    </div>}

    {/* 1. MISSÃO CRÍTICA — compacta, -25% altura */}
    {state.mission?
      <div style={{background:'linear-gradient(135deg,#101828,#0D1F35)',border:`1.5px solid ${C.gold}`,
        borderRadius:16,padding:'14px 16px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-20,right:-20,width:70,height:70,borderRadius:'50%',background:'rgba(201,169,106,0.07)'}}/>
        <Label text="⚡ MISSÃO CRÍTICA" color={C.gold}/>
        <div style={{fontSize:22,fontFamily:'Georgia,serif',color:C.text,lineHeight:1.15,marginBottom:10}}>
          {state.mission.titulo}
        </div>
        <div style={{display:'inline-flex',gap:6,background:'rgba(201,169,106,0.12)',
          border:'1px solid rgba(201,169,106,0.25)',borderRadius:7,padding:'5px 10px'}}>
          <span style={{fontSize:10,color:C.gold,fontFamily:'monospace'}}>🎯 {state.mission.prova}</span>
        </div>
      </div>
      :<div onClick={()=>setShowModal(true)} style={{background:C.bgCard,border:`1.5px dashed ${C.gold}4D`,
        borderRadius:16,padding:'14px 16px',display:'flex',flexDirection:'column',justifyContent:'center',cursor:'pointer',minHeight:96}}>
        <Label text="⚡ MISSÃO CRÍTICA" color={C.gold}/>
        <div style={{fontSize:19,fontFamily:'Georgia,serif',color:C.textSub,marginBottom:8}}>Qual é sua missão hoje?</div>
        <div style={{fontSize:11,color:C.gold,fontFamily:'monospace'}}>Toque para definir →</div>
      </div>}

    {/* 2. AÇÃO DO GUERREIRO — imediatamente abaixo da missão */}
    <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:16,padding:'14px 16px'}}>
      <Label text="⚔️ AÇÃO DO GUERREIRO"/>
      {!state.mission
        ?<div style={{fontSize:13,color:C.textSub,marginBottom:12}}>Defina sua missão primeiro.</div>
        :<>
          <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:6,lineHeight:1.4}}>{state.action?.desc}</div>
          <div style={{fontSize:11,color:C.textSub,fontFamily:'monospace',marginBottom:12}}>⏱ 25 min</div>
        </>}
      {state.mission&&state.action?.status==='pendente'&&
        <Btn label="⚡ EXECUTAR AGORA" full onClick={()=>setState(s=>({...s,action:{...s.action,status:'exec'}}))}/>}
      {state.action?.status==='exec'&&<div style={{display:'flex',flexDirection:'column',gap:8}}>
        <div style={{padding:'9px 12px',background:'rgba(201,169,106,0.08)',border:'1px solid rgba(201,169,106,0.25)',
          borderRadius:8,fontSize:11,color:C.gold,fontFamily:'monospace'}}>⏳ Executando...</div>
        <Btn label="✓ MARCAR COMO CONCLUÍDA" variant="secondary" full onClick={()=>{
          setState(s=>({...s,action:{...s.action,status:'done'},flags:{...s.flags,acao:true,naoZerou:true},streak:s.streak+(s.streak===0?1:0)}));
          toast('Missão executada. +3 pontos.');}}/>
      </div>}
      {state.action?.status==='done'&&
        <div style={{color:C.green,fontSize:13,fontFamily:'monospace',fontWeight:700}}>✓ CONCLUÍDA</div>}
      {!state.mission&&
        <Btn label="⚡ EXECUTAR AGORA" full disabled/>}
    </div>

    {/* 3. RISCO PRINCIPAL — substitui Diagnóstico do Dia */}
    {!actionDone&&pendingEscape&&<div style={{background:'rgba(245,158,11,0.07)',
      border:'1px solid rgba(245,158,11,0.18)',borderRadius:10,padding:'10px 14px',
      display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
      <div>
        <div style={{fontSize:9,fontFamily:'monospace',color:C.yellow,letterSpacing:'0.15em',marginBottom:3}}>
          RISCO PRINCIPAL
        </div>
        <div style={{fontSize:13,color:C.text,fontWeight:600}}>{pendingEscape.label}</div>
      </div>
      <div style={{fontSize:11,color:C.textSub,textAlign:'right',flexShrink:0}}>
        Execute 5 min agora.
      </div>
    </div>}

    {/* 4. ESTADOS OPERACIONAIS — chips compactos */}
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      <div style={{display:'flex',gap:6}}>
        {[{id:'exec',l:'EXECUÇÃO',c:C.green},{id:'trav',l:'TRAVADO',c:C.red},{id:'cans',l:'CANSAÇO',c:C.yellow}].map(s=>{
          const a=opState===s.id;
          return <button key={s.id}
            onClick={()=>{if(s.id==='trav'){setOp('trav');setShowTimer(true)}else setOp(s.id)}}
            style={{flex:1,height:32,borderRadius:8,border:`1px solid ${a?s.c:C.border}`,
              background:a?`${s.c}18`:'transparent',color:a?s.c:C.textSub,
              fontFamily:'monospace',fontWeight:700,fontSize:9,letterSpacing:'0.04em',cursor:'pointer'}}>
            {s.l}
          </button>;
        })}
      </div>
      {opState==='exec'&&<div style={{background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.12)',
        borderRadius:8,padding:'8px 12px'}}>
        <div style={{fontSize:12,color:C.textSub,fontStyle:'italic'}}>"Menos análise. Mais ação."</div>
      </div>}
      {opState==='cans'&&<div style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.12)',
        borderRadius:8,padding:'12px'}}>
        <div style={{fontSize:9,fontFamily:'monospace',color:C.yellow,letterSpacing:'0.15em',marginBottom:6}}>MODO MÍNIMO</div>
        <div style={{fontSize:12,color:C.textSub,marginBottom:10}}>Hoje não precisa ser perfeito. Só não pode zerar.</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
          {['1 questão','1 página','5 minutos','1 oração'].map(o=>
            <span key={o} onClick={()=>setState(s=>({...s,tiredChip:o}))}
              style={{padding:'5px 10px',borderRadius:7,fontSize:11,cursor:'pointer',fontFamily:'monospace',
                border:`1px solid ${state.tiredChip===o?C.yellow:'rgba(245,158,11,0.25)'}`,
                background:state.tiredChip===o?'rgba(245,158,11,0.2)':'rgba(245,158,11,0.07)',
                color:C.yellow}}>{o}</span>)}
        </div>
        {state.tiredChip&&<button
          onClick={()=>{setFlag('naoZerou');setState(s=>({...s,streak:Math.max(s.streak,1),opState:null,tiredChip:null}));toast('Dia protegido.');}}
          style={{width:'100%',height:36,borderRadius:8,background:C.yellow,border:'none',
            color:'#0B0B0F',fontFamily:'monospace',fontWeight:700,fontSize:11,cursor:'pointer'}}>
          NÃO ZERAR HOJE
        </button>}
      </div>}
    </div>

    {/* 5. SCORE + STREAK — ocultos até conclusão */}
    {actionDone
      ?<div style={{display:'flex',gap:8}}>
          <div style={{flex:1,background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:14}}>
            <div style={{fontSize:9,fontFamily:'monospace',color:C.textSub,letterSpacing:'0.1em',marginBottom:4}}>SCORE DO DIA</div>
            <div style={{fontFamily:'monospace',fontSize:28,fontWeight:700,color:scoreColor(score),lineHeight:1}}>{score}</div>
            <div style={{fontSize:9,fontFamily:'monospace',color:C.textSub,marginTop:3}}>{scoreLabel(score)}</div>
          </div>
          <div style={{flex:1,background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:14}}>
            <div style={{fontSize:9,fontFamily:'monospace',color:C.textSub,letterSpacing:'0.1em',marginBottom:4}}>SEM ZERAR</div>
            <div style={{fontFamily:'monospace',fontSize:28,fontWeight:700,color:C.gold,lineHeight:1}}>
              {state.streak}<span style={{fontSize:12,color:C.textSub}}>/30</span>
            </div>
            <div style={{fontSize:9,fontFamily:'monospace',color:C.textSub,marginTop:3}}>Meta atual</div>
          </div>
        </div>
      :<div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,
          padding:'11px 16px',textAlign:'center'}}>
          <span style={{fontSize:12,fontFamily:'monospace',color:C.textSub,letterSpacing:'0.06em'}}>
            Pronto para começar
          </span>
        </div>}

    {/* 6. DETECTOR DE FUGA — colapsado, cabeçalho com contagem de pendências */}
    <div>
      <button onClick={()=>setEscapeOpen(o=>!o)} style={{width:'100%',display:'flex',
        justifyContent:'space-between',alignItems:'center',background:'transparent',
        border:'none',cursor:'pointer',padding:'4px 0',marginBottom:escapeOpen?6:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:10,fontFamily:'monospace',color:C.textSub,letterSpacing:'0.2em'}}>🔍 DETECTOR DE FUGA</span>
          {pendingCount>0&&<span style={{fontSize:9,fontFamily:'monospace',color:C.red,
            background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',
            borderRadius:5,padding:'2px 6px'}}>{pendingCount} pendente{pendingCount>1?'s':''}</span>}
          {pendingCount===0&&<span style={{fontSize:9,fontFamily:'monospace',color:C.green}}>✓ ok</span>}
        </div>
        <span style={{fontSize:11,fontFamily:'monospace',color:C.gold}}>{escapeOpen?'▲':'▼'}</span>
      </button>
      {escapeOpen&&<div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,overflow:'hidden'}}>
        {ESCAPES.map((e,i)=>{
          const fixed=state.fixedEscapes.includes(e.id);
          const exp=activeEscape===e.id;
          return <div key={e.id}>
            {i>0&&<div style={{height:1,background:C.border}}/>}
            <button onClick={()=>!fixed&&setActiveEscape(exp?null:e.id)}
              style={{width:'100%',height:44,padding:'0 14px',display:'flex',
                justifyContent:'space-between',alignItems:'center',background:'transparent',
                border:'none',cursor:fixed?'default':'pointer'}}>
              <span style={{fontSize:12,color:fixed?C.green:C.textSub}}>{fixed?'✓ ':''}{e.label}</span>
              <span style={{fontSize:14,fontFamily:'monospace',color:fixed?C.green:C.gold}}>
                {fixed?'✓':exp?'−':'+'}
              </span>
            </button>
            {exp&&!fixed&&<div style={{padding:'12px 14px 14px',background:C.bgSub}}>
              <div style={{fontSize:9,fontFamily:'monospace',color:C.red,letterSpacing:'0.15em',marginBottom:3}}>DIAGNÓSTICO</div>
              <div style={{fontSize:12,color:C.text,marginBottom:10,lineHeight:1.5}}>{e.diag}</div>
              <div style={{fontSize:9,fontFamily:'monospace',color:C.textSub,letterSpacing:'0.15em',marginBottom:3}}>VERDADE</div>
              <div style={{fontSize:12,color:C.textSub,marginBottom:10}}>{e.verdade}</div>
              <div style={{fontSize:9,fontFamily:'monospace',color:C.gold,letterSpacing:'0.15em',marginBottom:3}}>AÇÃO CORRETIVA</div>
              <div style={{fontSize:12,color:C.text,marginBottom:12}}>{e.acao}</div>
              <Btn label={e.btn} variant="secondary" full onClick={()=>{
                setState(s=>({...s,fixedEscapes:[...s.fixedEscapes,e.id],flags:{...s.flags,fuga:true}}));
                setActiveEscape(null);toast('Fuga corrigida. +2 pontos.');}}/>
            </div>}
          </div>;
        })}
      </div>}
    </div>
  </div>;
}

// ─── ABA IDENTIDADE ───
function TabIdentidade({state,setState,toast}){
  const [warIdx,setWarIdx]=useState(0);
  const [artIdx,setArtIdx]=useState(0);
  const [showConfrontar,setShowConfrontar]=useState(false);
  const e=state.eus;
  const setEu=(k,v)=>setState(s=>({...s,eus:{...s.eus,[k]:v},eusSaved:false}));

  const wcard=WAR_CARDS[warIdx];
  const artig=CONSTITUTION[artIdx];
  const prevWar=()=>setWarIdx(i=>(i-1+WAR_CARDS.length)%WAR_CARDS.length);
  const nextWar=()=>setWarIdx(i=>(i+1)%WAR_CARDS.length);
  const prevArt=()=>setArtIdx(i=>(i-1+CONSTITUTION.length)%CONSTITUTION.length);
  const nextArt=()=>setArtIdx(i=>(i+1)%CONSTITUTION.length);

  return <div style={{padding:'20px 16px 100px',display:'flex',flexDirection:'column',gap:14}}>

    {/* MODAL CONFRONTAR */}
    {showConfrontar&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',
      alignItems:'flex-end',justifyContent:'center',zIndex:400}} onClick={()=>setShowConfrontar(false)}>
      <div onClick={ev=>ev.stopPropagation()} style={{background:C.bgCard,borderRadius:'20px 20px 0 0',
        padding:'24px 20px 40px',width:'100%',maxWidth:480,border:`1px solid ${C.gold}4D`}}>
        <div style={{width:40,height:4,background:C.bgSub,borderRadius:2,margin:'0 auto 24px'}}/>
        <div style={{fontSize:10,fontFamily:'monospace',color:C.gold,letterSpacing:'0.2em',marginBottom:4}}>
          {artig.icon} ART. {artig.n} — {artig.titulo}
        </div>
        <div style={{fontSize:22,fontFamily:'Georgia,serif',color:C.text,lineHeight:1.3,marginBottom:20}}>
          {artig.principio}
        </div>
        <div style={{fontSize:10,fontFamily:'monospace',color:C.textSub,letterSpacing:'0.15em',marginBottom:6}}>CONFRONTO</div>
        <div style={{fontSize:14,color:C.text,fontStyle:'italic',marginBottom:20,lineHeight:1.5}}>
          "{artig.pergunta}"
        </div>
        <div style={{fontSize:10,fontFamily:'monospace',color:C.gold,letterSpacing:'0.15em',marginBottom:6}}>AÇÃO MÍNIMA</div>
        <div style={{fontSize:14,color:C.text,marginBottom:28,lineHeight:1.4}}>{artig.acao}</div>
        <Btn label="ENTENDIDO ✓" variant="secondary" full onClick={()=>setShowConfrontar(false)}/>
      </div>
    </div>}

    {/* 1. MEMÓRIA DE GUERRA — card único + navegação */}
    <div style={{background:'linear-gradient(135deg,#0D0D0D,#1A1206)',
      border:'1.5px solid rgba(201,169,106,0.4)',borderRadius:20,padding:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div style={{fontSize:10,fontFamily:'monospace',color:C.gold,letterSpacing:'0.2em'}}>🏆 MEMÓRIA DE GUERRA</div>
        <div style={{fontSize:10,fontFamily:'monospace',color:C.textSub}}>{warIdx+1}/{WAR_CARDS.length}</div>
      </div>

      <div style={{fontSize:20,fontWeight:700,color:C.text,lineHeight:1.2,marginBottom:4}}>{wcard.titulo}</div>
      <div style={{fontSize:9,fontFamily:'monospace',color:C.gold,letterSpacing:'0.15em',marginBottom:16}}>
        {wcard.cat.toUpperCase()}
      </div>

      <div style={{height:1,background:C.border,marginBottom:16}}/>

      <div style={{fontSize:10,fontFamily:'monospace',color:C.textSub,letterSpacing:'0.15em',marginBottom:6}}>ISTO PROVA</div>
      <div style={{fontSize:14,color:C.text,lineHeight:1.5,marginBottom:14}}>{wcard.prova}</div>

      <div style={{fontSize:10,fontFamily:'monospace',color:C.textSub,letterSpacing:'0.15em',marginBottom:4}}>IDENTIDADE</div>
      <div style={{fontSize:14,color:C.gold,marginBottom:14,fontWeight:600}}>{wcard.identidade}</div>

      <div style={{fontSize:10,fontFamily:'monospace',color:C.textSub,letterSpacing:'0.15em',marginBottom:4}}>ATITUDE DE HOJE</div>
      <div style={{fontSize:14,color:C.text,lineHeight:1.4,marginBottom:20}}>{wcard.atitude}</div>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <button onClick={prevWar} style={{background:'transparent',border:`1px solid ${C.border}`,
          borderRadius:8,padding:'8px 16px',color:C.textSub,fontFamily:'monospace',fontSize:12,cursor:'pointer'}}>
          ← anterior
        </button>
        <div style={{display:'flex',gap:4}}>
          {WAR_CARDS.map((_,i)=><div key={i} style={{width:6,height:6,borderRadius:'50%',
            background:i===warIdx?C.gold:C.border}}/>)}
        </div>
        <button onClick={nextWar} style={{background:'transparent',border:`1px solid ${C.border}`,
          borderRadius:8,padding:'8px 16px',color:C.textSub,fontFamily:'monospace',fontSize:12,cursor:'pointer'}}>
          próximo →
        </button>
      </div>
    </div>

    {/* 2. SISTEMA DOS 3 EUS */}
    <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:20,padding:20}}>
      <Label text="⚙️ SISTEMA DOS 3 EUS"/>
      <div style={{fontSize:12,color:C.textSub,marginBottom:16}}>Passado mostra o padrão. Presente escolhe. Futuro recebe.</div>
      {[{k:'passado',l:'EU DO PASSADO',q:'Qual padrão apareceu?',p:'procrastinação...'},
        {k:'presente',l:'EU DO PRESENTE',q:'Qual ação faço agora?',p:'resolver 5 questões...'},
        {k:'futuro',l:'EU DO FUTURO',q:'Se repetir 30 dias, quem me torno?',p:'mais disciplinado...'}
      ].map(eu=>
        <div key={eu.k} style={{marginBottom:14}}>
          <div style={{fontSize:10,fontFamily:'monospace',color:C.gold,letterSpacing:'0.1em',marginBottom:4}}>{eu.l}</div>
          <div style={{fontSize:12,color:C.textSub,marginBottom:6}}>{eu.q}</div>
          <textarea value={e[eu.k]} onChange={ev=>setEu(eu.k,ev.target.value)} placeholder={eu.p} rows={2}
            style={{width:'100%',background:C.bgSub,border:`1px solid ${C.border}`,borderRadius:8,
            padding:'10px 12px',color:C.text,fontSize:13,resize:'none',outline:'none',
            boxSizing:'border-box',fontFamily:'inherit'}}/>
        </div>)}
      <div style={{display:'flex',gap:10}}>
        <div style={{flex:1}}>
          <Btn label={state.eusSaved?'✓ SALVO':'SALVAR REFLEXÃO'} variant="secondary" full
            disabled={!e.passado.trim()||!e.presente.trim()||!e.futuro.trim()}
            onClick={()=>{setState(s=>({...s,eusSaved:true,flags:{...s.flags,eus:true}}));
              toast('Reflexão salva. +1 ponto.');}}/>
        </div>
        <div style={{flex:1}}>
          <Btn label="ATIVAR GUERREIRO ⚔️" full
            disabled={!e.presente.trim()}
            onClick={()=>{
              if(!e.presente.trim())return;
              if(!state.mission){
                toast('Defina uma missão antes de ativar o Guerreiro.');
                return;
              }
              setState(s=>({...s,action:{
                desc:e.presente.trim(),
                status:'pendente'
              }}));
              toast('Ação do Guerreiro atualizada.');}}/>
        </div>
      </div>
    </div>

    {/* 3. ARTIGO DO DIA */}
    <div style={{background:C.bgCard,border:`1.5px solid ${C.gold}44`,borderRadius:20,padding:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <div style={{fontSize:10,fontFamily:'monospace',color:C.gold,letterSpacing:'0.2em'}}>📜 ARTIGO DO DIA</div>
        <div style={{fontSize:10,fontFamily:'monospace',color:C.textSub}}>{artIdx+1}/{CONSTITUTION.length}</div>
      </div>

      <div style={{fontSize:10,fontFamily:'monospace',color:C.gold,letterSpacing:'0.1em',marginBottom:8}}>
        {artig.icon} ART. {artig.n} — {artig.titulo}
      </div>
      <div style={{fontSize:20,fontFamily:'Georgia,serif',color:C.text,lineHeight:1.35,marginBottom:20}}>
        {artig.principio}
      </div>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <button onClick={prevArt} style={{background:'transparent',border:`1px solid ${C.border}`,
          borderRadius:8,padding:'8px 16px',color:C.textSub,fontFamily:'monospace',fontSize:12,cursor:'pointer'}}>
          ←
        </button>
        <div style={{display:'flex',gap:4}}>
          {CONSTITUTION.map((_,i)=><div key={i} style={{width:5,height:5,borderRadius:'50%',
            background:i===artIdx?C.gold:C.border}}/>)}
        </div>
        <button onClick={nextArt} style={{background:'transparent',border:`1px solid ${C.border}`,
          borderRadius:8,padding:'8px 16px',color:C.textSub,fontFamily:'monospace',fontSize:12,cursor:'pointer'}}>
          →
        </button>
      </div>

      <Btn label="CONFRONTAR" full onClick={()=>setShowConfrontar(true)}/>
    </div>

  </div>;
}

// ─── ABA EVOLUÇÃO ───
function TabEvolucao({state,setState,toast}){
  const [panelOpen,setPanelOpen]=useState(false);
  const [activeArea,setActiveArea]=useState(null);

  const c=state.conversion;
  const pct=c.consumidos>0?Math.round((c.aplicados/c.consumidos)*100):0;
  const hasData=c.consumidos>0;
  const blocked=hasData&&pct<40;
  const convColor=pct>=70?C.green:pct>=40?C.yellow:C.red;
  const convStatus=pct>=70?'🟢 ALTA':pct>=40?'🟡 MODERADA':'🔴 BAIXA';

  const p=state.panel;
  const toggleArea=k=>setActiveArea(a=>a===k?null:k);
  const lvIcon=l=>l===3?'🟢':l===2?'🟡':'🔴';
  const lvLabel=l=>l===3?'Bem':l===2?'Atenção':'Crítico';
  const lvColor=l=>l===3?C.green:l===2?C.yellow:C.red;

  // resumo do painel
  const alertCount=PANEL_AREAS.filter(a=>p[a.key]<3).length;
  const critCount=PANEL_AREAS.filter(a=>p[a.key]===1).length;
  const panelSummary=alertCount===0
    ?'Todas as áreas em equilíbrio.'
    :`${alertCount}/5 ${alertCount===1?'área':'áreas'} pedindo atenção${critCount>0?` · ${critCount} crítica${critCount>1?'s':''}`:''}`;
  const panelSummaryColor=critCount>0?C.red:alertCount>0?C.yellow:C.green;

  // correção prioritária — crítico → conversão → atenção
  const order=['saude','familia','fe','estudo','empresa'];
  let corr=null;
  for(const k of order)if(p[k]===1){const a=PANEL_AREAS.find(x=>x.key===k);corr={area:a.label,icon:a.icon,urgencia:'CRÍTICO',acao:a.micro,cor:C.red};break;}
  if(!corr&&blocked)corr={area:'Conversão',icon:'📈',urgencia:'BLOQUEADO',acao:'Aplicar imediatamente um conteúdo aprendido.',cor:C.red};
  if(!corr)for(const k of order)if(p[k]===2){const a=PANEL_AREAS.find(x=>x.key===k);corr={area:a.label,icon:a.icon,urgencia:'ATENÇÃO',acao:a.micro,cor:C.yellow};break;}

  return <div style={{padding:'20px 16px 100px',display:'flex',flexDirection:'column',gap:12}}>

    {/* 1. CORREÇÃO PRIORITÁRIA — topo, primeira dobra */}
    {corr?
      <div style={{background:state.corrDone
          ?'rgba(34,197,94,0.06)'
          :`linear-gradient(135deg,${corr.cor}18,${corr.cor}08)`,
        border:`1.5px solid ${state.corrDone?C.green+'44':corr.cor+'55'}`,
        borderRadius:20,padding:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <Label text="🎯 CORREÇÃO PRIORITÁRIA" color={state.corrDone?C.green:corr.cor}/>
          {!state.corrDone&&<div style={{fontSize:9,fontFamily:'monospace',color:corr.cor,
            background:`${corr.cor}22`,border:`1px solid ${corr.cor}44`,
            borderRadius:6,padding:'3px 8px',letterSpacing:'0.1em'}}>{corr.urgencia}</div>}
        </div>
        {state.corrDone
          ?<>
            <div style={{fontSize:15,fontWeight:700,color:C.green,marginBottom:6}}>✓ Correção realizada.</div>
            <div style={{fontSize:13,color:C.textSub}}>Volte à Aba Hoje e execute.</div>
          </>
          :<>
            <div style={{fontSize:22,fontWeight:700,color:C.text,lineHeight:1.2,marginBottom:4}}>
              {corr.icon} {corr.area}
            </div>
            <div style={{fontSize:14,color:C.text,lineHeight:1.5,marginBottom:20}}>
              {corr.acao}
            </div>
            <Btn label="CORRIGIR AGORA" variant="critical" full
              onClick={()=>{setState(s=>({...s,corrDone:true}));toast('Correção realizada.');}}/>
          </>}
      </div>
      :<div style={{background:'rgba(34,197,94,0.06)',border:`1.5px solid ${C.green}44`,borderRadius:20,padding:20}}>
        <Label text="🎯 CORREÇÃO PRIORITÁRIA" color={C.green}/>
        <div style={{fontSize:15,fontWeight:700,color:C.green,marginBottom:4}}>✓ Tudo em ordem hoje.</div>
        <div style={{fontSize:13,color:C.textSub}}>Nenhuma área crítica. Mantenha o ritmo.</div>
      </div>}

    {/* 2. ÍNDICE DE CONVERSÃO — compacto */}
    <div style={{background:C.bgCard,border:`1px solid ${hasData?convColor+'44':C.border}`,borderRadius:16,padding:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <Label text="📈 CONVERSÃO"/>
        <div style={{fontSize:11,fontFamily:'monospace',color:convColor,fontWeight:700}}>
          {hasData?`${pct}% · ${convStatus}`:'SEM DADOS'}
        </div>
      </div>

      {!hasData
        ?<div style={{fontSize:13,color:C.textSub,marginBottom:14}}>
            0% — Nenhuma execução registrada hoje.
          </div>
        :<div style={{display:'flex',gap:16,fontSize:12,color:C.textSub,marginBottom:12}}>
            <span>Consumidos: <b style={{color:C.text}}>{c.consumidos}</b></span>
            <span>Aplicados: <b style={{color:convColor}}>{c.aplicados}</b></span>
          </div>}

      {blocked&&<div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',
        borderRadius:8,padding:'8px 12px',marginBottom:12}}>
        <div style={{fontSize:11,color:C.red,fontFamily:'monospace',fontWeight:700}}>
          ⛔ BLOQUEIO — Aplique antes de consumir novo conteúdo.
        </div>
      </div>}

      {/* botões com hierarquia: + Aplicação é primário */}
      <div style={{display:'flex',gap:10}}>
        <button
          disabled={c.consumidos===0}
          onClick={()=>{
            if(c.consumidos===0){toast('Registre um conteúdo antes de aplicar.');return;}
            setState(s=>({...s,corrDone:false,conversion:{...s.conversion,
              aplicados:Math.min(s.conversion.aplicados+1,s.conversion.consumidos)}}));}}
          style={{flex:2,padding:'11px 0',background:c.consumidos===0?C.bgSub:C.green,border:'none',
            borderRadius:12,color:c.consumidos===0?C.textSub:'#0B0B0F',fontFamily:'monospace',fontWeight:700,
            fontSize:12,cursor:c.consumidos===0?'default':'pointer',letterSpacing:'0.04em',
            opacity:c.consumidos===0?0.4:1}}>
          + Aplicação
        </button>
        <button
          onClick={()=>setState(s=>({...s,corrDone:false,conversion:{...s.conversion,consumidos:s.conversion.consumidos+1}}))}
          style={{flex:1,padding:'11px 0',background:'transparent',
            border:`1px solid ${C.border}`,borderRadius:12,color:C.textSub,
            fontFamily:'monospace',fontSize:12,cursor:'pointer'}}>
          + Conteúdo
        </button>
      </div>
    </div>

    {/* 3. PAINEL DA VIDA — colapsado por padrão */}
    <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:16,overflow:'hidden'}}>
      {/* cabeçalho sempre visível — toque para expandir */}
      <button onClick={()=>setPanelOpen(o=>!o)} style={{width:'100%',padding:'16px 18px',
        display:'flex',justifyContent:'space-between',alignItems:'center',
        background:'transparent',border:'none',cursor:'pointer'}}>
        <div style={{textAlign:'left'}}>
          <div style={{fontSize:10,fontFamily:'monospace',color:C.textSub,
            letterSpacing:'0.2em',marginBottom:3}}>⚖️ PAINEL DA VIDA</div>
          <div style={{fontSize:13,color:panelSummaryColor,fontWeight:600}}>{panelSummary}</div>
        </div>
        <span style={{fontSize:12,fontFamily:'monospace',color:C.gold,marginLeft:12}}>
          {panelOpen?'▲':'▼'}
        </span>
      </button>

      {/* conteúdo expandido — uma área ajustável por vez, sem microações inline */}
      {panelOpen&&<div style={{borderTop:`1px solid ${C.border}`,padding:'4px 0 8px'}}>
        {PANEL_AREAS.map(a=>{
          const lv=p[a.key];
          const isActive=activeArea===a.key;
          return <div key={a.key}>
            <button onClick={()=>toggleArea(a.key)} style={{width:'100%',padding:'12px 18px',
              display:'flex',justifyContent:'space-between',alignItems:'center',
              background:isActive?`${lvColor(lv)}0D`:'transparent',
              border:'none',cursor:'pointer'}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:15}}>{a.icon}</span>
                <span style={{fontSize:13,color:C.text}}>{a.label}</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <span style={{fontSize:13}}>{lvIcon(lv)}</span>
                <span style={{fontSize:10,fontFamily:'monospace',color:lvColor(lv),
                  letterSpacing:'0.04em'}}>{lvLabel(lv)}</span>
                <span style={{fontSize:10,color:C.textSub,marginLeft:4}}>{isActive?'▲':'▼'}</span>
              </div>
            </button>
            {isActive&&<div style={{padding:'4px 18px 14px',display:'flex',gap:8}}>
              {[1,2,3].map(lvl=>(
                <button key={lvl} onClick={()=>{
                    setState(s=>({...s,corrDone:false,panel:{...s.panel,[a.key]:lvl}}));
                    setActiveArea(null);
                  }}
                  style={{flex:1,padding:'8px 0',borderRadius:10,
                    border:`1px solid ${lv===lvl?lvColor(lvl)+'88':C.border}`,
                    background:lv===lvl?`${lvColor(lvl)}18`:'transparent',
                    color:lv===lvl?lvColor(lvl):C.textSub,
                    fontFamily:'monospace',fontSize:11,cursor:'pointer',fontWeight:lv===lvl?700:400}}>
                  {lvl===3?'🟢 Bem':lvl===2?'🟡 Atenção':'🔴 Crítico'}
                </button>
              ))}
            </div>}
          </div>;
        })}
      </div>}
    </div>

  </div>;
}

export default function App(){
  const [tab,setTab]=useState('hoje');
  const [toastMsg,setToastMsg]=useState(null);
  const toast=m=>{setToastMsg(m);setTimeout(()=>setToastMsg(null),2200);};

  const [state,setState]=useState({
    mission:null,
    action:null,
    opState:null,
    tiredChip:null,
    streak:0,
    flags:{missao:false,acao:false,fuga:false,eus:false,naoZerou:false},
    fixedEscapes:[],
    eus:{passado:'',presente:'',futuro:''},
    eusSaved:false,
    conversion:{consumidos:0,aplicados:0},
    panel:{fe:3,familia:3,saude:3,estudo:3,empresa:3},
    corrDone:false,
  });

  const tabs=[{id:'hoje',icon:'⚡',l:'HOJE'},{id:'identidade',icon:'📜',l:'IDENTIDADE'},{id:'evolucao',icon:'📈',l:'EVOLUÇÃO'}];
  const ti=tabs.find(t=>t.id===tab);

  const changeTab=(id)=>{
    if(id!=='hoje'&&state.opState==='trav'){
      setState(s=>({...s,opState:null}));
    }
    setTab(id);
  };

  return <div style={{fontFamily:'system-ui,sans-serif',background:C.bg,minHeight:'100vh',
    maxWidth:480,margin:'0 auto',display:'flex',flexDirection:'column',color:C.text,position:'relative'}}>
    <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{display:none}`}</style>
    <Toast msg={toastMsg}/>

    {/* HEADER */}
    <div style={{position:'sticky',top:0,zIndex:200,background:C.bg,borderBottom:`1px solid ${C.border}`,padding:'12px 20px'}}>
      <div style={{fontSize:9,fontFamily:'monospace',color:C.gold,letterSpacing:'0.25em',marginBottom:2}}>COMANDO CENTRAL</div>
      <div style={{fontSize:16,fontFamily:'Georgia,serif',color:C.text}}>{ti.icon} {ti.l} — {dateDisplay()}</div>
    </div>

    {/* CONTENT */}
    <div style={{flex:1,overflowY:'auto'}}>
      {tab==='hoje'&&<TabHoje state={state} setState={setState} toast={toast}/>}
      {tab==='identidade'&&<TabIdentidade state={state} setState={setState} toast={toast}/>}
      {tab==='evolucao'&&<TabEvolucao state={state} setState={setState} toast={toast}/>}
    </div>

    {/* NAV */}
    <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:480,
      background:C.bg,borderTop:`1px solid ${C.border}`,display:'flex',padding:'8px 0 20px',zIndex:100}}>
      {tabs.map(t=>{const a=tab===t.id;return <button key={t.id} onClick={()=>changeTab(t.id)}
        style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,background:'none',border:'none',cursor:'pointer',padding:'8px 4px'}}>
        <span style={{fontSize:a?22:18}}>{t.icon}</span>
        <span style={{fontSize:9,fontFamily:'monospace',fontWeight:700,letterSpacing:'0.05em',color:a?C.gold:C.textSub}}>{t.l}</span>
        {a&&<div style={{width:20,height:2,background:C.gold,borderRadius:1,marginTop:2}}/>}
      </button>;})}
    </div>
  </div>;
}
