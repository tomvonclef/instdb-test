import type { InstantRules } from "@instantdb/react";

const rules = {
  profiles: {
    allow: {
      view: "true",
      create: "isOwner",
      update: "isOwner",
      delete: "false",
    },
    bind: ["isOwner", "auth.id != null && auth.id == data.id"]
  },
  questions: {
    allow: {
      view: "true",
      create: "false", // Only admins can create questions via seeding
      update: "false",
      delete: "false",
    }
  },
  gameSessions: {
    allow: {
      view: "isOwner",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: ["isOwner", "auth.id in data.ref('player.id')"]
  },
  answers: {
    allow: {
      view: "isSessionOwner",
      create: "isSessionOwner",
      update: "false", // Can't modify answers once submitted
      delete: "false",
    },
    bind: ["isSessionOwner", "auth.id in data.ref('gameSession.player.id')"]
  },
  highScores: {
    allow: {
      view: "true", // Everyone can see leaderboard
      create: "isOwner",
      update: "false", // Scores are immutable
      delete: "false",
    },
    bind: ["isOwner", "auth.id in data.ref('player.id')"]
  }
} satisfies InstantRules;

export default rules;