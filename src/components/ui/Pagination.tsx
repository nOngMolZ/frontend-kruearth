"use client";
// Pagination.tsx
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	itemsPerPage: number;
	totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
	itemsPerPage,
	totalItems,
}) => {
	const renderPaginationButtons = () => {
		const buttons = [];
		const maxVisibleButtons = 5;
		let startPage, endPage;

		if (totalPages <= maxVisibleButtons) {
			startPage = 1;
			endPage = totalPages;
		} else {
			if (currentPage <= Math.floor(maxVisibleButtons / 2) + 1) {
				startPage = 1;
				endPage = maxVisibleButtons;
			} else if (
				currentPage + Math.floor(maxVisibleButtons / 2) >=
				totalPages
			) {
				startPage = totalPages - maxVisibleButtons + 1;
				endPage = totalPages;
			} else {
				startPage = currentPage - Math.floor(maxVisibleButtons / 2);
				endPage = currentPage + Math.floor(maxVisibleButtons / 2);
			}
		}

		if (startPage > 1) {
			buttons.push(
				<Button
					key="start-ellipsis"
					variant="default"
					className="hover:bg-accent"
					size="icon"
					onClick={() => onPageChange(1)}
				>
					1
				</Button>
			);
			if (startPage > 2) {
				buttons.push(
					<Button key="ellipsis-start" variant="ghost" size="icon" disabled>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				);
			}
		}

		for (let i = startPage; i <= endPage; i++) {
			buttons.push(
				<Button
					key={i}
					variant={currentPage === i ? "secondary" : "default"}
					className={
						currentPage === i ? "hover:bg-secondary-hover" : "hover:bg-accent"
					}
					onClick={() => onPageChange(i)}
				>
					{i}
				</Button>
			);
		}

		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				buttons.push(
					<Button key="ellipsis-end" variant="ghost" size="icon" disabled>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				);
			}
			buttons.push(
				<Button
					key="end-ellipsis"
					variant="default"
					className="hover:bg-accent"
					size="icon"
					onClick={() => onPageChange(totalPages)}
				>
					{totalPages}
				</Button>
			);
		}

		return buttons;
	};

	return (
		<div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
			<div className="hidden md:block text-sm text-gray-700 order-1 md:order-none">
				แสดง {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} ถึง{" "}
				{Math.min(currentPage * itemsPerPage, totalItems)} จาก {totalItems}{" "}
				รายการ
			</div>
			<div className="flex items-center space-x-2 order-2 md:order-none">
				<Button
					variant="outline"
					size="icon"
					onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
					disabled={totalItems === 0 || currentPage === 1}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				{renderPaginationButtons()}
				<Button
					variant="outline"
					size="icon"
					onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
					disabled={totalItems === 0 || currentPage === totalPages}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
			<div className="md:hidden text-sm text-gray-700 text-center w-full order-3 md:order-none">
				แสดง {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} ถึง{" "}
				{Math.min(currentPage * itemsPerPage, totalItems)} จาก {totalItems}{" "}
				รายการ
			</div>
		</div>
	);
};

export default Pagination;
