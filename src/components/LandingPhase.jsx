import { useState } from "react";
import { createSession, joinSession } from "../sessionService";
import { loadTopicsData } from "../utils/topicsLoader";
import useIsMobile from "../hooks/useIsMobile";

export default function LandingPhase({ onSessionCreated, onSessionJoined }) {
  const [mode, setMode] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [joinCode, setJoinCode] = useState("");
  const [joinName, setJoinName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isMobile = useIsMobile();

  const topics = loadTopicsData();

  const handleCreate = async () => {
    if (!adminName.trim() || !selectedTopic) return;
    setLoading(true);
    setError("");
    try {
      const poolItems = topics[selectedTopic];
      const result = await createSession(selectedTopic, adminName.trim(), poolItems);
      onSessionCreated({ code: result.code, playerId: result.playerId, topic: selectedTopic });
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim() || !joinName.trim()) return;
    setLoading(true);
    setError("");
    try {
      const result = await joinSession(joinCode.trim().toUpperCase(), joinName.trim());
      onSessionJoined({ code: result.code, playerId: result.playerId });
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "2px solid #444",
    borderRadius: "0",
    fontSize: "16px",
    fontWeight: "700",
    outline: "none",
    boxSizing: "border-box",
    background: "#222",
    color: "#fff",
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
        maxWidth: "900px",
        background: "#1a1a1a",
        borderRadius: "0",
        padding: isMobile ? "28px 16px" : "50px",
        border: "2px solid #333"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? "28px" : "40px" }}>
          <h1 style={{
            fontSize: isMobile ? "2.2rem" : "3.5rem",
            fontWeight: "900",
            color: "#ff00ff",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "2px"
          }}>
            Blindranking
          </h1>
          <p style={{ fontSize: isMobile ? "0.95rem" : "1.1rem", color: "#888", fontWeight: "700" }}>
            Rank together with friends in real time
          </p>
        </div>

        {/* Mode selection */}
        {mode === null && (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "10px" : "16px"
          }}>
            <button
              style={{
                padding: isMobile ? "28px 16px" : "40px 20px",
                background: "#ff00ff",
                color: "white",
                border: "none",
                borderRadius: "0",
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "900",
                cursor: "pointer",
                textTransform: "uppercase"
              }}
              onClick={() => setMode("create")}
            >
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>+</div>
              Create Session
              <div style={{ fontSize: "13px", opacity: 0.7, marginTop: "8px", fontWeight: "700" }}>
                Pick a topic and invite friends
              </div>
            </button>
            <button
              style={{
                padding: isMobile ? "28px 16px" : "40px 20px",
                background: "#22cc22",
                color: "white",
                border: "none",
                borderRadius: "0",
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "900",
                cursor: "pointer",
                textTransform: "uppercase"
              }}
              onClick={() => setMode("join")}
            >
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>#</div>
              Join Session
              <div style={{ fontSize: "13px", opacity: 0.7, marginTop: "8px", fontWeight: "700" }}>
                Enter a code from a friend
              </div>
            </button>
          </div>
        )}

        {/* Create Session */}
        {mode === "create" && (
          <div>
            <button
              onClick={() => { setMode(null); setError(""); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#888", fontSize: "15px", marginBottom: "24px",
                fontWeight: "700", padding: "0"
              }}
            >
              &larr; Back
            </button>

            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "900", color: "#fff", marginBottom: "12px", textTransform: "uppercase" }}>
                Your name
              </h2>
              <input
                style={{ ...inputStyle, maxWidth: "400px" }}
                value={adminName}
                onChange={e => setAdminName(e.target.value)}
                placeholder="Enter your name..."
                onKeyDown={e => e.key === "Enter" && handleCreate()}
              />
            </div>

            <h2 style={{ fontSize: "1.2rem", fontWeight: "900", color: "#fff", margin: "24px 0 12px", textTransform: "uppercase" }}>
              Choose Topic
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(auto-fill, minmax(150px, 1fr))"
                : "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "6px",
              maxHeight: "300px",
              overflowY: "auto",
              paddingRight: "4px"
            }}>
              {Object.keys(topics).map(topic => (
                <button
                  key={topic}
                  style={{
                    textAlign: "left",
                    padding: isMobile ? "12px 14px" : "14px 18px",
                    borderRadius: "0",
                    border: selectedTopic === topic ? "3px solid #22cc22" : "2px solid #333",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "800",
                    background: selectedTopic === topic ? "#22cc22" : "#222",
                    color: "#fff"
                  }}
                  onClick={() => setSelectedTopic(topic)}
                >
                  <div>{topic}</div>
                  <div style={{ fontSize: "12px", opacity: 0.6, marginTop: "4px" }}>
                    {topics[topic].length} items
                  </div>
                </button>
              ))}
            </div>

            {error && (
              <div style={{ marginTop: "16px", color: "#ff0044", fontWeight: "700", fontSize: "14px" }}>
                {error}
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button
                style={{
                  padding: "16px 40px",
                  background: (!adminName.trim() || !selectedTopic) ? "#333" : "#ff00ff",
                  color: "white",
                  border: "none",
                  borderRadius: "0",
                  fontSize: "17px",
                  fontWeight: "900",
                  cursor: (!adminName.trim() || !selectedTopic || loading) ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  width: isMobile ? "100%" : "auto",
                  textTransform: "uppercase"
                }}
                onClick={handleCreate}
                disabled={!adminName.trim() || !selectedTopic || loading}
              >
                {loading ? "Creating..." : "Create Session"}
              </button>
            </div>
          </div>
        )}

        {/* Join Session */}
        {mode === "join" && (
          <div>
            <button
              onClick={() => { setMode(null); setError(""); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#888", fontSize: "15px", marginBottom: "24px",
                fontWeight: "700", padding: "0"
              }}
            >
              &larr; Back
            </button>

            <div style={{ maxWidth: "420px", margin: "0 auto" }}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: "900", color: "#fff", marginBottom: "8px", fontSize: "15px", textTransform: "uppercase" }}>
                  Session Code
                </label>
                <input
                  style={{
                    ...inputStyle,
                    fontSize: "22px",
                    letterSpacing: "6px",
                    textTransform: "uppercase",
                    textAlign: "center"
                  }}
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength={6}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontWeight: "900", color: "#fff", marginBottom: "8px", fontSize: "15px", textTransform: "uppercase" }}>
                  Your name
                </label>
                <input
                  style={inputStyle}
                  value={joinName}
                  onChange={e => setJoinName(e.target.value)}
                  placeholder="Enter your name..."
                  onKeyDown={e => e.key === "Enter" && handleJoin()}
                />
              </div>

              {error && (
                <div style={{ marginBottom: "16px", color: "#ff0044", fontWeight: "700", fontSize: "14px" }}>
                  {error}
                </div>
              )}

              <button
                style={{
                  width: "100%",
                  padding: "16px",
                  background: (!joinCode.trim() || !joinName.trim()) ? "#333" : "#22cc22",
                  color: "white",
                  border: "none",
                  borderRadius: "0",
                  fontSize: "17px",
                  fontWeight: "900",
                  cursor: (!joinCode.trim() || !joinName.trim() || loading) ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  textTransform: "uppercase"
                }}
                onClick={handleJoin}
                disabled={!joinCode.trim() || !joinName.trim() || loading}
              >
                {loading ? "Joining..." : "Join Session"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}