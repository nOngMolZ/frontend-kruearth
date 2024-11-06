import React from "react";
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

export default function ScoreModal({
	isEditModalOpen,
	setIsEditModalOpen,
	handleUpdateScore,
	editedScore,
	setEditedScore,
	isSubmitting,
}: {
	isEditModalOpen: boolean;
	setIsEditModalOpen: Function;
	handleUpdateScore: Function;
	editedScore: number;
	setEditedScore: Function;
	isSubmitting: boolean;
}) {
	return (
		<React.Fragment>
			<Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
				<ModalDialog
					className={`animate-slide-down`}
					variant="outlined"
					role="alertdialog"
				>
					<ModalClose />
					<DialogTitle>แก้ไขคะแนน</DialogTitle>

					<Divider />
					<form
						onSubmit={(event) => {
							event.preventDefault();
							handleUpdateScore();
							setIsEditModalOpen(false);
						}}
					>
						<Stack spacing={2}>
							<FormControl>
								<FormLabel>คะแนน</FormLabel>
								<Input
									type="number"
									value={editedScore}
									onChange={(e) => setEditedScore(Number(e.target.value))}
									placeholder="คะแนน"
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
									onClick={() => setIsEditModalOpen(false)}
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
