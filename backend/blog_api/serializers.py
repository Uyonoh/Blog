from rest_framework import serializers
from .models import Post, Comment, Like

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'post', 'user', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    likes = LikeSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    summary = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    liked_by_user = serializers.SerializerMethodField()
    

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'created_at', 'updated_at', 'comments', 'likes', 'likes_count', 'liked_by_user']
        fields += ['summary']

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

