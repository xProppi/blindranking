export const getPlayerColor = (index) => {
  return `hsl(${index * 60}, 70%, 50%)`;
};

export const getRankColor = (index) => {
  if (index === 0) return 'linear-gradient(135deg, #fbbf24, #f59e0b)';
  if (index === 1) return 'linear-gradient(135deg, #6b7280, #4b5563)';
  if (index === 2) return 'linear-gradient(135deg, #ea580c, #dc2626)';
  const hue = 240 - index * 20;
  return `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${hue - 20}, 70%, 40%))`;
};