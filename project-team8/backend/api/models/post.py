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


class CommonComment(models.Model):
    profile_id = models.ForeignKey('Profile', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    edit_date = models.DateTimeField(blank=True)
    content = models.TextField()
    likes = models.IntegerField(default=0)
    hash_tags = models.TextField(blank=True)

    class Meta:
        abstract = True

class Comment(CommonComment):
    parent_model_id = models.IntegerField()
    parent_model_type = models.CharField(max_length=120)
    parent_comment_id = models.IntegerField(blank=True)  # this is used for if this comment is a reply

class Post(CommonComment):
    #something about images
    allow_comments = models.BooleanField(default=True)

class LikesRel(models.Model):
    profile_id = models.ForeignKey('Profile', on_delete=CASCADE, related_name='mtm')
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE, blank=True, related_name='mtm')
    comment_id = models.ForeignKey(Comment, on_delete=models.CASCADE, blank=True, related_name='mtm')