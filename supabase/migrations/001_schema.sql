-- ==============================================================================
-- Migration: 001_schema.sql
-- Project: CreatorProof AI — AI Content Creator Marketplace
-- Description: Core 17-table normalized PostgreSQL relational schema
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
CREATE TYPE public.user_role AS ENUM (
    'creator',
    'brand',
    'agency',
    'admin'
);

CREATE TYPE public.availability_status AS ENUM (
    'available',
    'busy',
    'not_available'
);

CREATE TYPE public.proficiency_level AS ENUM (
    'beginner',
    'intermediate',
    'expert'
);

CREATE TYPE public.tool_type AS ENUM (
    'image_generation',
    'video_generation',
    'audio_voice',
    'llm_text',
    'workflow_engine'
);

CREATE TYPE public.asset_media_type AS ENUM (
    'image',
    'video',
    'audio',
    'document'
);

CREATE TYPE public.brief_status AS ENUM (
    'draft',
    'published',
    'in_review',
    'completed',
    'cancelled'
);

CREATE TYPE public.proposal_status AS ENUM (
    'submitted',
    'under_review',
    'accepted',
    'rejected',
    'withdrawn'
);

CREATE TYPE public.engagement_status AS ENUM (
    'pending',
    'active',
    'delivered',
    'revision_requested',
    'completed',
    'cancelled'
);

CREATE TYPE public.delivery_status AS ENUM (
    'submitted',
    'approved',
    'rejected'
);

CREATE TYPE public.revision_status AS ENUM (
    'open',
    'in_progress',
    'resolved'
);

CREATE TYPE public.verification_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = pg_catalog.now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- 4. USER MANAGEMENT TABLES

-- 4.1 Profiles (linked 1:1 with auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role public.user_role NOT NULL DEFAULT 'creator',
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.2 Creator Profiles (extension for creators)
CREATE TABLE public.creator_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    handle TEXT NOT NULL UNIQUE,
    tagline TEXT,
    bio TEXT,
    specialization TEXT NOT NULL,
    availability public.availability_status NOT NULL DEFAULT 'available',
    hourly_rate NUMERIC(10, 2) CHECK (hourly_rate IS NULL OR hourly_rate >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    experience_years INTEGER NOT NULL DEFAULT 1 CHECK (experience_years >= 0),
    country TEXT,
    proof_score INTEGER DEFAULT NULL CHECK (proof_score IS NULL OR (proof_score BETWEEN 0 AND 100)),
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.3 Brand Profiles (extension for brands and agencies)
CREATE TABLE public.brand_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    website TEXT,
    industry TEXT,
    company_size TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    billing_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. CREATOR CAPABILITIES TAXONOMIES

-- 5.1 Skills (Master skills taxonomy)
CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5.2 AI Tools (Master generative AI tool registry)
CREATE TABLE public.ai_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    vendor TEXT,
    tool_type public.tool_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5.3 Creator Skills (Junction Table M:N)
CREATE TABLE public.creator_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_profile_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency public.proficiency_level NOT NULL DEFAULT 'intermediate',
    years_experience NUMERIC(3, 1) DEFAULT 1.0 CHECK (years_experience IS NULL OR years_experience >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (creator_profile_id, skill_id)
);

-- 5.4 Creator Tools (Junction Table M:N)
CREATE TABLE public.creator_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_profile_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL REFERENCES public.ai_tools(id) ON DELETE CASCADE,
    proficiency public.proficiency_level NOT NULL DEFAULT 'intermediate',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (creator_profile_id, tool_id)
);

-- 6. AI PORTFOLIOS & ASSET METADATA

-- 6.1 Portfolio Projects (Showcase items with prompt and workflow metadata)
CREATE TABLE public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_profile_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL,
    workflow_description TEXT,
    prompt_sample TEXT,
    models_used TEXT[] NOT NULL DEFAULT '{}',
    is_commercial_licensed BOOLEAN NOT NULL DEFAULT false,
    license_type TEXT,
    is_public BOOLEAN NOT NULL DEFAULT false,
    completion_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (creator_profile_id, slug)
);

-- 6.2 Portfolio Assets (Images and videos attached to projects)
CREATE TABLE public.portfolio_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
    asset_url TEXT NOT NULL,
    thumbnail_url TEXT,
    asset_type public.asset_media_type NOT NULL,
    mime_type TEXT NOT NULL,
    aspect_ratio TEXT,
    resolution TEXT,
    duration_seconds NUMERIC(6, 2) CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
    file_size_bytes BIGINT CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6.3 Portfolio Project Tools (Junction Table M:N)
