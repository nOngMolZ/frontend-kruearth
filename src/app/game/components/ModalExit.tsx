import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

export default function ModalExit({
	showExit,
	setShowExit,
	handleExit,
}: {
	showExit: boolean;
	setShowExit: Function;
	handleExit: Function;
}) {
	return (
		<React.Fragment>
			<Modal open={showExit} onClose={() => setShowExit(false)}>
				<ModalDialog
					className={`animate-slide-down`}
					variant="outlined"
					role="alertdialog"
				>
					<DialogTitle>
						<WarningRoundedIcon />
						ต้องการออกจากเกมใช่ไหม
					</DialogTitle>
					<Divider />
					<DialogContent>หากกดออกจากเกม คุณจะเสียคะแนนทั้งหมด</DialogContent>
					<DialogActions>
						<Button variant="solid" color="danger" onClick={() => handleExit()}>
							ยืนยัน
						</Button>
						<Button
							variant="outlined"
							color="neutral"
							onClick={() => setShowExit(false)}
						>
							ยกเลิก
						</Button>
					</DialogActions>
				</ModalDialog>
			</Modal>
		</React.Fragment>
	);
}
