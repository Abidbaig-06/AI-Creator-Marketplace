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
-- ==============================================================================
-- Migration: 002_policies.sql
-- Project: CreatorProof AI — AI Content Creator Marketplace
-- Description: Hardened Row-Level Security (RLS) policies, security definer guards,
--              column-level privacy views, and explicit WITH CHECK constraints.
-- ==============================================================================

-- 1. SECURITY DEFINER HELPER FUNCTIONS (Pinned search_path, Non-Recursive)

-- Check if current authenticated user has 'admin' role in public.profiles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    current_user_id UUID;
    is_platform_admin BOOLEAN;
BEGIN
    current_user_id := auth.uid();
    IF current_user_id IS NULL THEN
        RETURN false;
    END IF;

    SELECT (role = 'admin')
    INTO is_platform_admin
    FROM public.profiles
    WHERE id = current_user_id;

    RETURN COALESCE(is_platform_admin, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = '';

-- Get creator_profile_id for current authenticated user
CREATE OR REPLACE FUNCTION public.get_my_creator_profile_id()
RETURNS UUID AS $$
DECLARE
    current_user_id UUID;
    matched_id UUID;
BEGIN
    current_user_id := auth.uid();
    IF current_user_id IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT id INTO matched_id
    FROM public.creator_profiles
    WHERE profile_id = current_user_id
    LIMIT 1;

    RETURN matched_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = '';

-- Get brand_profile_id for current authenticated user
CREATE OR REPLACE FUNCTION public.get_my_brand_profile_id()
RETURNS UUID AS $$
DECLARE
    current_user_id UUID;
    matched_id UUID;
BEGIN
    current_user_id := auth.uid();
    IF current_user_id IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT id INTO matched_id
    FROM public.brand_profiles
    WHERE profile_id = current_user_id
    LIMIT 1;

    RETURN matched_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = '';

-- Restrict function execution permissions to minimum required roles
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_my_creator_profile_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_creator_profile_id() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_my_brand_profile_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_brand_profile_id() TO authenticated;

-- 2. PRIVILEGE ESCALATION GUARDS & TRIGGERS

-- Prevent ordinary users from altering their security role
CREATE OR REPLACE FUNCTION public.check_profile_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.role IS DISTINCT FROM NEW.role) THEN
        IF NOT (public.is_admin()) THEN
            RAISE EXCEPTION 'Unauthorized: Users cannot modify their security role.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

REVOKE EXECUTE ON FUNCTION public.check_profile_role_escalation() FROM PUBLIC;

CREATE TRIGGER guard_profile_role
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.check_profile_role_escalation();

-- Prevent creators from updating proof_score or is_verified directly
CREATE OR REPLACE FUNCTION public.check_creator_trust_escalation()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.proof_score IS DISTINCT FROM NEW.proof_score OR OLD.is_verified IS DISTINCT FROM NEW.is_verified) THEN
        IF NOT (public.is_admin()) THEN
            RAISE EXCEPTION 'Unauthorized: Creator proof score and verification status can only be modified by platform administration.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

REVOKE EXECUTE ON FUNCTION public.check_creator_trust_escalation() FROM PUBLIC;

CREATE TRIGGER guard_creator_trust
    BEFORE UPDATE ON public.creator_profiles
    FOR EACH ROW EXECUTE FUNCTION public.check_creator_trust_escalation();

-- 3. ENABLE ROW-LEVEL SECURITY ON ALL 17 TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_project_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brief_required_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_evidence ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES: USER MANAGEMENT & EMAIL PRIVACY

-- 4.1 profiles
-- Direct table access allows reading ONLY the user's own profile row or admin.
-- Private email is protected from third-party authenticated and anonymous callers.
CREATE POLICY "profiles_select_own"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_insert_own"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id AND role != 'admin');

CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_delete_admin"
    ON public.profiles FOR DELETE
    USING (public.is_admin());

-- Public discovery view excluding private email
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT
    id,
    role,
    display_name,
    avatar_url,
    bio,
    created_at
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 4.2 creator_profiles
-- Public discovery is permitted because no private contact emails exist on this table.
CREATE POLICY "creator_profiles_select_public"
    ON public.creator_profiles FOR SELECT
    USING (true);

CREATE POLICY "creator_profiles_insert_own"
    ON public.creator_profiles FOR INSERT
    WITH CHECK (
        profile_id = auth.uid()
        AND is_verified = false
        AND proof_score IS NULL
    );

