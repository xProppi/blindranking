import { useState } from "react";
import { startGame } from "../sessionService";
import { getPlayerColor } from "../utils/helpers";
import { MAX_PLAYERS } from "../constants/config";
import useIsMobile from "../hooks/useIsMobile";

export default function HubPhase({ sessionCode, sessionData, isAdmin, playerId }) {
  const [starting, setStarting] = useState(false);
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();

  const players = sessionData?.players
    ? Object.entries(sessionData.players).map(([id, p]) => ({ id, ...p }))
    : [];

  const pool = sessionData?.pool
    ? (Array.isArray(sessionData.pool) ? sessionData.pool : Object.values(sessionData.pool))
    : [];

  const handleStart = async () => {
    if (pool.length === 0) return;
    setStarting(true);
    try {
      await startGame(sessionCode, pool);
    } catch (e) {
      console.error(e);
      setStarting(false);
    }
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
        <p style={{ color: "#888", fontSize: "15px", marginBottom: "36px", fontWeight: "700" }}>
          Topic: <strong style={{ color: "#ff00ff" }}>{sessionData?.topic}</strong>
        </p>

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