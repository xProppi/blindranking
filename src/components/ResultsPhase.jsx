import { useState } from "react";
import { getRankColor } from "../utils/helpers";
import useIsMobile from "../hooks/useIsMobile";

export default function ResultsPhase({ playersList, rankings, selectedTopic, onReset, onPlayAgain, isAdmin, rankingSize, playerId }) {
  const isMobile = useIsMobile();
  const [showAllPlayers, setShowAllPlayers] = useState(!isMobile);

  const visiblePlayers = (isMobile && !showAllPlayers)
    ? playersList.filter(p => p.id === playerId)
    : playersList;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111',
      padding: isMobile ? '20px 12px' : '40px 20px',
      fontFamily: "'Arial Black', Impact, system-ui, sans-serif"
    }}>
      {/* Title */}
      <div style={{
        maxWidth: '100%',
        margin: '0 auto 20px',
        textAlign: 'center',
        background: '#1a1a1a',
        borderRadius: '0',
        padding: isMobile ? '24px 16px' : '40px',
        border: '2px solid #333'
      }}>
        <h1 style={{
          fontSize: isMobile ? '2rem' : '3.5rem',
          fontWeight: '900',
          color: '#22cc22',
          marginBottom: '10px',
          textTransform: 'uppercase'
        }}>
          Final Rankings
        </h1>
        <p style={{ fontSize: isMobile ? '1rem' : '1.3rem', color: '#888', fontWeight: '700' }}>
          Results for <span style={{ color: '#ff00ff' }}>{selectedTopic}</span>
        </p>
      </div>

      {/* Mobile Toggle */}
      {isMobile && playersList.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '12px' }}>
          <button
            style={{
              padding: '10px 18px',
              background: !showAllPlayers ? '#fff' : '#333',
              color: !showAllPlayers ? '#111' : '#888',
              border: 'none', borderRadius: '0',
              fontSize: '13px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase'
            }}
            onClick={() => setShowAllPlayers(false)}
          >
            My Ranking
          </button>
          <button
            style={{
              padding: '10px 18px',
              background: showAllPlayers ? '#fff' : '#333',
              color: showAllPlayers ? '#111' : '#888',
              border: 'none', borderRadius: '0',
              fontSize: '13px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase'
            }}
            onClick={() => setShowAllPlayers(true)}
          >
            All Players
          </button>
        </div>
      )}

      {/* Results Grid */}
      <div
        className="scroll-container"
        style={{
          maxWidth: '100%',
          margin: '0 auto 20px',
          background: '#1a1a1a',
          borderRadius: '0',
          padding: isMobile ? '12px' : '30px',
          border: '2px solid #333',
          overflowX: (isMobile && showAllPlayers) ? 'auto' : 'visible'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '50px 1fr' : '70px 1fr',
          gap: '3px',
          alignItems: 'start',
          minWidth: (isMobile && showAllPlayers) ? `${70 + playersList.length * 120}px` : 'auto'
        }}>
          {/* Rank Labels */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '3px',
            paddingTop: isMobile ? '46px' : '56px'
          }}>
            {Array.from({ length: rankingSize }).map((_, i) => (
              <div key={i} style={{
                height: isMobile ? '90px' : '120px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: '900',
                fontSize: isMobile ? '18px' : '22px',
                borderRadius: '0',
                background: getRankColor(i),
                textShadow: '2px 2px 0 rgba(0,0,0,0.5)'
              }}>
                {i + 1}
              </div>
            ))}
          </div>

          {/* Players Results */}
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${visiblePlayers.length}, 1fr)`,
              gap: '3px', marginBottom: '3px'
            }}>
              {visiblePlayers.map((player) => {
                const origIndex = playersList.findIndex(p => p.id === player.id);
                return (
                  <div key={player.id} style={{
                    background: `hsl(${origIndex * 60}, 70%, 50%)`,
                    color: 'white', fontWeight: '900',
                    fontSize: isMobile ? '15px' : '19px',
                    padding: isMobile ? '12px 6px' : '16px',
                    textAlign: 'center', borderRadius: '0', textTransform: 'uppercase'
                  }}>
                    {player.name}
                    {player.id === playerId && (
                      <span style={{ fontSize: '11px', opacity: 0.7, display: 'block', marginTop: '2px' }}>
                        (you)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${visiblePlayers.length}, 1fr)`,
              gap: '3px'
            }}>
              {Array.from({ length: rankingSize * visiblePlayers.length }).map((_, index) => {
                const rankIndex = Math.floor(index / visiblePlayers.length);
                const visPlayerIndex = index % visiblePlayers.length;
                const player = visiblePlayers[visPlayerIndex];
                const item = rankings[player.id]?.[rankIndex];

                return (
                  <div key={`${player.id}-${rankIndex}`} style={{
                    width: '100%',
                    height: isMobile ? '90px' : '120px',
                    borderRadius: '0',
                    border: item ? '1px solid #333' : '2px dashed #ff0044',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: item ? '#2a2a2a' : '#1a0a0a'
                  }}>
                    {item ? (
                      <>
                        <img
                          src={item.image} alt={item.name}
                          style={{
                            width: isMobile ? '55px' : '80px',
                            height: isMobile ? '55px' : '80px',
                            objectFit: 'cover', borderRadius: '0', marginBottom: '4px'
                          }}
                        />
                        <div style={{
                          fontSize: isMobile ? '10px' : '12px',
                          fontWeight: '800', color: '#ccc',
                          textAlign: 'center', maxWidth: '90%',
                          lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis'
                        }}>
                          {item.name}
                        </div>
                      </>
                    ) : (
                      <div style={{ color: '#ff0044', fontSize: isMobile ? '11px' : '13px', fontWeight: '800', textTransform: 'uppercase' }}>
                        Empty
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        {isAdmin && onPlayAgain && (
          <button
            style={{
              padding: isMobile ? '16px 36px' : '22px 50px',
              background: '#22cc22',
              color: 'white', border: 'none', borderRadius: '0',
              fontSize: isMobile ? '17px' : '20px', fontWeight: '900',
              cursor: 'pointer', width: isMobile ? '100%' : 'auto',
              maxWidth: '400px', textTransform: 'uppercase'
            }}
            onClick={onPlayAgain}
          >
            Play Again
          </button>
        )}
        <button
          style={{
            padding: isMobile ? '12px 28px' : '16px 40px',
            background: '#333',
            color: '#888', border: '2px solid #555', borderRadius: '0',
            fontSize: isMobile ? '14px' : '16px', fontWeight: '900',
            cursor: 'pointer', width: isMobile ? '100%' : 'auto',
            maxWidth: '400px', textTransform: 'uppercase'
          }}
          onClick={onReset}
        >
          New Session
        </button>
      </div>
    </div>
  );
}