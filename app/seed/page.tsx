"use client";

import { useState } from "react";
import Link from "next/link";
import { seedQuestions } from "../../lib/seed-questions";

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedQuestions();
      setIsSeeded(true);
    } catch (error) {
      console.error("Error seeding questions:", error);
      alert("Error seeding questions. Check console for details.");
    }
    setIsSeeding(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Seed Trivia Questions</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to add 40 trivia questions to your database.
        </p>
        
        {isSeeded ? (
          <div className="text-green-600 font-medium">
            ✅ Questions seeded successfully!
            <br />
            <Link href="/" className="text-blue-600 underline mt-2 inline-block">
              Go to Trivia Game
            </Link>
          </div>
        ) : (
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSeeding ? "Seeding..." : "Seed Questions"}
          </button>
        )}
      </div>
    </div>
  );
}