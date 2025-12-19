import { GoalDuration } from '@/types/goals';

export const calculateEndDate = (duration: GoalDuration): string => {
  const date = new Date();
  switch (duration) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date.toISOString();
};

export const isStreakActive = (lastCheckIn: string | null): boolean => {
  if (!lastCheckIn) return false;
  const last = new Date(lastCheckIn);
  const now = new Date();
  const diffInHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
  return diffInHours < 48; // Allow 48 hours grace period
};