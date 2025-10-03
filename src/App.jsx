import { useState } from "react";
import topicsData from './topics.json';
import animeData from '../anime/anime-data.json';
import narutoData from '../anime/naruto-characters.json';
import onePieceData from '../anime/one-piece-characters.json';
import fruitsdata from '../anime/fruits.json';
import seriedata from '../anime/serie.json';
import nintendoData from '../games/nintendo.json';
import pcData from '../games/pc.json';
import wiiData from '../games/wii.json';
import dsData from '../games/ds.json';
import metaData from '../games/meta.json';

const topics = {
  
  "Anime": animeData.Anime,
  "Naruto Characters": narutoData.characters,
  "One Piece Characters": onePieceData.characters,
  "Nintendo Best-Sellers": nintendoData.games,
  "PC Best-Sellers": pcData.games,
  "Wii Best-Sellers": wiiData.games,
  "Nintendo DS Best-Sellers": dsData.games,
  "Highest Rated Games (Metacritic)": metaData.games,
  "Kinderserien": seriedata.kinderserien,
  "Teufelsfrüchte": fruitsdata.fruits,
  ...topicsData
};

const RANKING_SIZE = 10;

export default function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [step, setStep] = useState("setup");
  const [pokemonPool, setPokemonPool] = useState([]);
  const [rankings, setRankings] = useState({});
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [picks, setPicks] = useState({});

  const addPlayer = () => {
    const trimmedName = name.trim();
    if (!trimmedName || players.includes(trimmedName)) return;
    setPlayers([...players, trimmedName]);
    setName("");
  };

  const removePlayer = (playerToRemove) => {
    setPlayers(players.filter(p => p !== playerToRemove));
  };

  const startGame = () => {
    if (!selectedTopic || players.length === 0) return;
    const pool = [...topics[selectedTopic]];
    setPokemonPool(pool);
    setRankings(players.reduce((acc, p) => ({ ...acc, [p]: Array(RANKING_SIZE).fill(null) }), {}));
    setPicks(players.reduce((acc, p) => ({ ...acc, [p]: null }), {}));
    setCurrentPokemon(pool[Math.floor(Math.random() * pool.length)]);
    setStep("game");
  };

  const pickSlot = (player, index) => {
    if (rankings[player][index] !== null) return;
    setPicks({ ...picks, [player]: index });
  };
  const skipCurrent = () => {

    // Remove current item from pool

    const newPool = pokemonPool.filter(item => item.name !== currentPokemon.name);

    setPokemonPool(newPool);



    // Pick new random item from remaining pool

    if (newPool.length > 0) {

      setCurrentPokemon(newPool[Math.floor(Math.random() * newPool.length)]);

      setPicks(players.reduce((acc, p) => ({ ...acc, [p]: null }), {}));

    } else {

      // If no items left, go to results

      setStep("results");

    }

  };
  const lockIn = () => {
    if (players.some(p => picks[p] === null)) return;
    const newRankings = { ...rankings };
    players.forEach(p => {
      newRankings[p][picks[p]] = currentPokemon;
    });
    setRankings(newRankings);

    const hasEmptySlots = players.some(player => newRankings[player].some(slot => slot === null));
    if (hasEmptySlots) {
      // Remove current item from pool to prevent duplicates
      const newPool = pokemonPool.filter(item => item.name !== currentPokemon.name);
      setPokemonPool(newPool);

      // Pick new random item from remaining pool
      if (newPool.length > 0) {
        setCurrentPokemon(newPool[Math.floor(Math.random() * newPool.length)]);
      }
      setPicks(players.reduce((acc, p) => ({ ...acc, [p]: null }), {}));
    } else {
      setStep("results");
    }
  };

  const resetGame = () => {
    setStep("setup");
    setPlayers([]);
    setSelectedTopic(null);
    setRankings({});
    setPicks({});
    setCurrentPokemon(null);
    setPokemonPool([]);
  };

  const getRankEmoji = (index) => {
    const emojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    return emojis[index] || '🔟';
  };

  const getPlayerColor = (index) => {
    const colors = [
      { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#4c1d95' },
      { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: '#881337' },
      { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: '#075985' },
      { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', text: '#065f46' }
    ];
    return colors[index % colors.length];
  };

  const getRankColor = (index) => {
    const hue = 240 - index * 20;
    return `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${hue - 20}, 70%, 40%))`;
  };

  const getRankClass = (index) => {
    if (index === 0) return 'gold';
    if (index === 1) return 'silver';
    if (index === 2) return 'bronze';
    return '';
  };

  // Setup Phase
  if (step === "setup") {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        padding: '40px 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '32px',
          padding: '50px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{
              fontSize: '4rem',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '15px',
              letterSpacing: '-2px'
            }}>
              🎮 Blindranking
            </h1>
            <p style={{
              fontSize: '1.4rem',
              color: '#6b7280',
              fontWeight: '600'
            }}>
              Create your ultimate blind ranking with friends!
            </p>
          </div>

          {/* Main Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '40px',
            marginBottom: '50px'
          }}>
            {/* Players Section */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
              borderRadius: '24px',
              padding: '35px',
              border: '3px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '800',
                marginBottom: '25px',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                👥 Add Players
              </h2>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
                <input
                  style={{
                    flex: 1,
                    padding: '18px 24px',
                    border: '3px solid #d1d5db',
                    borderRadius: '16px',
                    fontSize: '17px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    background: 'white',
                    fontWeight: '500'
                  }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter player name..."
                  onKeyPress={e => e.key === 'Enter' && addPlayer()}
                />
                <button
                  style={{
                    padding: '18px 28px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    fontWeight: '700',
                    transition: 'all 0.2s',
                    minWidth: '70px'
                  }}
                  onClick={addPlayer}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                >
                  ➕
                </button>
              </div>

              <div style={{
                display: 'grid',
                gap: '14px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {players.map((player, i) => (
                  <div key={i} style={{
                    background: 'white',
                    padding: '18px 24px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    border: '2px solid #f1f5f9',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                      <div style={{
                        width: '45px',
                        height: '45px',
                        background: getPlayerColor(i).bg,
                        color: 'white',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '18px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }}>
                        {i + 1}
                      </div>
                      <span style={{
                        fontWeight: '700',
                        fontSize: '18px',
                        color: '#1e293b'
                      }}>
                        {player}
                      </span>
                    </div>
                    <button
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '700',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => removePlayer(player)}
                      onMouseEnter={e => e.target.style.background = '#dc2626'}
                      onMouseLeave={e => e.target.style.background = '#ef4444'}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {players.length === 0 && (
                  <div style={{
                    padding: '60px',
                    textAlign: 'center',
                    color: '#9ca3af',
                    fontSize: '17px',
                    fontWeight: '500'
                  }}>
                    No players added yet
                  </div>
                )}
              </div>
            </div>

            {/* Topics Section */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff, #dbeafe)',
              borderRadius: '24px',
              padding: '35px',
              border: '3px solid #dbeafe'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '800',
                marginBottom: '25px',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🎯 Choose Topic
              </h2>

              <div style={{
                display: 'grid',
                gap: '14px',
                maxHeight: '470px',
                overflowY: 'auto'
              }}>
                {Object.keys(topics).map(topic => (
                  <button
                    key={topic}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '22px 26px',
                      borderRadius: '16px',
                      border: selectedTopic === topic ? '4px solid #10b981' : '3px solid #e5e7eb',
                      cursor: 'pointer',
                      fontSize: '17px',
                      fontWeight: '700',
                      transition: 'all 0.3s',
                      background: selectedTopic === topic
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'white',
                      color: selectedTopic === topic ? 'white' : '#374151',
                      transform: selectedTopic === topic ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: selectedTopic === topic
                        ? '0 10px 30px rgba(16, 185, 129, 0.35)'
                        : '0 2px 8px rgba(0, 0, 0, 0.08)'
                    }}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{topic}</span>
                      <span style={{
                        fontSize: '15px',
                        opacity: 0.9,
                        background: 'rgba(255, 255, 255, 0.25)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontWeight: '600'
                      }}>
                        {topics[topic].length} items
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              style={{
                padding: '22px 50px',
                background: (!selectedTopic || players.length === 0)
                  ? '#d1d5db'
                  : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '18px',
                cursor: (!selectedTopic || players.length === 0) ? 'not-allowed' : 'pointer',
                fontSize: '22px',
                fontWeight: '800',
                transition: 'all 0.3s',
                boxShadow: (!selectedTopic || players.length === 0)
                  ? 'none'
                  : '0 10px 30px rgba(16, 185, 129, 0.4)',
                letterSpacing: '0.5px'
              }}
              onClick={startGame}
              disabled={!selectedTopic || players.length === 0}
              onMouseEnter={e => {
                if (!e.target.disabled) {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.5)';
                }
              }}
              onMouseLeave={e => {
                if (!e.target.disabled) {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.4)';
                }
              }}
            >
              🚀 Start Blindranking!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Phase
  if (step === "game") {
    const allPlayersPicked = players.every(p => picks[p] !== null);
    const columnWidth = players.length <= 3 ? '200px' : '160px';

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {/* Current Item Display */}
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '20px',
          padding: '24px 40px',
          boxShadow: '0 15px 50px rgba(0, 0, 0, 0.4)',
          zIndex: 1000,
          border: '4px solid #10b981',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          <span style={{
            fontSize: '20px',
            fontWeight: '800',
            color: '#374151',
            letterSpacing: '0.5px'
          }}>
            Now placing:
          </span>
          <img
            src={currentPokemon?.image}
            alt={currentPokemon?.name}
            style={{
              width: '70px',
              height: '70px',
              objectFit: 'cover',
              borderRadius: '14px',
              background: '#f3f4f6',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
              border: '3px solid #10b981'
            }}
          />
          <span style={{
            fontSize: '24px',
            fontWeight: '900',
            color: '#10b981',
            letterSpacing: '0.5px'
          }}>
            {currentPokemon?.name}
          </span>

          <button

            style={{

              padding: '12px 24px',

              background: 'linear-gradient(135deg, #ef4444, #dc2626)',

              color: 'white',

              border: 'none',

              borderRadius: '12px',

              fontSize: '16px',

              fontWeight: '800',

              cursor: 'pointer',

              transition: 'all 0.3s',

              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',

              marginLeft: '12px'

            }}

            onClick={skipCurrent}

          >

            ⏭️ Skip

          </button>
        </div>

        {/* Main Game Grid */}
        <div style={{
          maxWidth: '100%',
          margin: '120px auto 0',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr',
            gap: '24px',
            alignItems: 'start'
          }}>
            {/* Rank Labels */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingTop: '70px'
            }}>
              {Array.from({ length: RANKING_SIZE }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: players.length <= 3 ? '120px' : '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '18px',
                    borderRadius: '14px',
                    background: getRankColor(i),
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ fontSize: '28px' }}>{getRankEmoji(i)}</div>
                  <div style={{ fontSize: '13px', opacity: 0.95, fontWeight: '700' }}>
                    #{i + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Players Grid */}
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
                      background: getPlayerColor(i).bg,
                      color: 'white',
                      fontWeight: '900',
                      fontSize: '20px',
                      padding: '18px',
                      textAlign: 'center',
                      borderRadius: '14px',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
                      letterSpacing: '0.5px'
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
                gap: '14px'
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
                        height: players.length <= 3 ? '120px' : '100px',
                        borderRadius: '14px',
                        border: isFilled
                          ? '3px solid #e5e7eb'
                          : isSelected
                            ? '4px solid #fbbf24'
                            : '3px solid #bfdbfe',
                        cursor: isFilled ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '700',
                        transition: 'all 0.3s',
                        background: isFilled
                          ? '#f9fafb'
                          : isSelected
                            ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                            : 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                        color: isFilled
                          ? '#6b7280'
                          : isSelected
                            ? '#92400e'
                            : '#1d4ed8',
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: isSelected
                          ? '0 10px 30px rgba(251, 191, 36, 0.5)'
                          : '0 3px 10px rgba(0, 0, 0, 0.1)'
                      }}
                      onClick={() => pickSlot(player, rankIndex)}
                      disabled={isFilled}
                      onMouseEnter={e => {
                        if (!isFilled) {
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.4)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isFilled && !isSelected) {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                        }
                      }}
                    >
                      {isFilled ? (
                        <img
                          src={rankings[player][rankIndex].image}
                          alt={rankings[player][rankIndex].name}
                          style={{
                            width: players.length <= 3 ? '100px' : '80px',
                            height: players.length <= 3 ? '100px' : '80px',
                            objectFit: 'cover',
                            borderRadius: '10px'
                          }}
                        />
                      ) : isSelected ? (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '28px', marginBottom: '6px' }}>✨</div>
                          <div style={{ fontWeight: '900', fontSize: '15px' }}>SELECTED</div>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '28px', marginBottom: '6px' }}>📍</div>
                          <div style={{ fontWeight: '700', fontSize: '13px' }}>Place here</div>
                        </div>
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
            padding: '24px 40px',
            background: allPlayersPicked
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '18px',
            fontSize: '20px',
            fontWeight: '900',
            transition: 'all 0.3s',
            zIndex: 1000,
            cursor: allPlayersPicked ? 'pointer' : 'not-allowed',
            boxShadow: allPlayersPicked
              ? '0 12px 35px rgba(16, 185, 129, 0.5)'
              : 'none',
            backdropFilter: 'blur(10px)',
            transform: allPlayersPicked ? 'scale(1)' : 'scale(0.95)',
            letterSpacing: '0.5px'
          }}
          onClick={lockIn}
          disabled={!allPlayersPicked}
          onMouseEnter={e => {
            if (allPlayersPicked) {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 18px 45px rgba(16, 185, 129, 0.6)';
            }
          }}
          onMouseLeave={e => {
            if (allPlayersPicked) {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.5)';
            }
          }}
        >
          {allPlayersPicked ? "🔒 Lock In!" : "⏳ Waiting..."}
        </button>
      </div>
    );
  }

  // Results Phase
  if (step === "results") {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
        padding: '40px 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {/* Title */}
        <div style={{
          maxWidth: '100%',
          margin: '0 auto 40px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #059669, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '15px',
            letterSpacing: '-2px'
          }}>
            🏆 The Ultimate Ranking!
          </h1>
          <p style={{
            fontSize: '1.5rem',
            color: '#6b7280',
            fontWeight: '700'
          }}>
            Here are your final rankings for {selectedTopic}!
          </p>
        </div>

        {/* Results Grid */}
        <div style={{
          maxWidth: '100%',
          margin: '0 auto 40px',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '24px',
          padding: '50px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            gap: '30px',
            alignItems: 'start'
          }}>
            {/* Rank Labels */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              paddingTop: '80px'
            }}>
              {Array.from({ length: RANKING_SIZE }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: players.length <= 3 ? '160px' : '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '20px',
                    borderRadius: '18px',
                    background: i === 0
                      ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                      : i === 1
                        ? 'linear-gradient(135deg, #6b7280, #4b5563)'
                        : i === 2
                          ? 'linear-gradient(135deg, #ea580c, #dc2626)'
                          : getRankColor(i),
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                    flexDirection: 'column',
                    gap: '6px',
                    border: i < 3 ? '4px solid rgba(255, 255, 255, 0.4)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '36px' }}>{getRankEmoji(i)}</div>
                  <div style={{ fontSize: '16px', opacity: 0.95, fontWeight: '800' }}>
                    Place {i + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Players Results */}
            <div>
              {/* Player Headers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${players.length}, 1fr)`,
                gap: '16px',
                marginBottom: '16px'
              }}>
                {players.map((player, i) => (
                  <div
                    key={player}
                    style={{
                      background: getPlayerColor(i).bg,
                      color: 'white',
                      fontWeight: '900',
                      fontSize: '22px',
                      padding: '24px',
                      textAlign: 'center',
                      borderRadius: '18px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                      position: 'relative',
                      letterSpacing: '0.5px'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '-12px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '50%',
                      width: '42px',
                      height: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: '900',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                      color: getPlayerColor(i).text
                    }}>
                      👑
                    </div>
                    {player}
                  </div>
                ))}
              </div>

              {/* Results Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${players.length}, 1fr)`,
                gap: '16px'
              }}>
                {Array.from({ length: RANKING_SIZE * players.length }).map((_, index) => {
                  const rankIndex = Math.floor(index / players.length);
                  const playerIndex = index % players.length;
                  const player = players[playerIndex];
                  const item = rankings[player][rankIndex];

                  return (
                    <div
                      key={`${player}-${rankIndex}`}
                      style={{
                        width: '100%',
                        height: players.length <= 3 ? '160px' : '140px',
                        borderRadius: '18px',
                        border: item ? '4px solid #e2e8f0' : '4px dashed #fca5a5',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: item
                          ? 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
                          : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                        boxShadow: item
                          ? '0 10px 25px rgba(0, 0, 0, 0.12)'
                          : '0 6px 16px rgba(252, 165, 165, 0.35)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {item ? (
                        <>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: players.length <= 3 ? '120px' : '100px',
                              height: players.length <= 3 ? '120px' : '100px',
                              objectFit: 'cover',
                              borderRadius: '14px',
                              marginBottom: '10px',
                              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
                              border: '3px solid white'
                            }}
                          />
                          <div style={{
                            fontSize: '13px',
                            fontWeight: '800',
                            color: '#1e293b',
                            textAlign: 'center',
                            lineHeight: 1.3,
                            maxWidth: '90%',
                            letterSpacing: '0.3px'
                          }}>
                            {item.name}
                          </div>
                          {rankIndex < 3 && (
                            <div style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              fontSize: '24px'
                            }}>
                              {getRankEmoji(rankIndex)}
                            </div>
                          )}
                        </>
                      ) : (
                        <div style={{
                          color: '#ef4444',
                          fontSize: '15px',
                          fontWeight: '700',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            fontSize: '36px',
                            marginBottom: '10px',
                            opacity: 0.6
                          }}>
                            ❌
                          </div>
                          <div>Not selected</div>
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
              padding: '28px 60px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '24px',
              fontWeight: '900',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 15px 45px rgba(139, 92, 246, 0.5)',
              backdropFilter: 'blur(10px)',
              letterSpacing: '0.5px'
            }}
            onClick={resetGame}
            onMouseEnter={e => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 25px 60px rgba(139, 92, 246, 0.6)';
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 15px 45px rgba(139, 92, 246, 0.5)';
            }}
          >
            🔄 Start New Blindranking!
          </button>
        </div>
      </div>
    );
  }
}