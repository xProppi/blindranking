import { useState } from "react";
import SetupPhase from "./components/SetupPhase";
import GamePhase from "./components/GamePhase";
import ResultsPhase from "./components/ResultsPhase";
import { loadTopicsData } from "./utils/topicsLoader";
import { RANKING_SIZE } from "./constants/config";

export default function App() {
  const [players, setPlayers] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [step, setStep] = useState("setup");
  const [itemPool, setItemPool] = useState([]);
  const [rankings, setRankings] = useState({});
  const [currentItem, setCurrentItem] = useState(null);
  const [picks, setPicks] = useState({});

  const topics = loadTopicsData();

  const startGame = () => {
    if (!selectedTopic || players.length === 0) return;
    const pool = [...topics[selectedTopic]];
    setItemPool(pool);
    setRankings(players.reduce((acc, p) => ({ ...acc, [p]: Array(RANKING_SIZE).fill(null) }), {}));
    setPicks(players.reduce((acc, p) => ({ ...acc, [p]: null }), {}));
    setCurrentItem(pool[Math.floor(Math.random() * pool.length)]);
    setStep("game");
  };

  const pickSlot = (player, index) => {
    if (rankings[player][index] !== null) return;
    setPicks({ ...picks, [player]: index });
  };

  const skipCurrent = () => {
    const newPool = itemPool.filter(item => item.name !== currentItem.name);
    setItemPool(newPool);
    if (newPool.length > 0) {
      setCurrentItem(newPool[Math.floor(Math.random() * newPool.length)]);
      setPicks(players.reduce((acc, p) => ({ ...acc, [p]: null }), {}));
    } else {
      setStep("results");
    }
  };

  const lockIn = () => {
    if (players.some(p => picks[p] === null)) return;
    const newRankings = { ...rankings };
    players.forEach(p => {
      newRankings[p][picks[p]] = currentItem;
    });
    setRankings(newRankings);

    const hasEmptySlots = players.some(player => newRankings[player].some(slot => slot === null));
    if (hasEmptySlots) {
      const newPool = itemPool.filter(item => item.name !== currentItem.name);
      setItemPool(newPool);
      if (newPool.length > 0) {
        setCurrentItem(newPool[Math.floor(Math.random() * newPool.length)]);
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
    setCurrentItem(null);
    setItemPool([]);
  };

  if (step === "setup") {
    return (
      <SetupPhase
        players={players}
        setPlayers={setPlayers}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        topics={topics}
        onStart={startGame}
      />
    );
  }

  if (step === "game") {
    return (
      <GamePhase
        players={players}
        rankings={rankings}
        picks={picks}
        currentItem={currentItem}
        onPickSlot={pickSlot}
        onLockIn={lockIn}
        onSkip={skipCurrent}
      />
    );
  }

  if (step === "results") {
    return (
      <ResultsPhase
        players={players}
        rankings={rankings}
        selectedTopic={selectedTopic}
        onReset={resetGame}
      />
    );
  }
}