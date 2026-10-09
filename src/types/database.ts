export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'creator' | 'brand' | 'agency' | 'admin';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type BriefStatus = 'draft' | 'published' | 'in_review' | 'assigned' | 'completed' | 'cancelled';
export type ProposalStatus = 'submitted' | 'shortlisted' | 'accepted' | 'declined' | 'withdrawn';
export type EngagementStatus = 'active' | 'in_review' | 'completed' | 'disputed' | 'cancelled';
export type DeliveryStatus = 'submitted' | 'revision_requested' | 'accepted' | 'rejected';
export type RevisionStatus = 'pending' | 'in_progress' | 'resolved';
export type EvidenceType = 'screen_recording' | 'prompt_history' | 'source_file' | 'generation_log';
export type EvidenceReviewStatus = 'submitted' | 'under_review' | 'verified' | 'rejected';
export type AssetType = 'image' | 'video' | 'audio' | 'text' | 'document' | 'other';
export type SkillCategory = 'video_generation' | 'image_generation' | 'audio_generation' | 'prompt_crafting' | 'post_production' | 'workflow_automation';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          email: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: UserRole;
          full_name: string;
          email: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          email?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      creator_profiles: {
        Row: {
          id: string;
          profile_id: string;
          handle: string;
          bio: string | null;
          specialization: string | null;
          hourly_rate: number | null;
          availability_status: string;
          proof_score: number;
          is_verified: boolean;
          verification_status: VerificationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          handle: string;
          bio?: string | null;
          specialization?: string | null;
          hourly_rate?: number | null;
          availability_status?: string;
          proof_score?: number;
          is_verified?: boolean;
          verification_status?: VerificationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          handle?: string;
          bio?: string | null;
          specialization?: string | null;
          hourly_rate?: number | null;
          availability_status?: string;
          proof_score?: number;
          is_verified?: boolean;
          verification_status?: VerificationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      brand_profiles: {
        Row: {
          id: string;
          profile_id: string;
          company_name: string;
          website: string | null;
          industry: string | null;
          company_size: string | null;
          billing_email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          company_name: string;
          website?: string | null;
          industry?: string | null;
          company_size?: string | null;
          billing_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          company_name?: string;
          website?: string | null;
          industry?: string | null;
          company_size?: string | null;
          billing_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category: SkillCategory;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category: SkillCategory;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          category?: SkillCategory;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_tools: {
        Row: {
          id: string;
          name: string;
          slug: string;
          vendor: string | null;
          website: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          vendor?: string | null;
          website?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          vendor?: string | null;
          website?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      creator_skills: {
        Row: {
          id: string;
          creator_id: string;
          skill_id: string;
          endorsement_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          skill_id: string;
          endorsement_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          skill_id?: string;
          endorsement_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      creator_tools: {
        Row: {
          id: string;
          creator_id: string;
          tool_id: string;
          proficiency_level: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          tool_id: string;
          proficiency_level?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          tool_id?: string;
          proficiency_level?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      portfolio_projects: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          is_public: boolean;
          commercial_rights_cleared: boolean;
          proof_score_contribution: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description?: string | null;
          is_public?: boolean;
          commercial_rights_cleared?: boolean;
          proof_score_contribution?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          description?: string | null;
          is_public?: boolean;
          commercial_rights_cleared?: boolean;
          proof_score_contribution?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      portfolio_assets: {
        Row: {
          id: string;
          project_id: string;
          asset_type: AssetType;
          storage_path: string;
          public_url: string | null;
          duration_seconds: number | null;
          resolution: string | null;
          generation_prompt: string | null;
          generation_model: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          asset_type: AssetType;
          storage_path: string;
          public_url?: string | null;
          duration_seconds?: number | null;
          resolution?: string | null;
          generation_prompt?: string | null;
          generation_model?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          asset_type?: AssetType;
          storage_path?: string;
          public_url?: string | null;
          duration_seconds?: number | null;
          resolution?: string | null;
          generation_prompt?: string | null;
          generation_model?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      portfolio_project_tools: {
        Row: {
          project_id: string;
          tool_id: string;
        };
        Insert: {
          project_id: string;
          tool_id: string;
        };
        Update: {
          project_id?: string;
          tool_id?: string;
        };
        Relationships: [];
      };
      briefs: {
        Row: {
          id: string;
          brand_id: string;
          title: string;
          description: string | null;
          deliverables_description: string | null;
          budget_min: number | null;
          budget_max: number | null;
          currency: string;
          estimated_duration_days: number | null;
          deadline: string | null;
          target_audience: string | null;
          preferred_style: string | null;
          commercial_license_required: boolean;
          status: BriefStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand_id: string;
          title: string;
          description?: string | null;
          deliverables_description?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          currency?: string;
          estimated_duration_days?: number | null;
          deadline?: string | null;
          target_audience?: string | null;
          preferred_style?: string | null;
          commercial_license_required?: boolean;
          status?: BriefStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand_id?: string;
          title?: string;
          description?: string | null;
          deliverables_description?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          currency?: string;
          estimated_duration_days?: number | null;
          deadline?: string | null;
          target_audience?: string | null;
          preferred_style?: string | null;
          commercial_license_required?: boolean;
          status?: BriefStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      brief_required_skills: {
        Row: {
          brief_id: string;
          skill_id: string;
        };
        Insert: {
          brief_id: string;
          skill_id: string;
        };
        Update: {
          brief_id?: string;
          skill_id?: string;
        };
        Relationships: [];
      };
      proposals: {
        Row: {
          id: string;
          brief_id: string;
          creator_id: string;
          cover_letter: string;
          proposed_rate: number;
          estimated_delivery_days: number;
          relevant_portfolio_project_id: string | null;
          status: ProposalStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brief_id: string;
          creator_id: string;
          cover_letter: string;
          proposed_rate: number;
          estimated_delivery_days: number;
          relevant_portfolio_project_id?: string | null;
          status?: ProposalStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brief_id?: string;
          creator_id?: string;
          cover_letter?: string;
          proposed_rate?: number;
          estimated_delivery_days?: number;
          relevant_portfolio_project_id?: string | null;
          status?: ProposalStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      engagements: {
        Row: {
          id: string;
          brief_id: string;
          proposal_id: string;
          brand_id: string;
          creator_id: string;
          agreed_rate: number;
          deadline: string | null;
          status: EngagementStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brief_id: string;
          proposal_id: string;
          brand_id: string;
          creator_id: string;
          agreed_rate: number;
          deadline?: string | null;
          status?: EngagementStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brief_id?: string;
          proposal_id?: string;
          brand_id?: string;
          creator_id?: string;
          agreed_rate?: number;
          deadline?: string | null;
          status?: EngagementStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      deliveries: {
        Row: {
          id: string;
          engagement_id: string;
          submission_notes: string | null;
          asset_storage_path: string;
          status: DeliveryStatus;
          submitted_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          engagement_id: string;
          submission_notes?: string | null;
          asset_storage_path: string;
          status?: DeliveryStatus;
          submitted_at?: string;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          engagement_id?: string;
          submission_notes?: string | null;
          asset_storage_path?: string;
          status?: DeliveryStatus;
          submitted_at?: string;
          reviewed_at?: string | null;
        };
        Relationships: [];
      };
      revision_requests: {
        Row: {
          id: string;
          delivery_id: string;
          feedback_notes: string;
          status: RevisionStatus;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          delivery_id: string;
          feedback_notes: string;
          status?: RevisionStatus;
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          delivery_id?: string;
          feedback_notes?: string;
          status?: RevisionStatus;
          created_at?: string;
          resolved_at?: string | null;
        };
        Relationships: [];
      };
      verification_evidence: {
        Row: {
          id: string;
          creator_id: string;
          portfolio_project_id: string | null;
          evidence_type: EvidenceType;
          storage_path: string;
          notes: string | null;
          review_status: EvidenceReviewStatus;
          reviewer_notes: string | null;
          submitted_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          creator_id: string;
          portfolio_project_id?: string | null;
          evidence_type: EvidenceType;
          storage_path: string;
          notes?: string | null;
          review_status?: EvidenceReviewStatus;
          reviewer_notes?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          creator_id?: string;
          portfolio_project_id?: string | null;
          evidence_type?: EvidenceType;
          storage_path?: string;
          notes?: string | null;
          review_status?: EvidenceReviewStatus;
          reviewer_notes?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      public_profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          avatar_url: string | null;
          created_at: string;
        };
        Relationships: [];
      };
      public_brand_profiles: {
        Row: {
          id: string;
          profile_id: string;
          company_name: string;
          website: string | null;
          industry: string | null;
          company_size: string | null;
          created_at: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      get_my_creator_profile_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_my_brand_profile_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      verification_status: VerificationStatus;
      brief_status: BriefStatus;
      proposal_status: ProposalStatus;
      engagement_status: EngagementStatus;
      delivery_status: DeliveryStatus;
      revision_status: RevisionStatus;
      evidence_type: EvidenceType;
      evidence_review_status: EvidenceReviewStatus;
      asset_type: AssetType;
      skill_category: SkillCategory;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
