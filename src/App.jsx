// src/App.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import LandingPhase from "./components/LandingPhase";
import HubPhase from "./components/HubPhase";
import GamePhase from "./components/GamePhase";
import ResultsPhase from "./components/ResultsPhase";
import { RANKING_SIZE } from "./constants/config";
import { listenToSession, pickSlot, lockIn, skipItem, endSession, resetSession } from "./sessionService";

const STORAGE_KEY = 'blindranking_session';

function saveToStorage(sessionCode, playerId) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessionCode, playerId }));
  } catch (e) { /* localStorage nicht verfuegbar */ }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function clearStorage() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* */ }
}

export default function App() {
  const [appStep, setAppStep] = useState("landing");
  const [sessionCode, setSessionCode] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [isLocking, setIsLocking] = useState(false);

  const sessionActiveRef = useRef(false);

  const isAdmin = !!(sessionData && playerId && sessionData.adminId === playerId);

  // Reconnect beim Start
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved && saved.sessionCode && saved.playerId) {
      setSessionCode(saved.sessionCode);
      setPlayerId(saved.playerId);
      setAppStep("reconnecting");
    }
  }, []);

  // Firebase Listener
  useEffect(() => {
    if (!sessionCode) {
      sessionActiveRef.current = false;
      return;
    }
    sessionActiveRef.current = true;
    const unsubscribe = listenToSession(sessionCode, (data) => {
      if (!sessionActiveRef.current) return;
      if (!data) {
        clearStorage();
        resetGame();
        return;
      }
      setSessionData(data);
    });
    return () => {
      sessionActiveRef.current = false;
      unsubscribe();
    };
  }, [sessionCode]);

  // appStep aus sessionData.step ableiten
  useEffect(() => {
    if (!sessionData || !playerId) return;

    if (!sessionData.players?.[playerId]) {
      clearStorage();
      resetGame();
      return;
    }

    const step = sessionData.step;
    if (step === "lobby" || step === "game" || step === "results") {
      setAppStep(step);
    }
  }, [sessionData, playerId]);

  const onSessionCreated = ({ code, playerId: pid }) => {
    setSessionCode(code);
    setPlayerId(pid);
    setAppStep("lobby");
    saveToStorage(code, pid);
  };

  const onSessionJoined = ({ code, playerId: pid }) => {
    setSessionCode(code);
    setPlayerId(pid);
    setAppStep("lobby");
    saveToStorage(code, pid);
  };

  const handlePickSlot = (pId, slotIndex) => {
    pickSlot(sessionCode, pId, slotIndex);
  };

  const handleLockIn = async () => {
    if (!isAdmin || !sessionData || isLocking) return;
    setIsLocking(true);
    try {
      await lockIn(sessionCode, sessionData);
    } finally {
      setIsLocking(false);
    }
  };

  const handleSkip = async () => {
    if (!isAdmin || !sessionData || isLocking) return;
    setIsLocking(true);
    try {
      await skipItem(sessionCode, sessionData);
    } finally {
      setIsLocking(false);
    }
  };

  const handleEndSession = async () => {
    if (!isAdmin || !sessionCode) return;
    await endSession(sessionCode);
  };

const handlePlayAgain = async () => {
  if (!isAdmin || !sessionCode) return;
  await resetSession(sessionCode);
};

  const resetGame = useCallback(() => {
    sessionActiveRef.current = false;
    clearStorage();
    setAppStep("landing");
    setSessionCode(null);
    setPlayerId(null);
    setSessionData(null);
    setIsLocking(false);
  }, []);

  const playersList = sessionData?.players
    ? Object.entries(sessionData.players).map(([id, p]) => ({ id, name: p.name }))
    : [];

  const picks = sessionData?.picks || {};
  const rankings = sessionData?.rankings || {};
  const currentItem = sessionData?.currentItem || null;

  if (appStep === "reconnecting") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Arial Black', Impact, system-ui, sans-serif",
        color: "white",
        fontSize: "1.3rem",
        fontWeight: "900",
        textTransform: "uppercase"
      }}>
        Reconnecting...
      </div>
    );
  }

  if (appStep === "landing") {
    return (
      <LandingPhase
        onSessionCreated={onSessionCreated}
        onSessionJoined={onSessionJoined}
      />
    );
  }

  if (appStep === "lobby") {
    return (
      <HubPhase
        sessionCode={sessionCode}
        sessionData={sessionData}
        isAdmin={isAdmin}
        playerId={playerId}
      />
    );
  }

  if (appStep === "game") {
    return (
      <GamePhase
        playersList={playersList}
        rankings={rankings}
        picks={picks}
        currentItem={currentItem}
        playerId={playerId}
        isAdmin={isAdmin}
        isLocking={isLocking}
        onPickSlot={handlePickSlot}
        onLockIn={handleLockIn}
        onSkip={handleSkip}
        onEndSession={handleEndSession}
      />
    );
  }

  if (appStep === "results") {
    return (
      <ResultsPhase
        playersList={playersList}
        rankings={rankings}
        selectedTopic={sessionData?.topic}
        onReset={resetGame}
        onPlayAgain={handlePlayAgain}
        isAdmin={isAdmin}
        rankingSize={RANKING_SIZE}
        playerId={playerId}
      />
    );
  }
}