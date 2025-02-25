from mapping_workbench.backend.config import settings
from mapping_workbench.backend.notification.services.email import send_email


def send_demo_reset_notifications():
    emails = [email.strip() for email in settings.DEMO_EMAILS.split(',')]
    for email in emails:
        send_email(
            subject="MWB Demo Data Reset",
            body="The MWB Demo Data was successfully reset.",
            to_email=email
        )