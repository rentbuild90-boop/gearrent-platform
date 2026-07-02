Set-Location -Path "d:\gear\backend"
.\venv\Scripts\Activate.ps1
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head
python seed\run_seed.py
