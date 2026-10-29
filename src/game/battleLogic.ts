import type { BattleFrame, BattleReport, GameState, MonsterId, PlacedMonster } from "../types/game";
import { HEROES, MONSTERS, WAVES, MAX_CASTLE_HP, TOTAL_WAVES } from "../data/gameData";

export const monsterMaxHp = (placed: PlacedMonster): number =>
  MONSTERS[placed.id].maxHp + (placed.level - 1) * 6;

export const monsterAttack = (placed: PlacedMonster): number =>
  MONSTERS[placed.id].attack + (placed.level - 1) * 2;

export const monsterUpgradeCost = (placed: PlacedMonster): number =>
  30 + MONSTERS[placed.id].cost * placed.level;

export const healCost = (hp: number): number =>
  Math.max(0, Math.min(5, MAX_CASTLE_HP - hp)) * 12;

export function hireMonster(state: GameState, room: number, id: MonsterId): GameState {
  const monster = MONSTERS[id];
  if (state.phase !== "planning" || room < 0 || room > 2 || state.rooms[room] || state.gold < monster.cost) return state;
  const rooms = state.rooms.slice();
  rooms[room] = { id, level: 1 };
  return { ...state, gold: state.gold - monster.cost, rooms };
}

export function dismissMonster(state: GameState, room: number): GameState {
  if (state.phase !== "planning" || room < 0 || room > 2 || !state.rooms[room]) return state;
  const refund = Math.floor(MONSTERS[state.rooms[room].id].cost * 0.5);
  const rooms = state.rooms.slice();
  rooms[room] = null;
  return { ...state, gold: state.gold + refund, rooms };
}

export function swapRooms(state: GameState, left: number, right: number): GameState {
  if (state.phase !== "planning" || left < 0 || right > 2 || left === right) return state;
  const rooms = state.rooms.slice();
  [rooms[left], rooms[right]] = [rooms[right], rooms[left]];
  return { ...state, rooms };
}

export function upgradeMonster(state: GameState, room: number): GameState {
  const placed = state.rooms[room];
  if (state.phase !== "planning" || !placed || placed.level >= 3) return state;
  const cost = monsterUpgradeCost(placed);
  if (state.gold < cost) return state;
  const rooms = state.rooms.slice();
  rooms[room] = { ...placed, level: placed.level + 1 };
  return { ...state, gold: state.gold - cost, rooms };
}

export function repairCastle(state: GameState): GameState {
  const cost = healCost(state.castleHp);
  if (state.phase !== "planning" || cost <= 0 || state.gold < cost) return state;
  return { ...state, gold: state.gold - cost, castleHp: Math.min(MAX_CASTLE_HP, state.castleHp + 5) };
}

/** This simulates all attacks at once. Frames are played back by React; persistent
 * campaign state is only updated after playback is finished. */
