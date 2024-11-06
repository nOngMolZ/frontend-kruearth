import React, { useState, useEffect } from "react";
import {
	Table,
	TableHead,
	TableBody,
	TableCell,
	TableRow,
	TableFooter,
	TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QuestionAction from "./QuestionAction";
import QuestionModal from "../QuestionTableComponents/QuestionModal";
import { ArrowUpDown, ChevronLeft, Plus } from "lucide-react";
import { QuestionApi } from "@/lib/questionAPI";
import { SubTopicApi } from "@/lib/SubTopicApi";
import { Question, QuestionInput } from "@/types/Question";
import { Subtopic } from "@/types/SubTopic";
import Pagination from "@/components/ui/Pagination";

import { useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading";
import { thDateTime } from "@/lib/format";

interface QuestionFormData {
	_id?: string;
	questionName: string;
	option1: string;
	option2: string;
	option3: string;
	option4: string;
	correctAnswer: string;
	hint: string;
}

interface QuestionManagementProps {
	topicId: string;
	subtopicId: string;
	topicName: string;
	createOn?: string;
}

const QuestionManagement: React.FC<QuestionManagementProps> = ({
	topicId,
	subtopicId,
	topicName,
}) => {
	const router = useRouter();
	const [questions, setQuestions] = useState<Question[]>([]);
	const [subtopic, setSubtopic] = useState<Subtopic | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [isMounted, setIsMounted] = useState(false);
	const itemsPerPage = 10;
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingQuestion, setEditingQuestion] =
		useState<QuestionFormData | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (isMounted) {
			fetchSubtopicAndQuestions();
		}
	}, [subtopicId, isMounted]);

	const fetchSubtopicAndQuestions = async () => {
		try {
			setIsLoading(true);

			const [fetchedSubtopic, fetchedQuestions] = await Promise.all([
				SubTopicApi.getSubtopicById(subtopicId),
				QuestionApi.getQuestionsBySubtopicId(subtopicId),
			]);

			setSubtopic(fetchedSubtopic);
			setQuestions(fetchedQuestions);
			setIsLoading(false);
		} catch (error) {
			console.error("Error fetching subtopic and questions:", error);
		}
	};

	const filteredQuestions = questions.filter((question) =>
		question.questionName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const questionToFormData = (question: Question): QuestionFormData => {
		const options = question.option || [];
		return {
			_id: question._id,
			questionName: question.questionName,
			option1: options[0]?.text || "",
			option2: options[1]?.text || "",
			option3: options[2]?.text || "",
			option4: options[3]?.text || "",
			correctAnswer: options.length
				? options.findIndex((opt) => opt.isCorrect).toString()
				: "",
			hint: question.hint,
		};
	};

	const handleAddQuestion = async (data: QuestionInput) => {
		try {
			await QuestionApi.createQuestion(data);
			await fetchSubtopicAndQuestions();
			setIsAddModalOpen(false);
		} catch (error) {
			console.error("Error adding question:", error);
		}
	};

	const handleEditQuestion = async (data: QuestionInput) => {
		if (!data._id) return;
		try {
			await QuestionApi.updateQuestion(data._id, data);
			await fetchSubtopicAndQuestions();
			setIsEditModalOpen(false);
		} catch (error) {
			console.error("Error editing question:", error);
		}
	};

	const handleDeleteQuestion = async (questionId: string) => {
		try {
			await QuestionApi.deleteQuestion(questionId);
			await fetchSubtopicAndQuestions();
		} catch (error) {
			console.error("Error deleting question:", error);
		}
	};

	const currentQuestions = filteredQuestions.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<div className="flex flex-col items-center py-10">
			{/* Desktop version */}
			<div className="hidden md:block w-11/12">
				<Table>
					<TableHeader>
						<TableRow>
							<TableCell colSpan={3}>
								<div className="flex justify-between items-center">
									{/* Left side content */}
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => router.back()}
											className="p-2 aspect-square rounded-full"
										>
											<ChevronLeft
												strokeWidth={3}
												absoluteStrokeWidth
												className="inline-block"
											/>
										</Button>
										<h2 className="font-bold">
											การจัดการโจทย์: {subtopic?.subtopicName}
										</h2>
									</div>

									{/* Right side content */}
									<div className="flex items-center gap-4">
										<Input
											type="text"
											placeholder="ค้นหาหัวโจทย์"
											value={searchTerm}
											onChange={handleSearch}
										/>
										<Button
											variant="secondary"
											onClick={() => setIsAddModalOpen(true)}
										>
											เพิ่มโจทย์
										</Button>
									</div>
								</div>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableHead className="text-center w-1/5">
								วันที่สร้างโจทย์
							</TableHead>
							<TableHead className="text-center w-3/5">โจทย์</TableHead>
							<TableHead className="text-center w-1/5">ตัวเลือก</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={3}>
									<Loading />
								</TableCell>
							</TableRow>
						) : currentQuestions.length === 0 ? (
							<TableRow>
								<TableCell colSpan={3}>
									<h2>ไม่พบโจทย์ของหัวข้อย่อย{subtopic?.subtopicName}</h2>
								</TableCell>
							</TableRow>
						) : (
							currentQuestions.map((question) => (
								<TableRow key={question._id}>
									<TableCell>
										<div className="font-medium">
											{question.createOn
												? thDateTime(question.createOn).split(" ")[0]
												: "ไม่ระบุวันที่"}
										</div>
										<div className="text-sm text-gray-500">
											{question.createOn
												? thDateTime(question.createOn).split(" ")[1]
												: ""}
										</div>
									</TableCell>
									<TableCell>{question.questionName}</TableCell>
									<TableCell>
										<QuestionAction
											question={question}
											onEdit={() => {
												setEditingQuestion(questionToFormData(question));
												setIsEditModalOpen(true);
											}}
											onDelete={() => handleDeleteQuestion(question._id)}
											isOpen={isEditModalOpen}
											initialData={question}
										/>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>

					{filteredQuestions.length > 0 && (
						<TableFooter>
							<TableRow>
								<TableCell colSpan={3}>
									<Pagination
										currentPage={currentPage}
										totalPages={totalPages}
										onPageChange={handlePageChange}
										itemsPerPage={itemsPerPage}
										totalItems={filteredQuestions.length}
									/>
								</TableCell>
							</TableRow>
						</TableFooter>
					)}
				</Table>
			</div>

			{/* Mobile/Tablet version */}
			<div className="md:hidden w-11/12">
				<div className="fixed top-0 left-0 right-0 bg-primary z-10 p-4 shadow-md pt-10">
					<div className="flex items-center gap-2 mb-4 mt-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => router.back()}
							className="p-2 aspect-square rounded-full"
						>
							<ChevronLeft
								strokeWidth={3}
								absoluteStrokeWidth
								className="inline-block"
							/>
						</Button>
						<h2 className="font-bold">
							การจัดการโจทย์: {subtopic?.subtopicName}
						</h2>
					</div>
					<Input
						type="text"
						placeholder="ค้นหา.."
						value={searchTerm}
						onChange={handleSearch}
						className="w-full p-2 border rounded"
					/>
				</div>

				<div className="mt-40 pt-4">
					{isLoading ? (
						<Loading />
					) : currentQuestions.length === 0 ? (
						<h2>ไม่พบโจทย์ของหัวข้อย่อย{subtopic?.subtopicName}</h2>
					) : (
						<>
							{currentQuestions.map((question) => (
								<div
									key={question._id}
									className="bg-white p-4 rounded-lg shadow mb-4"
								>
									<div className="mb-2">
										<div className="font-medium">{question.questionName}</div>
										<div className="text-sm text-gray-500">
											{question.createOn
												? thDateTime(question.createOn)
												: "ไม่ระบุวันที่"}
										</div>
									</div>
									<div className="flex justify-end">
										<QuestionAction
											question={question}
											onEdit={() => {
												setEditingQuestion(questionToFormData(question));
												setIsEditModalOpen(true);
											}}
											onDelete={() => handleDeleteQuestion(question._id)}
											isOpen={isEditModalOpen}
											initialData={question}
										/>
									</div>
								</div>
							))}
						</>
					)}
					{filteredQuestions.length > 0 && (
						<div className="mt-4">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
								itemsPerPage={itemsPerPage}
								totalItems={filteredQuestions.length}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Floating Action Button for adding questions on mobile */}
			<div className="md:hidden">
				<Button
					className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary-hover"
					onClick={() => setIsAddModalOpen(true)}
				>
					<Plus size={24} />
				</Button>
			</div>

			<QuestionModal
				isOpen={isAddModalOpen}
				setIsOpen={setIsAddModalOpen}
				mode="add"
				onSubmit={handleAddQuestion}
				subtopicId={subtopicId}
				onClose={() => setIsAddModalOpen(false)}
			/>
			{editingQuestion && (
				<QuestionModal
					isOpen={isEditModalOpen}
					setIsOpen={setIsEditModalOpen}
					mode="edit"
					initialData={{
						...editingQuestion,
						option: [
							{
								text: editingQuestion.option1,
								isCorrect: editingQuestion.correctAnswer === "0",
							},
							{
								text: editingQuestion.option2,
								isCorrect: editingQuestion.correctAnswer === "1",
							},
							{
								text: editingQuestion.option3,
								isCorrect: editingQuestion.correctAnswer === "2",
							},
							{
								text: editingQuestion.option4,
								isCorrect: editingQuestion.correctAnswer === "3",
							},
						],
						subtopicId: subtopicId,
					}}
					onSubmit={handleEditQuestion}
					subtopicId={subtopicId}
					onClose={() => setIsEditModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default QuestionManagement;
