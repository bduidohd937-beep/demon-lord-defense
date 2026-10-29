import type { CSSProperties } from "react";
import type { BattleFrame, BattleReport, GameState, HeroId, MonsterId } from "../types/game";
import { HEROES, MONSTERS } from "../data/gameData";
import { monsterMaxHp } from "../game/battleLogic";
import CharacterSprite from "./CharacterSprite";

interface Props {
  game: GameState;
  battle: BattleReport | null;
  frame: BattleFrame | null;
  frameIndex: number;
  selectedRoom: number;
  fast: boolean;
  soundEnabled: boolean;
  onToggleSpeed: () => void;
  onToggleSound: () => void;
  onSkip: () => void;
}

const COLORS = ["#df8c68", "#c47cd8", "#65c7ad"];
const particles = [0, 1, 2, 3, 4, 5, 6, 7];

export default function BattleArena({
  game, battle, frame, frameIndex, selectedRoom, fast,
  soundEnabled, onToggleSpeed, onToggleSound, onSkip,
}: Props) {
  // A newly arrived hero enters through the first door. Other frames keep
  // showing the most recently visited room, not the selected editor room.
  let room = selectedRoom;
  if (battle && frame) {
    room = 0;
    for (let i = 0; i <= frameIndex; i++) {
      const step = battle.frames[i];
      if (step.kind === "spawn") room = 0;
      if (step.room !== null) room = step.room;
      if (step.kind === "breach") room = 2;
    }
  }
  const placed = game.rooms[room];
  const monster = placed ? MONSTERS[placed.id] : null;
  const monsterHp = placed
    ? frame ? frame.roomHp[room] : monsterMaxHp(placed)
    : 0;
  const monsterMax = placed ? monsterMaxHp(placed) : 1;
  const hero = frame?.hero ?? null;
  const heroDef = hero ? HEROES[hero.id] : null;
  const action = frame?.kind ?? "idle";
  const attack = action === "strike";
  const counter = action === "counter";
  const impact = attack || counter || action === "breach";
  const target = frame?.target;
  const damage = frame?.damage;
  const showCastle = action === "breach";
  const roomDead = !!placed && monsterHp <= 0;
  const heroDead = !!hero && hero.hp <= 0;
  const noHero = !battle || !hero;
  const stageStyle = {
    "--arena-accent": COLORS[room],
    "--beat": fast ? "165ms" : "610ms",
  } as CSSProperties;

  return (
    <section className="cinema" aria-label="움직이는 전투 무대">
      <div className="cinema-heading">
        <div className="cinema-title">
          <span className={battle ? "live-dot live" : "live-dot"} />
          <span>{battle ? "LIVE BATTLE" : "DUNGEON BATTLE STAGE"}</span>
          <strong>{battle ? "⚔️ 몬스터 VS 용사" : "🎭 배치 미리보기"}</strong>
        </div>
        <div className="cinema-room-track" aria-label="용사 이동 경로">
          {[0, 1, 2].map(index => (
            <span key={index} className={room === index ? "current" : ""}>
              {index + 1}번 방
            </span>
          ))}
        </div>
      </div>

      <div
        className={`cinema-scene scene-room-${room} ${impact ? "scene-impact" : ""} ${showCastle ? "scene-breach" : ""}`}
        style={stageStyle}
      >
        <div className="scene-cloud cloud-one" />
        <div className="scene-cloud cloud-two" />
        <div className="scene-moon" />
        <div className="scene-arch arch-one" />
        <div className="scene-arch arch-two" />
        <div className="scene-torch torch-left"><span /></div>
        <div className="scene-torch torch-right"><span /></div>
        <div className="scene-bricks" />
        <div className="scene-floor" />
        <div className="scene-glow" />

        <div className="cinema-fighters">
          <div
            key={`ally-${frameIndex}-${room}`}
            className={[
              "duelist", "duelist-ally",
              attack ? "duelist-swing" : "",
              counter ? "duelist-hit" : "",
              action === "fallen" || roomDead ? "duelist-down" : "",
              !battle ? "duelist-breathe" : "",
            ].filter(Boolean).join(" ")}
          >
            {showCastle ? (
              <div className="castle-art" role="img" aria-label="마왕성">
                <span className="castle-tower">♜</span>
              </div>
            ) : placed ? (
              <CharacterSprite side="monster" id={placed.id as MonsterId} />
            ) : (
              <div className="unoccupied-art"><span>☠</span><small>방어병 없음</small></div>
            )}
            <div className="fighter-ui">
              <strong>{showCastle ? "마왕성" : monster?.name ?? "빈 방"}</strong>
              {placed && !showCastle && (
                <div className="fighter-hp-line">
                  <span style={{ width: `${Math.max(0, monsterHp / monsterMax * 100)}%` }} />
                </div>
              )}
              {placed && !showCastle && <small>HP {monsterHp} / {monsterMax}</small>}
            </div>
            {target === "monster" && damage != null && damage > 0 && (
              <span key={`damage-monster-${frameIndex}`} className="arena-damage damage-ally">
                -{damage}
              </span>
            )}
            {target === "castle" && damage != null && damage > 0 && (
              <span key={`damage-castle-${frameIndex}`} className="arena-damage damage-ally">
                -{damage}
              </span>
            )}
          </div>

          <div className="cinema-center-mark" aria-hidden="true">
            <span>VS</span>
          </div>

          <div
            key={`hero-${frameIndex}-${hero?.id ?? "none"}`}
            className={[
              "duelist", "duelist-foe",
              counter ? "duelist-swing" : "",
              attack ? "duelist-hit" : "",
              action === "enter" || action === "spawn" ? "duelist-enter" : "",
              action === "pass" ? "duelist-pass" : "",
              action === "slain" || heroDead ? "duelist-down" : "",
              noHero ? "duelist-waiting" : "",
            ].filter(Boolean).join(" ")}
          >
            {heroDef && hero ? (
              <CharacterSprite side="hero" id={hero.id as HeroId} />
            ) : (
              <div className="foe-silhouette"><span>?</span></div>
            )}
            <div className="fighter-ui">
              <strong>{heroDef?.name ?? "다가오는 침입자"}</strong>
              {hero && (
                <>
                  <div className="fighter-hp-line enemy-line">
                    <span style={{ width: `${Math.max(0, hero.hp / hero.maxHp * 100)}%` }} />
                  </div>
                  <small>HP {hero.hp} / {hero.maxHp}</small>
                </>
              )}
            </div>
            {target === "hero" && damage != null && damage > 0 && (
              <span key={`damage-hero-${frameIndex}`} className="arena-damage damage-foe">
                -{damage}
              </span>
            )}
          </div>
        </div>

        {impact && (
          <div key={`effect-${frameIndex}`}
            className={`combat-impact impact-${frame?.effect ?? "slash"} ${target === "monster" ? "at-ally" : "at-foe"}`}
            aria-hidden="true"
          >
            <div className="impact-flash" />
            <span className="impact-glyph">
              {frame?.effect === "blast" ? "💥" :
               frame?.effect === "arrow" ? "➶" :
               frame?.effect === "magic" ? "✦" : "╳"}
            </span>
            {particles.map(i => <i key={i} className={`impact-particle particle-${i}`} />)}
          </div>
        )}

        {action === "slain" && <span className="cinema-banner win-banner" key={frameIndex}>ENEMY DOWN!</span>}
        {action === "fallen" && <span className="cinema-banner lose-banner" key={frameIndex}>ALLY DOWN!</span>}
        {action === "breach" && <span className="cinema-banner breach-banner" key={frameIndex}>CASTLE HIT!</span>}
        {action === "end" && <span className="cinema-banner win-banner" key={frameIndex}>WAVE CLEAR</span>}
        {!battle && <div className="scene-intro">⚔️ 침입 시작을 누르면 실제 전투 장면이 재생됩니다</div>}
        <div className="scene-corner-label">FLOOR {room + 1} / 3</div>
      </div>

      {battle && frame && (
        <div className="cinema-controls">
          <div className="cinema-action-feed">
            <span className="eyebrow">BATTLE ACTION</span>
            <p key={frameIndex} className="cinema-feed-text">{frame.message}</p>
            <div className="cinema-timeline">
              <span style={{ width: `${(frameIndex + 1) / battle.frames.length * 100}%` }} />
            </div>
          </div>
          <div className="cinema-buttons">
            <button type="button" className="secondary-button"
              aria-pressed={soundEnabled} onClick={onToggleSound}
              title="브라우저 합성 효과음">
              {soundEnabled ? "🔊 효과음 켬" : "🔇 효과음"}
            </button>
            <button type="button" className="secondary-button"
              aria-pressed={fast} onClick={onToggleSpeed}>
              {fast ? "⏱ 보통" : "⏩ 4배속"}
            </button>
            <button type="button" className="secondary-button" onClick={onSkip}>⏭ 스킵</button>
          </div>
        </div>
      )}
      {!battle && (
        <div className="cinema-bottom-note">
          <span>🛡️ 몬스터가 먼저 공격하고 용사가 반격해요</span>
          <span>✨ 각 방의 몬스터 체력은 웨이브 종료 후 회복</span>
        </div>
      )}
    </section>
  );
}
