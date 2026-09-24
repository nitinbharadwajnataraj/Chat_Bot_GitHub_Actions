"""Wrapper around the OpenAI client used to generate chat responses."""

from django.conf import settings
from openai import OpenAI

from . import llm_config

_client = None


def get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return _client


def get_chat_response(message: str) -> str:
    """Send a single user message to OpenAI and return the reply text."""
    client = get_client()

    response = client.chat.completions.create(
        model=llm_config.OPENAI_MODEL,
        temperature=llm_config.TEMPERATURE,
        max_tokens=llm_config.MAX_OUTPUT_TOKENS,
        messages=[
            {"role": "system", "content": llm_config.SYSTEM_PROMPT},
            {"role": "user", "content": message},
        ],
    )

    return response.choices[0].message.content
