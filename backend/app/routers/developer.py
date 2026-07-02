from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, inspect
from app.database.connection import get_db
from datetime import datetime, date

router = APIRouter(prefix="/developer/database", tags=["Developer Database"])

# Helper function to serialize datetime/date objects to string for JSON responses
def serialize_value(val):
    if isinstance(val, (datetime, date)):
        return val.isoformat()
    return val

@router.get("/tables")
async def list_tables(db: AsyncSession = Depends(get_db)):
    try:
        def get_tables(sync_session):
            insp = inspect(sync_session.bind)
            return insp.get_table_names()
            
        tables = await db.run_sync(get_tables)
        return {"success": True, "tables": sorted(tables)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve tables: {str(e)}")

@router.get("/tables/{table_name}")
async def get_table_data(table_name: str, db: AsyncSession = Depends(get_db)):
    try:
        # Verify table name is valid to prevent SQL injection
        def get_tables(sync_session):
            insp = inspect(sync_session.bind)
            return insp.get_table_names()
        
        tables = await db.run_sync(get_tables)
        if table_name not in tables:
            raise HTTPException(status_code=400, detail="Invalid table name")

        # Get Columns
        def get_cols(sync_session):
            insp = inspect(sync_session.bind)
            pk_cols = insp.get_pk_constraint(table_name).get("constrained_columns", [])
            cols = insp.get_columns(table_name)
            return [{
                "name": c["name"],
                "type": str(c["type"]),
                "nullable": c["nullable"],
                "primary_key": c["name"] in pk_cols
            } for c in cols]
            
        columns = await db.run_sync(get_cols)

        # Get records (limit 150)
        query = text(f"SELECT * FROM `{table_name}` LIMIT 150")
        result = await db.execute(query)
        keys = list(result.keys())
        
        records = []
        for row in result.fetchall():
            row_dict = {}
            for k, v in zip(keys, row):
                row_dict[k] = serialize_value(v)
            records.append(row_dict)

        return {
            "success": True,
            "columns": columns,
            "records": records
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to query table: {str(e)}")

@router.post("/tables/{table_name}/insert")
async def insert_record(table_name: str, payload: dict, db: AsyncSession = Depends(get_db)):
    try:
        def get_tables(sync_session):
            return inspect(sync_session.bind).get_table_names()
        tables = await db.run_sync(get_tables)
        if table_name not in tables:
            raise HTTPException(status_code=400, detail="Invalid table name")

        if not payload:
            raise HTTPException(status_code=400, detail="Empty payload")

        # Dynamically build INSERT INTO `table` (col1, col2) VALUES (:col1, :col2)
        cols = ", ".join([f"`{k}`" for k in payload.keys()])
        placeholders = ", ".join([f":{k}" for k in payload.keys()])
        query = text(f"INSERT INTO `{table_name}` ({cols}) VALUES ({placeholders})")
        
        await db.execute(query, payload)
        await db.commit()
        return {"success": True, "message": "Record inserted successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Insert failed: {str(e)}")

@router.post("/tables/{table_name}/update")
async def update_record(table_name: str, payload: dict, db: AsyncSession = Depends(get_db)):
    try:
        def get_tables(sync_session):
            return inspect(sync_session.bind).get_table_names()
        tables = await db.run_sync(get_tables)
        if table_name not in tables:
            raise HTTPException(status_code=400, detail="Invalid table name")

        pk_field = payload.get("primary_key_field")
        pk_value = payload.get("primary_key_value")
        data = payload.get("data")

        if not pk_field or pk_value is None or not data:
            raise HTTPException(status_code=400, detail="Missing primary key configuration or data updates")

        # Dynamically build UPDATE `table` SET col1 = :col1, col2 = :col2 WHERE pk_field = :pk_val
        set_clauses = ", ".join([f"`{k}` = :{k}" for k in data.keys()])
        query = text(f"UPDATE `{table_name}` SET {set_clauses} WHERE `{pk_field}` = :pk_value_param")
        
        params = {**data, "pk_value_param": pk_value}
        await db.execute(query, params)
        await db.commit()
        return {"success": True, "message": "Record updated successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")

@router.post("/tables/{table_name}/delete")
async def delete_record(table_name: str, payload: dict, db: AsyncSession = Depends(get_db)):
    try:
        def get_tables(sync_session):
            return inspect(sync_session.bind).get_table_names()
        tables = await db.run_sync(get_tables)
        if table_name not in tables:
            raise HTTPException(status_code=400, detail="Invalid table name")

        pk_field = payload.get("primary_key_field")
        pk_value = payload.get("primary_key_value")

        if not pk_field or pk_value is None:
            raise HTTPException(status_code=400, detail="Missing primary key config for deletion")

        query = text(f"DELETE FROM `{table_name}` WHERE `{pk_field}` = :pk_value_param")
        await db.execute(query, {"pk_value_param": pk_value})
        await db.commit()
        return {"success": True, "message": "Record deleted successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Deletion failed: {str(e)}")
