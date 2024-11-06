export interface Topic {
  _id: string;  // MongoDB document ID
  topicName: string;
  category: string;
}

export interface TopicInput {
  topicName: string;
  category: string;
}
