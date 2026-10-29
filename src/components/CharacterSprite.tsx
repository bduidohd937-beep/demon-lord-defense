import type { ReactNode } from "react";
import type { HeroId, MonsterId } from "../types/game";

type SpriteProps =
  | { side: "monster"; id: MonsterId; className?: string }
  | { side: "hero"; id: HeroId; className?: string };

/** Original, lightweight vector characters drawn with SVG.
 * No external sprite assets are required; character details scale on mobile.
 */
const monsterArt: Record<MonsterId, ReactNode> = {
  slime: (
    <>
      <path d="M25 108Q16 86 30 56Q43 26 64 32Q91 29 103 67Q111 89 96 110Q74 127 42 118Z" fill="#3bb882" stroke="#155b56" strokeWidth="5" />
      <path d="M28 87Q29 57 46 45Q60 36 68 40" fill="none" stroke="#a5f9c2" strokeWidth="9" strokeLinecap="round" opacity=".78" />
      <ellipse cx="49" cy="79" rx="8" ry="12" fill="#122632" />
      <ellipse cx="78" cy="79" rx="8" ry="12" fill="#122632" />
      <circle cx="52" cy="74" r="3" fill="white" />
      <circle cx="81" cy="74" r="3" fill="white" />
      <path d="M57 100Q65 107 73 100" stroke="#14554a" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M28 111Q39 120 48 117M88 119Q99 116 104 108" stroke="#8ce7a4" strokeWidth="4" fill="none" />
    </>
  ),
  goblin: (
    <>
      <path d="M33 105L35 77Q60 64 85 78L91 105L76 122H44Z" fill="#925a3c" stroke="#4a332f" strokeWidth="5" />
      <path d="M40 81L21 75L14 56L38 65L45 59Q61 46 83 59L96 64L110 53L104 77L88 85L87 102H39Z" fill="#83b866" stroke="#315d43" strokeWidth="5" />
      <path d="M21 68L34 72M97 72L107 65" stroke="#e9aa88" strokeWidth="5" strokeLinecap="round" />
      <path d="M41 78L54 83M70 83L84 78" stroke="#304f41" strokeWidth="6" strokeLinecap="round" />
      <circle cx="49" cy="88" r="4" fill="#f5d576" />
      <circle cx="77" cy="88" r="4" fill="#f5d576" />
      <path d="M58 99L65 96L71 99" stroke="#315d43" strokeWidth="3" fill="none" />
      <path d="M53 107L57 115L63 107L69 115L74 107" fill="#f6d9aa" stroke="#453e33" strokeWidth="2" />
      <path d="M33 101L22 111M91 101L101 111" stroke="#315d43" strokeWidth="10" strokeLinecap="round" />
      <path d="M99 102L112 78L116 86L108 108" fill="#c9b0a0" stroke="#634c49" strokeWidth="3" />
      <path d="M49 119L48 132M74 119L78 132" stroke="#43343a" strokeWidth="10" strokeLinecap="round" />
    </>
  ),
  archer: (
    <>
      <path d="M36 99L49 88H76L88 101L82 123H40Z" fill="#65526c" stroke="#352c43" strokeWidth="5" />
      <path d="M40 71Q33 36 55 30Q84 23 92 58L84 87L73 96H50L40 85Z" fill="#e7e3d1" stroke="#847f86" strokeWidth="5" />
      <path d="M46 58L62 60L58 77L45 75Z" fill="#28232d" />
      <path d="M68 59L83 55L82 74L69 77Z" fill="#28232d" />
      <path d="M64 75L57 84L72 85Z" fill="#8c8591" />
      <path d="M51 90H79M50 96H78" stroke="#8e808a" strokeWidth="3" />
      <path d="M52 107L53 120M70 106L72 122" stroke="#ddd5c7" strokeWidth="5" strokeLinecap="round" />
      <path d="M37 100L21 107M89 101L97 110" stroke="#e6dfcf" strokeWidth="8" strokeLinecap="round" />
      <path d="M22 70Q8 101 24 132" fill="none" stroke="#bd8a53" strokeWidth="5" strokeLinecap="round" />
      <path d="M22 70L24 132" stroke="#d9d8c0" strokeWidth="2" />
      <path d="M9 101H62M49 94L62 101L49 108" fill="none" stroke="#e1c99a" strokeWidth="3" />
    </>
  ),
  imp: (
    <>
      <path d="M36 82Q13 40 4 82L30 107M86 82Q106 40 119 82L93 107" fill="#9253c0" stroke="#4d286a" strokeWidth="5" />
      <path d="M37 64L29 28L50 51M79 52L95 25L88 69" fill="#773c9f" stroke="#49265c" strokeWidth="5" />
      <path d="M29 75Q45 51 65 50Q94 51 100 82L91 113L54 121L29 101Z" fill="#ae62cb" stroke="#62377e" strokeWidth="5" />
      <ellipse cx="49" cy="82" rx="10" ry="9" fill="#fee4a5" />
      <ellipse cx="79" cy="82" rx="10" ry="9" fill="#fee4a5" />
      <path d="M54 83L49 79M73 82L78 78" stroke="#642658" strokeWidth="5" strokeLinecap="round" />
      <path d="M54 98Q65 109 79 98" fill="none" stroke="#503154" strokeWidth="4" strokeLinecap="round" />
      <path d="M60 104L65 113L69 103" fill="#f3daae" />
      <path d="M40 118L35 133M84 119L91 132" stroke="#572e71" strokeWidth="7" strokeLinecap="round" />
      <path d="M92 115Q120 111 109 87" stroke="#9a4db4" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M107 82L117 89L107 94Z" fill="#9a4db4" />
    </>
  ),
  orc: (
    <>
      <path d="M28 112L34 68Q56 55 86 68L99 112L85 133H36Z" fill="#82767b" stroke="#484354" strokeWidth="6" />
      <path d="M38 59L26 44L32 24L47 44M79 43L95 24L102 43L91 62" fill="#8a9e64" stroke="#37553e" strokeWidth="5" />
      <path d="M26 68Q32 35 63 32Q93 34 99 67L91 93L82 105H43L30 89Z" fill="#82995b" stroke="#304c3d" strokeWidth="5" />
      <path d="M38 65L54 67M70 67L86 64" stroke="#2f4533" strokeWidth="7" strokeLinecap="round" />
      <circle cx="49" cy="78" r="5" fill="#ecb976" />
      <circle cx="76" cy="78" r="5" fill="#ecb976" />
      <path d="M47 92Q64 104 81 92" stroke="#31503b" strokeWidth="4" fill="none" />
      <path d="M39 90L37 73L48 88M83 87L96 74L90 100" fill="#eadcc0" stroke="#726b5c" strokeWidth="2" />
      <path d="M35 108L16 105M90 108L107 104" stroke="#72855a" strokeWidth="14" strokeLinecap="round" />
      <path d="M13 94Q-2 99 8 125L25 131L37 110L29 94Z" fill="#8398a8" stroke="#353f54" strokeWidth="5" />
      <path d="M12 106L27 112" stroke="#d0d6db" strokeWidth="3" />
      <path d="M45 128L44 138M80 128L82 138" stroke="#40363d" strokeWidth="11" strokeLinecap="round" />
    </>
  ),
};

