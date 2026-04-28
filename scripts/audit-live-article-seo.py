#!/usr/bin/env python3
import argparse
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET


def fetch_response(url: str):
    with urllib.request.urlopen(url, timeout=30) as response:
        final_url = response.geturl()
        text = response.read().decode('utf-8', errors='ignore')
        return final_url, text


def extract(pattern: str, text: str):
    match = re.search(pattern, text)
    return match.group(1) if match else None


def load_sitemap_urls(sitemap_url: str):
    _, xml_text = fetch_response(sitemap_url)
    root = ET.fromstring(xml_text)
    ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = []
    for loc in root.findall('.//sm:url/sm:loc', ns):
        if loc.text:
            urls.append(loc.text.strip())
    return urls


def audit_url(url: str):
    final_url, text = fetch_response(url)
    is_article = 'article:published_time' in text
    if not is_article:
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
    if canonical != final_url:
        issues.append(f'canonical={canonical!r}')

    return {
        'url': url,
        'final_url': final_url,
        'og_type': og_type,
        'article_section': article_section,
        'canonical': canonical,
        'issues': issues,
    }


def main():
    parser = argparse.ArgumentParser(description='Audit live article SEO output from sitemap URLs.')
    parser.add_argument('--sitemap', default='https://www.charliiai.com/sitemap.xml')
    parser.add_argument('--limit', type=int, default=0)
    parser.add_argument('--output')
    args = parser.parse_args()

    urls = load_sitemap_urls(args.sitemap)
    if args.limit > 0:
        urls = urls[:args.limit]

    results = []
    failures = []
    for url in urls:
        try:
            record = audit_url(url)
            if not record:
                continue
            results.append(record)
            if record['issues']:
                failures.append(record)
            print(f"[{'FAIL' if record['issues'] else 'PASS'}] {url}", file=sys.stderr)
        except Exception as error:
            failures.append({'url': url, 'issues': [str(error)]})
            print(f"[ERROR] {url} {error}", file=sys.stderr)

    summary = {
        'sitemap': args.sitemap,
        'article_pages': len(results),
        'failing_pages': len(failures),
        'failures': failures,
    }

    print(json.dumps(summary, ensure_ascii=False, indent=2))

    if args.output:
        with open(args.output, 'w', encoding='utf-8') as file:
            json.dump(summary, file, ensure_ascii=False, indent=2)

    raise SystemExit(1 if failures else 0)


if __name__ == '__main__':
    main()