CREATE POLICY "creator_profiles_update_own"
    ON public.creator_profiles FOR UPDATE
    USING (profile_id = auth.uid() OR public.is_admin())
    WITH CHECK (profile_id = auth.uid() OR public.is_admin());

CREATE POLICY "creator_profiles_delete_own"
    ON public.creator_profiles FOR DELETE
    USING (profile_id = auth.uid() OR public.is_admin());

-- 4.3 brand_profiles
-- Direct table access is restricted to owner or admin to keep billing_email strictly private.
CREATE POLICY "brand_profiles_select_own"
    ON public.brand_profiles FOR SELECT
    USING (profile_id = auth.uid() OR public.is_admin());

CREATE POLICY "brand_profiles_insert_own"
    ON public.brand_profiles FOR INSERT
    WITH CHECK (profile_id = auth.uid() AND is_verified = false);

CREATE POLICY "brand_profiles_update_own"
    ON public.brand_profiles FOR UPDATE
    USING (profile_id = auth.uid() OR public.is_admin())
    WITH CHECK (profile_id = auth.uid() OR public.is_admin());

CREATE POLICY "brand_profiles_delete_own"
    ON public.brand_profiles FOR DELETE
    USING (profile_id = auth.uid() OR public.is_admin());

-- Public brand view excluding billing_email
CREATE OR REPLACE VIEW public.public_brand_profiles AS
SELECT
    id,
    profile_id,
    company_name,
    website,
    industry,
    company_size,
    is_verified,
    created_at
FROM public.brand_profiles;

GRANT SELECT ON public.public_brand_profiles TO anon, authenticated;

-- 5. POLICIES: CAPABILITIES TAXONOMIES

-- 5.1 skills
CREATE POLICY "skills_select_public"
    ON public.skills FOR SELECT
    USING (true);

CREATE POLICY "skills_insert_admin"
    ON public.skills FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "skills_update_admin"
    ON public.skills FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "skills_delete_admin"
    ON public.skills FOR DELETE
    USING (public.is_admin());

-- 5.2 ai_tools
CREATE POLICY "ai_tools_select_public"
    ON public.ai_tools FOR SELECT
    USING (true);

CREATE POLICY "ai_tools_insert_admin"
    ON public.ai_tools FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "ai_tools_update_admin"
    ON public.ai_tools FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "ai_tools_delete_admin"
    ON public.ai_tools FOR DELETE
    USING (public.is_admin());

-- 5.3 creator_skills
CREATE POLICY "creator_skills_select_public"
    ON public.creator_skills FOR SELECT
    USING (true);

CREATE POLICY "creator_skills_insert_own"
    ON public.creator_skills FOR INSERT
    WITH CHECK (creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin());

CREATE POLICY "creator_skills_update_own"
    ON public.creator_skills FOR UPDATE
    USING (creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin())
    WITH CHECK (creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin());

CREATE POLICY "creator_skills_delete_own"
    ON public.creator_skills FOR DELETE
    USING (creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin());

-- 5.4 creator_tools
CREATE POLICY "creator_tools_select_public"
    ON public.creator_tools FOR SELECT
    USING (true);

CREATE POLICY "creator_tools_insert_own"
    ON public.creator_tools FOR INSERT
    WITH CHECK (creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin());

CREATE POLICY "creator_tools_update_own"
    ON public.creator_tools FOR UPDATE
    USING (creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin())
    WITH CHECK (creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin());

CREATE POLICY "creator_tools_delete_own"
    ON public.creator_tools FOR DELETE
    USING (creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin());

-- 6. POLICIES: PORTFOLIOS & ASSETS

-- 6.1 portfolio_projects
CREATE POLICY "portfolio_projects_select"
    ON public.portfolio_projects FOR SELECT
    USING (
        is_public = true
        OR creator_profile_id = public.get_my_creator_profile_id()
        OR public.is_admin()
    );

CREATE POLICY "portfolio_projects_insert_own"
    ON public.portfolio_projects FOR INSERT
    WITH CHECK (creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin());

CREATE POLICY "portfolio_projects_update_own"
    ON public.portfolio_projects FOR UPDATE
    USING (creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin())
    WITH CHECK (creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin());

CREATE POLICY "portfolio_projects_delete_own"
    ON public.portfolio_projects FOR DELETE
    USING (creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin());

