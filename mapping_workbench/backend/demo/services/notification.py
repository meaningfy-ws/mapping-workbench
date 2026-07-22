# from datetime import datetime, timedelta
#
# from mapping_workbench.backend.config import settings
# from mapping_workbench.backend.notification.services.email import send_email
# from mapping_workbench.backend.tracking.services.tracking import get_tracked_users, get_tracked_activities
#
#
# def send_demo_reset_notifications():
#     if not settings.DEMO_EMAILS:
#         return
#
#     one_week_ago = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
#
#     body = "The MWB Demo Data was successfully reset."
#     body += "\n\n"
#     body += "Data from Last Week"
#     body += "\n\n"
#     body += "USERS:"
#     body += "\n"
#     body += get_tracked_users(start_date=one_week_ago)
#     body += "\n\n"
#     body += "ACTIVITIES:"
#     body += "\n"
#     body += get_tracked_activities(start_date=one_week_ago)
#     body += "\n"
#
#     emails = [email.strip() for email in settings.DEMO_EMAILS.split(',')]
#     for email in emails:
#         send_email(
#             subject="MWB Demo Data Reset",
#             body=body,
#             to_email=email
#         )