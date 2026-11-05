#!/usr/bin/env bash
# Exports the held icon pages from Figma as SVG, one folder per page (no LLM, no tokens).
# Run: bash scripts/export-held-icons.sh   (needs TalkToFigma plugin connected)
cd "$(dirname "$0")/.."
while read -r row id dir; do
  echo "[$row] $dir ($id)"
  node scripts/figma-export-page.mjs "$id" "public/icons/$dir" SVG 1 2>&1 | tail -6
done <<LIST
87 5027:42555 crypto
83 15580:69404 outline-default
85 5028:7503 brands
89 4288:329 flags
86 5028:7132 emoji
82 15851:208399 lucide
84 15855:238638 outline-lucide
81 314:956 material
LIST
echo ALL-DONE
