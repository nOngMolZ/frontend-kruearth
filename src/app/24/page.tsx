"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/context/userContext";
import Body from "./components/body";
import Score from "./components/score";
import MobileLevelSelector from "./components/MobileLevelSelector";
import MobileRulesModal from "./components/MobileRulesModal";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Description from "./components/description";

interface MobileScoreModalProps {
	isOpen: boolean;
	onClose: () => void;
	level: string;
	IsEnd: boolean;
}

function Page() {
	const [level, setLevel] = useState<string>("easy");
	const { User } = useUser();
	const [IsEnd, setIsEnd] = useState<boolean>(false);
	const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>(false);
	const [showRules, setShowRules] = useState<boolean>(false);
	const [showScore, setShowScore] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileOrTablet(window.innerWidth <= 1024);
		};

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleLevelChange = (newLevel: string) => {
		setLevel(newLevel);
	};
	const MobileScoreModal: React.FC<MobileScoreModalProps> = ({
		isOpen,
		onClose,
		level,
		IsEnd,
	}) => {
		if (!isOpen) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white p-6 rounded-lg max-w-sm w-full">
					<h2 className="text-xl font-bold mb-4">คะแนน</h2>
					<Score level={level} IsEnd={IsEnd} />
					<Button
						onClick={onClose}
						className="mt-4 w-full bg-secondary text-white"
					>
						ปิด
					</Button>
				</div>
			</div>
		);
	};

	return (
		<div
			className={`min-h-screen bg-gray-primary mx-auto md:container lg:px-16 xl:px-24 ${
				isMobileOrTablet ? "h-screen overflow-hidden" : ""
			}`}
		>
			{isMobileOrTablet ? (
				<div className="p-4 md:p-8 mt-20 max-w-2xl mx-auto">
					<div className="flex-1 flex flex-col p-4 md:p-8">
						<div className="flex justify-between bg-white rounded-lg px-2 py-1 md:px-3 md:py-2 mb-2 text-center">
							<div className="bg-white rounded-lg px-3 py-2">
								<h3 className="text-sm md:text-base">หมวดหมู่: บันเทิง</h3>
							</div>
							<div className="bg-white rounded-lg px-3 py-2">
								<h3 className="text-sm md:text-base">หัวข้อย่อย: เกม 24</h3>
							</div>
							<div className="bg-white rounded-lg px-3 py-2">
								<h3 className="text-sm md:text-base">ชื่อ: {User?.name}</h3>
							</div>
						</div>
					</div>

					<MobileLevelSelector
						level={level}
						onLevelChange={handleLevelChange}
					/>
					<Body level={level} IsEnd={IsEnd} setIsEnd={setIsEnd} />
					<MobileRulesModal
						isOpen={showRules}
						onClose={() => setShowRules(false)}
						level={level}
					/>
					<MobileScoreModal
						isOpen={showScore}
						onClose={() => setShowScore(false)}
						level={level}
						IsEnd={IsEnd}
					/>
					<div className="flex justify-between space-x-2 mt-4">
						<Button
							onClick={() => setShowRules(true)}
							className="bg-secondary text-white"
						>
							วิธีเล่น
						</Button>
						<Button
							onClick={() => setShowScore(true)}
							className="bg-secondary text-white"
						>
							ดูคะแนน
						</Button>
					</div>
				</div>
			) : (
				<section className="flex flex-col gap-8">
					<header className="flex w-full gap-10 p-6">
						<div className="flex w-2/5 items-center gap-6">
							<Button
								className={`w-1/3 px-2 py-3 bg-white border border-secondary hover:bg-secondary hover:text-white
              ${level === "easy" ? "bg-secondary text-white" : ""}`}
								onClick={() => handleLevelChange("easy")}
							>
								ง่าย
							</Button>
							<Button
								className={`w-1/3 px-2 py-3 bg-white border border-secondary hover:bg-secondary hover:text-white
              ${level === "medium" ? "bg-secondary text-white" : ""}`}
								onClick={() => handleLevelChange("medium")}
							>
								ปานกลาง
							</Button>
							<Button
								className={`w-1/3 px-2 py-3 bg-white border border-secondary hover:bg-secondary hover:text-white
              ${level === "hard" ? "bg-secondary text-white" : ""}`}
								onClick={() => handleLevelChange("hard")}
							>
								ยาก
							</Button>
						</div>
						<div className="flex w-2/5 items-center justify-around px-2 py-3 bg-white rounded-lg">
							<h3>หมวดหมู่: บันเทิง</h3>
							<h3>หัวข้อย่อย: เกม 24</h3>
						</div>
						<div className="flex w-1/5 items-center justify-center px-2 py-3 bg-white rounded-lg">
							<h3>ชื่อ {User?.name}</h3>
						</div>
					</header>
					<div className="grid grid-cols-2 gap-8 justify-center px-10">
						{/* Body and Score are above */}
						<Body level={level} IsEnd={IsEnd} setIsEnd={setIsEnd} />
						<Score level={level} IsEnd={IsEnd} />
						<div className="col-span-2 w-full">
							{/* Description moved below */}
							<Description level={level} />
						</div>
					</div>
				</section>
			)}
		</div>
	);
}

export default Page;
