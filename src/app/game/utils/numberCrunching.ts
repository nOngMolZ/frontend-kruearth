import { Question } from "@/types/Question";

export default function numberCrunching(): Question {
	const op: string = randomOperator();
	let num1: number;
	let num2: number;

	if (op == "+" || op == "-") {
		[num1, num2] = randomNumberTenDigit();
	} else {
		[num1, num2] = randomNumberUnitDigit();
		if (op == "/" && num1 < num2) {
			[num1, num2] = [num2, num1];
		}
	}

	const answer = calculateAnswer(num1, num2, op);

	const wrongAnswers = new Set<number>();
	while (wrongAnswers.size < 3) {
		let wrongAnswer = randomChoice([
			answer + 1,
			answer - 1,
			answer + 2,
			answer - 2,
			answer + 3,
			answer - 3,
		]);
		wrongAnswer = parseFloat(wrongAnswer.toFixed(2));
		if (wrongAnswer !== answer) {
			wrongAnswers.add(wrongAnswer);
		}
	}

	const options = [
		{ text: answer.toString(), isCorrect: true },
		...Array.from(wrongAnswers).map((wrong) => ({
			text: wrong.toString(),
			isCorrect: false,
		})),
	];
	options.sort(() => Math.random() - 0.5);

	const question: Question = {
		_id: "66f3e854b4bc1daba5211ca3",
		subtopicId: "66f54da5b7e39f5480d16cce",
		questionName: `${num1} ${op} ${num2}`,
		option: options,
		hint: "",
	};

	return question;
}

function randomOperator() {
	const ranNum: number = Math.floor(Math.random() * 4);

	switch (ranNum) {
		case 0:
			return "+";

		case 1:
			return "-";

		case 2:
			return "*";

		case 3:
			return "/";

		default:
			return "+";
	}
}

function randomNumberUnitDigit(): number[] {
	const num1: number = Math.floor(Math.random() * 12) + 1;
	const num2: number = Math.floor(Math.random() * 12) + 1;
	return [num1, num2];
}

function randomNumberTenDigit(): number[] {
	const num1: number = Math.floor(Math.random() * 100) + 1;
	const num2: number = Math.floor(Math.random() * 100) + 1;
	return [num1, num2];
}

function calculateAnswer(num1: number, num2: number, op: string): number {
	let answer: number;

	switch (op) {
		case "+":
			answer = num1 + num2;
			break;
		case "-":
			answer = num1 - num2;
			break;
		case "*":
			answer = num1 * num2;
			break;
		case "/":
			answer = num1 / num2;
			break;
		default:
			answer = 0;
	}

	return parseFloat(answer.toFixed(2));
}

function randomChoice(arr: number[]): number {
	const index: number = Math.floor(Math.random() * arr.length);
	return arr[index];
}
