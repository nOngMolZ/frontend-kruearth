"use client";
import SubtopicManagementPage from "@/app/topic/subtopic/subTableComponents/SubTopicManagement";

interface PageProps {
	params: {
		topicId: string;
	};
}

const Page: React.FC<PageProps> = ({ params }) => {
	const { topicId } = params;
	return <SubtopicManagementPage topicId={topicId} />;
};

export default Page;
