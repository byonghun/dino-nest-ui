export const motivationalQuotes = [
  {
    text: "A journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
    context: "starting"
  },
  {
    text: "Do not save what is left after spending, but spend what is left after saving.",
    author: "Warren Buffett",
    context: "saving"
  },
  {
    text: "The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order, trains to forethought.",
    author: "T.T. Munger",
    context: "habit"
  },
  {
    text: "Small disciplines repeated with consistency every day lead to great achievements.",
    author: "John C. Maxwell",
    context: "streak"
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
    context: "streak"
  },
  {
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
    context: "goal_completed"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    context: "starting"
  },
  {
    text: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make.",
    author: "Dave Ramsey",
    context: "saving"
  },
  {
    text: "Every accomplishment starts with the decision to try.",
    author: "Unknown",
    context: "goal_completed"
  },
  {
    text: "Your future self will thank you for the small steps you take today.",
    author: "Unknown",
    context: "daily"
  },
];

export const getRandomQuote = (context?: string) => {
  const filtered = context 
    ? motivationalQuotes.filter(q => q.context === context)
    : motivationalQuotes;
  
  const quotes = filtered.length > 0 ? filtered : motivationalQuotes;
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const streakMessages = {
  1: "🌱 Great start! You've begun your journey!",
  3: "🔥 3 days! You're building momentum!",
  7: "⭐ One week strong! Keep it up!",
  14: "💪 Two weeks! You're crushing it!",
  30: "🏆 30 days! You're a savings champion!",
  50: "🎯 50 days! Unstoppable!",
  100: "👑 100 days! You're a legend!",
};

export const getStreakMessage = (streak: number): string => {
  const milestones = Object.keys(streakMessages)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const milestone of milestones) {
    if (streak >= milestone) {
      return streakMessages[milestone as keyof typeof streakMessages];
    }
  }
  
  return `🔥 ${streak} day${streak > 1 ? 's' : ''} streak!`;
};