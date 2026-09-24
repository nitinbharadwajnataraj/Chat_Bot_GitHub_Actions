from openai import OpenAIError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from . import services
from .serializers import ChatRequestSerializer, ChatResponseSerializer


@api_view(["POST"])
def chat_view(request):
    request_serializer = ChatRequestSerializer(data=request.data)
    request_serializer.is_valid(raise_exception=True)

    try:
        reply = services.get_chat_response(request_serializer.validated_data["message"])
    except OpenAIError:
        return Response(
            {"detail": "Failed to get a response from the AI service."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    response_serializer = ChatResponseSerializer({"reply": reply})
    return Response(response_serializer.data)
