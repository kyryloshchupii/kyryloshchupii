// Generates the animated SVG cards for the GitHub profile README.
// Usage: node scripts/generate.mjs  (writes light + dark variants into ./assets)
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
mkdirSync(OUT, { recursive: true });

// ---------- content ----------
const PROFILE = {
  name: 'Kyrylo Shchupii',
  role: 'Fullstack Engineer · AI integrations',
  bio: [
    'Frontend at heart, fullstack by choice. I build interfaces people enjoy and the APIs behind them,',
    'shipping faster with AI agents while I own the architecture and every final call.',
  ],
  tools: ['build_ui()', 'ship_api()', 'orchestrate_agents()'],
};

const PHRASES = [
  'Done — responsive, themeable, fully keyboard-accessible.',
  'Shipped with zero layout shift and 60fps transitions.',
  'Dark mode, reduced motion, screen readers: covered.',
];

const API_FLOW = ['schema.ts', 'openapi.json', 'client.ts'];

const STACK = [
  { title: 'Building with AI', color: 'purple', items: ['Claude Code / Agent SDK', 'MCP', 'Cursor', 'ChatGPT / Codex', 'Gemini', 'Lovable', 'v0'] },
  { title: 'Building interfaces with', color: 'blue', items: ['TypeScript', 'React', 'React Native', 'Next.js', 'Vite', 'Redux / RTK Query', 'TanStack Query', 'Tailwind CSS', 'Radix UI', 'Material UI', 'Storybook', 'Three.js'] },
  { title: 'Building APIs with', color: 'orange', items: ['Node.js', 'NestJS', 'GraphQL', 'OpenAPI', 'Zod', 'Stripe', 'Better Auth'] },
  { title: 'Storing data with', color: 'green', items: ['PostgreSQL', 'Redis', 'MongoDB', 'Prisma'] },
  { title: 'Testing with', color: 'red', items: ['Playwright', 'Vitest', 'Jest'] },
  { title: 'Deploying with', color: 'muted', items: ['Docker', 'Google Cloud', 'NGINX', 'GitHub Actions', 'Vercel'] },
];

// ---------- theme ----------
const THEMES = {
  light: {
    card: '#f6f8fa', border: '#d0d7de', text: '#1f2328', muted: '#59636e', subtle: '#ffffff',
    blue: '#0969da', purple: '#8250df', orange: '#9a6700', green: '#1a7f37', red: '#cf222e',
    blueBg: '#ddf4ff', purpleBg: '#fbefff', orangeBg: '#fff8c5', greenBg: '#dafbe1', redBg: '#ffebe9',
  },
  dark: {
    card: '#161b22', border: '#30363d', text: '#e6edf3', muted: '#8d96a0', subtle: '#0d1117',
    blue: '#4493f8', purple: '#ab7df8', orange: '#d29922', green: '#3fb950', red: '#f85149',
    blueBg: '#121d2f', purpleBg: '#211833', orangeBg: '#2a2213', greenBg: '#12261e', redBg: '#2b1519',
  },
};

const W = 840;
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const MONO_RATIO = 0.62; // slightly generous so pills never clip on wider mono fonts

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const monoW = (s, size) => s.length * size * MONO_RATIO;
const r = (n) => Math.round(n * 1000) / 1000;

