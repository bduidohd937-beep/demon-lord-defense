import { useEffect, useState } from "react";
import type { BattleReport, GameState, MonsterId } from "./types/game";
import {
  HEROES, INITIAL_GAME, MAX_CASTLE_HP, MONSTERS, MONSTER_IDS,
  TOTAL_WAVES, WAVES, WAVE_TITLES,
} from "./data/gameData";
import {
  applyBattle, dismissMonster, healCost, hireMonster,
  monsterAttack, monsterMaxHp, monsterUpgradeCost,
  repairCastle, simulateWave, swapRooms, upgradeMonster,
} from "./game/battleLogic";
import CharacterSprite from "./components/CharacterSprite";
import BattleArena from "./components/BattleArena";
import { activateAudio, playBattleCue } from "./game/battleAudio";
import "./App.css";

const SAVE_KEY = "demon-lord-defense-v01";

function loadGame(): GameState {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return structuredClone(INITIAL_GAME);
    const raw: unknown = JSON.parse(saved);
    if (!raw || typeof raw !== "object") return structuredClone(INITIAL_GAME);
    const data = raw as Partial<GameState>;
    const isValidSlot = (slot: unknown) => {
      if (slot === null) return true;
      if (!slot || typeof slot !== "object") return false;
      const parsed = slot as { id?: unknown; level?: unknown };
      return typeof parsed.id === "string" && parsed.id in MONSTERS
        && Number.isInteger(parsed.level) && Number(parsed.level) >= 1 && Number(parsed.level) <= 3;
    };
    if (!Array.isArray(data.rooms) || data.rooms.length !== 3 ||
        !data.rooms.every(isValidSlot) ||
        typeof data.gold !== "number" || !Number.isFinite(data.gold) ||
        typeof data.castleHp !== "number" || !Number.isFinite(data.castleHp) ||
        typeof data.wave !== "number" || !Number.isInteger(data.wave) ||
        data.wave < 1 || data.wave > TOTAL_WAVES ||
        !["planning", "victory", "defeat"].includes(String(data.phase))) {
      return structuredClone(INITIAL_GAME);
    }
    return {
      ...structuredClone(INITIAL_GAME),
      gold: Math.max(0, data.gold),
      castleHp: Math.max(0, Math.min(MAX_CASTLE_HP, data.castleHp)),
      wave: data.wave,
      phase: data.phase!,
      rooms: data.rooms as GameState["rooms"],
      kills: typeof data.kills === "number" && Number.isFinite(data.kills) ? Math.max(0, data.kills) : 0,
      history: Array.isArray(data.history) ? data.history.filter((x): x is string => typeof x === "string").slice(0, 30) : [],
    };
  } catch {
    return structuredClone(INITIAL_GAME);
  }
}

