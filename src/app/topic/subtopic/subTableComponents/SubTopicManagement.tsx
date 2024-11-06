// src/app/topic/subtopic/subTableComponents/SubTopicManagement.tsx

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
import { ArrowUpDown, ChevronLeft, Plus } from "lucide-react";
import SubTableAction from "@/app/topic/subtopic/subTableComponents/SubTableActions";
import { ModalSubTopic } from "@/app/topic/subtopic/subTableComponents/ModalSubTopic";
import { SubTopicApi } from "@/lib/SubTopicApi";
import { TopicApi } from "@/lib/TopicApi";
import { Subtopic, SubtopicInput } from "@/types/SubTopic";
import { Topic } from "@/types/Topic";
import Pagination from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading";

interface SubtopicManagementProps {
	topicId: string;
}

const SubtopicManagementPage: React.FC<SubtopicManagementProps> = ({
	topicId,
}) => {
	const router = useRouter();
	const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
	const [topic, setTopic] = useState<Topic | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [sortConfig, setSortConfig] = useState<{
		key: keyof Subtopic;
		direction: "asc" | "desc";
	} | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [isMounted, setIsMounted] = useState(false);
	const itemsPerPage = 10;
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingSubtopic, setEditingSubtopic] = useState<Subtopic | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	useEffect(() => {
		window.scrollTo(0, 0);
		setIsMounted(true);
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);
		if (isMounted) {
			fetchTopicAndSubtopics();
		}
	}, [topicId, isMounted]);

	const fetchTopicAndSubtopics = async () => {
		try {
			setIsLoading(true);
			const [fetchedTopic, fetchedSubtopics] = await Promise.all([
				TopicApi.getTopicById(topicId),
				SubTopicApi.getAllSubtopicsByTopicId(topicId),
			]);
			setTopic(fetchedTopic);
			setSubtopics(fetchedSubtopics);
			setIsLoading(false);
		} catch (error) {
			console.error("Error fetching topic and subtopics:", error);
		}
	};

	const requestSort = (key: keyof Subtopic) => {
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

	const sortedSubtopics = React.useMemo(() => {
		let sortableSubtopics = [...subtopics];
		if (sortConfig !== null) {
			sortableSubtopics.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableSubtopics;
	}, [subtopics, sortConfig]);

	const filteredSubtopics = sortedSubtopics.filter((subtopic) =>
		subtopic.subtopicName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handleAddSubtopic = async (subtopicInput: SubtopicInput) => {
		try {
			setIsSubmitting(true);
			const result = await SubTopicApi.createSubtopic({
				...subtopicInput,
				topicId: topicId, // Ensure topicId is always set
				_id: "", // Set to empty string for new subtopics
			});

			await fetchTopicAndSubtopics();
			setIsSubmitting(false);
		} catch (error) {
			setIsSubmitting(false);
			console.error("Error adding subtopic:", error);
		}
	};

	const handleEditSubtopic = async (subtopicInput: SubtopicInput) => {
		try {
			setIsSubmitting(true);
			await SubTopicApi.updateSubtopic(subtopicInput._id, subtopicInput);
			await fetchTopicAndSubtopics();
			setIsSubmitting(false);
		} catch (error) {
			setIsSubmitting(false);
			console.error("Error editing subtopic:", error);
		}
	};

	const handleDeleteSubtopic = async (subtopicId: string) => {
		try {
			await SubTopicApi.deleteSubtopic(subtopicId);
			await fetchTopicAndSubtopics();
		} catch (error) {
			console.error("Error deleting subtopic:", error);
		}
	};

	const currentSubtopics = filteredSubtopics.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const totalPages = Math.ceil(filteredSubtopics.length / itemsPerPage);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<div className="flex flex-col items-center py-10 px-4 md:px-0">
			<div className="w-full md:w-11/12">
				{/* Desktop View */}
				<div className="hidden md:block">
					<Table>
						<TableHeader>
							<TableRow>
								<TableCell colSpan={3}>
									<div className="flex justify-between items-center">
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
												การจัดการหัวข้อย่อย: {topic?.topicName}
											</h2>
										</div>
										<div className="flex items-center gap-4">
											<Input
												type="text"
												placeholder="ค้นหาหัวข้อย่อย"
												value={searchTerm}
												onChange={handleSearch}
											/>
											<Button
												variant="secondary"
												onClick={() => setIsAddModalOpen(true)}
											>
												เพิ่มหัวข้อย่อย
											</Button>
										</div>
									</div>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableHead className="text-center w-3/6">
									ชื่อหัวข้อย่อย
								</TableHead>
								<TableHead
									onClick={() => requestSort("time")}
									className="cursor-pointer text-center w-1/6"
								>
									เวลา (นาที){" "}
									<ArrowUpDown className="inline-block ml-2" size={16} />
								</TableHead>
								<TableHead className="text-center w-2/6">ตัวเลือก</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={3}>
										<Loading />
									</TableCell>
								</TableRow>
							) : currentSubtopics.length === 0 ? (
								<TableRow>
									<TableCell colSpan={3}>
										<h2>ไม่พบข้อมูลหัวข้อย่อยของหัวข้อ{topic?.topicName}</h2>
									</TableCell>
								</TableRow>
							) : (
								currentSubtopics.map((subtopic) => (
									<TableRow key={subtopic._id}>
										<TableCell>{subtopic.subtopicName}</TableCell>
										<TableCell>{subtopic.time / 60000} นาที</TableCell>
										<TableCell>
											<SubTableAction
												subtopicId={subtopic._id}
												onEdit={() => {
													setEditingSubtopic(subtopic);
													setIsEditModalOpen(true);
												}}
												onDelete={() => handleDeleteSubtopic(subtopic._id)}
												initialData={subtopic}
												subtopicName={""}
												isDeleting={false}
											/>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>

						{filteredSubtopics.length > 0 && (
							<TableFooter>
								<TableRow>
									<TableCell colSpan={3}>
										<Pagination
											currentPage={currentPage}
											totalPages={totalPages}
											onPageChange={handlePageChange}
											itemsPerPage={itemsPerPage}
											totalItems={filteredSubtopics.length}
										/>
									</TableCell>
								</TableRow>
							</TableFooter>
						)}
					</Table>
				</div>

				{/* Mobile View */}
				<div className="md:hidden ">
					<div className="fixed top-0 left-0 right-0 bg-primary  z-10 p-4 shadow-md pt-10 ">
						<div className="flex items-center gap-2 mb-4 mt-4 ">
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
								การจัดการหัวข้อย่อย: {topic?.topicName}
							</h2>
						</div>

						<div className="top-0 left-0 right-0 bg-primary  z-10  ">
							<input
								type="text"
								placeholder="ค้นหา..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full p-2 border rounded"
							/>
						</div>
					</div>
					<div className="mt-40 pt-4 ">
						{" "}
						{/* เพิ่ม margin-top ให้ไม่ชน search bar */}
						{isLoading ? (
							<Loading />
						) : currentSubtopics.length === 0 ? (
							<h2>ไม่พบข้อมูลหัวข้อย่อยของหัวข้อ{topic?.topicName}</h2>
						) : (
							currentSubtopics.map((subtopic) => (
								<div
									key={subtopic._id}
									className="bg-white p-4 rounded-lg shadow mb-4"
								>
									<div className="flex justify-between items-center mb-2">
										<div>
											<div className="font-medium">{subtopic.subtopicName}</div>
											<div className="text-sm text-gray-500">
												{subtopic.time / 60000} นาที
											</div>
										</div>
									</div>
									<div className="flex justify-end">
										<SubTableAction
											subtopicId={subtopic._id}
											onEdit={() => {
												setEditingSubtopic(subtopic);
												setIsEditModalOpen(true);
											}}
											onDelete={() => handleDeleteSubtopic(subtopic._id)}
											initialData={subtopic}
											subtopicName={""}
											isDeleting={false}
										/>
									</div>
								</div>
							))
						)}
						{filteredSubtopics.length > 0 && (
							<div className="mt-4">
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={handlePageChange}
									itemsPerPage={itemsPerPage}
									totalItems={filteredSubtopics.length}
								/>
							</div>
						)}
					</div>
				</div>

				{/* Floating Action Button for Mobile */}
				<div className="md:hidden">
					<Button
						className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary-hover"
						onClick={() => setIsAddModalOpen(true)}
					>
						<Plus size={24} />
					</Button>
				</div>

				{/* Modals */}
				<ModalSubTopic
					isOpen={isAddModalOpen}
					setIsOpen={setIsAddModalOpen}
					mode="add"
					initialData={{ topicId: topicId }}
					onSubmit={handleAddSubtopic}
					isSubmitting={isSubmitting}
				/>
				{editingSubtopic && (
					<ModalSubTopic
						isOpen={isEditModalOpen}
						setIsOpen={setIsEditModalOpen}
						mode="edit"
						initialData={editingSubtopic}
						onSubmit={handleEditSubtopic}
						isSubmitting={isSubmitting}
					/>
				)}
			</div>
		</div>
	);
};

export default SubtopicManagementPage;
