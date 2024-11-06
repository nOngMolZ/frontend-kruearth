import React from "react";
import {
	Button,
	DialogActions,
	DialogTitle,
	Divider,
	Modal,
	ModalClose,
	ModalDialog,
	Typography,
} from "@mui/joy";

interface ModalUserDeleteProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	onConfirm: () => Promise<void>;
	userName: string;
	isSubmitting: boolean;
}

const ModalUserDelete: React.FC<ModalUserDeleteProps> = ({
	isOpen,
	setIsOpen,
	onConfirm,
	userName,
	isSubmitting,
}) => {
	const handleConfirm = async () => {
		await onConfirm();
		setIsOpen(false);
	};

	return (
		<Modal open={isOpen} onClose={() => setIsOpen(false)}>
			<ModalDialog
				className={`animate-slide-down`}
				variant="outlined"
				role="alertdialog"
			>
				<ModalClose />
				<DialogTitle>ยืนยันการลบผู้ใช้</DialogTitle>
				<Divider />
				<Typography>
					คุณแน่ใจหรือไม่ที่ต้องการลบผู้ใช้ &quot;{userName}&quot;?
				</Typography>
				<Typography color="danger">
					การดำเนินการนี้ไม่สามารถยกเลิกได้
				</Typography>
				<DialogActions>
					<Button
						variant="solid"
						color="danger"
						onClick={handleConfirm}
						disabled={isSubmitting}
						loading={isSubmitting}
					>
						ยืนยันการลบ
					</Button>
					<Button
						variant="outlined"
						color="neutral"
						onClick={() => setIsOpen(false)}
					>
						ยกเลิก
					</Button>
				</DialogActions>
			</ModalDialog>
		</Modal>
	);
};

export default ModalUserDelete;
