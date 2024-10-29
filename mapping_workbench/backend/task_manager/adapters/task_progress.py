from datetime import datetime

from mapping_workbench.backend.tasks.models.task_response import TaskResponse, TaskProgressAction, \
    TaskProgressActionStep, TaskProgressStatus, TaskProgressData


class TaskProgress:
    current_action: TaskProgressAction = None
    current_action_step: TaskProgressActionStep = None

    def __init__(self, task_response: TaskResponse):
        self.task_response = task_response
        self.progress = TaskProgressData()

    @classmethod
    def current_time(cls) -> float:
        return datetime.now().timestamp()

    def start_progress(self, name: str = None, actions_count: int = 0):
        self.progress.name = name
        self.progress.status = TaskProgressStatus.RUNNING
        self.progress.started_at = self.current_time()
        self.progress.actions_count = actions_count
        self.update_task_response()

    def finish_progress(self):
        self.progress.status = TaskProgressStatus.FINISHED
        self.progress.finished_at = self.current_time()
        self.progress.duration = (
                self.progress.finished_at - self.progress.started_at
        )
        self.update_task_response()

    def start_action(self, name: str = None, steps_count: int = 0):
        self.add_action(TaskProgressAction(
            name=name,
            status=TaskProgressStatus.RUNNING,
            started_at=self.current_time(),
            steps=[],
            steps_count=steps_count
        ))
        self.update_task_response()

    def finish_current_action(self):
        self.update_current_action_status(TaskProgressStatus.FINISHED)
        self.get_current_action().finished_at = self.current_time()
        self.get_current_action().duration = (
                self.get_current_action().finished_at - self.get_current_action().started_at
        )
        self.update_task_response()

    def add_action(self, action: TaskProgressAction):
        if self.task_response is None:
            return
        self.progress.actions.append(action)
        self.set_current_action(action)
        self.update_task_response()

    def set_current_action(self, action: TaskProgressAction):
        self.current_action = action

    def get_current_action(self) -> TaskProgressAction:
        return self.current_action

    def update_current_action_status(self, status: TaskProgressStatus):
        self.get_current_action().status = status
        self.update_task_response()

    def start_action_step(self, name: str = None):
        self.add_action_step(TaskProgressActionStep(
            name=name,
            status=TaskProgressStatus.RUNNING,
            started_at=self.current_time(),
        ))
        self.update_task_response()

    def finish_current_action_step(self):
        self.update_current_action_step_status(TaskProgressStatus.FINISHED)
        self.get_current_action_step().finished_at = self.current_time()
        self.get_current_action_step().duration = (
                self.get_current_action_step().finished_at - self.get_current_action_step().started_at
        )
        self.update_task_response()

    def add_action_step(self, step: TaskProgressActionStep):
        if self.task_response is None:
            return
        self.get_current_action().steps.append(step)
        self.set_current_action_step(step)
        self.update_task_response()

    def set_current_action_step(self, step: TaskProgressActionStep):
        self.current_action_step = step

    def get_current_action_step(self) -> TaskProgressActionStep:
        return self.current_action_step

    def update_current_action_step_status(self, status: TaskProgressStatus):
        self.get_current_action_step().status = status
        self.update_task_response()

    def update_task_response(self):
        self.task_response.update_progress(self.progress)
