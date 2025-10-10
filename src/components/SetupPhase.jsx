import { useState } from "react";
import { getPlayerColor } from "../utils/helpers";

export default function SetupPhase({ 
  players, 
  setPlayers, 
  selectedTopic, 
  setSelectedTopic, 
  topics, 
  onStart 
}) {
  const [name, setName] = useState("");

  const addPlayer = () => {
    const trimmedName = name.trim();
    if (!trimmedName || players.includes(trimmedName)) return;
    setPlayers([...players, trimmedName]);
    setName("");
  };

  const removePlayer = (playerToRemove) => {
    setPlayers(players.filter(p => p !== playerToRemove));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '24px',
        padding: '50px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            Blindranking
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#6b7280', fontWeight: '500' }}>
            Create your ranking with friends
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Players Section */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
            borderRadius: '20px',
            padding: '30px',
            border: '2px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#1e293b'
            }}>
              Add Players
            </h2>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  border: '2px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  background: 'white'
                }}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter player name..."
                onKeyPress={e => e.key === 'Enter' && addPlayer()}
              />
              <button
                style={{
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
                onClick={addPlayer}
              >
                Add
              </button>
            </div>

            <div style={{ display: 'grid', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
              {players.map((player, i) => (
                <div key={i} style={{
                  background: 'white',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: getPlayerColor(i),
                      color: 'white',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700'
                    }}>
                      {i + 1}
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '16px', color: '#1e293b' }}>
                      {player}
                    </span>
                  </div>
                  <button
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                    onClick={() => removePlayer(player)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {players.length === 0 && (
                <div style={{
                  padding: '60px',
                  textAlign: 'center',
                  color: '#9ca3af',
                  fontSize: '15px'
                }}>
                  No players added yet
                </div>
              )}
            </div>
          </div>

          {/* Topics Section */}
          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff, #dbeafe)',
            borderRadius: '20px',
            padding: '30px',
            border: '2px solid #dbeafe'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#1e293b'
            }}>
              Choose Topic
            </h2>

            <div style={{ display: 'grid', gap: '12px', maxHeight: '470px', overflowY: 'auto' }}>
              {Object.keys(topics).map(topic => (
                <button
                  key={topic}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '18px 22px',
                    borderRadius: '12px',
                    border: selectedTopic === topic ? '3px solid #10b981' : '2px solid #e5e7eb',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    background: selectedTopic === topic
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'white',
                    color: selectedTopic === topic ? 'white' : '#374151',
                    boxShadow: selectedTopic === topic
                      ? '0 8px 20px rgba(16, 185, 129, 0.3)'
                      : '0 2px 6px rgba(0, 0, 0, 0.06)'
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
                      fontSize: '13px',
                      opacity: 0.8,
                      background: 'rgba(255, 255, 255, 0.2)',
                      padding: '4px 10px',
                      borderRadius: '6px'
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
              padding: '18px 40px',
              background: (!selectedTopic || players.length === 0)
                ? '#d1d5db'
                : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              cursor: (!selectedTopic || players.length === 0) ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              fontWeight: '700',
              boxShadow: (!selectedTopic || players.length === 0)
                ? 'none'
                : '0 8px 25px rgba(16, 185, 129, 0.4)'
            }}
            onClick={onStart}
            disabled={!selectedTopic || players.length === 0}
          >
            Start Ranking
          </button>
        </div>
      </div>
    </div>
  );
}