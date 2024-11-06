import React from "react";
import {
	DialogContent,
	DialogTitle,
	Divider,
	Modal,
	ModalClose,
	ModalDialog,
} from "@mui/joy";

export default function ProfileModal({
	popup,
	setPopup,
	title,
	content,
}: {
	popup: boolean;
	setPopup: Function;
	title: string;
	content: string;
}) {
	return (
		<React.Fragment>
			<Modal open={popup} onClose={() => setPopup(false)}>
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
				</ModalDialog>
			</Modal>
		</React.Fragment>
	);
}
