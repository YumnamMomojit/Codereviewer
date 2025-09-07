export interface FeedbackItem {
  line: number;
  comment: string;
}

export interface CodeReviewFeedback {
  overall_assessment: string;
  potential_bugs: FeedbackItem[];
  style_suggestions: FeedbackItem[];
  best_practices: FeedbackItem[];
}

export interface ReviewHistoryItem {
  id: number;
  code: string;
  language: string;
  review: CodeReviewFeedback;
  timestamp: string;
}
