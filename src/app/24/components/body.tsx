import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { evaluate, string } from "mathjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@/context/userContext";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";

interface BodyProps {
	level: any;
	IsEnd: boolean;
	setIsEnd: (value: boolean) => void;
}

// ฟังก์ชันสร้างตัวเลขสุ่ม
const generateRandomNumbers = (level: "easy" | "medium" | "hard"): number[] => {
	const count = level === "hard" ? 5 : 4;
	return Array.from(
		{ length: count },
		() => Math.floor(Math.random() * 10) + 1
	);
};

// ฟังก์ชันสุ่มตัวดำเนินการ
const getRandomOperator = (level: "easy" | "medium" | "hard"): string => {
	const operators =
		level === "hard"
			? ["+", "-", "*", "/", "^", "!"]
			: level === "medium"
			? ["+", "-", "*", "/", "^"]
			: ["+", "-", "*", "/"];
	return operators[Math.floor(Math.random() * operators.length)];
};

// ฟังก์ชันตรวจสอบการหารเป็นจำนวนเต็ม
const isIntegerDivision = (a: number, b: number): boolean => a % b === 0;

// ฟังก์ชันตรวจสอบว่าค่าผลลัพธ์เป็นจำนวนเต็ม
const isInteger = (value: number): boolean => Number.isInteger(value);

// ฟังก์ชันสร้างสมการและคำนวณคำตอบเป้าหมาย
const generateExpression = (
	numbers: number[],
	level: "easy" | "medium" | "hard"
) => {
	const expressions: string[] = [];

	// สร้างสมการพื้นฐาน (3 หรือ 4 รอบ ตาม level)

	// แก้ไขส่วนนี้เพื่อใช้ตัวเลขทั้งหมดใน "hard" level
	if (level === "hard" && numbers.length >= 5) {
		// ถ้า level เป็น "hard" และมี 5 ตัวเลข ใช้ทั้งหมด
		console.log("Using 5 numbers for hard level");
		for (let i = 0; i < 4; i++) {
			console.log(`Generating expressions with 5 numbers - Loop ${i + 1}/4`);
			expressions.push(
				`${numbers[0]} ${getRandomOperator(level)} ${
					numbers[1]
				} ${getRandomOperator(level)} ${numbers[2]} ${getRandomOperator(
					level
				)} ${numbers[3]} ${getRandomOperator(level)} ${numbers[4]}`,
				`(${numbers[0]} ${getRandomOperator(level)} ${
					numbers[1]
				}) ${getRandomOperator(level)} (${numbers[2]} ${getRandomOperator(
					level
				)} ${numbers[3]} ${getRandomOperator(level)} ${numbers[4]})`,
				`(${numbers[0]} ${getRandomOperator(level)} ${
					numbers[1]
				}) ${getRandomOperator(level)} (${numbers[2]} ${getRandomOperator(
					level
				)} ${numbers[3]})`,
				`${numbers[0]} ${getRandomOperator(level)} (${
					numbers[1]
				} ${getRandomOperator(level)} ${numbers[2]} ${getRandomOperator(
					level
				)} ${numbers[3]} ${getRandomOperator(level)} ${numbers[4]})`
			);
		}
	} else {
		for (let i = 0; i < 3; i++) {
			console.log(`Generating expressions - Loop ${i + 1}/${3}`);
			expressions.push(
				`${numbers[0]} ${getRandomOperator(level)} ${
					numbers[1]
				} ${getRandomOperator(level)} ${numbers[2]} ${getRandomOperator(
					level
				)} ${numbers[3]}`,
				`(${numbers[0]} ${getRandomOperator(level)} ${
					numbers[1]
				}) ${getRandomOperator(level)} (${numbers[2]} ${getRandomOperator(
					level
				)} ${numbers[3]})`,
				`(${numbers[0]} ${getRandomOperator(level)} ${
					numbers[1]
				}) ${getRandomOperator(level)} (${numbers[2]} ${getRandomOperator(
					level
				)} ${numbers[3]})`,
				`${numbers[0]} ${getRandomOperator(level)} (${
					numbers[1]
				} ${getRandomOperator(level)} ${numbers[2]} ${getRandomOperator(
					level
				)} ${numbers[3]})`
			);
		}
	}

	// ตรวจสอบผลลัพธ์ที่ได้
	console.log("Generated expressions:", expressions);

	for (const expr of expressions) {
		try {
			const result = evaluate(expr);

			// ตรวจสอบการหารที่เป็นจำนวนเต็ม
			if (expr.includes("/")) {
				const parts = expr.split(" ");
				for (let i = 0; i < parts.length; i++) {
					if (parts[i] === "/") {
						const a = evaluate(parts.slice(0, i).join(" "));
						const b = parseInt(parts[i + 1], 10);
						if (!isIntegerDivision(a, b)) {
							return null; // ถ้าไม่เป็นจำนวนเต็ม ให้คืนค่า null
						}
					}
				}
			}

			// ตรวจสอบผลลัพธ์
			if (isInteger(result)) {
				if (level === "easy" && result === 24) {
					return { expression: expr, result };
				} else if (level === "medium" && result >= 100 && result <= 1000) {
					return { expression: expr, result };
				} else if (
					level === "hard" &&
					((result >= -1000 && result <= -100) ||
						(result >= 100 && result <= 1000))
				) {
					return { expression: expr, result };
				}
			}
		} catch (e) {
			continue;
		}
	}

	return null;
};

