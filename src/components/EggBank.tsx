import { useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { EggPulse } from "./EggPulse";


export function EggBank() {
  const GOAL = 300;
  const [balance, setBalance] = useState<number>(0);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [pulseKey, setPulseKey] = useState<number>(0);
  const [displayBalance, setDisplayBalance] = useState<number>(0);
  const animating = useRef(false);
  const controls = useAnimation();

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
        return newBal;
      });
    }, 350);
  }

  // Calculate fill percent (0 to 1)
  const fillPercent = Math.min(displayBalance / GOAL, 1);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-40 h-40">
        <EggPulse triggerKey={pulseKey} />
        <motion.div
          animate={controls}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center justify-center w-full h-full"
        >
          {/* Custom SVG with fill */}
          <svg width={120} height={120} viewBox="0 0 24 24" className="drop-shadow-2xl">
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
                y={22 - (20 * fillPercent)}
                width="24"
                height={20 * fillPercent}
                fill="#34d399"
                clipPath="url(#egg-clip)"
                style={{ transition: 'y 0.6s ease-out, height 0.6s ease-out' }}
              />
            )}
            {/* Egg outline */}
            <path 
              d="M12 2C8 2 4 8 4 14a8 8 0 0 0 16 0c0-6-4-12-8-12" 
              fill="none"
              stroke="#047857" 
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>

      <div className="text-xl font-semibold tracking-tight">
        Saved: ${displayBalance} <span className="text-base font-normal text-slate-500">/ ${GOAL}</span>
      </div>
      
      {/* Progress bar */}
      <div className="w-40 h-2 bg-emerald-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-400 transition-all duration-500"
          style={{ width: `${fillPercent * 100}%` }}
        />
      </div>

      <form
        className="flex gap-2 items-center"
        onSubmit={e => {
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
          onChange={e => setInputAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-32 px-3 py-2 rounded border border-emerald-300 focus:ring-2 focus:ring-emerald-400 outline-none"
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
