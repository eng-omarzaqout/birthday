import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const ease = [0.22, 1, 0.36, 1]
const seeded = (index, salt = 0) => { const x = Math.sin(index * 91.7 + salt * 137.3) * 43758.5453; return x - Math.floor(x) }

function Background({ wishMode }) {
  const orbs = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ id: i, size: 180 + seeded(i, 1) * 360, x: seeded(i, 2) * 100, y: seeded(i, 3) * 100, duration: 12 + seeded(i, 4) * 12 })), [])
  return <div className="background" aria-hidden="true">
    <motion.div className="ambient-wash" animate={{ opacity: wishMode ? .25 : 1 }} transition={{ duration: 2 }} />
    {orbs.map(orb => <motion.span key={orb.id} className="orb" style={{ width: orb.size, height: orb.size, left: `${orb.x}%`, top: `${orb.y}%` }} animate={{ x: [0, 24, -12, 0], y: [0, -32, 18, 0], scale: [1, 1.06, .96, 1] }} transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut' }} />)}
    <div className="grain" />
  </div>
}

function LoadingScreen() {
  return <motion.div className="loader" exit={{ opacity: 0 }} transition={{ duration: .75, ease }}>
    <motion.div className="loader-mark" animate={{ scale: [1, 1.1, 1], opacity: [.65, 1, .65] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}><span>L</span></motion.div>
    <div className="loader-line"><motion.i initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.25, repeat: Infinity, ease }} /></div>
  </motion.div>
}

function GiftBox({ opening, onOpen }) {
  return <motion.button className="gift-button" aria-label="Open Leen's birthday gift" onClick={onOpen} disabled={opening}
    initial={{ opacity: 0, scale: .82, y: 30 }} animate={{ opacity: 1, scale: 1, y: opening ? 60 : [0, -11, 0] }}
    transition={opening ? { duration: 1.1, ease } : { opacity: { duration: 1 }, scale: { duration: 1, ease }, y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' } }}
    whileHover={!opening ? { scale: 1.035 } : undefined} whileTap={!opening ? { scale: .97 } : undefined}>
    <motion.div className="gift-glow" animate={{ opacity: opening ? [0, 1, .7] : [.25, .5, .25], scale: opening ? [0.5, 2.8, 3.4] : [1, 1.18, 1] }} transition={{ duration: opening ? 1.4 : 3, repeat: opening ? 0 : Infinity, ease }} />
    <div className="gift-shadow" />
    <div className="gift-box"><div className="box-face front"><span /></div><div className="box-face side" /><div className="box-face top" /></div>
    <motion.div className="gift-lid" animate={opening ? { y: -112, x: 24, rotate: 22, opacity: [1, 1, 0] } : { y: 0 }} transition={{ duration: 1.15, ease }}>
      <div className="lid-top" /><div className="lid-front"><span /></div><div className="lid-side" />
      <div className="bow"><div className="bow-loop left" /><div className="bow-knot" /><div className="bow-loop right" /></div>
    </motion.div>
  </motion.button>
}

function Confetti({ visible }) {
  const pieces = useMemo(() => Array.from({ length: 64 }, (_, i) => ({ id: i, x: (seeded(i, 1) - .5) * 760, y: -130 - seeded(i, 2) * 400, rotate: seeded(i, 3) * 720 - 360, delay: seeded(i, 4) * .25, color: i % 3 === 0 ? '#fff' : i % 3 === 1 ? '#9edcff' : '#dff5ff' })), [])
  return <AnimatePresence>{visible && <div className="confetti" aria-hidden="true">{pieces.map(p => <motion.i key={p.id} style={{ background: p.color }} initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0 }} animate={{ x: p.x, y: p.y, opacity: [0, 1, 1, 0], rotate: p.rotate, scale: [0, 1, 1] }} transition={{ duration: 1.65 + seeded(p.id, 5), delay: p.delay, ease }} />)}</div>}</AnimatePresence>
}

const messageLines = ['Welcome to Chapter 24.', 'May this year bring you happiness,', 'new adventures,', 'beautiful memories,', "and everything you've been hoping for.", 'Keep smiling.', 'Keep shining.', 'Keep being yourself.', 'Have an amazing birthday! 🤍']

function BirthdayMessage({ onWish }) {
  const container = { hidden: {}, show: { transition: { staggerChildren: .32, delayChildren: .25 } } }
  const line = { hidden: { opacity: 0, y: 18, filter: 'blur(8px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: .85, ease } } }
  return <motion.section className="message-card" variants={container} initial="hidden" animate="show">
    <motion.div className="eyebrow" variants={line}>A LITTLE CELEBRATION FOR LEEN</motion.div>
    <motion.h1 variants={line}><span>Happy Birthday,</span> Leen! <b>✦</b></motion.h1>
    <div className="message-copy">{messageLines.map((text, index) => <motion.p key={text} className={index === 0 || index >= 5 ? 'emphasis' : ''} variants={line}>{text}</motion.p>)}</div>
    <motion.p className="omar-dedication" variants={line}>From Omar, to his favorite person 🤍</motion.p>
    <motion.button className="wish-button" variants={line} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: .97 }} onClick={onWish}>Make a Wish <span>✦</span></motion.button>
  </motion.section>
}

