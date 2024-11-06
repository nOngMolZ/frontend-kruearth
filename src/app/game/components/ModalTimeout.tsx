import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

export default function ModalTimeout({
	score,
	showTimeout,
	handleRestart,
	handleExit,
}: {
	score: number;
	showTimeout: boolean;
	handleRestart: Function;
	handleExit: Function;
}) {
	return (
		<React.Fragment>
			<Modal open={showTimeout}>
				<ModalDialog
					className={`animate-slide-down`}
					variant="outlined"
					role="alertdialog"
				>
					<DialogTitle>
						<WarningRoundedIcon />
						เกมจบแล้ว
					</DialogTitle>
					<Divider />
					<DialogContent>คะแนนของคุณคือ {score} คะแนน</DialogContent>
					<DialogActions>
						<Button variant="solid" color="danger" onClick={() => handleExit()}>
							ออกจากเกม
						</Button>
						<Button
							variant="outlined"
							color="neutral"
							onClick={() => handleRestart()}
						>
							เริ่มเกมใหม่
						</Button>
					</DialogActions>
				</ModalDialog>
			</Modal>
		</React.Fragment>
	);
}
