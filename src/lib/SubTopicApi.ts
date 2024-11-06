import axiosInstance from "./axiosInstance";
import { Subtopic, SubtopicInput } from "@/types/SubTopic";
import { AxiosError } from "axios";

interface ApiResponse<T> {
	message: string;
	data: T;
}

export class SubTopicApi {
	static async getSubtopicById(id: string): Promise<Subtopic> {
		try {
			const response = await axiosInstance.get<ApiResponse<Subtopic>>(
				`/subtopics/${id}`
			);
			return response.data.data;
		} catch (error) {
			console.error("Error fetching subtopic:", error);
			throw error;
		}
	}

	static async getAllSubtopicsByTopicId(topicId: string): Promise<Subtopic[]> {
		try {
			const response = await axiosInstance.get<ApiResponse<Subtopic[]>>(
				`/subtopics/topic/${topicId}`
			);
			return response.data.data;
		} catch (error) {
			console.error("Error fetching subtopics for topic:", error);
			throw error;
		}
	}

	static async createSubtopic(data: SubtopicInput): Promise<Subtopic> {
		try {
			const response = await axiosInstance.post<ApiResponse<Subtopic>>(
				"/subtopics/create",
				data
			);
			return response.data.data;
		} catch (error) {
			console.error("Error creating subtopic:", error);
			throw error;
		}
	}

	static async updateSubtopic(
		id: string,
		data: SubtopicInput
	): Promise<Subtopic> {
		try {
			const response = await axiosInstance.put<ApiResponse<Subtopic>>(
				`/subtopics/${id}`,
				data
			);
			return response.data.data;
		} catch (error) {
			console.error("Error updating subtopic:", error);
			throw error;
		}
	}

	static async deleteSubtopic(id: string): Promise<void> {
		try {
			await axiosInstance.delete(`/subtopics/${id}`);
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response?.status === 404) {
					console.error(`Subtopic with id ${id} not found`);
				} else {
					console.error("Error deleting subtopic:", error.message);
				}
			} else {
				console.error("Unexpected error:", error);
			}
			throw error;
		}
	}
}
