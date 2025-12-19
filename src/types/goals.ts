export type GoalDuration = 'weekly' | 'monthly' | 'yearly';

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  duration: GoalDuration;
  startDate: string;
  endDate: string;
  completed: boolean;
  completedAt?: string;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string | null;
  totalCheckIns: number;
}

export interface GoalStore {
  goals: Goal[];
  currentGoal: Goal | null;
  streak: Streak;
  
  // Goal actions
  createGoal: (title: string, targetAmount: number, duration: GoalDuration) => void;
  updateGoalProgress: (goalId: string, amount: number) => void;
  completeGoal: (goalId: string) => void;
  deleteGoal: (goalId: string) => void;
  setCurrentGoal: (goalId: string) => void;
  
  // Streak actions
  checkIn: () => void;
  resetStreak: () => void;
}