export function simulateWave(state: GameState): BattleReport {
  const wave = Math.max(1, Math.min(TOTAL_WAVES, state.wave));
  const opponents = WAVES[wave - 1];
  const roomHp = state.rooms.map(placed => placed ? monsterMaxHp(placed) : 0);
  const frames: BattleFrame[] = [];
  let castleHp = state.castleHp;
  let kills = 0;
  let breaches = 0;

  const emit = (
    kind: BattleFrame["kind"], room: number | null, message: string,
    hero: BattleFrame["hero"],
    impact?: Pick<BattleFrame, "damage" | "target" | "effect">,
  ) => frames.push({
    kind, room, message, hero: hero ? { ...hero } : null,
    roomHp: [...roomHp], castleHp, kills, ...impact,
  });

  emit("spawn", null, "📯 용사들이 던전으로 진입합니다!", null);

  outer: for (const heroId of opponents) {
    const enemy = HEROES[heroId];
    let heroHp = enemy.maxHp;
    const view = () => ({ id: heroId, hp: Math.max(0, heroHp), maxHp: enemy.maxHp });
    emit("spawn", null, enemy.emoji + " " + enemy.name + " 등장!", view());

    for (let room = 0; room < 3; room++) {
      const placed = state.rooms[room];
      emit("enter", room, enemy.name + "이(가) " + (room + 1) + "번 방에 도착!", view());

      if (!placed || roomHp[room] <= 0) {
        emit("pass", room, "🚪 빈 방! " + enemy.name + "이(가) 통과합니다.", view());
        continue;
      }
      const monster = MONSTERS[placed.id];
      let turns = 0;
      while (heroHp > 0 && roomHp[room] > 0 && turns < 24) {
        const firstShot = monster.id === "archer" && turns === 0 ? 4 : 0;
        const execute = monster.id === "goblin" && heroHp <= enemy.maxHp / 2 ? 3 : 0;
        const damage = Math.max(1, monsterAttack(placed) + firstShot + execute - enemy.armor);
        heroHp = Math.max(0, heroHp - damage);
        emit("strike", room, monster.emoji + " " + monster.name + "의 공격! " + enemy.name + "에게 " + damage + " 피해", view(), {
          damage, target: "hero", effect: monster.id === "archer" ? "arrow" : monster.id === "imp" ? "magic" : "slash",
        });

        if (heroHp === 0) {
          kills++;
          emit("slain", room, "💥 " + enemy.name + " 격퇴! 마왕군 만세!", view());
          break;
        }

        const guard = monster.id === "slime" ? 1 : 0;
        const received = Math.max(1, enemy.attack - monster.armor - guard);
        roomHp[room] = Math.max(0, roomHp[room] - received);
        emit("counter", room, "⚔️ " + enemy.name + "의 반격! " + monster.name + "에게 " + received + " 피해", view(), {
          damage: received, target: "monster", effect: enemy.id === "mage" ? "magic" : "slash",
        });

        if (roomHp[room] === 0) {
          emit("fallen", room, "💀 " + monster.name + " 전투 불능!", view());
          if (monster.id === "imp") {
            heroHp = Math.max(0, heroHp - 10);
            emit("strike", room, "💣 임프의 마지막 폭발! 추가 10 피해", view(), {
              damage: 10, target: "hero", effect: "blast",
            });
            if (heroHp === 0) {
              kills++;
              emit("slain", room, "💥 " + enemy.name + " 폭발에 휘말려 격퇴!", view());
            }
          }
        }
        turns++;
      }
      if (heroHp <= 0) break;
    }
    if (heroHp > 0) {
      castleHp = Math.max(0, castleHp - enemy.breach);
      breaches++;
      emit("breach", null, "🚨 " + enemy.name + "이(가) 마왕성에 " + enemy.breach + " 피해!", view(), {
        damage: enemy.breach, target: "castle", effect: "blast",
      });
      if (castleHp === 0) break outer;
    }
  }

  const reward = kills * 15 + (castleHp > 0 ? 35 + wave * 15 : 0);
  emit("end", null, castleHp > 0
    ? "🏆 웨이브 방어 종료! " + kills + "명 격퇴 · 보상 " + reward + "G"
    : "☠️ 마왕성이 함락되었습니다!", null);
  return { wave, frames, endingHp: castleHp, kills, reward, breaches };
}

export function applyBattle(state: GameState, report: BattleReport): GameState {
  if (state.phase !== "planning" || state.wave !== report.wave) return state;
  const survived = report.endingHp > 0;
  const finalWave = state.wave === TOTAL_WAVES;
  const phase = !survived ? "defeat" : finalWave ? "victory" : "planning";
  const message = !survived
    ? "☠️ " + state.wave + "웨이브에서 마왕성이 함락되었습니다."
    : finalWave
      ? "👑 모든 용사를 격퇴하고 던전을 지켜냈습니다!"
      : "🎉 " + state.wave + "웨이브 종료 · " + report.reward + "G 획득!";
  return {
    ...state,
    gold: state.gold + report.reward,
    castleHp: report.endingHp,
    kills: state.kills + report.kills,
    wave: survived ? Math.min(TOTAL_WAVES, state.wave + 1) : state.wave,
    phase,
    history: [message, ...state.history].slice(0, 30),
  };
}
