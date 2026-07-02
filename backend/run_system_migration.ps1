Set-Location -Path "d:\gear\backend"
.\venv\Scripts\Activate.ps1
alembic revision --autogenerate -m "Upgrade schema to V2"
alembic upgrade head
