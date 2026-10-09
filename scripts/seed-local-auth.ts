/**
 * ==============================================================================
 * Local Auth Seeder: scripts/seed-local-auth.ts
 * Project: CreatorProof AI — AI Content Creator Marketplace
 *
 * Uses the official Supabase Auth Admin API (supabase.auth.admin.createUser)
 * to safely generate 20 synthetic creators and 5 synthetic brand demo accounts.
 *
 * SECURITY CONTROLS:
 * - Parses and validates hostname strictly against local loopback interfaces.
 * - Blocks execution on remote hosts unless explicitly confirmed via CONFIRM_REMOTE_SEED.
 * - Never prints or leaks service-role keys to logs.
 * - Prohibited in production environments.
 *
 * Run with:
 *   npx tsx scripts/seed-local-auth.ts
 * ==============================================================================
 */

import { createClient } from "@supabase/supabase-js";

// Block execution in production environments
if (process.env.NODE_ENV === "production") {
  console.error("[Fatal] seed-local-auth.ts cannot be executed in production environment.");
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!serviceRoleKey) {
  console.warn(
    "[Notice] SUPABASE_SERVICE_ROLE_KEY is required to create auth users via Admin API."
  );
  console.warn(
    "Set SUPABASE_SERVICE_ROLE_KEY in .env.local to run this seeding script."
  );
  process.exit(0);
}

// Strict URL hostname validation
let parsedUrl: URL;
try {
  parsedUrl = new URL(supabaseUrl);
} catch {
  console.error("[Fatal] Invalid NEXT_PUBLIC_SUPABASE_URL format.");
  process.exit(1);
}

const hostname = parsedUrl.hostname.toLowerCase();
const isLocalhost =
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "::1" ||
  hostname === "0.0.0.0" ||
  hostname.endsWith(".local");

if (!isLocalhost) {
  const allowRemoteConfirmation = process.env.CONFIRM_REMOTE_SEED;
  if (allowRemoteConfirmation !== "YES_I_CONFIRM_REMOTE_SEEDING") {
    console.error("==================================================================");
    console.error("BLOCKED: Non-local Supabase hostname detected!");
    console.error(`Target Hostname: ${hostname}`);
    console.error("Synthetic demo seeding is strictly restricted to local environments.");
    console.error("To override for staging, specify:");
    console.error("  CONFIRM_REMOTE_SEED=YES_I_CONFIRM_REMOTE_SEEDING");
    console.error("==================================================================");
    process.exit(1);
  }
}

// Initialize admin client without persisting session
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// 20 Synthetic Creators
const DEMO_CREATORS = [
  { handle: "alex_flux", name: "Alex Rivera [SYNTHETIC DEMO]", spec: "Generative VFX & 3D Motion", rate: 150 },
  { handle: "elena_lora", name: "Elena Rostova [SYNTHETIC DEMO]", spec: "Character Consistency & Virtual Humans", rate: 120 },
  { handle: "marcus_video", name: "Marcus Chen [SYNTHETIC DEMO]", spec: "Photorealistic Video & Storyboards", rate: 175 },
  { handle: "sophia_audio", name: "Sophia Dubois [SYNTHETIC DEMO]", spec: "AI Voice Cloning & Multilingual Audio", rate: 95 },
  { handle: "kai_splat", name: "Kai Takahashi [SYNTHETIC DEMO]", spec: "3D Gaussian Splatting & Environments", rate: 160 },
  { handle: "maya_brand", name: "Maya Patel [SYNTHETIC DEMO]", spec: "Brand Style Transfer & Product Visuals", rate: 110 },
  { handle: "david_cinematic", name: "David Kim [SYNTHETIC DEMO]", spec: "Cinematic B-Roll & Commercial Directing", rate: 200 },
  { handle: "chloe_fashion", name: "Chloe Martin [SYNTHETIC DEMO]", spec: "Virtual Influencer & Fashion Lookbooks", rate: 140 },
  { handle: "liam_pipeline", name: "Liam Vance [SYNTHETIC DEMO]", spec: "ComfyUI Workflow Engineering", rate: 180 },
  { handle: "zara_concept", name: "Zara Al-Mansoor [SYNTHETIC DEMO]", spec: "Concept Art & Worldbuilding", rate: 130 },
  { handle: "owen_sound", name: "Owen Murphy [SYNTHETIC DEMO]", spec: "Neural SFX & Adaptive Score Generation", rate: 105 },
  { handle: "hannah_realism", name: "Hannah Schmidt [SYNTHETIC DEMO]", spec: "Photorealistic Portraiture & Commercials", rate: 125 },
  { handle: "tariq_3d", name: "Tariq Hassan [SYNTHETIC DEMO]", spec: "AI Motion Graphics & Micro-Animations", rate: 145 },
  { handle: "freya_arch", name: "Freya Lindstrom [SYNTHETIC DEMO]", spec: "Architectural & Interior AI Rendering", rate: 165 },
  { handle: "diego_vfx", name: "Diego Santos [SYNTHETIC DEMO]", spec: "Generative Inpainting & Post-VFX", rate: 155 },
  { handle: "aisha_story", name: "Aisha Bello [SYNTHETIC DEMO]", spec: "Brand Campaign Storyboarding", rate: 115 },
  { handle: "niko_anime", name: "Niko Tanaka [SYNTHETIC DEMO]", spec: "Stylized Animation & Keyframe Interpolation", rate: 135 },
  { handle: "clara_render", name: "Clara Weber [SYNTHETIC DEMO]", spec: "Product Stills & Advertising Renders", rate: 90 },
  { handle: "sam_prompt", name: "Sam Wilson [SYNTHETIC DEMO]", spec: "Advanced Multi-Model Prompt Pipelines", rate: 170 },
  { handle: "yuki_lipsync", name: "Yuki Sato [SYNTHETIC DEMO]", spec: "Multilingual Lip-Sync & Neural Avatars", rate: 140 },
];

