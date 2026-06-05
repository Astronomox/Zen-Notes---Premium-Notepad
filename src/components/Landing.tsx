import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import {
  Feather, ShieldCheck, Lock, Search, Pin, Target,
  Sparkles, ArrowRight, FileDown, Command,
} from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { RotatingWord } from './RotatingWord'
import { MiniNote } from './MiniNote'
import { DeskScene, CoffeeScene, PaperScene, WindowScene } from './Scenes'

interface LandingProps { onEnter: () => void }

export function Landing({ onEnter }: LandingProps) {
  return (
    <div className="relative bg-canvas text-fg overflow-x-hidden">
      <Aurora />
      <Nav onEnter={onEnter} />
      <Hero onEnter={onEnter} />
      <Express />
      <TryIt />
      <Showcase />
      <Features />
      <Security />
      <Closing onEnter={onEnter} />
      <Footer />
    </div>
  )
}

/* ---------------------------------------------------------------- */

function Aurora() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <motion.div
        className="absolute -top-40 left-1/4 w-[50rem] h-[50rem] rounded-full bg-accent/[0.10] blur-[150px]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 right-0 w-[40rem] h-[40rem] rounded-full bg-accent-strong/[0.08] blur-[130px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function Nav({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 backdrop-blur-md border-b border-line/70 bg-canvas/75"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid place-items-center w-8 h-8 rounded-lg bg-accent/12 border border-accent/25">
            <Feather size={17} className="text-accent-strong" />
          </div>
          <span className="font-serif text-lg font-semibold">Zen Notes</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={onEnter}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-lg bg-raised border border-line
              text-sm hover:border-accent/40 transition-colors"
          >
            Open app
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

function Hero({ onEnter }: { onEnter: () => void }) {
  const reveal = {
    hidden: { opacity: 0, y: 18 },
    show: (i: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.7, delay: i * 0.1, ease: [0.2, 0.6, 0.3, 1] as const },
    }),
  }

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-12 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <motion.div
          custom={0} variants={reveal} initial="hidden" animate="show"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-surface/70 text-xs text-muted mb-7"
        >
          <Sparkles size={12} className="text-accent" />
          Encrypted · distraction-free · yours alone
        </motion.div>

        <motion.h1
          custom={1} variants={reveal} initial="hidden" animate="show"
          className="font-serif font-feature-display text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight"
        >
          A calmer place
          <br />to <span className="text-accent-strong italic">write</span>.
        </motion.h1>

        <motion.p
          custom={2} variants={reveal} initial="hidden" animate="show"
          className="max-w-md mt-5 text-lg text-muted leading-relaxed"
        >
          A refined writing space with a focused editor, real end-to-end
          encryption, and nothing in your way. Built for the words that matter.
        </motion.p>

        <motion.div
          custom={3} variants={reveal} initial="hidden" animate="show"
          className="flex items-center gap-3 mt-8"
        >
          <button
            onClick={onEnter}
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-on-accent font-medium
              hover:bg-accent-strong active:scale-[0.98] transition-all shadow-glow"
          >
            Start writing
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <a href="#try" className="px-6 py-3 rounded-xl border border-line hover:border-accent/40 transition-colors">
            Try it below
          </a>
        </motion.div>
      </div>

      {/* Product mockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="absolute -inset-4 bg-accent/10 blur-3xl rounded-full" />
        <AppMockup />
      </motion.div>
    </section>
  )
}

function AppMockup() {
  return (
    <div className="relative rounded-2xl border border-line bg-surface shadow-lift overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 h-10 border-b border-line bg-raised/60">
        <span className="w-3 h-3 rounded-full bg-line" />
        <span className="w-3 h-3 rounded-full bg-line" />
        <span className="w-3 h-3 rounded-full bg-line" />
      </div>
      <div className="flex h-[320px]">
        <div className="w-1/3 border-r border-line bg-raised/40 p-3 space-y-2">
          {['Morning pages', 'Ideas', 'Reading list'].map((t, i) => (
            <div key={t} className={`rounded-lg px-2.5 py-2 text-xs ${i === 0 ? 'bg-surface border border-accent/30 text-fg' : 'text-muted'}`}>
              <div className="font-medium truncate">{t}</div>
              <div className="text-faint truncate text-[10px] mt-0.5">Updated today</div>
            </div>
          ))}
        </div>
        <div className="flex-1 p-5">
          <div className="font-serif text-xl font-semibold mb-3">Morning pages</div>
          <div className="space-y-2">
            <div className="h-2.5 rounded bg-line w-[90%]" />
            <div className="h-2.5 rounded bg-line w-[75%]" />
            <div className="h-2.5 rounded bg-line w-[82%]" />
            <div className="h-2.5 rounded bg-accent/30 w-[40%] mt-3" />
            <div className="h-2.5 rounded bg-line w-[68%]" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* --- Express yourself (rotating word) --- */
function Express() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
      <motion.span
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="text-xs uppercase tracking-[0.25em] text-accent"
      >
        The point of it all
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-serif text-4xl md:text-6xl font-semibold leading-tight mt-3"
      >
        Express yourself{' '}
        <span className="inline-block min-w-[3ch] text-left align-baseline">
          <RotatingWord />
        </span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-muted text-lg mt-5 max-w-lg mx-auto leading-relaxed"
      >
        However the words want to arrive. Zen Notes stays out of the way and
        lets them land.
      </motion.p>
    </section>
  )
}