-- 6.2 portfolio_assets
CREATE POLICY "portfolio_assets_select"
    ON public.portfolio_assets FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.portfolio_projects p
            WHERE p.id = portfolio_assets.project_id
              AND (p.is_public = true OR p.creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin())
        )
    );

CREATE POLICY "portfolio_assets_insert_own"
    ON public.portfolio_assets FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.portfolio_projects p
            WHERE p.id = project_id
              AND (p.creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin())
        )
    );

CREATE POLICY "portfolio_assets_update_own"
    ON public.portfolio_assets FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.portfolio_projects p
            WHERE p.id = project_id
              AND (p.creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.portfolio_projects p
            WHERE p.id = project_id
              AND (p.creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin())
        )
    );

CREATE POLICY "portfolio_assets_delete_own"
    ON public.portfolio_assets FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.portfolio_projects p
            WHERE p.id = project_id
              AND (p.creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin())
        )
    );

-- 6.3 portfolio_project_tools
CREATE POLICY "portfolio_project_tools_select"
    ON public.portfolio_project_tools FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.portfolio_projects p
            WHERE p.id = portfolio_project_tools.project_id
              AND (p.is_public = true OR p.creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin())
        )
    );

CREATE POLICY "portfolio_project_tools_insert_own"
    ON public.portfolio_project_tools FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.portfolio_projects p
            WHERE p.id = project_id
              AND (p.creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin())
        )
    );

CREATE POLICY "portfolio_project_tools_delete_own"
    ON public.portfolio_project_tools FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.portfolio_projects p
            WHERE p.id = project_id
              AND (p.creator_profile_id = public.get_my_creator_profile_id() OR public.is_admin())
        )
    );

-- 7. POLICIES: BRIEFS

-- 7.1 briefs
CREATE POLICY "briefs_select"
    ON public.briefs FOR SELECT
    USING (
        (is_private = false AND status = 'published')
        OR brand_profile_id = public.get_my_brand_profile_id()
        OR public.is_admin()
    );

CREATE POLICY "briefs_insert_own"
    ON public.briefs FOR INSERT
    WITH CHECK (brand_profile_id = public.get_my_brand_profile_id() OR public.is_admin());

CREATE POLICY "briefs_update_own"
    ON public.briefs FOR UPDATE
    USING (brand_profile_id = public.get_my_brand_profile_id() OR public.is_admin())
    WITH CHECK (brand_profile_id = public.get_my_brand_profile_id() OR public.is_admin());

CREATE POLICY "briefs_delete_own"
    ON public.briefs FOR DELETE
    USING (brand_profile_id = public.get_my_brand_profile_id() OR public.is_admin());

-- 7.2 brief_required_skills
CREATE POLICY "brief_required_skills_select"
    ON public.brief_required_skills FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.briefs b
            WHERE b.id = brief_required_skills.brief_id
              AND ((b.is_private = false AND b.status = 'published') OR b.brand_profile_id = public.get_my_brand_profile_id() OR public.is_admin())
        )
    );

CREATE POLICY "brief_required_skills_insert_own"
    ON public.brief_required_skills FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.briefs b
            WHERE b.id = brief_id
              AND (b.brand_profile_id = public.get_my_brand_profile_id() OR public.is_admin())
        )
    );

CREATE POLICY "brief_required_skills_update_own"
    ON public.brief_required_skills FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.briefs b
            WHERE b.id = brief_id
              AND (b.brand_profile_id = public.get_my_brand_profile_id() OR public.is_admin())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.briefs b
            WHERE b.id = brief_id
              AND (b.brand_profile_id = public.get_my_brand_profile_id() OR public.is_admin())
        )
    );

CREATE POLICY "brief_required_skills_delete_own"
    ON public.brief_required_skills FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.briefs b
            WHERE b.id = brief_id
              AND (b.brand_profile_id = public.get_my_brand_profile_id() OR public.is_admin())
        )
    );

-- 8. POLICIES: COLLABORATION

-- 8.1 proposals
CREATE POLICY "proposals_select"
    ON public.proposals FOR SELECT
    USING (
        creator_profile_id = public.get_my_creator_profile_id()
        OR EXISTS (
            SELECT 1 FROM public.briefs b
            WHERE b.id = proposals.brief_id
              AND b.brand_profile_id = public.get_my_brand_profile_id()
        )
        OR public.is_admin()
    );