const doc = (h, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<style>.sans{font-family:${SANS}}.mono{font-family:${MONO}}</style>
${body}
</svg>
`;

const cardRect = (t, h) => `<rect x="0.5" y="0.5" width="${W - 1}" height="${h - 1}" rx="14" fill="${t.card}" stroke="${t.border}"/>`;

// Fade-in that starts transparent immediately; if SMIL is unsupported the element just stays visible.
const fadeIn = (delay, dur = 0.5) =>
  delay === 0
    ? `<animate attributeName="opacity" values="0;1" dur="${dur}s" fill="freeze"/>`
    : `<animate attributeName="opacity" values="0;0;1" keyTimes="0;${r(delay / (delay + dur))};1" dur="${delay + dur}s" fill="freeze"/>`;

// Discrete step animation: values[i] is active from times[i] until times[i+1].
const steps = (attr, values, times, total) =>
  `<animate attributeName="${attr}" values="${values.join(';')}" keyTimes="${times.map((x) => r(x / total)).join(';')}" calcMode="discrete" dur="${total}s" repeatCount="indefinite"/>`;

// ---------- header ----------
function header(t) {
  const h = 252;
  let chips = '';
  let cx = 32;
  for (const c of PROFILE.tools) {
    const w = monoW(c, 12.5) + 22;
    chips += `<rect x="${r(cx)}" y="200" width="${r(w)}" height="28" rx="7" fill="${t.subtle}" stroke="${t.border}"/>`;
    chips += `<text class="mono" x="${r(cx + 11)}" y="218.5" font-size="12.5" fill="${t.text}">${esc(c)}</text>`;
    cx += w + 8;
  }
  const g = (d, inner) => `<g>${fadeIn(d)}${inner}</g>`;
  const body = [
    cardRect(t, h),
    g(0, `<text class="mono" x="32" y="44" font-size="13" fill="${t.muted}">→ initialize · <tspan fill="${t.green}">● connected</tspan></text>`),
    g(0.15, `<text class="sans" x="32" y="92" font-size="32" font-weight="600" fill="${t.text}">${esc(PROFILE.name)}</text>`),
    g(0.3, `<text class="mono" x="32" y="122" font-size="15" fill="${t.blue}">${esc(PROFILE.role)}</text>`),
    g(0.45, PROFILE.bio.map((line, i) => `<text class="sans" x="32" y="${160 + i * 22}" font-size="15" fill="${t.muted}">${esc(line)}</text>`).join('')),
    g(0.6, chips),
  ].join('\n');
  return doc(h, `${PROFILE.name} — ${PROFILE.role}`, body);
}

// ---------- pillar cards ----------
const ICONS = {
  layout: (c) => `<rect x="33" y="35" width="22" height="18" rx="3" fill="none" stroke="${c}" stroke-width="2"/><path d="M33 41H55M40 41V53" fill="none" stroke="${c}" stroke-width="2"/>`,
  braces: (c) => `<text class="mono" x="44" y="49.5" font-size="15" font-weight="700" text-anchor="middle" fill="${c}">{ }</text>`,
  sparkle: (c) => `<path d="M44 32C45 40 48 43 56 44C48 45 45 48 44 56C43 48 40 45 32 44C40 43 43 40 44 32Z" fill="${c}"/>`,
};

function pillar(t, { label, color, icon, title, desc, demoH, demo }) {
  const top = label ? 58 : 0; // 24px breathing room above section label
  const ch = 86 + demoH + 24;
  const parts = [];
  if (label) parts.push(`<text class="mono" x="2" y="38" font-size="12" letter-spacing="0.5" fill="${t.muted}">${esc(label)}</text>`);
  parts.push(`<g transform="translate(0,${top})">`);
  parts.push(cardRect(t, ch));
  parts.push(`<rect x="24" y="24" width="40" height="40" rx="10" fill="${t[color + 'Bg']}"/>`);
  parts.push(ICONS[icon](t[color]));
  parts.push(`<text class="sans" x="80" y="42" font-size="16" font-weight="600" fill="${t.text}">${esc(title)}</text>`);
  parts.push(`<text class="sans" x="80" y="63" font-size="13.5" fill="${t.muted}">${esc(desc)}</text>`);
  parts.push(`<rect x="24.5" y="86.5" width="${W - 49}" height="${demoH - 1}" rx="10" fill="${t.subtle}" stroke="${t.border}"/>`);
  parts.push(demo);
  parts.push('</g>');
  return { h: top + ch, body: parts.join('\n') };
}

function interfaces(t) {
  // Typing effect without animated clipPaths (iOS Safari ignores those inside <img>):
  // each phrase toggles its opacity, and a box-colored cover slides right to reveal it.
  const period = 15;
  const slot = period / PHRASES.length;
  const x0 = 40;
  const x1 = W - 48;
  const slotTimes = [0, ...PHRASES.map((_, i) => (i + 1) * slot).slice(0, -1)];
  let demo = '';
  PHRASES.forEach((p, i) => {
    const vals = PHRASES.map((_, k) => (k === i ? 1 : 0));
    demo += `<text class="mono" x="44" y="115" font-size="13.5" fill="${t.text}" opacity="${vals[0]}">`;
    demo += steps('opacity', vals, slotTimes, period);
    demo += `${esc(p)}</text>`;
  });
  // cover timeline (per slot): hidden text -> typed in 2.4s -> hold -> reset
  const kt = [];
  const xs = [];
  PHRASES.forEach((_, i) => {
    const s = i * slot;
    kt.push(s, s + 2.4, s + slot - 0.01);
    xs.push(x0, x1, x1);
  });
  kt.push(period);
  xs.push(x0);
  const ws = xs.map((x) => x1 - x);
  const keyTimes = kt.map((k) => r(k / period)).join(';');
  demo += `<rect x="${x1}" y="96" width="0" height="28" fill="${t.subtle}">`;
  demo += `<animate attributeName="x" values="${xs.join(';')}" keyTimes="${keyTimes}" dur="${period}s" repeatCount="indefinite"/>`;
  demo += `<animate attributeName="width" values="${ws.join(';')}" keyTimes="${keyTimes}" dur="${period}s" repeatCount="indefinite"/>`;
  demo += `</rect>`;
  const { h, body } = pillar(t, {
    label: '// WHAT I DO', color: 'blue', icon: 'layout', title: 'Interfaces',
    desc: 'Fast, accessible, pixel-careful UI for web, desktop and mobile.', demoH: 48, demo,
  });
  return doc(h, 'Interfaces — fast, accessible, pixel-careful UI for web, desktop and mobile', body);
}

function apis(t) {
  const size = 12.5;
  const gap = 64;
  const widths = API_FLOW.map((s) => monoW(s, size) + 24);
  let x = 44; // left-aligned, matches text inset in other cards
  const period = 2.7;
  const times = API_FLOW.map((_, i) => (i * period) / API_FLOW.length);
  let demo = '';
  API_FLOW.forEach((s, i) => {
    const w = widths[i];
    const on = API_FLOW.map((_, k) => k === i);
    const pick = (a, b) => on.map((v) => (v ? a : b));
    demo += `<rect x="${r(x)}" y="96" width="${r(w)}" height="28" rx="7" fill="${i === 0 ? t.orangeBg : t.card}" stroke="${i === 0 ? t.orange : t.border}">`;
    demo += steps('fill', pick(t.orangeBg, t.card), times, period);
    demo += steps('stroke', pick(t.orange, t.border), times, period);
    demo += `</rect>`;
    demo += `<text class="mono" x="${r(x + w / 2)}" y="114.5" font-size="${size}" text-anchor="middle" fill="${i === 0 ? t.orange : t.text}">`;
    demo += steps('fill', pick(t.orange, t.text), times, period);
    demo += `${esc(s)}</text>`;
    if (i < API_FLOW.length - 1) {
      const a = x + w + 14;
      const b = x + w + gap - 14;
      demo += `<path d="M${r(a)} 110H${r(b)}M${r(b - 5)} 105L${r(b)} 110L${r(b - 5)} 115" fill="none" stroke="${t.muted}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    x += w + gap;
  });
  const { h, body } = pillar(t, {
    color: 'orange', icon: 'braces', title: 'APIs',
    desc: 'Typed end to end — one schema, zero guesswork between back and front.', demoH: 48, demo,
  });
  return doc(h, 'APIs — typed end to end from schema to client', body);
}

