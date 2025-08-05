"use client";

import React, { useState, useEffect } from "react";
import { id, InstaQLEntity } from "@instantdb/react";
import db from "../lib/db";
import schema from "../instant.schema";

// Type helpers
type Question = InstaQLEntity<typeof schema, "questions">;

const CATEGORIES = ["Science", "History", "Sports", "Entertainment"];
const QUESTIONS_PER_GAME = 10;

function randomHandle() {
  const adjectives = ["Smart", "Quick", "Clever", "Wise", "Sharp", "Bright"];
  const nouns = ["Player", "Thinker", "Scholar", "Genius", "Brain", "Master"];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomSuffix = Math.floor(Math.random() * 9000) + 1000;
  return `${randomAdjective}${randomNoun}${randomSuffix}`;
}

async function createProfile(userId: string) {
  await db.transact(
    db.tx.profiles[userId].update({
      handle: randomHandle(),
    }).link({ user: userId })
  );
}

function useProfile() {
  const { user } = db.useAuth();
  if (!user) {
    throw new Error("useProfile must be used after auth");
  }
  const { data, isLoading, error } = db.useQuery({
    profiles: {
      $: { where: { "user.id": user.id } },
      highScores: {},
    }
  });
  const profile = data?.profiles?.[0];
  return { profile, isLoading, error };
}

function useQuestions(category: string) {
  const { data, isLoading, error } = db.useQuery({
    questions: {
      $: { where: { category } }
    }
  });
  return { questions: data?.questions || [], isLoading, error };
}

function useGameSession(sessionId: string | null) {
  const { data, isLoading, error } = db.useQuery(
    sessionId ? {
      gameSessions: {
        $: { where: { id: sessionId } },
        player: {},
        answers: {
          question: {}
        }
      }
    } : null
  );
  return { gameSession: data?.gameSessions?.[0], isLoading, error };
}

function useLeaderboard() {
  const { data, isLoading, error } = db.useQuery({
    highScores: {
      $: { 
        order: { score: "desc" },
        limit: 10
      },
      player: {}
    }
  });
  return { scores: data?.highScores || [], isLoading, error };
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading, error } = db.useAuth();

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Auth error: {error.message}</div>;
  if (!user) return <Login />;

  return <>{children}</>;
}

function Login() {
  const [sentEmail, setSentEmail] = useState("");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md w-full mx-4">
        {!sentEmail ? (
          <EmailStep onSendEmail={setSentEmail} />
        ) : (
          <CodeStep sentEmail={sentEmail} />
        )}
      </div>
    </div>
  );
}

