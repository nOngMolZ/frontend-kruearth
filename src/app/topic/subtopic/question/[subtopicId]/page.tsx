"use client";

import React from "react";
import QuestionManagement from "../QuestionTableComponents/QuestionManagement";

interface PageProps {
	params: {
		subtopicId: string;
	};
}

const Page: React.FC<PageProps> = ({ params }) => {
	const { subtopicId } = params;
	return (
		<QuestionManagement
			subtopicId={subtopicId}
			topicId=""
			topicName=""
			createOn="2023-09-01"
		/>
	);
};

export default Page;
