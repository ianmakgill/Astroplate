#!/bin/bash
# Batch convert WordPress HTML files to MDX landing pages

SOURCE_DIR="/Users/openopps/Downloads/wordpress-site-pages"
OUTPUT_DIR="/Users/openopps/github/Astroplate/src/content/landing-pages"

# Convert each HTML file
for file in "$SOURCE_DIR"/*.html; do
    # Get base filename without path and extension
    basename=$(basename "$file" .html)

    # Create a slug from the filename
    slug=$(echo "$basename" | sed 's/ - Open Opportunities//g' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')

    echo "Converting: $basename"
    echo "  -> $slug.mdx"

    # Convert HTML to MDX
    python3 html_to_mdx.py "$file" > "$OUTPUT_DIR/$slug.mdx"
done

echo ""
echo "Conversion complete! Files saved to $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "1. Review the converted files and clean up any formatting issues"
echo "2. Remove navigation elements (Login, Try for free buttons)"
echo "3. Add appropriate shortcodes (Button, Notice, etc.) where needed"
echo "4. Update frontmatter descriptions"
