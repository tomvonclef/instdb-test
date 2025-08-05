import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    profiles: i.entity({
      handle: i.string(),
    }),
    questions: i.entity({
      question: i.string(),
      category: i.string().indexed(),
      options: i.string(), // JSON array of 4 options
      correctAnswer: i.number(), // Index of correct answer (0-3)
      difficulty: i.string().indexed().optional(), // easy, medium, hard
    }),
    gameSessions: i.entity({
      category: i.string().indexed(),
      totalQuestions: i.number(),
      currentScore: i.number(),
      questionsAnswered: i.number(),
      isCompleted: i.boolean().indexed(),
      completedAt: i.number().optional(),
      createdAt: i.number().indexed(),
    }),
    answers: i.entity({
      questionIndex: i.number(), // Question number in the session (0-based)
      selectedAnswer: i.number(), // Player's selected answer index
      isCorrect: i.boolean(),
      answeredAt: i.number(),
    }),
    highScores: i.entity({
      category: i.string().indexed(),
      score: i.number().indexed(),
      totalQuestions: i.number(),
      accuracy: i.number(), // Percentage
      achievedAt: i.number().indexed(),
    }),
  },
  links: {
    userProfiles: {
      forward: { on: "profiles", has: "one", label: "user" },
      reverse: { on: "$users", has: "one", label: "profile" },
    },
    sessionPlayer: {
      forward: { on: "gameSessions", has: "one", label: "player" },
      reverse: { on: "profiles", has: "many", label: "gameSessions" },
    },
    sessionAnswers: {
      forward: { on: "answers", has: "one", label: "gameSession" },
      reverse: { on: "gameSessions", has: "many", label: "answers" },
    },
    answerQuestion: {
      forward: { on: "answers", has: "one", label: "question" },
      reverse: { on: "questions", has: "many", label: "answers" },
    },
    scorePlayer: {
      forward: { on: "highScores", has: "one", label: "player" },
      reverse: { on: "profiles", has: "many", label: "highScores" },
    },
  },
});

type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema { }
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;