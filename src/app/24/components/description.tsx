import React from "react";

interface DescriptionProps {
	level: string;
}

const Description: React.FC<DescriptionProps> = ({ level }) => {
	return (
		<div className="flex gap-6 w-full bg-white shadow-lg rounded-xl justify-center p-6">
			{level === "easy" && (
				<div className="flex flex-col gap-3">
					<h2 className="flex justify-center items-center">กติกา</h2>
					<ul className="list-decimal flex flex-col gap-1 ml-6">
						<li>มีตัวเลข 4 ตัว นำมา + - * / ให้ได้ 24</li>
						<li>ตัวเลขใช้ได้ตัวละครั้ง</li>
						<li>ดำเนินการใช้ได้แค่ + - * / ( ) เท่านั้น</li>
						<li>มีเวลา 60 วิ</li>
						<li>ตอบถูก +5 คะแนน ตอบผิด รอ 5 วิ ถึงเริ่มข้อใหม่</li>
					</ul>
					<h2 className="flex justify-center items-center">ตัวอย่าง</h2>
					<ul>
						<li>ชุดตัวเลข: 3 5 7 9</li>
						<li>คำตอบ: 24</li>
						<li>วิธีคิด: (7-5)*(9+3)</li>
					</ul>

					<h2 className="flex justify-center items-center">เทคนิค</h2>
					<ul>
						<li>ยอมผิดเพื่อรีบเปลี่ยนข้อ</li>
						<li>เปลี่ยนภาษาอังกฤษไว้รอ แล้วกด enter เพื่อตอบ</li>
					</ul>
				</div>
			)}
			{level === "medium" && (
				<div className="flex flex-col gap-3">
					<h2 className="flex justify-center items-center">กติกา</h2>
					<ul className="list-decimal flex flex-col gap-1 ml-6">
						<li>มีตัวเลข 4 ตัว นำมา + - * / ^ ให้ได้คำตอบ</li>
						<li>ตัวเลขใช้ได้ตัวละครั้ง</li>
						<li>ดำเนินการใช้ได้แค่ + - * / ^ ( ) เท่านั้น</li>
						<li>มีเวลา 300 วิ</li>
						<li>ตอบถูก +5 คะแนน ตอบผิด รอ 10 วิ ถึงเริ่มข้อใหม่</li>
					</ul>
					<h2 className="flex justify-center items-center">ตัวอย่าง</h2>
					<ul>
						<li>ชุดตัวเลข: 2 5 5 9</li>
						<li>คำตอบ: 1015</li>
						<li>วิธีคิด: 2^(5+5)-9</li>
					</ul>

					<h2 className="flex justify-center items-center">เทคนิค</h2>
					<ul>
						<li>ยอมผิดเพื่อรีบเปลี่ยนข้อ</li>
						<li>เปลี่ยนภาษาอังกฤษไว้รอ แล้วกด enter เพื่อตอบ</li>
					</ul>
				</div>
			)}
			{level === "hard" && (
				<div className="flex flex-col gap-3">
					<h2 className="flex justify-center items-center">กติกา</h2>
					<ul className="list-decimal flex flex-col gap-1 ml-6">
						<li>มีตัวเลข 5 ตัว นำมา + - * / ^ ! ให้ได้คำตอบ</li>
						<li>ตัวเลขใช้ได้ตัวละครั้ง</li>
						<li>ดำเนินการใช้ได้แค่ + - * / ^ ! ( ) เท่านั้น</li>
						<li>มีเวลา 600 วิ</li>
						<li>ตอบถูก +5 คะแนน ตอบผิด รอ 15 วิ ถึงเริ่มข้อใหม่</li>
					</ul>
					<h2 className="flex justify-center items-center">ตัวอย่าง</h2>
					<ul>
						<li>ชุดตัวเลข: 2 2 3 9 4</li>
						<li>คำตอบ: 184</li>
						<li>วิธีคิด: 2^(3*2) + (9-4)!</li>
					</ul>

					<h2 className="flex justify-center items-center">เทคนิค</h2>
					<ul>
						<li>ยอมผิดเพื่อรีบเปลี่ยนข้อ</li>
						<li>เปลี่ยนภาษาอังกฤษไว้รอ แล้วกด enter เพื่อตอบ</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default Description;
