import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface MobileRulesModalProps {
	isOpen: boolean;
	onClose: () => void;
	level: string;
}

const MobileRulesModal: React.FC<MobileRulesModalProps> = ({
	isOpen,
	onClose,
	level,
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex justify-between items-center">
						กติกา
					</DialogTitle>
				</DialogHeader>
				<div className="mt-4">
					{level === "easy" && (
						<ul className="list-decimal pl-5 space-y-2">
							<li>มีตัวเลข 4 ตัว นำมา + - * / ให้ได้ 24</li>
							<li>ตัวเลขใช้ได้ตัวละครั้ง</li>
							<li>ดำเนินการใช้ได้แค่ + - * / ( ) เท่านั้น</li>
							<li>มีเวลา 60 วิ</li>
							<li>ตอบถูก +5 คะแนน ตอบผิด รอ 5 วิ ถึงเริ่มข้อใหม่</li>
						</ul>
					)}
					{level === "medium" && (
						<ul className="list-decimal pl-5 space-y-2">
							<li>มีตัวเลข 4 ตัว นำมา + - * / ^ ให้ได้คำตอบ</li>
							<li>ตัวเลขใช้ได้ตัวละครั้ง</li>
							<li>ดำเนินการใช้ได้แค่ + - * / ^ ( ) เท่านั้น</li>
							<li>มีเวลา 300 วิ</li>
							<li>ตอบถูก +5 คะแนน ตอบผิด รอ 10 วิ ถึงเริ่มข้อใหม่</li>
						</ul>
					)}
					{level === "hard" && (
						<ul className="list-decimal pl-5 space-y-2">
							<li>มีตัวเลข 5 ตัว นำมา + - * / ^ ! ให้ได้คำตอบ</li>
							<li>ตัวเลขใช้ได้ตัวละครั้ง</li>
							<li>ดำเนินการใช้ได้แค่ + - * / ^ ! ( ) เท่านั้น</li>
							<li>มีเวลา 600 วิ</li>
							<li>ตอบถูก +5 คะแนน ตอบผิด รอ 15 วิ ถึงเริ่มข้อใหม่</li>
						</ul>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default MobileRulesModal;
