from django_cron import CronJobBase, Schedule
from django.utils import timezone
from .models import User

class ResetExpiredCodesJob(CronJobBase):
    schedule = Schedule(run_every_mins=15)
    code = 'api.reset_expired_codes_job'

    def do(self):
        User.objects.filter(
            otp_email_expiry_time__lt=timezone.now(),
            otp_email__isnull=False
        ).update(otp_email='', otp_email_expiry_time=None)

        User.objects.filter(
            otp_2fa_expiry_time__lt=timezone.now(),
            otp_2fa__isnull=False
        ).update(otp_2fa='', otp_2fa_expiry_time=None)