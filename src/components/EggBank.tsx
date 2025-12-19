import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { EggPulse } from "./EggPulse";
import { useGoalStore } from "@/store/goals";
import { getRandomQuote } from "@/lib/quotes";
import GoalDialog from "@/components/Dialogs/GoalDialog";

export function EggBank() {
  const animating = useRef(false);
  const controls = useAnimation();
  const { currentGoal, updateGoalProgress, checkIn } = useGoalStore();

  const [balance, setBalance] = useState<number>(0);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [pulseKey, setPulseKey] = useState<number>(0);
  const [displayBalance, setDisplayBalance] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const [amount, setAmount] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [quote, setQuote] = useState(getRandomQuote("saving"));
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const GOAL = currentGoal ? currentGoal.targetAmount : 300;

  useEffect(() => {
    // Show dialog if no goal exists
    if (!currentGoal) {
      setShowGoalDialog(true);
    }
  }, [currentGoal]);

  function animateBalanceChange(newBalance: number) {
    if (animating.current) return;
    animating.current = true;
    const start = displayBalance;
    const end = newBalance;
    const duration = 0.7;
    const steps = 30;
    let currentStep = 0;
    function step() {
      currentStep++;
      const progress = currentStep / steps;
      setDisplayBalance(Math.round(start + (end - start) * progress));
      if (currentStep < steps) {
        requestAnimationFrame(step);
      } else {
        setDisplayBalance(end);
        animating.current = false;
      }
    }
    step();
  }

  function addMoney(amount: number) {
    if (isNaN(amount) || amount <= 0) return;
    setPulseKey((prev) => prev + 1);
    controls.start({ scale: [1, 1.12, 0.95, 1], rotate: [0, 8, -8, 0] });
    setTimeout(() => {
      setBalance((prev) => {
        const newBal = prev + amount;
        animateBalanceChange(newBal);

        // Check if goal is reached
        if (newBal >= GOAL && prev < GOAL) {
          setShowCelebration(true);
          // Stop celebration after 15 seconds
          setTimeout(() => {
            setShowCelebration(false);
          }, 15000);
        }

        return newBal;
      });
    }, 350);
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);

    if (isNaN(value) || value <= 0 || !currentGoal) return;

    updateGoalProgress(currentGoal.id, value);
    checkIn(); // Track daily check-in for streak

    setIsAnimating(true);
    setAmount("");

    // Check if goal was just completed
    if (
      currentGoal.currentAmount + value >= currentGoal.targetAmount &&
      !currentGoal.completed
    ) {
      setShowCelebration(true);
      setQuote(getRandomQuote("goal_completed"));

      setTimeout(() => {
        setShowCelebration(false);
      }, 15000);
    }

    setTimeout(() => setIsAnimating(false), 1000);
  };

  // If no current goal, show goal form
  // if (!currentGoal) {
  //   return (
  //     <div className="w-full h-full flex justify-center items-center p-6 md:mt-16 md:ml-64">
  //       <GoalForm />
  //     </div>
  //   );
  // }
  if (!currentGoal) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-12 min-h-125">
        {/* <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-linear-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
            <Target className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-400">No Goals Yet</h2>
          <p className="text-gray-600 max-w-md">
            Start your savings journey by creating your first goal. Watch your
            egg fill up as you save!
          </p>
        </div> */}
        <GoalDialog open={showGoalDialog} onOpenChange={setShowGoalDialog} />
      </div>
    );
  }

  // Calculate fill percent (0 to 1)
  const fillPercent = Math.min(displayBalance / GOAL, 1);
  const isComplete = fillPercent >= 1;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Quote of the day */}
      <div className="max-w-md p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
        <p className="text-sm text-gray-700 italic">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="text-xs text-gray-500 mt-1 text-right">
          — {quote.author}
        </p>
      </div>

      <div className="relative w-40 h-40">
        <EggPulse triggerKey={pulseKey} />

        {/* Glowing effect when complete */}
        {isComplete && showCelebration && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-linear-to-r from-emerald-400 via-green-400 to-emerald-500 opacity-30 blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-linear-to-r from-emerald-500 via-emerald-400 to-green-500 opacity-25 blur-xl"
              animate={{
                scale: [1.1, 1.3, 1.1],
                opacity: [0.25, 0.4, 0.25],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </>
        )}

        <motion.div
          animate={controls}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center justify-center w-full h-full"
        >
          {/* Custom SVG with fill */}
          <svg
            width={120}
            height={120}
            viewBox="0 0 24 24"
            className="drop-shadow-2xl"
          >
            <defs>
              <clipPath id="egg-clip">
                {/* Lucide egg path */}
                <path d="M12 2C8 2 4 8 4 14a8 8 0 0 0 16 0c0-6-4-12-8-12" />
              </clipPath>
            </defs>
            {/* Fill - starts from bottom */}
            {fillPercent > 0 && (
              <rect
                x="0"
                y={22 - 20 * fillPercent}
                width="24"
                height={20 * fillPercent}
                fill={
                  isComplete && showCelebration
                    ? "url(#shimmer-gradient)"
                    : "#34d399"
                }
                clipPath="url(#egg-clip)"
                style={{ transition: "y 0.6s ease-out, height 0.6s ease-out" }}
              />
            )}
            {/* Shimmer gradient for complete state */}
            {isComplete && showCelebration && (
              <defs>
                <linearGradient
                  id="shimmer-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#10b981">
                    <animate
                      attributeName="stop-color"
                      values="#10b981; #34d399; #10b981"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="50%" stopColor="#34d399">
                    <animate
                      attributeName="stop-color"
                      values="#34d399; #10b981; #34d399"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="100%" stopColor="#10b981">
                    <animate
                      attributeName="stop-color"
                      values="#10b981; #34d399; #10b981"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </stop>
                </linearGradient>
              </defs>
            )}
            {/* Egg outline */}
            <path
              d="M12 2C8 2 4 8 4 14a8 8 0 0 0 16 0c0-6-4-12-8-12"
              fill="none"
              stroke={isComplete && showCelebration ? "#10b981" : "#047857"}
              strokeWidth={isComplete && showCelebration ? "2" : "1.5"}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: "stroke 0.5s, stroke-width 0.5s" }}
            />
          </svg>
        </motion.div>
      </div>

      <motion.div
        className="text-xl font-semibold tracking-tight text-slate-300"
        animate={isComplete && showCelebration ? { scale: [1, 1.05, 1] } : {}}
        transition={{
          duration: 1,
          repeat: isComplete && showCelebration ? Infinity : 0,
        }}
      >
        {isComplete && showCelebration ? (
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 via-green-400 to-emerald-600 animate-pulse">
            🎉 Goal Reached! ${displayBalance}
          </span>
        ) : (
          <>
            Saved: ${displayBalance}{" "}
            <span className="text-base font-normal text-slate-300">
              / ${GOAL}
            </span>
          </>
        )}
      </motion.div>

      {/* Progress bar */}
      <div className="w-40 h-2 bg-emerald-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isComplete && showCelebration
              ? "bg-linear-to-r from-emerald-500 via-green-400 to-emerald-500"
              : "bg-emerald-400"
          }`}
          style={{ width: `${fillPercent * 100}%` }}
        />
      </div>

      {/* Goal Info */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-300">
          {currentGoal.title}
        </h3>
        <p className="text-sm text-gray-300">{currentGoal.duration} goal</p>
      </div>

      <form
        className="flex gap-2 items-center"
        onSubmit={(e) => {
          e.preventDefault();
          const amt = parseFloat(inputAmount);
          if (!isNaN(amt) && amt > 0) {
            addMoney(amt);
            setInputAmount("");
          }
        }}
      >
        <input
          type="number"
          min="1"
          step="1"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-35 pl-5 py-2 rounded border border-emerald-300 focus:ring-2 focus:ring-emerald-400 outline-none text-slate-200"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
        >
          Save
        </button>
      </form>
    </div>
  );
}