CREATE POLICY "proposals_insert_creator"
    ON public.proposals FOR INSERT
    WITH CHECK (
        creator_profile_id = public.get_my_creator_profile_id()
        AND status = 'submitted'
        AND EXISTS (
            SELECT 1 FROM public.briefs b
            WHERE b.id = brief_id AND b.status = 'published'
        )
    );

CREATE POLICY "proposals_update"
    ON public.proposals FOR UPDATE
    USING (
        (creator_profile_id = public.get_my_creator_profile_id() AND status = 'submitted')
        OR EXISTS (
            SELECT 1 FROM public.briefs b
            WHERE b.id = proposals.brief_id
              AND b.brand_profile_id = public.get_my_brand_profile_id()
        )
        OR public.is_admin()
    )
    WITH CHECK (
        (creator_profile_id = public.get_my_creator_profile_id() AND status IN ('submitted', 'withdrawn'))
        OR (
            EXISTS (
                SELECT 1 FROM public.briefs b
                WHERE b.id = brief_id AND b.brand_profile_id = public.get_my_brand_profile_id()
            )
            AND status IN ('under_review', 'accepted', 'rejected')
        )
        OR public.is_admin()
    );

CREATE POLICY "proposals_delete_creator"
    ON public.proposals FOR DELETE
    USING (
        (creator_profile_id = public.get_my_creator_profile_id() AND status = 'submitted')
        OR public.is_admin()
    );

-- 8.2 engagements
CREATE POLICY "engagements_select"
    ON public.engagements FOR SELECT
    USING (
        brand_profile_id = public.get_my_brand_profile_id()
        OR creator_profile_id = public.get_my_creator_profile_id()
        OR public.is_admin()
    );

CREATE POLICY "engagements_insert_brand"
    ON public.engagements FOR INSERT
    WITH CHECK (brand_profile_id = public.get_my_brand_profile_id() OR public.is_admin());

CREATE POLICY "engagements_update_parties"
    ON public.engagements FOR UPDATE
    USING (
        brand_profile_id = public.get_my_brand_profile_id()
        OR creator_profile_id = public.get_my_creator_profile_id()
        OR public.is_admin()
    )
    WITH CHECK (
        brand_profile_id = public.get_my_brand_profile_id()
        OR creator_profile_id = public.get_my_creator_profile_id()
        OR public.is_admin()
    );

CREATE POLICY "engagements_delete_admin"
    ON public.engagements FOR DELETE
    USING (public.is_admin());

-- 8.3 deliveries
CREATE POLICY "deliveries_select"
    ON public.deliveries FOR SELECT
    USING (
        creator_profile_id = public.get_my_creator_profile_id()
        OR EXISTS (
            SELECT 1 FROM public.engagements e
            WHERE e.id = deliveries.engagement_id
              AND (e.brand_profile_id = public.get_my_brand_profile_id() OR e.creator_profile_id = public.get_my_creator_profile_id())
        )
        OR public.is_admin()
    );

CREATE POLICY "deliveries_insert_creator"
    ON public.deliveries FOR INSERT
    WITH CHECK (
        creator_profile_id = public.get_my_creator_profile_id()
        AND status = 'submitted'
        AND EXISTS (
            SELECT 1 FROM public.engagements e
            WHERE e.id = engagement_id
              AND e.creator_profile_id = public.get_my_creator_profile_id()
              AND e.status IN ('active', 'revision_requested')
        )
    );

CREATE POLICY "deliveries_update"
    ON public.deliveries FOR UPDATE
    USING (
        (creator_profile_id = public.get_my_creator_profile_id() AND status = 'submitted')
        OR EXISTS (
            SELECT 1 FROM public.engagements e
            WHERE e.id = deliveries.engagement_id
              AND e.brand_profile_id = public.get_my_brand_profile_id()
        )
        OR public.is_admin()
    )
    WITH CHECK (
        (creator_profile_id = public.get_my_creator_profile_id() AND status = 'submitted')
        OR (
            EXISTS (
                SELECT 1 FROM public.engagements e
                WHERE e.id = engagement_id AND e.brand_profile_id = public.get_my_brand_profile_id()
            )
            AND status IN ('approved', 'rejected')
        )
        OR public.is_admin()
    );

CREATE POLICY "deliveries_delete_creator"
    ON public.deliveries FOR DELETE
    USING (
        (creator_profile_id = public.get_my_creator_profile_id() AND status = 'submitted')
        OR public.is_admin()
    );

