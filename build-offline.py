from pathlib import Path

root = Path(__file__).resolve().parent
dist = root / "dist"
html = (dist / "index.html").read_text()
html = html.replace('<link rel="stylesheet" href="style.css">',
                    '<style>' + (dist / "style.css").read_text() + '</style>')
html = html.replace('<script src="lessons.js" defer></script><script src="fields.js" defer></script><script src="app.js" defer></script>', '')
scripts = '\n'.join((dist / name).read_text() for name in ['lessons.js', 'fields.js', 'app.js'])
html = html.replace('</body>', '<script>' + scripts + '</script></body>')
(dist / "nlp-learning.html").write_text(html)
print("Built dist/nlp-learning.html (offline, self-contained)")
