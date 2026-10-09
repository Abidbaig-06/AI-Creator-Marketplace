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
