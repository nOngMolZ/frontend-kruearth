"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/userContext";

interface AuthGuardProps {
	children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
	const { User, isLoading } = useUser();
	const router = useRouter();
	const pathname = usePathname();
	const [isAuthorized, setIsAuthorized] = useState(false);

	useEffect(() => {
		if (isLoading) {
			return;
		}

		if (!User && pathname !== "/") {
			router.push("/");
			return;
		}

		if (
			User &&
			!User.isAdmin &&
			["/user", "/topic", "/score"].includes(pathname)
		) {
			router.push("/403");
			return;
		}

		setIsAuthorized(true);
	}, [User, pathname, router, isLoading]);

	if (isLoading) {
		return null;
	}

	return isAuthorized ? <>{children}</> : null;
};

export default AuthGuard;
