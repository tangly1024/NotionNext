#!/usr/bin/env python3
"""
Batch URL Inspection for Google Search Console via direct REST calls.

Uses a service account JSON that already has Search Console access.

Examples:
  python scripts/gsc-url-inspect.py \
    --site-url sc-domain:charliiai.com \
    --url https://www.charliiai.com/ \
    --url https://www.charliiai.com/about

  python scripts/gsc-url-inspect.py \
    --site-url sc-domain:charliiai.com \
    --from-sitemap https://www.charliiai.com/sitemap.xml \
    --limit 10 \
    --output /Users/Yuki/drafts/charliiai-gsc-inspection.json
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import xml.etree.ElementTree as ET

import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account


DEFAULT_CREDS = "/Users/Yuki/.config/google-search-console-cli/credentials.json"
INSPECTION_ENDPOINT = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect"
SITEMAP_NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def load_token(credentials_file: str) -> str:
    creds = service_account.Credentials.from_service_account_file(
        credentials_file,
        scopes=["https://www.googleapis.com/auth/webmasters"],
    )
    creds.refresh(Request())
    return creds.token


def fetch_sitemap_urls(sitemap_url: str) -> list[str]:
    response = requests.get(sitemap_url, timeout=60)
    response.raise_for_status()
    root = ET.fromstring(response.text)
    urls = []
    for node in root.findall("sm:url/sm:loc", SITEMAP_NS):
        if node.text:
            urls.append(node.text.strip())
    return urls


def inspect_url(token: str, site_url: str, inspection_url: str, language_code: str) -> dict:
    response = requests.post(
        INSPECTION_ENDPOINT,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        json={
            "inspectionUrl": inspection_url,
            "siteUrl": site_url,
            "languageCode": language_code,
        },
        timeout=60,
    )
    response.raise_for_status()
    payload = response.json()
    result = payload.get("inspectionResult", {})
    index = result.get("indexStatusResult", {})
    return {
        "url": inspection_url,
        "inspectionResultLink": result.get("inspectionResultLink"),
        "verdict": index.get("verdict"),
        "coverageState": index.get("coverageState"),
        "robotsTxtState": index.get("robotsTxtState"),
        "indexingState": index.get("indexingState"),
        "lastCrawlTime": index.get("lastCrawlTime"),
        "pageFetchState": index.get("pageFetchState"),
        "googleCanonical": index.get("googleCanonical"),
        "userCanonical": index.get("userCanonical"),
        "sitemap": index.get("sitemap", []),
        "referringUrls": index.get("referringUrls", []),
        "crawledAs": index.get("crawledAs"),
        "raw": payload,
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Batch inspect URLs in Google Search Console")
    parser.add_argument("--site-url", required=True, help="GSC property, e.g. sc-domain:charliiai.com")
    parser.add_argument(
        "--credentials-file",
        default=os.environ.get("GOOGLE_CREDENTIALS_FILE", DEFAULT_CREDS),
        help=f"Service account credentials JSON (default: {DEFAULT_CREDS})",
    )
    parser.add_argument("--language-code", default="zh-CN", help="Inspection language code")
    parser.add_argument("--url", action="append", default=[], help="URL to inspect; repeatable")
    parser.add_argument("--from-sitemap", help="Load URLs from sitemap.xml")
    parser.add_argument("--limit", type=int, help="Limit URLs after loading")
    parser.add_argument("--output", help="Write JSON results to a file")
    parser.add_argument("--include-raw", action="store_true", help="Keep raw API payloads in output")
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    urls = list(args.url)
    if args.from_sitemap:
        urls.extend(fetch_sitemap_urls(args.from_sitemap))

    deduped_urls = []
    seen = set()
    for url in urls:
        if url and url not in seen:
            seen.add(url)
            deduped_urls.append(url)

    if args.limit:
        deduped_urls = deduped_urls[: args.limit]

    if not deduped_urls:
        parser.error("Provide at least one --url or use --from-sitemap")

    token = load_token(args.credentials_file)
    results = []
    for url in deduped_urls:
        try:
            item = inspect_url(token, args.site_url, url, args.language_code)
            if not args.include_raw:
                item.pop("raw", None)
            results.append(item)
            print(
                f"[PASS] {url} | {item.get('coverageState') or 'no coverage'} | "
                f"{item.get('pageFetchState') or 'no fetch state'}"
            )
        except Exception as exc:  # pragma: no cover - operational path
            error_item = {"url": url, "error": str(exc)}
            results.append(error_item)
            print(f"[FAIL] {url} | {exc}", file=sys.stderr)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as file:
            json.dump(results, file, ensure_ascii=False, indent=2)
        print(f"\nSaved -> {args.output}")
    else:
        print(json.dumps(results, ensure_ascii=False, indent=2))

    failures = [item for item in results if item.get("error")]
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