// ฟังก์ชันตรวจสอบความถูกต้องของสมการ
const isValidExpression = (
	userInput: string,
	numbers: number[],
	level: "easy" | "medium" | "hard"
): boolean => {
	const numberCount = new Map<number, number>();

	// Set of allowed operators based on level
	const allowedOperators: Record<"easy" | "medium" | "hard", Set<string>> = {
		easy: new Set(["+", "-", "*", "/"]),
		medium: new Set(["+", "-", "*", "/", "^"]),
		hard: new Set(["+", "-", "*", "/", "^", "!"]),
	};

	// Count occurrences of each number
	numbers.forEach((num) => {
		numberCount.set(num, (numberCount.get(num) || 0) + 1);
	});

	const inputNumbers = userInput.match(/\d+/g); // Extract numbers from input
	if (!inputNumbers) return false;

	// Check if all numbers are used correctly
	for (const num of inputNumbers) {
		const number = parseInt(num, 10);
		if (!numberCount.has(number) || numberCount.get(number) === 0) {
			return false; // Number is either not allowed or has been used up
		}
		numberCount.set(number, (numberCount.get(number) as number) - 1);
	}

	// Verify if all numbers have been used exactly once
	if (!Array.from(numberCount.values()).every((count) => count === 0)) {
		return false;
	}

	// Check for valid operators
	const inputOperators = userInput.match(/[+\-*/^!]/g); // Extract operators from input
	if (inputOperators) {
		for (const op of inputOperators) {
			if (!allowedOperators[level].has(op)) {
				return false; // Operator not allowed for the current level
			}
		}
	}

	return true; // If all checks are passed, the expression is valid
};

