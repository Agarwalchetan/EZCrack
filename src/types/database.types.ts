export type UserRole = 'admin' | 'user';
export type PlanType = 'free' | 'pro' | 'business' | 'enterprise';
export type ProjectRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan_type: PlanType;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Canvas {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  canvas_data: any;
  thumbnail_url: string | null;
  is_public: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  invited_by: string;
  joined_at: string;
}

export interface CanvasVersion {
  id: string;
  canvas_id: string;
  version_number: number;
  canvas_data: any;
  created_by: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: PlanType;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  type: 'bug' | 'feature' | 'feedback';
  title: string;
  description: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: any;
  created_at: string;
}
