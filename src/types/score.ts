export interface TopScore {
	_id: string;
	name: string;
	score: number;
	timeSpent: number;
}

export interface AllScore {
	_id: string;
	name: string;
	username: string;
	category: string;
	topic: string;
	subtopic: string;
	score: number;
	createOn: string;
}

export interface ScoreInput {
	userId: string;
	subtopicId: string;
	score: number;
	timeSpent: number;
}
