from django.core.validators import RegexValidator
from django.dispatch import receiver
from djongo import models
from django.db.models import signals
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.crypto import get_random_string
from .users import * 
from .post import *

def get_random_string_func():
    return get_random_string(length=32)

class Profile(models.Model):
    owner = models.OneToOneField(
        User,
        related_name="profile",
        on_delete=models.CASCADE
    )
    description = models.CharField(max_length=200, blank=True)
    socials_link = models.CharField(
        validators=[
            RegexValidator(
                regex='^[a-zA-Z0-9]*$',
                message='Social link must be Alphanumeric',
                code='invalid_username'
            ),
        ],
        max_length=32,
        unique=True,
        default=get_random_string_func
    )
    network = models.ManyToManyField('self')
    username = models.CharField(max_length=200, blank=True)
    comments = models.ManyToManyField(Comment, related_name="comments")
    posts = models.ManyToManyField(Post, related_name="posts")
    likes = models.ManyToManyField(LikesRel, related_name='likes')

    def __str__(self):
        return self.description


## auto create a profile
@receiver(post_save, sender=User, dispatch_uid="model.create_model_profile")
def create_model_profile(sender, instance, created, **kwargs):
    """Create Profile for every new User."""
    if created:
        Profile.objects.create(owner=instance)