function WishScene() {
  const particles = useMemo(() => Array.from({ length: 150 }, (_, i) => ({ id: i, x: seeded(i, 8) * 100, size: 1.5 + seeded(i, 9) * 4, duration: 4 + seeded(i, 10) * 7, delay: seeded(i, 11) * 5 })), [])
  return <motion.div className="wish-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.8 }}>
    <div className="particles" aria-hidden="true">{particles.map(p => <motion.i key={p.id} style={{ left: `${p.x}%`, width: p.size, height: p.size }} initial={{ y: '105vh', opacity: 0 }} animate={{ y: '-10vh', opacity: [0, .9, .65, 0], x: [0, seeded(p.id, 12) * 30 - 15, 0] }} transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }} />)}</div>
    <motion.div className="wish-content" initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1.3, delay: .55, ease }}>
      <motion.div className="wish-star" animate={{ scale: [1, 1.12, 1], rotate: [0, 4, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>✦</motion.div>
      <p>Close your eyes, Leen.</p><h2>May every wish you make<br />today come true.</h2><div className="heart">🤍</div>
    </motion.div>
  </motion.div>
}

function SoundButton({ muted, onToggle }) {
  return <motion.button className="sound-button" onClick={onToggle} aria-label={muted ? 'Turn music on' : 'Mute music'} whileTap={{ scale: .9 }}><span className={muted ? 'sound-bars muted' : 'sound-bars'}>{[0,1,2,3].map(i => <i key={i} />)}</span><span>{muted ? 'Sound off' : 'Sound on'}</span></motion.button>
}

function useAmbientSound() {
  const [muted, setMuted] = useState(true)
  const contextRef = useRef(null), gainRef = useRef(null)
  const start = useCallback(() => {
    if (!contextRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx(), master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination)
      ;[174.61, 220, 261.63, 329.63].forEach((frequency, i) => { const osc = ctx.createOscillator(), gain = ctx.createGain(); osc.type = i % 2 ? 'sine' : 'triangle'; osc.frequency.value = frequency; osc.detune.value = i * 3 - 4; gain.gain.value = .018 / (i + 1); osc.connect(gain).connect(master); osc.start() })
      contextRef.current = ctx; gainRef.current = master
    }
    contextRef.current?.resume()
  }, [])
  const toggle = useCallback(() => { start(); const next = !muted; setMuted(next); gainRef.current?.gain.setTargetAtTime(next ? 0 : .65, contextRef.current.currentTime, .8) }, [muted, start])
  const gentlyEnable = useCallback(() => { start(); setMuted(false); if (gainRef.current) gainRef.current.gain.setTargetAtTime(.65, contextRef.current.currentTime, 1.1) }, [start])
  useEffect(() => () => { contextRef.current?.close() }, [])
  return { muted, toggle, gentlyEnable }
}

export default function App() {
  const [loading, setLoading] = useState(true), [stage, setStage] = useState('gift'), [opening, setOpening] = useState(false)
  const { muted, toggle, gentlyEnable } = useAmbientSound()
  useEffect(() => { const timer = setTimeout(() => setLoading(false), 1650); return () => clearTimeout(timer) }, [])
  const openGift = () => { if (opening) return; setOpening(true); gentlyEnable(); setTimeout(() => setStage('message'), 1550) }
  return <main className={`${stage === 'wish' ? 'app wish-mode' : 'app'} antialiased`}>
    <Background wishMode={stage === 'wish'} /><AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
    {!loading && <><SoundButton muted={muted} onToggle={toggle} /><AnimatePresence mode="wait">
      {stage === 'gift' && <motion.section className="gift-screen" key="gift" exit={{ opacity: 0, scale: 1.06, filter: 'blur(14px)' }} transition={{ duration: 1, ease }}><motion.div className="gift-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}><span>FOR SOMEONE WONDERFUL</span><i /></motion.div><GiftBox opening={opening} onOpen={openGift} /><motion.p className="tap-copy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: opening ? 0 : 1, y: 0 }} transition={{ duration: .8, delay: .7 }}>Tap to open your gift.</motion.p><Confetti visible={opening} /></motion.section>}
      {stage === 'message' && <motion.div className="message-screen" key="message" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: .96, filter: 'blur(12px)' }} transition={{ duration: 1.2, ease }}><BirthdayMessage onWish={() => setStage('wish')} /></motion.div>}
      {stage === 'wish' && <WishScene key="wish" />}
    </AnimatePresence><div className="signature">CHAPTER • 24</div></>}
  </main>
}
