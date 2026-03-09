from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.postgres.search import SearchVectorField
from django.utils.text import slugify
from cloudinary.models import CloudinaryField

# anon = User.objects.filter(username="Anonymous")[0]

class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True, null=True)
    if settings.OFFLINE:
        image = models.ImageField(upload_to="posts/")
    else:
        image = CloudinaryField("image", folder="Posts")
    content = models.TextField()
    excerpt = models.CharField(max_length=300, null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    topics = models.ManyToManyField('Topic', related_name="blog_posts", blank=True)
    
    search_vector = SearchVectorField(null=True, editable=False)

    def check_slug(self):
        i = 1
        base_slug = self.slug
        # Exclude 'self' from the check so it doesn't collide with its own existing slug
        queryset = Post.objects.filter(slug=self.slug)
        if self.pk:
            queryset = queryset.exclude(pk=self.pk)

        while queryset.exists():
            self.slug = f"{base_slug}_{i}"
            queryset = Post.objects.filter(slug=self.slug)
            if self.pk:
                queryset = queryset.exclude(pk=self.pk)
            i += 1

    def make_slug(self):
        # Auto add slug
        if not self.slug:
            self.slug = slugify(self.title)
        else:
            self.slug = slugify(self.slug)
        
        self.check_slug()

    def save(self, *args, **kwargs):
        self.make_slug()
        super().save(*args, **kwargs)
        
        # TODO: Auto add excerpt using AI if None

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ["-updated_at"]
        indexes = [
            models.Index(fields=["-updated_at"]),
        ]


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="comments", null=True, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author} on {self.post.title}"
    
    class Meta:
        ordering = ["-created_at"]


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")  # Fix conflict
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="likes", null=True)
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
        else:
            self.slug = slugify(self.slug)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name