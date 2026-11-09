interface QuizScoreGaugeProps {
	percent: number;
}

const SIZE = 200;
const STROKE = 26;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TRACK_LENGTH = (CIRCUMFERENCE * 300) / 360;

export default function QuizScoreGauge({ percent }: QuizScoreGaugeProps) {
	const clamped = Math.max(0, Math.min(100, percent));
	const filled = (TRACK_LENGTH * clamped) / 100;

	return (
		<div
			className="relative h-[200px] w-[200px] shrink-0"
			role="img"
			aria-label={`Score: ${Math.round(clamped)}%`}
		>
			<svg
				width={SIZE}
				height={SIZE}
				viewBox={`0 0 ${SIZE} ${SIZE}`}
				className="rotate-[120deg]"
				aria-hidden="true"
			>
				<defs>
					<linearGradient id="quiz-score-gradient" x1="0" y1="1" x2="1" y2="0">
						<stop offset="0%" stopColor="#2F4A3A" />
						<stop offset="100%" stopColor="#3FA55B" />
					</linearGradient>
				</defs>

				<circle
					cx={SIZE / 2}
					cy={SIZE / 2}
					r={RADIUS}
					fill="none"
					stroke="#ECECEC"
					strokeWidth={STROKE}
					strokeLinecap="round"
					strokeDasharray={`${TRACK_LENGTH} ${CIRCUMFERENCE}`}
				/>

				{filled > 0 && (
					<circle
						cx={SIZE / 2}
						cy={SIZE / 2}
						r={RADIUS}
						fill="none"
						stroke="url(#quiz-score-gradient)"
						strokeWidth={STROKE}
						strokeLinecap="round"
						strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
						className="transition-[stroke-dasharray] duration-700"
					/>
				)}
			</svg>

			<span className="absolute inset-0 flex items-center justify-center text-5xl font-semibold text-[#3FA55B]">
				{Math.round(clamped)}%
			</span>
		</div>
	);
}
