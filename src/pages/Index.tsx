import { useState, useRef, useLayoutEffect } from "react";

const SCORE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];

const COUNTRIES = [
  { id: 1,  name: "SERBIA & MONT.",   flag: "🇷🇸" },
  { id: 2,  name: "UKRAINE",          flag: "🇺🇦" },
  { id: 3,  name: "GREECE",           flag: "🇬🇷" },
  { id: 4,  name: "TURKEY",           flag: "🇹🇷" },
  { id: 5,  name: "CYPRUS",           flag: "🇨🇾" },
  { id: 6,  name: "SWEDEN",           flag: "🇸🇪" },
  { id: 7,  name: "ALBANIA",          flag: "🇦🇱" },
  { id: 8,  name: "GERMANY",          flag: "🇩🇪" },
  { id: 9,  name: "SPAIN",            flag: "🇪🇸" },
  { id: 10, name: "BOSNIA & HERZ.",   flag: "🇧🇦" },
  { id: 11, name: "RUSSIA",           flag: "🇷🇺" },
  { id: 12, name: "F.Y.R MACEDONIA",  flag: "🇲🇰" },
  { id: 13, name: "MALTA",            flag: "🇲🇹" },
  { id: 14, name: "CROATIA",          flag: "🇭🇷" },
  { id: 15, name: "FRANCE",           flag: "🇫🇷" },
  { id: 16, name: "UNITED KINGDOM",   flag: "🇬🇧" },
  { id: 17, name: "ROMANIA",          flag: "🇷🇴" },
  { id: 18, name: "POLAND",           flag: "🇵🇱" },
  { id: 19, name: "NETHERLANDS",      flag: "🇳🇱" },
  { id: 20, name: "AUSTRIA",          flag: "🇦🇹" },
  { id: 21, name: "IRELAND",          flag: "🇮🇪" },
  { id: 22, name: "ICELAND",          flag: "🇮🇸" },
  { id: 23, name: "BELGIUM",          flag: "🇧🇪" },
  { id: 24, name: "NORWAY",           flag: "🇳🇴" },
];

type ScoreMap = Record<number, number>;

const ROW_H = 38;
const GAP = 3;
const STEP = ROW_H + GAP;

function getSorted(scores: ScoreMap) {
  return [...COUNTRIES].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));
}

