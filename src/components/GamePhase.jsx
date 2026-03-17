import { useState } from "react";
import { RANKING_SIZE } from "../constants/config";
import { getRankColor, getPlayerColor } from "../utils/helpers";
import useIsMobile from "../hooks/useIsMobile";

function hasPicked(pickValue) {
  return typeof pickValue === 'number' && pickValue >= 0;
}

export default function GamePhase({
  playersList, rankings, picks, currentItem, playerId,
  isAdmin, isLocking, onPickSlot, onLockIn, onSkip, onEndSession
}) {
  const isMobile = useIsMobile();
  const [showAllPlayers, setShowAllPlayers] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  if (!currentItem) {
    return (
      <div style={{
        minHeight: '100vh', background: '#111',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: '1.2rem', fontWeight: '800'
      }}>
        Loading next item...
      </div>
    );
  }

  const allPlayersPicked = playersList.every(p => hasPicked(picks[p.id]));
  const visiblePlayers = (isMobile && !showAllPlayers)
    ? playersList.filter(p => p.id === playerId)
    : playersList;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111',
      padding: isMobile ? '12px' : '20px',
      fontFamily: "'Arial Black', Impact, system-ui, sans-serif"
    }}>
      {/* Current Item Display - FIXED WIDTH */}
      <div style={{
        position: 'fixed',
        top: isMobile ? '8px' : '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1a1a1a',
        borderRadius: '0',
        padding: isMobile ? '10px 14px' : '16px 24px',
        border: '3px solid #22cc22',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '10px' : '20px',
        width: isMobile ? 'calc(100% - 24px)' : '600px',
        maxWidth: isMobile ? 'calc(100% - 24px)' : '600px'
      }}>
        {!isMobile && (
          <span style={{ fontSize: '14px', fontWeight: '900', color: '#888', textTransform: 'uppercase', flexShrink: 0 }}>
            Now placing:
          </span>
        )}
        <img
          src={currentItem.image}
          alt={currentItem.name}
          style={{
            width: isMobile ? '60px' : '80px',
            height: isMobile ? '60px' : '80px',
            objectFit: 'cover',
            borderRadius: '0',
            background: '#333',
            flexShrink: 0
          }}
        />
        <span style={{
          fontSize: isMobile ? '15px' : '20px',
          fontWeight: '900',
          color: '#22cc22',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
          flex: 1,
          minWidth: 0
        }}>
          {currentItem.name}
        </span>
        {isAdmin && (
          <button
            style={{
              padding: isMobile ? '8px 14px' : '10px 20px',
              background: '#ff0044',
              color: 'white',
              border: 'none',
              borderRadius: '0',
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: '900',
              cursor: 'pointer',
              flexShrink: 0,
              textTransform: 'uppercase'
            }}
            onClick={onSkip}
          >
            Skip
          </button>
        )}
      </div>

      {/* Mobile Toggle */}
      {isMobile && playersList.length > 1 && (
        <div style={{
          position: 'fixed',
          top: isMobile ? '90px' : '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999,
          display: 'flex',
          gap: '4px'
        }}>
          <button
            style={{
              padding: '8px 16px',
              background: !showAllPlayers ? '#fff' : '#333',
              color: !showAllPlayers ? '#111' : '#888',
              border: 'none',
              borderRadius: '0',
              fontSize: '12px',
              fontWeight: '900',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
            onClick={() => setShowAllPlayers(false)}
          >
            My Ranking
          </button>
          <button
            style={{
              padding: '8px 16px',
              background: showAllPlayers ? '#fff' : '#333',
              color: showAllPlayers ? '#111' : '#888',
              border: 'none',
              borderRadius: '0',
              fontSize: '12px',
              fontWeight: '900',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
            onClick={() => setShowAllPlayers(true)}
          >
            All Players
          </button>

          {!showAllPlayers && playersList.length > 1 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#222', borderRadius: '0', padding: '6px 12px',
              fontSize: '11px', fontWeight: '800', color: '#888'
            }}>
              {playersList.filter(p => p.id !== playerId).map((p) => (
                <span key={p.id} style={{
                  display: 'inline-block', width: '10px', height: '10px',
                  borderRadius: '0',
                  background: hasPicked(picks[p.id]) ? '#22cc22' : '#444'
                }} />
              ))}
              <span style={{ marginLeft: '4px' }}>
                {playersList.filter(p => p.id !== playerId && hasPicked(picks[p.id])).length}
                /{playersList.length - 1} ready
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Game Grid */}
      <div
        className="scroll-container"
        style={{
          maxWidth: '100%',
          margin: isMobile
            ? (playersList.length > 1 ? '130px auto 0' : '100px auto 0')
            : '120px auto 0',
          background: '#1a1a1a',
          borderRadius: '0',
          padding: isMobile ? '12px' : '24px',
          border: '2px solid #333',
          overflowX: (isMobile && showAllPlayers) ? 'auto' : 'visible',
          paddingBottom: isAdmin ? (isMobile ? '80px' : '24px') : (isMobile ? '12px' : '24px')
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '50px 1fr' : '70px 1fr',
          gap: '3px',
          alignItems: 'start',
          minWidth: (isMobile && showAllPlayers) ? `${70 + playersList.length * 110}px` : 'auto'
        }}>
          {/* Rank Labels */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            paddingTop: isMobile ? '46px' : '56px'
          }}>
            {Array.from({ length: RANKING_SIZE }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: isMobile ? '100px' : '140px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '900',
                  fontSize: isMobile ? '18px' : '22px',
                  borderRadius: '0',
                  background: getRankColor(i),
                  textShadow: '2px 2px 0 rgba(0,0,0,0.5)'
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Players Grid */}
          <div>
            {/* Player Headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${visiblePlayers.length}, 1fr)`,
              gap: '3px',
              marginBottom: '3px'
            }}>
              {visiblePlayers.map((player) => {
                const origIndex = playersList.findIndex(p => p.id === player.id);
                const isMe = player.id === playerId;
                const playerHasPicked = hasPicked(picks[player.id]);

                return (
                  <div
                    key={player.id}
                    style={{
                      background: getPlayerColor(origIndex),
                      color: 'white',
                      fontWeight: '900',
                      fontSize: isMobile ? '14px' : '17px',
                      padding: isMobile ? '10px 6px' : '14px',
                      textAlign: 'center',
                      borderRadius: '0',
                      position: 'relative',
                      textTransform: 'uppercase'
                    }}
                  >
                    {player.name}
                    {isMe && (
                      <span style={{ display: 'block', fontSize: '10px', opacity: 0.7, marginTop: '2px', fontWeight: '700' }}>
                        (you)
                      </span>
                    )}
                    {!isMe && (
                      <span style={{
                        position: 'absolute', top: '4px', right: '6px',
                        width: '10px', height: '10px', borderRadius: '0',
                        background: playerHasPicked ? '#22cc22' : 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.4)'
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Ranking Slots */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${visiblePlayers.length}, 1fr)`,
              gap: '3px'
            }}>
              {Array.from({ length: RANKING_SIZE * visiblePlayers.length }).map((_, index) => {
                const rankIndex = Math.floor(index / visiblePlayers.length);
                const visPlayerIndex = index % visiblePlayers.length;
                const player = visiblePlayers[visPlayerIndex];
                const isMyColumn = player.id === playerId;
                const isSelected = isMyColumn && picks[player.id] === rankIndex;
                const slotItem = rankings[player.id]?.[rankIndex];
                const isFilled = slotItem != null;

                return (
                  <button
                    key={`${player.id}-${rankIndex}`}
                    style={{
                      width: '100%',
                      height: isMobile ? '100px' : '140px',
                      borderRadius: '0',
                      border: isSelected ? '3px solid #ffff00' : '1px solid #333',
                      cursor: (isFilled || !isMyColumn) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '11px' : '13px',
                      fontWeight: '800',
                      background: isFilled
                        ? '#2a2a2a'
                        : isSelected
                          ? '#ffff00'
                          : isMyColumn
                            ? '#2a2a2a'
                            : '#222',
                      color: isSelected ? '#111' : isFilled ? '#888' : isMyColumn ? '#666' : '#444',
                      opacity: (!isFilled && !isMyColumn) ? 0.5 : 1,
                      padding: '4px',
                      textTransform: 'uppercase'
                    }}
                    onClick={() => isMyColumn && !isFilled && onPickSlot(player.id, rankIndex)}
                    disabled={isFilled || !isMyColumn}
                  >
                    {isFilled ? (
                      <>
                        <img
                          src={slotItem.image}
                          alt={slotItem.name}
                          style={{
                            width: isMobile ? '70px' : '100px',
                            height: isMobile ? '70px' : '100px',
                            objectFit: 'cover',
                            borderRadius: '0'
                          }}
                        />
                        <div style={{
                          fontSize: isMobile ? '9px' : '11px',
                          fontWeight: '800',
                          color: '#ccc',
                          textAlign: 'center',
                          marginTop: '2px',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {slotItem.name}
                        </div>
                      </>
                    ) : isSelected ? (
                      <span style={{ fontWeight: '900' }}>SELECTED</span>
                    ) : (
                      <span>{isMyColumn ? 'TAP' : '...'}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lock Button */}
      {isAdmin && (
        <button
          style={{
            position: 'fixed',
            bottom: isMobile ? '16px' : '30px',
            right: isMobile ? '16px' : '30px',
            padding: isMobile ? '14px 24px' : '20px 35px',
            background: (allPlayersPicked && !isLocking) ? '#22cc22' : '#333',
            color: 'white',
            border: 'none',
            borderRadius: '0',
            fontSize: isMobile ? '15px' : '17px',
            fontWeight: '900',
            zIndex: 1000,
            cursor: (allPlayersPicked && !isLocking) ? 'pointer' : 'not-allowed',
            textTransform: 'uppercase'
          }}
          onClick={onLockIn}
          disabled={!allPlayersPicked || isLocking}
        >
          {isLocking ? "Locking..." : allPlayersPicked ? "Lock In" : "Waiting..."}
        </button>
      )}

      {/* End Session Button */}
      {isAdmin && (
        <div style={{
          position: 'fixed',
          bottom: isMobile ? '16px' : '30px',
          left: isMobile ? '16px' : '30px',
          zIndex: 1000
        }}>
          {!confirmEnd ? (
            <button
              style={{
                padding: isMobile ? '10px 16px' : '14px 24px',
                background: '#ff0044',
                color: 'white',
                border: 'none',
                borderRadius: '0',
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: '900',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
              onClick={() => setConfirmEnd(true)}
            >
              End Session
            </button>
          ) : (
            <div style={{
              display: 'flex',
              gap: '4px',
              background: '#1a1a1a',
              border: '2px solid #ff0044',
              padding: '10px'
            }}>
              <span style={{
                color: '#ff0044',
                fontWeight: '900',
                fontSize: isMobile ? '11px' : '13px',
                alignSelf: 'center',
                marginRight: '6px',
                textTransform: 'uppercase'
              }}>
                Sure?
              </span>
              <button
                style={{
                  padding: '8px 16px',
                  background: '#ff0044',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0',
                  fontSize: isMobile ? '12px' : '13px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
                onClick={onEndSession}
              >
                Yes
              </button>
              <button
                style={{
                  padding: '8px 16px',
                  background: '#333',
                  color: '#888',
                  border: 'none',
                  borderRadius: '0',
                  fontSize: isMobile ? '12px' : '13px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
                onClick={() => setConfirmEnd(false)}
              >
                No
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}