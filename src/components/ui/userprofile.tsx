"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/userContext";
import { LoaderCircle } from "lucide-react";

const UserProfile: React.FC = () => {
	const { User } = useUser();
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		if (User && User.profile) {
			const img = new Image();
			img.src = User.profile;
			img.onload = () => setImageLoaded(true);
			img.onerror = () => setImageLoaded(false);
		}
	}, [User]);

	return (
		<div className="sm:px-2">
			{imageLoaded ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					className="w-full aspect-square rounded-full"
					src={User?.profile}
					alt="Profile"
				/>
			) : (
				<LoaderCircle className="animate-spin" /> // Or some placeholder if image fails to load
			)}
		</div>
	);
};

export default UserProfile;
