import axiosInstance from "./axiosInstance";
import { Question, QuestionInput } from "@/types/Question";

interface ApiResponse<T> {
	message: string;
	data: T;
}

export class QuestionApi {
	static async getQuestionsBySubtopicId(
		subtopicId: string
	): Promise<Question[]> {
		try {
			const response = await axiosInstance.get<ApiResponse<Question[]>>(
				`/questions/subtopic/${subtopicId}`
			);

			return response.data.data;
		} catch (error) {
			console.error("Error fetching questions for subtopic:", error);
			throw error;
		}
	}

	static async createQuestion(newQuestion: QuestionInput): Promise<Question> {
		try {
		  const questionWithTimestamp = {
			...newQuestion,
			createOn: newQuestion.createOn || new Date().toISOString(),
		  };
		  const response = await axiosInstance.post<ApiResponse<Question>>(
			"/questions",
			questionWithTimestamp
		  );
		  return response.data.data;
		} catch (error) {
		  console.error("Error creating question:", error);
		  throw error;
		}
	  }

	static async updateQuestion(
		questionId: string,
		updatedQuestion: QuestionInput
	): Promise<Question> {
		try {
			const response = await axiosInstance.put<ApiResponse<Question>>(
				`/questions/${questionId}`,
				updatedQuestion
			);
			return response.data.data;
		} catch (error) {
			console.error("Error updating question:", error);
			throw error;
		}
	}

	static async deleteQuestion(questionId: string): Promise<void> {
		try {
			await axiosInstance.delete(`/questions/${questionId}`);
		} catch (error) {
			console.error("Error deleting question:", error);
			throw error;
		}
	}
}
