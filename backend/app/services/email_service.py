"""Email notification service using fastapi-mail.

If SMTP credentials are not configured, emails are logged instead of sent so
local development does not fail.
"""
import logging

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from app.config import settings

logger = logging.getLogger("wallmark.email")


def _is_configured() -> bool:
    return bool(settings.MAIL_USERNAME and settings.MAIL_PASSWORD)


def _get_config() -> ConnectionConfig:
    return ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,
        MAIL_FROM=settings.MAIL_FROM,
        MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_STARTTLS=settings.MAIL_STARTTLS,
        MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True,
    )


async def send_enquiry_notification(enquiry: dict) -> None:
    """Send a notification email to the business when a new enquiry arrives."""
    subject = f"New {enquiry.get('enquiry_type', 'contact')} enquiry — Wallmark Realtors"
    body = _render_enquiry_html(enquiry)

    if not _is_configured():
        logger.info("[EMAIL DISABLED] Would send to %s:\n%s", settings.MAIL_TO, body)
        return

    message = MessageSchema(
        subject=subject,
        recipients=[settings.MAIL_TO],
        body=body,
        subtype=MessageType.html,
    )
    try:
        await FastMail(_get_config()).send_message(message)
    except Exception as exc:  # pragma: no cover
        logger.error("Failed to send enquiry email: %s", exc)


def _render_enquiry_html(e: dict) -> str:
    rows = "".join(
        f"<tr><td style='padding:6px 12px;font-weight:600;color:#0B1E3F'>{k.title()}</td>"
        f"<td style='padding:6px 12px;color:#333'>{v}</td></tr>"
        for k, v in e.items()
        if v
    )
    return f"""
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto">
      <div style="background:#0B1E3F;padding:24px;text-align:center">
        <h1 style="color:#C8A96A;margin:0;font-size:22px;letter-spacing:1px">WALLMARK REALTORS</h1>
        <p style="color:#fff;margin:4px 0 0;font-size:13px">New Website Enquiry</p>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#f7f7f7">{rows}</table>
      <p style="text-align:center;color:#999;font-size:12px;padding:16px">
        This message was sent from the Wallmark Realtors website.
      </p>
    </div>
    """
