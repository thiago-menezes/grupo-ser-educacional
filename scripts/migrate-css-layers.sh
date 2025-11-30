#!/bin/bash
# Script to migrate existing SCSS module files to use CSS layers
# Usage: ./scripts/migrate-css-layers.sh

set -e

echo "🔄 Migrating SCSS files to use CSS layers..."

# Find all .module.scss files in src/components and src/features
find apps/next/src/components apps/next/src/features -name "*.module.scss" -type f | while read -r file; do
  # Check if file already has @layer
  if grep -q "@layer components" "$file"; then
    echo "✅ Already migrated: $file"
  else
    echo "🔧 Migrating: $file"

    # Create temporary file with @layer wrapper
    {
      echo "@layer components {"
      # Indent all existing content by 2 spaces
      sed 's/^/  /' "$file"
      echo "}"
    } > "$file.tmp"

    # Replace original file
    mv "$file.tmp" "$file"

    echo "✅ Migrated: $file"
  fi
done

echo ""
echo "✅ Migration complete!"
echo ""
echo "📝 Next steps:"
echo "1. Review changes: git diff"
echo "2. Run tests: yarn workspace next test"
echo "3. Run typecheck: yarn workspace next typecheck"
echo "4. Start dev server: yarn dev:next"
