#!/usr/bin/env python3
"""Extract main content from WordPress view-source HTML files."""

import sys
import re
from html.parser import HTMLParser
from html import unescape

def extract_content_from_viewsource(filepath):
    """Extract content from view-source HTML file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # View-source files wrap the actual HTML, so extract it
    # Look for the actual HTML content between the browser wrapper
    match = re.search(r'<span class="html-tag">&lt;!DOCTYPE html&gt;</span>.*?</tbody>', content, re.DOTALL)
    if match:
        # Extract and unescape the HTML entities
        html_content = match.group(0)
        # Remove view-source table formatting
        html_content = re.sub(r'<tr><td class="line-number"[^>]*>.*?</td><td class="line-content">', '', html_content)
        html_content = re.sub(r'</td></tr>', '\n', html_content)
        html_content = unescape(html_content)
        html_content = unescape(html_content)  # Double unescape for &amp; -> &
    else:
        html_content = content

    # Extract main content area
    patterns = [
        r'<main[^>]*>(.*?)</main>',
        r'<article[^>]*>(.*?)</article>',
        r'<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>(.*?)</div>',
        r'<div[^>]*class="[^"]*content[^"]*"[^>]*>(.*?)</div>',
    ]

    main_content = None
    for pattern in patterns:
        match = re.search(pattern, html_content, re.DOTALL | re.IGNORECASE)
        if match:
            main_content = match.group(1)
            break

    if not main_content:
        print("Could not find main content area", file=sys.stderr)
        return ""

    # Clean up the content - remove scripts, styles, comments
    main_content = re.sub(r'<script[^>]*>.*?</script>', '', main_content, flags=re.DOTALL | re.IGNORECASE)
    main_content = re.sub(r'<style[^>]*>.*?</style>', '', main_content, flags=re.DOTALL | re.IGNORECASE)
    main_content = re.sub(r'<!--.*?-->', '', main_content, flags=re.DOTALL)

    return main_content.strip()

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python extract_content.py <html_file>")
        sys.exit(1)

    content = extract_content_from_viewsource(sys.argv[1])
    print(content)
