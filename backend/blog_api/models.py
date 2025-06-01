from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

# anon = User.objects.filter(username="Anonymous")[0]

class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True, null=True)
    image = models.ImageField(upload_to="posts/")
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # likes = models.ManyToManyField('Like', related_name='liked_posts', blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title) + str(self.id)
        super().save(*args, **kwargs)

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
