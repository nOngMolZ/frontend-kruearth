export interface Subtopic {
	_id: string;
	subtopicName: string;
	time: number;
	category: string;
	topicId: string;
	topicName: string;
}

export interface SubtopicInput {
	_id: string;
	subtopicName: string;
	time: number;
	category: string;
	topicId: string;
}
