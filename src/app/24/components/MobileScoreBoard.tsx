import React from "react";
import Score from "./score";

interface MobileScoreBoardProps {
	level: string;
	IsEnd: boolean;
}

const MobileScoreBoard: React.FC<MobileScoreBoardProps> = ({
	level,
	IsEnd,
}) => {
	return (
		<div className="mt-4 w-full">
			<Score level={level} IsEnd={IsEnd} />
		</div>
	);
};

export default MobileScoreBoard;
