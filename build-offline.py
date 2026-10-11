from pathlib import Path
import json
import re

root = Path(__file__).resolve().parent
dist = root / "dist"
assets = {name: (dist / "examples" / name).read_text(encoding="utf-8")
          for name in ("reviews.csv", "review_classification.py")}
(dist / "examples.js").write_text(
    'const EXAMPLE_FILES = ' + json.dumps(assets, ensure_ascii=False).replace('</', '<\\/')
    + ';\nLESSONS[11].code = EXAMPLE_FILES["review_classification.py"];\n', encoding="utf-8")
html = (dist / "index.html").read_text()
html = html.replace('<link rel="stylesheet" href="style.css">',
                    '<style>' + (dist / "style.css").read_text() + '</style>')
script_names = re.findall(r'<script src="([^"/]+\.js)" defer></script>', html)
html = re.sub(r'<script src="[^"/]+\.js" defer></script>', '', html)
scripts = '\n'.join((dist / name).read_text() for name in script_names)
html = html.replace('</body>', '<script>' + scripts + '</script></body>')
(dist / "nlp-learning.html").write_text(html)
print("Built dist/nlp-learning.html (offline, self-contained)")
