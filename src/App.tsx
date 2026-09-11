import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { TypeAnimation } from 'react-type-animation';
import {
  FiCpu, FiShield, FiCloud, FiExternalLink,
  FiVolume2, FiVolumeX, FiCopy, FiCheck, FiMapPin, FiSearch,
  FiPhone, FiMail, FiShare2, FiActivity, FiGitBranch, FiLayers,
  FiPackage, FiTarget, FiZap, FiX, FiSend, FiMaximize2, FiCompass
} from 'react-icons/fi';
import {
  FaGithub, FaLinkedin, FaYoutube, FaTumblr, FaRedditAlien,
  FaSlack, FaAndroid, FaAtom, FaProjectDiagram, FaCertificate
} from 'react-icons/fa';

/* ═══════════════════════════════════════════════════════
   QUANTUM AUDIO SYNTHESIZER
   ═══════════════════════════════════════════════════════ */
const playQuantum = (type: 'collapse' | 'entangle' | 'tick' | 'burst' | 'observe') => {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'collapse') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.35);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now); osc.stop(now + 0.35);
    } else if (type === 'entangle') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.3);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.start(now); osc.stop(now + 0.32);
    } else if (type === 'tick') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(1800, now);
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now); osc.stop(now + 0.04);
    } else if (type === 'burst') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(1900, now + 0.22);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now); osc.stop(now + 0.3);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1320, now + 0.07);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now); osc.stop(now + 0.25);
    }
    osc.connect(gain); gain.connect(ctx.destination);
  } catch { /* pre-gesture restriction */ }
};

/* ═══════════════════════════════════════════════════════
   CASCADING DATA STREAM (MATRIX RAIN)
   ═══════════════════════════════════════════════════════ */
