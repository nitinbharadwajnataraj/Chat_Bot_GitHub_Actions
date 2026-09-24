"""Configuration for the LLM used by the chatbot.

Keeping this separate from settings.py makes it easy to change the model
(or other generation parameters) without touching Django settings or code
that calls the OpenAI API.
"""

import os

# The OpenAI model used to generate chat responses.
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

# Generation parameters.
TEMPERATURE = float(os.environ.get("OPENAI_TEMPERATURE", "0.7"))
MAX_OUTPUT_TOKENS = int(os.environ.get("OPENAI_MAX_OUTPUT_TOKENS", "500"))

# System prompt sent with every conversation.
SYSTEM_PROMPT = os.environ.get(
    "OPENAI_SYSTEM_PROMPT",
    "You are a helpful assistant. Answer the user's questions clearly and concisely.",
)