function EmailStep({ onSendEmail }: { onSendEmail: (email: string) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputEl = inputRef.current!;
    const email = inputEl.value;
    onSendEmail(email);
    db.auth.sendMagicCode({ email }).catch((err) => {
      alert("Error: " + err.body?.message);
      onSendEmail("");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🧠 Trivia Master</h1>
        <p className="text-gray-600">Test your knowledge across multiple categories!</p>
      </div>
      <div className="space-y-4">
        <input 
          ref={inputRef} 
          type="email" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          placeholder="Enter your email" 
          required 
          autoFocus 
        />
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
        >
          Start Playing
        </button>
      </div>
    </form>
  );
}

function CodeStep({ sentEmail }: { sentEmail: string }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputEl = inputRef.current!;
    const code = inputEl.value;
    db.auth.signInWithMagicCode({ email: sentEmail, code }).catch((err) => {
      inputEl.value = "";
      alert("Error: " + err.body?.message);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
        <p className="text-gray-600">
          We sent a code to <strong>{sentEmail}</strong>
        </p>
      </div>
      <div className="space-y-4">
        <input 
          ref={inputRef} 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg" 
          placeholder="123456" 
          required 
          autoFocus 
        />
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
        >
          Verify Code
        </button>
      </div>
    </form>
  );
}

function EnsureProfile({ children }: { children: React.ReactNode }) {
  const { user } = db.useAuth();
  const { isLoading, profile, error } = useProfile();

  useEffect(() => {
    if (!isLoading && !profile) {
      createProfile(user!.id);
    }
  }, [user, isLoading, profile]);

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
  if (error) return <div className="p-4 text-red-500">Profile error: {error.message}</div>;
  if (!profile) return <div className="flex items-center justify-center min-h-screen">Creating profile...</div>;

  return <>{children}</>;
}

function CategorySelection({ onSelectCategory }: { onSelectCategory: (category: string) => void }) {
  const { profile } = useProfile();
  const { scores } = useLeaderboard();

  const getCategoryStats = (category: string) => {
    const categoryScores = profile?.highScores?.filter(s => s.category === category) || [];
    const bestScore = Math.max(...categoryScores.map(s => s.score), 0);
    const gamesPlayed = categoryScores.length;
    return { bestScore, gamesPlayed };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🧠 Trivia Master</h1>
          <p className="text-xl text-gray-600">Welcome, {profile?.handle}!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Choose Your Category</h2>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((category) => {
                const stats = getCategoryStats(category);
                return (
                  <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="text-lg font-medium mb-2">{category}</div>
                    <div className="text-sm text-gray-600">
                      <div>Best: {stats.bestScore}/{QUESTIONS_PER_GAME}</div>
                      <div>Games: {stats.gamesPlayed}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">🏆 Top Players</h2>
            <div className="space-y-3">
              {scores.slice(0, 5).map((score, idx) => (
                <div key={score.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-500">#{idx + 1}</span>
                    <span className="font-medium">{score.player?.handle}</span>
                    <span className="text-sm text-gray-500">({score.category})</span>
                  </div>
                  <span className="font-bold text-blue-600">{score.score}/{score.totalQuestions}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => db.auth.signOut()}
            className="text-gray-500 hover:text-gray-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function GamePlay({ category, onGameEnd }: { category: string; onGameEnd: () => void }) {
  const { profile } = useProfile();
  const { questions, isLoading } = useQuestions(category);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  useGameSession(currentSessionId);

  useEffect(() => {
    if (questions.length > 0 && !currentSessionId) {
      // Start new game session
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, Math.min(QUESTIONS_PER_GAME, shuffled.length));
      setGameQuestions(selectedQuestions);
      
      const sessionId = id();
      setCurrentSessionId(sessionId);
      
      db.transact(
        db.tx.gameSessions[sessionId].update({
          category,
          totalQuestions: selectedQuestions.length,
          currentScore: 0,
          questionsAnswered: 0,
          isCompleted: false,
          createdAt: Date.now(),
        }).link({ player: profile!.id })
      );
    }
  }, [questions, currentSessionId, category, profile]);

  const handleAnswerSelect = async (answerIndex: number) => {
    if (selectedAnswer !== null || !currentSessionId) return;
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    const currentQuestion = gameQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const newScore = score + (isCorrect ? 1 : 0);
    
    setScore(newScore);
    
    // Record the answer
    await db.transact(
      db.tx.answers[id()].update({
        questionIndex: currentQuestionIndex,
        selectedAnswer: answerIndex,
        isCorrect,
        answeredAt: Date.now(),
      }).link({ 
        gameSession: currentSessionId,
        question: currentQuestion.id 
      })
    );
    
    // Update game session
    const questionsAnswered = currentQuestionIndex + 1;
    const isGameComplete = questionsAnswered >= gameQuestions.length;
    
    await db.transact(
      db.tx.gameSessions[currentSessionId].update({
        currentScore: newScore,
        questionsAnswered,
        isCompleted: isGameComplete,
        ...(isGameComplete && { completedAt: Date.now() })
      })
    );
    
    if (isGameComplete) {
      // Save high score
      const accuracy = Math.round((newScore / gameQuestions.length) * 100);
      await db.transact(
        db.tx.highScores[id()].update({
          category,
          score: newScore,
          totalQuestions: gameQuestions.length,
          accuracy,
          achievedAt: Date.now(),
        }).link({ player: profile!.id })
      );
      
      setTimeout(() => onGameEnd(), 2000);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      }, 2000);
    }
  };

  if (isLoading || gameQuestions.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">Loading questions...</div>;
  }

  const currentQuestion = gameQuestions[currentQuestionIndex];
  const options = JSON.parse(currentQuestion.options);
  const progress = ((currentQuestionIndex + 1) / gameQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{category}</h2>
              <div className="text-right">
                <div className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {gameQuestions.length}</div>
                <div className="text-lg font-bold text-blue-600">Score: {score}</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-medium mb-6">{currentQuestion.question}</h3>
            <div className="space-y-3">
              {options.map((option: string, idx: number) => {
                let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all ";
                
                if (showFeedback) {
                  if (idx === currentQuestion.correctAnswer) {
                    buttonClass += "border-green-500 bg-green-100 text-green-800";
                  } else if (idx === selectedAnswer) {
                    buttonClass += "border-red-500 bg-red-100 text-red-800";
                  } else {
                    buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
                  }
                } else {
                  buttonClass += "border-gray-200 hover:border-blue-500 hover:bg-blue-50";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={selectedAnswer !== null}
                    className={buttonClass}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {showFeedback && (
            <div className="text-center p-4 rounded-lg bg-gray-50">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <div className="text-green-600 font-bold text-lg">✅ Correct!</div>
              ) : (
                <div className="text-red-600 font-bold text-lg">❌ Incorrect</div>
              )}
              {currentQuestionIndex + 1 >= gameQuestions.length ? (
                <div className="mt-2 text-gray-600">
                  Game Complete! Final Score: {score}/{gameQuestions.length}
                </div>
              ) : (
                <div className="mt-2 text-gray-600">Next question in 2 seconds...</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleGameEnd = () => {
    setSelectedCategory(null);
  };

  return (
    <AuthGate>
      <EnsureProfile>
        {selectedCategory ? (
          <GamePlay category={selectedCategory} onGameEnd={handleGameEnd} />
        ) : (
          <CategorySelection onSelectCategory={setSelectedCategory} />
        )}
      </EnsureProfile>
    </AuthGate>
  );
}

export default App;