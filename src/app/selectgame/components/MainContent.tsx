import React, { useState } from "react";
import { Tabs, Tab, Card } from "@mui/material";
import Button from "@mui/joy/Button";
import { Topic } from "@/types/Topic";
import { TopicApi } from "@/lib/TopicApi";
import SubtopicModal from "@/app/selectgame/components/SubtopicModal";
import { useRouter } from "next/navigation";

type TabValue = 0 | 1;

const SubjectItem: React.FC<{ topic: Topic; onClick: () => void }> = ({
	topic,
	onClick,
}) => (
	<li className="flex justify-center mb-5">
		<Button
			color="neutral"
			onClick={onClick}
			size="lg"
			variant="soft"
			fullWidth
			sx={{
				maxWidth: "80%",
				backgroundColor: "#fed7aa",
				justifyContent: "center",
				padding: "10px 20px",
				"&:hover": {
					backgroundColor: "#fdba74",
				},
			}}
		>
			{topic.topicName}
		</Button>
	</li>
);

const SubjectList: React.FC<{
	topics: Topic[];
	onTopicClick: (topic: Topic) => void;
}> = ({ topics, onTopicClick }) => (
	<ul className="flex flex-col w-full pr-4">
		{topics.map((topic) => (
			<SubjectItem
				key={topic._id}
				topic={topic}
				onClick={() => onTopicClick(topic)}
			/>
		))}
	</ul>
);

const TabPanel: React.FC<{
	children: React.ReactNode;
	value: TabValue;
	index: TabValue;
}> = ({ children, value, index }) => (
	<div
		hidden={value !== index}
		role="tabpanel"
		className={`flex h-full w-full flex-col ${value !== index ? "hidden" : ""}`}
	>
		{value === index && children}
	</div>
);

const MainContent: React.FC = () => {
	const [tabValue, setTabValue] = useState<TabValue>(0);
	const [topics, setTopics] = useState<Topic[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const router = useRouter();

	const game24 = () => router.push(`/24`);
	const fastMath = () => router.push(`/game/66f54da5b7e39f5480d16cce`);

	React.useEffect(() => {
		const fetchTopics = async () => {
			try {
				const fetchedTopics = await TopicApi.getAllTopics();
				setTopics(fetchedTopics);
			} catch (error) {
				console.error("Error fetching topics:", error);
			}
		};

		fetchTopics();
	}, []);

	const handleChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
		setTabValue(newValue);
	};

	const handleTopicClick = (topic: Topic) => {
		setSelectedTopic(topic);
		setIsModalOpen(true);
	};

	const filterTopicsByCategory = (category: string) => {
		return topics.filter(
			(topic) =>
				topic.category === category && topic._id !== "66f66af778ff4fe3b7930359"
		);
	};

	return (
		<>
			<div className="flex flex-col p-4 rounded min-h-5/6 min-w-4/5 w-11/12 sm:w-4/5 md:w-3/4 lg:w-3/5 bg-white">
				<div className="flex justify-center mb-6 pb-2 border-b">
					<Tabs
						value={tabValue}
						onChange={handleChange}
						aria-label="Course tabs"
						sx={{
							"& .MuiTabs-indicator": {
								backgroundColor: "#c2410c",
								color: "#c2410c",
								height: "3px",
							},
						}}
					>
						<Tab
							label="วิชาการ"
							sx={{
								fontWeight: "bold",
								"&.Mui-selected": {
									color: "#c2410c",
								},
								"&.Mui-focusVisible": {
									backgroundColor: "rgba(194, 65, 12, 0.5)",
								},
							}}
						/>
						<Tab
							label="บันเทิง"
							sx={{
								fontWeight: "bold",
								"&.Mui-selected": {
									color: "#c2410c",
								},
								"&.Mui-focusVisible": {
									backgroundColor: "rgba(194, 64, 12, 0.5)",
								},
								marginLeft: "30px",
							}}
						/>
					</Tabs>
				</div>

				<div className="flex flex-col bg-primary/20 p-4 rounded-lg h-full overflow-y-scroll">
					<TabPanel value={tabValue} index={0}>
						{/* กรอง category ที่เป็น "วิชาการ" */}
						<SubjectList
							topics={filterTopicsByCategory("วิชาการ")}
							onTopicClick={handleTopicClick}
						/>
					</TabPanel>

					<TabPanel value={tabValue} index={1}>
						{/* กรอง category ที่เป็น "บันเทิง" */}
						<div className="flex justify-center w-full items-center pr-4">
							<li className="flex justify-center mb-5 w-full">
								<Button
									color="neutral"
									onClick={fastMath}
									size="lg"
									variant="soft"
									fullWidth
									sx={{
										maxWidth: "80%",
										backgroundColor: "#fed7aa",
										justifyContent: "center",
										padding: "10px 20px",
										"&:hover": {
											backgroundColor: "#fdba74",
										},
									}}
								>
									เกมคณิตคิดเร็ว
								</Button>
							</li>
						</div>
						<div className="flex justify-center w-full items-center pr-4">
							<li className="flex justify-center mb-5 w-full">
								<Button
									color="neutral"
									onClick={game24}
									size="lg"
									variant="soft"
									fullWidth
									sx={{
										maxWidth: "80%",
										backgroundColor: "#fed7aa",
										justifyContent: "center",
										padding: "10px 20px",
										"&:hover": {
											backgroundColor: "#fdba74",
										},
									}}
								>
									เกม24
								</Button>
							</li>
						</div>

						<SubjectList
							topics={filterTopicsByCategory("บันเทิง")}
							onTopicClick={handleTopicClick}
						/>
					</TabPanel>
				</div>
			</div>

			{selectedTopic && (
				<SubtopicModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					topic={selectedTopic}
				/>
			)}
		</>
	);
};

export default MainContent;
