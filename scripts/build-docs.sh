#!/usr/bin/env bash
# Rebuild the tutorial's Markdown, Word and PDF copies from html/.
#
# html/ is the source of truth. This writes, in 01-multi-agent-orchestration/:
#   tutorial.md     via scripts/docs/html2md.py
#   tutorial.docx   via pandoc, styled by scripts/docs/reference.docx
#   tutorial.pdf    via pandoc + WeasyPrint, styled by scripts/docs/print.css
#
#   scripts/build-docs.sh           rebuild all three
#   scripts/build-docs.sh --check   exit 1 if tutorial.md is out of date with html/
#
# Needs python3, pandoc and weasyprint (brew install pandoc weasyprint).
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
docs="$root/scripts/docs"
out="$root/01-multi-agent-orchestration"

if [[ "${1:-}" == "--check" ]]; then
  if python3 "$docs/html2md.py" "$root/html" | diff -q - "$out/tutorial.md" >/dev/null; then
    echo "build-docs: tutorial.md is up to date"
  else
    echo "build-docs: tutorial.md is out of date; run scripts/build-docs.sh" >&2
    exit 1
  fi
  exit 0
fi

for tool in python3 pandoc weasyprint; do
  command -v "$tool" >/dev/null || { echo "build-docs: $tool not found" >&2; exit 1; }
done

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
python3 "$docs/html2md.py" "$root/html" > "$out/tutorial.md"
title="$(sed -n 's/^# //p' "$out/tutorial.md" | head -1)"

# pandoc resolves the md's ../html/images paths from the md's own folder.
cd "$out"
pandoc tutorial.md -f markdown -t docx --reference-doc="$docs/reference.docx" -o tutorial.docx
# Drop directory entries pandoc adds; Word and Pages don't need them.
zip -qd tutorial.docx '*/' >/dev/null 2>&1 || true

pandoc tutorial.md -f markdown -t html5 --standalone --metadata title="$title" \
  --css "$docs/print.css" --embed-resources -o "$tmp/tutorial.html"
weasyprint "$tmp/tutorial.html" tutorial.pdf 2> >(grep -vi warning >&2 || true)

echo "build-docs: wrote tutorial.md, tutorial.docx, tutorial.pdf"
