import React from "react";
import { LibraryBigIcon, Edit, Trash } from "lucide-react";
import TooltipWrapper from "@/components/ui/TooltipWrapper";
import { useRouter } from "next/navigation";

interface TableActionsProps {
	topicId: string;
	topicName: string;
	category: string;
	onEdit: () => void;
	onDelete: () => void;
	isDeleting: boolean;
}

const TableActions: React.FC<TableActionsProps> = ({
	topicId,
	topicName,
	category,
	onDelete,
	onEdit,
	isDeleting,
}) => {
	const router = useRouter();

	const navigateToSubtopic = () => {
		router.push(`/topic/subtopic/${topicId}`);
	};

	return (
		<>
			<TooltipWrapper content="จัดการหัวข้อหลัก">
				<div
					onClick={navigateToSubtopic}
					role="button"
					aria-label="จัดการหัวข้อหลัก"
					tabIndex={0}
					className=" mr-2 cursor-pointer inline-flex items-center rounded-md p-2 hover:bg-primary-hover"
				>
					<LibraryBigIcon className="inline-block" size={16} />
				</div>
			</TooltipWrapper>

			<TooltipWrapper content="แก้ไขหัวข้อ">
				<div
					onClick={onEdit}
					role="button"
					aria-label="แก้ไขหัวข้อ"
					tabIndex={0}
					className="mr-2 cursor-pointer inline-flex items-center rounded-md p-2 hover:bg-primary-hover"
				>
					<Edit className="inline-block" size={16} />
				</div>
			</TooltipWrapper>

			<TooltipWrapper content="ลบหัวข้อหลัก">
				<div
					onClick={isDeleting ? undefined : onDelete}
					aria-label={isDeleting ? "กำลังลบ..." : "ลบหัวข้อหลัก"}
					tabIndex={0}
					className={`mr-2 cursor-pointer inline-flex items-center rounded-md p-2 ${
						isDeleting ? "text-gray-500 hover:bg-red-600" : "hover:bg-red-400"
					}`}
				>
					{isDeleting ? (
						"กำลังลบ..."
					) : (
						<Trash className="inline-block" size={16} />
					)}
				</div>
			</TooltipWrapper>
		</>
	);
};

export default TableActions;
