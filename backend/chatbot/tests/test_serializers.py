from django.test import SimpleTestCase

from chatbot.serializers import ChatRequestSerializer


class ChatRequestSerializerTests(SimpleTestCase):
    def test_accepts_a_valid_message(self):
        serializer = ChatRequestSerializer(data={"message": "Hello there"})

        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["message"], "Hello there")

    def test_rejects_blank_message(self):
        serializer = ChatRequestSerializer(data={"message": ""})

        self.assertFalse(serializer.is_valid())
        self.assertIn("message", serializer.errors)

    def test_rejects_whitespace_only_message(self):
        serializer = ChatRequestSerializer(data={"message": "   "})

        self.assertFalse(serializer.is_valid())
        self.assertIn("message", serializer.errors)

    def test_rejects_missing_message_key(self):
        serializer = ChatRequestSerializer(data={})

        self.assertFalse(serializer.is_valid())
        self.assertIn("message", serializer.errors)