function ai(t) {
  // timeline: planner → builder → reviewer → kyrylo approves → merged (held a bit longer)
  const times = [0, 1.3, 2.6, 3.9, 5.2];
  const period = 7.8;
  const rows = [
    { name: 'planner', glyph: '├─' },
    { name: 'builder', glyph: '├─' },
    { name: 'reviewer', glyph: '├─' },
    { name: 'kyrylo', glyph: '└─', me: true },
  ];
  const stateAt = (row, step) => {
    if (row < 3) return step < row ? 'queued' : step === row ? 'running' : 'done';
    return step < 3 ? 'waiting' : step === 3 ? 'approving' : 'merged';
  };
  const LABELS = {
    queued: ['○ queued', 'muted'], running: ['● running', 'purple'], done: ['✓ done', 'green'],
    waiting: ['○ waiting', 'muted'], approving: ['▸ approving', 'blue'], merged: ['✓ merged', 'green'],
  };
  let demo = `<text class="mono" x="44" y="112" font-size="13" fill="${t.muted}">$ orchestrate feature/checkout</text>`;
  rows.forEach((row, i) => {
    const y = 136 + i * 22;
    demo += `<text class="mono" x="44" y="${y}" font-size="13" fill="${t.muted}">${row.glyph}</text>`;
    demo += `<text class="mono" x="72" y="${y}" font-size="13" fill="${row.me ? t.text : t.muted}"${row.me ? ' font-weight="700"' : ''}>${row.name}</text>`;
    const states = i < 3 ? ['queued', 'running', 'done'] : ['waiting', 'approving', 'merged'];
    for (const st of states) {
      const vals = times.map((_, s) => (stateAt(i, s) === st ? 1 : 0));
      const [text, c] = LABELS[st];
      demo += `<text class="mono" x="${W - 44}" y="${y}" font-size="13" text-anchor="end" fill="${t[c]}" opacity="${vals[0]}">`;
      demo += steps('opacity', vals, times, period);
      demo += `${esc(text)}</text>`;
    }
  });
  const { h, body } = pillar(t, {
    color: 'purple', icon: 'sparkle', title: 'AI-driven development',
    desc: 'Agents do the heavy lifting. I design, review and decide.', demoH: 136, demo,
  });
  return doc(h, 'AI-driven development — agents do the heavy lifting, I design, review and decide', body);
}

