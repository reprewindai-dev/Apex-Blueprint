# APEX BLUEPRINT — INTEGRATION & LICENSING BRIEF

*Confidential. Prepared for strategic review. July 2026.*

---

## The Problem Every AI Coding Tool Has Not Solved

Every major AI coding tool — Cursor, Claude Code, Windsurf, Devin, GitHub Copilot — can generate code and call APIs. None of them can answer:

- **"Prove that the agent was authorized to do what it did."**
- **"Show me the budget it was given and the budget it consumed."**
- **"Give me a hash I can verify that proves this execution happened."**
- **"Route my agent through the highest-performing, most trusted API."**

The result: Gartner projects 40% of agentic AI projects will be canceled by 2027. 81% of enterprises have AI-generated code in production but cannot track where it came from. 63% of enterprises now require human validation of every AI agent output — up from 22% one year ago.

The ceiling on AI agent autonomy is not capability. It is trust.

**Apex Blueprint is the governed connection layer that closes the accountability gap — for any AI coding tool, with one config line.**

---

## What Apex Blueprint Is

Apex Blueprint is a governed MCP gateway and blueprint compiler. It wraps every AI agent capability call in a deterministic, evidence-producing execution pipeline called the **Covenant**. Every call produces:

| Output | What it means |
|---|---|
| `connection_id` | Immutable identifier for that execution |
| Cryptographic evidence chain | Genome, constitution, and plan hashes — tamper-evident |
| Gnomledger anchor | Append-only ledger record with Merkle inclusion proof |
| Public evidence URL | Shareable proof artifact — paste it in a PR, a handoff, a compliance review |
| VNP score | Real performance evidence for every API routed through |
| Billing event | Automatic x402 micropayment, exactly-once settled, audit-ready |

**One config line enables this from any AI coding tool:**

```json
{
  "mcpServers": {
    "apex-blueprint": {
      "url": "https://api.veklom.com/api/v1/mcp",
      "headers": { "Authorization": "Bearer SDK_KEY" }
    }
  }
}
```

That single line means: every agent action through your IDE is now governed, metered, and evidence-backed. The developer gets a URL they can share to prove the build was accountable. The enterprise gets the audit trail compliance requires.

---

## Why Each IDE Needs This

### Cursor

Cursor has the best AI editor on the market. It does not have a governed connection layer. Enterprise customers love Cursor — their legal and compliance teams are blocking deployment because there is no evidence trail. Apex Blueprint gives every Cursor agent action a verifiable evidence receipt. That is the enterprise unlock Cursor needs to move upmarket.

### Claude Code / Anthropic

Claude is the most capable coding model. Apex Blueprint makes Claude's agent outputs trustworthy at the infrastructure level — not by making Claude better, but by making every Claude action provable. Mission Contracts enforce budget, scope, and jurisdiction before Claude touches an API. Anthropic does not need to build governance infrastructure. Apex Blueprint is that infrastructure.

### Windsurf / Codeium

Windsurf is building the fastest AI editor. Apex Blueprint adds the accountability layer that gets Windsurf into regulated industries — healthcare, finance, legal, government — where speed alone cannot get you. One integration. Every Windsurf agent action becomes enterprise-deployable.

### GitHub Copilot / Microsoft

GitHub already owns the developer workflow. Apex Blueprint is a governed connection layer that turns Copilot from an assistant into an accountable production agent. A GitHub Action that produces a Gnomledger-anchored evidence certificate on every PR is a new product category — governed code provenance — that no one else has shipped.

### OpenAI / Codex CLI / Devin

OpenAI and Devin both need a governance layer for autonomous agents. Apex Blueprint wraps the agent's capability calls and produces the evidence record enterprises require before they allow autonomous agents into production. It does not compete with the model or the agent. It completes it.

---

## Technical Moat

Apex Blueprint's moat is not the MCP server. That is commodity. The moat is:

1. **The Covenant** — an 11-phase deterministic execution pipeline. The only production-ready governed connection standard for AI agents. Phase sequence: create → compile → contextualize → govern → commit → mint identity → mint token → route → validate → execute → attest.

