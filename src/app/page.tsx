"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./AnimatedForm.css";
import Image from "next/image";
import UploadProfileImage from "../components/login/UploadProfileImage";
import axiosInstance from "../lib/axiosInstance";
import LoginModal from "@/components/login/LoginModal";
import { useUser } from "@/context/userContext";

const LoginUserPage = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [usernamer, setUsernamer] = useState("");
	const [passwordr, setPasswordr] = useState("");
	const [popup, setPopup] = useState(false);
	const [profile, setProfile] = useState("/defaultProfile.png");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isError, setIsError] = useState(false);

	const router = useRouter();
	const { setUserFromToken } = useUser();

	const handleProfileImageUpload = (imageUrl: React.SetStateAction<string>) => {
		setProfile(imageUrl);
	};

	const handleSubmit = async (isLogin: boolean) => {
		try {
			if (isLogin) {
				// Login
				const response = await axiosInstance.post("/users/login", {
					username,
					password,
				});
				const { token } = response.data;

				if (token) {
					setUserFromToken(token);

					setIsError(false);
					window.location.href = "/selectgame";
				}
			} else {
				// Register
				const response = await axiosInstance.post("/users/register", {
					profile,
					name,
					username: usernamer,
					password: passwordr,
				});
				const { token } = response.data;

				if (token) {
					setUserFromToken(token);
					setPopup(true);
					setIsError(false);
					setTitle("ลงทะเบียนสำเร็จ");
					setContent("");

					// เพิ่ม redirect หลังจากลงทะเบียนสำเร็จ
					setTimeout(() => {
						window.location.href = "/selectgame";
					}, 2000); // รอ 2 วินาทีก่อน redirect เพื่อให้ผู้ใช้เห็น popup
				}
			}
		} catch (error) {
			setIsError(true);
			setPopup(true);
			setTitle(
				isLogin ? "ชื่อผู้ใช้หรือรหัสผ่านผิด" : "มีชื่อผู้ใช้นี้ในระบบแล้ว"
			);
			setContent("กรุณาลองใหม่อีกครั้ง");
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleSubmit(isLogin);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center sm:-ml-20">
			{/* Desktop Layout */}
			<section className="hidden lg:flex flex-col justify-center items-center gap-4 h-full py-8">
				<Image
					src="/LogoLaSalleChote.png"
					alt="Logo"
					width={140}
					height={140}
				/>

				<div className="flex">
					{/* Login Form */}
					<div className={`form-wrapper ${isLogin ? "is-active" : ""}`}>
						<button
							type="button"
							className={`switcher switcher-login ${isLogin ? "active" : ""}`}
							onClick={() => setIsLogin(true)}
						>
							เข้าสู่ระบบ
							<span className="underline"></span>
						</button>
						<form
							className="form form-login"
							onSubmit={(e) => e.preventDefault()}
							onKeyDown={handleKeyDown}
						>
							<fieldset disabled={!isLogin} className="flex flex-col gap-3">
								<label htmlFor="login-username" className="login-label">
									ชื่อผู้ใช้
									<input
										id="login-username"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										required
										className="login-input"
									/>
								</label>
								<label htmlFor="login-password" className="login-label">
									รหัสผ่าน
									<input
										id="login-password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className="login-input"
									/>
								</label>
								<button
									type="button"
									className="login-btn"
									disabled={!isLogin}
									onClick={() => handleSubmit(true)}
								>
									เข้าสู่ระบบ
								</button>
							</fieldset>
						</form>
					</div>

					{/* Sign Up Form */}
					<div className={`form-wrapper ${!isLogin ? "is-active" : ""}`}>
						<button
							type="button"
							className={`switcher switcher-signup ${!isLogin ? "active" : ""}`}
							onClick={() => setIsLogin(false)}
						>
							ลงทะเบียน
							<span className="underline"></span>
						</button>
						<form
							className="form form-signup"
							onSubmit={(e) => e.preventDefault()}
							onKeyDown={handleKeyDown}
						>
							<fieldset disabled={isLogin} className="flex flex-col gap-3">
								<UploadProfileImage
									onImageUpload={(imageUrl: any) => setProfile(imageUrl)}
									profileImg={""}
								/>
								<label htmlFor="signup-name" className="login-label">
									ชื่อ
									<input
										id="signup-name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										required
										className="login-input"
									/>
								</label>
								<label htmlFor="signup-username" className="login-label">
									ชื่อผู้ใช้
									<input
										id="signup-username"
										value={usernamer}
										onChange={(e) => setUsernamer(e.target.value)}
										required
										className="login-input"
									/>
								</label>
								<label htmlFor="signup-password" className="login-label">
									รหัสผ่าน
									<input
										id="signup-password"
										type="password"
										value={passwordr}
										onChange={(e) => setPasswordr(e.target.value)}
										required
										className="login-input"
									/>
								</label>
								<button
									type="button"
									className="login-btn"
									disabled={isLogin}
									onClick={() => handleSubmit(false)}
								>
									ลงทะเบียน
								</button>
							</fieldset>
						</form>
					</div>
				</div>
			</section>

			{/* Mobile layout */}
			<div className="lg:hidden w-full max-w-md space-y-8 px-4 py-8">
				<div className="text-center">
					<Image
						src="/LogoLaSalleChote.png"
						alt="Logo"
						width={100}
						height={100}
						className="mx-auto"
					/>
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						{isLogin ? "เข้าสู่ระบบ" : "ลงทะเบียน"}
					</h2>
				</div>

				<div className="mt-8 bg-gray-100 py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<div className="flex justify-center mb-6">
						<button
							onClick={() => setIsLogin(true)}
							className={`px-4 py-2 text-sm font-medium ${
								isLogin
									? "text-blue-600 border-b-2 border-blue-600"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							เข้าสู่ระบบ
						</button>
						<button
							onClick={() => setIsLogin(false)}
							className={`px-4 py-2 text-sm font-medium ${
								!isLogin
									? "text-blue-600 border-b-2 border-blue-600"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							ลงทะเบียน
						</button>
					</div>

					<fieldset className="flex flex-col gap-3">
						{!isLogin && (
							<label htmlFor="mobile-signup-name" className="login-label">
								ชื่อ
								<input
									id="mobile-signup-name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									className="login-input"
								/>
							</label>
						)}

						<label
							htmlFor={
								isLogin ? "mobile-login-username" : "mobile-signup-username"
							}
							className="login-label"
						>
							ชื่อผู้ใช้
							<input
								id={
									isLogin ? "mobile-login-username" : "mobile-signup-username"
								}
								value={isLogin ? username : usernamer}
								onChange={(e) =>
									isLogin
										? setUsername(e.target.value)
										: setUsernamer(e.target.value)
								}
								required
								className="login-input"
							/>
						</label>

						<label
							htmlFor={
								isLogin ? "mobile-login-password" : "mobile-signup-password"
							}
							className="login-label"
						>
							รหัสผ่าน
							<input
								id={
									isLogin ? "mobile-login-password" : "mobile-signup-password"
								}
								type="password"
								value={isLogin ? password : passwordr}
								onChange={(e) =>
									isLogin
										? setPassword(e.target.value)
										: setPasswordr(e.target.value)
								}
								required
								className="login-input"
							/>
						</label>

						<button
							type="button"
							className="login-btn"
							onClick={() => handleSubmit(isLogin)}
						>
							{isLogin ? "เข้าสู่ระบบ" : "ลงทะเบียน"}
						</button>
					</fieldset>
				</div>
			</div>
			<LoginModal
				popup={popup}
				setpopup={setPopup}
				title={title}
				content={content}
				action={!isError}
				pop={() => router.push("/selectgame")}
			/>
		</div>
	);
};
export default LoginUserPage;
