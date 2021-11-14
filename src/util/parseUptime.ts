const methods = [
  { name: 'Days', count: 86400 },
  { name: 'Hours', count: 3600 },
  { name: 'Minutes', count: 60 },
  { name: 'Seconds', count: 1 },
];
export default function(time: number): string {
  const timeStr = [
    Math.floor(time / methods[0].count)
      .toString() + methods[0].name,
  ];
  for (let i = 0; i < 3; i++) {
    timeStr.push(
      `${Math.floor((time % methods[i].count) / methods[i + 1].count)
        .toString()} ${methods[i + 1].name}`
    );
  }
  return timeStr.filter((f) => !f.startsWith('0'))
    .join(' ');
}