-- 8.4 revision_requests
CREATE POLICY "revision_requests_select"
    ON public.revision_requests FOR SELECT
    USING (
        brand_profile_id = public.get_my_brand_profile_id()
        OR EXISTS (
            SELECT 1 FROM public.deliveries d
            WHERE d.id = revision_requests.delivery_id
              AND d.creator_profile_id = public.get_my_creator_profile_id()
        )
        OR public.is_admin()
    );

CREATE POLICY "revision_requests_insert_brand"
    ON public.revision_requests FOR INSERT
    WITH CHECK (
        brand_profile_id = public.get_my_brand_profile_id()
        AND status = 'open'
        AND EXISTS (
            SELECT 1 FROM public.deliveries d
            JOIN public.engagements e ON e.id = d.engagement_id
            WHERE d.id = delivery_id
              AND e.brand_profile_id = public.get_my_brand_profile_id()
        )
    );

CREATE POLICY "revision_requests_update"
    ON public.revision_requests FOR UPDATE
    USING (
        brand_profile_id = public.get_my_brand_profile_id()
        OR EXISTS (
            SELECT 1 FROM public.deliveries d
            WHERE d.id = revision_requests.delivery_id
              AND d.creator_profile_id = public.get_my_creator_profile_id()
        )
        OR public.is_admin()
    )
    WITH CHECK (
        brand_profile_id = public.get_my_brand_profile_id()
        OR status IN ('open', 'in_progress', 'resolved')
        OR public.is_admin()
    );

CREATE POLICY "revision_requests_delete_brand"
    ON public.revision_requests FOR DELETE
    USING (brand_profile_id = public.get_my_brand_profile_id() OR public.is_admin());

-- 9. POLICIES: CREATOR TRUST & VERIFICATION

-- 9.1 verification_evidence
CREATE POLICY "verification_evidence_select"
    ON public.verification_evidence FOR SELECT
    USING (
        creator_profile_id = public.get_my_creator_profile_id()
        OR public.is_admin()
    );

CREATE POLICY "verification_evidence_insert_creator"
    ON public.verification_evidence FOR INSERT
    WITH CHECK (
        creator_profile_id = public.get_my_creator_profile_id()
        AND status = 'pending'
        AND reviewed_by IS NULL
        AND review_notes IS NULL
    );

-- CRITICAL: Only Administrators can review and update verification evidence!
-- Creators are strictly prevented from approving their own evidence.
CREATE POLICY "verification_evidence_update_admin"
    ON public.verification_evidence FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "verification_evidence_delete_creator"
    ON public.verification_evidence FOR DELETE
    USING (
        (creator_profile_id = public.get_my_creator_profile_id() AND status = 'pending')
        OR public.is_admin()
    );

-- 10. STORAGE BUCKET POLICIES (Scoped if storage schema is present)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'objects') THEN
        -- Allow public read on public portfolios
        EXECUTE 'CREATE POLICY "storage_portfolios_public_select" ON storage.objects FOR SELECT USING (bucket_id = ''portfolios'');';
        
        -- Allow authenticated creators to upload into their own prefix in portfolios bucket
        EXECUTE 'CREATE POLICY "storage_portfolios_creator_upload" ON storage.objects FOR INSERT WITH CHECK (
            bucket_id = ''portfolios''
            AND auth.role() = ''authenticated''
            AND (storage.foldername(name))[1] = auth.uid()::text
        );';
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
-- ==============================================================================
-- Migration: 003_indexes.sql
-- Project: CreatorProof AI — AI Content Creator Marketplace
-- Description: Performance, foreign key, and discovery search indexes
-- ==============================================================================

-- 1. PROFILES & IDENTITIES
CREATE INDEX IF NOT EXISTS idx_profiles_role
    ON public.profiles (role);

CREATE INDEX IF NOT EXISTS idx_profiles_email
    ON public.profiles (email);

-- 2. CREATOR DISCOVERY & SEARCH
CREATE INDEX IF NOT EXISTS idx_creator_profiles_specialization
    ON public.creator_profiles (specialization);

CREATE INDEX IF NOT EXISTS idx_creator_profiles_availability
    ON public.creator_profiles (availability);

