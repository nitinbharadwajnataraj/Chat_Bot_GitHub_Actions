from rest_framework import serializers


class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(allow_blank=False, trim_whitespace=True)


class ChatResponseSerializer(serializers.Serializer):
    reply = serializers.CharField()
