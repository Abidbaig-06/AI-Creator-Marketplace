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
