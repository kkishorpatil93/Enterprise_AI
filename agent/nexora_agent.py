#!/usr/bin/env python3
"""
NEXORA AI Host Agent Daemon
Monitors real CPU, RAM, Disk, and GPU hardware metrics and reports
to the NEXORA AI Enterprise Gateway via authenticated REST API.
"""

import sys
import time
import socket
import argparse
import subprocess

try:
    import psutil
except ImportError:
    print("[NEXORA Agent] Error: 'psutil' package is required. Run: pip install psutil requests")
    sys.exit(1)

try:
    import requests
except ImportError:
    print("[NEXORA Agent] Error: 'requests' package is required. Run: pip install requests")
    sys.exit(1)

def get_gpu_metrics():
    """Detect NVIDIA GPU metrics via nvidia-smi if available."""
    try:
        cmd = ["nvidia-smi", "--query-gpu=utilization.gpu,name", "--format=csv,noheader,nounits"]
        output = subprocess.check_output(cmd, stderr=subprocess.DEVNULL, timeout=2).decode("utf-8").strip()
        if output:
            parts = output.split(",")
            gpu_util = float(parts[0].strip())
            gpu_name = parts[1].strip() if len(parts) > 1 else "NVIDIA GPU"
            return {"usage": gpu_util, "name": gpu_name}
    except Exception:
        pass
    return None

def collect_metrics(host_name):
    """Collect real host CPU, RAM, Disk, and GPU utilization."""
    cpu_percent = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory()
    disk = psutil.disk_usage('/') if sys.platform != 'win32' else psutil.disk_usage('C:\\')
    gpu = get_gpu_metrics()

    return {
        "host": host_name,
        "source": "agent",
        "cpu": cpu_percent,
        "ram": ram.percent,
        "ramTotalGb": round(ram.total / (1024**3), 2),
        "disk": disk.percent,
        "diskTotalGb": round(disk.total / (1024**3), 2),
        "gpu": gpu["usage"] if gpu else None,
        "gpuName": gpu["name"] if gpu else "Unavailable / Not detected",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

def main():
    parser = argparse.ArgumentParser(description="NEXORA AI Enterprise Host Metric Agent")
    parser.add_argument("--server", default="http://localhost:3000", help="NEXORA server URL")
    parser.add_argument("--token", default="acme_agent_live_token_2026", help="Per-organization agent token")
    parser.add_argument("--interval", type=int, default=5, help="Collection interval in seconds")
    parser.add_argument("--once", action="store_true", help="Push single payload and exit")
    args = parser.parse_args()

    host_name = socket.gethostname()
    endpoint = f"{args.server.rstrip('/')}/api/agent/metrics"

    print(f"==================================================")
    print(f" NEXORA AI Host Telemetry Agent v1.0")
    print(f" Host: {host_name}")
    print(f" Destination: {endpoint}")
    print(f" Interval: {args.interval}s")
    print(f"==================================================")

    while True:
        try:
            payload = collect_metrics(host_name)
            headers = {
                "Authorization": f"Bearer {args.token}",
                "Content-Type": "application/json"
            }
            res = requests.post(endpoint, json=payload, headers=headers, timeout=5)
            if res.status_code == 200:
                print(f"[{payload['timestamp']}] Metric delivered: CPU {payload['cpu']}% | RAM {payload['ram']}% | Disk {payload['disk']}% | GPU: {payload['gpuName']}")
            else:
                print(f"[{payload['timestamp']}] Server responded with HTTP {res.status_code}: {res.text}")
        except requests.exceptions.ConnectionError:
            print(f"[Warning] Could not reach NEXORA server at {endpoint}. Retrying in {args.interval}s...")
        except Exception as e:
            print(f"[Error] {e}")

        if args.once:
            break
        time.sleep(args.interval)

if __name__ == "__main__":
    main()

