export const colors = {
  abyss: {
    obsidianBlood: "#1A0005",
    darkClaret: "#2D0008",
  },
  core: {
    driedBlood: "#4A0010",
    deepCrimson: "#6B0017",
    bloodRed: "#8B0000",
  },
  light: {
    ashWhite: "#F0E8E8",
    pureSnow: "#FAF7F7",
  }
} as const;

export type ThemeColors = typeof colors;
