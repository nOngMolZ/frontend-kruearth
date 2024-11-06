"use client";

import React, { useState, useEffect } from "react";
import Pagination from "@/components/ui/Pagination";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Edit, Trash, Shield } from "lucide-react";
import ModalUserEdit from "./components/ModalUserEdit";
import ModalUserDelete from "./components/ModalUserDelete";
import axiosInstance from "@/lib/axiosInstance";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Loading from "@/components/ui/Loading";
import { thDateTime } from "@/lib/format";
import TooltipWrapper from "@/components/ui/TooltipWrapper";

interface User {
	_id: string;
	name: string;
	username: string;
	createOn: string;
	isAdmin: boolean;
}

export default function ScorePage() {
	const [data, setData] = useState<User[]>([]);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortConfig, setSortConfig] = useState<{
		key: keyof User;
		direction: "asc" | "desc";
	} | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<User | null>(null);
	const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axiosInstance.get<User[]>("/users");
				setData(response.data);
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleEdit = async (newName: string, isAdmin: boolean) => {
		if (!currentUserId) return;
		setIsSubmitting(true);
		try {
			await axiosInstance.patch(`/users/${currentUserId}`, {
				name: newName,
				isAdmin: isAdmin,
			});
			setData((prevData) =>
				prevData.map((item) =>
					item._id === currentUserId
						? { ...item, name: newName, isAdmin: isAdmin }
						: item
				)
			);
		} catch (error) {
			console.error("Error updating user:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSetAdmin = async (userId: string, isAdmin: boolean) => {
		setIsAdminSubmitting(true);
		try {
			await axiosInstance.patch(`/users/${userId}/set-admin`, { isAdmin });
			setData((prevData) =>
				prevData.map((item) =>
					item._id === userId ? { ...item, isAdmin } : item
				)
			);
		} catch (error) {
			console.error("Error setting user as admin:", error);
		} finally {
			setIsAdminSubmitting(false);
		}
	};

	const handleDelete = async (userId: string) => {
		const userToDelete = data.find((user) => user._id === userId);
		if (userToDelete) {
			setUserToDelete(userToDelete);
			setDeleteModalOpen(true);
		}
	};

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

	const requestSort = (key: keyof User) => {
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

	const openEditModal = (userId: string, name: string) => {
		setCurrentUserId(userId);
		setModalOpen(true);
	};

	const confirmDelete = async () => {
		if (!userToDelete) return;
		setIsDeleteSubmitting(true);
		try {
			await axiosInstance.delete(`/users/${userToDelete._id}`);
			setData((prevData) =>
				prevData.filter((item) => item._id !== userToDelete._id)
			);
		} catch (error) {
			console.error("Error deleting user:", error);
		} finally {
			setIsDeleteSubmitting(false);
			setDeleteModalOpen(false);
			setUserToDelete(null);
		}
	};

	return (
		<div className="flex flex-col items-center py-10">
			<div className="w-11/12">
				{/* Desktop version */}
				<div className="hidden md:block">
					<Table>
						<TableHeader>
							<TableRow>
								<TableCell colSpan={4}>
									<div className="flex justify-between items-center">
										<h2 className="font-bold">จัดการผู้ใช้งาน</h2>
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
									className="cursor-pointer text-center w-1/5"
								>
									วันที่สร้าง{" "}
									<ArrowUpDown className="inline-block ml-2" size={16} />
								</TableHead>
								<TableHead
									onClick={() => requestSort("name")}
									className="cursor-pointer text-center w-1/5"
								>
									ชื่อ <ArrowUpDown className="inline-block ml-2" size={16} />
								</TableHead>
								<TableHead
									onClick={() => requestSort("username")}
									className="cursor-pointer text-center w-1/5"
								>
									ชื่อผู้ใช้{" "}
									<ArrowUpDown className="inline-block ml-2" size={16} />
								</TableHead>
								<TableHead className="text-center w-1/5">สถานะ</TableHead>
								<TableHead className="text-center w-1/5">ตัวเลือก</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={5}>
										<Loading />
									</TableCell>
								</TableRow>
							) : sortedData.length === 0 ? (
								<TableRow>
									<TableCell colSpan={4}>
										<h2>ไม่พบข้อมูลผู้ใช้</h2>
									</TableCell>
								</TableRow>
							) : (
								paginatedData.map((item) => (
									<TableRow key={item._id}>
										<TableCell className="text-center">
											<div className="font-medium">
												{thDateTime(item.createOn).split(" ")[0]}
											</div>
											<div className="text-sm text-gray-500">
												{thDateTime(item.createOn).split(" ")[1]}
											</div>
										</TableCell>
										<TableCell className="text-center">{item.name}</TableCell>
										<TableCell className="text-center">
											{item.username}
										</TableCell>
										<TableCell className="text-center">
											<span
												className={`px-2 py-1 rounded-full text-lg font-semibold ${
													item.isAdmin
														? "bg-green-100 text-green-800"
														: "bg-yellow-100 text-yellow-800"
												}`}
											>
												{item.isAdmin ? "แอดมิน" : "ผู้ใช้"}
											</span>
										</TableCell>

										<TableCell className="text-center">
											<TooltipWrapper content="แก้ไขผู้ใช้">
												<div
													role="button"
													aria-label="แก้ไขผู้ใช้"
													tabIndex={0}
													onClick={() => openEditModal(item._id, item.name)}
													className="mr-2 cursor-pointer inline-flex items-center rounded-md p-2 hover:bg-primary-hover"
												>
													<Edit className="inline-block" size={16} />
												</div>
											</TooltipWrapper>
											<TooltipWrapper
												content={
													item.isAdmin ? "ยกเลิกสิทธิ์แอดมิน" : "ตั้งเป็นแอดมิน"
												}
											>
												<div
													role="button"
													className={`mr-2 cursor-pointer inline-flex items-center rounded-md p-2 ${
														item.isAdmin
															? "hover:bg-yellow-400"
															: "hover:bg-green-400"
													}`}
													onClick={() =>
														handleSetAdmin(item._id, !item.isAdmin)
													}
												>
													<Shield className="inline-block" size={16} />
												</div>
											</TooltipWrapper>
											<TooltipWrapper content="ลบผู้ใช้">
												<div
													role="button"
													className="mr-2 cursor-pointer inline-flex items-center rounded-md p-2 hover:bg-red-400"
													onClick={() => handleDelete(item._id)}
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
									<TableCell colSpan={4}>
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
					<h2 className="font-bold mt-4 mb-4">จัดการผู้ใช้งาน</h2>
					<Input
						className="w-full mb-4"
						placeholder="ค้นหา"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					{isLoading ? (
						<Loading />
					) : sortedData.length === 0 ? (
						<h2>ไม่พบข้อมูลผู้ใช้</h2>
					) : (
						paginatedData.map((item) => (
							<div
								key={item._id}
								className="bg-white p-4 rounded-lg shadow mb-4"
							>
								<div className="flex justify-between items-center mb-2">
									<div>
										<div className="font-medium">{item.name}</div>
										<div className="text-sm text-gray-500">{item.username}</div>
										<span
											className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-semibold ${
												item.isAdmin
													? "bg-green-100 text-green-800"
													: "bg-yellow-100 text-yellow-800"
											}`}
										>
											{item.isAdmin ? "แอดมิน" : "ผู้ใช้"}
										</span>
									</div>
									<div className="text-sm text-gray-500">
										{thDateTime(item.createOn)}
									</div>
								</div>

								<div className="flex justify-end">
									<TooltipWrapper content="แก้ไขผู้ใช้">
										<div
											role="button"
											aria-label="แก้ไขผู้ใช้"
											tabIndex={0}
											onClick={() => openEditModal(item._id, item.name)}
											className="mr-2 cursor-pointer inline-flex items-center rounded-md p-2 hover:bg-primary-hover"
										>
											<Edit className="inline-block" size={16} />
										</div>
									</TooltipWrapper>
									<TooltipWrapper
										content={
											item.isAdmin ? "ยกเลิกสิทธิ์แอดมิน" : "ตั้งเป็นแอดมิน"
										}
									>
										<div
											role="button"
											className={`mr-2 cursor-pointer inline-flex items-center rounded-md p-2 ${
												item.isAdmin
													? "bg-green-400 hover:bg-green-500"
													: "hover:bg-green-400"
											}`}
											onClick={() => handleSetAdmin(item._id, !item.isAdmin)}
										>
											<Shield
												className={`inline-block ${
													item.isAdmin ? "text-white" : ""
												}`}
												size={16}
											/>
										</div>
									</TooltipWrapper>
									<TooltipWrapper content="ลบผู้ใช้">
										<div
											role="button"
											className="cursor-pointer inline-flex items-center rounded-md p-2 hover:bg-red-400"
											onClick={() => handleDelete(item._id)}
										>
											<Trash className="inline-block" size={16} />
										</div>
									</TooltipWrapper>
								</div>
							</div>
						))
					)}
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
				</div>
			</div>

			<ModalUserEdit
				isOpen={modalOpen}
				setIsOpen={setModalOpen}
				onSubmit={handleEdit}
				initialIsAdmin={
					data.find((user) => user._id === currentUserId)?.isAdmin || false
				}
				initialName={
					data.find((user) => user._id === currentUserId)?.name || ""
				}
				isSubmitting={isSubmitting}
			/>
			<ModalUserDelete
				isOpen={deleteModalOpen}
				setIsOpen={setDeleteModalOpen}
				onConfirm={confirmDelete}
				userName={userToDelete?.name || ""}
				isSubmitting={isDeleteSubmitting}
			/>
		</div>
	);
}
