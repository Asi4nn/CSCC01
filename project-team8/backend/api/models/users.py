from django.db.models.deletion import CASCADE
from django.db.models.fields import BooleanField
from django.core.validators import RegexValidator
from django.dispatch import receiver
from django.db.models.signals import post_save
from djongo import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.db.models import signals
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.crypto import get_random_string


class CustomUserManager(BaseUserManager):

    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password):
        return self.create_user(email, password, username=email, is_staff=True, is_superuser=True)


class User(AbstractUser):
    class UserType(models.TextChoices):
        entrepreneur = "ENTRE", _("Entrepreneur")
        investor = "INVES", _("Investor")
        instructor = "INSTR", _("Instructor")

    email = models.EmailField(verbose_name="email", max_length=60, unique=True)
    company_name = models.CharField(max_length=30)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    user_type = models.CharField(
        max_length=5,
        choices=UserType.choices
    )

    # whatever you want to use to log in set it to this field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
