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

import { Topic, TopicInput } from "@/types/Topic";
interface ModalTopicFormProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	onSubmit: (data: TopicInput) => Promise<void>;
	initialData?: Topic;
	isSubmitting: boolean;
}

const ModalTopicForm: React.FC<ModalTopicFormProps> = ({
	isOpen,
	setIsOpen,
	onSubmit,
	initialData,
	isSubmitting,
}) => {
	const [topicName, setTopicName] = useState(initialData?.topicName || "");
	const [category, setCategory] = useState(initialData?.category || "");
	const categories = ["วิชาการ", "บันเทิง"];

	useEffect(() => {
		if (isOpen) {
			setTopicName(initialData?.topicName || "");
			setCategory(initialData?.category || "");
		}
	}, [isOpen, initialData]);

	const handleSubmit = async () => {
		await onSubmit({ topicName, category });
		setIsOpen(false);
	};

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
						{initialData ? "แก้ไขหัวข้อ" : "เพิ่มหัวข้อ"}
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
								<FormLabel>หัวข้อ</FormLabel>
								<Input
									type="text"
									value={topicName}
									onChange={(e) => setTopicName(e.target.value)}
									placeholder="หัวข้อ"
								/>
							</FormControl>
							<FormControl>
								<FormLabel>หมวดหมู่</FormLabel>
								<select
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"
								>
									<option value="" disabled>
										เลือกหมวดหมู่
									</option>
									{categories.map((cat) => (
										<option key={cat} value={cat}>
											{cat}
										</option>
									))}
								</select>
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
};

export default ModalTopicForm;
