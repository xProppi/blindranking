// src/sessionService.js
import { db } from './firebase';
import { ref, set, get, onValue, update, remove } from 'firebase/database';
import { RANKING_SIZE, MAX_PLAYERS } from './constants/config';

export function generateSessionCode() {
  const num = Math.floor(Math.random() * 1000);
  return String(num).padStart(3, '0');
}

async function generateUniqueSessionCode() {
  let code;
  let attempts = 0;
  do {
    code = generateSessionCode();
    const snapshot = await get(ref(db, `sessions/${code}`));
    if (!snapshot.exists()) return code;
    attempts++;
  } while (attempts < 20);
  throw new Error('Could not generate unique session code');
}

export async function createSession(topic, adminName, poolItems) {
  const code = await generateUniqueSessionCode();
  const adminId = 'player_' + Date.now();

  const initialRanking = {};
  for (let i = 0; i < RANKING_SIZE; i++) { initialRanking[i] = null; }

  await set(ref(db, `sessions/${code}`), {
    topic,
    step: 'lobby',
    createdAt: Date.now(),
    adminId,
    currentItem: null,
    pool: poolItems,
    players: {
      [adminId]: { name: adminName, joinedAt: Date.now() }
    },
    picks: { [adminId]: null },
    rankings: { [adminId]: initialRanking }
  });

  return { code, playerId: adminId };
}

export async function joinSession(code, playerName) {
  const snapshot = await get(ref(db, `sessions/${code}`));
  if (!snapshot.exists()) throw new Error('Session nicht gefunden');

  const session = snapshot.val();
  if (session.step !== 'lobby') throw new Error('Spiel bereits gestartet');

  const playerCount = session.players ? Object.keys(session.players).length : 0;
  if (playerCount >= MAX_PLAYERS) throw new Error(`Session ist voll (max. ${MAX_PLAYERS} Spieler)`);

  const playerId = 'player_' + Date.now();
  const initialRanking = {};
  for (let i = 0; i < RANKING_SIZE; i++) { initialRanking[i] = null; }

  await update(ref(db, `sessions/${code}`), {
    [`players/${playerId}`]: { name: playerName, joinedAt: Date.now() },
    [`picks/${playerId}`]: null,
    [`rankings/${playerId}`]: initialRanking
  });

  return { code, playerId };
}

export function listenToSession(code, callback) {
  const sessionRef = ref(db, `sessions/${code}`);
  return onValue(sessionRef, (snapshot) => {
    callback(snapshot.val());
  });
}

export async function startGame(code, topic, poolItems) {
  const pool = Array.isArray(poolItems) ? poolItems : Object.values(poolItems);
  const randomItem = pool[Math.floor(Math.random() * pool.length)];
  const newPool = pool.filter(item => item.name !== randomItem.name);

  await update(ref(db, `sessions/${code}`), {
    step: 'game',
    topic,
    currentItem: randomItem,
    pool: newPool
  });
}

export async function pickSlot(code, playerId, slotIndex) {
  await update(ref(db, `sessions/${code}/picks`), {
    [playerId]: slotIndex
  });
}

function hasPicked(pickValue) {
  return typeof pickValue === 'number' && pickValue >= 0;
}

export async function lockIn(code, sessionData) {
  const players = sessionData.players || {};
  const picks = sessionData.picks || {};
  const rankings = sessionData.rankings || {};
  const currentItem = sessionData.currentItem;

  if (!currentItem) return;

  const updates = {};

  Object.keys(players).forEach(playerId => {
    const slotIndex = picks[playerId];
    if (hasPicked(slotIndex)) {
      updates[`rankings/${playerId}/${slotIndex}`] = currentItem;
    }
  });

  const hasEmptySlots = Object.keys(players).some(playerId => {
    const playerRanking = rankings[playerId] || {};
    const slotIndex = picks[playerId];
    let filled = Object.keys(playerRanking).filter(k => playerRanking[k] != null).length;
    if (hasPicked(slotIndex) && playerRanking[slotIndex] == null) {
      filled += 1;
    }
    return filled < RANKING_SIZE;
  });

  const pool = sessionData.pool
    ? (Array.isArray(sessionData.pool) ? sessionData.pool : Object.values(sessionData.pool))
    : [];
  const newPool = pool.filter(item => item.name !== currentItem.name);

  Object.keys(players).forEach(id => { updates[`picks/${id}`] = null; });

  if (hasEmptySlots && newPool.length > 0) {
    const nextItem = newPool[Math.floor(Math.random() * newPool.length)];
    const nextPool = newPool.filter(item => item.name !== nextItem.name);
    updates['currentItem'] = nextItem;
    updates['pool'] = nextPool;
  } else {
    updates['step'] = 'results';
    updates['currentItem'] = null;
  }

  await update(ref(db, `sessions/${code}`), updates);
}

export async function skipItem(code, sessionData) {
  const players = sessionData.players || {};
  const pool = sessionData.pool
    ? (Array.isArray(sessionData.pool) ? sessionData.pool : Object.values(sessionData.pool))
    : [];
  const currentItem = sessionData.currentItem;
  if (!currentItem) return;

  const newPool = pool.filter(item => item.name !== currentItem.name);

  const updates = {};
  Object.keys(players).forEach(id => { updates[`picks/${id}`] = null; });

  if (newPool.length > 0) {
    const nextItem = newPool[Math.floor(Math.random() * newPool.length)];
    const nextPool = newPool.filter(item => item.name !== nextItem.name);
    updates['currentItem'] = nextItem;
    updates['pool'] = nextPool;
  } else {
    updates['step'] = 'results';
    updates['currentItem'] = null;
  }

  await update(ref(db, `sessions/${code}`), updates);
}

export async function endSession(code) {
  await remove(ref(db, `sessions/${code}`));
}

export async function resetSession(code) {
  const snapshot = await get(ref(db, `sessions/${code}`));
  if (!snapshot.exists()) return;

  const session = snapshot.val();
  const players = session.players || {};

  const updates = {
    step: 'lobby',
    currentItem: null,
  };

  Object.keys(players).forEach(pid => {
    const initialRanking = {};
    for (let i = 0; i < RANKING_SIZE; i++) { initialRanking[i] = null; }
    updates[`rankings/${pid}`] = initialRanking;
    updates[`picks/${pid}`] = null;
  });

  await update(ref(db, `sessions/${code}`), updates);
}