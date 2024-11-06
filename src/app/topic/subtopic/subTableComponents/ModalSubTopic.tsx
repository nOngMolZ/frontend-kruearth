import React, { useState, useEffect } from "react";

import {
	Button,
	DialogActions,
	DialogTitle,
	Divider,
	FormControl,
	FormLabel,
	Modal,
	ModalClose,
	ModalDialog,
	Stack,
} from "@mui/joy";
import { Input } from "@/components/ui/input";

import { SubtopicInput } from "@/types/SubTopic";

interface ModalSubTopicProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	mode: "add" | "edit";
	initialData?: Partial<SubtopicInput>;
	onSubmit: (data: SubtopicInput) => void;
	isSubmitting: boolean;
}

export function ModalSubTopic({
	isOpen,
	setIsOpen,
	mode,
	initialData,
	onSubmit,
	isSubmitting,
}: ModalSubTopicProps) {
	// State เก็บเวลาหน่วยนาที
	const [subtopicName, setSubtopicName] = useState(
		initialData?.subtopicName || ""
	);
	const [time, setTime] = useState(""); // ใช้หน่วยนาที
	const [category, setCategory] = useState(initialData?.category || "");

	const handleSubmit = () => {
		// Convert time from minutes to milliseconds before sending to backend
		const timeInMilliseconds = parseInt(time, 10) * 60000;

		onSubmit({
			_id: initialData?._id || "",
			subtopicName,
			time: timeInMilliseconds, // ส่งค่าในหน่วย milliseconds
			category: category || "",
			topicId: initialData?.topicId || "",
		});

		setIsOpen(false);
	};

	useEffect(() => {
		setSubtopicName(initialData?.subtopicName || "");

		// ถ้า initialData มีค่าเวลา ให้แปลงจาก milliseconds ไปเป็นนาที
		if (initialData?.time) {
			setTime((initialData.time / 60000).toString()); // แปลงจาก milliseconds เป็นนาที
		} else {
			setTime("");
		}

		setCategory(initialData?.category || "");
	}, [initialData]);

	return (
		<React.Fragment>
			<Modal open={isOpen} onClose={() => setIsOpen(false)}>
				<ModalDialog
					className={`animate-slide-down`}
					variant="outlined"
					role="alertdialog"
				>
					<ModalClose />
					<DialogTitle>
						{mode === "add" ? "เพิ่มหัวข้อย่อย" : "แก้ไขหัวข้อย่อย"}
					</DialogTitle>

					<Divider />

					<form
						onSubmit={(event) => {
							event.preventDefault();
							handleSubmit();
						}}
					>
						<Stack spacing={2}>
							<FormControl>
								<FormLabel>หัวข้อย่อย</FormLabel>
								<Input
									type="text"
									value={subtopicName}
									onChange={(e) => setSubtopicName(e.target.value)}
									placeholder="หัวข้อย่อย"
								/>
							</FormControl>
							<FormControl>
								<FormLabel>เวลา (นาที)</FormLabel>
								<Input
									type="number"
									value={time}
									onChange={(e) => setTime(e.target.value)} // เก็บค่าเป็นหน่วยนาที
									placeholder="เวลา"
								/>
							</FormControl>
							<DialogActions>
								<Button
									type="submit"
									color="warning"
									disabled={isSubmitting}
									loading={isSubmitting}
									sx={{
										backgroundColor: "#c2410c",
										color: "#fff",
										"&:hover": {
											backgroundColor: "#7c2d12",
										},
									}}
								>
									บันทึก
								</Button>
								<Button
									variant="outlined"
									color="neutral"
									onClick={() => setIsOpen(false)}
								>
									ยกเลิก
								</Button>
							</DialogActions>
						</Stack>
					</form>
				</ModalDialog>
			</Modal>
		</React.Fragment>
	);
}
