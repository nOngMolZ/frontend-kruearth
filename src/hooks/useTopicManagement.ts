import { useState, useEffect } from 'react';
import { Topic, TopicInput } from '@/types/Topic';
import { TopicApi } from '@/lib/TopicApi';

export const useTopicManagement = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const fetchedTopics = await TopicApi.getAllTopics();
      setTopics(fetchedTopics);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch topics');
      setIsLoading(false);
    }
  };

  const createTopic = async (data: TopicInput) => {
    try {
      const newTopic = await TopicApi.createTopic(data);
      setTopics((prevTopics) => [...prevTopics, newTopic]);
    } catch (err) {
      setError('Failed to create topic');
    }
  };

  const updateTopic = async (id: string, data: TopicInput) => {
    try {
      const updatedTopic = await TopicApi.updateTopic(id, data);
      setTopics((prevTopics) =>
        prevTopics.map((topic) => (topic._id === id ? updatedTopic : topic))
      );
    } catch (err) {
      setError('Failed to update topic');
    }
  };

  const deleteTopic = async (id: string) => {
    try {
      await TopicApi.deleteTopic(id);
      setTopics((prevTopics) => prevTopics.filter((topic) => topic._id !== id));
    } catch (err) {
      setError('Failed to delete topic');
    }
  };

  return { topics, isLoading, error, createTopic, updateTopic, deleteTopic };
};