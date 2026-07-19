import { createHash } from "crypto";

export type PlanStatus =
  | "DRAFT"
  | "COMPILED"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "EXECUTING"
  | "COMPLETE"
  | "HALTED";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface PlanStep {
  stepId: string;              // UUID v4
  sequence: number;            // 1-based order, immutable after compile
  capability: string;          // MCP tool name or GraphQL mutation name
  lane: 1 | 2 | 3;            // Lane 1=read, Lane 2=state, Lane 3=external
  inputSchema: Record<string, unknown>;   // JSON Schema for inputs
  expectedOutput: Record<string, unknown>; // JSON Schema for outputs
  riskLevel: RiskLevel;
  requiresApproval: boolean;
  approvalToken?: string;      // Set after human approval
  idempotencyKey: string;      // SHA-256 of stepId + inputHash
  executedAt?: string;         // ISO 8601, set after execution
  resultHash?: string;         // SHA-256 of actual output
}

export interface PlanIR {
  planId: string;              // UUID v4, set at compile time
  version: string;             // semver e.g. "4.02.0"
  status: PlanStatus;
  tenantId: string;            // Matches RLS app.current_tenant_id
  agentId: string;             // Identity of requesting agent
  compiledAt: string;          // ISO 8601
  approvedAt?: string;         // ISO 8601, set after human approval
  intent: string;              // Raw human/agent input, max 2000 chars
  steps: PlanStep[];
  canonicalHash: string;       // SHA-256 of deterministic JSON.stringify of steps[]
  signature?: string;          // Dilithium-5 or Ed25519 sig of canonicalHash
  einsteinScore?: number;      // 0.00–1.00 probability from Einstein trend model
  ssrnValidated?: boolean;     // Whether SSRN validator passed
  x402ReservationId?: string;  // Set when payment is reserved
  pglReceiptId?: string;       // Set when PGL seals this plan
  replayable: boolean;         // Always true for APPROVED+ plans
}

export function computeCanonicalHash(steps: PlanStep[]): string {
  if (!steps || steps.length === 0) return "";
  // Deterministic: sort by sequence, stringify with sorted keys
  const sortedSteps = [...steps].sort((a, b) => a.sequence - b.sequence);
  const keys = Object.keys(steps[0] ?? {}).sort();
  const canonical = JSON.stringify(sortedSteps, keys);
  return createHash("sha256").update(canonical).digest("hex");
}

export function validatePlanIR(plan: PlanIR): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!plan.planId) errors.push("planId required");
  if (!plan.tenantId) errors.push("tenantId required");
  if (!plan.steps || plan.steps.length === 0) {
    errors.push("plan must have at least one step");
  } else {
    const computed = computeCanonicalHash(plan.steps);
    if (plan.canonicalHash !== computed) {
      errors.push(`canonicalHash mismatch — plan has been tampered with (expected ${computed}, got ${plan.canonicalHash})`);
    }
    const lane3Steps = plan.steps.filter(s => s.lane === 3);
    if (lane3Steps.some(s => !s.requiresApproval)) {
      errors.push("all Lane 3 (external) steps must require approval");
    }
  }
  return { valid: errors.length === 0, errors };
}
