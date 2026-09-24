from unittest.mock import MagicMock, patch

from django.test import SimpleTestCase

from chatbot import llm_config, services


class GetChatResponseTests(SimpleTestCase):
    def _mock_client(self, reply_text):
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = MagicMock(
            choices=[MagicMock(message=MagicMock(content=reply_text))]
        )
        return mock_client

    @patch("chatbot.services.get_client")
    def test_returns_the_model_reply_text(self, mock_get_client):
        mock_get_client.return_value = self._mock_client("mocked reply")

        result = services.get_chat_response("Hello")

        self.assertEqual(result, "mocked reply")

    @patch("chatbot.services.get_client")
    def test_sends_configured_model_and_system_prompt(self, mock_get_client):
        mock_client = self._mock_client("mocked reply")
        mock_get_client.return_value = mock_client

        services.get_chat_response("What's the weather?")

        _, kwargs = mock_client.chat.completions.create.call_args
        self.assertEqual(kwargs["model"], llm_config.OPENAI_MODEL)
        self.assertEqual(
            kwargs["messages"],
            [
                {"role": "system", "content": llm_config.SYSTEM_PROMPT},
                {"role": "user", "content": "What's the weather?"},
            ],
        )

    @patch("chatbot.services.OpenAI")
    def test_get_client_is_memoized(self, mock_openai_cls):
        services._client = None
        try:
            first = services.get_client()
            second = services.get_client()
        finally:
            services._client = None

        self.assertIs(first, second)
        mock_openai_cls.assert_called_once()