CREATE TABLE public.portfolio_project_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL REFERENCES public.ai_tools(id) ON DELETE CASCADE,
    role_in_project TEXT,
    UNIQUE (project_id, tool_id)
);

-- 7. BRAND CREATIVE BRIEFS

-- 7.1 Briefs (Campaign briefs published by brands)
CREATE TABLE public.briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_profile_id UUID NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    style_aesthetic TEXT,
    content_type TEXT,
    duration_seconds NUMERIC(6, 2) CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
    aspect_ratio TEXT,
    budget NUMERIC(10, 2) CHECK (budget IS NULL OR budget >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    deadline TIMESTAMPTZ,
    commercial_requirements TEXT,
    licensing_terms TEXT,
    is_private BOOLEAN NOT NULL DEFAULT false,
    status public.brief_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT check_published_brief_fields CHECK (
        status != 'published' OR (
            budget IS NOT NULL AND
            content_type IS NOT NULL AND
            deadline IS NOT NULL
        )
    )
);

-- 7.2 Brief Required Skills (Junction Table M:N)
CREATE TABLE public.brief_required_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brief_id UUID NOT NULL REFERENCES public.briefs(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (brief_id, skill_id)
);

-- 8. COLLABORATION (PROPOSALS, ENGAGEMENTS, DELIVERIES, REVISIONS)

-- 8.1 Proposals (Creator pitches for briefs)
CREATE TABLE public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brief_id UUID NOT NULL REFERENCES public.briefs(id) ON DELETE CASCADE,
    creator_profile_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
    pitch TEXT NOT NULL,
    proposed_budget NUMERIC(10, 2) NOT NULL CHECK (proposed_budget >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    estimated_delivery_days INTEGER NOT NULL DEFAULT 5 CHECK (estimated_delivery_days > 0),
    status public.proposal_status NOT NULL DEFAULT 'submitted',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (brief_id, creator_profile_id)
);

-- 8.2 Engagements (Active contractual agreements)
CREATE TABLE public.engagements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brief_id UUID REFERENCES public.briefs(id) ON DELETE SET NULL,
    brand_profile_id UUID NOT NULL REFERENCES public.brand_profiles(id) ON DELETE RESTRICT,
    creator_profile_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE RESTRICT,
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
    agreed_amount NUMERIC(10, 2) NOT NULL CHECK (agreed_amount >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    terms TEXT,
    status public.engagement_status NOT NULL DEFAULT 'pending',
    start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8.3 Deliveries (Milestone work asset submissions)
CREATE TABLE public.deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id UUID NOT NULL REFERENCES public.engagements(id) ON DELETE CASCADE,
    creator_profile_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE RESTRICT,
    version_number INTEGER NOT NULL DEFAULT 1 CHECK (version_number >= 1),
    notes TEXT,
    asset_urls TEXT[] NOT NULL DEFAULT '{}',
    status public.delivery_status NOT NULL DEFAULT 'submitted',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMPTZ
);

-- 8.4 Revision Requests (Brand feedback on deliveries)
CREATE TABLE public.revision_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id UUID NOT NULL REFERENCES public.deliveries(id) ON DELETE CASCADE,
    brand_profile_id UUID NOT NULL REFERENCES public.brand_profiles(id) ON DELETE RESTRICT,
    feedback TEXT NOT NULL,
    requested_changes JSONB NOT NULL DEFAULT '[]'::jsonb,
    status public.revision_status NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- 9. CREATOR TRUST & VERIFICATION

-- 9.1 Verification Evidence (Authenticity audit logs and cryptographic proof)
CREATE TABLE public.verification_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_profile_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
    evidence_type TEXT NOT NULL,
    provider TEXT,
    external_id TEXT,
    evidence_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    proof_hash TEXT,
    status public.verification_status NOT NULL DEFAULT 'pending',
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_notes TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMPTZ
);

-- 10. ATTACH AUTOMATIC UPDATED_AT TRIGGERS
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_creator_profiles_updated_at
    BEFORE UPDATE ON public.creator_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_brand_profiles_updated_at
    BEFORE UPDATE ON public.brand_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_portfolio_projects_updated_at
    BEFORE UPDATE ON public.portfolio_projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_briefs_updated_at
    BEFORE UPDATE ON public.briefs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_proposals_updated_at
    BEFORE UPDATE ON public.proposals
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_engagements_updated_at
    BEFORE UPDATE ON public.engagements
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
