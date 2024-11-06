import axiosInstance from './axiosInstance';
import { Topic, TopicInput } from '@/types/Topic';
import { AxiosError } from 'axios';

interface ApiResponse<T> {
  message: string;
  data: T;
}

export class TopicApi {
  static async getTopicById(id: string): Promise<Topic> {
    try {
      const response = await axiosInstance.get<ApiResponse<Topic>>(`/topics/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching topic:", error);
      throw error;
    }
  }

  static async getAllTopics(): Promise<Topic[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<Topic[]>>('/topics');
      return response.data.data;
    } catch (error) {
      console.error("Error fetching all topics:", error);
      throw error;
    }
  }

  static async createTopic(data: TopicInput): Promise<Topic> {
    try {
      const response = await axiosInstance.post<ApiResponse<Topic>>('/topics/create', data);
      return response.data.data;
    } catch (error) {
      console.error("Error creating topic:", error);
      throw error;
    }
  }

  static async updateTopic(id: string, data: TopicInput): Promise<Topic> {
    try {
      const response = await axiosInstance.put<ApiResponse<Topic>>(`/topics/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error("Error updating topic:", error);
      throw error;
    }
  }

  static async deleteTopic(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/topics/${id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          console.error(`Topic with id ${id} not found`);
        } else {
          console.error("Error deleting topic:", error.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  }
}