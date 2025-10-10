import { RANKING_SIZE } from "../constants/config";
import { getRankColor, getPlayerColor } from "../utils/helpers";

export default function GamePhase({ 
  players, 
  rankings, 
  picks, 
  currentItem, 
  onPickSlot, 
  onLockIn, 
  onSkip 
}) {
  const allPlayersPicked = players.every(p => picks[p] !== null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Current Item Display */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '16px',
        padding: '20px 30px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
        zIndex: 1000,
        border: '3px solid #10b981',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#374151' }}>
          Now placing:
        </span>
        <img
          src={currentItem?.image}
          alt={currentItem?.name}
          style={{
            width: '60px',
            height: '60px',
            objectFit: 'cover',
            borderRadius: '12px',
            background: '#f3f4f6',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
        />
        <span style={{ fontSize: '20px', fontWeight: '800', color: '#10b981' }}>
          {currentItem?.name}
        </span>
        <button
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
          onClick={onSkip}
        >
          Skip
        </button>
      </div>

      {/* Main Game Grid */}
      <div style={{
        maxWidth: '100%',
        margin: '120px auto 0',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '90px 1fr',
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Rank Labels */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            paddingTop: '60px'
          }}>
            {Array.from({ length: RANKING_SIZE }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '16px',
                  borderRadius: '12px',
                  background: getRankColor(i),
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              >
                #{i + 1}
              </div>
            ))}
          </div>

          {/* Players Grid */}
          <div>
            {/* Player Headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${players.length}, 1fr)`,
              gap: '12px',
              marginBottom: '12px'
            }}>
              {players.map((player, i) => (
                <div
                  key={player}
                  style={{
                    background: getPlayerColor(i),
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '17px',
                    padding: '16px',
                    textAlign: 'center',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {player}
                </div>
              ))}
            </div>

            {/* Ranking Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${players.length}, 1fr)`,
              gap: '12px'
            }}>
              {Array.from({ length: RANKING_SIZE * players.length }).map((_, index) => {
                const rankIndex = Math.floor(index / players.length);
                const playerIndex = index % players.length;
                const player = players[playerIndex];
                const isSelected = picks[player] === rankIndex;
                const isFilled = rankings[player][rankIndex] !== null;

                return (
                  <button
                    key={`${player}-${rankIndex}`}
                    style={{
                      width: '100%',
                      height: '100px',
                      borderRadius: '12px',
                      border: isFilled
                        ? '2px solid #e5e7eb'
                        : isSelected
                          ? '3px solid #fbbf24'
                          : '2px solid #bfdbfe',
                      cursor: isFilled ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      background: isFilled
                        ? '#f9fafb'
                        : isSelected
                          ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                          : 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                      color: isFilled ? '#6b7280' : isSelected ? '#92400e' : '#1d4ed8',
                      boxShadow: isSelected
                        ? '0 8px 20px rgba(251, 191, 36, 0.4)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                    onClick={() => onPickSlot(player, rankIndex)}
                    disabled={isFilled}
                  >
                    {isFilled ? (
                      <img
                        src={rankings[player][rankIndex].image}
                        alt={rankings[player][rankIndex].name}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    ) : isSelected ? (
                      <span style={{ fontWeight: '800' }}>SELECTED</span>
                    ) : (
                      <span>Click to place</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lock Button */}
      <button
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          padding: '20px 35px',
          background: allPlayersPicked
            ? 'linear-gradient(135deg, #10b981, #059669)'
            : '#9ca3af',
          color: 'white',
          border: 'none',
          borderRadius: '14px',
          fontSize: '17px',
          fontWeight: '800',
          zIndex: 1000,
          cursor: allPlayersPicked ? 'pointer' : 'not-allowed',
          boxShadow: allPlayersPicked ? '0 10px 30px rgba(16, 185, 129, 0.5)' : 'none'
        }}
        onClick={onLockIn}
        disabled={!allPlayersPicked}
      >
        {allPlayersPicked ? "Lock In" : "Waiting..."}
      </button>
    </div>
  );
}