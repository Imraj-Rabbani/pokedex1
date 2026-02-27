export const colors = {
  background: "#fff",
  text: {
    primary: "#1a1a2e",
    secondary: "#555",
    tertiary: "#888",
    inverse: "#fff",
    inverseSubtle: "rgba(255,255,255,0.7)",
  },
  error: "#e63946",
  border: "#ddd",
  statBar: {
    background: "#eee",
    high: "#4caf50",
    medium: "#ffc107",
    low: "#f44336",
  },
} as const;

export function getStatColor(value: number): string {
  if (value >= 100) return colors.statBar.high;
  if (value >= 50) return colors.statBar.medium;
  return colors.statBar.low;
}