CREATE INDEX IF NOT EXISTS idx_creator_profiles_proof_score
    ON public.creator_profiles (proof_score DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_creator_profiles_hourly_rate
    ON public.creator_profiles (hourly_rate ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_creator_profiles_country
    ON public.creator_profiles (country);

CREATE INDEX IF NOT EXISTS idx_creator_profiles_verified
    ON public.creator_profiles (is_verified);

-- 3. BRAND PROFILES
CREATE INDEX IF NOT EXISTS idx_brand_profiles_industry
    ON public.brand_profiles (industry);

CREATE INDEX IF NOT EXISTS idx_brand_profiles_verified
    ON public.brand_profiles (is_verified);

-- 4. TAXONOMIES & JUNCTIONS
CREATE INDEX IF NOT EXISTS idx_skills_category
    ON public.skills (category);

CREATE INDEX IF NOT EXISTS idx_ai_tools_type
    ON public.ai_tools (tool_type);

CREATE INDEX IF NOT EXISTS idx_creator_skills_skill_id
    ON public.creator_skills (skill_id);

CREATE INDEX IF NOT EXISTS idx_creator_skills_creator_id
    ON public.creator_skills (creator_profile_id);

CREATE INDEX IF NOT EXISTS idx_creator_tools_tool_id
    ON public.creator_tools (tool_id);

CREATE INDEX IF NOT EXISTS idx_creator_tools_creator_id
    ON public.creator_tools (creator_profile_id);

-- 5. PORTFOLIOS & ASSETS
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_creator_id
    ON public.portfolio_projects (creator_profile_id);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_public_discovery
    ON public.portfolio_projects (is_public, content_type)
    WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_commercial
    ON public.portfolio_projects (is_commercial_licensed);

CREATE INDEX IF NOT EXISTS idx_portfolio_assets_project_id
    ON public.portfolio_assets (project_id, sort_order ASC);

CREATE INDEX IF NOT EXISTS idx_portfolio_assets_media_type
    ON public.portfolio_assets (asset_type);

CREATE INDEX IF NOT EXISTS idx_portfolio_project_tools_project_id
    ON public.portfolio_project_tools (project_id);

CREATE INDEX IF NOT EXISTS idx_portfolio_project_tools_tool_id
    ON public.portfolio_project_tools (tool_id);

-- 6. BRIEFS & MATCHING
CREATE INDEX IF NOT EXISTS idx_briefs_brand_id
    ON public.briefs (brand_profile_id);

CREATE INDEX IF NOT EXISTS idx_briefs_status_discovery
    ON public.briefs (status, is_private, created_at DESC)
    WHERE is_private = false AND status = 'published';

CREATE INDEX IF NOT EXISTS idx_briefs_budget
    ON public.briefs (budget);

CREATE INDEX IF NOT EXISTS idx_briefs_content_type
    ON public.briefs (content_type);

CREATE INDEX IF NOT EXISTS idx_brief_required_skills_brief_id
    ON public.brief_required_skills (brief_id);

CREATE INDEX IF NOT EXISTS idx_brief_required_skills_skill_id
    ON public.brief_required_skills (skill_id);

-- 7. PROPOSALS & CONTRACT COLLABORATION
CREATE INDEX IF NOT EXISTS idx_proposals_brief_id
    ON public.proposals (brief_id);

CREATE INDEX IF NOT EXISTS idx_proposals_creator_profile_id
    ON public.proposals (creator_profile_id);

CREATE INDEX IF NOT EXISTS idx_proposals_status
    ON public.proposals (status);

CREATE INDEX IF NOT EXISTS idx_engagements_creator_status
    ON public.engagements (creator_profile_id, status);

CREATE INDEX IF NOT EXISTS idx_engagements_brand_status
    ON public.engagements (brand_profile_id, status);

CREATE INDEX IF NOT EXISTS idx_engagements_brief_id
    ON public.engagements (brief_id);

CREATE INDEX IF NOT EXISTS idx_deliveries_engagement_id
    ON public.deliveries (engagement_id, version_number DESC);

CREATE INDEX IF NOT EXISTS idx_deliveries_creator_profile_id
    ON public.deliveries (creator_profile_id);

CREATE INDEX IF NOT EXISTS idx_revision_requests_delivery_id
    ON public.revision_requests (delivery_id);

CREATE INDEX IF NOT EXISTS idx_revision_requests_brand_profile_id
    ON public.revision_requests (brand_profile_id);

-- 8. CREATOR TRUST & VERIFICATION
CREATE INDEX IF NOT EXISTS idx_verification_evidence_creator_id
    ON public.verification_evidence (creator_profile_id);

CREATE INDEX IF NOT EXISTS idx_verification_evidence_status
    ON public.verification_evidence (status);
-- ==============================================================================
-- Seed: seed.sql
-- Project: CreatorProof AI — AI Content Creator Marketplace
-- Description: Master lookup data and safe synthetic demo datasets
-- All demo records are strictly labeled as [SYNTHETIC DEMO]
-- No arbitrary records are inserted directly into auth.users
-- ==============================================================================

-- 1. MASTER SKILLS TAXONOMY (20 Reusable AI Creative Skills)
INSERT INTO public.skills (id, name, slug, category)
VALUES
    ('a0000001-0000-0000-0000-000000000001', 'Multi-Angle Character Consistency', 'character-consistency', 'Video & 3D'),
    ('a0000001-0000-0000-0000-000000000002', 'LoRA Model Fine-Tuning', 'lora-fine-tuning', 'Model Training'),
    ('a0000001-0000-0000-0000-000000000003', 'Photorealistic Video Generation', 'photorealistic-video-generation', 'Video'),
    ('a0000001-0000-0000-0000-000000000004', 'Generative Commercial Storyboarding', 'commercial-storyboarding', 'Pre-Production'),
    ('a0000001-0000-0000-0000-000000000005', 'AI Voice Cloning & Localization', 'voice-cloning-localization', 'Audio'),
    ('a0000001-0000-0000-0000-000000000006', 'High-Fidelity Neural Upscaling', 'neural-upscaling', 'Post-Processing'),
    ('a0000001-0000-0000-0000-000000000007', 'Complex Prompt Engineering', 'complex-prompt-engineering', 'Prompting'),
    ('a0000001-0000-0000-0000-000000000008', 'AI Inpainting & Object Removal', 'inpainting-object-removal', 'VFX'),
    ('a0000001-0000-0000-0000-000000000009', 'Cinematic Lighting Design', 'cinematic-lighting-design', 'Visual Arts'),
    ('a0000001-0000-0000-0000-000000000010', 'Generative B-Roll Production', 'generative-b-roll', 'Video'),
    ('a0000001-0000-0000-0000-000000000011', 'ComfyUI Workflow Architecture', 'comfyui-workflow-architecture', 'Workflows'),
    ('a0000001-0000-0000-0000-000000000012', 'Neural Sound FX Synthesis', 'neural-sfx-synthesis', 'Audio'),
    ('a0000001-0000-0000-0000-000000000013', '3D Gaussian Splatting', 'gaussian-splatting', '3D'),
    ('a0000001-0000-0000-0000-000000000014', 'Style Transfer & Brand Consistency', 'style-transfer-consistency', 'Brand Systems'),
    ('a0000001-0000-0000-0000-000000000015', 'AI Motion Graphics & VFX', 'ai-motion-graphics-vfx', 'Motion Design'),
    ('a0000001-0000-0000-0000-000000000016', 'Virtual Influencer Creation', 'virtual-influencer-creation', 'Characters'),
    ('a0000001-0000-0000-0000-000000000017', 'Architectural AI Visualization', 'architectural-visualization', '3D & Environment'),
    ('a0000001-0000-0000-0000-000000000018', 'AI Product Photography', 'product-photography', 'Commercial'),
    ('a0000001-0000-0000-0000-000000000019', 'Lip-Sync Animation', 'lipsync-animation', 'Video'),
    ('a0000001-0000-0000-0000-000000000020', 'Music Composition & Stem Generation', 'music-composition-stems', 'Audio')
ON CONFLICT (slug) DO NOTHING;

-- 2. MASTER AI TOOLS & MODELS REGISTRY (15 Core Generative AI Tools)
INSERT INTO public.ai_tools (id, name, slug, vendor, tool_type)
VALUES
    ('b0000001-0000-0000-0000-000000000001', 'Midjourney v6.1', 'midjourney-v6', 'Midjourney', 'image_generation'),
    ('b0000001-0000-0000-0000-000000000002', 'Runway Gen-3 Alpha', 'runway-gen3-alpha', 'RunwayML', 'video_generation'),
    ('b0000001-0000-0000-0000-000000000003', 'FLUX.1 Schnell', 'flux-1-schnell', 'Black Forest Labs', 'image_generation'),
    ('b0000001-0000-0000-0000-000000000004', 'FLUX.1 Dev', 'flux-1-dev', 'Black Forest Labs', 'image_generation'),
    ('b0000001-0000-0000-0000-000000000005', 'Stable Diffusion XL', 'stable-diffusion-xl', 'Stability AI', 'image_generation'),
    ('b0000001-0000-0000-0000-000000000006', 'ComfyUI Pipeline', 'comfyui-pipeline', 'Open Source', 'workflow_engine'),
    ('b0000001-0000-0000-0000-000000000007', 'ElevenLabs Multilingual v2', 'elevenlabs-v2', 'ElevenLabs', 'audio_voice'),
    ('b0000001-0000-0000-0000-000000000008', 'Kling AI 1.5', 'kling-ai-1-5', 'Kuaishou', 'video_generation'),
    ('b0000001-0000-0000-0000-000000000009', 'Luma Dream Machine 1.5', 'luma-dream-machine', 'Luma AI', 'video_generation'),
    ('b0000001-0000-0000-0000-000000000010', 'Pika 2.0', 'pika-2-0', 'Pika Labs', 'video_generation'),
    ('b0000001-0000-0000-0000-000000000011', 'Suno v3.5', 'suno-v3-5', 'Suno AI', 'audio_voice'),
    ('b0000001-0000-0000-0000-000000000012', 'Magnific AI Upscaler', 'magnific-ai', 'Magnific AI', 'image_generation'),
    ('b0000001-0000-0000-0000-000000000013', 'Topaz Video AI 5', 'topaz-video-ai', 'Topaz Labs', 'video_generation'),
    ('b0000001-0000-0000-0000-000000000014', 'Claude 3.5 Sonnet', 'claude-3-5-sonnet', 'Anthropic', 'llm_text'),
    ('b0000001-0000-0000-0000-000000000015', 'Google Gemini 2.5 Pro', 'gemini-2-5-pro', 'Google', 'llm_text')
ON CONFLICT (slug) DO NOTHING;

-- ==============================================================================
-- 3. CONDITIONAL SYNTHETIC DEMO DATASET SEEDER
-- ==============================================================================
-- Note: In compliance with Supabase Auth security constraints:
-- This procedure safely checks if authenticated user identities exist in auth.users.
-- If test accounts have been created (e.g., via the scripts/seed-local-auth.ts script),
-- it attaches synthetic profiles, skills, portfolios, briefs, and proposals.
-- ==============================================================================

DO $$
DECLARE
    creator_count INTEGER;
BEGIN
    SELECT count(*) INTO creator_count FROM public.profiles WHERE role = 'creator';

    -- Only proceed with creator demo associations if profiles have been initialized
    IF creator_count > 0 THEN
        RAISE NOTICE 'Profiles detected. Synchronizing demo creator capabilities and portfolios...';
        
        -- Associate skills with first available creator
        INSERT INTO public.creator_skills (creator_profile_id, skill_id, proficiency, years_experience)
        SELECT cp.id, s.id, 'expert', 2.5
        FROM public.creator_profiles cp
        CROSS JOIN public.skills s
        WHERE s.slug IN ('character-consistency', 'photorealistic-video-generation', 'lora-fine-tuning')
        ON CONFLICT (creator_profile_id, skill_id) DO NOTHING;

        -- Associate tools with first available creator
        INSERT INTO public.creator_tools (creator_profile_id, tool_id, proficiency)
        SELECT cp.id, t.id, 'expert'
        FROM public.creator_profiles cp
        CROSS JOIN public.ai_tools t
        WHERE t.slug IN ('runway-gen3-alpha', 'comfyui-pipeline', 'flux-1-dev')
        ON CONFLICT (creator_profile_id, tool_id) DO NOTHING;
    ELSE
        RAISE NOTICE 'Notice: auth.users not yet populated. Master taxonomies (skills & tools) successfully seeded.';
        RAISE NOTICE 'To seed synthetic creator & brand accounts, run: npx tsx scripts/seed-local-auth.ts';
    END IF;
END $$;
-- ============================================================================
-- Migration 004: Table & Function Execution Grants for Supabase API Roles
-- Description:
-- Grants basic table-level DML and function execution privileges to anon and authenticated roles.
-- PostgreSQL requires table-level privilege grants and function EXECUTE before Row Level Security (RLS)
-- can evaluate row access. RLS policies in 002_policies.sql strictly enforce
-- actual data visibility and mutation safety.
-- ============================================================================

-- 1. Schema Usage
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Table Privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- 3. Sequence Privileges
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 4. Function Execution Privileges (Required for RLS policies using is_admin, get_my_creator_profile_id, etc.)
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_creator_profile_id() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_brand_profile_id() TO anon, authenticated;

-- 5. Default Privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