2. **Gnomledger** — an append-only, Merkle-anchored evidence ledger. Once an execution is recorded, it cannot be altered. This is the trust primitive that makes agent outputs verifiable at the infrastructure level.

3. **VNP (Veklom Network Protocol)** — a real-performance API routing layer that scores providers by actual latency, uptime, and trust evidence, and routes agent calls through the best-performing provider at execution time.

4. **Mission Contracts** — deterministic governance objects that define agent scope, budget, allowed capabilities, forbidden capabilities, and evidence requirements before a single API call is made.

5. **The x402 billing layer** — automatic micropayment settlement on every governed call. Exactly-once guarantees. Replay protection. Idempotency constraints. Audit-ready ledger records. Revenue that scales directly with usage — no invoicing required.

No competitor has all five. Most have none.

---

## How Integration Works

### For IDE Partners (Cursor, Windsurf, Claude Code, Copilot)

The integration is a single MCP server entry in the tool's config. Users authenticate with an Apex Blueprint SDK key. Every governed call:

1. Resolves the SDK key → workspace → billing tier
2. Checks entitlement (credits remaining this billing period)
3. Runs the full Covenant execution pipeline
4. Emits a billing event to the x402 settlement table (exactly-once via idempotency constraint)
5. Returns the capability result plus a signed `_evidence` envelope

```json
{
  "result": { "...capability output..." },
  "_evidence": {
    "connection_id": "<uuid>",
    "capability": "<name>",
    "phase_hashes": { "genome": "...", "constitution": "...", "plan": "..." },
    "gnomledger_anchor": "<batch_id>",
    "evidence_url": "https://veklom.com/evidence/<connection_id>",
    "billed_credits": 1,
    "methodology_version": "1.0"
  }
}
```

### For Enterprise Teams (Self-Hosted)

Single-tenant deployment on your own infrastructure. Custom governance policy. Dedicated Gnomledger partition. White-label option. SLA. Full source code and deployment runbook included.

### For Individual Developers

Sign up at veklom.com/pricing. Add the config block to your IDE. Start building with governed, evidence-backed connections on the first call.

---

## Revenue Model

### Developer Plans (recurring SaaS)

| Tier | Price | Monthly governed calls | Overage rate |
|---|---|---|---|
| Free | $0 | 500 | $0.005/call |
| Builder | $29/mo | 25,000 | $0.003/call |
| Team | $99/mo | 150,000 | $0.002/call |
| Scale | $299/mo | 1,000,000 | $0.001/call |
| Enterprise | Custom | Unlimited | Flat rate |

### x402 Metered Revenue (automatic)

Every governed call over the included allocation settles via x402 micropayment. No invoicing. No collections. Revenue scales directly with usage. At 10M overage calls/month across the platform at $0.002/call average: **$20,000/month from overage alone.**

### Enterprise License

Single-tenant deployment. White-label option. Custom governance policy. Dedicated Gnomledger partition. SLA. Starting at **$2,500/month.**

### IDE Partnership Revenue

IDE partners integrate Apex Blueprint as a native governed connection layer. Revenue share on every governed call made through the partner's tool. Partnership pricing negotiated per integration.

---

## What an Integration Partner Receives

- Full MCP gateway endpoint (`POST /api/v1/mcp`) — drop-in for any MCP-compatible client
- OpenAPI proxy translator (`POST /api/v1/proxy`) — governs any REST API on the internet, not just Apex Blueprint capabilities
- SDK credential and billing infrastructure — workspace credits, x402 settlement, overage handling
- Public evidence page infrastructure — every `connection_id` produces a verifiable public URL
- VNP routing intelligence — agent calls automatically route through the highest-performing API provider
- Full agent documentation and implementation briefs
- Deployment runbook and onboarding support

---

## Contact

| Purpose | Contact |
|---|---|
| IDE integration partnerships | partnerships@veklom.com |
| Enterprise licensing | enterprise@veklom.com |
| Developer plans | https://veklom.com/pricing |
| Evidence verification | https://veklom.com/evidence/\<connection_id\> |
| Strategic inquiries | acquire@veklom.com |
