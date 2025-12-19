'use client';

import { useState } from 'react';
import { useGoalStore } from '@/store/goals';
import type { GoalDuration } from '@/types/goals';
import { Target, Calendar, DollarSign, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface GoalDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function GoalDialog({ trigger, open, onOpenChange }: GoalDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [duration, setDuration] = useState<GoalDuration>('monthly');
  const createGoal = useGoalStore((state) => state.createGoal);

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !targetAmount || Number(targetAmount) <= 0) {
      return;
    }

    createGoal(title.trim(), Number(targetAmount), duration);
    
    // Reset form and close dialog
    setTitle('');
    setTargetAmount('');
    setDuration('monthly');
    handleOpenChange(false);
  };

  const isControlled = open !== undefined && onOpenChange !== undefined;

  return (
    <Dialog open={isControlled ? open : isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-linear-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 md:ml-64 ml-0">
            <Target className="w-4 h-4 mr-2" />
            Create New Goal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            Create Your Goal
          </DialogTitle>
          <DialogDescription>
            Set a savings goal and watch your progress grow!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Goal Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              <Sparkles className="w-4 h-4 inline mr-1" />
              Goal Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Emergency Fund, Vacation Savings"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Target Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Target Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                id="amount"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Calendar className="w-4 h-4 inline mr-1" />
              Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['weekly', 'monthly', 'yearly'] as GoalDuration[]).map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDuration(dur)}
                  className={`cursor-pointer px-4 py-3 rounded-lg font-medium transition-all ${
                    duration === dur
                      ? 'bg-emerald-500 text-white shadow-md scale-105'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-emerald-500'
                  }`}
                >
                  {dur.charAt(0).toUpperCase() + dur.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Motivational Message */}
          <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
            <p className="text-sm text-emerald-800 italic">
              💡 <strong>Tip:</strong> Start small and build consistency. Even $5 a day adds up to over $1,800 a year!
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-linear-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 py-6 text-lg"
          >
            Create Goal 🎯
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}