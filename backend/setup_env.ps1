Set-Location -Path "d:\gear\backend"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic init migrations
