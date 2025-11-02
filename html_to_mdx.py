#!/usr/bin/env python3
"""Convert WordPress HTML to MDX for Astro landing pages."""

import sys
import re
from html.parser import HTMLParser
from html import unescape

class ContentExtractor(HTMLParser):
    """Extract main content from HTML."""

    def __init__(self):
        super().__init__()
        self.in_main = False
        self.in_article = False
        self.in_content = False
        self.depth = 0
        self.content_depth = 0
        self.title = ""
        self.content = []
        self.current_tag = None
        self.skip_tags = {'script', 'style', 'nav', 'header', 'footer'}
        self.in_skip = 0

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)

        # Skip unwanted sections
        if tag in self.skip_tags:
            self.in_skip += 1
            return

        if self.in_skip > 0:
            return

        # Find main content area
        if tag == 'main':
            self.in_main = True
            self.content_depth = 0
            return
        elif tag == 'article':
            self.in_article = True
            self.content_depth = 0
            return
        elif 'class' in attrs_dict:
            classes = attrs_dict['class']
            if any(x in classes for x in ['entry-content', 'content', 'post-content']):
                self.in_content = True
                self.content_depth = 0
                return

        # Track depth
        if self.in_main or self.in_article or self.in_content:
            self.content_depth += 1
            self.current_tag = tag

            # Convert tags to MDX
            if tag == 'h1':
                self.content.append('\n# ')
            elif tag == 'h2':
                self.content.append('\n## ')
            elif tag == 'h3':
                self.content.append('\n### ')
            elif tag == 'h4':
                self.content.append('\n#### ')
            elif tag == 'p':
                self.content.append('\n\n')
            elif tag == 'ul':
                self.content.append('\n')
            elif tag == 'ol':
                self.content.append('\n')
            elif tag == 'li':
                self.content.append('- ')
            elif tag == 'a' and 'href' in attrs_dict:
                href = attrs_dict['href']
                self.content.append(f'[')
            elif tag == 'strong' or tag == 'b':
                self.content.append('**')
            elif tag == 'em' or tag == 'i':
                self.content.append('*')

    def handle_endtag(self, tag):
        if tag in self.skip_tags:
            self.in_skip = max(0, self.in_skip - 1)
            return

        if self.in_skip > 0:
            return

        if tag == 'main':
            self.in_main = False
            return
        elif tag == 'article':
            self.in_article = False
            return
        elif tag == 'div' and self.content_depth == 0:
            self.in_content = False
            return

        if self.in_main or self.in_article or self.in_content:
            self.content_depth -= 1

            if tag == 'a' and self.current_tag == 'a':
                self.content.append(']')
            elif tag == 'strong' or tag == 'b':
                self.content.append('**')
            elif tag == 'em' or tag == 'i':
                self.content.append('*')
            elif tag == 'li':
                self.content.append('\n')

    def handle_data(self, data):
        if self.in_skip > 0:
            return

        if self.in_main or self.in_article or self.in_content:
            # Clean up whitespace but preserve structure
            data = data.strip()
            if data:
                self.content.append(data)

    def get_content(self):
        """Return the extracted content as a string."""
        text = ' '.join(self.content)
        # Clean up extra whitespace
        text = re.sub(r'\n\n+', '\n\n', text)
        text = re.sub(r'  +', ' ', text)
        return text.strip()

def extract_title_from_html(filepath):
    """Extract title from HTML file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Try to find title in various ways
    patterns = [
        r'<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>(.*?)</h1>',
        r'<title>(.*?)</title>',
        r'<h1[^>]*>(.*?)</h1>',
    ]

    for pattern in patterns:
        match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
        if match:
            title = match.group(1)
            # Clean HTML tags
            title = re.sub(r'<[^>]+>', '', title)
            title = unescape(title)
            # Remove site suffix
            title = re.sub(r'\s*-\s*Open Opportunities.*$', '', title)
            return title.strip()

    return "Untitled Page"

def html_to_mdx(filepath):
    """Convert HTML file to MDX format."""
    # Extract title
    title = extract_title_from_html(filepath)

    # Parse content
    with open(filepath, 'r', encoding='utf-8') as f:
        html_content = f.read()

    parser = ContentExtractor()
    parser.feed(html_content)
    content = parser.get_content()

    # Generate slug from filename
    import os
    filename = os.path.basename(filepath)
    slug = filename.replace('.html', '').lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')

    # Create MDX with frontmatter
    mdx = f"""---
title: "{title}"
meta_title: "{title} - Open Opportunities"
description: "{title}"
draft: false
---

# {title}

{content}
"""

    return mdx

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python html_to_mdx.py <html_file>")
        sys.exit(1)

    mdx_content = html_to_mdx(sys.argv[1])
    print(mdx_content)