// ---------- stack ----------
function stack(t) {
  const top = 58;
  const left = 24;
  const right = W - 24;
  const size = 12.5;
  let y = 26;
  let inner = '';
  STACK.forEach((g, gi) => {
    inner += `<circle cx="${left + 5}" cy="${y + 9}" r="4.5" fill="${t[g.color]}"/>`;
    inner += `<text class="sans" x="${left + 18}" y="${y + 14}" font-size="14" font-weight="600" fill="${t.text}">${esc(g.title)}</text>`;
    y += 28;
    let x = left;
    g.items.forEach((item) => {
      const w = monoW(item, size) + 20;
      if (x + w > right) { x = left; y += 34; }
      inner += `<rect x="${r(x)}" y="${y}" width="${r(w)}" height="26" rx="7" fill="${t.subtle}" stroke="${t.border}"/>`;
      inner += `<text class="mono" x="${r(x + 10)}" y="${y + 17.5}" font-size="${size}" fill="${t.text}">${esc(item)}</text>`;
      x += w + 8;
    });
    y += 26 + (gi < STACK.length - 1 ? 26 : 0);
  });
  const ch = y + 26;
  const body = [
    `<text class="mono" x="2" y="38" font-size="12" letter-spacing="0.5" fill="${t.muted}">// STACK</text>`,
    `<g transform="translate(0,${top})">`,
    cardRect(t, ch),
    inner,
    '</g>',
  ].join('\n');
  const all = STACK.map((g) => `${g.title}: ${g.items.join(', ')}`).join('. ');
  return doc(top + ch, `Stack. ${all}`, body);
}

// ---------- write ----------
const CARDS = { header, interfaces, apis, ai, stack };
for (const [themeName, t] of Object.entries(THEMES)) {
  for (const [name, fn] of Object.entries(CARDS)) {
    writeFileSync(join(OUT, `${name}-${themeName}.svg`), fn(t));
  }
}
console.log(`Generated ${Object.keys(CARDS).length * 2} SVGs in ${OUT}`);
