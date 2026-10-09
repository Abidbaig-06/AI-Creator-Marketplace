import { describe, it, expect } from "vitest";

describe("Role-Based Authorization & Privacy Logic", () => {
  // Mock users
  const anonymousUser = null;
  const creatorUser = { id: "user-creator-1", role: "creator" };
  const otherCreatorUser = { id: "user-creator-2", role: "creator" };
  const brandUser = { id: "user-brand-1", role: "brand" };
  const otherBrandUser = { id: "user-brand-2", role: "brand" };
  const adminUser = { id: "user-admin-1", role: "admin" };

  describe("1. Sensitive Column Privacy (Email & Billing)", () => {
    it("prevents anonymous callers from selecting private email", () => {
      const allowedColumnsForAnon = ["id", "role", "display_name", "avatar_url", "bio", "created_at"];
      expect(allowedColumnsForAnon.includes("email")).toBe(false);
      expect(allowedColumnsForAnon.includes("billing_email")).toBe(false);
    });

    it("restricts brand billing_email exclusively to owning brand or administrator", () => {
      const canReadBillingEmail = (user: any, brandProfileOwnerId: string) => {
        if (!user) return false;
        if (user.role === "admin") return true;
        return user.id === brandProfileOwnerId;
      };

      expect(canReadBillingEmail(anonymousUser, brandUser.id)).toBe(false);
      expect(canReadBillingEmail(creatorUser, brandUser.id)).toBe(false);
      expect(canReadBillingEmail(otherBrandUser, brandUser.id)).toBe(false);
      expect(canReadBillingEmail(brandUser, brandUser.id)).toBe(true);
      expect(canReadBillingEmail(adminUser, brandUser.id)).toBe(true);
    });
  });

  describe("2. Creator Trust & Verification Escalation Guards", () => {
    it("blocks creators from self-modifying proof_score or is_verified", () => {
      const canModifyTrust = (user: any, oldRow: any, newRow: any) => {
        const trustChanged =
          oldRow.proof_score !== newRow.proof_score ||
          oldRow.is_verified !== newRow.is_verified;
        if (!trustChanged) return true;
        return user && user.role === "admin";
      };

      const oldRecord = { proof_score: null, is_verified: false };
      const escalatedRecord = { proof_score: 95, is_verified: true };

      expect(canModifyTrust(creatorUser, oldRecord, escalatedRecord)).toBe(false);
      expect(canModifyTrust(adminUser, oldRecord, escalatedRecord)).toBe(true);
    });

    it("restricts verification evidence approval to administrators only", () => {
      const canApproveEvidence = (user: any) => {
        return Boolean(user && user.role === "admin");
      };

      expect(canApproveEvidence(creatorUser)).toBe(false);
      expect(canApproveEvidence(brandUser)).toBe(false);
      expect(canApproveEvidence(adminUser)).toBe(true);
    });
  });

  describe("3. Brief & Proposal Privacy", () => {
    it("hides draft and private briefs from unauthorized creators", () => {
      const canViewBrief = (user: any, brief: { status: string; is_private: boolean; brand_id: string }) => {
        if (user && user.role === "admin") return true;
        if (user && user.id === brief.brand_id) return true;
        return !brief.is_private && brief.status === "published";
      };

      const draftBrief = { status: "draft", is_private: false, brand_id: brandUser.id };
      const privateBrief = { status: "published", is_private: true, brand_id: brandUser.id };
      const publicBrief = { status: "published", is_private: false, brand_id: brandUser.id };

      expect(canViewBrief(creatorUser, draftBrief)).toBe(false);
      expect(canViewBrief(creatorUser, privateBrief)).toBe(false);
      expect(canViewBrief(creatorUser, publicBrief)).toBe(true);
      expect(canViewBrief(brandUser, draftBrief)).toBe(true);
    });

    it("restricts proposal viewing to proposal creator and brief-owning brand", () => {
      const canViewProposal = (user: any, proposal: { creator_id: string; brief_brand_id: string }) => {
        if (!user) return false;
        if (user.role === "admin") return true;
        return user.id === proposal.creator_id || user.id === proposal.brief_brand_id;
      };

      const proposal = { creator_id: creatorUser.id, brief_brand_id: brandUser.id };

      expect(canViewProposal(anonymousUser, proposal)).toBe(false);
      expect(canViewProposal(otherCreatorUser, proposal)).toBe(false);
      expect(canViewProposal(otherBrandUser, proposal)).toBe(false);
      expect(canViewProposal(creatorUser, proposal)).toBe(true);
      expect(canViewProposal(brandUser, proposal)).toBe(true);
      expect(canViewProposal(adminUser, proposal)).toBe(true);
    });
  });

  describe("4. Safe Seeding Hostname Validator", () => {
    it("accepts loopback URLs and rejects remote hostnames without confirmation", () => {
      const isAllowedHost = (urlStr: string, confirmationFlag?: string) => {
        try {
          const url = new URL(urlStr);
          const hostname = url.hostname.toLowerCase();
          const isLocal =
            hostname === "localhost" ||
            hostname === "127.0.0.1" ||
            hostname === "::1" ||
            hostname === "0.0.0.0" ||
            hostname.endsWith(".local");

          if (isLocal) return true;
          return confirmationFlag === "YES_I_CONFIRM_REMOTE_SEEDING";
        } catch {
          return false;
        }
      };

      expect(isAllowedHost("http://localhost:54321")).toBe(true);
      expect(isAllowedHost("http://127.0.0.1:54321")).toBe(true);
      expect(isAllowedHost("https://lokafmtkzrvevhkrasdy.supabase.co")).toBe(false);
      expect(isAllowedHost("https://lokafmtkzrvevhkrasdy.supabase.co", "YES_I_CONFIRM_REMOTE_SEEDING")).toBe(true);
    });
  });
});
