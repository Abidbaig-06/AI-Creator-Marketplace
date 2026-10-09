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
