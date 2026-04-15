"use client";

import { useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey?: string; value?: number }>;
  label?: number;
}

// ---------------------------------------------------------------------------
// Math helpers
// ---------------------------------------------------------------------------

function comb(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n - k);
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return result;
}

function hypergeoPAtLeastOne(deckSize: number, copies: number, handSize: number): number {
  if (copies <= 0) return 0;
  if (copies >= deckSize) return 1;
  const pZero = comb(deckSize - copies, handSize) / comb(deckSize, handSize);
  return Math.max(0, Math.min(1, 1 - pZero));
}

function hypergeoPZero(deckSize: number, bricks: number, handSize: number): number {
  if (bricks <= 0) return 1;
  if (bricks >= deckSize) return 0;
  return Math.max(0, Math.min(1, comb(deckSize - bricks, handSize) / comb(deckSize, handSize)));
}

// ---------------------------------------------------------------------------
// Thresholds
// ---------------------------------------------------------------------------

const STARTER_THRESHOLD = 85;
const BRICK_THRESHOLD = 66.2;

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

interface StarterPoint {
  starters: number;
  probPct: number;
  belowProb: number;
  aboveProb: number | null;
}

interface BrickPoint {
  bricks: number;
  cleanPct: number;
  safeProb: number | null;
  dangerProb: number | null;
}

// ---------------------------------------------------------------------------
// Tooltips
// ---------------------------------------------------------------------------

function StarterTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const probPct = payload.find((p) => p.dataKey === "probPct")?.value;
  if (probPct == null) return null;
  const isGolden = probPct >= STARTER_THRESHOLD;

  return (
    <div
      className="rounded-lg px-4 py-3 font-mono text-sm shadow-xl"
      style={{
        background: "rgba(15, 15, 26, 0.95)",
        border: `1px solid ${isGolden ? "#c8a84b" : "#2a2a4a"}`,
        boxShadow: isGolden ? "0 0 16px rgba(200,168,75,0.3)" : "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: "#7070a0" }}>
        Starters in Deck
      </p>
      <p className="text-xl font-bold mb-2 text-slate-100">{label}</p>
      <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: "#7070a0" }}>
        Open Rate
      </p>
      <p className="text-xl font-bold" style={{ color: isGolden ? "#c8a84b" : "#a0a0d0" }}>
        {probPct.toFixed(1)}%
      </p>
      {isGolden && (
        <p className="text-[10px] tracking-widest mt-1.5" style={{ color: "#c8a84b" }}>
          ✦ GOLDEN ZONE
        </p>
      )}
    </div>
  );
}

function BrickTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const cleanPct = payload.find((p) => p.dataKey === "cleanPct")?.value;
  if (cleanPct == null) return null;
  const isSafe = cleanPct >= BRICK_THRESHOLD;

  return (
    <div
      className="rounded-lg px-4 py-3 font-mono text-sm shadow-xl"
      style={{
        background: "rgba(15, 15, 26, 0.95)",
        border: `1px solid ${isSafe ? "#2a2a4a" : "#7a1a1a"}`,
        boxShadow: isSafe ? "0 4px 20px rgba(0,0,0,0.4)" : "0 0 16px rgba(180,40,40,0.25)",
      }}
    >
      <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: "#7070a0" }}>
        Bricks in Deck
      </p>
      <p className="text-xl font-bold mb-2 text-slate-100">{label}</p>
      <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: "#7070a0" }}>
        Clean Hand Odds
      </p>
      <p className="text-xl font-bold" style={{ color: isSafe ? "#a0a0d0" : "#e05050" }}>
        {cleanPct.toFixed(1)}%
      </p>
      {!isSafe && (
        <p className="text-[10px] tracking-widest mt-1.5" style={{ color: "#e05050" }}>
          ✖ DANGER ZONE
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function HandCalculator() {
  const [deckSize, setDeckSize] = useState(40);
  const [goingFirst, setGoingFirst] = useState(true);

  const handSize = goingFirst ? 5 : 6;
  const maxStarters = Math.min(deckSize, 40);
  const maxBricks = Math.min(deckSize, 20);

  const starterData: StarterPoint[] = Array.from({ length: maxStarters }, (_, i) => {
    const starters = i + 1;
    const probPct = hypergeoPAtLeastOne(deckSize, starters, handSize) * 100;
    return {
      starters,
      probPct,
      belowProb: probPct < STARTER_THRESHOLD ? probPct : STARTER_THRESHOLD,
      aboveProb: probPct >= STARTER_THRESHOLD ? probPct : null,
    };
  });

  const goldenEntry = starterData.find((d) => d.probPct >= STARTER_THRESHOLD);
  const goldenStarters = goldenEntry?.starters ?? null;

  const brickData: BrickPoint[] = Array.from({ length: maxBricks }, (_, i) => {
    const bricks = i + 1;
    const cleanPct = hypergeoPZero(deckSize, bricks, handSize) * 100;
    const isSafe = cleanPct >= BRICK_THRESHOLD;
    return {
      bricks,
      cleanPct,
      safeProb: isSafe ? cleanPct : BRICK_THRESHOLD,
      dangerProb: !isSafe ? cleanPct : null,
    };
  });

  const lastSafeEntry = [...brickData].reverse().find((d) => d.cleanPct >= BRICK_THRESHOLD);
  const maxSafeBricks = lastSafeEntry?.bricks ?? null;

  const sliderPct = ((deckSize - 40) / 20) * 100;

  return (
    <div className="w-full max-w-xl font-mono">

      {/* ── Header ── */}
      <header className="text-center mb-8">
        <p className="text-[10px] uppercase tracking-[6px] mb-2 opacity-80" style={{ color: "#c8a84b" }}>
          ✦ Duel Analytics ✦
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-widest text-gray-900 dark:text-slate-100">
          Opening Hand Calculator
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 tracking-wide">
          Hypergeometric probability — starters &amp; bricks in your opening hand
        </p>
      </header>

      {/* ── Parameters ── */}
      <section className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-6 shadow-md backdrop-blur-sm border border-gray-200 dark:border-gray-700 mb-6">
        <p className="text-[10px] uppercase tracking-[3px] mb-5 text-gray-400 dark:text-gray-500">
          Parameters
        </p>

        {/* Deck size */}
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2.5">
            <span className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Deck Size
            </span>
            <span className="text-3xl font-bold leading-none" style={{ color: "#c8a84b" }}>
              {deckSize} cards
            </span>
          </div>
          <input
            type="range"
            min={40}
            max={60}
            step={1}
            value={deckSize}
            onChange={(e) => setDeckSize(Number(e.target.value))}
            className="w-full h-1 rounded-sm outline-none cursor-pointer appearance-none slider-gold"
            style={{
              background: `linear-gradient(to right, #c8a84b ${sliderPct}%, #d1d5db ${sliderPct}%)`,
            }}
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-gray-400">40</span>
            <span className="text-[10px] text-gray-400">60</span>
          </div>
        </div>

        {/* Turn order */}
        <div>
          <p className="text-[11px] uppercase tracking-widest mb-3 text-gray-500 dark:text-gray-400">
            Turn Order
          </p>
          <div className="flex gap-3">
            {(
              [
                { label: "Going First", sub: "5 card hand", value: true },
                { label: "Going Second", sub: "6 card hand", value: false },
              ] as const
            ).map((opt) => {
              const active = goingFirst === opt.value;
              return (
                <button
                  key={String(opt.value)}
                  onClick={() => setGoingFirst(opt.value)}
                  className="flex-1 py-3.5 px-3 rounded-xl cursor-pointer text-center transition-all duration-150"
                  style={{
                    background: active
                      ? "rgba(200,168,75,0.1)"
                      : "rgba(0,0,0,0.03)",
                    border: `1px solid ${active ? "#c8a84b" : "rgba(0,0,0,0.1)"}`,
                    boxShadow: active ? "0 0 12px rgba(200,168,75,0.15)" : "none",
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{
                        border: `2px solid ${active ? "#c8a84b" : "#9ca3af"}`,
                        background: active ? "#c8a84b" : "transparent",
                      }}
                    />
                    <span
                      className="text-xs tracking-wide"
                      style={{
                        color: active ? "#c8a84b" : "#6b7280",
                        fontWeight: active ? 700 : 400,
                      }}
                    >
                      {opt.label}
                    </span>
                  </div>
                  <div
                    className="text-[10px] tracking-wide"
                    style={{ color: active ? "#c8a84b" : "#9ca3af" }}
                  >
                    {opt.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════ STARTERS SECTION ════ */}

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-[10px] uppercase tracking-[4px]" style={{ color: "#c8a84b" }}>
          ✦ Starters
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Golden Zone card */}
        <div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-5 text-center shadow-md"
          style={{ border: "1px solid rgba(200,168,75,0.3)" }}
        >
          <p className="text-[9px] uppercase tracking-[2px] mb-2.5 text-gray-400">
            Golden Zone (85%+)
          </p>
          {goldenStarters != null ? (
            <>
              <div className="text-5xl font-bold leading-none" style={{ color: "#c8a84b" }}>
                {goldenStarters}
              </div>
              <div className="text-[11px] mt-1 text-gray-400">starters needed</div>
              <div className="text-sm mt-2.5 font-semibold" style={{ color: "#c8a84b" }}>
                {(hypergeoPAtLeastOne(deckSize, goldenStarters, handSize) * 100).toFixed(1)}% open rate
              </div>
            </>
          ) : (
            <div className="text-sm mt-4 text-gray-400">Not reachable</div>
          )}
        </div>

        {/* Starter reference card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-5 shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-[9px] uppercase tracking-[2px] mb-3 text-gray-400">
            Starter Reference
          </p>
          {[3, 6, 9, 12, 15, 18].filter((c) => c <= deckSize).map((count) => {
            const pPct = hypergeoPAtLeastOne(deckSize, count, handSize) * 100;
            const isGolden = pPct >= STARTER_THRESHOLD;
            return (
              <div
                key={count}
                className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <span className="text-[11px] text-gray-500">{count} starters</span>
                <span
                  className="text-[11px]"
                  style={{
                    color: isGolden ? "#c8a84b" : "#9ca3af",
                    fontWeight: isGolden ? 700 : 400,
                  }}
                >
                  {pPct.toFixed(1)}%{isGolden ? " ✦" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Starters chart */}
      <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg pt-6 px-3 pb-4 mb-8 shadow-md border border-gray-200 dark:border-gray-700">
        <p className="text-[10px] uppercase tracking-[3px] mb-5 pl-2 text-gray-400">
          Starter Open Rate
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={starterData} margin={{ top: 10, right: 16, left: 0, bottom: 24 }}>
            <defs>
              <linearGradient id="goldenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c8a84b" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#c8a84b" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a3a8a" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#4a3a8a" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis
              dataKey="starters"
              tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "'Courier New', monospace" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              label={{ value: "Starters in Deck", position: "insideBottom", offset: -12, fill: "#9ca3af", fontSize: 11, fontFamily: "'Courier New', monospace" }}
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
              tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "'Courier New', monospace" }}
              tickLine={false}
              axisLine={false}
              width={46}
            />
            <Tooltip
              content={<StarterTooltip />}
              cursor={{ stroke: "rgba(200,168,75,0.2)", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area type="monotone" dataKey="aboveProb" fill="url(#goldenGrad)" stroke="none" connectNulls={false} activeDot={false as never} />
            <Area type="monotone" dataKey="belowProb" fill="url(#baseGrad)" stroke="none" activeDot={false as never} />
            <ReferenceLine
              y={STARTER_THRESHOLD}
              stroke="#c8a84b"
              strokeDasharray="6 3"
              strokeOpacity={0.6}
              label={{ value: "85% ✦", position: "insideTopRight", fill: "#c8a84b", fontSize: 10, fontFamily: "'Courier New', monospace", opacity: 0.9 }}
            />
            <Line
              type="monotone"
              dataKey="probPct"
              stroke="#6a5acd"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#c8a84b", stroke: "#fff", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex gap-5 justify-center mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5" style={{ background: "#6a5acd" }} />
            <span className="text-[10px] tracking-wide text-gray-400">Open Rate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-2.5 rounded-sm" style={{ background: "rgba(200,168,75,0.2)", border: "1px solid rgba(200,168,75,0.4)" }} />
            <span className="text-[10px] tracking-wide text-gray-400">Golden Zone ≥85%</span>
          </div>
        </div>
      </section>

      {/* ════ BRICKS SECTION ════ */}

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-[10px] uppercase tracking-[4px]" style={{ color: "#e05050" }}>
          ✖ Bricks
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Safe limit card */}
        <div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-5 text-center shadow-md"
          style={{ border: "1px solid rgba(180,40,40,0.3)" }}
        >
          <p className="text-[9px] uppercase tracking-[2px] mb-2.5 text-gray-400">
            Max Safe Bricks
          </p>
          {maxSafeBricks != null ? (
            <>
              <div className="text-5xl font-bold leading-none" style={{ color: "#e05050" }}>
                {maxSafeBricks}
              </div>
              <div className="text-[11px] mt-1 text-gray-400">brick limit</div>
              <div className="text-sm mt-2.5 font-semibold" style={{ color: "#e05050" }}>
                {(hypergeoPZero(deckSize, maxSafeBricks, handSize) * 100).toFixed(1)}% clean hands
              </div>
              <div className="text-[10px] mt-1.5 text-gray-400">at ≥66.2% threshold</div>
            </>
          ) : (
            <div className="text-sm mt-4 text-gray-400">Exceeds limit</div>
          )}
        </div>

        {/* Brick reference card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-5 shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-[9px] uppercase tracking-[2px] mb-3 text-gray-400">
            Brick Reference
          </p>
          {[1, 2, 3, 4, 5, 6, 8, 10].filter((b) => b <= deckSize).map((bricks) => {
            const cleanPct = hypergeoPZero(deckSize, bricks, handSize) * 100;
            const isSafe = cleanPct >= BRICK_THRESHOLD;
            return (
              <div
                key={bricks}
                className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <span className="text-[11px] text-gray-500">{bricks} bricks</span>
                <span
                  className="text-[11px]"
                  style={{
                    color: isSafe ? "#9ca3af" : "#e05050",
                    fontWeight: isSafe ? 400 : 700,
                  }}
                >
                  {cleanPct.toFixed(1)}%{!isSafe ? " ✖" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bricks chart */}
      <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg pt-6 px-3 pb-4 mb-5 shadow-md border border-gray-200 dark:border-gray-700">
        <p className="text-[10px] uppercase tracking-[3px] mb-5 pl-2 text-gray-400">
          Clean Hand Probability
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={brickData} margin={{ top: 10, right: 16, left: 0, bottom: 24 }}>
            <defs>
              <linearGradient id="safeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a3a8a" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#4a3a8a" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="dangerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b42a2a" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#b42a2a" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis
              dataKey="bricks"
              tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "'Courier New', monospace" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              label={{ value: "Bricks in Deck", position: "insideBottom", offset: -12, fill: "#9ca3af", fontSize: 11, fontFamily: "'Courier New', monospace" }}
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
              tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "'Courier New', monospace" }}
              tickLine={false}
              axisLine={false}
              width={46}
            />
            <Tooltip
              content={<BrickTooltip />}
              cursor={{ stroke: "rgba(180,40,40,0.2)", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area type="monotone" dataKey="safeProb" fill="url(#safeGrad)" stroke="none" connectNulls={false} activeDot={false as never} />
            <Area type="monotone" dataKey="dangerProb" fill="url(#dangerGrad)" stroke="none" connectNulls={false} activeDot={false as never} />
            <ReferenceLine
              y={BRICK_THRESHOLD}
              stroke="#e05050"
              strokeDasharray="6 3"
              strokeOpacity={0.6}
              label={{ value: "66.2% ✖", position: "insideTopRight", fill: "#e05050", fontSize: 10, fontFamily: "'Courier New', monospace", opacity: 0.9 }}
            />
            <Line
              type="monotone"
              dataKey="cleanPct"
              stroke="#6a5acd"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#e05050", stroke: "#fff", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex gap-5 justify-center mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5" style={{ background: "#6a5acd" }} />
            <span className="text-[10px] tracking-wide text-gray-400">Clean Hand %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-2.5 rounded-sm" style={{ background: "rgba(180,40,40,0.25)", border: "1px solid rgba(180,40,40,0.4)" }} />
            <span className="text-[10px] tracking-wide text-gray-400">Danger Zone &lt;66.2%</span>
          </div>
        </div>
      </section>

      {/* Formula footer */}
      <p className="text-center text-[10px] tracking-widest text-gray-300 dark:text-gray-600 mt-2">
        P(clean) = C(N−B, n) / C(N, n) &nbsp;·&nbsp; Hypergeometric Distribution
      </p>

      <style>{`
        .slider-gold::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #c8a84b;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(200,168,75,0.5);
          border: 2px solid #fff;
        }
        .slider-gold::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #c8a84b;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(200,168,75,0.5);
          border: 2px solid #fff;
        }
      `}</style>
    </div>
  );
}
