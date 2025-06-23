from rest_framework import serializers
from .models import Post, Comment, Like, Topic, CloudinaryField

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

    class Meta:
        model = Post
        fields = ['id', 'title', 'image', 'content', 'author', 'created_at', 'updated_at', 'comments', 'likes', 'likes_count', 'liked_by_user']
        fields += ['summary', 'slug', 'topics', 'topic_ids']

    def get_image(self, obj):
        if isinstance(obj, Post):
            return obj.image.url

    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_liked_by_user(self, obj):
        user = self.context['request'].user
        
        if user.is_authenticated:
            return obj.likes.filter(id=user.id).exists()
        return False
    
    def get_summary(self, obj):
        if len(obj.content) > 35:
            return obj.content[:32] + '...'    
        return obj.content
    
    def get_author(self, obj):
        return obj.author.username
    
    # def get_topics(self, obj):
    #     return obj.topics.all()