/* --- Try it (live mini note) --- */
function TryIt() {
  return (
    <section id="try" className="relative z-10 max-w-3xl mx-auto px-6 py-16">
      <SectionHead
        kicker="No sign-up required"
        title="Try the editor right here"
        sub="This is the real thing, running in your browser. Type, format, and watch the word count move."
      />
      <div className="mt-10">
        <MiniNote />
      </div>
    </section>
  )
}

/* --- Image showcase (duotone) --- */
function Showcase() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
      <SectionHead kicker="Made for focus" title="A space that feels like yours" sub="Quiet by default. Warm by design. The kind of place you actually want to return to." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
        <Tile className="row-span-2 aspect-[3/4]"><DeskScene className="w-full h-full" /></Tile>
        <Tile className="aspect-[4/3]"><CoffeeScene className="w-full h-full" /></Tile>
        <Tile className="aspect-[4/3]"><PaperScene className="w-full h-full" /></Tile>
        <Tile className="lg:col-span-2 aspect-[16/9]"><WindowScene className="w-full h-full" /></Tile>
      </div>
    </section>
  )
}

function Tile({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl border border-line shadow-card overflow-hidden bg-raised ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* --- Features --- */
const FEATURES = [
  { icon: Lock, title: 'Real encryption', body: 'AES-256 with a key derived from your passphrase. Notes are unreadable without it.' },
  { icon: Search, title: 'Instant search', body: 'Find any note by title or content the moment you start typing. No indexing wait.' },
  { icon: Pin, title: 'Pin what matters', body: 'Keep the notes you return to at the top, always one glance away.' },
  { icon: Target, title: 'Word goals', body: 'Set a target per note and watch a quiet progress bar fill as you write.' },
  { icon: FileDown, title: 'Yours to keep', body: 'Everything lives on your device. No accounts, no lock-in, no surprises.' },
  { icon: Command, title: 'Keyboard first', body: 'New note, save, and format without lifting your hands from the keys.' },
]

function Features() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
      <SectionHead kicker="Everything you need" title="Powerful, never noisy" sub="Each feature earns its place. Nothing competes with your writing." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="group rounded-xl border border-line bg-surface p-6 shadow-card
              hover:border-accent/30 transition-colors"
          >
            <div className="grid place-items-center w-10 h-10 rounded-lg bg-accent/12 border border-accent/25 mb-4
              group-hover:scale-110 transition-transform">
              <f.icon size={19} className="text-accent-strong" />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-1.5">{f.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* --- Security spotlight --- */
function Security() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHead align="left" kicker="Privacy by design" title="Locked, even from us"
            sub="There is no server. There is no account. Your passphrase derives the only key that can decrypt your work, and it never leaves your machine." />
          <div className="flex flex-col gap-3 mt-8">
            {[
              'AES-256-GCM authenticated encryption',
              'PBKDF2 key derivation, 310,000 rounds',
              'Zero plaintext written when the vault is on',
            ].map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-sm"
              >
                <ShieldCheck size={17} className="text-accent shrink-0" />
                {line}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div style={{ y }} className="relative">
          <div className="relative rounded-2xl border border-line bg-surface p-10 shadow-card grid place-items-center aspect-square">
            <div className="absolute inset-0 grid place-items-center">
              <span className="absolute w-40 h-40 rounded-full border border-accent/25 animate-pulse-ring" />
              <span className="absolute w-40 h-40 rounded-full border border-accent/25 animate-pulse-ring [animation-delay:1.2s]" />
            </div>
            <div className="relative grid place-items-center w-24 h-24 rounded-2xl bg-accent/12 border border-accent/30 animate-float">
              <Lock size={40} className="text-accent-strong" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Closing({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
      >
        <h2 className="font-serif text-4xl md:text-5xl font-semibold leading-tight">
          Your next thought
          <br />deserves a quiet room.
        </h2>
        <button
          onClick={onEnter}
          className="group inline-flex items-center gap-2 mt-9 px-7 py-3.5 rounded-xl bg-accent text-on-accent font-medium
            hover:bg-accent-strong active:scale-[0.98] transition-all shadow-glow"
        >
          Open Zen Notes
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-line/70">
      <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-faint">
        <div className="flex items-center gap-2">
          <Feather size={14} className="text-accent/70" />
          <span className="font-serif">Zen Notes</span>
        </div>
        <span>Built for writers. Encrypted for everyone.</span>
      </div>
    </footer>
  )
}

function SectionHead({
  kicker, title, sub, align = 'center',
}: { kicker: string; title: string; sub: string; align?: 'center' | 'left' }) {
  const cls = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}
      className={`max-w-xl ${cls}`}
    >
      <span className="text-xs uppercase tracking-[0.2em] text-accent">{kicker}</span>
      <h2 className="font-serif text-3xl md:text-4xl font-semibold mt-2 leading-tight">{title}</h2>
      <p className="text-muted mt-3 leading-relaxed">{sub}</p>
    </motion.div>
  )
}
