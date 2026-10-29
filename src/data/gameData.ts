import type { GameState, HeroDefinition, HeroId, MonsterDefinition, MonsterId } from "../types/game";

export const TOTAL_WAVES = 5;
export const MAX_CASTLE_HP = 20;

export const MONSTERS: Record<MonsterId, MonsterDefinition> = {
  slime: {
    id: "slime", name: "끈적 슬라임", emoji: "🟢", cost: 40,
    maxHp: 17, attack: 4, armor: 0,
    description: "튼튼한 선봉. 용사의 공격을 약화시킵니다.",
    ability: "점액 방패 · 받는 피해 -1"
  },
  goblin: {
    id: "goblin", name: "고블린 전사", emoji: "👺", cost: 55,
    maxHp: 14, attack: 6, armor: 0,
    description: "체력이 떨어진 용사에게 강한 마무리 일격.",
    ability: "비열한 일격 · 적 체력 절반 이하 피해 +3"
  },
  archer: {
    id: "archer", name: "해골 궁수", emoji: "💀", cost: 75,
    maxHp: 12, attack: 6, armor: 0,
    description: "첫 공격에 강력한 화살을 날립니다.",
    ability: "기습 사격 · 첫 타격 피해 +4"
  },
  imp: {
    id: "imp", name: "폭탄 임프", emoji: "💣", cost: 85,
    maxHp: 11, attack: 5, armor: 0,
    description: "쓰러질 때 마지막으로 폭발합니다.",
    ability: "자폭 · 전투 불능 시 추가 피해 10"
  },
  orc: {
    id: "orc", name: "철갑 오크", emoji: "🛡️", cost: 110,
    maxHp: 27, attack: 5, armor: 2,
    description: "오랫동안 길목을 버티는 철갑 경비병.",
    ability: "철갑 · 용사 공격 피해 -2"
  },
};

export const MONSTER_IDS: MonsterId[] = ["slime", "goblin", "archer", "imp", "orc"];

export const HEROES: Record<HeroId, HeroDefinition> = {
  rookie: { id: "rookie", name: "초보 용사", emoji: "🗡️", maxHp: 10, attack: 3, armor: 0, breach: 2 },
  rogue: { id: "rogue", name: "도적", emoji: "🥷", maxHp: 12, attack: 4, armor: 0, breach: 3 },
  knight: { id: "knight", name: "중갑 기사", emoji: "⚔️", maxHp: 20, attack: 5, armor: 2, breach: 4 },
  mage: { id: "mage", name: "마법사", emoji: "🧙", maxHp: 14, attack: 7, armor: 0, breach: 3 },
  champion: { id: "champion", name: "왕국의 영웅", emoji: "👑", maxHp: 30, attack: 8, armor: 1, breach: 6 },
};

export const WAVES: HeroId[][] = [
  ["rookie", "rookie"],
  ["rookie", "rogue", "rookie"],
  ["knight", "rogue", "mage"],
  ["knight", "mage", "rogue", "knight"],
  ["rogue", "knight", "champion", "mage"],
];

export const WAVE_TITLES = [
  "길 잃은 초보 용사들", "소문을 듣고 찾아온 도적단",
  "왕국의 정찰대", "왕실 토벌대", "왕국 최후의 공격"
];

export const INITIAL_GAME: GameState = {
  gold: 180,
  castleHp: MAX_CASTLE_HP,
  wave: 1,
  rooms: [{ id: "slime", level: 1 }, null, null],
  kills: 0,
  phase: "planning",
  history: ["👑 마왕군 예산 180G 지급. 용사들이 몰려오기 전에 준비하세요!"],
};
