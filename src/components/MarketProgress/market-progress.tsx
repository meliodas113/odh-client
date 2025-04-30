import { useState, useEffect } from "react";
import "./styles.css";

interface MarketProgressProps {
  optionA: string;
  optionB: string;
  totalOptionAShares: bigint;
  totalOptionBShares: bigint;
}

export function MarketProgress({
  optionA,
  optionB,
  totalOptionAShares,
  totalOptionBShares,
}: MarketProgressProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<null | "A" | "B">(null);

  // Convert BigInt to Number for calculation
  const aShares = Number(totalOptionAShares);
  const bShares = Number(totalOptionBShares);
  const total = aShares + bShares;

  // Calculate percentages
  const percentA = total > 0 ? (aShares / total) * 100 : 50;
  const percentB = total > 0 ? (bShares / total) * 100 : 50;

  // Animation for progress bars
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="market-progress">
      <div className="market-progress__options">
        <div
          className={`market-progress__option market-progress__option--a ${
            hoveredOption === "A" ? "market-progress__option--hovered" : ""
          }`}
          onMouseEnter={() => setHoveredOption("A")}
          onMouseLeave={() => setHoveredOption(null)}
        >
          <span className="market-progress__option-name">{optionA}</span>
          <span className="market-progress__option-percentage">
            {percentA.toFixed(1)}%
          </span>
        </div>

        <div
          className={`market-progress__option market-progress__option--b ${
            hoveredOption === "B" ? "market-progress__option--hovered" : ""
          }`}
          onMouseEnter={() => setHoveredOption("B")}
          onMouseLeave={() => setHoveredOption(null)}
        >
          <span className="market-progress__option-name">{optionB}</span>
          <span className="market-progress__option-percentage">
            {percentB.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="market-progress__bar-container">
        <div
          className="market-progress__bar market-progress__bar--a"
          style={{
            width: animationComplete ? `${percentA}%` : "0%",
          }}
        >
          {percentA > 15 && (
            <span className="market-progress__bar-label">{optionA}</span>
          )}
        </div>
        <div
          className="market-progress__bar market-progress__bar--b"
          style={{
            width: animationComplete ? `${percentB}%` : "0%",
          }}
        >
          {percentB > 15 && (
            <span className="market-progress__bar-label">{optionB}</span>
          )}
        </div>
      </div>

      <div className="market-progress__stats">
        <div className="market-progress__stat">
          <span className="market-progress__stat-label">Option A Shares:</span>
          <span className="market-progress__stat-value">
            {(aShares / 1e18).toLocaleString()}
          </span>
        </div>
        <div className="market-progress__stat">
          <span className="market-progress__stat-label">Option B Shares:</span>
          <span className="market-progress__stat-value">
            {(bShares / 1e18).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
