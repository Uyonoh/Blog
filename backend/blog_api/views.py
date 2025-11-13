from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post, Comment, Like, Topic
from .serializers import PostSerializer, CommentSerializer, LikeSerializer, TopicSerializer
from rest_framework.permissions import IsAuthenticated


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = "slug"


    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, slug=None):
        post = self.get_object()
        user = request.user

        like = Like.objects.filter(post=post, user=user)
        if like.exists():
            like.delete()  # Remove the existing 
            return Response({'detail': 'You have unliked successfully.'}, status=status.HTTP_200_OK)

        like = Like.objects.create(post=post, user=user)
        post.likes.add(like)  # Adds the new like to the ManyToMany relationship
        return Response({'detail': 'Post liked successfully.'}, status=status.HTTP_200_OK)

    
    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, slug=None):
        post = self.get_object()
        
        if request.method == 'GET':
            comments = post.comments.all()  # Fetch comments for this post
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        if request.method == 'POST':
            author = request.user
            if not request.user.id:
                author = None
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(post=post, author=author)  # Assign comment to the specific post
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)
    
    # TODO: Protext with cutom admin group
    def perform_create(self, serializer):
        image = self.request.FILES.get("image")
        serializer.save(author=self.request.user, image=image)

    

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        author = self.request.user
        serializer.save(author=author)

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer