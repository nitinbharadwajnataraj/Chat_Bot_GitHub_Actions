import json
from unittest.mock import patch

from django.test import TestCase
from openai import OpenAIError


class ChatViewTests(TestCase):
    url = "/api/chat/"

    def post_json(self, payload):
        return self.client.post(
            self.url, data=json.dumps(payload), content_type="application/json"
        )

    @patch("chatbot.views.services.get_chat_response", return_value="mocked reply")
    def test_valid_message_returns_reply(self, mock_get_chat_response):
        response = self.post_json({"message": "Hello"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"reply": "mocked reply"})
        mock_get_chat_response.assert_called_once_with("Hello")

    @patch("chatbot.views.services.get_chat_response")
    def test_blank_message_returns_400_without_calling_openai(self, mock_get_chat_response):
        response = self.post_json({"message": "   "})

        self.assertEqual(response.status_code, 400)
        mock_get_chat_response.assert_not_called()

    @patch("chatbot.views.services.get_chat_response")
    def test_missing_message_key_returns_400(self, mock_get_chat_response):
        response = self.post_json({})

        self.assertEqual(response.status_code, 400)
        mock_get_chat_response.assert_not_called()

    @patch("chatbot.views.services.get_chat_response", side_effect=OpenAIError("boom"))
    def test_openai_error_returns_502(self, mock_get_chat_response):
        response = self.post_json({"message": "Hello"})

        self.assertEqual(response.status_code, 502)
        self.assertIn("detail", response.json())
