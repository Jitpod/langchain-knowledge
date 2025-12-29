#!/usr/bin/env python3
"""
Clean menu update script - properly replaces sidebar navigation
"""

import re
import sys
from pathlib import Path

# Files that need updating
FILES_TO_UPDATE = [
    '01-introduction.html',
    '03-models.html',
    '04-messages.html',
    '06-agents.html',
    '07-middleware.html',
    '08-rag.html',
    '10-runtime.html',
    '11-checkpointer.html',
    '12-streaming.html',
    '13-human-in-loop.html',
    '14-long-term-memory.html',
    '16-customer-service.html',
    '18-api-reference.html',
    '19-troubleshooting.html'
]

def extract_sidebar(filepath):
    """Extract the complete sidebar section from a file"""
    content = filepath.read_text(encoding='utf-8')

    # Find <nav class="sidebar"> ... </nav>
    start_pattern = r'<nav class="sidebar">'
    end_pattern = r'</nav>'

    start_match = re.search(start_pattern, content)
    if not start_match:
        return None

    start_pos = start_match.start()

    # Find the matching </nav> by counting tags
    search_pos = start_match.end()
    depth = 1

    while depth > 0 and search_pos < len(content):
        next_open = content.find('<nav', search_pos)
        next_close = content.find('</nav>', search_pos)

        if next_close == -1:
            return None

        if next_open != -1 and next_open < next_close:
            depth += 1
            search_pos = next_open + 4
        else:
            depth -= 1
            if depth == 0:
                end_pos = next_close + 6  # Include </nav>
                return content[start_pos:end_pos]
            search_pos = next_close + 6

    return None

def replace_sidebar(target_file, reference_sidebar, active_file):
    """Replace sidebar in target file and set correct active class"""
    content = target_file.read_text(encoding='utf-8')

    # Find and replace the sidebar section
    start_pattern = r'<nav class="sidebar">'
    end_pattern = r'</nav>'

    start_match = re.search(start_pattern, content)
    if not start_match:
        print(f"  ⚠ Could not find sidebar in {target_file.name}")
        return False

    start_pos = start_match.start()

    # Find matching </nav>
    search_pos = start_match.end()
    depth = 1

    while depth > 0 and search_pos < len(content):
        next_open = content.find('<nav', search_pos)
        next_close = content.find('</nav>', search_pos)

        if next_close == -1:
            print(f"  ⚠ Could not find closing </nav> in {target_file.name}")
            return False

        if next_open != -1 and next_open < next_close:
            depth += 1
            search_pos = next_open + 4
        else:
            depth -= 1
            if depth == 0:
                end_pos = next_close + 6
                break
            search_pos = next_close + 6

    # Prepare new sidebar with correct active class
    new_sidebar = reference_sidebar

    # Remove all active classes first
    new_sidebar = re.sub(r'<li class="nav-item active">', '<li class="nav-item">', new_sidebar)

    # Add active class to the matching file
    pattern = f'(<li class="nav-item">\\s*<a href="{re.escape(active_file)}")'
    new_sidebar = re.sub(pattern, r'<li class="nav-item active">\n                            <a href="' + active_file + '"', new_sidebar, count=1)

    # Replace in content
    new_content = content[:start_pos] + new_sidebar + content[end_pos:]

    # Write back
    target_file.write_text(new_content, encoding='utf-8')
    return True

def main():
    base_dir = Path(__file__).parent

    print("\n" + "=" * 60)
    print("Clean Menu Update Script")
    print("=" * 60 + "\n")

    # Extract reference sidebar from index.html
    print("📖 Extracting reference sidebar from index.html...")
    index_file = base_dir / 'index.html'
    reference_sidebar = extract_sidebar(index_file)

    if not reference_sidebar:
        print("❌ Failed to extract sidebar from index.html")
        sys.exit(1)

    print(f"✓ Reference sidebar extracted ({len(reference_sidebar)} characters)\n")

    # Update all files
    print(f"🔧 Updating {len(FILES_TO_UPDATE)} files...\n")

    success_count = 0
    fail_count = 0

    for filename in FILES_TO_UPDATE:
        target_file = base_dir / filename
        if not target_file.exists():
            print(f"⚠ {filename} not found, skipping")
            fail_count += 1
            continue

        if replace_sidebar(target_file, reference_sidebar, filename):
            print(f"✓ {filename}")
            success_count += 1
        else:
            fail_count += 1

    # Summary
    print("\n" + "=" * 60)
    print("Update Complete")
    print("=" * 60 + "\n")
    print(f"Success: {success_count} files")
    print(f"Failed: {fail_count} files\n")

    if fail_count == 0:
        print("✓ All files updated successfully!")
        print("💡 Run: node verify-menu-consistency.js\n")
    else:
        print(f"⚠ {fail_count} files failed to update\n")

if __name__ == '__main__':
    main()
