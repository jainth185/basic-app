
import axios from 'axios';
import { QuizQuestion } from '../../../types/quizTypes';

export async function fetchQuizData(): Promise<QuizQuestion[]> {
  try {
    const response = await axios.get(
      'https://api.storyblok.com/v1/cdn/stories/questions',
      {
        params: {
          token: 'LylmZFRCZKItDS4TcaFwkwtt',
        },
      }
    );
    // The actual data might be nested within the response, adjust accordingly
    return response.data.story.content.questions;
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    return [];
  }
}
