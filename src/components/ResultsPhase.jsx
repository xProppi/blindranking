import { useState } from "react";

export default function ResultsPhase({ players, rankings, selectedTopic, onReset, rankingSize }) {
  const getRankEmoji = (index) => {
    const emojis = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    return emojis[index] || '10';
  };

  const getRankColor = (index) => {
    if (index === 0) return 'linear-gradient(135deg, #fbbf24, #f59e0b)';
    if (index === 1) return 'linear-gradient(135deg, #6b7280, #4b5563)';
    if (index === 2) return 'linear-gradient(135deg, #ea580c, #dc2626)';
    const hue = 240 - index * 20;
    return `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${hue - 20}, 70%, 40%))`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      padding: '40px 20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Title */}
      <div style={{
        maxWidth: '100%',
        margin: '0 auto 40px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.25)'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #059669, #10b981)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          Final Rankings
        </h1>
        <p style={{ fontSize: '1.3rem', color: '#6b7280', fontWeight: '600' }}>
          Results for {selectedTopic}
        </p>
      </div>

      {/* Results Grid */}
      <div style={{
        maxWidth: '100%',
        margin: '0 auto 40px',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr',
          gap: '25px',
          alignItems: 'start'
        }}>
          {/* Rank Labels */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingTop: '70px'
          }}>
            {Array.from({ length: rankingSize }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '140px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '18px',
                  borderRadius: '14px',
                  background: getRankColor(i),
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
                  border: i < 3 ? '3px solid rgba(255, 255, 255, 0.3)' : 'none'
                }}
              >
                #{getRankEmoji(i)}
              </div>
            ))}
          </div>

          {/* Players Results */}
          <div>
            {/* Player Headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${players.length}, 1fr)`,
              gap: '14px',
              marginBottom: '14px'
            }}>
              {players.map((player, i) => (
                <div
                  key={player}
                  style={{
                    background: `hsl(${i * 60}, 70%, 50%)`,
                    color: 'white',
                    fontWeight: '800',
                    fontSize: '19px',
                    padding: '20px',
                    textAlign: 'center',
                    borderRadius: '14px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {player}
                </div>
              ))}
            </div>

            {/* Results Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${players.length}, 1fr)`,
              gap: '14px'
            }}>
              {Array.from({ length: rankingSize * players.length }).map((_, index) => {
                const rankIndex = Math.floor(index / players.length);
                const playerIndex = index % players.length;
                const player = players[playerIndex];
                const item = rankings[player][rankIndex];

                return (
                  <div
                    key={`${player}-${rankIndex}`}
                    style={{
                      width: '100%',
                      height: '140px',
                      borderRadius: '14px',
                      border: item ? '3px solid #e2e8f0' : '3px dashed #fca5a5',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: item
                        ? 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
                        : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                      boxShadow: item
                        ? '0 8px 20px rgba(0, 0, 0, 0.12)'
                        : '0 4px 12px rgba(252, 165, 165, 0.3)'
                    }}
                  >
                    {item ? (
                      <>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '12px',
                            marginBottom: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                          }}
                        />
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#1e293b',
                          textAlign: 'center',
                          maxWidth: '90%'
                        }}>
                          {item.name}
                        </div>
                      </>
                    ) : (
                      <div style={{
                        color: '#ef4444',
                        fontSize: '14px',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        Not selected
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* New Game Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          style={{
            padding: '22px 50px',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '20px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)'
          }}
          onClick={onReset}
        >
          Start New Ranking
        </button>
      </div>
    </div>
  );
}