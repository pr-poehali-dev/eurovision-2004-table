import { useState, useCallback } from "react";

const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];

const COUNTRIES = [
  { id: 1, name: "Украина", flag: "🇺🇦" },
  { id: 2, name: "Сербия и Черногория", flag: "🇷🇸" },
  { id: 3, name: "Босния и Герцеговина", flag: "🇧🇦" },
  { id: 4, name: "Турция", flag: "🇹🇷" },
  { id: 5, name: "Греция", flag: "🇬🇷" },
  { id: 6, name: "Швейцария", flag: "🇨🇭" },
  { id: 7, name: "Норвегия", flag: "🇳🇴" },
  { id: 8, name: "Румыния", flag: "🇷🇴" },
  { id: 9, name: "Кипр", flag: "🇨🇾" },
  { id: 10, name: "Испания", flag: "🇪🇸" },
  { id: 11, name: "Хорватия", flag: "🇭🇷" },
  { id: 12, name: "Германия", flag: "🇩🇪" },
  { id: 13, name: "Израиль", flag: "🇮🇱" },
  { id: 14, name: "Россия", flag: "🇷🇺" },
  { id: 15, name: "Великобритания", flag: "🇬🇧" },
  { id: 16, name: "Мальта", flag: "🇲🇹" },
  { id: 17, name: "Португалия", flag: "🇵🇹" },
  { id: 18, name: "Швеция", flag: "🇸🇪" },
  { id: 19, name: "Польша", flag: "🇵🇱" },
  { id: 20, name: "Армения", flag: "🇦🇲" },
  { id: 21, name: "Франция", flag: "🇫🇷" },
  { id: 22, name: "Ирландия", flag: "🇮🇪" },
  { id: 23, name: "Нидерланды", flag: "🇳🇱" },
  { id: 24, name: "Латвия", flag: "🇱🇻" },
  { id: 25, name: "Дания", flag: "🇩🇰" },
];

type ScoreMap = Record<number, number>;

