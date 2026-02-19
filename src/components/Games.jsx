import { useEffect, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import AnimatedTitle from "./AnimatedTitle";
import { BentoTilt } from "./Features";

const actionButtonClass =
  "rounded-full border border-white/20 bg-black px-4 py-2 text-sm font-general uppercase text-blue-50 transition-colors duration-300 hover:bg-blue-75 hover:text-black md:text-base";

const RockPaperScissors = () => {
  const choices = ["Rock", "Paper", "Scissors"];
  const [result, setResult] = useState("Pick your move to start.");
  const [score, setScore] = useState(0);
  const [playerChoice, setPlayerChoice] = useState("-");
  const [cpuChoice, setCpuChoice] = useState("-");

  const playRound = (choice) => {
    const computer = choices[Math.floor(Math.random() * choices.length)];
    setPlayerChoice(choice);
    setCpuChoice(computer);

    if (choice === computer) {
      setResult("Draw round.");
      return;
    }

    const isWin =
      (choice === "Rock" && computer === "Scissors") ||
      (choice === "Paper" && computer === "Rock") ||
      (choice === "Scissors" && computer === "Paper");

    if (isWin) {
      setScore((prev) => prev + 1);
      setResult("You win this round.");
      return;
    }

    setScore((prev) => Math.max(prev - 1, 0));
    setResult("CPU wins this round.");
  };

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <div className="space-y-1 text-sm text-blue-50/80">
        <p>
          You: <span className="text-blue-50">{playerChoice}</span>
        </p>
        <p>
          CPU: <span className="text-blue-50">{cpuChoice}</span>
        </p>
        <p>
          Score: <span className="text-blue-50">{score}</span>
        </p>
      </div>

      <p className="font-circular-web text-sm text-blue-50">{result}</p>

      <div className="flex flex-wrap gap-2">
        {choices.map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => playRound(choice)}
            className={actionButtonClass}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
};

const NumberGuess = () => {
  const createRandomTarget = () => Math.floor(Math.random() * 20) + 1;

  const [target, setTarget] = useState(createRandomTarget);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("Guess a number between 1 and 20.");

  const submitGuess = () => {
    const parsedGuess = Number.parseInt(guess, 10);

    if (Number.isNaN(parsedGuess) || parsedGuess < 1 || parsedGuess > 20) {
      setFeedback("Enter a valid number from 1 to 20.");
      return;
    }

    setAttempts((prev) => prev + 1);

    if (parsedGuess === target) {
      setFeedback(`Correct! You found it in ${attempts + 1} moves.`);
      return;
    }

    setFeedback(parsedGuess < target ? "Too low. Try again." : "Too high. Try again.");
  };

  const resetGame = () => {
    setTarget(createRandomTarget());
    setGuess("");
    setAttempts(0);
    setFeedback("New number generated. Start guessing.");
  };

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <p className="font-circular-web text-sm text-blue-50">{feedback}</p>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={20}
          value={guess}
          onChange={(event) => setGuess(event.target.value)}
          className="w-24 rounded-md border border-white/20 bg-black/70 px-3 py-2 text-sm text-blue-50 outline-none"
          placeholder="1-20"
        />
        <button type="button" onClick={submitGuess} className={actionButtonClass}>
          Guess
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-blue-50/80">
        <p>
          Attempts: <span className="text-blue-50">{attempts}</span>
        </p>
        <button type="button" onClick={resetGame} className={actionButtonClass}>
          Reset
        </button>
      </div>
    </div>
  );
};

const TapSprint = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return undefined;

    if (timeLeft <= 0) {
      setIsRunning(false);
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isRunning, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setIsRunning(true);
  };

  const registerTap = () => {
    if (!isRunning || timeLeft <= 0) return;
    setScore((prev) => prev + 1);
  };

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <div className="text-sm text-blue-50/80">
        <p>
          Time: <span className="text-blue-50">{timeLeft}s</span>
        </p>
        <p>
          Taps: <span className="text-blue-50">{score}</span>
        </p>
      </div>

      <button
        type="button"
        onClick={registerTap}
        className="rounded-xl border border-blue-75/60 bg-blue-75 px-6 py-8 font-general text-base uppercase text-black transition-transform duration-300 hover:scale-[1.02]"
      >
        Tap Fast
      </button>

      <button type="button" onClick={startGame} className={actionButtonClass}>
        {isRunning ? "Restart" : "Start 10s Round"}
      </button>
    </div>
  );
};

const GameCard = ({ title, description, children, accentClass }) => (
  <div>
    <BentoTilt className="border-hsla relative h-[30rem] overflow-hidden rounded-md">
      <div className={`pointer-events-none absolute inset-0 ${accentClass}`} />
      <div className="relative z-10 flex size-full flex-col justify-between bg-black/65 p-5 text-blue-50">
        <div>
          <h2 className="bento-title special-font text-3xl md:text-4xl">{title}</h2>
          <p className="mt-2 max-w-sm font-circular-web text-sm text-blue-50/80">
            {description}
          </p>
        </div>
        <div className="mt-6 h-full">{children}</div>
      </div>
    </BentoTilt>
  </div>
);

const Games = () => {
  return (
    <section id="games" className="bg-black pb-36 pt-24">
      <div className="container mx-auto px-3 md:px-10">
        <div className="mb-16 px-5">
          <p className="font-circular-web text-lg text-blue-50">Available Games</p>
          <AnimatedTitle
            title="expl<b>o</b>re and pl<b>a</b>y"
            containerClass="mt-5 max-w-4xl !text-blue-50"
          />
          <p className="mt-6 max-w-2xl font-circular-web text-sm text-blue-50/70 md:text-base">
            Jump into quick web mini-games. Every game is live and playable right here.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          <GameCard
            title={
              <>
                r<b>p</b>s clash
              </>
            }
            description="Classic Rock, Paper, Scissors with score tracking."
            accentClass="bg-gradient-to-br from-violet-300/35 via-blue-300/25 to-transparent"
          >
            <RockPaperScissors />
          </GameCard>

          <GameCard
            title={
              <>
                numb<b>e</b>r hunt
              </>
            }
            description="Guess the hidden number from 1 to 20 in as few tries as possible."
            accentClass="bg-gradient-to-br from-blue-300/30 via-cyan-300/20 to-transparent"
          >
            <NumberGuess />
          </GameCard>

          <GameCard
            title={
              <>
                tap spr<b>i</b>nt
              </>
            }
            description="Start the timer and tap as fast as you can before it ends."
            accentClass="bg-gradient-to-br from-yellow-300/30 via-orange-300/20 to-transparent"
          >
            <TapSprint />
          </GameCard>
        </div>

        <div className="mt-10 flex items-center gap-2 px-5 text-xs uppercase text-blue-50/60">
          <TiLocationArrow />
          <p>More playable cards coming soon.</p>
        </div>
      </div>
    </section>
  );
};

export default Games;
