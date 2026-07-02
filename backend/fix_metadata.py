import os
import glob

for filepath in glob.glob('d:/gear/backend/app/database/models/*.py'):
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = content.replace('metadata = Column(JSON', 'metadata_json = Column("metadata", JSON')
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
