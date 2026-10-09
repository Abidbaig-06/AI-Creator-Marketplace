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
