import React, { useState } from "react";
import {
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TableFooter,
	TableHeader,
} from "@/components/ui/table";

import { Topic, TopicInput } from "@/types/Topic";
import Pagination from "@/components/ui/Pagination";
import CategoryBadge from "@/components/ui/badge/CategoryBadge";
import TableActions from "@/app/topic/tableComponents/TableActions";
import ModalTopicForm from "./ModalTopicForm";
import { useTopicManagement } from "@/hooks/useTopicManagement";
import Loading from "@/components/ui/Loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const TopicManagementPage: React.FC = () => {
	const { topics, isLoading, error, createTopic, updateTopic, deleteTopic } =
		useTopicManagement();
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const itemsPerPage = 10;

	const handleTopicSubmit = async (data: TopicInput) => {
		setIsSubmitting(true);
		try {
			if (selectedTopic) {
				await updateTopic(selectedTopic._id, data);
			} else {
				await createTopic(data);
			}
			setIsModalOpen(false);
			setSelectedTopic(null);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteTopic = async (id: string) => {
		setIsDeleting(true);
		try {
			await deleteTopic(id);
		} finally {
			setIsDeleting(false);
		}
	};

	const openModal = (topic?: Topic) => {
		setSelectedTopic(topic || null);
		setIsModalOpen(true);
	};

	const filteredTopics = topics.filter(
		(topic) =>
			topic.topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			topic.category.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);
	const paginatedData = filteredTopics.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="flex flex-col items-center py-10 px-4 md:px-0">
			{/* Container ของ Table */}
			<div className="w-full md:w-11/12">
				<div className="hidden md:block">
					<Table>
						<TableHeader>
							<TableRow>
								<TableCell colSpan={3}>
									<div className="flex justify-between items-center">
										<h2 className="font-bold">จัดการหัวข้อ</h2>
										<div className="flex gap-4">
											<Input
												className="w-64"
												placeholder="ค้นหา"
												value={searchTerm}
												onChange={(e) => setSearchTerm(e.target.value)}
											/>
											<div
												className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary-hover h-10 px-4 py-2"
												onClick={() => openModal()}
											>
												เพิ่มหัวข้อ
											</div>
										</div>
									</div>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableHead className="text-center w-1/3">หัวข้อ</TableHead>
								<TableHead className="text-center w-1/3">หมวดหมู่</TableHead>
								<TableHead className="text-center w-1/3">ตัวเลือก</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={3}>
										<Loading />
									</TableCell>
								</TableRow>
							) : filteredTopics.length === 0 ? (
								<TableRow>
									<TableCell colSpan={3}>
										<h2>ไม่พบข้อมูลหัวข้อ</h2>
									</TableCell>
								</TableRow>
							) : (
								paginatedData.map((topic) => (
									<TableRow key={topic._id}>
										<TableCell>{topic.topicName}</TableCell>
										<TableCell>
											<CategoryBadge category={topic.category} />
										</TableCell>
										<TableCell>
											<TableActions
												topicId={topic._id}
												onEdit={() => openModal(topic)}
												onDelete={() => handleDeleteTopic(topic._id)}
												isDeleting={isDeleting}
												topicName={""}
												category={""}
											/>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>

						{filteredTopics.length > 0 && (
							<TableFooter>
								<TableRow>
									<TableCell colSpan={3}>
										<Pagination
											currentPage={currentPage}
											totalPages={totalPages}
											onPageChange={setCurrentPage}
											itemsPerPage={itemsPerPage}
											totalItems={filteredTopics.length}
										/>
									</TableCell>
								</TableRow>
							</TableFooter>
						)}
					</Table>
				</div>
			</div>

			{/* Mobile/Tablet version */}
			<div className="md:hidden w-11/12">
				<div className="fixed top-0 left-0 right-0 bg-primary  z-10 p-4 shadow-md pt-10">
					<h2 className="font-bold mb-4 mt-4">จัดการหัวข้อ</h2>
					<input
						type="text"
						placeholder="ค้นหา..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full p-2 border rounded"
					/>
				</div>

				<div className="mt-28 pt-12 ">
					{" "}
					{/* เพิ่ม margin-top ให้ไม่ชน search bar */}
					{isLoading ? (
						<Loading />
					) : filteredTopics.length === 0 ? (
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
											<div className="font-medium">{item.topicName}</div>
											<CategoryBadge category={item.category} />
										</div>
									</div>
									<div className="flex justify-end">
										<TableActions
											topicId={item._id}
											topicName={item.topicName}
											category={item.category}
											onEdit={() => openModal(item)}
											onDelete={() => handleDeleteTopic(item._id)}
											isDeleting={isDeleting}
										/>
									</div>
								</div>
							))}
						</>
					)}
					{filteredTopics.length > 0 && (
						<div className="mt-4">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
								itemsPerPage={itemsPerPage}
								totalItems={filteredTopics.length}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Floating Action Button and Modal */}
			<div className="w-full px-4">
				<Button
					className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary-hover md:hidden"
					onClick={() => openModal()}
				>
					<Plus size={24} />
				</Button>

				<ModalTopicForm
					isOpen={isModalOpen}
					setIsOpen={setIsModalOpen}
					onSubmit={handleTopicSubmit}
					initialData={selectedTopic || undefined}
					isSubmitting={isSubmitting}
				/>
			</div>
		</div>
	);
};

export default TopicManagementPage;
