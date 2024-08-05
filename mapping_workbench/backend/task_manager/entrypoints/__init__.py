from celery import Celery

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.task_manager.adapters.task_manager import TaskManager

tasks_app = Celery(
    'tasks',
    broker=f'redis://{settings.TASKS_REDIS_SERVER}:{settings.TASKS_REDIS_PORT}/{settings.TASKS_REDIS_DB_NUMBER}',
    backend=f'redis://{settings.TASKS_REDIS_SERVER}:{settings.TASKS_REDIS_PORT}/{settings.TASKS_REDIS_DB_BACKEND_NUMBER}',
)
tasks_app.conf.task_routes = {'tasks.*': {'queue': 'tasks'}}
tasks_app.conf.task_default_queue = 'tasks'

AppTaskManager = TaskManager(app=tasks_app)
