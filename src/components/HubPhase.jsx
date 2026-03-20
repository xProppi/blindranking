import { useState } from "react";
import { startGame } from "../sessionService";
import { getPlayerColor } from "../utils/helpers";
import { MAX_PLAYERS } from "../constants/config";
import { loadTopicsGrouped } from "../utils/topicsLoader";
import useIsMobile from "../hooks/useIsMobile";

export default function HubPhase({ sessionCode, sessionData, isAdmin, playerId }) {
  const [starting, setStarting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  // lokale Topic-Auswahl (ueberschreibt Firebase-Topic wenn gesetzt)
  const [localTopic, setLocalTopic] = useState(null);
  const isMobile = useIsMobile();

  const groups = loadTopicsGrouped();

  const players = sessionData?.players
    ? Object.entries(sessionData.players).map(([id, p]) => ({ id, ...p }))
    : [];

  // aktives Topic + Pool bestimmen
  const activeTopic = localTopic?.topicKey || sessionData?.topic;
  const activePool = localTopic
    ? groups[localTopic.groupIdx].topics[localTopic.topicKey]
    : sessionData?.pool
      ? (Array.isArray(sessionData.pool) ? sessionData.pool : Object.values(sessionData.pool))
      : [];

  const handleStart = async () => {
    if (activePool.length === 0) return;
    setStarting(true);
    try {
      await startGame(sessionCode, activeTopic, activePool);
    } catch (e) {
      console.error(e);
      setStarting(false);
    }
  };

  const handleSelectTopic = (groupIdx, topicKey) => {
    setLocalTopic({ groupIdx, topicKey });
    setShowTopicPicker(false);
  };

  const toggleGroup = (idx) => {
    setExpandedGroups(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const copyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111",
      padding: isMobile ? "20px 12px" : "40px 20px",
      fontFamily: "'Arial Black', Impact, system-ui, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "560px",
        background: "#1a1a1a",
        borderRadius: "0",
        padding: isMobile ? "32px 16px" : "50px",
        border: "2px solid #333",
        textAlign: "center"
      }}>
        <h1 style={{
          fontSize: isMobile ? "1.6rem" : "2rem",
          fontWeight: "900",
          color: "#fff",
          marginBottom: "6px",
          textTransform: "uppercase"
        }}>
          
        </h1>
        <div style={{ color: "#888", fontSize: "15px", marginBottom: "36px", fontWeight: "700" }}>
          Topic: <strong style={{ color: "#ff00ff" }}>{activeTopic}</strong>
          {isAdmin && (
            <button
              onClick={() => setShowTopicPicker(!showTopicPicker)}
              style={{
                marginLeft: "12px",
                padding: "4px 12px",
                background: "#333",
                border: "2px solid #555",
                borderRadius: "0",
                fontSize: "12px",
                fontWeight: "800",
                color: "#ffff00",
                cursor: "pointer",
                textTransform: "uppercase"
              }}
            >
              {showTopicPicker ? "Schliessen" : "Aendern"}
            </button>
          )}
        </div>

        {/* Topic Picker */}
        {showTopicPicker && isAdmin && (
          <div style={{
            background: "#222",
            border: "2px solid #444",
            padding: "16px",
            marginBottom: "24px",
            maxHeight: "300px",
            overflowY: "auto",
            textAlign: "left"
          }}>
            {groups.map((group, idx) => {
              const keys = Object.keys(group.topics);
              if (keys.length === 0) return null;
              return (
                <div key={idx} style={{ marginBottom: "8px" }}>
                  <button
                    onClick={() => toggleGroup(idx)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 14px",
                      background: "#2a2a2a",
                      border: "2px solid #444",
                      borderRadius: "0",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      color: group.color,
                      fontSize: "13px",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      letterSpacing: "1px"
                    }}
                  >
                    <span>{group.name} ({keys.length})</span>
                    <span style={{
                      transform: expandedGroups[idx] ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      fontSize: "10px"
                    }}>&#9660;</span>
                  </button>
                  {expandedGroups[idx] && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginTop: "4px" }}>
                      {keys.map(topic => {
                        const isActive = activeTopic === topic &&
                          (!localTopic || localTopic.groupIdx === idx);
                        return (
                          <button
                            key={`${idx}-${topic}`}
                            style={{
                              textAlign: "left",
                              padding: "10px 12px",
                              borderRadius: "0",
                              border: isActive ? "2px solid #22cc22" : "2px solid #333",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "800",
                              background: isActive ? "#22cc22" : "#1a1a1a",
                              color: "#fff"
                            }}
                            onClick={() => handleSelectTopic(idx, topic)}
                          >
                            <div>{topic}</div>
                            <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "2px" }}>
                              {group.topics[topic].length} items
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Session Code */}
        <div style={{
          background: "#222",
          borderRadius: "0",
          padding: isMobile ? "20px 16px" : "24px",
          marginBottom: "36px",
          border: "2px solid #444"
        }}>
          <div style={{ fontSize: "13px", fontWeight: "900", color: "#888", marginBottom: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
            Session Code
          </div>
          <div style={{
            fontSize: isMobile ? "2.2rem" : "3rem",
            fontWeight: "900",
            color: "#ffff00",
            letterSpacing: isMobile ? "6px" : "10px",
            marginBottom: "14px"
          }}>
            {sessionCode}
          </div>
          <button
            onClick={copyCode}
            style={{
              padding: "8px 20px",
              background: "#333",
              border: "2px solid #555",
              borderRadius: "0",
              fontSize: "13px",
              fontWeight: "800",
              color: "#fff",
              cursor: "pointer",
              textTransform: "uppercase"
            }}
          >
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>

        {/* Players */}
        <div style={{ marginBottom: "36px", textAlign: "left" }}>
          <h2 style={{
            fontSize: "1rem",
            fontWeight: "900",
            color: "#888",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: "14px"
          }}>
            Players ({players.length}/{MAX_PLAYERS})
          </h2>
          <div style={{ display: "grid", gap: "6px" }}>
            {players.map((player, i) => (
              <div
                key={player.id}
                style={{
                  background: "#222",
                  border: "2px solid #333",
                  borderRadius: "0",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px"
                }}
              >
                <div style={{
                  width: "38px",
                  height: "38px",
                  background: getPlayerColor(i),
                  color: "white",
                  borderRadius: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "900",
                  fontSize: "15px",
                  flexShrink: 0
                }}>
                  {i + 1}
                </div>
                <span style={{ fontWeight: "800", fontSize: "16px", color: "#fff" }}>
                  {player.name}
                </span>
                {player.id === playerId && (
                  <span style={{
                    fontSize: "12px", fontWeight: "800", color: "#888",
                    background: "#333", padding: "3px 8px", borderRadius: "0"
                  }}>
                    You
                  </span>
                )}
                {player.id === sessionData?.adminId && (
                  <span style={{
                    marginLeft: "auto",
                    fontSize: "12px",
                    fontWeight: "900",
                    color: "#ff00ff",
                    background: "#2a0a2a",
                    padding: "3px 10px",
                    borderRadius: "0"
                  }}>
                    Admin
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {isAdmin ? (
          <button
            style={{
              width: "100%",
              padding: "18px",
              background: players.length < 1 ? "#333" : "#22cc22",
              color: "white",
              border: "none",
              borderRadius: "0",
              fontSize: "18px",
              fontWeight: "900",
              cursor: (players.length < 1 || starting) ? "not-allowed" : "pointer",
              opacity: starting ? 0.7 : 1,
              textTransform: "uppercase"
            }}
            onClick={handleStart}
            disabled={players.length < 1 || starting}
          >
            {starting ? "Starting..." : "Spiel Starten"}
          </button>
        ) : (
          <div style={{
            padding: "18px",
            background: "#222",
            border: "2px solid #333",
            borderRadius: "0",
            color: "#888",
            fontSize: "15px",
            fontWeight: "700",
            textTransform: "uppercase"
          }}>
            Waiting for admin to start...
          </div>
        )}
      </div>
    </div>
  );
}