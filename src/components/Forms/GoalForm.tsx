"use client";

import { useState } from "react";
import { useGoalStore } from "@/store/goals";
import type { GoalDuration } from "@/types/goals";
import { Target, Calendar, DollarSign, Sparkles } from "lucide-react";

export default function GoalForm() {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [duration, setDuration] = useState<GoalDuration>("monthly");
  const createGoal = useGoalStore((state) => state.createGoal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !targetAmount || Number(targetAmount) <= 0) {
      return;
    }

    createGoal(title.trim(), Number(targetAmount), duration);

    // Reset form
    setTitle("");
    setTargetAmount("");
    setDuration("monthly");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-linear-to-br from-emerald-50 to-green-50 rounded-2xl shadow-xl p-8 border border-emerald-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-400">
              Create Your First Goal
            </h2>
            <p className="text-gray-600">Start your savings journey today!</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <Sparkles className="w-4 h-4 inline mr-1" />
              Goal Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Emergency Fund, Vacation Savings, New Laptop"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Target Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <DollarSign className="w-4 h-4 inline mr-1" />
              Target Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
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
              {(["weekly", "monthly", "yearly"] as GoalDuration[]).map(
                (dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDuration(dur)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      duration === dur
                        ? "bg-emerald-500 text-white shadow-md scale-105"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-emerald-500"
                    }`}
                  >
                    {dur.charAt(0).toUpperCase() + dur.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 rounded-lg font-semibold hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Create Goal 🎯
          </button>
        </form>

        {/* Motivational Message */}
        <div className="mt-6 p-4 bg-emerald-100 rounded-lg border-l-4 border-emerald-500">
          <p className="text-sm text-emerald-800 italic">
            💡 <strong>Tip:</strong> Start small and build consistency. Even $5
            a day adds up to over $1,800 a year!
          </p>
        </div>
      </div>
    </div>
  );
}
