export const ATTRS = [
["punches", "Punches"],
["schemes", "Schemes"],
["rebuttals", "Rebuttals"],
["delivery", "Delivery"],
["performance", "Performance"],
["humor", "Humor"],
["crowd_control", "Crowd Control"],
["freestyle", "Freestyle"],
["originality", "Originality"],
["intangibles", "Intangibles"],
];


export function clampScore(n) {
const v = Number(n);
if (Number.isNaN(v)) return 50;
return Math.max(0, Math.min(100, v));
}