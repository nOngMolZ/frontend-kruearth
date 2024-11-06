import React from "react";
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Modal,
	ModalClose,
	ModalDialog,
} from "@mui/joy";

export default function LoginModal({
	popup,
	setpopup,
	title,
	content,
	action,
	pop,
}: {
	popup: boolean;
	setpopup: Function;
	title: string;
	content: string;
	action: boolean;
	pop: Function;
}) {
	return (
		<React.Fragment>
			<Modal open={popup} onClose={() => setpopup(false)}>
				<ModalDialog
					className={`animate-slide-down`}
					variant="outlined"
					role="alertdialog"
				>
					<ModalClose />
					<DialogTitle>{title}</DialogTitle>
					{content && (
						<>
							<Divider />
							<DialogContent>{content}</DialogContent>
						</>
					)}
					{action && (
						<DialogActions>
							<Button
								sx={{
									backgroundColor: "#c2410c",
									color: "#fff",
									"&:hover": {
										backgroundColor: "#7c2d12",
									},
								}}
								onClick={() => pop()}
							>
								เข้าสู่ระบบ
							</Button>
						</DialogActions>
					)}
				</ModalDialog>
			</Modal>
		</React.Fragment>
	);
}
