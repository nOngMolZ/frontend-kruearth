import React from "react";
import { Button } from "@/components/ui/button";
import { LibraryBigIcon, Edit, Trash } from "lucide-react";
import TooltipWrapper from "@/components/ui/TooltipWrapper"; // นำเข้า TooltipWrapper
import { SubtopicInput } from "@/types/SubTopic";
import { useRouter } from "next/navigation";

interface SubTableActionProps {
	subtopicId: string;
	subtopicName: string;
	onEdit: () => void;
	onDelete: () => void;
	isDeleting: boolean;
	initialData: SubtopicInput;
}

const SubTableAction: React.FC<SubTableActionProps> = ({
	subtopicId,
	subtopicName,
	onEdit,
	onDelete,
	initialData,
	isDeleting,
}) => {
	const router = useRouter();

	const navigateToQuestion = () => {
		router.push(`/topic/subtopic/question/${subtopicId}`);
	};

	return (
		<>
			<TooltipWrapper content="จัดการหัวข้อย่อย">
				<div
					onClick={navigateToQuestion}
					role="button"
					aria-label="จัดการหัวข้อย่อย"
					tabIndex={0}
					className=" mr-2 cursor-pointer inline-flex items-center rounded-md p-2 hover:bg-primary-hover"
				>
					<LibraryBigIcon className="inline-block" size={16} />
				</div>
			</TooltipWrapper>

			<TooltipWrapper content="แก้ไขหัวข้อย่อย">
				<div
					onClick={onEdit}
					role="button"
					aria-label="แก้ไขหัวข้อย่อย"
					tabIndex={0}
					className="mr-2 cursor-pointer inline-flex items-center rounded-md p-2 hover:bg-primary-hover"
				>
					<Edit className="inline-block" size={16} />
				</div>
			</TooltipWrapper>

			<TooltipWrapper content="ลบหัวข้อย่อย">
				<div
					onClick={isDeleting ? undefined : onDelete}
					aria-label={isDeleting ? "กำลังลบ..." : "ลบหัวข้อย่อย"}
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

export default SubTableAction;
