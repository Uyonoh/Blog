from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.text import slugify
from cloudinary.models import CloudinaryField

# anon = User.objects.filter(username="Anonymous")[0]

class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=100, unique=True, blank=True, null=True)
    if settings.OFFLINE:
        image = models.ImageField(upload_to="posts/")
    else:
        image = CloudinaryField("image", folder="Posts")
    content = models.TextField()
    excerpt = models.CharField(max_length=150, null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE) # set to Default, anon
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    topics = models.ManyToManyField('Topic', related_name="blog_posts", blank=True)
    # tags = models.JSONField
    # likes = models.ManyToManyField('Like', related_name='liked_posts', blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # Auto add slug
        if not self.slug:
            self.slug = slugify(self.title)

            # Check if slug already exists
            i = 1
            slug = self.slug
            while Post.objects.filter(slug=slug).count() > 0:
                slug = f"{self.slug}_{i}"
                i += 1
            self.slug = slug
            self.save()
        
        # TODO: Auto add excerpt using AI if None

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ["-updated_at"]


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments", null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author} on {self.post.title}"
    
    class Meta:
        ordering = ["-created_at"]


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")  # Fix conflict
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} liked {self.post.title}'

    class Meta:
        unique_together = ('user', 'post')


class Topic(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name