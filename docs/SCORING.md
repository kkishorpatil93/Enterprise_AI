# NEXORA AI Scoring Engine Documentation

## Overview
The NEXORA AI Readiness Scoring Engine computes an objective, deterministic enterprise AI readiness score from 0 to 100 based on evaluated dimensions. The score represents an organization's maturity, data hygiene, infrastructure health, network throughput, cost efficiency, governance controls, and workforce readiness to adopt generative and predictive AI.

## Weight Distribution
Default weights (customizable in Settings, must sum to 100%):

| Category | Default Weight | Key Measurement Inputs |
|---|---|---|
| **Infrastructure Readiness** | 20% | CPU/RAM/Disk headroom, modern hardware generation, GPU availability, virtualization/container maturity |
| **Data Quality & Integration** | 25% | Completeness, duplicate rate, format validity, outlier score, silo fragmentation, schema cohesion |
| **Network & Storage** | 15% | Latency (<60ms target), jitter (<15ms), download/upload throughput (>100Mbps), storage IOPS/tiering |
| **Compute & Cost Efficiency** | 15% | Idle instance waste percentage, right-sizing potential, peak-to-average utilization, reserved vs on-demand ratio |
| **Security & AI Governance** | 15% | PII exposure rate, access control enforcement, AI Usage Registry adoption, framework alignment (NIST AI RMF, ISO 42001, EU AI Act) |
| **Skills & AI Strategy** | 10% | Workforce AI literacy, executive sponsorship, defined high-ROI use cases, cross-functional AI council |

## Missing Data & Renormalization Rule
Categories with no data are marked **"Not Assessed"** and **strictly excluded from the calculation**.
The remaining assessed category weights are dynamically renormalized:
$$\text{Assessed Weight Sum} = \sum_{c \in \text{Assessed}} W_c$$
$$\text{Overall Score} = \sum_{c \in \text{Assessed}} \left( \text{SubScore}_c \times \frac{W_c}{\text{Assessed Weight Sum}} \right)$$

Missing data **never** assumes a default 100 or 0; instead, the UI clearly displays:
`Partial assessment - X of 6 categories assessed` with a Confidence Score:
$$\text{Confidence} = \frac{\text{Assessed Weight Sum}}{100} \times 100\%$$

## Classification Tiers
- **80 – 100**: **AI Ready** (Enterprise is positioned to deploy high-scale generative & predictive AI systems with high reliability)
- **60 – 79**: **Needs Improvement** (Foundational capabilities exist; targeted optimizations required in data or infrastructure)
- **40 – 59**: **Significant Gaps** (Critical bottlenecks present; unaddressed risks will lead to project failure or cost overruns)
- **0 – 39**: **Not Ready** (Severe data silos, security exposure, or legacy infrastructure prevent viable AI implementation)

## Category Sub-score Formulas

### 1. Infrastructure Readiness ($S_{infra} \in [0, 100]$)
- Base score: 100
- Penalties:
  - RAM utilization > 85%: -15 pts
  - Disk utilization > 90%: -20 pts
  - CPU peak saturation > 90%: -15 pts
  - Legacy CPU architecture (< 8th Gen Intel or equivalent): -20 pts
  - HDD spinning disks instead of NVMe/SSD: -15 pts
  - GPU absence for deep learning workloads: -10 pts (unless marked pure API-based inference)

### 2. Data Quality & Integration ($S_{data} \in [0, 100]$)
- Quality score formula:
  $$S_{dq} = 100 - (2 \times \text{MissingValuePct}) - (1.5 \times \text{DuplicateRowPct}) - (2.5 \times \text{FormatErrorPct}) - (1 \times \text{OutlierPct})$$
- Silo penalty: $-5$ pts per isolated department silo without API integration (up to -25 pts)
- Combined: $S_{data} = \text{clamp}(0.7 \times S_{dq} + 0.3 \times S_{silo\_integration}, 0, 100)$

### 3. Network & Storage ($S_{net} \in [0, 100]$)
- Latency score:
  - $< 30$ms: 100 pts
  - $30-70$ms: $100 - (\text{latency} - 30) \times 1.25$
  - $> 70$ms: $\max(20, 50 - (\text{latency} - 70) \times 0.5)$
- Jitter penalty: if jitter $> 15$ms, $-15$ pts
- Throughput: $< 25$ Mbps: $-20$ pts; $25-100$ Mbps: $-10$ pts; $> 100$ Mbps: $+0$

### 4. Compute & Cost Efficiency ($S_{cost} \in [0, 100]$)
- Idle resource penalty: $-1.2 \times \text{UnderutilizedResourcePct}$
- Over-provisioning factor: $-0.8 \times \text{OverprovisionedInstancesPct}$
- Strategy bonus: $+10$ pts for active reservation / savings plans

### 5. Security & AI Governance ($S_{gov} \in [0, 100]$)
- PII penalty: $-25$ pts if unmasked PII detected in production datasets
- AI Registry adoption: $+30$ pts if shadow AI tools are documented and audited
- Framework alignment: $+15$ pts each for NIST AI RMF, ISO 42001, or EU AI Act alignment checks (up to 45 pts)

### 6. Skills & AI Strategy ($S_{skills} \in [0, 100]$)
- Based on department skills quiz completion rate, executive sponsor presence, and defined high-ROI business cases.

