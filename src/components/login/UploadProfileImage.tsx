import { useState } from "react";
import { CgSpinner } from "react-icons/cg";

interface UploadProfileImageProps {
	profileImg: string;
	onImageUpload: (imageUrl: string) => void;
}

const UploadProfileImage = ({
	profileImg,
	onImageUpload,
}: UploadProfileImageProps) => {
	const [profileImage, setProfileImage] = useState<string>(
		`${profileImg}` || "/defaultProfile.png"
	);
	const [loading, setLoading] = useState<boolean>(false);

	const handleFileChange = async (e: any) => {
		const file = e.target.files[0];
		if (!file) return;

		try {
			setLoading(true);
			const imageURL = await uploadToCloudinary(file);
			setProfileImage(imageURL);
			onImageUpload(imageURL); // ส่ง URL ของภาพที่อัปโหลดกลับไปที่ component แม่
			setLoading(false);
		} catch (error) {
			console.error("Error uploading image:", error);
		}
	};

	const uploadToCloudinary = async (file: any) => {
		const url = `https://api.cloudinary.com/v1_1/dyrs3bvzj/upload`;
		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", "freetouse");

		const response = await fetch(url, {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		return data.secure_url; // This URL can be used to display the image
	};

	return (
		<div className="flex items-center justify-center gap-4">
			<div className="w-16 h-16 rounded-full border flex items-center justify-center">
				{loading ? (
					<CgSpinner className="text-4xl text-accent animate-spin" />
				) : (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={profileImage || "/defaultProfile.png"}
						alt="Profile"
						className="rounded-full w-full h-full object-cover"
					/>
				)}
			</div>
			<input
				id="uploadfile"
				type="file"
				className="hidden"
				onChange={handleFileChange}
			/>
			<button
				type="button"
				className="mt-2 bg-gray-200 py-1 px-3 rounded-lg text-sm"
				onClick={() => document.getElementById("uploadfile")?.click()}
			>
				เลือกไฟล์
			</button>
		</div>
	);
};

export default UploadProfileImage;
