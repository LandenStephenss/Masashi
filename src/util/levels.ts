const levels: level[] = [];
const scale = 3;

for(let i = 0; i < 200; i++) {
  const a = ((i + 1) ** scale) + (100 * (i + 1));
  const b = (i ** scale) + (100 * i);
  levels.push({ xp: a - b, overallXP: a, level: i + 1 });
}

interface level {
  xp: number,
  level: number,
  overallXP: number
}

export default levels;
