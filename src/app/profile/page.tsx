"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/userContext";
import { updateUserById } from "@/lib/userApi";
import { User } from "@/types/user";
import UploadProfileImage from "@/components/login/UploadProfileImage";
import ProfileModal from "./components/ProfileModal";

export default function Profile() {
	const { User, refreshUser } = useUser();
	const userId = User?._id || "";
	const [userProfile, setUserProfile] = useState<User | null>(null);
	const [popup, setPopup] = useState<boolean>(false);
	const [popupTitle, setPopupTitle] = useState<string>("");
	const [popupContent, setPopupContent] = useState<string>("");

	useEffect(() => {
		if (User) {
			setUserProfile(User);
		}
	}, [User]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setUserProfile((prev) => (prev ? { ...prev, [name]: value } : null));
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!userProfile) return;

		try {
			const res = await updateUserById(userId, userProfile);
			setPopupTitle("Success");
			setPopupContent(res);
		} catch (error) {
			setPopupTitle("มีข้อผิดพลาด");
			setPopupContent("แก้ไขข้อมูลผู้ใช้ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
		}

		setPopup(true);
		refreshUser();
	}

	return (
		<>
			<div className="flex flex-col items-center py-14 sm:py-10 min-h-screen">
				<form
					className="tw-box flex flex-col gap-6 sm:w-1/2"
					onSubmit={handleSubmit}
				>
					<h2 className="font-bold">แก้ไขข้อมูลผู้ใช้</h2>
					<UploadProfileImage
						profileImg={userProfile?.profile || ""}
						onImageUpload={(imageUrl: string) => {
							setUserProfile((prev) =>
								prev ? { ...prev, profile: imageUrl } : null
							);
						}}
					/>

					<label className="login-label">
						ชื่อ
						<input
							name="name"
							value={userProfile?.name || ""}
							onChange={handleChange}
							required
							className="border border-neutral-300 px-4 py-2 rounded-lg"
						/>
					</label>
					<label className="login-label">
						ชื่อผู้ใช้
						<input
							value={userProfile?.username || ""}
							disabled
							className="border border-neutral-300 px-4 py-2 rounded-lg"
						/>
					</label>
					<label className="login-label">
						ตั้งรหัสผ่านใหม่
						<input
							type="password"
							name="password"
							value={userProfile?.password || ""}
							onChange={handleChange}
							className="border border-neutral-300 px-4 py-2 rounded-lg"
						/>
					</label>
					<button
						type="submit"
						className="mt-1 px-4 py-2 bg-y2r3 hover:bg-y3r4 rounded-xl"
					>
						บันทึก
					</button>
				</form>
			</div>
			<ProfileModal
				popup={popup}
				setPopup={setPopup}
				title={popupTitle}
				content={popupContent}
			/>
		</>
	);
}
