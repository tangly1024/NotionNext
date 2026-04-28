#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path


def extract(pattern: str, text: str):
    match = re.search(pattern, text)
    return match.group(1) if match else None


def audit_file(path: Path):
    text = path.read_text(errors="ignore")
    if 'article:published_time' not in text:
      return None

    og_type = extract(r'og:type" content="([^"]+)', text)
    article_section = extract(r'article:section" content="([^"]*)', text)
    canonical = extract(r'<link rel="canonical" href="([^"]+)', text)

    issues = []
    if og_type != 'article':
        issues.append(f'og:type={og_type!r}')
    if not article_section:
        issues.append('missing article:section')
    if 'BreadcrumbList' not in text:
        issues.append('missing BreadcrumbList')
    if '"@type":"Article"' not in text and 'schema.org/Article' not in text:
        issues.append('missing Article schema')
    if not canonical:
        issues.append('missing canonical')

    return {
        'file': str(path),
        'canonical': canonical,
        'og_type': og_type,
        'article_section': article_section,
        'issues': issues,
    }


def main():
    parser = argparse.ArgumentParser(description='Audit built article SEO output in .next/server HTML files.')
    parser.add_argument(
        '--root',
        default=str(Path.cwd() / '.next' / 'server'),
        help='Root directory containing built HTML files.'
    )
    parser.add_argument(
        '--output',
        help='Optional JSON output path.'
    )
    args = parser.parse_args()

    root = Path(args.root)
    results = []
    for path in sorted(root.rglob('*.html')):
        audit = audit_file(path)
        if audit:
            results.append(audit)

    failing = [item for item in results if item['issues']]
    summary = {
        'root': str(root),
        'article_pages': len(results),
        'failing_pages': len(failing),
        'failures': failing,
    }

    print(json.dumps(summary, ensure_ascii=False, indent=2))

    if args.output:
        output_path = Path(args.output)
        output_path.write_text(
            json.dumps(summary, ensure_ascii=False, indent=2),
            encoding='utf-8'
        )

    raise SystemExit(1 if failing else 0)


if __name__ == '__main__':
    main()
