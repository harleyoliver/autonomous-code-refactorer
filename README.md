# 🚀 Multi-Agent Legacy Intranet Migration Engine

An enterprise-grade, multi-agent AI orchestration pipeline powered by **LangGraph.js** and **TypeScript**. This engine is designed to ingest, decompose, and automatically refactor monolithic 2015-era legacy web ecosystems (ColdFusion/CFML) into type-safe, performance-optimized, modern **2026 Next.js App Router** architectures.

---

## 🎯 The Portfolio Case Study Blueprint

This repository is built as a complete technical case study demonstrating deterministic AI code modernization codebases. Rather than testing on simple text inputs, this engine targets a sprawling, fully operational synthetic corporate intranet mimicking authentic legacy debt profiles, monolithic data paradigms, and archaic security integrations.

### 🏗️ Repository Architecture

```text
autonomous-code-refactorer/
├── src/                         # Core Modernization Pipeline Layer
│   ├── agents/                  # Specialized Graph Processing Nodes
│   │   ├── parser.ts            # Local regex-driven macro parsing node
│   │   └── researcher.ts        # Corporate design-token similarity lookup engine
│   ├── graph/                   # State Machine Orchestration Core
│   │   └── state.ts             # Central type-safe shared state contracts
│   ├── schemas/                 # Strict Runtime Input/Output Firewalls
│   │   ├── validation.ts        # Zod schema for legacy debt validation
│   │   └── component.ts         # Zod schema for synthesized React components
│   └── utils/                   # Asynchronous Data I/O & Transport Utilities
│       ├── reader.ts            # Local asynchronous file mesh scanner
│       ├── tokenizer.ts         # Regex-driven technical debt identifier
│       └── bedrock.ts           # Centralized Amazon Bedrock client wrapper
├── fixtures/                    # Target Legacy Workspace (2015 Intranet Sandbox)
│   ├── infrastructure-status.cfm # SCADA Database Query & Load Overpressure Grid
│   └── legacy-intranet/         # Interconnected Monolithic Application Mesh
└── TRANSLATION_MATRIX.md        # AI Structural Translation Ruleset
```

---

## 💾 Legacy Debt Simulation Profile

The target environment housed inside `/fixtures` isolates five major legacy anti-patterns commonly found in older enterprise environments. The LangGraph orchestration loop handles these structurally:

1. **Stateful Native Protocols (`<cfldap>`):** The directory search engine mimics direct port hooks to Active Directory, requiring translation into modern edge identity layers (OIDC/Auth.js).
2. **Server-Side Include Mapping (`<cfinclude>`):** Dynamic layout fragmentation requires parsing loose dependency trees and decomposing them into unified Next.js Layouts and React functional elements.
3. **Tabular Spacing Utilities (`spacer.gif`):** Layouts rely on Base64-encoded 1x1 transparent image stretch boundaries to force alignment, requiring translation into pure Tailwind CSS tokens.
4. **Unencapsulated Global Scripts (`setInterval`):** High-friction page assets use brittle, state-leaking JavaScript loops inside raw layout matrices to manipulate DOM attributes.
5. **Monolithic Macro Operations (`<cfquery>` & XML SOAP):** Operational SCADA monitors and ECM document systems pass raw payloads natively on the page, requiring translation into isolated Next.js Server Actions and Prisma data access layers.

---

## 🌐 Live Interaction Sandbox

The simulated infrastructure is fully clickable and functional. To boot up the legacy node environment locally without installing any dependencies onto your host operating system, run:

```bash
# Spin up the light server mounting local files directly into the web container
docker run -d --name legacy-intranet-server -p 8888:8888 -v "$(pwd)/fixtures:/var/www" lucee/lucee:5.4-nginx
```

Once active, open your browser to interact with the target runtime system context:

- **Main Command Hub (LDAP Active Directory Form):** `http://localhost:8888/legacy-intranet/index.cfm`
- **Documentation Core Sidebar Matrix:** `http://localhost:8888/legacy-intranet/policies/index.cfm`
- **SCADA Overpressure Metric Display Node:** `http://localhost:8888/infrastructure-status.cfm`

### 🧹 Infrastructure Cleanup

To wipe the running node server out of local memory space, execute:

```bash
docker rm -f legacy-intranet-server
```
