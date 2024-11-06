import axiosInstance from "./axiosInstance";
import { AllScore, ScoreInput, TopScore } from "@/types/score";

// Get top 10 scores for a subtopic
export async function getTopScore(
	subtopicId: string
): Promise<TopScore[] | undefined> {
	try {
		const response = await axiosInstance.get(`/scores/top/${subtopicId}`);
		return response.data.data;
	} catch (error: any) {
		console.log("Failed to get top 10 score:", error.response?.data || error.message);
		return undefined;
	}
}

// Get all scores
export async function getAllScore(): Promise<AllScore[] | undefined> {
	try {
		const response = await axiosInstance.get("/scores");
		return response.data.data;
	} catch (error: any) {
		console.log("Failed to get all scores:", error.response?.data || error.message);
		return undefined;
	}
}

// Create a new score
export async function createScore(scoreInput: ScoreInput): Promise<string> {
	try {
	  console.log("Attempting to create score with input:", scoreInput);
	  
	  // ตรวจสอบว่ามีการส่งค่า userId มาหรือไม่
	  if (!scoreInput.userId) {
		console.error("Error: Missing userId in scoreInput");
		return "Failed to create score: Missing userId";
	  }
	  
	  const response = await axiosInstance.post("/scores", scoreInput);
	  console.log("Create score response:", response.data);
	  return "Create score success";
	} catch (error: any) {
	  console.error("Failed to create score:", error);
	  console.error("Error response:", error.response?.data);
	  console.error("Error message:", error.message);
	  return "Failed to create score";
	}
  }

// Update an existing score
export async function updateScore(scoreId: string, updatedScore: { score: number }): Promise<string> {
	try {
		console.log(`Updating score with ID: ${scoreId}`, updatedScore);
		await axiosInstance.patch(`/scores/${scoreId}`, updatedScore);
		return `Update score success`;
	} catch (error: any) {
		console.log(`Failed to update score:`, error.response?.data || error.message);
		return `Failed to update score`;
	}
}

// Delete a score
export async function deleteScore(scoreId: string): Promise<string> {
	try {
		await axiosInstance.delete(`/scores/${scoreId}`);
		return `Delete score id ${scoreId} success`;
	} catch (error: any) {
		console.log(`Failed to delete score with id ${scoreId}:`, error.response?.data || error.message);
		return `Failed to delete score with id ${scoreId}`;
	}
}
