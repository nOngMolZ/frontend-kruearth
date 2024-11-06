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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { QuestionInput } from "@/types/Question";

interface QuestionModalProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	mode: "add" | "edit";
	onSubmit: (data: QuestionInput) => void;
	onClose: () => void;
	initialData?: QuestionInput | null;
	subtopicId: string;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
	isOpen,
	mode,
	onClose,
	onSubmit,
	subtopicId,
	initialData = null,
}) => {
	const [formData, setFormData] = useState<QuestionInput>({
		questionName: "",
		option: [
			{ text: "", isCorrect: false },
			{ text: "", isCorrect: false },
			{ text: "", isCorrect: false },
			{ text: "", isCorrect: false },
		],
		hint: "",
		subtopicId: subtopicId,
	});
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	useEffect(() => {
		if (initialData) {
			setFormData(initialData);
		} else {
			setFormData({
				questionName: "",
				option: [
					{ text: "", isCorrect: false },
					{ text: "", isCorrect: false },
					{ text: "", isCorrect: false },
					{ text: "", isCorrect: false },
				],
				hint: "",
				subtopicId: subtopicId,
			});
		}
	}, [initialData, isOpen, subtopicId]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleOptionChange = (index: number, value: string) => {
		setFormData((prev) => ({
			...prev,
			option: prev.option.map((opt, i) =>
				i === index ? { ...opt, text: value } : opt
			),
		}));
	};

	const handleCorrectChange = (index: number) => {
		setFormData((prev) => ({
			...prev,
			option: prev.option.map((opt, i) => ({
				...opt,
				isCorrect: i === index,
			})),
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		const now = new Date().toISOString();
		onSubmit({ ...formData, createOn: now });
		setIsSubmitting(false);
	};

	return (
		<React.Fragment>
			<Modal open={isOpen} onClose={onClose}>
				<ModalDialog
					className={`animate-slide-down`}
					variant="outlined"
					role="alertdialog"
					sx={{
						width: "35%",
					}}
				>
					<ModalClose />
					<DialogTitle>
						{mode === "edit" ? "แก้ไขโจทย์" : "เพิ่มโจทย์"}
					</DialogTitle>

					<Divider />

					<form onSubmit={handleSubmit} className="overflow-y-auto pr-4 -mr-4">
						<Stack spacing={2}>
							<FormControl>
								<FormLabel>โจทย์</FormLabel>
								<Textarea
									name="questionName"
									value={formData.questionName}
									onChange={handleChange}
									placeholder="โจทย์"
								/>
							</FormControl>
							{formData.option.map((opt, index) => (
								<FormControl key={index}>
									<FormLabel>ตัวเลือกที่ {index + 1}</FormLabel>
									<div className="flex items-center gap-2">
										<Input
											id={`option${index + 1}`}
											name={`option${index + 1}`}
											value={opt.text}
											onChange={(e) =>
												handleOptionChange(index, e.target.value)
											}
											placeholder={`ตัวเลือกที่ ${index + 1}`}
										/>
										<Checkbox
											checked={opt.isCorrect}
											onCheckedChange={() => handleCorrectChange(index)}
											className="w-4 h-4"
										/>
									</div>
								</FormControl>
							))}
							<FormControl>
								<FormLabel>คำใบ้</FormLabel>
								<Textarea
									name="hint"
									value={formData.hint}
									onChange={handleChange}
									placeholder="คำใบ้"
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
								<Button variant="outlined" color="neutral" onClick={onClose}>
									ยกเลิก
								</Button>
							</DialogActions>
						</Stack>
					</form>
				</ModalDialog>
			</Modal>
		</React.Fragment>
	);
};

export default QuestionModal;
