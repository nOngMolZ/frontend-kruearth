import React, { useState, useEffect } from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";
import DialogContent from "@mui/joy/DialogContent";
import { Topic } from "@/types/Topic";
import { Subtopic } from "@/types/SubTopic";
import { SubTopicApi } from "@/lib/SubTopicApi";
import { useRouter } from "next/navigation";

interface SubtopicModalProps {
	isOpen: boolean;
	onClose: () => void;
	topic: Topic;
}

const SubtopicModal: React.FC<SubtopicModalProps> = ({
	isOpen,
	onClose,
	topic,
}) => {
	const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
	const router = useRouter();

	useEffect(() => {
		const fetchSubtopics = async () => {
			try {
				const fetchedSubtopics = await SubTopicApi.getAllSubtopicsByTopicId(
					topic._id
				);
				setSubtopics(fetchedSubtopics);
			} catch (error) {
				console.error("Error fetching subtopics:", error);
			}
		};

		if (isOpen) {
			fetchSubtopics();
		}
	}, [isOpen, topic._id]);

	const handleSubtopicClick = (subtopicId: string) => {
		router.push(`/game/${subtopicId}`);
		onClose();
	};

	return (
		<React.Fragment>
			<Modal open={isOpen} onClose={onClose}>
				<ModalDialog
					className={`animate-slide-down`}
					variant="outlined"
					role="alertdialog"
				>
					<ModalClose />
					<DialogTitle>{topic.topicName}</DialogTitle>
					<Divider />
					{subtopics.length !== 0 ? (
						subtopics.map((subtopic) => (
							<Button
								key={subtopic._id}
								variant="plain"
								color="neutral"
								sx={{
									backgroundColor: "#fef3c7",
									"&:hover": {
										backgroundColor: "#fde68a",
									},
								}}
								onClick={() => handleSubtopicClick(subtopic._id)}
							>
								{subtopic.subtopicName}
							</Button>
						))
					) : (
						<DialogContent>ไม่มีหัวข้อย่อย</DialogContent>
					)}
				</ModalDialog>
			</Modal>
		</React.Fragment>
	);
};

export default SubtopicModal;
