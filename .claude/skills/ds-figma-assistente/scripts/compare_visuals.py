#!/usr/bin/env python3
"""Confronto PNG 1:1 senza resize automatico. Richiede Pillow.

Uso: python3 compare_visuals.py browser.png figma.png --output-dir reports/figma-lit-audit/diff
Produce diff.png e metrics.json. Non decide da solo se il componente è conforme.
"""
import argparse
import json
from pathlib import Path
import sys

try:
    from PIL import Image, ImageChops
except ImportError:
    sys.exit("Pillow mancante. Installala solo previa approvazione (python3 -m pip install Pillow).")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("browser", type=Path)
    parser.add_argument("figma", type=Path)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--tolerance", type=int, default=16,
                        help="Massima differenza ammessa per canale 0-255 (default 16)")
    args = parser.parse_args()
    if not 0 <= args.tolerance <= 255:
        parser.error("--tolerance deve essere tra 0 e 255")

    # Sfondo di compositing fisso: confrontiamo i PNG anche se contengono alpha.
    def load_rgb(path):
        with Image.open(path) as img:
            rgba = img.convert("RGBA")
            background = Image.new("RGBA", rgba.size, "white")
            background.alpha_composite(rgba)
            return background.convert("RGB")

    left = load_rgb(args.browser)
    right = load_rgb(args.figma)
    result = {
        "browser": str(args.browser),
        "figma": str(args.figma),
        "browser_size": list(left.size),
        "figma_size": list(right.size),
        "same_size": left.size == right.size,
        "tolerance_per_channel": args.tolerance,
        "note": "Metrica indicativa; antialiasing, DPR, crop e font possono generare differenze. Non equivale a PASS/FAIL.",
    }
    args.output_dir.mkdir(parents=True, exist_ok=True)
    if left.size != right.size:
        result["error"] = "Dimensioni diverse: allineare crop/DPR; nessun resize automatico"
        (args.output_dir / "metrics.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
        print(json.dumps(result, indent=2))
        return 2

    diff = ImageChops.difference(left, right)
    width, height = left.size
    n = width * height
    total_abs_diff = 0
    differing_pixels = 0
    heatmap = Image.new("RGB", left.size, "black")
    source = diff.load()
    target = heatmap.load()
    for y in range(height):
        for x in range(width):
            px = source[x, y]
            total_abs_diff += sum(px)
            difference = max(px)
            if difference > args.tolerance:
                differing_pixels += 1
            target[x, y] = (min(255, difference * 3), 0, 0)

    result.update({
        "pixels": n,
        "differing_pixels": differing_pixels,
        "differing_percent": round(100.0 * differing_pixels / n, 3) if n else None,
        "mean_absolute_error_0_255": round(total_abs_diff / (n * 3), 3) if n else None,
    })
    heatmap.save(args.output_dir / "diff.png")
    (args.output_dir / "metrics.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