const Body: React.FC<BodyProps> = ({ level, IsEnd, setIsEnd }) => {
	const router = useRouter();
	const [numbers, setNumbers] = useState<number[]>([]);
	const [target, setTarget] = useState<number>();
	const [input, setInput] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [score, setScore] = useState<number>(0);
	const [timeLeft, setTimeLeft] = useState<number>(60);
	const [start, setStart] = useState<boolean>(false);
	const { User } = useUser();
	const [solution, setSolution] = useState<string>("");

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (start) {
			interval = setInterval(() => {
				setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
			}, 1000);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [start]);

	useEffect(() => {
		// Set initial timeLeft and reset game state based on the level
		switch (level) {
			case "easy":
				setTimeLeft(60);
				break;
			case "medium":
				setTimeLeft(300);
				break;
			case "hard":
				setTimeLeft(600);
				break;
			default:
				setTimeLeft(60);
				break;
		}

		// Reset the game state
		setNumbers([]);
		setTarget(undefined);
		setInput("");
		setMessage("");
		setScore(0);
		setStart(false); // เพิ่มบรรทัดนี้เพื่อหยุดเวลาเมื่อเปลี่ยนโหมด
		setIsEnd(false);
	}, [level, IsEnd, setIsEnd]);

	const newEaxample = () => {
		const generatedNumbers = generateRandomNumbers(level);
		setNumbers(generatedNumbers);
		const generatedExpression = generateExpression(generatedNumbers, level);
		if (generatedExpression) {
			setTarget(generatedExpression.result);
			setSolution(generatedExpression.expression);
		} else {
			newEaxample(); // ป้องกันลูปไม่สิ้นสุดในกรณีที่ไม่สามารถสร้างสมการได้
		}
	};

	const resetGame = () => {
		newEaxample();
		setInput("");
		setMessage("");
		// ตั้งค่าเวลาให้ตรงตามระดับ
		switch (level) {
			case "easy":
				setTimeLeft(60);
				break;
			case "medium":
				setTimeLeft(300);
				break;
			case "hard":
				setTimeLeft(600);
				break;
			default:
				setTimeLeft(60);
				break;
		}
		setScore(0);
		setStart(true);
	};

	useEffect(() => {
		if (timeLeft === 0 && start) {
			toast.error("หมดเวลา! กรุณาลองใหม่อีกครั้ง");
			setStart(false);

			axiosInstance
				.post("/scores24/createAndUpdate", {
					userId: User?._id,
					score: score,
					level: level,
				})
				.then((response) => {
					setIsEnd(true); // เพิ่มบรรทัดนี้เพื่อรีเฟรชหน้าจอ
				})
				.catch((error) => {
					console.error("Error:", error);
					setIsEnd(true);
				});
		}
	}, [timeLeft, start, User?._id, score, level, setIsEnd]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	const checkAnswer = () => {
		if (!isValidExpression(input, numbers, level)) {
			setMessage("กรุณาอ่านกติกา");
			return;
		}

		try {
			const userResult = evaluate(input);
			if (userResult === target) {
				setMessage("+ 5 คะแนน");

				// เพิ่มคะแนน
				setScore(score + 5);

				// สร้างชุดตัวเลขและสมการใหม่
				newEaxample();

				// รีเซ็ตค่าต่างๆ
				setInput("");

				setTimeout(() => {
					setMessage("");
				}, 5000);
			} else {
				setMessage("เฉลย " + solution);

				// กำหนดเวลาในการรอขึ้นอยู่กับระดับความยาก
				let delay;
				switch (level) {
					case "easy":
						delay = 5000; // 5 วินาที
						break;
					case "medium":
						delay = 10000; // 10 วินาที
						break;
					case "hard":
						delay = 15000; // 15 วินาที
						break;
					default:
						delay = 5000; // ค่าเริ่มต้น
				}

				// รอเวลาที่กำหนดแล้วสร้างชุดตัวเลขและสมการใหม่
				setTimeout(() => {
					newEaxample();
					setInput("");
					setMessage("");
				}, delay);
			}
		} catch (error) {
			console.error("Error in checkAnswer:", error);
			setMessage("Invalid input!");
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			checkAnswer();
		}
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<Card>
				<CardHeader>
					<h2 className="text-2xl font-bold text-center">เกม 24</h2>
				</CardHeader>
				<CardContent>
					<div className="flex justify-between mb-4">
						<div className="bg-orange-400 text-white p-2 rounded">
							คะแนน: {score}
						</div>
						<div className="bg-orange-400 text-white p-2 rounded">
							เวลา: {timeLeft} วิ
						</div>
					</div>
					<div className="mb-4">
						<h3 className="font-semibold">ชุดตัวเลข: {numbers.join(", ")}</h3>
						<h3 className="font-semibold">คำตอบ: {target}</h3>
					</div>
					<Input
						type="text"
						value={input}
						onChange={handleChange}
						onKeyPress={handleKeyPress}
						className="w-full mb-4"
						placeholder="วิธีคิด"
					/>
					{message && <p className="text-center mb-4">{message}</p>}
					<Button
						onClick={checkAnswer}
						className="w-full bg-orange-400 hover:bg-orange-500 text-white p-2 rounded"
					>
						ตอบ
					</Button>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button
						onClick={resetGame}
						className="w-5/12 bg-white border border-secondary hover:bg-secondary/20"
					>
						เริ่มเกมใหม่
					</Button>
					<Button
						onClick={() => router.push("/selectgame")}
						className="w-5/12 bg-secondary hover:bg-secondary-hover text-white"
					>
						ออกจากเกม
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default Body;
