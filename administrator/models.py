# Standard library
import string
import random
from datetime import datetime, timedelta

# Django
from django.db import models
from django.utils import timezone


class VerificationOtp(models.Model):
    OTPLENGTH = 6
    MAXATTEMPT = 5

    # Db fields
    email = models.EmailField(unique=True, primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    otp = models.CharField(max_length=OTPLENGTH)
    expires_on = models.DateTimeField()
    attemptleft = models.PositiveSmallIntegerField(default=MAXATTEMPT)
    blocked_till = models.DateTimeField(blank=True, null=True)

    def update(self):
        """ 
            Updates the all variables of the database fields except the unique ones
        """
        self.otp = self.randotp()
        self.expires_on = self.calculateExpire()
        self.updatelastfields()

    def updatelastfields(self):
        """ 
            Updates the only the following variables named as 'attemptleft',
            and 'blocked_till' if only attemptleft changes to 0
        """
        if (attempt := self.attemptleft) > 0:
            self.attemptleft -= 1
            if attempt == 1:
                self.blocked_till = self.calculateExpire(1440)  # for 24 hrs
        else:
            self.attemptleft = self.MAXATTEMPT
            self.blocked_till = None
        self.save()

    def isblocked(self):
        """ Checks the email is blocked or not by the 'blocked_till' field

            Return:
                None|str: a literal['noremains', '00hour 00minute 00sec'], 00 - is replaced by the remaining time
        """
        return self.timeRemains(self.blocked_till)

    def isexpired(self):
        """ Checks the otp is expirated or not by time value of 'expires_on' field

            Return:
                None|str: a literal['noremains', '00hour 00minute 00sec'], 00 - is replaced by the remaining time
        """
        return self.timeRemains(self.expires_on)

    def reset(self):
        """
            Reset all the (non-unique) db fields of VerificationOtp model
        """
        self.otp = ""
        self.expires_on = self.calculateExpire(0)
        self.attemptleft = self.MAXATTEMPT
        self.blocked_till = None
        self.save()

    @classmethod
    def randotp(cls):
        """
            Generate a 6-digit random otp with numbers

            Return:
                str: 6-digit random number
        """
        otp = ""
        for _ in range(cls.OTPLENGTH):
            otp += random.choice(string.digits)
        return otp

    @classmethod
    def timeRemains(cls, obj):
        """
            Calculates the time remaining in between the 'obj' expiration time,
            and also checks the time passed or not

            Parameters:
                obj (datetime): any Datetime field of current instance

            Return:
                None|str: a literal['noremains', '00hour 00minute 00sec'], 00 - is replaced by the remaining time
        """
        if obj:
            diff = (obj - datetime.now(tz=timezone.utc)).total_seconds()
            if diff > 0:
                hr, remains = divmod(diff, 3600)
                minute, seconds = divmod(remains, 60)
                return cls.formatTime(nums=(hr, minute, seconds))
            return "noremains"

    @staticmethod
    def calculateExpire(mins=30):
        """ 
            Calculates the expiration datetime from the current datetime,
            and life in terms of minutes

            Parameters:
                mins (int): time duration in terms of minutes

            Returns:
                datetime: expiration time
        """
        now = datetime.now(tz=timezone.utc)
        return now + timedelta(minutes=mins)

    @staticmethod
    def formatTime(nums: tuple):
        """
            Format separate time values to a single string of time with its name

            Parameters:
                nums (tuple): contains the hours, minute and seconds in order

            Return:
                str: nice formatted string of time with HH hour(s) MM minute(s) SS second(s)
            ---
            Usage:
                self.formatTime(nums=(
                    hour: int|float, 
                    minute: int|float, 
                    second: int|float)
                )
        """

        NAMES = ("hour", "minute", "second")
        time = ""
        for i, n in enumerate(nums):
            time += f"{n:.0f} {NAMES[i]}"
            if int(n) > 1:
                time += "s "

        return time
