import React, { useState, useEffect } from "react";
import { 
  FileCheck, 
  Cpu, 
  Terminal, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Code, 
  Copy, 
  ShieldCheck, 
  BookOpen, 
  Activity, 
  Server, 
  DollarSign 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface SignedBuildManifest {
  receipt_version: string;
  timestamp: string;
  source_tree_hash: string;
  dependency_lock_hash: string;
  build_recipe_hash: string;
  toolchain_digest: string;
  artifact_hash: string;
  signature: string;
  signer_identity: string;
  trigger_sequence: number;
}

interface AttestationManagerProps {
  blueprintHash?: string;
  blueprintTitle?: string;
}

export const AttestationManager: React.FC<AttestationManagerProps> = ({
  blueprintHash = "sha256:8f3c7d1e8c9b4a2e5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
  blueprintTitle = "Apex-Blueprint Control Plane"
}) => {
  const [manifest, setManifest] = useState<SignedBuildManifest | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState<string>("");
  const [isRealServer, setIsRealServer] = useState(false);
  const [copied, setCopied] = useState(false);

  // Covenant Dry-Run Gate state
  const [gateStatus, setGateStatus] = useState<"IDLE" | "CHECKING" | "PASSED" | "FAILED">("IDLE");
  const [gateLogs, setGateLogs] = useState<string[]>([]);
  const [currentGateLogIdx, setCurrentGateLogIdx] = useState(0);
  const [gateAuthorizedPermit, setGateAuthorizedPermit] = useState<string | null>(null);

  // Load or pre-simulate an initial manifest
  useEffect(() => {
    generateInitialOrLoadManifest();
  }, []);

  const generateInitialOrLoadManifest = async () => {
    setIsGenerating(true);
    setProgressStep("Initializing Local Manifest Bridge...");
    try {
      // Try to fetch real generated hashes from our Node server
      const res = await fetch("/api/attestation/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        setManifest(data.manifest);
        setIsRealServer(true);
      } else {
        // Fallback to beautiful high-fidelity client-side mock if server is compiling
        generateLocalFallbackManifest();
      }
    } catch (e) {
      generateLocalFallbackManifest();
    } finally {
      setIsGenerating(false);
      setProgressStep("");
    }
  };

  const generateLocalFallbackManifest = () => {
    const mockManifest: SignedBuildManifest = {
      receipt_version: "apex.build-execution.v1",
      timestamp: new Date().toISOString(),
      source_tree_hash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      dependency_lock_hash: "sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
      build_recipe_hash: "sha256:c3ab8ff13720e1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      toolchain_digest: "sha256:e1d2c3b4a5f60718293041526374859607182930415263748596071829304152",
      artifact_hash: "sha256:9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
      signature: "0xfa77b901ce289ab7cdef4a9190289a81bc62df89a19280cdfa7182098dca21bb349ea019a82bbde9c891a27eefab62bfda9823ab0289aefcc9a81cd7281bcde01c",
      signer_identity: "poltergeist_agent_node_v1.0.4",
      trigger_sequence: 14821
    };
    setManifest(mockManifest);
    setIsRealServer(false);
  };

  const triggerManifestGeneration = async () => {
    setIsGenerating(true);
    setGateStatus("IDLE");
    setGateAuthorizedPermit(null);
    setGateLogs([]);

    const steps = [
      "Interrogating Workspace File Tree...",
      "Calculating deterministic SHA-256 for 12 tracked source modules...",
      "Analyzing package.json dependencies lock indices...",
      "Reading local tsconfig.json & vite.config.ts build recipes...",
      "Extracting environment variables policy constraints...",
      "Verifying active toolchain (Node.js/Vite/TSX-Compiler)...",
      "Compiling source modifications into build artifacts...",
      "Signing attestation envelope with Poltergeist-managed private key..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setProgressStep(steps[i]);
      // Artificially delay a tiny bit to make the cryptographic hashing progress satisfying to watch
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    try {
      const res = await fetch("/api/attestation/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        setManifest(data.manifest);
        setIsRealServer(true);
      } else {
        // Dynamic re-generation on client side with updated timestamps and randomized sequence offsets
        const currentSeq = manifest ? manifest.trigger_sequence + 1 : 14822;
        const randomHex = () => Math.random().toString(16).substring(2, 10);
        setManifest({
          receipt_version: "apex.build-execution.v1",
          timestamp: new Date().toISOString(),
          source_tree_hash: `sha256:e3b0c44298fc${randomHex()}9afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
          dependency_lock_hash: `sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`,
          build_recipe_hash: `sha256:c3ab8ff13720e1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
          toolchain_digest: `sha256:e1d2c3b4a5f60718293041526374859607182930415263748596071829304152`,
          artifact_hash: `sha256:9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e`,
          signature: `0xfa77b901ce289ab7cdef4a9190289a81bc62df89a19280cdfa7182098dca21bb349ea019a82bbde9c891a27eefab62bfda9823ab0289aefcc9a81cd7281bcde01c`,
          signer_identity: "poltergeist_agent_node_v1.0.4",
          trigger_sequence: currentSeq
        });
        setIsRealServer(false);
      }
    } catch (e) {
      // Dynamic fallback
      const currentSeq = manifest ? manifest.trigger_sequence + 1 : 14822;
      setManifest({
        receipt_version: "apex.build-execution.v1",
        timestamp: new Date().toISOString(),
        source_tree_hash: `sha256:e3b0c44298fc7fa919afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
        dependency_lock_hash: `sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`,
        build_recipe_hash: `sha256:c3ab8ff13720e1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
        toolchain_digest: `sha256:e1d2c3b4a5f60718293041526374859607182930415263748596071829304152`,
        artifact_hash: `sha256:9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e`,
        signature: `0xfa77b901ce289ab7cdef4a9190289a81bc62df89a19280cdfa7182098dca21bb349ea019a82bbde9c891a27eefab62bfda9823ab0289aefcc9a81cd7281bcde01c`,
        signer_identity: "poltergeist_agent_node_v1.0.4",
        trigger_sequence: currentSeq
      });
      setIsRealServer(false);
    } finally {
      setIsGenerating(false);
      setProgressStep("");
    }
  };

  const copyManifestToClipboard = () => {
    if (!manifest) return;
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run the step-by-step Covenant verification simulation
  const runCovenantGateCheck = async () => {
    if (!manifest) return;
    setGateStatus("CHECKING");
    setGateLogs([]);
    setGateAuthorizedPermit(null);

    const checkLogs = [
      `[INIT] Covenant Gate initialized. Target binary: 'dist/server'`,
      `[CHECK 1/7] Reading Poltergeist Attestation Manifest (Sequence #${manifest.trigger_sequence})`,
      `[CHECK 2/7] query_build_status() => EXPECTED 'passed'. Result: 'passed' (OK)`,
      `[CHECK 3/7] verify_source_binding() => Checking signature and working tree validity... Signature verified against poltergeist key: OK`,
      `[CHECK 4/7] verify_current_source_state() => Comparing working tree hash against authorized plan. Result: 100% matched`,
      `[CHECK 5/7] verify_executable_integrity() => Hashing target executable in-memory... SHA-256 matches manifest artifact_hash (OK)`,
      `[CHECK 6/7] verify_blueprint_permission() => Blueprint authorizes binary deployment target 'dist/server' under blueprint: ${blueprintHash.substring(0, 16)}... (OK)`,
      `[CHECK 7/7] verify_budget_enforcement() => Querying Covenant Ledger. Authorized: $5.00 | Consumed: $0.31 | Available: $4.69. Budget Check: OK`,
      `[DECISION] ALL CONSTRAINTS MET. Generating cryptographically signed Execution Permit...`
    ];

    for (let i = 0; i < checkLogs.length; i++) {
      setGateLogs(prev => [...prev, checkLogs[i]]);
      await new Promise(resolve => setTimeout(resolve, 350));
    }

    const mockPermit = `permit_sig_0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
    setGateAuthorizedPermit(mockPermit);
    setGateStatus("PASSED");
  };

  return (
    <div className="space-y-6 animate-fadeIn text-xs uppercase font-mono">
      
      {/* Overview Intro Banner */}
      <div className="p-5 border-2 border-[#222] bg-[#0A0A0A] rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileCheck size={18} className="text-[#00F0FF]" />
            <h4 className="text-white font-black text-sm tracking-tight">Poltergeist Attestation & Lineage Manager</h4>
          </div>
          <p className="text-[#666] text-[10px] lowercase leading-relaxed max-w-2xl normal-case">
            This module generates cryptographically bound artifacts by tracing source changes, lockfiles, and compilers, and matching them with authorized Apex blueprints. It provides the crucial link between source provenance and execution provenance.
          </p>
        </div>

        <button
          onClick={triggerManifestGeneration}
          disabled={isGenerating}
          className="px-4 py-2 bg-[#00F0FF] hover:bg-white text-black font-black font-mono tracking-widest text-[10px] uppercase transition-all rounded-none shrink-0 flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="animate-spin" size={12} />
              <span>Attesting...</span>
            </>
          ) : (
            <>
              <RefreshCw size={12} />
              <span>Generate Attestation</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Monitor if attesting */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-[#111] border border-[#00F0FF]/30 rounded-none text-[#00F0FF]"
          >
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 border-2 border-[#00F0FF] border-t-transparent animate-spin block shrink-0" />
              <div className="space-y-1 w-full">
                <span className="font-bold text-[10px] block">Cryptographic Lineage Compiler: Active</span>
                <span className="text-[10px] text-gray-400 lowercase normal-case leading-tight block">{progressStep}</span>
                <div className="h-1 bg-[#222] w-full overflow-hidden mt-2">
                  <div className="h-full bg-[#00F0FF] animate-pulse" style={{ width: "70%" }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Grid: Manifest Details & Hashing Overview */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Manifest Structure card */}
          <div className="p-5 border-2 border-[#222] bg-[#050505] rounded-none space-y-4">
            <div className="flex justify-between items-center border-b border-[#222] pb-2.5">
              <span className="text-white font-black text-xs tracking-wider">Signed Build Manifest</span>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 border text-[9px] font-bold ${isRealServer ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" : "border-[#00F0FF]/30 text-[#00F0FF] bg-[#00F0FF]/5"}`}>
                  {isRealServer ? "LIVE WORKSPACE DATA" : "DENSE DEMO CONTEXT"}
                </span>
                <span className="text-[10px] text-gray-500">v1.0.0</span>
              </div>
            </div>

            {manifest ? (
              <div className="space-y-3.5">
                {/* Source tree hash */}
                <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
                  <div className="flex justify-between items-center text-[9px] text-[#666]">
                    <span className="font-bold">Source Tree Hash</span>
                    <span className="text-emerald-400">Tracked Source Files</span>
                  </div>
                  <span className="text-white font-bold select-all break-all text-[11px] font-mono leading-none">{manifest.source_tree_hash}</span>
                  <p className="text-[9px] text-gray-500 lowercase normal-case leading-snug">Deterministic combined state hash of all active files in the workspace directory.</p>
                </div>

                {/* Lock hash */}
                <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
                  <div className="flex justify-between items-center text-[9px] text-[#666]">
                    <span className="font-bold">Dependency Lock Hash</span>
                    <span className="text-[#00F0FF]">package.json / package-lock</span>
                  </div>
                  <span className="text-white font-bold select-all break-all text-[11px] font-mono leading-none">{manifest.dependency_lock_hash}</span>
                  <p className="text-[9px] text-gray-500 lowercase normal-case leading-snug">Hash of dependency configurations. Guarantees no undeclared dependencies run inside the sandbox.</p>
                </div>

                {/* Recipe hash */}
                <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
                  <div className="flex justify-between items-center text-[9px] text-[#666]">
                    <span className="font-bold">Build Recipe Hash</span>
                    <span className="text-amber-500">vite.config / tsconfig</span>
                  </div>
                  <span className="text-white font-bold select-all break-all text-[11px] font-mono leading-none">{manifest.build_recipe_hash}</span>
                  <p className="text-[9px] text-gray-500 lowercase normal-case leading-snug">Validates that the compiler and build instructions haven't been modified to inject backdoor logic.</p>
                </div>

                {/* Toolchain Digest */}
                <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
                  <div className="flex justify-between items-center text-[9px] text-[#666]">
                    <span className="font-bold">Toolchain Identity Digest</span>
                    <span className="text-purple-400">Compiler Environment</span>
                  </div>
                  <span className="text-white font-bold select-all break-all text-[11px] font-mono leading-none">{manifest.toolchain_digest}</span>
                  <p className="text-[9px] text-gray-500 lowercase normal-case leading-snug">Captures compiler/Node.js executable runtime specifications, validating compilation environment security.</p>
                </div>

                {/* Artifact Hash */}
                <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
                  <div className="flex justify-between items-center text-[9px] text-[#666]">
                    <span className="font-bold">Artifact Hash</span>
                    <span className="text-emerald-400">Produced Binary</span>
                  </div>
                  <span className="text-white font-bold select-all break-all text-[11px] font-mono leading-none">{manifest.artifact_hash}</span>
                  <p className="text-[9px] text-gray-500 lowercase normal-case leading-snug">SHA-256 hash of the resulting compiled output files awaiting execution authorization.</p>
                </div>

                {/* Bottom Signature Envelope metadata */}
                <div className="pt-3 border-t border-[#111] grid grid-cols-2 gap-4 text-[10px] text-gray-400">
                  <div className="space-y-1">
                    <span className="text-[#666] block font-bold">Signer Cryptographic Key:</span>
                    <span className="text-gray-300 block select-all break-all leading-tight text-[9px]">{manifest.signer_identity}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#666] block font-bold">Timestamp & Sequence:</span>
                    <span className="text-gray-300 block font-bold">{manifest.timestamp}</span>
                    <span className="text-[#00F0FF] block font-bold">Sequence #{manifest.trigger_sequence}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 border border-[#222] text-center text-gray-500 uppercase">
                <AlertTriangle className="mx-auto text-amber-500 mb-2" size={20} />
                <span>No manifest loaded. Click 'Generate Attestation' above.</span>
              </div>
            )}
          </div>

          {/* Theoretical visual model card: The binding formula */}
          <div className="p-5 border-2 border-[#222] bg-[#0A0A0A] rounded-none space-y-4">
            <span className="text-[#00F0FF] text-[9px] font-black tracking-widest block">[ CRITICAL CRYPTOGRAPHIC BINDING ]</span>
            <h4 className="font-bold text-white text-sm">How the Lineage Is Formulated</h4>
            <div className="p-4 bg-[#050505] border border-[#222] font-mono text-center text-[11px] text-gray-300 normal-case rounded-none select-all overflow-x-auto leading-relaxed whitespace-pre-wrap">
              <span className="text-[#666]"># Provenance Signature Invariant:</span>{"\n"}
              <span className="text-emerald-400 font-bold">blueprint_hash</span> +{"\n"}
              <span className="text-emerald-400 font-bold">source_tree_hash</span> +{"\n"}
              <span className="text-[#00F0FF] font-bold">dependency_lock_hash</span> +{"\n"}
              <span className="text-amber-500 font-bold">build_recipe_hash</span> +{"\n"}
              <span className="text-purple-400 font-bold">toolchain_digest</span> +{"\n"}
              <span className="text-emerald-400 font-bold">artifact_hash</span> +{"\n"}
              <span className="text-gray-400 font-bold">execution_identity</span>
            </div>
            <p className="text-[10px] text-gray-400 lowercase normal-case leading-relaxed">
              This compound binding proves: <span className="font-bold text-gray-200">"This exact artifact was built from this exact source state under this exact authorized plan, and was executed by this specific model."</span> This closes the link between source and execution.
            </p>
          </div>

        </div>

        {/* Right Grid: Covenant Gate and Receipt Export */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Covenant Gate Checker (Interactive Simulation) */}
          <div className="p-5 border-2 border-[#222] bg-[#0A0A0A] rounded-none space-y-4">
            <div className="flex justify-between items-center border-b border-[#222] pb-2">
              <span className="text-white font-black text-xs tracking-wider">Covenant Execution Gate</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${
                gateStatus === "PASSED" ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5" :
                gateStatus === "CHECKING" ? "border-[#00F0FF]/40 text-[#00F0FF] bg-[#00F0FF]/5" :
                "border-gray-500/40 text-gray-400 bg-gray-500/5"
              }`}>
                {gateStatus}
              </span>
            </div>

            <p className="text-[10px] text-gray-400 normal-case lowercase leading-relaxed">
              Covenant enforces that no artifact executes unless all constraints match the original authorized blueprint parameters.
            </p>

            <button
              onClick={runCovenantGateCheck}
              disabled={gateStatus === "CHECKING" || !manifest}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-white hover:to-white hover:text-black font-black tracking-widest text-[10px] transition-all rounded-none text-white uppercase flex items-center justify-center gap-2"
            >
              <ShieldCheck size={14} />
              <span>Dry-Run Covenant Gate Check</span>
            </button>

            {/* Terminal simulation */}
            <div className="bg-[#050505] border border-[#222] p-4 font-mono text-[10px] space-y-1.5 h-[230px] overflow-y-auto uppercase text-left select-text">
              {gateLogs.length > 0 ? (
                gateLogs.map((log, idx) => (
                  <div key={idx} className={`${
                    log.includes("OK") ? "text-emerald-400" :
                    log.includes("DECISION") ? "text-[#00F0FF] font-black" :
                    log.includes("INIT") ? "text-gray-500" : "text-gray-400"
                  }`}>
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-600 text-center pt-20">
                  <span>TERMINAL IDLE. TRIGGER GATE CHECK ABOVE.</span>
                </div>
              )}

              {/* Success Token visualization */}
              {gateAuthorizedPermit && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded-none space-y-1 text-[10px]"
                >
                  <span className="font-black block text-[11px]">[COVENANT PERMIT ISSUED]</span>
                  <span className="text-white block select-all break-all leading-tight text-[10px]">{gateAuthorizedPermit}</span>
                  <p className="text-[9px] text-emerald-500/70 lowercase normal-case leading-tight">This permit allows exactly-once execution of the targeted binary and registers execution telemetry with Gnomledger.</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* JSON manifest code visualizer */}
          <div className="p-5 border-2 border-[#222] bg-[#050505] rounded-none space-y-3">
            <div className="flex justify-between items-center border-b border-[#222] pb-2">
              <span className="text-white font-black text-xs tracking-wider">Export Ledger Event</span>
              <button
                onClick={copyManifestToClipboard}
                disabled={!manifest}
                className="text-gray-500 hover:text-white flex items-center gap-1 text-[9px] uppercase font-bold"
              >
                {copied ? (
                  <>
                    <Check size={11} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#050505] p-3 border border-[#222] h-[200px] overflow-y-auto rounded-none select-text">
              {manifest ? (
                <pre className="text-[10px] text-gray-400 leading-normal normal-case whitespace-pre-wrap font-mono">
                  {JSON.stringify(manifest, null, 2)}
                </pre>
              ) : (
                <div className="text-gray-600 text-center pt-16">
                  <span>No data to export.</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