const heroArt: Record<HeroId, ReactNode> = {
  rookie: (
    <>
      <path d="M43 68L26 122L92 122L79 69Z" fill="#547faf" stroke="#293d6b" strokeWidth="5" />
      <path d="M40 42Q42 20 66 22Q92 23 92 52L84 73L49 73Z" fill="#ebc69c" stroke="#76534f" strokeWidth="5" />
      <path d="M40 48Q31 16 58 14Q90 11 96 44L81 35L55 37L42 54Z" fill="#a7784a" />
      <circle cx="57" cy="50" r="4" fill="#343046" />
      <circle cx="77" cy="50" r="4" fill="#343046" />
      <path d="M61 64L75 64" stroke="#9d6852" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 81L77 81M62 79L63 115" stroke="#f5d7a4" strokeWidth="5" />
      <path d="M36 82L23 106M85 82L99 103" stroke="#e1b99c" strokeWidth="10" strokeLinecap="round" />
      <path d="M98 106L108 68" stroke="#d0e6f5" strokeWidth="6" strokeLinecap="round" />
      <path d="M96 72L119 76M99 81L118 85" stroke="#92766a" strokeWidth="5" strokeLinecap="round" />
      <path d="M48 120L43 137M80 120L85 137" stroke="#6d4d49" strokeWidth="11" strokeLinecap="round" />
    </>
  ),
  rogue: (
    <>
      <path d="M30 125L40 54L83 54L98 125Z" fill="#383b55" stroke="#202536" strokeWidth="6" />
      <path d="M29 59Q32 12 64 12Q98 15 99 61L83 74H44Z" fill="#454255" stroke="#242234" strokeWidth="5" />
      <path d="M40 49Q62 36 89 49L84 70Q65 82 46 70Z" fill="#d6bca8" />
      <path d="M44 55L85 55L82 66L46 66Z" fill="#27263e" />
      <path d="M52 61L59 60M71 60L78 61" stroke="#e8c477" strokeWidth="3" strokeLinecap="round" />
      <path d="M38 82L22 107M89 83L105 111" stroke="#424055" strokeWidth="12" strokeLinecap="round" />
      <path d="M21 103L11 74L17 64L29 102Z" fill="#c5d2e0" stroke="#62657d" strokeWidth="3" />
      <path d="M103 106L116 78L111 65L96 101Z" fill="#c5d2e0" stroke="#62657d" strokeWidth="3" />
      <path d="M48 125L44 139M79 125L84 139" stroke="#222738" strokeWidth="12" strokeLinecap="round" />
    </>
  ),
  knight: (
    <>
      <path d="M31 64L27 125L91 128L94 60Z" fill="#abb8c6" stroke="#45556f" strokeWidth="5" />
      <path d="M35 47Q33 18 63 15Q93 18 92 49L86 79H41Z" fill="#ced7e0" stroke="#65768b" strokeWidth="5" />
      <path d="M63 15Q70 2 87 7L98 22L74 25" fill="#cc4a5b" stroke="#833347" strokeWidth="3" />
      <path d="M41 52H89L84 64H45Z" fill="#2d3749" />
      <path d="M51 57H57M74 57H80" stroke="#e9ca85" strokeWidth="3" />
      <path d="M49 76H77L83 102L67 115L47 102Z" fill="#7488a0" stroke="#35465d" strokeWidth="4" />
      <path d="M60 84L67 96L73 84" fill="none" stroke="#e8d2a7" strokeWidth="4" />
      <path d="M29 83L15 106M91 80L105 101" stroke="#aab8c8" strokeWidth="13" strokeLinecap="round" />
      <path d="M102 99L113 45" stroke="#e4edf1" strokeWidth="7" strokeLinecap="round" />
      <path d="M97 53L118 56" stroke="#b5a58e" strokeWidth="5" strokeLinecap="round" />
      <path d="M46 125L44 139M80 125L84 139" stroke="#526278" strokeWidth="12" strokeLinecap="round" />
    </>
  ),
  mage: (
    <>
      <path d="M28 125L37 69L85 69L101 125Z" fill="#684c9b" stroke="#30224e" strokeWidth="6" />
      <path d="M42 68Q31 37 56 32Q85 28 90 60L81 89H48Z" fill="#edc4a8" stroke="#725866" strokeWidth="5" />
      <path d="M29 46L61 5L105 46L96 58L30 56Z" fill="#7b57b0" stroke="#4b3376" strokeWidth="5" />
      <path d="M28 52L109 52" stroke="#c09ddc" strokeWidth="7" strokeLinecap="round" />
      <circle cx="58" cy="69" r="4" fill="#34264d" />
      <circle cx="79" cy="69" r="4" fill="#34264d" />
      <path d="M60 82Q70 89 79 82" stroke="#a77875" strokeWidth="3" fill="none" />
      <path d="M57 99L65 106L75 99" stroke="#d8b3f0" strokeWidth="5" fill="none" />
      <path d="M37 86L20 106M87 85L106 105" stroke="#bd93c5" strokeWidth="10" strokeLinecap="round" />
      <path d="M108 119L111 34" stroke="#b68c58" strokeWidth="6" strokeLinecap="round" />
      <circle cx="111" cy="24" r="11" fill="#6ae5eb" stroke="#d9f7ed" strokeWidth="4" />
      <path d="M50 122L45 139M83 122L87 139" stroke="#29213f" strokeWidth="10" strokeLinecap="round" />
    </>
  ),
  champion: (
    <>
      <path d="M34 73L16 131L107 132L91 67Z" fill="#c14d50" stroke="#652e43" strokeWidth="5" />
      <path d="M40 71L32 123H91L88 69Z" fill="#ddbc64" stroke="#8d623e" strokeWidth="5" />
      <path d="M38 40L46 17L59 30L69 11L81 30L95 16L99 45Z" fill="#f5c85f" stroke="#a57d3d" strokeWidth="4" />
      <path d="M41 47Q43 23 70 23Q91 27 91 52L84 77H50Z" fill="#f0caa9" stroke="#84604e" strokeWidth="4" />
      <path d="M44 42L62 34L93 43" stroke="#d8a35e" strokeWidth="9" strokeLinecap="round" />
      <circle cx="58" cy="54" r="4" fill="#2b3550" />
      <circle cx="79" cy="54" r="4" fill="#2b3550" />
      <path d="M56 66Q69 73 80 66" stroke="#926d5f" strokeWidth="3" fill="none" />
      <path d="M54 87L68 98L82 87" fill="none" stroke="#fff0c3" strokeWidth="6" />
      <path d="M36 82L16 99M95 83L108 99" stroke="#d4b668" strokeWidth="12" strokeLinecap="round" />
      <path d="M111 97L114 38" stroke="#d6e8f8" strokeWidth="7" strokeLinecap="round" />
      <path d="M100 45L119 49" stroke="#edc772" strokeWidth="6" strokeLinecap="round" />
      <path d="M47 123L44 139M81 123L85 139" stroke="#754a3e" strokeWidth="11" strokeLinecap="round" />
    </>
  ),
};

export default function CharacterSprite({ id, side, className = "" }: SpriteProps) {
  return (
    <svg
      className={`character-art ${className}`}
      viewBox="0 0 128 148"
      role="img"
      aria-label={side === "monster" ? "마왕군 캐릭터" : "용사 캐릭터"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="64" cy="140" rx="37" ry="6" fill="#100e1c" opacity=".38" />
      {side === "monster" ? monsterArt[id] : heroArt[id]}
    </svg>
  );
}
