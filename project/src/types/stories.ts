export type StorySegment = 'students' | 'women-home' | 'business';
export type StoryCategory = 'tech' | 'creative' | 'marketing' | 'business' | 'freelancing';

export type SuccessStory = {
  id: string;
  name: string;
  city: string;
  segment: StorySegment;
  category: StoryCategory;
  track_label: string;
  outcome: string;
  quote: string;
  photo_url: string;
  video_url: string | null;
  featured: boolean;
  approved_for_publish: boolean;
  submitter_email: string | null;
  created_at: string;
};

export type NewStorySubmission = {
  name: string;
  city: string;
  segment: StorySegment;
  category: StoryCategory;
  track_label: string;
  outcome: string;
  quote: string;
  photo_url: string;
  submitter_email?: string;
};