export default function Index() {
  const [scores, setScores] = useState<ScoreMap>({});
  const [usedScores, setUsedScores] = useState<Set<number>>(new Set());
  const [votingCountry, setVotingCountry] = useState<string>("IRELAND");
  const [animating, setAnimating] = useState(false);

  const sorted = getSorted(scores);
  const totalPoints = Object.values(scores).reduce((a, b) => a + b, 0);

  const posMapRef = useRef<Record<number, number>>({});
  const itemsRef = useRef<Record<number, HTMLDivElement | null>>({});

  useLayoutEffect(() => {
    sorted.forEach((c, idx) => {
      posMapRef.current[c.id] = idx;
    });
  }, []);

  function handleScore(countryId: number, score: number) {
    if (animating) return;

    const prevSorted = getSorted(scores);
    const prevPositions: Record<number, number> = {};
    prevSorted.forEach((c, i) => { prevPositions[c.id] = i; });

    let newScores: ScoreMap;
    let newUsed: Set<number>;

    const currentScore = scores[countryId];
    if (currentScore === score) {
      newScores = { ...scores };
      delete newScores[countryId];
      newUsed = new Set(usedScores);
      newUsed.delete(score);
    } else {
      newScores = { ...scores, [countryId]: score };
      newUsed = new Set(usedScores);
      if (currentScore !== undefined) newUsed.delete(currentScore);
      newUsed.add(score);
    }

    const nextSorted = getSorted(newScores);
    const nextPositions: Record<number, number> = {};
    nextSorted.forEach((c, i) => { nextPositions[c.id] = i; });

    COUNTRIES.forEach((c) => {
      const el = itemsRef.current[c.id];
      if (!el) return;
      const from = prevPositions[c.id] ?? 0;
      const to = nextPositions[c.id] ?? 0;
      const delta = (from - to) * STEP;
      if (delta !== 0) {
        el.style.transition = "none";
        el.style.transform = `translateY(${delta}px)`;
        el.style.zIndex = delta < 0 ? "10" : "5";
      }
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimating(true);
        COUNTRIES.forEach((c) => {
          const el = itemsRef.current[c.id];
          if (!el) return;
          el.style.transition = "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)";
          el.style.transform = "translateY(0px)";
        });
        setTimeout(() => {
          COUNTRIES.forEach((c) => {
            const el = itemsRef.current[c.id];
            if (!el) return;
            el.style.zIndex = "";
          });
          setScores(newScores);
          setUsedScores(newUsed);
          setAnimating(false);
        }, 680);
      });
    });
  }

  function handleReset() {
    setScores({});
    setUsedScores(new Set());
  }

  const displaySorted = animating ? getSorted(scores) : getSorted(scores);

  return (
    <div className="esc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .esc-root {
          min-height: 100vh;
          background: #1a0000;
          background-image:
            radial-gradient(ellipse at 50% 0%, #6b0000 0%, #2a0000 40%, #0d0000 100%);
          font-family: 'Oswald', sans-serif;
          color: #fff;
          display: flex;
          flex-direction: column;
        }

        /* ── HEADER ── */
        .esc-header {
          background: linear-gradient(180deg, #000 0%, #1a0000 100%);
          border-bottom: 3px solid #c9a84c;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 200;
          box-shadow: 0 4px 24px rgba(0,0,0,0.8);
        }

        .esc-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .esc-heart-logo {
          color: #c9a84c;
          font-size: 32px;
          filter: drop-shadow(0 0 8px rgba(201,168,76,0.9));
          animation: beat 1.6s ease-in-out infinite;
        }

        @keyframes beat {
          0%,100% { transform: scale(1); }
          15% { transform: scale(1.18); }
          30% { transform: scale(1); }
          45% { transform: scale(1.1); }
        }

        .esc-logo-text { line-height: 1; }
        .esc-logo-title {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 5px;
          color: #c9a84c;
          text-shadow: 0 0 16px rgba(201,168,76,0.6);
        }
        .esc-logo-sub {
          font-size: 9px;
          font-weight: 300;
          letter-spacing: 3px;
          color: rgba(201,168,76,0.55);
          font-family: 'IBM Plex Sans', sans-serif;
          margin-top: 2px;
        }

        .esc-header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .esc-voting-label {
          font-size: 11px;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.4);
          font-family: 'IBM Plex Sans', sans-serif;
        }

        .esc-voting-country {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 2px;
          color: #fff;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 4px 14px;
          border-radius: 2px;
        }

        .esc-reset-btn {
          font-family: 'Oswald', sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          padding: 6px 16px;
          background: transparent;
          border: 1px solid rgba(201,168,76,0.35);
          color: rgba(201,168,76,0.65);
          cursor: pointer;
          text-transform: uppercase;
          transition: all 0.2s;
          border-radius: 2px;
        }
        .esc-reset-btn:hover {
          background: rgba(201,168,76,0.12);
          border-color: #c9a84c;
          color: #c9a84c;
        }

        /* ── MAIN LAYOUT ── */
        .esc-main {
          display: flex;
          flex: 1;
          gap: 0;
          padding: 28px 24px 40px;
          max-width: 1300px;
          width: 100%;
          margin: 0 auto;
          align-items: flex-start;
        }

        /* ── SCOREBOARD ── */
        .esc-board {
          flex: 1;
          position: relative;
          min-width: 0;
        }

        .esc-board-title {
          font-size: 11px;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 10px;
          font-family: 'IBM Plex Sans', sans-serif;
        }

        .esc-board-list {
          position: relative;
          height: calc(${COUNTRIES.length} * ${STEP}px);
        }

        .esc-item {
          position: absolute;
          left: 0;
          right: 0;
          height: ${ROW_H}px;
          display: flex;
          align-items: center;
          gap: 0;
          will-change: transform;
          cursor: default;
        }

        .esc-item-inner {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          overflow: hidden;
          transition: background 0.3s;
        }

        .esc-item-inner:hover {
          background: rgba(255,255,255,0.1);
        }

        .esc-item-inner.is-leader {
          background: rgba(201,168,76,0.12);
          border-color: rgba(201,168,76,0.3);
        }

        .esc-item-rank {
          width: 36px;
          text-align: center;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.35);
          flex-shrink: 0;
        }

        .esc-item-heart {
          width: 26px;
          text-align: center;
          font-size: 14px;
          flex-shrink: 0;
          color: #c9a84c;
          filter: drop-shadow(0 0 4px rgba(201,168,76,0.7));
        }

        .esc-item-flag {
          font-size: 16px;
          margin-right: 6px;
          flex-shrink: 0;
        }

        .esc-item-name {
          flex: 1;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1px;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .esc-item-pts {
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          min-width: 42px;
          text-align: right;
          padding-right: 12px;
          letter-spacing: 1px;
        }

        .esc-item-pts.has-score {
          color: #f9e07a;
          text-shadow: 0 0 10px rgba(249,224,122,0.5);
        }

        /* ── VOTING PANEL ── */
        .esc-panel {
          width: 320px;
          flex-shrink: 0;
          margin-left: 28px;
        }

        .esc-panel-title {
          font-size: 11px;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 10px;
          font-family: 'IBM Plex Sans', sans-serif;
        }

        .esc-vote-list {
          display: flex;
          flex-direction: column;
          gap: ${GAP}px;
        }

        .esc-vote-item {
          display: flex;
          align-items: center;
          height: ${ROW_H}px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 2px;
          overflow: hidden;
          gap: 0;
          cursor: pointer;
          transition: background 0.15s;
        }

        .esc-vote-item:hover {
          background: rgba(255,255,255,0.09);
        }

        .esc-vote-flag {
          font-size: 15px;
          width: 34px;
          text-align: center;
          flex-shrink: 0;
        }

        .esc-vote-name {
          flex: 1;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.8px;
          color: rgba(255,255,255,0.8);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .esc-vote-score-btns {
          display: flex;
          gap: 2px;
          padding-right: 6px;
        }

        .esc-score-btn {
          font-family: 'Oswald', sans-serif;
          font-size: 11px;
          font-weight: 600;
          width: 22px;
          height: 26px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.15s;
          padding: 0;
          line-height: 1;
        }

        .esc-score-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.15);
          color: #fff;
          transform: translateY(-1px);
        }

        .esc-score-btn.selected {
          background: linear-gradient(135deg, #c9a84c, #f0d060) !important;
          border-color: #f0d060 !important;
          color: #1a0a00 !important;
          box-shadow: 0 0 8px rgba(201,168,76,0.6);
          font-weight: 700;
        }

        .esc-score-btn:disabled {
          opacity: 0.15;
          cursor: not-allowed;
        }

        /* ── FOOTER BANNER ── */
        .esc-banner {
          background: linear-gradient(90deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.18) 50%, rgba(201,168,76,0.08) 100%);
          border-top: 1px solid rgba(201,168,76,0.3);
          border-bottom: 1px solid rgba(201,168,76,0.3);
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0 24px 28px;
          border-radius: 2px;
        }

        .esc-banner-country {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 4px;
          color: #fff;
        }

        .esc-banner-heart {
          color: #c9a84c;
          font-size: 22px;
          filter: drop-shadow(0 0 8px rgba(201,168,76,0.8));
        }

        .esc-banner-pts {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          font-family: 'IBM Plex Sans', sans-serif;
          letter-spacing: 1px;
        }

        @media (max-width: 860px) {
          .esc-main { flex-direction: column; padding: 16px; }
          .esc-panel { width: 100%; margin-left: 0; margin-top: 24px; }
          .esc-score-btn { width: 20px; height: 24px; font-size: 10px; }
        }
      `}</style>

      {/* HEADER */}
      <header className="esc-header">
        <div className="esc-logo">
          <div className="esc-heart-logo">♥</div>
          <div className="esc-logo-text">
            <div className="esc-logo-title">EUROVISION</div>
            <div className="esc-logo-sub">SONG CONTEST · ISTANBUL 2004</div>
          </div>
        </div>
        <div className="esc-header-right">
          <div>
            <div className="esc-voting-label">ГОЛОСУЕТ</div>
            <div className="esc-voting-country">{votingCountry}</div>
          </div>
          <button className="esc-reset-btn" onClick={handleReset}>Сброс</button>
        </div>
      </header>

      {/* BANNER */}
      <div className="esc-banner">
        <span className="esc-banner-country">{votingCountry}</span>
        <span className="esc-banner-heart">♥</span>
        <span className="esc-banner-pts">Выдано очков: {totalPoints} · Оценено стран: {Object.keys(scores).length}</span>
      </div>

      <main className="esc-main">
        {/* SCOREBOARD */}
        <div className="esc-board">
          <div className="esc-board-title">ТАБЛИЦА РЕЗУЛЬТАТОВ</div>
          <div className="esc-board-list">
            {getSorted(scores).map((country, idx) => {
              const pts = scores[country.id] ?? 0;
              const isLeader = idx === 0 && pts > 0;
              return (
                <div
                  key={country.id}
                  className="esc-item"
                  style={{ top: `${idx * STEP}px` }}
                  ref={(el) => { itemsRef.current[country.id] = el; }}
                >
                  <div className={`esc-item-inner ${isLeader ? "is-leader" : ""}`}>
                    <div className="esc-item-rank">{idx + 1}</div>
                    <div className="esc-item-heart">{pts > 0 ? "♥" : "○"}</div>
                    <div className="esc-item-flag">{country.flag}</div>
                    <div className="esc-item-name">{country.name}</div>
                    <div className={`esc-item-pts ${pts > 0 ? "has-score" : ""}`}>
                      {pts > 0 ? pts : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* VOTING PANEL */}
        <div className="esc-panel">
          <div className="esc-panel-title">ПРИСУДИТЬ БАЛЛЫ</div>
          <div className="esc-vote-list">
            {COUNTRIES.map((country) => {
              const myScore = scores[country.id];
              return (
                <div key={country.id} className="esc-vote-item">
                  <div className="esc-vote-flag">{country.flag}</div>
                  <div className="esc-vote-name">{country.name}</div>
                  <div className="esc-vote-score-btns">
                    {SCORE_VALUES.map((s) => {
                      const isSelected = myScore === s;
                      const isDisabled = !isSelected && usedScores.has(s);
                      return (
                        <button
                          key={s}
                          className={`esc-score-btn ${isSelected ? "selected" : ""}`}
                          disabled={isDisabled || animating}
                          onClick={() => handleScore(country.id, s)}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
