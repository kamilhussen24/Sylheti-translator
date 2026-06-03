import os
import subprocess
import xml.etree.ElementTree as ET
from xml.dom import minidom
from datetime import datetime

BASE_URL = "https://sylheti.kamildex.com"
OUTPUT_FILE = "sitemap.xml"
HTML_ROOT = "./"

EXCLUDE_FILES = {"404.html", "test.html"}
EXCLUDE_DIRS = {".github", "assets", "api", "apps", "image", "test", "temp", "node_modules"}


def get_last_modified(file_path):
    """Return the last Git commit date for a file, falling back to filesystem mtime."""
    try:
        result = subprocess.run(
            ["git", "log", "-1", "--pretty=%cI", "--", file_path],
            capture_output=True, text=True
        )
        if result.returncode == 0 and result.stdout.strip():
            return result.stdout.strip()
    except Exception:
        pass

    mtime = os.path.getmtime(file_path)
    return datetime.utcfromtimestamp(mtime).strftime("%Y-%m-%dT%H:%M:%SZ")


def build_url(file_path):
    """Convert a file path to its public URL."""
    relative = os.path.relpath(file_path, HTML_ROOT).replace("\\", "/")

    if file_path.endswith("index.html"):
        directory = os.path.dirname(relative)
        if directory in (".", ""):
            return f"{BASE_URL}/"
        return f"{BASE_URL}/{directory}/"

    return f"{BASE_URL}/{os.path.splitext(relative)[0]}"


def get_page_config(url):
    """Return changefreq and priority based on URL type."""
    if url == f"{BASE_URL}/":
        return "daily", "1.0"
    if url == f"{BASE_URL}/blog/":
        return "weekly", "0.9"
    if "/blog/" in url:
        return "monthly", "0.7"
    return "monthly", "0.8"


def collect_html_files():
    """Walk the project and yield all public HTML file paths."""
    for root, dirs, files in os.walk(HTML_ROOT):
        # Prune excluded directories in-place so os.walk won't descend into them
        dirs[:] = sorted(d for d in dirs if d not in EXCLUDE_DIRS)

        for filename in sorted(files):
            if filename in EXCLUDE_FILES or not filename.endswith(".html"):
                continue
            yield os.path.join(root, filename)


def build_xml(urls):
    """Build and return a pretty-printed sitemap XML string."""
    urlset = ET.Element("urlset", {
        "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xsi:schemaLocation": (
            "http://www.sitemaps.org/schemas/sitemap/0.9 "
            "http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
        ),
    })

    for loc, lastmod, changefreq, priority in urls:
        url_el = ET.SubElement(urlset, "url")
        ET.SubElement(url_el, "loc").text = loc
        ET.SubElement(url_el, "lastmod").text = lastmod
        ET.SubElement(url_el, "changefreq").text = changefreq
        ET.SubElement(url_el, "priority").text = priority

    raw_xml = ET.tostring(urlset, encoding="unicode")
    pretty = minidom.parseString(raw_xml).toprettyxml(indent="  ")

    # Replace the generic declaration minidom adds with a proper one
    lines = pretty.splitlines()
    lines[0] = '<?xml version="1.0" encoding="UTF-8"?>'

    # Remove blank lines minidom inserts between elements
    return "\n".join(line for line in lines if line.strip())


def generate_sitemap():
    entries = []

    for file_path in collect_html_files():
        loc = build_url(file_path)
        lastmod = get_last_modified(file_path)
        changefreq, priority = get_page_config(loc)
        entries.append((loc, lastmod, changefreq, priority))

    xml_content = build_xml(entries)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(xml_content)

    print(f"Sitemap generated: {OUTPUT_FILE} ({len(entries)} URLs)")
    for loc, lastmod, changefreq, priority in entries:
        print(f"  [{priority}] {loc}  ({lastmod})")


if __name__ == "__main__":
    generate_sitemap()
