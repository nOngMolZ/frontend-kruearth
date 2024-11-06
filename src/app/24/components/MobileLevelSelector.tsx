import React from "react";
import { Button } from "@/components/ui/button";

interface MobileLevelSelectorProps {
	level: string;
	onLevelChange: (newLevel: string) => void;
}

const MobileLevelSelector: React.FC<MobileLevelSelectorProps> = ({
	level,
	onLevelChange,
}) => {
	return (
		<div className="flex justify-center gap-2 mb-4">
			<Button
				variant={level === "easy" ? "secondary" : "outline"}
				size="sm"
				onClick={() => onLevelChange("easy")}
			>
				ง่าย
			</Button>
			<Button
				variant={level === "medium" ? "secondary" : "outline"}
				size="sm"
				onClick={() => onLevelChange("medium")}
			>
				ปานกลาง
			</Button>
			<Button
				variant={level === "hard" ? "secondary" : "outline"}
				size="sm"
				onClick={() => onLevelChange("hard")}
			>
				ยาก
			</Button>
		</div>
	);
};

export default MobileLevelSelector;
