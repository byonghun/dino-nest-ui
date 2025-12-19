import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Goal, GoalStore } from '@/types/goals';
import { calculateEndDate, isStreakActive } from '@/lib/goals';

export const useGoalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      goals: [],
      currentGoal: null,
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastCheckIn: null,
        totalCheckIns: 0,
      },

      createGoal: (title, targetAmount, duration) => {
        const newGoal: Goal = {
          id: crypto.randomUUID(),
          title,
          targetAmount,
          currentAmount: 0,
          duration,
          startDate: new Date().toISOString(),
          endDate: calculateEndDate(duration),
          completed: false,
        };
        
        set((state) => ({
          goals: [...state.goals, newGoal],
          currentGoal: state.currentGoal || newGoal,
        }));
      },

      updateGoalProgress: (goalId, amount) => {
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id === goalId) {
              const newAmount = goal.currentAmount + amount;
              const isCompleted = newAmount >= goal.targetAmount;
              
              return {
                ...goal,
                currentAmount: newAmount,
                completed: isCompleted,
                completedAt: isCompleted ? new Date().toISOString() : undefined,
              };
            }
            return goal;
          }),
          currentGoal:
            state.currentGoal?.id === goalId
              ? {
                  ...state.currentGoal,
                  currentAmount: state.currentGoal.currentAmount + amount,
                  completed: state.currentGoal.currentAmount + amount >= state.currentGoal.targetAmount,
                }
              : state.currentGoal,
        }));
      },

      completeGoal: (goalId) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? { ...goal, completed: true, completedAt: new Date().toISOString() }
              : goal
          ),
        }));
      },

      deleteGoal: (goalId) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== goalId),
          currentGoal: state.currentGoal?.id === goalId ? null : state.currentGoal,
        }));
      },

      setCurrentGoal: (goalId) => {
        const goal = get().goals.find((g) => g.id === goalId);
        if (goal) {
          set({ currentGoal: goal });
        }
      },

      checkIn: () => {
        const { streak } = get();
        const isActive = isStreakActive(streak.lastCheckIn);
        
        set({
          streak: {
            currentStreak: isActive ? streak.currentStreak + 1 : 1,
            longestStreak: Math.max(
              streak.longestStreak,
              isActive ? streak.currentStreak + 1 : 1
            ),
            lastCheckIn: new Date().toISOString(),
            totalCheckIns: streak.totalCheckIns + 1,
          },
        });
      },

      resetStreak: () => {
        set((state) => ({
          streak: {
            ...state.streak,
            currentStreak: 0,
          },
        }));
      },
    }),
    {
      name: 'dinonest-goal-storage',
    }
  )
);