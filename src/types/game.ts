export type MonsterId = "slime" | "goblin" | "archer" | "imp" | "orc";
export type HeroId = "rookie" | "rogue" | "knight" | "mage" | "champion";
export type GamePhase = "planning" | "victory" | "defeat";
export type AttackKind = "spawn" | "enter" | "strike" | "counter" | "fallen" | "slain" | "pass" | "breach" | "end";

export interface MonsterDefinition {
  id: MonsterId;
  name: string;
  emoji: string;
  cost: number;
  maxHp: number;
  attack: number;
  armor: number;
  description: string;
  ability: string;
}

export interface HeroDefinition {
  id: HeroId;
  name: string;
  emoji: string;
  maxHp: number;
  attack: number;
  armor: number;
  breach: number;
}

export interface PlacedMonster {
  id: MonsterId;
  level: number;
}

export interface GameState {
  gold: number;
  castleHp: number;
  wave: number;
  rooms: (PlacedMonster | null)[];
  kills: number;
  phase: GamePhase;
  history: string[];
}

export interface ActiveHero {
  id: HeroId;
  hp: number;
  maxHp: number;
}

export interface BattleFrame {
  kind: AttackKind;
  room: number | null;
  message: string;
  hero: ActiveHero | null;
  roomHp: number[];
  castleHp: number;
  kills: number;
}

export interface BattleReport {
  wave: number;
  frames: BattleFrame[];
  endingHp: number;
  kills: number;
  reward: number;
  breaches: number;
}
