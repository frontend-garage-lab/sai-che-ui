#!/usr/bin/env python3
"""Fail-closed preflight for a Figma library release (stdlib only).

It does NOT publish anything or inspect Figma; input claims need real audit evidence.
Usage: python3 check_release_manifest.py reports/figma-lit-audit/release-manifest.json
"""
import json
import sys
from pathlib import Path

PREFLIGHT_GATES = ("r01_provenance", "r02_request_coverage", "r03_component_quality", "r04_compatibility")


def validate(manifest):
    errors = []
    if manifest.get("schema_version") != 1:
        errors.append("schema_version must be 1")
    ds = manifest.get("source_ds") or {}
    consumer = manifest.get("consumer") or {}
    if not ds.get("file_key") or not ds.get("file_url"):
        errors.append("DS source missing file_key or URL")
    if not consumer.get("file_key") or not consumer.get("file_url"):
        errors.append("Consumer target missing file_key or URL")
    if ds.get("file_key") == consumer.get("file_key"):
        errors.append("DS source and consumer must be different Figma files")
    approvals = manifest.get("approved") or {}
    if approvals.get("ds_fixes") is not True:
        errors.append("DS fixes not explicitly approved")
    if approvals.get("library_release") is not True:
        errors.append("Release not explicitly approved")
    quality = manifest.get("quality") or {}
    open_p0 = quality.get("open_p0")
    if type(open_p0) is not int or open_p0 != 0:
        errors.append("Unresolved P0 issues or P0 count unverified")
    for gate in PREFLIGHT_GATES:
        if quality.get(gate) != "PASS":
            errors.append(f"{gate} not PASS ({quality.get(gate, 'missing')})")
    assets = manifest.get("assets")
    if not isinstance(assets, list) or not assets:
        errors.append("No assets in planned release")
        assets = []
    for i, a in enumerate(assets):
        if not isinstance(a, dict):
            errors.append(f"asset[{i}] is not an object")
            continue
        for key in ("name", "lit_tag", "node_id", "component_key"):
            if not a.get(key):
                errors.append(f"asset[{i}].{key} is missing")
        if a.get("gates") != "PASS":
            errors.append(f"asset[{i}].gates not PASS")
        if a.get("breaking") is True:
            errors.append(f"asset[{i}] is breaking; requires manual migration approval")
    return errors


def main(argv):
    if len(argv) != 2:
        print("Usage: python3 check_release_manifest.py PATH_TO_MANIFEST.json", file=sys.stderr)
        return 2
    try:
        path = Path(argv[1])
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, dict):
            raise ValueError("root JSON must be an object")
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"BLOCKED: manifest not readable: {exc}", file=sys.stderr)
        return 2
    errors = validate(payload)
    if errors:
        print("BLOCKED: release preflight failed")
        for error in errors:
            print(f" - {error}")
        return 1
    print("READY FOR MANUAL FIGMA LIBRARY PUBLISH (nothing was published)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
