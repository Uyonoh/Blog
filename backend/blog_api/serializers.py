from django.conf import settings
from rest_framework import serializers
from .models import Post, Comment, Like, Topic
import markdown

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', "author", 'content', 'created_at']
        read_only_fields = ["author"]
    
    def get_author(self, obj):
        try:
            username = obj.author.username
        except AttributeError:
            username = "Anonymous"
        return  username

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'post', 'user', 'created_at']

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name', 'slug', 'description']

class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    likes = LikeSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    summary = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    liked_by_user = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    topics = TopicSerializer(many=True, read_only=True)
    
    # Writeable field for receiving topic IDs from the frontend
    topic_ids = serializers.PrimaryKeyRelatedField(
        queryset=Topic.objects.all(), # Important: Limit to valid Topic objects
        many=True,
        write_only=True,
        source='topics', # Map to the 'topics' ManyToManyField        
    )
    html_content = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'image', 'content', 'author', 'created_at', 'updated_at', 'comments', 'likes', 'likes_count', 'liked_by_user']
        fields += ['summary', 'slug', 'topics', 'topic_ids', 'html_content']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_image(self, obj):
        if isinstance(obj, Post):
            if settings.OFFLINE:
                return "http://localhost:8000" + obj.image.url
            else:
                return obj.image.url

    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_liked_by_user(self, obj):
        user = self.context['request'].user
        
        if user.is_authenticated:
            return obj.likes.filter(id=user.id).exists()
        return False
    
    def get_summary(self, obj, n=100):
        if len(obj.content) > n:
            return obj.content[:n] + '...'    
        return obj.content
    
    def get_author(self, obj):
        return obj.author.username
    
    def get_html_content(self, obj):
        # Convert Markdown to HTML
        # Using extensions for better rendering:
        # 'fenced_code': for code blocks (```python ... ```)
        # 'nl2br': for converting single newlines to <br> tags (like hitting Enter once)
        # 'extra': for additional features like tables and footnotes
        # , 'codehilite', 'admonition'
        return markdown.markdown(obj.content, extensions=['fenced_code', 'nl2br', 'extra'])