// 5 Synthetic Brands
const DEMO_BRANDS = [
  { company: "Synthetix Dynamics [SYNTHETIC DEMO]", industry: "AI Developer Tools", size: "11-50" },
  { company: "Lumina Consumer Tech [SYNTHETIC DEMO]", industry: "Hardware & Gadgets", size: "51-200" },
  { company: "Aetheria Game Studios [SYNTHETIC DEMO]", industry: "Gaming & Interactive", size: "201+" },
  { company: "Kinetix Sports Apparel [SYNTHETIC DEMO]", industry: "Fashion & Lifestyle", size: "51-200" },
  { company: "Pulse Energy Drinks [SYNTHETIC DEMO]", industry: "Consumer Goods", size: "11-50" },
];

async function seed() {
  console.log(`Seeding synthetic test accounts safely into local host: ${hostname}...`);

  // Seed Creators
  for (const c of DEMO_CREATORS) {
    const email = `${c.handle}@demo.creatorproof.ai`;
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: "DemoPassword123!",
      email_confirm: true,
      user_metadata: { role: "creator", display_name: c.name },
    });

    if (error && !error.message.includes("already registered")) {
      console.error(`Failed to create creator auth: ${email}`, error.message);
      continue;
    }

    const userId = data?.user?.id;
    if (userId) {
      await supabase.from("profiles").upsert({
        id: userId,
        email,
        role: "creator",
        display_name: c.name,
      });

      await supabase.from("creator_profiles").upsert({
        profile_id: userId,
        handle: c.handle,
        specialization: c.spec,
        hourly_rate: c.rate,
        is_verified: false,
        proof_score: null,
      });
    }
  }

  // Seed Brands
  for (let i = 0; i < DEMO_BRANDS.length; i++) {
    const b = DEMO_BRANDS[i];
    const email = `brand_${i + 1}@demo.creatorproof.ai`;
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: "DemoPassword123!",
      email_confirm: true,
      user_metadata: { role: "brand", display_name: b.company },
    });

    if (error && !error.message.includes("already registered")) {
      console.error(`Failed to create brand auth: ${email}`, error.message);
      continue;
    }

    const userId = data?.user?.id;
    if (userId) {
      await supabase.from("profiles").upsert({
        id: userId,
        email,
        role: "brand",
        display_name: b.company,
      });

      await supabase.from("brand_profiles").upsert({
        profile_id: userId,
        company_name: b.company,
        industry: b.industry,
        company_size: b.size,
        is_verified: false,
      });
    }
  }

  console.log("Synthetic demo auth and profile generation completed safely.");
}

seed().catch(console.error);