export default function Index() {
  const [scores, setScores] = useState<ScoreMap>({});
  const [usedScores, setUsedScores] = useState<Set<number>>(new Set());

  const handleScore = useCallback((countryId: number, score: number) => {
    setScores((prev) => {
      const currentScore = prev[countryId];
      if (currentScore === score) {
        const next = { ...prev };
        delete next[countryId];
        setUsedScores((us) => {
          const s = new Set(us);
          s.delete(score);
          return s;
        });
        return next;
      }
      const oldScore = currentScore;
      setUsedScores((us) => {
        const s = new Set(us);
        if (oldScore !== undefined) s.delete(oldScore);
        s.add(score);
        return s;
      });
      return { ...prev, [countryId]: score };
    });
  }, []);

  const sorted = [...COUNTRIES].sort((a, b) => {
    const sa = scores[a.id] ?? 0;
    const sb = scores[b.id] ?? 0;
    return sb - sa;
  });

  const totalPoints = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleReset = () => {
    setScores({});
    setUsedScores(new Set());
  };

  return (
    <div className="esc-root">
      <header className="esc-header">
        <div className="esc-header-inner">
          <div className="esc-logo-area">
            <div className="esc-heart">♥</div>
            <div>
              <div className="esc-title">EUROVISION</div>
              <div className="esc-subtitle">SONG CONTEST · ISTANBUL 2004</div>
            </div>
          </div>
          <div className="esc-header-right">
            <div className="esc-stat">
              <span className="esc-stat-label">Выдано баллов</span>
              <span className="esc-stat-value">{totalPoints}</span>
            </div>
            <div className="esc-stat">
              <span className="esc-stat-label">Стран оценено</span>
              <span className="esc-stat-value">{Object.keys(scores).length}</span>
            </div>
            <button className="esc-reset-btn" onClick={handleReset}>
              Сброс
            </button>
          </div>
        </div>
      </header>

      <main className="esc-main">
        <div className="esc-table-wrap">
          <table className="esc-table">
            <thead>
              <tr className="esc-thead-row">
                <th className="esc-th esc-th-place">#</th>
                <th className="esc-th esc-th-country">Страна</th>
                <th className="esc-th esc-th-points">Очки</th>
                <th className="esc-th esc-th-scores">Голосование</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((country, idx) => {
                const myScore = scores[country.id];
                const isScored = myScore !== undefined;
                const isFirst = idx === 0 && isScored;
                const isTop3 = idx < 3 && isScored;

                return (
                  <tr
                    key={country.id}
                    className={`esc-row ${isFirst ? "esc-row-gold" : isTop3 ? "esc-row-top" : ""}`}
                    style={{ "--row-idx": idx } as React.CSSProperties}
                  >
                    <td className="esc-td esc-td-place">
                      <span className={`esc-place-badge ${isFirst ? "esc-place-gold" : isTop3 ? "esc-place-silver" : ""}`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="esc-td esc-td-country">
                      <span className="esc-flag">{country.flag}</span>
                      <span className="esc-name">{country.name}</span>
                    </td>
                    <td className="esc-td esc-td-points">
                      <span className={`esc-score-display ${isScored ? "esc-score-active" : ""}`}>
                        {myScore ?? "—"}
                      </span>
                    </td>
                    <td className="esc-td esc-td-scores">
                      <div className="esc-btn-row">
                        {SCORES.map((s) => {
                          const isSelected = myScore === s;
                          const isDisabled = usedScores.has(s) && !isSelected;
                          return (
                            <button
                              key={s}
                              className={`esc-score-btn ${isSelected ? "esc-score-btn-selected" : ""} ${isDisabled ? "esc-score-btn-disabled" : ""}`}
                              onClick={() => !isDisabled && handleScore(country.id, s)}
                              disabled={isDisabled}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      <style>{`
        .esc-root {
          min-height: 100vh;
          background: #04063d;
          background-image:
            radial-gradient(ellipse at 20% 10%, rgba(0,90,200,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 80%, rgba(160,40,180,0.12) 0%, transparent 55%),
            repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px),
            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px);
          font-family: 'IBM Plex Sans', sans-serif;
          color: #e8e8ff;
        }

        .esc-header {
          background: linear-gradient(180deg, #01020f 0%, #050a2e 100%);
          border-bottom: 2px solid #c9a84c;
          padding: 18px 0 14px;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 30px rgba(0,0,0,0.7);
        }

        .esc-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .esc-logo-area {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .esc-heart {
          font-size: 36px;
          color: #c9a84c;
          line-height: 1;
          filter: drop-shadow(0 0 10px rgba(201,168,76,0.8));
          animation: pulse-heart 2s ease-in-out infinite;
        }

        @keyframes pulse-heart {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .esc-title {
          font-family: 'Oswald', sans-serif;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: 6px;
          color: #c9a84c;
          text-shadow: 0 0 20px rgba(201,168,76,0.5);
          line-height: 1;
        }

        .esc-subtitle {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 3px;
          color: rgba(201,168,76,0.6);
          margin-top: 3px;
        }

        .esc-header-right {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .esc-stat {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .esc-stat-label {
          font-size: 10px;
          letter-spacing: 1.5px;
          color: rgba(200,200,255,0.4);
          text-transform: uppercase;
        }

        .esc-stat-value {
          font-family: 'Oswald', sans-serif;
          font-size: 22px;
          font-weight: 600;
          color: #c9a84c;
          line-height: 1;
        }

        .esc-reset-btn {
          font-family: 'Oswald', sans-serif;
          font-size: 13px;
          letter-spacing: 2px;
          padding: 8px 20px;
          background: transparent;
          border: 1px solid rgba(201,168,76,0.4);
          color: rgba(201,168,76,0.7);
          cursor: pointer;
          text-transform: uppercase;
          transition: all 0.2s;
          border-radius: 2px;
        }

        .esc-reset-btn:hover {
          background: rgba(201,168,76,0.1);
          border-color: #c9a84c;
          color: #c9a84c;
        }

        .esc-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 16px 80px;
        }

        .esc-table-wrap {
          overflow-x: auto;
          border-radius: 4px;
          border: 1px solid rgba(201,168,76,0.2);
          box-shadow: 0 0 60px rgba(0,0,0,0.5);
        }

        .esc-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }

        .esc-thead-row {
          background: linear-gradient(180deg, #0d1a5e 0%, #091244 100%);
          border-bottom: 2px solid #c9a84c;
        }

        .esc-th {
          font-family: 'Oswald', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #c9a84c;
          padding: 14px 12px;
          text-align: left;
        }

        .esc-th-place { width: 52px; text-align: center; }
        .esc-th-points { width: 80px; text-align: center; }
        .esc-th-country { min-width: 180px; }
        .esc-th-scores { min-width: 380px; }

        .esc-row {
          background: rgba(4, 6, 61, 0.6);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: background 0.4s ease, transform 0.5s cubic-bezier(0.34, 1.2, 0.64, 1);
          animation: row-appear 0.35s ease both;
          animation-delay: calc(var(--row-idx, 0) * 0.025s);
        }

        @keyframes row-appear {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .esc-row:hover {
          background: rgba(13, 26, 94, 0.7);
        }

        .esc-row-top {
          background: rgba(8, 20, 70, 0.85);
        }

        .esc-row-gold {
          background: linear-gradient(90deg, rgba(30, 20, 0, 0.9) 0%, rgba(8,20,70,0.9) 100%);
          border-bottom: 1px solid rgba(201,168,76,0.25);
        }

        .esc-td {
          padding: 10px 12px;
          vertical-align: middle;
        }

        .esc-td-place { text-align: center; }
        .esc-td-points { text-align: center; }

        .esc-place-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          font-family: 'Oswald', sans-serif;
          font-size: 13px;
          font-weight: 600;
          background: rgba(255,255,255,0.06);
          color: rgba(200,200,255,0.4);
          transition: all 0.4s ease;
        }

        .esc-place-silver {
          background: rgba(192,192,220,0.15);
          color: #c0c0dc;
          box-shadow: 0 0 12px rgba(192,192,220,0.2);
        }

        .esc-place-gold {
          background: rgba(201,168,76,0.2);
          color: #c9a84c;
          box-shadow: 0 0 16px rgba(201,168,76,0.4);
        }

        .esc-flag {
          font-size: 20px;
          margin-right: 10px;
          filter: drop-shadow(0 1px 3px rgba(0,0,0,0.5));
        }

        .esc-name {
          font-size: 14px;
          font-weight: 400;
          color: #d0d4ff;
          letter-spacing: 0.3px;
        }

        .esc-score-display {
          font-family: 'Oswald', sans-serif;
          font-size: 22px;
          font-weight: 600;
          color: rgba(200,200,255,0.2);
          transition: all 0.3s ease;
          display: inline-block;
          min-width: 32px;
        }

        .esc-score-active {
          color: #c9a84c;
          text-shadow: 0 0 14px rgba(201,168,76,0.6);
        }

        .esc-btn-row {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          align-items: center;
        }

        .esc-score-btn {
          font-family: 'Oswald', sans-serif;
          font-size: 13px;
          font-weight: 500;
          width: 32px;
          height: 30px;
          border: 1px solid rgba(100,120,220,0.25);
          background: rgba(20,30,100,0.5);
          color: rgba(160,180,255,0.7);
          cursor: pointer;
          border-radius: 3px;
          transition: all 0.18s ease;
          line-height: 1;
          padding: 0;
        }

        .esc-score-btn:hover:not(:disabled) {
          background: rgba(40,60,180,0.6);
          border-color: rgba(160,180,255,0.5);
          color: #d0d8ff;
          transform: translateY(-2px);
          box-shadow: 0 3px 10px rgba(0,0,60,0.5);
        }

        .esc-score-btn-selected {
          background: linear-gradient(135deg, #b8920c 0%, #e8c547 100%) !important;
          border-color: #e8c547 !important;
          color: #1a1000 !important;
          box-shadow: 0 0 12px rgba(201,168,76,0.5);
          transform: translateY(-1px);
          font-weight: 700;
        }

        .esc-score-btn-disabled {
          opacity: 0.18;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .esc-title { font-size: 20px; letter-spacing: 4px; }
          .esc-score-btn { width: 28px; height: 26px; font-size: 11px; }
          .esc-btn-row { gap: 3px; }
          .esc-name { font-size: 13px; }
        }
      `}</style>
    </div>
  );
}
