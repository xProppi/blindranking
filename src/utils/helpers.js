export const getPlayerColor = (index) => {
  const colors = ['#ff00aa', '#ff8800', '#00cc66', '#3388ff', '#aa00ff', '#00cccc'];
  return colors[index % colors.length];
};

export const getRankColor = (index) => {
  const colors = [
    '#ff00ff', // 1 - magenta/pink
    '#ff8800', // 2 - orange
    '#ff0000', // 3 - rot
    '#22cc22', // 4 - gruen
    '#0066ff', // 5 - blau
    '#0000cc', // 6 - dunkelblau
    '#cc00ff', // 7 - lila
    '#00cccc', // 8 - cyan
    '#ff0044', // 9 - rot/pink
    '#ffff00', // 10 - gelb
  ];
  return colors[index % colors.length];
};