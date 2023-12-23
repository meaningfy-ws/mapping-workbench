from mapping_workbench.backend.config import settings
from mapping_workbench.backend.task_manager.adapters.task_manager import TaskManager

AppTaskManager = TaskManager(max_workers=settings.TASK_MANAGER_MAX_WORKERS)
