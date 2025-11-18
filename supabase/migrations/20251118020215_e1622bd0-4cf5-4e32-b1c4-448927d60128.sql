-- Create course_favorites table
CREATE TABLE public.course_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create course_progress table
CREATE TABLE public.course_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed BOOLEAN NOT NULL DEFAULT false,
  last_accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.course_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_favorites
CREATE POLICY "Users can view their own favorites"
ON public.course_favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
ON public.course_favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
ON public.course_favorites FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for course_progress
CREATE POLICY "Users can view their own progress"
ON public.course_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress"
ON public.course_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.course_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for course_progress updated_at
CREATE TRIGGER update_course_progress_updated_at
BEFORE UPDATE ON public.course_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();