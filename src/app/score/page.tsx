"use client";

import React, { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import CategoryBadge from "@/components/ui/badge/CategoryBadge";
import Pagination from "@/components/ui/Pagination";
import TooltipWrapper from "@/components/ui/TooltipWrapper";
import { ArrowUpDown, Edit, Trash } from "lucide-react";

import { AllScore } from "@/types/score";
import { deleteScore, getAllScore, updateScore } from "@/lib/scoreApi";
import { thDateTime } from "@/lib/format";
import Loading from "@/components/ui/Loading";
import ScoreModal from "./components/ScoreModal";

export default function ScorePage() {
	const [data, setData] = useState<AllScore[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const itemsPerPage: number = 10;

	const [action, setAction] = useState<boolean>(false);

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [sortConfig, setSortConfig] = useState<{
		key: keyof AllScore;
		direction: "asc" | "desc";
	} | null>(null);

	const [editingScore, setEditingScore] = useState<AllScore | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
	const [editedScore, setEditedScore] = useState<number>(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
		getScore();
	}, [action]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [currentPage]);

	async function getScore() {
		setIsLoading(true);
		const scoreData = await getAllScore();
		setData(scoreData ?? []);
		setIsLoading(false);
	}

	const filteredData = data.filter((item) =>
		Object.values(item).some((value) =>
			value.toString().toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	const sortedData = React.useMemo(() => {
		let sortableItems = [...filteredData];
		if (sortConfig !== null) {
			sortableItems.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableItems;
	}, [filteredData, sortConfig]);

	const totalPages = Math.ceil(sortedData.length / itemsPerPage);
	const paginatedData = sortedData.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const requestSort = (key: keyof AllScore) => {
		let direction: "asc" | "desc" = "asc";
		if (
			sortConfig &&
			sortConfig.key === key &&
			sortConfig.direction === "asc"
		) {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const handleEdit = (score: AllScore) => {
		setEditingScore(score);
		setEditedScore(score.score);
		setIsEditModalOpen(true);
	};

	const handleUpdateScore = async () => {
		if (editingScore) {
			const updatedScore = {
				score: editedScore,
			};

			try {
				setIsSubmitting(true);
				const message = await updateScore(editingScore._id, updatedScore);
				console.log(message);

				setIsEditModalOpen(false);
				setAction(!action);
				setIsSubmitting(false);
			} catch (error) {
				setIsSubmitting(false);
				console.error("Error updating score:", error);
			}
		}
	};

	async function handleDelete(scoreId: string) {
		const message = await deleteScore(scoreId);
		setAction(!action);
	}

	return (
		<div className="flex flex-col items-center py-10 mt-4 overflow-x-auto">
			<div className="w-11/12">
				{/* Desktop version */}
				<div className="hidden md:block">
					<Table>
						<TableHeader>
							<TableRow>
								<TableCell colSpan={8}>
									<div className="flex justify-between items-center">
										<h2 className="font-bold">สรุปรายการคะแนน</h2>
										<div className="flex gap-4">
											<Input
												className="w-64"
												placeholder="ค้นหา"
												value={searchTerm}
												onChange={(e) => setSearchTerm(e.target.value)}
											/>
										</div>
									</div>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableHead
									onClick={() => requestSort("createOn")}
									className="cursor-pointer text-center w-2/12"
								>
									วันที่เล่น{" "}
									<ArrowUpDown className="inline-block ml-2" size={16} />
								</TableHead>
								<TableHead
									onClick={() => requestSort("name")}
									className="cursor-pointer text-center w-2/12"
								>
									ชื่อผู้ใช้{" "}
									<ArrowUpDown className="inline-block ml-2" size={16} />
								</TableHead>
								<TableHead
									onClick={() => requestSort("category")}
									className="cursor-pointer text-center w-1/12"
								>
									หมวดหมู่{" "}
									<ArrowUpDown className="inline-block ml-2" size={16} />
								</TableHead>
								<TableHead
									onClick={() => requestSort("topic")}
									className="cursor-pointer text-center w-2/12"
								>
									หัวข้อ <ArrowUpDown className="inline-block ml-2" size={16} />
								</TableHead>
								<TableHead
									onClick={() => requestSort("subtopic")}
									className="cursor-pointer text-center w-2/12"
								>
									หัวข้อย่อย{" "}
									<ArrowUpDown className="inline-block ml-2" size={16} />
								</TableHead>
								<TableHead
									onClick={() => requestSort("score")}
									className="cursor-pointer text-center w-1/12"
								>
									คะแนน <ArrowUpDown className="inline-block ml-2" size={16} />
								</TableHead>
								<TableHead className="text-center w-2/12">ตัวเลือก</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={8}>
										<Loading />
									</TableCell>
								</TableRow>
							) : sortedData.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8}>
										<h2>ไม่พบข้อมูลคะแนน</h2>
									</TableCell>
								</TableRow>
							) : (
								paginatedData.map((item) => (
									<TableRow key={item._id}>
										<TableCell>
											<div className="font-medium">
												{thDateTime(item.createOn).split(" ")[0]}
											</div>
											<div className="text-sm text-gray-500">
												{thDateTime(item.createOn).split(" ")[1]}
											</div>
										</TableCell>
										<TableCell className="text-center">
											<div className="font-medium">{item.name}</div>
											<div className="text-sm text-gray-500">
												{item.username}
											</div>
										</TableCell>
										<TableCell>
											<CategoryBadge category={item.category} />
										</TableCell>
										<TableCell>{item.topic}</TableCell>
										<TableCell>{item.subtopic}</TableCell>
										<TableCell className="text-center">{item.score}</TableCell>
										<TableCell className="text-center">
											<TooltipWrapper content="แก้ไขคะแนน">
												<div
													role="button"
													onClick={() => handleEdit(item)}
													className="mr-2 cursor-pointer inline-flex items-center rounded-md p-2 hover:bg-primary-hover"
												>
													<Edit className="inline-block" size={16} />
												</div>
											</TooltipWrapper>
											<TooltipWrapper content="ลบคะแนน">
												<div
													role="button"
													onClick={() => handleDelete(item._id)}
													className="mr-2 cursor-pointer inline-flex items-center rounded-md p-2 hover:bg-red-400"
												>
													<Trash className="inline-block" size={16} />
												</div>
											</TooltipWrapper>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
						{sortedData.length > 0 && (
							<TableFooter>
								<TableRow>
									<TableCell colSpan={8}>
										<Pagination
											currentPage={currentPage}
											totalPages={totalPages}
											onPageChange={setCurrentPage}
											itemsPerPage={itemsPerPage}
											totalItems={sortedData.length}
										/>
									</TableCell>
								</TableRow>
							</TableFooter>
						)}
					</Table>
				</div>

				{/* Mobile/Tablet version */}
				<div className="md:hidden">
					<div className="fixed top-0 left-0 right-0 bg-primary  z-10 p-4 shadow-md pt-10">
						<h2 className="font-bold my-4">จัดการคะแนน</h2>
						<input
							type="text"
							placeholder="ค้นหา..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full p-2 border rounded"
						/>
					</div>

					<div className="mt-20 pt-10">
						{" "}
						{isLoading ? (
							<Loading />
						) : sortedData.length === 0 ? (
							<h2>ไม่พบข้อมูลคะแนน</h2>
						) : (
							<>
								{paginatedData.map((item) => (
									<div
										key={item._id}
										className="bg-white p-4 rounded-lg shadow mb-4"
									>
										<div className="flex justify-between items-center mb-2">
											<div>
												<div className="font-medium">{item.name}</div>
												<div className="text-sm text-gray-500">
													{item.username}
												</div>
											</div>
											<CategoryBadge category={item.category} />
										</div>
										<div className="mb-2">
											<div>{item.topic}</div>
											<div className="text-sm text-gray-500">
												{item.subtopic}
											</div>
										</div>
										<div className="flex justify-between items-center">
											<div>
												<div className="font-medium">คะแนน: {item.score}</div>
												<div className="text-sm text-gray-500">
													{thDateTime(item.createOn)}
												</div>
											</div>
											<div>
												<TooltipWrapper content="แก้ไขคะแนน">
													<div
														role="button"
														onClick={() => handleEdit(item)}
														className="mr-2 cursor-pointer inline-flex items-center rounded-md p-2 hover:bg-primary-hover"
													>
														<Edit className="inline-block" size={16} />
													</div>
												</TooltipWrapper>
												<TooltipWrapper content="ลบคะแนน">
													<div
														role="button"
														onClick={() => handleDelete(item._id)}
														className="cursor-pointer inline-flex items-center rounded-md p-2 hover:bg-red-400"
													>
														<Trash className="inline-block" size={16} />
													</div>
												</TooltipWrapper>
											</div>
										</div>
									</div>
								))}

								{sortedData.length > 0 && (
									<div className="mt-4">
										<Pagination
											currentPage={currentPage}
											totalPages={totalPages}
											onPageChange={setCurrentPage}
											itemsPerPage={itemsPerPage}
											totalItems={sortedData.length}
										/>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
			<ScoreModal
				isEditModalOpen={isEditModalOpen}
				setIsEditModalOpen={setIsEditModalOpen}
				handleUpdateScore={handleUpdateScore}
				editedScore={editedScore}
				setEditedScore={setEditedScore}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
}
