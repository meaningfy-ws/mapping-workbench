from mapping_workbench.backend.config import settings
from mapping_workbench.backend.tracking.models.tracking import TrackedUser, ActivityType, ActivityMedata, \
    TrackedActivity
from mapping_workbench.backend.user.models.user import User


async def track_user(user: User):
    if settings.is_demo_env():
        user = TrackedUser(
            user_id=user.id,
            name=user.name,
            email=user.email,
            created_at=user.created_at
        )
        await user.save()


async def track_activity(activity: ActivityType, user: User, metadata: ActivityMedata):
    if settings.is_demo_env():
        activity = TrackedActivity(
            activity=activity,
            user=TrackedUser.link_from_id(user.id) if user else None,
            metadata=metadata
        )
        await activity.save()
