"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import GameNav from "../components/GameNav";
import Game from "../components/Game";
import Leaderboard from "../components/Leaderboard";
import ModalTimeout from "../components/ModalTimeout";
import ModalExit from "../components/ModalExit";
import { createScore } from "@/lib/scoreApi";
import { Subtopic } from "@/types/SubTopic";
import { ScoreInput } from "@/types/score";
import { Question } from "@/types/Question";
import { SubTopicApi } from "@/lib/SubTopicApi";
import { QuestionApi } from "@/lib/questionAPI";
import { useUser } from "@/context/userContext";
import numberCrunching from "../utils/numberCrunching";

interface Props {
	params: {
		subtopicId: string;
	};
}

export default function GamePage({ params }: Props) {
	const router = useRouter();
	const { subtopicId } = params;
	const { User } = useUser();

	const [reload, setReload] = useState<boolean>(false);
	const [time, setTime] = useState<number>(30000);
	const [start, setStart] = useState<boolean>(false);
	const [showTimeout, setShowTimeout] = useState<boolean>(false);
	const [showExit, setShowExit] = useState<boolean>(false);
	const [subtopic, setSubtopic] = useState<Subtopic>({
		_id: "",
		subtopicName: "",
		time: 30000,
		category: "",
		topicId: "",
		topicName: "",
	});
	const [questionList, setQuestionList] = useState<Question[]>([]);
	const [countHint, setCountHint] = useState<number>(1);
	const [countQuestion, setCountQuestion] = useState<number>(0);
	const [score, setScore] = useState<number>(0);
	const [scoreData, setScoreData] = useState<ScoreInput>({
		userId: "", // เริ่มต้นเป็นค่าว่างเพื่อป้องกันปัญหา
		subtopicId: subtopicId,
		score: 0,
		timeSpent: 0,
	});

	useEffect(() => {
		getSubtopic(subtopicId);
		getQuestion(subtopicId);

		const timeoutId = setTimeout(() => {
			setStart(true);
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		// ตรวจสอบว่า User มีค่า _id หรือไม่ก่อนทำการอัพเดท scoreData
		if (User?._id) {
			setScoreData((prevData) => ({
				...prevData,
				userId: User._id, // ใช้ค่า _id ตรง ๆ โดยไม่ต้องใช้ `${}`
				score: score,
				timeSpent: subtopic.time - time,
			}));
		}

		if (
			time === 0 ||
			(subtopicId !== "66f54da5b7e39f5480d16cce" &&
				questionList.length === 0 &&
				(score > 0 || countQuestion > 0))
		) {
			setShowTimeout(true);
		}

		if ((time === 0 || questionList.length === 0) && score !== 0) {
			// ตรวจสอบว่า User มีค่า _id ก่อนส่ง scoreData
			if (User?._id) {
				const updatedData = {
					...scoreData,
					userId: User._id, // ใช้ค่า _id ตรง ๆ
					score: score,
					timeSpent: subtopic.time - time,
				};
				saveScore(updatedData);
			}
		}

		if (!start || time <= 0) return;
		if (showExit === true) return;

		const intervalId = setInterval(() => {
			setTime((prevSeconds) => prevSeconds - 1000);
		}, 1000);

		return () => clearInterval(intervalId);
	}, [start, time, showExit, questionList.length, score, User?._id]);

	async function getSubtopic(id: string) {
		try {
			const getSubtopic = await SubTopicApi.getSubtopicById(id);
			setSubtopic(getSubtopic);
			setTime(getSubtopic.time);
		} catch (error) {
			console.error("Failed to get Subtopic:", error);
		}
	}

	async function getQuestion(id: string) {
		try {
			if (id === "66f54da5b7e39f5480d16cce") {
				setQuestionList((prevList: Question[]) => {
					const newList = [...prevList];
					newList.push(numberCrunching());
					return newList;
				});
			} else {
				const getQuestion = await QuestionApi.getQuestionsBySubtopicId(id);
				setQuestionList(getQuestion);
			}
		} catch (error) {
			console.error("Failed to get Question:", error);
		}
	}

	async function saveScore(data: ScoreInput) {
		if (!data.userId || data.userId === "") {
			console.error("User ID is missing, score will not be saved.");
			return;
		}
		await createScore(data);
	}

	function handleRestart(): void {
		setCountQuestion(0);
		setTime(subtopic?.time || 30000);
		setShowTimeout(false);
		setShowExit(false);
		setReload(!reload);
		setScore(0);
		setCountHint(1);
		getQuestion(subtopicId);
	}

	function handleExit(): void {
		router.push("/selectgame");
	}

	return (
		<>
			<GameNav time={time} score={score} />

			<div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start mt-14 py-8 px-4 sm:px-8 h-[calc(100vh-56px)] overflow-y-auto">
				<Game
					time={time}
					setTime={setTime}
					subtopic={subtopic}
					score={score}
					setScore={setScore}
					questionList={questionList}
					setQuestionList={setQuestionList}
					setShowExit={setShowExit}
					handleRestart={handleRestart}
					reload={reload}
					setReload={setReload}
					countHint={countHint}
					setCountHint={setCountHint}
					setCountQuestion={setCountQuestion}
				/>
				<Leaderboard subtopicId={subtopicId} reload={reload} />
			</div>

			<ModalTimeout
				score={score}
				showTimeout={showTimeout}
				handleRestart={handleRestart}
				handleExit={handleExit}
			/>
			<ModalExit
				showExit={showExit}
				setShowExit={setShowExit}
				handleExit={handleExit}
			/>
		</>
	);
}