export default function App() {
  const [game, setGame] = useState<GameState>(loadGame);
  const [selectedRoom, setSelectedRoom] = useState(1);
  const [battle, setBattle] = useState<BattleReport | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [fast, setFast] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(game));
    } catch (error) {
      console.error("저장 실패", error);
    }
  }, [game]);

  useEffect(() => {
    if (!battle) return;
    if (frameIndex >= battle.frames.length - 1) {
      setGame(current => applyBattle(current, battle));
      setBattle(null);
      setFrameIndex(0);
      return;
    }
    const timer = window.setTimeout(() => setFrameIndex(index => index + 1), fast ? 165 : 650);
    return () => window.clearTimeout(timer);
  }, [battle, frameIndex, fast]);

  useEffect(() => {
    if (!battle || !soundEnabled) return;
    playBattleCue(battle.frames[Math.min(frameIndex, battle.frames.length - 1)]);
  }, [battle, frameIndex, soundEnabled]);

  const frame = battle ? battle.frames[Math.min(frameIndex, battle.frames.length - 1)] : null;
  const isBattling = battle !== null;
  const isPlanning = game.phase === "planning" && !isBattling;
  const castleHp = frame?.castleHp ?? game.castleHp;
  const roomHp = frame?.roomHp ?? game.rooms.map(slot => slot ? monsterMaxHp(slot) : 0);
  const waveEnemies = WAVES[game.wave - 1] ?? [];
  const selected = game.rooms[selectedRoom];

  const beginBattle = () => {
    if (!isPlanning) return;
    setFast(false);
    setFrameIndex(0);
    setBattle(simulateWave(game));
  };
  const skipBattle = () => {
    if (!battle) return;
    setGame(current => applyBattle(current, battle));
    setBattle(null);
    setFrameIndex(0);
  };
  const restart = () => {
    if (!window.confirm("처음부터 새 던전으로 도전할까요? 현재 진행 상황은 사라집니다.")) return;
    setBattle(null);
    setFrameIndex(0);
    setGame(structuredClone(INITIAL_GAME));
    setSelectedRoom(1);
  };
  const hire = (id: MonsterId) => setGame(current => hireMonster(current, selectedRoom, id));

  return (
    <div className="app">
      <header className="site-header">
        <div className="shell header-layout">
          <div className="branding">
            <div className="brand-mark">👹</div>
            <div>
              <span className="eyebrow">DUNGEON MANAGEMENT GAME</span>
              <h1>마왕님, 용사가 너무 많아요!</h1>
            </div>
          </div>
          <span className="version">EARLY ACCESS · V0.2</span>
        </div>
      </header>

      <main className="shell">
        <section className="dashboard" aria-label="던전 현황">
          <div className="dashboard-stat">
            <span>💰 마왕군 금고</span>
            <strong className="gold-text">{game.gold.toLocaleString()}<small> G</small></strong>
          </div>
          <div className="dashboard-stat">
            <span>🏰 마왕성 내구도</span>
            <strong>{castleHp}<small> / {MAX_CASTLE_HP}</small></strong>
            <div className="hp-track"><div style={{ width: (castleHp / MAX_CASTLE_HP * 100) + "%" }} /></div>
          </div>
          <div className="dashboard-stat">
            <span>⚔️ 웨이브 진행</span>
            <strong>{game.wave}<small> / {TOTAL_WAVES}</small></strong>
          </div>
          <div className="dashboard-stat">
            <span>💀 누적 격퇴</span>
            <strong>{game.kills + (frame?.kills ?? 0)}<small> 명</small></strong>
          </div>
        </section>

        <div className="game-grid">
          <div className="primary-column">
            <section className="panel dungeon-panel">
              <div className="panel-top">
                <div>
                  <span className="eyebrow">YOUR DUNGEON · THREE ROOMS</span>
                  <h2>🏰 마왕의 던전</h2>
                  <p>침입자는 1번 방부터 돌파합니다. 방을 선택해 몬스터를 고용하세요.</p>
                </div>
                <button className="text-button" onClick={() => setShowRules(value => !value)}>
                  {showRules ? "규칙 닫기" : "❔ 전투 규칙"}
                </button>
              </div>
              {showRules && (
                <div className="rules-box">
                  몬스터가 먼저 공격하고, 살아남은 용사가 반격합니다.
                  용사는 몬스터가 쓰러지면 다음 방으로 이동해요.
                  모든 방을 통과하면 마왕성에 피해를 줍니다. 웨이브가 끝나면 몬스터 체력이 회복됩니다.
                  몬스터는 방마다 1마리씩 배치할 수 있어요.
                </div>
              )}

              <BattleArena
                game={game}
                battle={battle}
                frame={frame}
                frameIndex={frameIndex}
                selectedRoom={selectedRoom}
                fast={fast}
                soundEnabled={soundEnabled}
                onToggleSpeed={() => setFast(value => !value)}
                onToggleSound={() => {
                  if (!soundEnabled) activateAudio();
                  setSoundEnabled(value => !value);
                }}
                onSkip={skipBattle}
              />
              <div className="rooms">
                {game.rooms.map((slot, index) => {
                  const monster = slot ? MONSTERS[slot.id] : null;
                  const hp = roomHp[index];
                  const maxHp = slot ? monsterMaxHp(slot) : 1;
                  const invader = frame?.room === index && frame.hero && frame.hero.hp > 0 ? frame.hero : null;
                  const underAttack = frame?.room === index && ["strike", "counter", "fallen", "slain"].includes(frame.kind);
                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={isBattling || game.phase !== "planning"}
                      aria-pressed={selectedRoom === index}
                      className={"room " +
                        (selectedRoom === index && isPlanning ? "selected " : "") +
                        (underAttack ? "under-attack " : "") +
                        (hp <= 0 && slot ? "room-fallen" : "")}
                      onClick={() => setSelectedRoom(index)}
                    >
                      <div className="room-head">
                        <span>ROOM 0{index + 1}</span>
                        {selectedRoom === index && isPlanning && <span className="selected-tag">선택됨</span>}
                      </div>
                      <div className="room-stage">
                        <span className="room-decoration">{["🕯️", "🦴", "🔥"][index]}</span>
                        {monster ? <CharacterSprite side="monster" id={monster.id} className="room-monster-art" /> : <span className="monster-sprite" aria-hidden="true">➕</span>}
                        {invader && <span key={frameIndex} className="invader-sprite" aria-label="침입자"><CharacterSprite side="hero" id={invader.id} /></span>}
                      </div>
                      <strong className="room-name">{monster?.name ?? "빈 방"}</strong>
                      <span className="room-subtitle">{slot ? "Lv." + slot.level + " · 공격 " + monsterAttack(slot) : "몬스터를 배치하세요"}</span>
                      {slot ? (
                        <div className="unit-hp">
                          <div className="unit-hp-track"><span style={{ width: (hp / maxHp * 100) + "%" }} /></div>
                          <small>❤️ {hp}/{maxHp}</small>
                        </div>
                      ) : <span className="empty-room-label">+ 배치 가능</span>}
                      {invader && <span className="room-enemy-hp">⚔️ 용사 {invader.hp}/{invader.maxHp}</span>}
                    </button>
                  );
                })}
              </div>
              <div className="room-arrows" aria-hidden="true"><span>입구 🚩</span><span>① → ② → ③</span><span>👑 마왕성</span></div>

              {!battle && game.phase === "planning" && (
                <div className="battle-prep">
                  <div>
                    <span className="eyebrow">WAVE {game.wave} / {TOTAL_WAVES}</span>
                    <h3>{WAVE_TITLES[game.wave - 1]}</h3>
                    <div className="wave-enemies" aria-label="다가오는 용사 목록">
                      {waveEnemies.map((id, i) => <span key={i} title={HEROES[id].name}>{HEROES[id].emoji} {HEROES[id].name}</span>)}
                    </div>
                  </div>
                  <button className="battle-start" onClick={beginBattle}>⚔️ 용사 침입 시작!</button>
                </div>
              )}

              {game.phase !== "planning" && !battle && (
                <div className={"end-panel " + (game.phase === "victory" ? "victory" : "defeat")}>
                  <div className="end-icon">{game.phase === "victory" ? "👑" : "☠️"}</div>
                  <h2>{game.phase === "victory" ? "던전 방어 성공!" : "마왕성이 함락되었습니다!"}</h2>
                  <p>{game.phase === "victory"
                    ? "왕국의 용사들을 모두 격퇴했습니다. 당신은 진정한 마왕!"
                    : "용사들이 끝내 마왕성을 돌파했습니다. 다시 도전해 보세요."}</p>
                  <button className="battle-start" onClick={restart}>🔄 새로운 던전 도전</button>
                </div>
              )}
            </section>

            <section className="panel monster-panel">
              <div className="panel-top">
                <div><span className="eyebrow">RECRUIT & UPGRADE</span><h2>🛒 몬스터 고용소</h2>
                  <p>{isPlanning ? (selectedRoom + 1) + "번 방을 선택했습니다. 몬스터를 고용하거나 기존 수비병을 강화하세요." : "전투 중에는 던전을 수정할 수 없습니다."}</p>
                </div>
                <span className="room-target">📍 ROOM 0{selectedRoom + 1}</span>
              </div>
              <div className="selected-room-tools">
                {selected ? (
                  <>
                    <span>{MONSTERS[selected.id].emoji} {MONSTERS[selected.id].name} · Lv.{selected.level}</span>
                    <button className="small-button" disabled={!isPlanning || selectedRoom === 0}
                      onClick={() => setGame(current => swapRooms(current, selectedRoom - 1, selectedRoom))}>← 앞방으로</button>
                    <button className="small-button" disabled={!isPlanning || selectedRoom === 2}
                      onClick={() => setGame(current => swapRooms(current, selectedRoom, selectedRoom + 1))}>뒷방으로 →</button>
                    <button className="small-button upgrade-button"
                      disabled={!isPlanning || selected.level >= 3 || game.gold < monsterUpgradeCost(selected)}
                      onClick={() => setGame(current => upgradeMonster(current, selectedRoom))}>
                      {selected.level >= 3 ? "최대 Lv.3" : "⬆️ 강화 " + monsterUpgradeCost(selected) + "G"}
                    </button>
                    <button className="small-button dismiss-button" disabled={!isPlanning}
                      onClick={() => {
                        if (window.confirm("이 몬스터를 해고할까요? 기본 고용비의 50%만 환급됩니다.")) {
                          setGame(current => dismissMonster(current, selectedRoom));
                        }
                      }}>해고</button>
                  </>
                ) : <span>✨ 아직 빈 방이에요. 아래에서 몬스터를 고용하세요!</span>}
              </div>
              <div className="monster-market">
                {MONSTER_IDS.map(id => {
                  const monster = MONSTERS[id];
                  return (
                    <div className="monster-product" key={id}>
                      <div className="product-emoji"><CharacterSprite side="monster" id={id} /></div>
                      <div className="product-detail">
                        <h3>{monster.name}</h3>
                        <p>{monster.description}</p>
                        <small>❤️ {monster.maxHp} · ⚔️ {monster.attack} · 🛡️ {monster.armor}</small>
                        <span className="ability">{monster.ability}</span>
                      </div>
                      <button className="hire-button" onClick={() => hire(id)}
                        disabled={!isPlanning || selected !== null || game.gold < monster.cost}>
                        {monster.cost}G <span>고용</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="side-column">
            <section className="panel commander-panel">
              <span className="eyebrow">DEMON LORD OFFICE</span>
              <div className="commander-avatar">😈</div>
              <h2>마왕 업무 보고</h2>
              <p className="commander-quote">{battle
                ? "왜 저놈들은 퇴근을 안 하는 거냐!!"
                : game.phase === "victory" ? "오늘부로 마왕군 전원 유급휴가다!"
                  : game.phase === "defeat" ? "노동청에 신고할 거다... 용사들..."
                    : game.wave === 1 ? "고블린! 용사들이 온다! 내 월급은 어쩌고!"
                      : "또 왔어?! 내 던전이 맛집이냐?!"}</p>
              <div className="castle-repair">
                <div><strong>🧱 마왕성 수리</strong><small>내구도 최대 5 회복</small></div>
                <button className="small-button" onClick={() => setGame(repairCastle)}
                  disabled={!isPlanning || game.castleHp >= MAX_CASTLE_HP || game.gold < healCost(game.castleHp)}>
                  {game.castleHp >= MAX_CASTLE_HP ? "수리 완료" : healCost(game.castleHp) + "G 수리"}
                </button>
              </div>
            </section>

            <section className="panel tactics-panel">
              <span className="eyebrow">TACTICAL NOTE</span>
              <h2>📜 초보 마왕 교본</h2>
              <div className="tactic-item"><span>🟢</span><p><strong>슬라임</strong>은 적 공격을 약화시켜 선봉에 좋아요.</p></div>
              <div className="tactic-item"><span>💀</span><p><strong>해골 궁수</strong>는 첫 타격이 강해서 뒤쪽 방에 유리해요.</p></div>
              <div className="tactic-item"><span>💣</span><p><strong>폭탄 임프</strong>는 쓰러질 때도 피해를 줘요.</p></div>
              <div className="tactic-item"><span>🛡️</span><p><strong>철갑 오크</strong>는 영웅의 강한 공격을 버팁니다.</p></div>
            </section>

            <section className="panel journal-panel">
              <div className="panel-top journal-heading">
                <div><span className="eyebrow">CAMPAIGN LOG</span><h2>📖 전쟁 기록</h2></div>
                <button className="text-button" onClick={() => setShowLogs(value => !value)}>
                  {showLogs ? "접기" : "펼치기"}
                </button>
              </div>
              <p className="last-log">{game.history[0]}</p>
              {showLogs && game.history.slice(1).map((entry, i) => <p className="journal-entry" key={i}>{entry}</p>)}
              {battle && <p className="journal-entry">현재 전투 중 · 방어 보상은 웨이브 종료 후 지급</p>}
            </section>

            <div className="footer-tools">
              <span>💾 자동 저장</span>
              <button onClick={restart} className="text-button">처음부터 다시</button>
            </div>
          </aside>
        </div>
        <footer className="footer">PROJECT 002 · DEMON LORD DEFENSE · DESIGNED FOR FUN</footer>
      </main>
    </div>
  );
}
