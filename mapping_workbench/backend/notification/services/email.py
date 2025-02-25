import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from mapping_workbench.backend.config import settings


def send_email(subject, body, to_email, from_email = None, smtp_server = None, smtp_port = None, login = None, password = None):
    smtp_server = smtp_server or settings.EMAIL_SMTP_SERVER
    smtp_port = smtp_port or settings.EMAIL_SMTP_PORT
    login = login or settings.EMAIL_LOGIN
    password = password or settings.EMAIL_PASSWORD
    from_email = from_email or settings.EMAIL_FROM

    # Create the email message
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

    # Attach the email body
    msg.attach(MIMEText(body, 'plain'))

    # Connect to the SMTP server and send the email
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(login, password)
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()
        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")
