from sqlalchemy import Column, String, Boolean, JSON, ForeignKey, BigInteger, DECIMAL, DateTime, Text
from sqlalchemy.orm import relationship
from app.database.base import Base, AuditMixin

class ServerLog(Base, AuditMixin):
    __tablename__ = "server_logs"
    
    level = Column(String(20), nullable=False) # INFO, WARN, ERROR, DEBUG, FATAL
    source = Column(String(50), nullable=False) # BACKEND, FRONTEND, REDIS, WORKER
    message = Column(Text, nullable=False)
    trace_id = Column(String(100), nullable=True)
    stack_trace = Column(Text, nullable=True)
    metadata_json = Column("metadata", JSON, nullable=True)
    logged_at = Column(DateTime(timezone=True), nullable=False)

class DatabaseBackup(Base, AuditMixin):
    __tablename__ = "database_backups"
    
    backup_code = Column(String(50), unique=True, index=True, nullable=False)
    type = Column(String(50), nullable=False) # FULL_DATABASE, UPLOADS, CONFIGURATION
    file_path = Column(String(500), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    checksum = Column(String(255), nullable=True)
    status = Column(String(20), default="IN_PROGRESS") # IN_PROGRESS, SUCCESS, FAILED
    started_at = Column(DateTime(timezone=True), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    retention_days = Column(BigInteger, default=30)
    initiated_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)

class QueueJob(Base, AuditMixin):
    __tablename__ = "queue_jobs"
    
    queue = Column(String(50), default="DEFAULT") # DEFAULT, EMAILS, CRITICAL
    name = Column(String(255), nullable=False)
    payload = Column(JSON, nullable=False)
    status = Column(String(20), default="QUEUED") # QUEUED, RUNNING, COMPLETED, FAILED, RETRYING
    attempts = Column(BigInteger, default=0)
    max_attempts = Column(BigInteger, default=3)
    priority = Column(BigInteger, default=0)
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(Text, nullable=True)

class QueueHistory(Base, AuditMixin):
    __tablename__ = "queue_history"
    
    job_id = Column(BigInteger, ForeignKey("queue_jobs.id"), nullable=False)
    attempt = Column(BigInteger, nullable=False)
    status = Column(String(20), nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(Text, nullable=True)

class EnvironmentVariable(Base, AuditMixin):
    __tablename__ = "environment_variables"
    
    key = Column(String(255), unique=True, index=True, nullable=False)
    value_encrypted = Column(Text, nullable=False)
    group = Column(String(50), nullable=True)
    is_secret = Column(Boolean, default=False)
    description = Column(String(500), nullable=True)

class ServiceStatus(Base, AuditMixin):
    __tablename__ = "service_status"
    
    name = Column(String(100), unique=True, index=True, nullable=False)
    type = Column(String(50), nullable=False) # NEXTJS, FASTAPI, CELERY, REDIS, MYSQL, NGINX
    status = Column(String(20), default="STOPPED") # RUNNING, STOPPED, ERROR, DEGRADED
    uptime = Column(String(100), nullable=True)
    memory_usage = Column(String(50), nullable=True)
    cpu_usage = Column(DECIMAL(5, 2), nullable=True)
    latency_ms = Column(BigInteger, nullable=True)
    last_checked_at = Column(DateTime(timezone=True), nullable=True)

class DeploymentHistory(Base, AuditMixin):
    __tablename__ = "deployment_history"
    
    deployment_code = Column(String(50), unique=True, index=True, nullable=False)
    environment = Column(String(50), nullable=False) # PRODUCTION, STAGING, DEVELOPMENT
    branch = Column(String(100), nullable=False)
    commit_hash = Column(String(100), nullable=False)
    commit_message = Column(Text, nullable=True)
    author = Column(String(100), nullable=True)
    status = Column(String(20), default="IN_PROGRESS") # IN_PROGRESS, SUCCESS, FAILED, ROLLED_BACK
    started_at = Column(DateTime(timezone=True), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    rollback_of = Column(BigInteger, ForeignKey("deployment_history.id"), nullable=True)

class Webhook(Base, AuditMixin):
    __tablename__ = "webhooks"
    
    event = Column(String(100), nullable=False)
    endpoint_url = Column(String(500), nullable=False)
    secret_hash = Column(String(255), nullable=False)
    status = Column(String(20), default="ACTIVE") # ACTIVE, DISABLED
    last_triggered_at = Column(DateTime(timezone=True), nullable=True)
    last_response_code = Column(BigInteger, nullable=True)
    last_response_body = Column(Text, nullable=True)


class SystemHealth(Base, AuditMixin):
    __tablename__ = "system_health"
    
    service_name = Column(String(100), nullable=False, index=True)
    status = Column(String(20), nullable=False) # UP, DOWN, DEGRADED
    last_check_at = Column(DateTime(timezone=True), nullable=False)
    response_time_ms = Column(BigInteger, nullable=True)
    error_details = Column(Text, nullable=True)