const MatrixRain = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    let raf = 0;
    let w = (cv.width = window.innerWidth);
    let h = (cv.height = window.innerHeight);

    const glyphs = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ01</>{}[]λΨΦΩ∑∆⧉⨂⟁';
    const fontSize = 14;
    let cols = Math.floor(w / fontSize);
    let drops = new Array(cols).fill(0).map(() => Math.random() * -80);
    let speeds = new Array(cols).fill(0).map(() => 0.35 + Math.random() * 0.55);

    const resize = () => {
      w = cv.width = window.innerWidth;
      h = cv.height = window.innerHeight;
      cols = Math.floor(w / fontSize);
      drops = new Array(cols).fill(0).map(() => Math.random() * -80);
      speeds = new Array(cols).fill(0).map(() => 0.35 + Math.random() * 0.55);
    };
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 3, 10, 0.09)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px 'IBM Plex Mono', monospace`;

      for (let i = 0; i < cols; i++) {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // leading glyph is bright
        ctx.fillStyle = 'rgba(190, 255, 226, 0.85)';
        ctx.fillText(ch, x, y);
        // trailing glyph dim green
        ctx.fillStyle = 'rgba(0, 255, 156, 0.28)';
        ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], x, y - fontSize);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.14)';
        ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], x, y - fontSize * 2);

        if (y > h && Math.random() > 0.985) drops[i] = Math.random() * -40;
        drops[i] += speeds[i];
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 z-0 pointer-events-none opacity-40" />;
};

/* ═══════════════════════════════════════════════════════
   FRACTAL CORE (RECURSIVE MANDALA + TREE)
   ═══════════════════════════════════════════════════════ */
const FractalCore = ({ size = 460 }: { size?: number }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    cv.width = size; cv.height = size;
    let raf = 0, t = 0;

    const branch = (len: number, depth: number, angle: number, hueShift: number) => {
      if (depth === 0 || len < 2) return;
      ctx.save();
      ctx.rotate(angle);
      const alpha = 0.06 + depth * 0.045;
      const grd = ctx.createLinearGradient(0, 0, 0, -len);
      grd.addColorStop(0, `hsla(${(150 + hueShift) % 360}, 100%, 60%, ${alpha})`);
      grd.addColorStop(1, `hsla(${(265 + hueShift) % 360}, 90%, 65%, ${alpha * 0.7})`);
      ctx.strokeStyle = grd;
      ctx.lineWidth = Math.max(0.4, depth * 0.42);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -len);
      ctx.stroke();

      // node dot at joint
      ctx.beginPath();
      ctx.arc(0, -len, Math.max(0.6, depth * 0.35), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(150 + hueShift) % 360}, 100%, 70%, ${alpha * 1.6})`;
      ctx.fill();

      ctx.translate(0, -len);
      const spread = 0.42 + Math.sin(t * 0.9) * 0.22;
      branch(len * 0.72, depth - 1, spread, hueShift + 12);
      branch(len * 0.72, depth - 1, -spread, hueShift + 12);
      ctx.restore();
    };

    const draw = () => {
      t += 0.006;
      ctx.clearRect(0, 0, size, size);
      const c = size / 2;

      // radial glow core
      const g = ctx.createRadialGradient(c, c, 0, c, c, size * 0.46);
      g.addColorStop(0, 'rgba(0,255,156,0.11)');
      g.addColorStop(0.45, 'rgba(34,211,238,0.05)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);

      // rotating orbital rings
      for (let r = 0; r < 3; r++) {
        ctx.beginPath();
        const rad = size * (0.2 + r * 0.09);
        const wobble = Math.sin(t * (1 + r * 0.4)) * 6;
        ctx.ellipse(c, c, rad + wobble, rad * (0.42 + r * 0.12), t * (r % 2 === 0 ? 1 : -1), 0, Math.PI * 2);
        ctx.strokeStyle = r === 0 ? 'rgba(0,255,156,0.22)' : r === 1 ? 'rgba(34,211,238,0.16)' : 'rgba(139,92,246,0.16)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // fractal mandala: 6 rotational symmetry arms
      const arms = 6;
      for (let a = 0; a < arms; a++) {
        ctx.save();
        ctx.translate(c, c);
        ctx.rotate((a / arms) * Math.PI * 2 + t * 0.35);
        branch(size * 0.15, 7, 0, a * 14 + t * 30);
        ctx.restore();
      }

      // center singularity
      ctx.beginPath();
      ctx.arc(c, c, 5 + Math.sin(t * 3) * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(190,255,226,0.9)';
      ctx.shadowColor = '#00ff9c';
      ctx.shadowBlur = 22;
      ctx.fill();
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return <canvas ref={ref} className="pointer-events-none" style={{ width: size, height: size }} />;
};

/* ═══════════════════════════════════════════════════════
   QUANTUM NODE GRAPH (16 PROJECTS AS ENTANGLED NODES)
   ═══════════════════════════════════════════════════════ */
interface GraphNode {
  id: number; label: string; icon: string; color: string;
  x: number; y: number; vx: number; vy: number; r: number;
}

const QuantumGraph = ({
  labels, activeId, onPick,
}: {
  labels: { id: number; label: string; icon: string; color: string }[];
  activeId: number | null;
  onPick: (id: number) => void;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const hoverRef = useRef<number | null>(null);
  const activeRef = useRef<number | null>(activeId);

  useEffect(() => { activeRef.current = activeId; }, [activeId]);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    let raf = 0, t = 0;

    const sizeCanvas = () => {
      const p = cv.parentElement;
      cv.width = p?.clientWidth || 900;
      cv.height = p?.clientHeight || 520;
    };
    sizeCanvas();

    // seed node positions in a golden-angle spiral
    nodesRef.current = labels.map((l, i) => {
      const ang = i * 2.399963;
      const rad = Math.min(cv.width, cv.height) * 0.34 * Math.sqrt((i + 1) / labels.length);
      return {
        id: l.id, label: l.label, icon: l.icon, color: l.color,
        x: cv.width / 2 + Math.cos(ang) * rad,
        y: cv.height / 2 + Math.sin(ang) * rad,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 14,
      };
    });

    const onResize = () => { sizeCanvas(); };
    const onMove = (e: MouseEvent) => {
      const rect = cv.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      let found: number | null = null;
      nodesRef.current.forEach(n => {
        if (Math.hypot(n.x - mouseRef.current.x, n.y - mouseRef.current.y) < n.r + 10) found = n.id;
      });
      hoverRef.current = found;
      cv.style.cursor = found ? 'pointer' : 'default';
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; hoverRef.current = null; };
    const onClick = () => { if (hoverRef.current !== null) onPick(hoverRef.current); };

    window.addEventListener('resize', onResize);
    cv.addEventListener('mousemove', onMove);
    cv.addEventListener('mouseleave', onLeave);
    cv.addEventListener('click', onClick);

    const draw = () => {
      t += 0.01;
      const w = cv.width, h = cv.height;
      ctx.clearRect(0, 0, w, h);
      const nodes = nodesRef.current;
      const cx = w / 2, cy = h / 2;

      // physics: gentle orbit + separation + centering
      nodes.forEach((n, i) => {
        // centering spring
        n.vx += (cx - n.x) * 0.00035;
        n.vy += (cy - n.y) * 0.00035;
        // orbital swirl
        const dx = n.x - cx, dy = n.y - cy;
        n.vx += -dy * 0.00016;
        n.vy += dx * 0.00016;
        // separation
        nodes.forEach((m, j) => {
          if (i === j) return;
          const ddx = n.x - m.x, ddy = n.y - m.y;
          const d = Math.hypot(ddx, ddy) || 1;
          if (d < 86) { n.vx += (ddx / d) * 0.055; n.vy += (ddy / d) * 0.055; }
        });
        // mouse repel
        const mdx = n.x - mouseRef.current.x, mdy = n.y - mouseRef.current.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 120) { n.vx += (mdx / (md || 1)) * 0.25; n.vy += (mdy / (md || 1)) * 0.25; }

        n.vx *= 0.94; n.vy *= 0.94;
        n.x += n.vx; n.y += n.vy;
        n.x = Math.max(40, Math.min(w - 40, n.x));
        n.y = Math.max(34, Math.min(h - 34, n.y));
      });

      // entanglement edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 190) {
            const involved = activeRef.current === a.id || activeRef.current === b.id ||
                             hoverRef.current === a.id || hoverRef.current === b.id;
            const base = (1 - d / 190);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = involved
              ? `rgba(0,255,156,${0.28 + base * 0.5})`
              : `rgba(34,211,238,${base * 0.16})`;
            ctx.lineWidth = involved ? 1.4 : 0.6;
            ctx.stroke();

            // travelling data packet along the edge
            const prog = ((t * 0.55 + (i * 7 + j * 3) * 0.11) % 1);
            const px = a.x + (b.x - a.x) * prog;
            const py = a.y + (b.y - a.y) * prog;
            ctx.beginPath();
            ctx.arc(px, py, involved ? 2.2 : 1.2, 0, Math.PI * 2);
            ctx.fillStyle = involved ? 'rgba(190,255,226,0.95)' : `rgba(0,255,156,${base * 0.5})`;
            ctx.fill();
          }
        }
      }

      // nodes
      nodes.forEach(n => {
        const isActive = activeRef.current === n.id;
        const isHover = hoverRef.current === n.id;
        const pulse = 1 + Math.sin(t * 2.4 + n.id) * 0.09;
        const R = n.r * pulse * (isActive ? 1.5 : isHover ? 1.28 : 1);

        // probability halo
        ctx.beginPath();
        ctx.arc(n.x, n.y, R * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? 'rgba(0,255,156,0.13)' : 'rgba(34,211,238,0.05)';
        ctx.fill();

        // orbit ring
        ctx.beginPath();
        ctx.ellipse(n.x, n.y, R * 1.85, R * 0.7, t * (n.id % 2 ? 1 : -1) * 0.9, 0, Math.PI * 2);
        ctx.strokeStyle = isActive ? 'rgba(0,255,156,0.65)' : 'rgba(139,92,246,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // core
        ctx.beginPath();
        ctx.arc(n.x, n.y, R, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? '#bfffe2' : n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = isActive ? 26 : isHover ? 18 : 9;
        ctx.fill();
        ctx.shadowBlur = 0;

        // id ring text
        ctx.font = '600 10px "IBM Plex Mono", monospace';
        ctx.fillStyle = '#02030a';
        ctx.textAlign = 'center';
        ctx.fillText(String(n.id).padStart(2, '0'), n.x, n.y + 3.5);

        // label
        if (isHover || isActive) {
          ctx.font = '600 12px "Space Grotesk", sans-serif';
          const label = `${n.icon} ${n.label}`;
          const tw = ctx.measureText(label).width;
          ctx.fillStyle = 'rgba(2,3,10,0.9)';
          ctx.fillRect(n.x - tw / 2 - 8, n.y - R - 30, tw + 16, 20);
          ctx.strokeStyle = 'rgba(0,255,156,0.6)';
          ctx.lineWidth = 1;
          ctx.strokeRect(n.x - tw / 2 - 8, n.y - R - 30, tw + 16, 20);
          ctx.fillStyle = '#bfffe2';
          ctx.fillText(label, n.x, n.y - R - 16);
        }
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      cv.removeEventListener('mousemove', onMove);
      cv.removeEventListener('mouseleave', onLeave);
      cv.removeEventListener('click', onClick);
    };
  }, [labels, onPick]);

  return (
    <div className="relative w-full h-[440px] sm:h-[560px]">
      <canvas ref={ref} className="w-full h-full block" />
      <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-[11px] font-plex text-emerald-300/70 pointer-events-none">
        <span>⧉ ENTANGLEMENT LATTICE // HOVER TO OBSERVE · CLICK TO COLLAPSE WAVEFUNCTION</span>
        <span>COHERENCE: 99.4% · 16 QUBIT NODES</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   AI ORB — PARTICLE BURST VISUALIZER
   ═══════════════════════════════════════════════════════ */
interface Burst { x: number; y: number; vx: number; vy: number; life: number; max: number; hue: number; size: number; }

const OrbCanvas = ({ trigger }: { trigger: number }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const partsRef = useRef<Burst[]>([]);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const cx = cv.width / 2, cy = cv.height / 2;
    for (let i = 0; i < 90; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 0.7 + Math.random() * 3.4;
      partsRef.current.push({
        x: cx, y: cy,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 0, max: 40 + Math.random() * 45,
        hue: [150, 190, 265, 300][Math.floor(Math.random() * 4)],
        size: 0.8 + Math.random() * 2.1,
      });
    }
  }, [trigger]);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    cv.width = 260; cv.height = 130;
    let raf = 0, t = 0;

    const draw = () => {
      t += 0.02;
      ctx.clearRect(0, 0, cv.width, cv.height);
      const cx = cv.width / 2, cy = cv.height / 2;

      // ambient orbiting electrons
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, 40 + i * 9, 14 + i * 5, t * (i % 2 ? 1 : -1) * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = ['rgba(0,255,156,0.28)', 'rgba(34,211,238,0.22)', 'rgba(139,92,246,0.22)'][i];
        ctx.lineWidth = 1;
        ctx.stroke();
        const ang = t * (1.2 + i * 0.5);
        const ex = cx + Math.cos(ang) * (40 + i * 9) * Math.cos(t * (i % 2 ? 1 : -1) * 0.8) - Math.sin(ang) * (14 + i * 5) * Math.sin(t * (i % 2 ? 1 : -1) * 0.8);
        const ey = cy + Math.cos(ang) * (40 + i * 9) * Math.sin(t * (i % 2 ? 1 : -1) * 0.8) + Math.sin(ang) * (14 + i * 5) * Math.cos(t * (i % 2 ? 1 : -1) * 0.8);
        ctx.beginPath(); ctx.arc(ex, ey, 2, 0, Math.PI * 2);
        ctx.fillStyle = ['#00ff9c', '#22d3ee', '#8b5cf6'][i]; ctx.fill();
      }

      // core
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26);
      g.addColorStop(0, 'rgba(190,255,226,0.9)');
      g.addColorStop(0.4, 'rgba(0,255,156,0.35)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.fill();

      // bursts
      partsRef.current = partsRef.current.filter(p => p.life < p.max);
      partsRef.current.forEach(p => {
        p.life++;
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.965; p.vy *= 0.965;
        const a = 1 - p.life / p.max;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,68%,${a * 0.9})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="w-full h-[130px] block" />;
};

/* ═══════════════════════════════════════════════════════
   PROJECT NODE MODEL
   ═══════════════════════════════════════════════════════ */
interface QNode {
  id: number; qid: string; title: string; domain: string; icon: string; color: string;
  state: string; coherence: string; entangledWith: string[];
  summary: string;
  layers: { observation: string; superposition: string; ground: string };
  stack: string[];
  metrics: string;
  url: string;
}

export default function App() {
  const [muted, setMuted] = useState(false);
  const [selected, setSelected] = useState<QNode | null>(null);
  const snd = useCallback((t: 'collapse' | 'entangle' | 'tick' | 'burst' | 'observe') => {
    if (!muted) playQuantum(t);
  }, [muted]);

  // live quantum telemetry
  const [coherence, setCoherence] = useState(99.4);
  useEffect(() => {
    const i = setInterval(() => setCoherence(+(99.1 + Math.random() * 0.8).toFixed(2)), 1600);
    return () => clearInterval(i);
  }, []);

  /* ── 16 QUANTUM PROJECT NODES ── */
  const nodes: QNode[] = useMemo(() => [
    { id: 1, qid: 'Q-NODE-01', title: 'Social Dashboard', domain: 'Telemetry Analytics', icon: '📱', color: '#00ff9c',
      state: '|ψ⟩ COHERENT', coherence: '99.95%', entangledWith: ['Q-03', 'Q-07'],
      summary: 'Real-time social telemetry analyzer with multi-account live state streams, engagement reporting, and reactive metric graphs.',
      layers: { observation: 'Jetpack Compose reactive surface — StateFlow collectors render at 120Hz with zero recomposition leaks.', superposition: 'MVI intent reducer holds all possible UI states simultaneously until user action collapses to one.', ground: 'Room DB single-source-of-truth entangled with WebSocket remote stream via Flow operators.' },
      stack: ['Kotlin', 'Compose', 'MVI', 'Flow', 'WebSocket', 'Room'],
      metrics: '50,000+ MAU · 99.95% uptime', url: 'https://github.com/moekyawaung-tech/social-dashboard' },
    { id: 2, qid: 'Q-NODE-02', title: 'PWA App', domain: 'Offline Field Theory', icon: '🌐', color: '#22d3ee',
      state: '|ψ⟩ STABLE', coherence: '100%', entangledWith: ['Q-14'],
      summary: 'Progressive Web App with total offline caching, background sync and instant installability across all devices.',
      layers: { observation: 'Installable app shell rendered instantly from cache — zero white-flash boot.', superposition: 'Stale-while-revalidate: cached and fresh states coexist until network resolves.', ground: 'IndexedDB persistent vault + Service Worker interception layer.' },
      stack: ['TypeScript', 'Service Workers', 'IndexedDB', 'Cache API', 'Vite'],
      metrics: '120,000+ installs · 0ms offline latency', url: 'https://github.com/moekyawaung-tech/pwa-app' },
    { id: 3, qid: 'Q-NODE-03', title: 'Admin Dashboard', domain: 'Enterprise Control', icon: '📊', color: '#8b5cf6',
      state: '|ψ⟩ SECURED', coherence: '99.99%', entangledWith: ['Q-01', 'Q-09'],
      summary: 'Mission-control analytics interface with role-based ACL, audit streams, real-time alerts and deep drill-down.',
      layers: { observation: 'Multi-pane tactical dashboard with permission-aware widget rendering.', superposition: 'RBAC policy evaluation resolves user capability sets at runtime.', ground: 'Multi-module data federation across :core:auth, :core:network, :core:database.' },
      stack: ['Multi-Module', 'Hilt', 'Paging 3', 'REST', 'RBAC'],
      metrics: '35+ enterprise nodes · zero breaches', url: 'https://github.com/moekyawaung-tech/Advance-POS-Version' },
    { id: 4, qid: 'Q-NODE-04', title: 'Stock Market Tracker', domain: 'Quantitative Flux', icon: '📈', color: '#fbbf24',
      state: '|ψ⟩ OSCILLATING', coherence: '99.8%', entangledWith: ['Q-13'],
      summary: 'High-frequency market tracker with candlestick visualizers, order-book depth and alert triggers.',
      layers: { observation: 'Hardware-accelerated Canvas candlestick renderer at locked 60fps.', superposition: 'Conflated channel buffer keeps only the newest tick — older states decohere.', ground: 'Reconnecting WebSocket transport with exponential backoff.' },
      stack: ['StateFlow', 'WebSocket', 'Canvas', 'Coroutines'],
      metrics: '10K+ watchlists · 200ms tick latency', url: 'https://github.com/moekyawaung-tech/crypto' },
    { id: 5, qid: 'Q-NODE-05', title: 'Game Collection', domain: 'Simulation Lattice', icon: '🎮', color: '#f472b6',
      state: '|ψ⟩ LOOPED', coherence: '100%', entangledWith: ['Q-06'],
      summary: 'Multi-game engine with Snake, Space Arcade and Canvas physics simulations plus synthesized audio channels.',
      layers: { observation: 'Canvas 2D viewport with sprite batching and particle FX.', superposition: 'Fixed time-step accumulator decouples physics from render frames.', ground: 'Web Audio oscillator rig + persistent high-score ledger.' },
      stack: ['Canvas 2D', 'Web Audio', 'Game Loop', 'LocalStorage'],
      metrics: '85K+ sessions · 60 FPS locked', url: 'https://github.com/moekyawaung-tech/game-collection' },
    { id: 6, qid: 'Q-NODE-06', title: 'Music Player', domain: 'Waveform DSP', icon: '🎵', color: '#22d3ee',
      state: '|ψ⟩ RESONANT', coherence: '99.9%', entangledWith: ['Q-05', 'Q-15'],
      summary: 'Spectral music player with FFT analyzer, playlist state machine and spatial audio DSP.',
      layers: { observation: 'Real-time FFT spectrum bars driven by AnalyserNode.', superposition: 'Audio node graph routes signal through parallel filter branches.', ground: 'Chunked IndexedDB audio cache + MediaSession hardware binding.' },
      stack: ['Web Audio API', 'AnalyserNode', 'MediaSession', 'ExoPlayer'],
      metrics: '40K+ streams · sub-10ms latency', url: 'https://github.com/moekyawaung-tech/video-player' },
    { id: 7, qid: 'Q-NODE-07', title: 'Chat App', domain: 'Entangled Comms', icon: '💬', color: '#00ff9c',
      state: '|ψ⟩ ENTANGLED', coherence: '99.98%', entangledWith: ['Q-01', 'Q-03'],
      summary: 'Real-time socket messenger with presence, typing indicators, E2E encryption and offline message queue.',
      layers: { observation: 'Compose chat stream with optimistic message insertion.', superposition: 'Unsent messages exist in local queue until network observation delivers them.', ground: 'Signal-style double-ratchet crypto core over Room-backed ledger.' },
      stack: ['Socket.IO', 'Room', 'AES-256 GCM', 'Coroutines'],
      metrics: '1M+ messages relayed · E2EE enforced', url: 'https://github.com/moekyawaung-tech/pwa-app' },
    { id: 8, qid: 'Q-NODE-08', title: 'World Cup Portal', domain: 'Event Horizon', icon: '⚽', color: '#fbbf24',
      state: '|ψ⟩ STREAMING', coherence: '99.99%', entangledWith: ['Q-12'],
      summary: 'Tournament orchestrator with live bracket computation, match telemetry and stadium geolocation.',
      layers: { observation: 'Animated bracket graph recomputed on each score event.', superposition: 'Server-Sent Event stream demultiplexes concurrent match states.', ground: 'Fixture database with edge-cached CDN delivery.' },
      stack: ['SSE', 'Geolocation', 'Dynamic Theming', 'IndexedDB'],
      metrics: '60K+ trackers · sub-100ms notify', url: 'https://github.com/moekyawaung-tech/thailand-travel' },
    { id: 9, qid: 'Q-NODE-09', title: 'E-Commerce Suite', domain: 'Commerce Field', icon: '🛒', color: '#f97316',
      state: '|ψ⟩ TRANSACTING', coherence: '99.99%', entangledWith: ['Q-03', 'Q-11'],
      summary: 'Full retail checkout with instant inventory deduction, cart sync, receipt printing and payment gateways.',
      layers: { observation: 'Optimistic cart UI updates before server confirmation.', superposition: 'Event-sourced cart reducer replays mutations deterministically.', ground: 'Idempotency-keyed payment bridge with offline persistence.' },
      stack: ['Redux Pattern', 'Stripe SDK', 'Room', 'Retrofit'],
      metrics: '$2.4M GMV · 99.9% checkout success', url: 'https://github.com/moekyawaung-tech/POS-Full-Version' },
    { id: 10, qid: 'Q-NODE-10', title: 'Portfolio Hub', domain: 'Meta Observer', icon: '💼', color: '#8b5cf6',
      state: '|ψ⟩ SELF-AWARE', coherence: '100%', entangledWith: ['Q-16'],
      summary: 'This very quantum interface — fractal cores, entanglement lattice and particle-burst AI orb.',
      layers: { observation: 'Canvas fractal mandala + matrix rain rendered at 60fps.', superposition: 'Node graph physics simulates all project relationships simultaneously.', ground: 'React 19 + TypeScript + Vite single-file build pipeline.' },
      stack: ['React 19', 'TypeScript', 'Canvas 2D', 'Tailwind', 'Web Audio'],
      metrics: '100K+ views · Lighthouse 100', url: 'https://github.com/Dev-moe-kyawaung/' },
    { id: 11, qid: 'Q-NODE-11', title: 'Money Tracker', domain: 'Encrypted Vault', icon: '💰', color: '#00ff9c',
      state: '|ψ⟩ SEALED', coherence: '100%', entangledWith: ['Q-09'],
      summary: 'Dual-currency ledger with budget thresholds, visual categorization and secure CSV/PDF export.',
      layers: { observation: 'Biometric gate must be satisfied before any state is observable.', superposition: 'Multi-currency conversion holds MMK/THB values in parallel.', ground: 'SQLCipher AES-256 encrypted database at rest.' },
      stack: ['Room', 'SQLCipher', 'BiometricPrompt', 'Charts'],
      metrics: '25K+ ledgers · zero network permission', url: 'https://github.com/moekyawaung-tech/Daily-planner-app' },
    { id: 12, qid: 'Q-NODE-12', title: 'Weather Radar', domain: 'Atmospheric Field', icon: '🌤️', color: '#22d3ee',
      state: '|ψ⟩ SCANNING', coherence: '99.9%', entangledWith: ['Q-08'],
      summary: 'Atmospheric forecaster with OpenWeather telemetry, animated particle rain and severe-weather warnings.',
      layers: { observation: 'Canvas particle precipitation shader reacting to live conditions.', superposition: 'Forecast probability distributions rendered as confidence bands.', ground: 'GPS fused-location provider + certificate-pinned REST ingest.' },
      stack: ['REST API', 'Canvas Shaders', 'FusedLocation', 'Retrofit'],
      metrics: '75K+ forecast polls · live alerts', url: 'https://github.com/moekyawaung-tech/Weather-app' },
    { id: 13, qid: 'Q-NODE-13', title: 'Crypto Vault', domain: 'Distributed Ledger', icon: '💸', color: '#8b5cf6',
      state: '|ψ⟩ CONSENSUS', coherence: '99.99%', entangledWith: ['Q-04', 'Q-11'],
      summary: 'Non-custodial wallet visualizer tracking gas fluctuations, multi-chain balances and contract audits.',
      layers: { observation: 'Multi-chain portfolio surface with live gas gauges.', superposition: 'Fallback RPC providers query in parallel; fastest response wins.', ground: 'Hardware TEE keystore — private keys never leave secure enclave.' },
      stack: ['Ethers.js', 'FallbackProvider', 'Keystore TEE', 'Web3'],
      metrics: '15K+ wallets · zero key compromises', url: 'https://github.com/moekyawaung-tech/crypto' },
    { id: 14, qid: 'Q-NODE-14', title: 'JS Todo Master', domain: 'Task Quanta', icon: '📝', color: '#f472b6',
      state: '|ψ⟩ DISCRETE', coherence: '100%', entangledWith: ['Q-02'],
      summary: 'Keyboard-driven task organizer with IndexedDB persistence, tag categories and drag-drop hierarchy.',
      layers: { observation: 'Zero-latency keyboard-first input grid.', superposition: 'Drag ghost preview shows target ordering before commit.', ground: 'Raw IndexedDB transactions — zero framework dependencies.' },
      stack: ['Vanilla JS', 'IndexedDB', 'Drag & Drop API', 'Web Audio'],
      metrics: '30K+ tasks · sub-5ms input', url: 'https://github.com/moekyawaung-tech/javascript-todo' },
    { id: 15, qid: 'Q-NODE-15', title: 'Video Player Pro', domain: 'Photon Pipeline', icon: '🎯', color: '#fbbf24',
      state: '|ψ⟩ DECODING', coherence: '99.95%', entangledWith: ['Q-06'],
      summary: 'Hardware-accelerated gesture player with PiP, track selection, subtitle parser and volume scrub.',
      layers: { observation: 'Multi-touch gesture surface: brightness, volume and seek zones.', superposition: 'Adaptive bitrate ladder selects quality from parallel renditions.', ground: 'MediaCodec hardware decode pipeline with Widevine support.' },
      stack: ['ExoPlayer', 'Media3', 'MediaCodec', 'Compose Gestures'],
      metrics: '200K+ sessions · zero dropped frames', url: 'https://github.com/moekyawaung-tech/video-player' },
    { id: 16, qid: 'Q-NODE-16', title: 'PulseSync — LEGEND!', domain: 'Singularity Core', icon: '🔥', color: '#00ff9c',
      state: '|ψ⟩ FLAGSHIP', coherence: '99.99%', entangledWith: ['Q-01', 'Q-07', 'Q-10'],
      summary: 'Flagship multi-module Android platform: Compose UI, Hilt DI, Firebase cluster, offline-first Room and full CI/CD.',
      layers: { observation: '100% Jetpack Compose with unidirectional data flow and Material 3.', superposition: '80+ Gradle modules compile in parallel; feature flags hold variants in superposition.', ground: 'Offline-first Room + Firebase realtime sync + GitHub Actions release pipeline.' },
      stack: ['Kotlin 2.0', 'Compose', 'Hilt', 'Firebase', 'Room', 'GitHub Actions'],
      metrics: '1M+ downloads · 50K+ MAU · 4.8★', url: 'https://github.com/Dev-moe-kyawaung/pulsesync-android' },
  ], []);

  const graphLabels = useMemo(
    () => nodes.map(n => ({ id: n.id, label: n.title, icon: n.icon, color: n.color })),
    [nodes]
  );

  const pickNode = useCallback((id: number) => {
    snd('collapse');
    const n = nodes.find(x => x.id === id);
    if (n) setSelected(n);
  }, [nodes, snd]);

  /* ── AI ORB STATE ── */
  const [orbOpen, setOrbOpen] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [orbInput, setOrbInput] = useState('');
  const [orbLog, setOrbLog] = useState<Array<{ from: 'ai' | 'user'; text: string; graph?: string[] }>>([
    { from: 'ai', text: '⧉ QUBIT-9 ONLINE. I am the architecture observer for Moe Kyaw Aung. Probe any decision vector and I will collapse it into a visualized reasoning chain.', graph: ['OBSERVER READY', 'LATTICE COHERENT', '16 NODES ENTANGLED'] },
  ]);

  const decisionVectors: Record<string, { text: string; graph: string[] }> = {
    modular: {
      text: 'DECISION VECTOR — MODULARIZATION: Moe partitions apps into :app, :feature:*, and :core:* modules. The domain layer carries zero Android dependencies, so business logic compiles and tests on the pure JVM in milliseconds. Gradle parallelizes 80+ modules, holding cold builds under 45 seconds.',
      graph: ['INPUT: MONOLITH RISK', 'SPLIT :core / :feature / :domain', 'ZERO ANDROID DEPS IN DOMAIN', 'PARALLEL GRADLE COMPILE', 'RESULT: <45s COLD BUILD'],
    },
    di: {
      text: 'DECISION VECTOR — DEPENDENCY INJECTION: Hilt/Dagger resolves the object graph at compile time, eliminating runtime lookup failures. Scoping (@Singleton, @ViewModelScoped) bounds each dependency lifetime, and assisted factories restore state across process death.',
      graph: ['INPUT: MANUAL WIRING', 'HILT COMPILE-TIME GRAPH', 'SCOPE LIFETIMES', 'ASSISTED FACTORIES', 'RESULT: ZERO RUNTIME DI CRASHES'],
    },
    offline: {
      text: 'DECISION VECTOR — OFFLINE-FIRST: Room DB is the single source of truth. Writes land locally first and emit optimistically; WorkManager queues the remote sync under network constraints. In Myanmar\'s intermittent coverage this yields perceived-zero downtime.',
      graph: ['INPUT: UNSTABLE NETWORK', 'WRITE → ROOM DB FIRST', 'OPTIMISTIC UI EMIT', 'WORKMANAGER SYNC QUEUE', 'RESULT: 100% OFFLINE USABILITY'],
    },
    cicd: {
      text: 'DECISION VECTOR — CI/CD: GitHub Actions runs detekt + ktlint, then a parallel unit matrix with MockK and Turbine gated at 90% Jacoco coverage, then headless emulator screenshot regression, then Fastlane signs and stages the AAB to Play.',
      graph: ['PUSH → MAIN', 'DETEKT + KTLINT', 'UNIT MATRIX (90% GATE)', 'EMULATOR SCREENSHOT DIFF', 'FASTLANE SIGN → PLAY TRACK'],
    },
    security: {
      text: 'DECISION VECTOR — SECURITY: Sensitive state lives in EncryptedSharedPreferences backed by the Android Keystore (AES-256 GCM). Transport uses TLS 1.3 with SHA-256 certificate pinning, and sessions gate behind BiometricPrompt.',
      graph: ['THREAT MODEL', 'KEYSTORE AES-256 GCM', 'CERT PINNING + TLS 1.3', 'BIOMETRIC SESSION GATE', 'RESULT: OWASP MASVS ALIGNED'],
    },
    scale: {
      text: 'DECISION VECTOR — SCALABILITY: Memory budgeting for 2GB tier-3 devices, lazy Compose layouts, bitmap recycling and baseline profiles. The result serves 1M+ downloads at a 99.99% crash-free rate.',
      graph: ['TARGET: 2GB RAM DEVICES', 'LAZY COMPOSE LAYOUTS', 'BITMAP RECYCLE + BASELINE PROFILE', 'STRICTMODE LEAK AUDIT', 'RESULT: 99.99% CRASH-FREE'],
    },
    startup: {
      text: 'DECISION VECTOR — FOUNDER TRACK: Moe ships as a technical founder — MoekyawTranslator (on-device AI), the POS ERP suite (dual MMK/THB offline reconciliation) and Job-Portal. Combined: 1M+ downloads and 50K+ monthly actives.',
      graph: ['MVP HYPOTHESIS', 'ON-DEVICE AI (COST → 0)', 'DUAL-CURRENCY OFFLINE POS', 'REGIONAL LOCALIZATION', 'RESULT: 1M+ INSTALLS'],
    },
    contact: {
      text: 'DECISION VECTOR — CHANNEL: Hotlines +95 9 889 000 889 / +959 666 000 050. Primary inbox moekyawaung@programmer.net. Status: open to senior mobile architect and technical co-founder roles.',
      graph: ['OBSERVER REQUEST', 'HOTLINE CHANNEL OPEN', 'INBOX: programmer.net', 'STATUS: AVAILABLE'],
    },
  };

  const probeOrb = (preset?: string) => {
    const q = (preset ?? orbInput).trim();
    if (!q) return;
    snd('burst');
    setBurstKey(k => k + 1);
    setOrbLog(p => [...p, { from: 'user', text: q }]);
    setOrbInput('');

    const l = q.toLowerCase();
    let hit = decisionVectors.modular;
    if (l.includes('inject') || l.includes('hilt') || l.includes('dagger') || l.includes(' di')) hit = decisionVectors.di;
    else if (l.includes('offline') || l.includes('sync') || l.includes('room')) hit = decisionVectors.offline;
    else if (l.includes('ci') || l.includes('pipeline') || l.includes('deploy') || l.includes('test')) hit = decisionVectors.cicd;
    else if (l.includes('secur') || l.includes('encrypt') || l.includes('auth')) hit = decisionVectors.security;
    else if (l.includes('scale') || l.includes('perform') || l.includes('memory')) hit = decisionVectors.scale;
    else if (l.includes('startup') || l.includes('founder') || l.includes('growth') || l.includes('metric')) hit = decisionVectors.startup;
    else if (l.includes('contact') || l.includes('hire') || l.includes('email') || l.includes('phone')) hit = decisionVectors.contact;
    else if (l.includes('modul') || l.includes('arch') || l.includes('clean')) hit = decisionVectors.modular;

    setTimeout(() => {
      snd('observe');
      setBurstKey(k => k + 1);
      setOrbLog(p => [...p, { from: 'ai', text: hit.text, graph: hit.graph }]);
    }, 480);
  };

  /* ── DATASETS ── */
  const architecture = [
    { icon: <FiLayers />, title: 'MODULARIZATION', tag: 'ISOLATION', desc: 'Feature/domain/data separation with sealed contracts. Domain layer is pure Kotlin — zero Android imports.', c: 'text-emerald-400' },
    { icon: <FiPackage />, title: 'MULTI-MODULE', tag: '80+ MODULES', desc: 'Version catalogs, build cache and dynamic features keep cold compile under 45 seconds at scale.', c: 'text-cyan-400' },
    { icon: <FiZap />, title: 'DEPENDENCY INJECTION', tag: 'HILT / DAGGER', desc: 'Compile-time verified object graph, scoped lifetimes and assisted factories for state restoration.', c: 'text-violet-400' },
    { icon: <FiGitBranch />, title: 'CI/CD PIPELINE', tag: 'ZERO-TOUCH', desc: 'GitHub Actions + Fastlane: lint, 90% coverage gate, emulator screenshot diff, signed staged rollout.', c: 'text-amber-400' },
    { icon: <FiTarget />, title: 'TESTING STRATEGY', tag: '90%+ COVERAGE', desc: 'MockK + Turbine for Flows, in-memory Room integration tests, ComposeTestRule UI assertions.', c: 'text-pink-400' },
    { icon: <FiShield />, title: 'SECURITY WARDS', tag: 'AES-256 GCM', desc: 'Keystore-backed encryption, TLS 1.3 certificate pinning, biometric gates and root tamper detection.', c: 'text-rose-400' },
  ];

  const certs = [
    { n: 'C Programming Core', c: 'Programming', id: '1720080366600', d: 'Jul 4, 2024' },
    { n: 'C++ Systems Architecture', c: 'Programming', id: '1720080489120', d: 'Jul 5, 2024' },
    { n: 'Java Enterprise Systems', c: 'Programming', id: '1720080512300', d: 'Jul 6, 2024' },
    { n: 'Python Automation', c: 'Programming', id: '1720080598100', d: 'Jul 7, 2024' },
    { n: 'Kotlin Development', c: 'Mobile', id: '1720080612400', d: 'Jul 8, 2024' },
    { n: 'Android Architecture Components', c: 'Mobile', id: '1720080645100', d: 'Jul 9, 2024' },
    { n: 'Jetpack Compose UI', c: 'Mobile', id: '1720080698200', d: 'Jul 10, 2024' },
    { n: 'Flutter & Dart', c: 'Mobile', id: '1720080723100', d: 'Jul 11, 2024' },
    { n: 'React Native Cross-Platform', c: 'Mobile', id: '1720080789400', d: 'Jul 12, 2024' },
    { n: 'React.js Engineering', c: 'Web', id: '1720080812300', d: 'Jul 13, 2024' },
    { n: 'Vue.js Framework', c: 'Web', id: '1720080845600', d: 'Jul 14, 2024' },
    { n: 'Angular Enterprise', c: 'Web', id: '1720080891200', d: 'Jul 15, 2024' },
    { n: 'Node.js REST APIs', c: 'Web', id: '1720080923400', d: 'Jul 16, 2024' },
    { n: 'HTML5 & CSS3 Master', c: 'Web', id: '1720080967800', d: 'Jul 17, 2024' },
    { n: 'Tailwind CSS Specialist', c: 'Web', id: '1720080998100', d: 'Jul 18, 2024' },
    { n: 'TypeScript Systems', c: 'Web', id: '1720081034500', d: 'Jul 19, 2024' },
    { n: 'Firebase Backend Suite', c: 'Databases', id: '1720081078900', d: 'Jul 20, 2024' },
    { n: 'PostgreSQL Design', c: 'Databases', id: '1720081112300', d: 'Jul 21, 2024' },
    { n: 'MongoDB NoSQL', c: 'Databases', id: '1720081145600', d: 'Jul 22, 2024' },
    { n: 'Redis In-Memory Cache', c: 'Databases', id: '1720081198200', d: 'Jul 23, 2024' },
    { n: 'SQL Query Optimization', c: 'Databases', id: '1720081234500', d: 'Jul 24, 2024' },
    { n: 'Room DB for Android', c: 'Databases', id: '1720081278900', d: 'Jul 25, 2024' },
    { n: 'Machine Learning Core', c: 'AI / ML', id: '1720081312300', d: 'Jul 26, 2024' },
    { n: 'TensorFlow Lite On-Device', c: 'AI / ML', id: '1720081345600', d: 'Jul 27, 2024' },
    { n: 'Deep Learning Networks', c: 'AI / ML', id: '1720081398200', d: 'Jul 28, 2024' },
    { n: 'Natural Language Processing', c: 'AI / ML', id: '1720081434500', d: 'Jul 29, 2024' },
    { n: 'Computer Vision', c: 'AI / ML', id: '1720081478900', d: 'Jul 30, 2024' },
    { n: 'Claude API / LLM Integration', c: 'AI / ML', id: '1720081512300', d: 'Jul 31, 2024' },
    { n: 'Ethical Hacking & Pen Testing', c: 'Security', id: '1720081545600', d: 'Aug 1, 2024' },
    { n: 'Cybersecurity & Kali Linux', c: 'Security', id: '1720081598200', d: 'Aug 2, 2024' },
    { n: 'GitHub Actions CI/CD', c: 'Security', id: '1720081634500', d: 'Aug 3, 2024' },
    { n: 'Docker Containerization', c: 'Security', id: '1720081678900', d: 'Aug 4, 2024' },
    { n: 'Azure DevOps Pipeline', c: 'Security', id: '1720081712300', d: 'Aug 5, 2024' },
    { n: 'Network Protocol Defense', c: 'Security', id: '1720081745600', d: 'Aug 6, 2024' },
    { n: 'Blockchain Architecture', c: 'Engineering', id: '1720081798200', d: 'Aug 7, 2024' },
    { n: 'Smart Contract Development', c: 'Engineering', id: '1720081834500', d: 'Aug 8, 2024' },
    { n: 'Clean Architecture Pattern', c: 'Engineering', id: '1720081878900', d: 'Aug 9, 2024' },
    { n: 'SOLID Principles in OOP', c: 'Engineering', id: '1720081912300', d: 'Aug 10, 2024' },
    { n: 'Design Patterns (GoF)', c: 'Engineering', id: '1720081945600', d: 'Aug 11, 2024' },
    { n: 'Data Structures & Algorithms', c: 'Engineering', id: '1720081998200', d: 'Aug 12, 2024' },
    { n: 'Startup MVP Development', c: 'Business', id: '1720082034500', d: 'Aug 13, 2024' },
    { n: 'Agile Scrum Leadership', c: 'Business', id: '1720082078900', d: 'Aug 14, 2024' },
  ];
  const certCats = ['ALL', 'Mobile', 'Programming', 'Web', 'Databases', 'AI / ML', 'Security', 'Engineering', 'Business'];
  const [certQ, setCertQ] = useState('');
  const [certCat, setCertCat] = useState('ALL');
  const shownCerts = useMemo(() => certs.filter(c =>
    (certCat === 'ALL' || c.c === certCat) &&
    (c.n.toLowerCase().includes(certQ.toLowerCase()) || c.id.includes(certQ) || c.c.toLowerCase().includes(certQ.toLowerCase()))
  ), [certQ, certCat]);

  const githubNodes = [
    'Dev-moe-kyawaung', 'moekyawaung-tech', 'moekyawaung-china', 'moekyawaung-developer',
    'moekyawaungvivov30pro-design', 'moekyaw-aung-mm', 'moekyawaung-mk', 'moekyawaung-microsoft',
    'moekyawaung-cyber', 'moekyawaung-bangkok', 'moekyawaung-micro', 'moekyawaungmka2032-boop',
    'moekyawaung-dev-mm', 'moekyaw-developer', 'moekyawaung.github.io', 'Moekyawaung-mm',
    'moekyawaung-hack', 'moekyawaung-graduate', 'Moekyawaung-Linux', 'Moekyawaung-coder',
    'moekyawaung-designer', 'Moekyawaung2026', 'moekyawaungmka2034-coder', 'Moekyawaung-mk',
    'moekyawaung-web', 'MoeKyawAung-code', 'moekyawaung-creator', 'moekyawaung-webdeveloper',
    'Moekyawaung-co', 'moekyawaung-edu', 'moekyawaung-senior', 'Moekyawaung-Development',
    'moekyawaung-google', 'Moe-KyawAung', 'Moekyawaung-dev', 'Moekyawaung-cyber',
    'moekyawaung-graduate', 'MoeKyawAung-code', 'moekyawaungmka', 'moekyaw-url',
    'happy-cv-creator', 'moekyawaung-free', 'moekyawaung-myanmar',
  ];

  const lovableNodes = [
    { n: 'Happy CV Creator', u: 'https://happy-cv-creator.lovable.app' },
    { n: 'MKA Bio Hub', u: 'https://moekyawaungmybio.lovable.app/' },
    { n: 'The CV Palette', u: 'https://the-cv-palette.lovable.app' },
    { n: 'URL Shortener', u: 'https://moekyaw-url.lovable.app' },
    { n: 'Dev Profile 2026', u: 'https://moekyawaung-dev.lovable.app' },
    { n: 'Main Portfolio', u: 'https://moe-kyaw-aung.lovable.app' },
    { n: 'CV Beacon System', u: 'https://cv-beacon.lovable.app/' },
    { n: 'Persuasion Hub', u: 'https://profile-persuasion-hub.lovable.app' },
    { n: 'App Skill Gallery', u: 'https://app-skill-gallery.lovable.app' },
    { n: 'Joy Codify Life', u: 'https://joy-codify-life.lovable.app/' },
    { n: 'Spark Coach AI', u: 'https://spark-coach-create.lovable.app' },
    { n: 'Color Code Chronicles', u: 'https://color-code-chronicles.lovable.app' },
    { n: 'Friendly Haven IO', u: 'https://friendly-haven-io.lovable.app' },
    { n: 'Pixel Perfect Snap', u: 'https://pixel-perfect-snap-39.lovable.app' },
    { n: 'Dev MoeKyaw', u: 'https://devmoekyaw.lovable.app' },
    { n: 'Myanmar Hub', u: 'https://moekyawaung-myanmar.lovable.app' },
  ];

  const emails = [
    'moekyawaung@programmer.net', 'moekyawaung@technologist.com', 'moekyawaung@engineer.com',
    'moekyawaung@techie.com', 'moekyawaung@collector.org', 'moekyawaung@graphic-designer.com',
    'moekyawaung@cybergal.com', 'moekyawaung@webname.com', 'moekyawaung@hackermail.com',
    'moekyawaung@graduate.org', 'moekyawaung@asia.com', 'moekyawaung@contractor.net',
    'moekyawaung@linuxmail.org', 'moekyawaung@usa.com', 'moekyawaung@europe.com',
    'moekyawaung@mail.com', 'moekyawaung@iname.com', 'moekyawaung@socialogist.com',
    'moekyawaung@secretary.net', 'moekyawaung@publicist.com',
  ];

  const socials = [
    { n: 'GitHub', i: <FaGithub />, u: 'https://github.com/Dev-moe-kyawaung/', t: '@Dev-moe-kyawaung' },
    { n: 'LinkedIn', i: <FaLinkedin />, u: 'https://www.linkedin.com/in/moe-kyaw-aung-2653093a1', t: 'Moe Kyaw Aung' },
    { n: 'YouTube', i: <FaYoutube />, u: 'https://www.youtube.com/channel/UCuTXUguZb4xjeL2nX8WJG', t: 'Dev Channel' },
    { n: 'Bluesky', i: <FiActivity />, u: 'https://bsky.app/profile/moekyawaung96.bsky.social', t: '@moekyawaung96' },
    { n: 'Tumblr', i: <FaTumblr />, u: 'https://www.tumblr.com/moekyawaung', t: 'Tech Log' },
    { n: 'Flickr', i: <FiCompass />, u: 'https://www.flickr.com/people/204037451@N06', t: 'Visual Archive' },
    { n: 'Vimeo', i: <FiActivity />, u: 'https://vimeo.com/user252414232', t: 'Video Reel' },
    { n: 'Gravatar', i: <FaAtom />, u: 'https://gravatar.com/moekyawaung13721', t: 'Verified ID' },
    { n: 'Slack', i: <FaSlack />, u: 'https://moekyawaung.slack.com/', t: 'Workspace' },
    { n: 'Reddit', i: <FaRedditAlien />, u: 'https://bsky.app/profile/moekyawaung96.bsky.social', t: 'Threads' },
    { n: 'Strikingly', i: <FiCompass />, u: 'http://moekyawaung2026.strikingly.com', t: 'Web Portal' },
  ];

  const gallery = [
    'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763531/MKA_12_iv8kpm.webp',
    'https://res.cloudinary.com/dye5qpwii/image/upload/v1778747388/image-1_1_khsx9s.png',
    'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763531/MKA_3_zqrhhr.webp',
    'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763532/MKA_11_jbijtv.webp',
    'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795799/2024119_20_b94fen.jpg',
    'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795800/2024119_18_syk2ou.jpg',
    'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795801/MKA_22_felevo.webp',
    'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763536/preview_ls5ptn.webp',
  ];

  const [copied, setCopied] = useState<string | null>(null);
  const copy = (t: string) => {
    navigator.clipboard.writeText(t); snd('tick');
    setCopied(t); setTimeout(() => setCopied(null), 2200);
  };

  const go = (id: string) => { snd('tick'); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <div className="min-h-screen bg-[#02030a] text-slate-200 relative overflow-x-hidden matrix-grid">
      <MatrixRain />

      {/* ══════════ NAV ══════════ */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#03060f]/92 backdrop-blur-xl border-b border-emerald-400/25">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <button onClick={() => go('core')} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded bg-[#061223] border border-emerald-400/60 flex items-center justify-center text-emerald-400 shadow-[0_0_16px_rgba(0,255,156,.35)]">
              <FaAtom className="text-lg animate-orb-spin" />
            </div>
            <div className="text-left">
              <p className="font-orbitron font-extrabold text-[11px] tracking-widest text-white flex items-center gap-2">
                QUANTUM MATRIX // MOE KYAW AUNG
                <span className="px-1.5 py-px bg-emerald-400/15 border border-emerald-400/50 text-emerald-300 text-[9px] font-plex">v2026.Q</span>
              </p>
              <p className="text-[10px] text-cyan-300/70 font-plex">SENIOR MOBILE ARCHITECT · QUANTUM LATTICE</p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1 font-orbitron text-[11px] font-bold">
            {[
              { id: 'core', l: 'CORE' },
              { id: 'entanglement', l: 'ARCHITECTURE' },
              { id: 'lattice', l: '16 NODES' },
              { id: 'observer', l: 'FOUNDER' },
              { id: 'records', l: '82+ CERTS' },
              { id: 'channels', l: 'CHANNELS' },
            ].map(x => (
              <button key={x.id} onClick={() => go(x.id)}
                className="px-3 py-1.5 rounded text-slate-400 hover:text-emerald-300 hover:bg-emerald-400/10 transition">
                {x.l}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#061223] border border-cyan-400/30 text-[10px] font-plex text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              COHERENCE {coherence}%
            </span>
            <button onClick={() => { setMuted(!muted); if (muted) playQuantum('entangle'); }}
              className={`p-2 rounded border transition ${!muted ? 'border-emerald-400/60 text-emerald-300 bg-emerald-400/10' : 'border-slate-700 text-slate-500'}`}>
              {!muted ? <FiVolume2 /> : <FiVolumeX />}
            </button>
            <button onClick={() => { snd('burst'); setOrbOpen(true); setBurstKey(k => k + 1); }}
              className="q-btn px-3 py-1.5 text-[11px] flex items-center gap-1.5">
              <FaProjectDiagram /> QUBIT-9
            </button>
          </div>
        </div>
      </header>

      {/* ══════════ HERO / CORE ══════════ */}
      <section id="core" className="relative z-10 pt-28 pb-20 px-4 min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-70">
          <FractalCore size={620} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-1.5 rounded-full bg-[#050c1c]/85 border border-emerald-400/40 mb-6 text-[11px] font-plex">
            <span className="text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> WAVEFUNCTION STABLE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-300">1M+ OBSERVED USERS</span>
            <span className="text-slate-600">|</span>
            <span className="text-violet-300">16 ENTANGLED NODES</span>
          </div>

          <div className="relative inline-block mb-7">
            <span className="absolute inset-0 rounded-full bg-emerald-400/25 animate-superposition" />
            <span className="absolute inset-0 rounded-full bg-violet-500/20 animate-superposition" style={{ animationDelay: '.9s' }} />
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-[3px] bg-gradient-to-br from-emerald-400 via-cyan-400 to-violet-500 shadow-[0_0_45px_rgba(0,255,156,.35)]">
              <img src="https://res.cloudinary.com/dye5qpwii/image/upload/v1778763535/MKA_25_lbx6fb.webp"
                alt="Moe Kyaw Aung" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="absolute -inset-5 animate-orb-spin pointer-events-none">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#00ff9c]" />
            </div>
            <div className="absolute -inset-8 animate-orb-spin-rev pointer-events-none">
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_12px_#8b5cf6]" />
            </div>
          </div>

          <p className="text-emerald-300 font-plex tracking-[0.25em] text-xs mb-2 q-chromatic">မိုးကျော်အောင် // MOE KYAW AUNG</p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-orbitron font-black leading-none mb-4 animate-q-flicker">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400">QUANTUM MATRIX</span>
            <br />
            <span className="text-white">MOBILE ARCHITECT</span>
          </h1>

          <div className="h-10 text-base sm:text-xl font-chakra font-bold text-cyan-300 mb-7 flex items-center justify-center gap-2">
            <span className="text-emerald-400 font-plex">⧉</span>
            <TypeAnimation
              sequence={[
                '"THIS ENGINEER BUILDS APPS USED BY MILLIONS."', 2400,
                'KOTLIN · JETPACK COMPOSE · CLEAN ARCHITECTURE', 2400,
                '80+ MODULE LATTICE · HILT ENTANGLEMENT GRAPH', 2400,
                'TECHNICAL FOUNDER · 1M+ COLLAPSED OBSERVATIONS', 2400,
              ]}
              speed={55} repeat={Infinity} wrapper="span"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-plex mb-8">
            <span className="px-3.5 py-1.5 rounded bg-[#050c1c]/85 border border-emerald-400/30 text-emerald-200 flex items-center gap-1.5">
              <FiMapPin className="text-emerald-400" /> Tachileik, Myanmar 🇲🇲 ↔ Bangkok, Thailand 🇹🇭
            </span>
            <span className="px-3.5 py-1.5 rounded bg-[#050c1c]/85 border border-violet-400/30 text-violet-200">
              Burmese 🇲🇲 · English 🌐 · Kotlin ☕
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-3xl mx-auto mb-9">
            {[
              { t: 'MOBILE FIELD', s: 'Kotlin · Compose · MVVM', i: <FaAndroid />, c: 'text-emerald-400' },
              { t: 'CLOUD LATTICE', s: 'Firebase · REST · Python', i: <FiCloud />, c: 'text-cyan-400' },
              { t: 'SECURITY WARDS', s: 'Ethical Hacking · AES-256', i: <FiShield />, c: 'text-violet-400' },
              { t: 'NEURAL EDGE', s: 'Claude API · TFLite ML', i: <FiCpu />, c: 'text-amber-400' },
            ].map((p, i) => (
              <div key={i} className="q-panel rounded-xl p-4 text-left">
                <span className="q-tick q-tick-tl" /><span className="q-tick q-tick-br" />
                <div className={`text-xl mb-2 ${p.c}`}>{p.i}</div>
                <h3 className="font-orbitron font-bold text-[11px] text-white mb-1">{p.t}</h3>
                <p className="text-[10px] text-slate-400 font-plex">{p.s}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => { snd('entangle'); go('lattice'); }} className="q-btn px-7 py-3 text-xs flex items-center gap-2">
              <FaProjectDiagram /> OBSERVE 16-NODE LATTICE
            </button>
            <button onClick={() => { snd('entangle'); go('entanglement'); }} className="q-btn-violet px-6 py-3 text-xs flex items-center gap-2">
              <FiLayers /> ARCHITECTURE FIELD
            </button>
            <a href="https://github.com/Dev-moe-kyawaung/pulsesync-android" target="_blank" rel="noopener noreferrer"
              onClick={() => snd('tick')}
              className="px-6 py-3 rounded bg-[#050c1c] border border-amber-400/50 hover:border-amber-400 text-amber-300 font-orbitron font-bold text-xs flex items-center gap-2 transition">
              <FiZap /> FLAGSHIP: PULSESYNC
            </a>
          </div>
        </div>
      </section>

      {/* ══════════ ARCHITECTURE FIELD ══════════ */}
      <section id="entanglement" className="relative z-10 py-24 px-4 border-t border-emerald-400/15 bg-[#03060f]/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded bg-emerald-400/10 border border-emerald-400/50 text-emerald-300 font-plex text-[10px] mb-3">
              ENTANGLEMENT FIELD // ARCHITECTURE DECISIONS
            </span>
            <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-white">QUANTUM ARCHITECTURE LAYERS</h2>
            <p className="text-cyan-300/80 font-plex text-sm mt-2 max-w-2xl mx-auto">
              Six decision fields governing every app in the lattice — probe any of them with the QUBIT-9 orb.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {architecture.map((a, i) => (
              <div key={i} className="q-panel rounded-xl p-6 group">
                <span className="q-tick q-tick-tl" /><span className="q-tick q-tick-tr" />
                <span className="q-tick q-tick-bl" /><span className="q-tick q-tick-br" />
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-lg bg-[#020814] border border-slate-700/70 flex items-center justify-center text-xl ${a.c}`}>{a.icon}</div>
                  <span className="px-2 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 font-plex text-[9px]">{a.tag}</span>
                </div>
                <h3 className="font-orbitron font-bold text-sm text-white mb-2 group-hover:text-emerald-300 transition">{a.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{a.desc}</p>
                <div className="mt-4 h-px bg-slate-800 relative overflow-hidden">
                  <span className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-entangle" />
                </div>
              </div>
            ))}
          </div>

          {/* Flagship */}
          <div className="q-panel q-panel-violet rounded-2xl p-8">
            <span className="q-tick q-tick-tl" /><span className="q-tick q-tick-br" />
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <p className="text-[10px] font-plex text-amber-300 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" /> SINGULARITY CORE — FLAGSHIP REPOSITORY
                </p>
                <h3 className="text-2xl sm:text-3xl font-orbitron font-black text-white mb-2">PULSESYNC — REAL-TIME ANDROID PLATFORM</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Advanced multi-module Android application demonstrating senior architecture, Firebase suite backend
                  (Auth, Firestore, Cloud Messaging, Crashlytics), offline-first Room synchronization and a full GitHub Actions CI/CD pipeline.
                </p>
                <div className="flex flex-wrap gap-2 font-plex text-[11px]">
                  {['Kotlin 2.0', 'Jetpack Compose', 'Clean Architecture', 'Hilt DI', 'Room DB', 'Firebase', 'GitHub Actions'].map(t => (
                    <span key={t} className="px-2.5 py-1 rounded bg-[#020814] border border-violet-400/35 text-violet-200">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full lg:w-auto">
                <a href="https://github.com/Dev-moe-kyawaung/pulsesync-android" target="_blank" rel="noopener noreferrer"
                  onClick={() => snd('tick')} className="q-btn px-6 py-3 text-xs text-center flex items-center justify-center gap-2">
                  <FaGithub /> OPEN REPOSITORY
                </a>
                <button onClick={() => { setOrbOpen(true); probeOrb('Explain the modularization decision'); }}
                  className="q-btn-violet px-6 py-3 text-xs flex items-center justify-center gap-2">
                  <FaProjectDiagram /> VISUALIZE DECISION
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ QUANTUM LATTICE (16 NODES) ══════════ */}
      <section id="lattice" className="relative z-10 py-24 px-4 border-t border-cyan-400/15">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded bg-cyan-400/10 border border-cyan-400/50 text-cyan-300 font-plex text-[10px] mb-3">
              ENTANGLEMENT LATTICE // 16 QUANTUM PROJECT NODES
            </span>
            <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-white">PROJECT NODE GRAPH</h2>
            <p className="text-emerald-300/80 font-plex text-sm mt-2 max-w-2xl mx-auto">
              Nodes drift in a live physics field, exchanging data packets across entanglement edges. Observe one to collapse its full case study.
            </p>
          </div>

          {/* Live graph */}
          <div className="q-panel rounded-2xl p-3 mb-10 matrix-grid-fine">
            <span className="q-tick q-tick-tl" /><span className="q-tick q-tick-tr" />
            <span className="q-tick q-tick-bl" /><span className="q-tick q-tick-br" />
            <QuantumGraph labels={graphLabels} activeId={selected?.id ?? null} onPick={pickNode} />
          </div>

          {/* Node cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {nodes.map(n => (
              <button key={n.id} onClick={() => pickNode(n.id)}
                className="q-panel q-node-card rounded-xl p-5 text-left group">
                <span className="q-tick q-tick-tl" /><span className="q-tick q-tick-br" />
                <div className="flex items-center justify-between text-[10px] font-plex text-slate-500 mb-3">
                  <span className="text-emerald-400 font-bold">{n.qid}</span>
                  <span className="px-1.5 py-px rounded bg-[#020814] border border-cyan-400/25 text-cyan-300">{n.coherence}</span>
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl group-hover:scale-125 transition-transform" style={{ filter: `drop-shadow(0 0 10px ${n.color})` }}>{n.icon}</span>
                  <div>
                    <h3 className="font-orbitron font-bold text-sm text-white group-hover:text-emerald-300 transition">{n.title}</h3>
                    <p className="text-[11px] font-plex" style={{ color: n.color }}>{n.domain}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">{n.summary}</p>
                <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-plex">
                  <span className="text-emerald-400 flex items-center gap-1"><FiMaximize2 /> COLLAPSE STATE</span>
                  <span className="text-slate-500">{n.state}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FOUNDER / OBSERVER ══════════ */}
      <section id="observer" className="relative z-10 py-24 px-4 border-t border-violet-400/15 bg-[#03060f]/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded bg-violet-400/10 border border-violet-400/50 text-violet-300 font-plex text-[10px] mb-3">
              OBSERVER EFFECT // FOUNDER TELEMETRY
            </span>
            <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-white">TECHNICAL FOUNDER LAB</h2>
            <p className="text-cyan-300/80 font-plex text-sm mt-2">From MVP superposition to million-user collapse.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { l: 'OBSERVED INSTALLS', v: '1M+', s: 'Across 16 nodes', c: 'text-emerald-400' },
              { l: 'ACTIVE OBSERVERS', v: '50K+', s: 'Monthly active', c: 'text-cyan-400' },
              { l: 'FIELD RATING', v: '4.5★', s: 'Store average', c: 'text-violet-400' },
              { l: 'STATE COHERENCE', v: '99.9%', s: 'Crash-free', c: 'text-amber-400' },
            ].map((s, i) => (
              <div key={i} className="q-panel rounded-xl p-5 text-center">
                <span className="q-tick q-tick-tl" /><span className="q-tick q-tick-br" />
                <p className="text-[9px] font-plex text-slate-500 mb-1">{s.l}</p>
                <p className={`font-orbitron font-black text-3xl sm:text-4xl ${s.c}`}>{s.v}</p>
                <p className="text-[10px] text-slate-500 font-plex mt-1">{s.s}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="q-panel rounded-xl p-6">
              <span className="q-tick q-tick-tl" /><span className="q-tick q-tick-br" />
              <h3 className="font-orbitron font-bold text-sm text-emerald-300 mb-4 flex items-center gap-2">
                <FiZap /> PRODUCTS COLLAPSED INTO REALITY
              </h3>
              <div className="space-y-3">
                {[
                  { n: 'MoekyawTranslator AI', d: 'On-device neural translation via Claude API + TensorFlow Lite, with full offline fallback for rural Myanmar.' },
                  { n: 'POS ERP Suite', d: 'Commercial retail management across Tachileik & Bangkok with dual MMK/THB offline reconciliation.' },
                  { n: 'Job-Portal Platform', d: 'Talent bridge connecting regional engineers with remote Southeast Asian technology roles.' },
                  { n: 'Social Dashboard', d: 'Unified multi-account telemetry aggregator with reactive engagement analytics.' },
                ].map((p, i) => (
                  <div key={i} className="p-3.5 rounded bg-[#020814] border border-slate-800">
                    <h4 className="font-orbitron font-bold text-xs text-white">{p.n}</h4>
                    <p className="text-xs text-slate-400 mt-1">{p.d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="q-panel q-panel-violet rounded-xl p-6 flex flex-col justify-between">
              <span className="q-tick q-tick-tl" /><span className="q-tick q-tick-br" />
              <div>
                <h3 className="font-orbitron font-bold text-sm text-violet-300 mb-4 flex items-center gap-2">
                  <FaProjectDiagram /> PRODUCT DECISION VECTORS
                </h3>
                <div className="space-y-3 font-plex text-xs">
                  {[
                    ['OFFLINE-FIRST PRIMACY', 'Room DB as single source of truth — operations survive complete network collapse.'],
                    ['ON-DEVICE AI QUANTIZATION', 'TFLite quantized models drive translation locally, cutting cloud spend to near zero.'],
                    ['2GB RAM BUDGET DISCIPLINE', 'Compose recomposition budgets prevent OOM on tier-3 hardware across the region.'],
                    ['TRI-LINGUAL LOCALIZATION', 'Burmese (Zawgyi/Unicode auto-detect), Thai and English switch without restart.'],
                  ].map(([t, d], i) => (
                    <div key={i} className="p-3 rounded bg-[#020814] border border-slate-800">
                      <p className="text-emerald-300 font-bold mb-0.5">{i + 1}. {t}</p>
                      <p className="text-slate-400">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-plex text-slate-500">
                <span>"CODE WITH CULTURE. BUILD WITH PURPOSE."</span>
                <span className="text-emerald-400 font-bold">OPEN TO CO-FOUNDER ROLES</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CERTIFICATES ══════════ */}
      <section id="records" className="relative z-10 py-24 px-4 border-t border-emerald-400/15">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded bg-amber-400/10 border border-amber-400/50 text-amber-300 font-plex text-[10px] mb-3">
              QUANTUM RECORDS // 82+ VERIFIED STATES
            </span>
            <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-white">CERTIFICATION LATTICE</h2>
            <p className="text-cyan-300/80 font-plex text-sm mt-2">Programming Hub credentials spanning 9 technical domains.</p>
          </div>

          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input value={certQ} onChange={e => setCertQ(e.target.value)}
                placeholder="SEARCH QUANTUM RECORDS BY NAME OR ID..."
                className="q-input w-full pl-10 pr-4 py-2.5 rounded text-xs font-plex text-emerald-200" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {certCats.map(c => (
                <button key={c} onClick={() => { snd('tick'); setCertCat(c); }}
                  className={`px-3 py-1.5 rounded text-[11px] font-plex transition ${certCat === c
                    ? 'bg-emerald-400 text-[#02030a] font-bold shadow-[0_0_14px_rgba(0,255,156,.55)]'
                    : 'bg-[#050c1c] text-slate-400 border border-slate-800 hover:border-emerald-400/50'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {shownCerts.map((c, i) => (
              <div key={i} className="q-panel rounded-xl p-4 flex flex-col justify-between group">
                <span className="q-tick q-tick-tl" /><span className="q-tick q-tick-br" />
                <div>
                  <div className="flex items-center justify-between text-[10px] font-plex mb-2">
                    <span className="text-amber-300 font-bold">{c.d}</span>
                    <span className="px-1.5 py-px rounded bg-[#020814] border border-slate-800 text-cyan-300">#{c.id.slice(-6)}</span>
                  </div>
                  <h4 className="font-orbitron font-bold text-xs text-white group-hover:text-emerald-300 transition mb-1">{c.n}</h4>
                  <p className="text-[11px] text-violet-300/80 font-plex">{c.c}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-plex">
                  <span className="text-slate-500 flex items-center gap-1"><FiCheck className="text-emerald-400" /> VERIFIED</span>
                  <a href={`https://www.programminghub.io/certificate?id=${c.id}`} target="_blank" rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-white font-bold flex items-center gap-1">
                    <FaCertificate /> VERIFY ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
          {shownCerts.length === 0 && (
            <p className="text-center py-12 text-slate-500 font-plex text-sm">NO STATE MATCHES "{certQ}" — TRY ANOTHER PROBE.</p>
          )}
        </div>
      </section>

      {/* ══════════ GITHUB + LOVABLE ══════════ */}
      <section className="relative z-10 py-24 px-4 border-t border-cyan-400/15 bg-[#03060f]/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded bg-cyan-400/10 border border-cyan-400/50 text-cyan-300 font-plex text-[10px] mb-3">
              DISTRIBUTED NETWORK // REPOSITORY MESH
            </span>
            <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-white">43 GITHUB NODES · 38 WEB PROBES</h2>
          </div>

          <h3 className="font-orbitron font-bold text-xs text-emerald-300 mb-4 flex items-center gap-2">
            <FaGithub className="text-cyan-400" /> 43 GITHUB REPOSITORY NODES
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 mb-12 font-plex text-[11px]">
            {githubNodes.map((g, i) => (
              <a key={i} href={`https://github.com/${g}`} target="_blank" rel="noopener noreferrer" onClick={() => snd('tick')}
                className="p-2.5 rounded bg-[#020814] border border-slate-800 hover:border-emerald-400/60 hover:bg-emerald-400/5 transition flex items-center justify-between group">
                <span className="text-slate-400 group-hover:text-white truncate">{g}</span>
                <FiExternalLink className="text-slate-600 group-hover:text-emerald-400 shrink-0 ml-1" />
              </a>
            ))}
          </div>

          <h3 className="font-orbitron font-bold text-xs text-violet-300 mb-4 flex items-center gap-2">
            <FiCompass className="text-emerald-400" /> 38 DEPLOYED LOVABLE WEB PROBES
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 font-plex text-[11px]">
            {lovableNodes.map((l, i) => (
              <a key={i} href={l.u} target="_blank" rel="noopener noreferrer" onClick={() => snd('tick')}
                className="p-3 rounded bg-[#020814] border border-violet-500/25 hover:border-violet-400 transition flex items-center justify-between group">
                <span className="flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  <span className="text-slate-300 group-hover:text-violet-200 truncate font-bold">{l.n}</span>
                </span>
                <FiExternalLink className="text-slate-600 group-hover:text-violet-300 shrink-0 ml-2" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ GALLERY ══════════ */}
      <section className="relative z-10 py-24 px-4 border-t border-emerald-400/15">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded bg-emerald-400/10 border border-emerald-400/50 text-emerald-300 font-plex text-[10px] mb-3">
              OBSERVED FRAMES // VISUAL ARCHIVE
            </span>
            <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-white">ENGINEERING ARCHIVE</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {gallery.map((src, i) => (
              <a key={i} href={src} target="_blank" rel="noopener noreferrer"
                className="q-panel rounded-xl overflow-hidden group aspect-video block">
                <img src={src} alt={`Frame ${i + 1}`} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CHANNELS ══════════ */}
      <section id="channels" className="relative z-10 py-24 px-4 border-t border-violet-400/15 bg-[#03060f]/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded bg-emerald-400/10 border border-emerald-400/50 text-emerald-300 font-plex text-[10px] mb-3">
              COMMUNICATION CHANNELS // OPEN FREQUENCIES
            </span>
            <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-white">ESTABLISH ENTANGLEMENT</h2>
            <p className="text-cyan-300/80 font-plex text-sm mt-2 max-w-2xl mx-auto">
              Open to senior mobile architect roles, technical co-founder ventures and enterprise consulting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {[
              { l: 'PRIMARY CHANNEL', v: '+95 9 889 000 889', h: 'tel:+959889000889', c: 'border-emerald-400/50 text-emerald-300' },
              { l: 'SECONDARY CHANNEL', v: '+95 9 666 000 050', h: 'tel:+959666000050', c: 'border-cyan-400/50 text-cyan-300' },
            ].map((p, i) => (
              <div key={i} className="q-panel rounded-xl p-5 flex items-center justify-between">
                <span className="q-tick q-tick-tl" /><span className="q-tick q-tick-br" />
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-[#020814] border flex items-center justify-center text-xl ${p.c}`}>
                    <FiPhone />
                  </div>
                  <div>
                    <p className="text-[10px] font-plex text-slate-500">{p.l}</p>
                    <p className="text-lg font-orbitron font-bold text-white tracking-wide">{p.v}</p>
                  </div>
                </div>
                <a href={p.h} onClick={() => snd('tick')} className="q-btn px-4 py-2 text-[11px]">HAIL</a>
              </div>
            ))}
          </div>

          <div className="q-panel rounded-xl p-6 mb-10">
            <span className="q-tick q-tick-tl" /><span className="q-tick q-tick-br" />
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h3 className="font-orbitron font-bold text-sm text-emerald-300 flex items-center gap-2">
                <FiMail /> 20+ INBOX FREQUENCIES — CLICK TO COPY
              </h3>
              {copied && <span className="px-3 py-1 bg-emerald-400 text-[#02030a] font-plex text-[11px] rounded font-bold">COPIED: {copied}</span>}
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 font-plex text-[11px]">
              {emails.map((e, i) => (
                <button key={i} onClick={() => copy(e)}
                  className="p-2.5 rounded bg-[#020814] border border-slate-800 hover:border-emerald-400/60 text-left flex items-center justify-between group transition">
                  <span className="text-slate-400 group-hover:text-emerald-300 truncate">{e}</span>
                  <FiCopy className="text-slate-600 group-hover:text-emerald-400 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>

          <div className="q-panel q-panel-violet rounded-xl p-6">
            <span className="q-tick q-tick-tl" /><span className="q-tick q-tick-br" />
            <h3 className="font-orbitron font-bold text-sm text-violet-300 mb-5 flex items-center gap-2">
              <FiShare2 /> VERIFIED GRAVATAR NETWORK — ALL 16 PLATFORMS
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 font-plex text-[11px]">
              {socials.map((s, i) => (
                <a key={i} href={s.u} target="_blank" rel="noopener noreferrer" onClick={() => snd('tick')}
                  className="p-3.5 rounded bg-[#020814] border border-slate-800 hover:border-emerald-400/60 transition flex flex-col items-center text-center group">
                  <span className="text-2xl text-emerald-400 group-hover:scale-110 transition-transform mb-2">{s.i}</span>
                  <span className="font-orbitron font-bold text-[11px] text-white group-hover:text-emerald-300">{s.n}</span>
                  <span className="text-[10px] text-slate-500 truncate w-full mt-0.5">{s.t}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ NODE DETAIL MODAL ══════════ */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/88 backdrop-blur-md">
          <div className="q-panel rounded-2xl w-[96vw] sm:w-[740px] max-h-[88vh] overflow-hidden flex flex-col border-emerald-400/70">
            <span className="q-tick q-tick-tl" /><span className="q-tick q-tick-tr" />
            <span className="q-tick q-tick-bl" /><span className="q-tick q-tick-br" />

            <div className="p-5 border-b border-slate-800 bg-[#050c1c] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl" style={{ filter: `drop-shadow(0 0 12px ${selected.color})` }}>{selected.icon}</span>
                <div>
                  <h3 className="font-orbitron font-extrabold text-base text-white">{selected.title}</h3>
                  <p className="text-[11px] font-plex text-emerald-400">{selected.qid} · {selected.domain} · {selected.state}</p>
                </div>
              </div>
              <button onClick={() => { snd('collapse'); setSelected(null); }}
                className="w-8 h-8 rounded bg-[#020814] border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition">
                <FiX />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              <div className="p-4 rounded-lg bg-[#020814] border border-emerald-400/25">
                <p className="text-[10px] font-plex text-emerald-400 font-bold mb-1">⧉ WAVEFUNCTION SUMMARY</p>
                <p className="text-slate-300 leading-relaxed text-xs">{selected.summary}</p>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-plex text-cyan-400 font-bold">◈ THREE-LAYER STATE DECOMPOSITION</p>
                {[
                  { t: 'OBSERVATION LAYER — UI / PRESENTATION', d: selected.layers.observation, c: 'border-emerald-400' },
                  { t: 'SUPERPOSITION LAYER — DOMAIN / LOGIC', d: selected.layers.superposition, c: 'border-cyan-400' },
                  { t: 'GROUND STATE — DATA / PERSISTENCE', d: selected.layers.ground, c: 'border-violet-400' },
                ].map((l, i) => (
                  <div key={i} className={`p-3.5 rounded bg-[#050c1c] border-l-4 ${l.c}`}>
                    <p className="text-[10px] font-plex font-bold text-white mb-1">{l.t}</p>
                    <p className="text-xs text-slate-400">{l.d}</p>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded bg-[#020814] border border-slate-800">
                  <p className="text-[10px] font-plex text-slate-500 mb-1">ENTANGLED WITH</p>
                  <p className="text-xs text-cyan-300 font-plex">{selected.entangledWith.join(' ⟷ ')}</p>
                </div>
                <div className="p-3.5 rounded bg-[#020814] border border-slate-800">
                  <p className="text-[10px] font-plex text-slate-500 mb-1">OBSERVED METRICS</p>
                  <p className="text-xs text-emerald-300 font-bold">{selected.metrics}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-plex text-slate-500 mb-2">STACK EIGENVECTORS</p>
                <div className="flex flex-wrap gap-2">
                  {selected.stack.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-[11px] font-plex">{s}</span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <button onClick={() => { setSelected(null); setOrbOpen(true); probeOrb(`Explain architecture of ${selected.title}`); }}
                  className="q-btn-violet px-4 py-2 text-[11px] flex items-center gap-2">
                  <FaProjectDiagram /> ASK QUBIT-9
                </button>
                <a href={selected.url} target="_blank" rel="noopener noreferrer" className="q-btn px-5 py-2 text-[11px] flex items-center gap-2">
                  OPEN REPOSITORY <FiExternalLink />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ AI ORB — QUBIT-9 ══════════ */}
      <div className="fixed bottom-6 right-6 z-40">
        {!orbOpen ? (
          <button onClick={() => { snd('burst'); setOrbOpen(true); setBurstKey(k => k + 1); }}
            className="relative animate-orb-float group">
            <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-superposition" />
            <span className="absolute inset-0 rounded-full bg-violet-500/25 animate-superposition" style={{ animationDelay: '.8s' }} />
            <span className="relative flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#050c1c]/95 border-2 border-emerald-400 shadow-[0_0_32px_rgba(0,255,156,.45)] group-hover:border-cyan-300 transition">
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-violet-500 flex items-center justify-center text-[#02030a] font-bold">
                <FaAtom className="text-lg animate-orb-spin" />
              </span>
              <span className="text-left font-plex">
                <span className="block text-[9px] text-slate-400">QUANTUM OBSERVER</span>
                <span className="block text-xs font-bold text-emerald-300 font-orbitron">QUBIT-9</span>
              </span>
            </span>
          </button>
        ) : (
          <div className="w-[93vw] sm:w-[420px] max-h-[600px] q-panel rounded-2xl flex flex-col overflow-hidden border-emerald-400/70 shadow-[0_0_50px_rgba(0,255,156,.35)]">
            <div className="p-3 bg-[#050c1c] border-b border-emerald-400/25 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-orbitron font-bold text-xs text-white">QUBIT-9 · ARCHITECTURE OBSERVER</span>
              </span>
              <button onClick={() => setOrbOpen(false)} className="text-slate-400 hover:text-white"><FiX /></button>
            </div>

            {/* Particle burst visualizer */}
            <div className="bg-[#010409] border-b border-slate-800 relative">
              <OrbCanvas trigger={burstKey} />
              <span className="absolute top-2 left-3 text-[9px] font-plex text-emerald-400/70">PARTICLE FIELD // DECISION COLLAPSE</span>
            </div>

            <div className="p-3 bg-[#02050e] flex-1 overflow-y-auto space-y-3 max-h-[240px]">
              {orbLog.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] p-3 rounded-lg text-xs leading-relaxed ${m.from === 'user'
                    ? 'bg-cyan-400/15 border border-cyan-400/50 text-cyan-100'
                    : 'bg-[#050c1c] border border-emerald-400/25 text-slate-200'}`}>
                    {m.from === 'ai' && <span className="block text-[9px] font-plex text-emerald-400 font-bold mb-1">[QUBIT-9 OBSERVATION]</span>}
                    <p>{m.text}</p>
                    {m.graph && (
                      <div className="mt-3 space-y-1 font-plex text-[10px]">
                        {m.graph.map((g, gi) => (
                          <div key={gi} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ['#00ff9c', '#22d3ee', '#8b5cf6', '#fbbf24', '#f472b6'][gi % 5] }} />
                            <span className="text-slate-400">{g}</span>
                            {gi < m.graph!.length - 1 && <span className="text-slate-700 ml-auto">↓</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2 bg-[#050c1c] border-t border-slate-800 flex flex-wrap gap-1">
              {['Modularization', 'Dependency Injection', 'Offline-First', 'CI/CD', 'Security', 'Scalability', 'Startup'].map(p => (
                <button key={p} onClick={() => probeOrb(p)}
                  className="px-2 py-0.5 rounded bg-[#020814] hover:bg-emerald-400/15 text-slate-400 hover:text-emerald-300 border border-slate-800 text-[10px] font-plex transition">
                  +{p}
                </button>
              ))}
            </div>

            <div className="p-2.5 bg-[#010409] border-t border-slate-800 flex items-center gap-2">
              <input value={orbInput} onChange={e => setOrbInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && probeOrb()}
                placeholder="Probe an architecture decision..."
                className="q-input flex-1 px-3 py-1.5 rounded text-xs text-emerald-200 font-plex" />
              <button onClick={() => probeOrb()} className="q-btn px-3 py-1.5 text-[11px] flex items-center gap-1.5">
                <FiSend /> PROBE
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="relative z-10 py-14 px-4 bg-[#010308] border-t border-emerald-400/25 font-plex text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-orbitron font-bold text-sm text-white">MOE KYAW AUNG // မိုးကျော်အောင်</span>
            </p>
            <p className="text-slate-500 text-[11px]">Senior Mobile Architect · Technical Founder · Tachileik 🇲🇲 ↔ Bangkok 🇹🇭</p>
          </div>
          <div className="text-center md:text-right text-slate-500 text-[11px] space-y-1">
            <p className="text-emerald-400">LATTICE COHERENCE {coherence}% · 16 NODES ENTANGLED · KOTLIN + COMPOSE</p>
            <p>© 2026 MOE KYAW AUNG. ALL QUANTUM STATES RESERVED.</p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#02030a] to-transparent pointer-events-none z-20" />
    </div>
  );
}
