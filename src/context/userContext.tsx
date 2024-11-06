"use client";

import React, {
	createContext,
	useState,
	useEffect,
	useContext,
	ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "@/lib/userApi";
import { User } from "@/types/user"; // Import User type

interface UserContextType {
	User: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	isLoading: boolean;
	setUserFromToken: (token: string) => void;
	refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [User, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchUserData();
	}, []);

	async function fetchUserData() {
		try {
			const token = localStorage.getItem("token");
			if (token) {
				const decodedToken = jwtDecode<{ id: string }>(token);
				const userData = await getUserById(decodedToken.id);

				if (userData) {
					setUser(userData);
				} else {
					console.error("User data not found");
					setUser(null);
				}
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error("Error fetching user data:", error);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}

	const setUserFromToken = (token: string) => {
		try {
			const decodedToken = jwtDecode<User>(token);
			setUser(decodedToken);
			localStorage.setItem("token", token);
		} catch (error) {
			console.error("Error decoding token:", error);
			setUser(null);
		}
	};

	const refreshUser = async () => {
		await fetchUserData();
	};

	return (
		<UserContext.Provider
			value={{ User, setUser, isLoading, setUserFromToken, refreshUser }}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};
