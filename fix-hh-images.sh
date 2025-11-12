#!/bin/bash
# Script to fix Happy Hideaway images with complete Cloudinary IDs
# Usage: Edit the IDs below, then run: bash fix-hh-images.sh

# EDIT THESE IDS - Replace XXXXXX with the actual 6-character suffixes from Cloudinary
HH2_SUFFIX="XXXXXX"  # Example: hh-2_abc123 -> use "abc123"
HH3_SUFFIX="XXXXXX"
HH4_SUFFIX="XXXXXX"
HH5_SUFFIX="XXXXXX"
HH6_SUFFIX="XXXXXX"
HH7_SUFFIX="XXXXXX"
HH8_SUFFIX="XXXXXX"
HH9_SUFFIX="XXXXXX"
HH10_SUFFIX="XXXXXX"

# Create backup
cp villa-happy-hideaway.html villa-happy-hideaway.html.pre-fix

# Apply replacements
perl -pi -e "
  s|/hh-2\"|/hh-2_${HH2_SUFFIX}\"|g;
  s|/hh-3\"|/hh-3_${HH3_SUFFIX}\"|g;
  s|/hh-4\"|/hh-4_${HH4_SUFFIX}\"|g;
  s|/hh-5\"|/hh-5_${HH5_SUFFIX}\"|g;
  s|/hh-6\"|/hh-6_${HH6_SUFFIX}\"|g;
  s|/hh-7\"|/hh-7_${HH7_SUFFIX}\"|g;
  s|/hh-8\"|/hh-8_${HH8_SUFFIX}\"|g;
  s|/hh-9\"|/hh-9_${HH9_SUFFIX}\"|g;
  s|/hh-10\"|/hh-10_${HH10_SUFFIX}\"|g;
  s|/hh-2'|/hh-2_${HH2_SUFFIX}'|g;
  s|/hh-3'|/hh-3_${HH3_SUFFIX}'|g;
  s|/hh-4'|/hh-4_${HH4_SUFFIX}'|g;
  s|/hh-5'|/hh-5_${HH5_SUFFIX}'|g;
  s|/hh-6'|/hh-6_${HH6_SUFFIX}'|g;
  s|/hh-7'|/hh-7_${HH7_SUFFIX}'|g;
  s|/hh-8'|/hh-8_${HH8_SUFFIX}'|g;
  s|/hh-9'|/hh-9_${HH9_SUFFIX}'|g;
  s|/hh-10'|/hh-10_${HH10_SUFFIX}'|g;
" villa-happy-hideaway.html

# Verify replacements
echo "Verification:"
echo "============="
echo "Remaining incomplete hh-X references: $(grep -c '/hh-[0-9]\"' villa-happy-hideaway.html)"
echo ""
echo "Complete hh-X_ references found:"
grep -o 'hh-[0-9]\+_[a-z0-9]\+' villa-happy-hideaway.html | sort | uniq -c | sort -rn

echo ""
echo "Fix complete! Review the changes above."
echo "If everything looks good, commit with: git add villa-happy-hideaway.html && git commit -m 'Fix Happy Hideaway images with complete Cloudinary IDs'"
