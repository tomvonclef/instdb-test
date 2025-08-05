import { id } from "@instantdb/react";
import db from "./db";

const TRIVIA_QUESTIONS = [
  // Science Questions
  {
    question: "What is the chemical symbol for gold?",
    category: "Science",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2
  },
  {
    question: "How many bones are in the adult human body?",
    category: "Science",
    options: ["206", "208", "210", "204"],
    correctAnswer: 0
  },
  {
    question: "What planet is known as the Red Planet?",
    category: "Science",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1
  },
  {
    question: "What gas makes up about 78% of Earth's atmosphere?",
    category: "Science",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
    correctAnswer: 2
  },
  {
    question: "What is the hardest natural substance on Earth?",
    category: "Science",
    options: ["Gold", "Iron", "Diamond", "Quartz"],
    correctAnswer: 2
  },
  {
    question: "What is the speed of light in a vacuum?",
    category: "Science",
    options: ["300,000 km/s", "299,792,458 m/s", "186,000 mi/s", "All of the above"],
    correctAnswer: 3
  },
  {
    question: "What is the largest organ in the human body?",
    category: "Science",
    options: ["Brain", "Liver", "Lungs", "Skin"],
    correctAnswer: 3
  },
  {
    question: "What type of animal is a Komodo dragon?",
    category: "Science",
    options: ["Snake", "Lizard", "Crocodile", "Turtle"],
    correctAnswer: 1
  },
  {
    question: "What is the most abundant gas in the universe?",
    category: "Science",
    options: ["Oxygen", "Helium", "Hydrogen", "Nitrogen"],
    correctAnswer: 2
  },
  {
    question: "How many chambers does a human heart have?",
    category: "Science",
    options: ["2", "3", "4", "5"],
    correctAnswer: 2
  },

  // History Questions
  {
    question: "In which year did World War II end?",
    category: "History",
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: 1
  },
  {
    question: "Who was the first person to walk on the moon?",
    category: "History",
    options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"],
    correctAnswer: 1
  },
  {
    question: "Which ancient wonder of the world was located in Alexandria?",
    category: "History",
    options: ["Colossus of Rhodes", "Lighthouse of Alexandria", "Hanging Gardens", "Temple of Artemis"],
    correctAnswer: 1
  },
  {
    question: "The Berlin Wall fell in which year?",
    category: "History",
    options: ["1987", "1988", "1989", "1990"],
    correctAnswer: 2
  },
  {
    question: "Who was the first President of the United States?",
    category: "History",
    options: ["John Adams", "Thomas Jefferson", "George Washington", "Benjamin Franklin"],
    correctAnswer: 2
  },
  {
    question: "Which empire was ruled by Julius Caesar?",
    category: "History",
    options: ["Greek Empire", "Roman Empire", "Persian Empire", "Byzantine Empire"],
    correctAnswer: 1
  },
  {
    question: "The Titanic sank in which year?",
    category: "History",
    options: ["1910", "1911", "1912", "1913"],
    correctAnswer: 2
  },
  {
    question: "Which country gifted the Statue of Liberty to the United States?",
    category: "History",
    options: ["England", "Spain", "France", "Italy"],
    correctAnswer: 2
  },
  {
    question: "World War I began in which year?",
    category: "History",
    options: ["1912", "1913", "1914", "1915"],
    correctAnswer: 2
  },
  {
    question: "Who painted the ceiling of the Sistine Chapel?",
    category: "History",
    options: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"],
    correctAnswer: 2
  },

  // Sports Questions
  {
    question: "How many players are on a basketball team on the court at one time?",
    category: "Sports",
    options: ["4", "5", "6", "7"],
    correctAnswer: 1
  },
  {
    question: "In which sport would you perform a slam dunk?",
    category: "Sports",
    options: ["Tennis", "Basketball", "Volleyball", "Baseball"],
    correctAnswer: 1
  },
  {
    question: "How often are the Summer Olympic Games held?",
    category: "Sports",
    options: ["Every 2 years", "Every 3 years", "Every 4 years", "Every 5 years"],
    correctAnswer: 2
  },
  {
    question: "What is the maximum score possible in ten-pin bowling?",
    category: "Sports",
    options: ["200", "250", "300", "350"],
    correctAnswer: 2
  },
  {
    question: "In soccer, how long is a standard match?",
    category: "Sports",
    options: ["80 minutes", "90 minutes", "100 minutes", "120 minutes"],
    correctAnswer: 1
  },
  {
    question: "Which sport is played at Wimbledon?",
    category: "Sports",
    options: ["Cricket", "Golf", "Tennis", "Rugby"],
    correctAnswer: 2
  },
  {
    question: "How many holes are there in a full round of golf?",
    category: "Sports",
    options: ["16", "17", "18", "19"],
    correctAnswer: 2
  },
  {
    question: "In American football, how many points is a touchdown worth?",
    category: "Sports",
    options: ["5", "6", "7", "8"],
    correctAnswer: 1
  },
  {
    question: "Which country hosted the 2016 Summer Olympics?",
    category: "Sports",
    options: ["China", "United Kingdom", "Brazil", "Japan"],
    correctAnswer: 2
  },
  {
    question: "What is the diameter of a basketball hoop in inches?",
    category: "Sports",
    options: ["16", "17", "18", "19"],
    correctAnswer: 2
  },

  // Entertainment Questions
  {
    question: "Which movie features the song 'My Heart Will Go On'?",
    category: "Entertainment",
    options: ["The Bodyguard", "Titanic", "Ghost", "Dirty Dancing"],
    correctAnswer: 1
  },
  {
    question: "Who directed the movie 'Jaws'?",
    category: "Entertainment",
    options: ["George Lucas", "Steven Spielberg", "Martin Scorsese", "Francis Ford Coppola"],
    correctAnswer: 1
  },
  {
    question: "Which TV show features characters named Ross, Rachel, and Monica?",
    category: "Entertainment",
    options: ["Seinfeld", "Friends", "How I Met Your Mother", "The Office"],
    correctAnswer: 1
  },
  {
    question: "What is the highest-grossing film of all time (as of 2023)?",
    category: "Entertainment",
    options: ["Titanic", "Avatar", "Avengers: Endgame", "Star Wars: The Force Awakens"],
    correctAnswer: 1
  },
  {
    question: "Which artist painted 'The Starry Night'?",
    category: "Entertainment",
    options: ["Pablo Picasso", "Claude Monet", "Vincent van Gogh", "Leonardo da Vinci"],
    correctAnswer: 2
  },
  {
    question: "What is Elvis Presley's middle name?",
    category: "Entertainment",
    options: ["Alan", "Aaron", "Andrew", "Anthony"],
    correctAnswer: 1
  },
  {
    question: "Which actor played Jack in 'Titanic'?",
    category: "Entertainment",
    options: ["Brad Pitt", "Tom Cruise", "Leonardo DiCaprio", "Johnny Depp"],
    correctAnswer: 2
  },
  {
    question: "What is the name of Harry Potter's owl?",
    category: "Entertainment",
    options: ["Errol", "Pigwidgeon", "Hedwig", "Crookshanks"],
    correctAnswer: 2
  },
  {
    question: "Which band released the album 'Abbey Road'?",
    category: "Entertainment",
    options: ["The Rolling Stones", "The Beatles", "Led Zeppelin", "Pink Floyd"],
    correctAnswer: 1
  },
  {
    question: "In the TV show 'The Office', what is the name of the paper company?",
    category: "Entertainment",
    options: ["Sabre", "Dunder Mifflin", "Vance Refrigeration", "Schrute Farms"],
    correctAnswer: 1
  }
];

export async function seedQuestions() {
  console.log("Seeding questions...");
  
  for (const questionData of TRIVIA_QUESTIONS) {
    await db.transact(
      db.tx.questions[id()].update({
        question: questionData.question,
        category: questionData.category,
        options: JSON.stringify(questionData.options),
        correctAnswer: questionData.correctAnswer,
      })
    );
  }
  
  console.log(`Seeded ${TRIVIA_QUESTIONS.length} questions!`);
}

export { TRIVIA_QUESTIONS };