import os
import re

model_dir = r"d:\gear\backend\app\database\models"
tables = []

for filename in os.listdir(model_dir):
    if filename.endswith(".py"):
        with open(os.path.join(model_dir, filename), "r", encoding="utf-8") as f:
            content = f.read()
            matches = re.findall(r'__tablename__\s*=\s*["\']([^"\']+)["\']', content)
            tables.extend(matches)

print("Existing tables:")
for t in sorted(tables):
    print(t)
