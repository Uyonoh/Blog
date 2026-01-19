from django.contrib.postgres.search import SearchQuery, SearchRank
from django.db.models import F
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Post, Comment, Like, Topic
from .serializers import PostSerializer, CommentSerializer, LikeSerializer, TopicSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny


# Paginators
class PostPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = "size"
    max_page_size = 30

    def get_paginated_response(self, data):
        return Response({
            "count": self.page.paginator.count,
            "page": self.page.number,
            "page_size": self.page.paginator.per_page,
            "total_pages": self.page.paginator.num_pages,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "results": data,
        })


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = PostPagination
    lookup_field = "slug"

    def get_queryset(self):
        # return super().get_queryset()
        queryset = Post.objects.all()
        query = self.request.query_params.get("q")

        if not query:
            return queryset
        
        # Hard safety limits
        query = query.strip()
        if len(query) > 100:
            return Post.objects.none()

        search_query = SearchQuery(query)
        results =  (
            queryset.annotate(
                rank=SearchRank(F("search_vector"), search_query)
            )
            .filter(rank__gte=0.2)
            .order_by("-rank", "-updated_at")
        )

        return results


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

    
    @action(detail=True, methods=['get', 'post'], permission_classes=[AllowAny])
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