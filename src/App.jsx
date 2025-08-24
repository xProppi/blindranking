import { useState } from "react";
import './App.css';

const topics = {
  Filme: [
    { name: "Inception", image: "https://images.unsplash.com/photo-1489599663317-3e54fda2c85b?w=150&h=150&fit=crop" },
    { name: "Matrix", image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=150&h=150&fit=crop" },
    { name: "Shrek", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop" },
    { name: "Interstellar", image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=150&h=150&fit=crop" },
    { name: "Gladiator", image: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=150&h=150&fit=crop" }
  ],
  Essen: [
    { name: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop" },
    { name: "Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop" },
    { name: "Sushi", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=150&h=150&fit=crop" },
    { name: "Tacos", image: "https://images.unsplash.com/photo-1565299585323-38174c7a8bda?w=150&h=150&fit=crop" },
    { name: "Pasta", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=150&h=150&fit=crop" }
  ],
  Pokemon: [
    { name: "Bisasam", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
    { name: "Bisaknosp", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png" },
    { name: "Bisaflor", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png" },
    { name: "Glumanda", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
    { name: "Glutexo", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png" },
    { name: "Glurak", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" },
    { name: "Schiggy", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
    { name: "Schillok", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png" },
    { name: "Turtok", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png" },
    { name: "Raupy", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png" },
    { name: "Safcon", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/11.png" },
    { name: "Smettbo", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png" },
    { name: "Hornliu", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png" },
    { name: "Kokuna", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/14.png" },
    { name: "Bibor", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/15.png" },
    { name: "Taubsi", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png" },
    { name: "Tauboga", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/17.png" },
    { name: "Tauboss", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png" },
    { name: "Rattfratz", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png" },
    { name: "Rattikarl", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/20.png" }
  ]
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

  const lockIn = () => {
    if (players.some(p => picks[p] === null)) return;
    const newRankings = { ...rankings };
    players.forEach(p => {
      newRankings[p][picks[p]] = currentPokemon;
    });
    setRankings(newRankings);

    const hasEmptySlots = players.some(player => newRankings[player].some(slot => slot === null));
    if (hasEmptySlots) {
      setCurrentPokemon(pokemonPool[Math.floor(Math.random() * pokemonPool.length)]);
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
    const hue = index * 137.5;
    return {
      background: `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue + 30}, 70%, 50%))`,
      color: `hsl(${hue}, 70%, 40%)`
    };
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

  if (step === "setup") {
    return (
      <div className="container setup-container">
        <div className="setup-main-card">
          <div className="setup-header">
            <h1 className="setup-title">🎮 Blindranking</h1>
            <p className="setup-subtitle">Erstelle dein ultimatives Blind-Ranking mit Freunden!</p>
          </div>

          <div className="setup-grid">
            <div className="players-section">
              <h2 className="section-title">👥 Spieler hinzufügen</h2>
              
              <div className="input-group">
                <input
                  className="player-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Spielername eingeben..."
                  onKeyPress={e => e.key === 'Enter' && addPlayer()}
                />
                <button className="add-player-btn" onClick={addPlayer}>
                  ➕
                </button>
              </div>

              <div className="players-list">
                {players.map((player, i) => (
                  <div key={i} className="player-item">
                    <div className="player-info">
                      <div 
                        className="player-number" 
                        style={getPlayerColor(i)}
                      >
                        {i + 1}
                      </div>
                      <span className="player-name">{player}</span>
                    </div>
                    <button
                      className="remove-player-btn"
                      onClick={() => removePlayer(player)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {players.length === 0 && (
                  <div className="empty-players">
                    Noch keine Spieler hinzugefügt
                  </div>
                )}
              </div>
            </div>

            <div className="topics-section">
              <h2 className="section-title">🎯 Thema wählen</h2>

              <div className="topics-grid">
                {Object.keys(topics).map(topic => (
                  <button
                    key={topic}
                    className={`topic-button ${selectedTopic === topic ? 'selected' : ''}`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <div className="topic-info">
                      <span>{topic}</span>
                      <span className="topic-count">
                        {topics[topic].length} Items
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="center">
            <button
              className="start-game-btn"
              onClick={startGame}
              disabled={!selectedTopic || players.length === 0}
            >
               Blindranking beginnen!
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "game") {
    const allPlayersPicked = players.every(p => picks[p] !== null);
    
    return (
      <div className="container game-container">
        {/* Current Item Display */}
        <div className="current-item-display">
          <span className="current-item-label">Jetzt platzieren:</span>
          <img
            src={currentPokemon?.image}
            alt={currentPokemon?.name}
            className="current-item-image"
          />
          <span className="current-item-name">{currentPokemon?.name}</span>
        </div>

        {/* Main Game Grid */}
        <div className="game-main-card">
          <div className="game-grid-container">
            {/* Rank Labels */}
            <div className="rank-labels-column">
              {Array.from({ length: RANKING_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className="rank-label"
                  style={{ background: getRankColor(i) }}
                >
                  <div className="rank-emoji">{getRankEmoji(i)}</div>

                </div>
              ))}
            </div>

            {/* Players Grid */}
            <div>
              {/* Player Headers */}
              <div 
                className="players-headers"
                style={{
                  gridTemplateColumns: `repeat(${players.length}, 1fr)`
                }}
              >
                {players.map((player, i) => (
                  <div
                    key={player}
                    className="player-header"
                    style={getPlayerColor(i)}
                  >
                    {player}
                  </div>
                ))}
              </div>

              {/* Ranking Grid */}
              <div 
                className="ranking-grid"
                style={{
                  gridTemplateColumns: `repeat(${players.length}, 1fr)`
                }}
              >
                {Array.from({ length: RANKING_SIZE * players.length }).map((_, index) => {
                  const rankIndex = Math.floor(index / players.length);
                  const playerIndex = index % players.length;
                  const player = players[playerIndex];
                  const isSelected = picks[player] === rankIndex;
                  const isFilled = rankings[player][rankIndex] !== null;

                  return (
                    <button
                      key={`${player}-${rankIndex}`}
                      className={`slot-button ${isFilled ? 'filled' : isSelected ? 'selected' : 'empty'}`}
                      onClick={() => pickSlot(player, rankIndex)}
                      disabled={isFilled}
                    >
                      {isFilled ? (
                        <img
                          src={rankings[player][rankIndex].image}
                          alt={rankings[player][rankIndex].name}
                          className="slot-image"
                        />
                      ) : isSelected ? (
                        <div className="slot-content">
                          <div className="slot-selected-icon">✨</div>
                          <div className="slot-text">GEWÄHLT</div>
                        </div>
                      ) : (
                        <div className="slot-content">
                          <div className="slot-icon">📍</div>
                          <div>Hier platzieren</div>
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
          className="lock-button"
          onClick={lockIn}
          disabled={!allPlayersPicked}
        >
          {allPlayersPicked ? "🔒 Festlegen!" : "⏳ Warten..."}
        </button>
      </div>
    );
  }

  if (step === "results") {
    return (
      <div className="container results-container">
        <div className="results-wrapper">
          {/* Title */}
          <div className="results-title-card">
            <h1 className="results-title">🏆 Das ultimative Ranking!</h1>
            <p className="results-subtitle">
              Hier sind eure finalen Rankings für {selectedTopic}!
            </p>
          </div>

          {/* Results Grid */}
          <div className="results-main-card">
            <div className="results-grid-container">
              {/* Rank Labels */}
              <div className="results-rank-labels">
                {Array.from({ length: RANKING_SIZE }).map((_, i) => (
                  <div
                    key={i}
                    className={`results-rank-item ${getRankClass(i)}`}
                    style={i >= 3 ? { background: getRankColor(i) } : {}}
                  >
                    <div className="results-rank-emoji">{getRankEmoji(i)}</div>
                    <div className="results-rank-text">Platz {i + 1}</div>
                  </div>
                ))}
              </div>

              {/* Players Results Grid */}
              <div>
                {/* Player Headers */}
                <div 
                  className="results-players-headers"
                  style={{
                    gridTemplateColumns: `repeat(${players.length}, 1fr)`
                  }}
                >
                  {players.map((player, i) => (
                    <div
                      key={player}
                      className="results-player-header"
                      style={getPlayerColor(i)}
                    >
                      <div 
                        className="crown-icon"
                        style={{ color: getPlayerColor(i).color }}
                      >
                        👑
                      </div>
                      {player}
                    </div>
                  ))}
                </div>

                {/* Ranking Results Grid */}
                <div 
                  className="results-ranking-grid"
                  style={{
                    gridTemplateColumns: `repeat(${players.length}, 1fr)`
                  }}
                >
                  {Array.from({ length: RANKING_SIZE * players.length }).map((_, index) => {
                    const rankIndex = Math.floor(index / players.length);
                    const playerIndex = index % players.length;
                    const player = players[playerIndex];
                    const item = rankings[player][rankIndex];

                    return (
                      <div
                        key={`${player}-${rankIndex}`}
                        className={`results-slot ${item ? 'filled' : 'empty'}`}
                      >
                        {item ? (
                          <>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="results-item-image"
                            />
                            <div className="results-item-name">
                              {item.name}
                            </div>
                            {rankIndex < 3 && (
                              <div className="results-rank-badge">
                                {getRankEmoji(rankIndex)}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="results-empty-slot">
                            <div className="results-empty-icon">❌</div>
                            <div>Nicht gewählt</div>
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
          <div className="center">
            <button className="new-game-btn" onClick={resetGame}>
              🔄 Neues Blinranking starten!
            </button>
          </div>
        </div>
      </div>
    );
  }
}