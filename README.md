# RESUM
# Article Summarizer with Multiple Sources

This project is a Python tool that summarizes articles from multiple sources, including plain text, PDF files, URLs, and RSS feeds. It also allows users to ask questions about the article content.

## Features

- **Text Summarization:** Summarizes articles or documents.
- **PDF Support:** Extracts and summarizes content from PDF files.
- **URL Support:** Extracts and summarizes articles from URLs using the `newspaper3k` library.
- **RSS Feed Support:** Collects and summarizes articles from an RSS feed.
- **Q&A Feature:** Allows users to ask questions based on the article content.
- **Clean Text Functionality:** Cleans HTML and non-ASCII characters from text before summarizing.
- **Gradio Interface (optional):** A simple web interface to interact with the summarizer.

## Installation

To use this tool, you'll need to install the necessary Python packages. You can install them using `pip`:

```bash
pip install transformers langchain newspaper3k feedparser beautifulsoup4 gradio
!pip install -q -U langchain transformers bitsandbytes accelerate pypdf feedparser beautifulsoup4 gradio newspaper3k lxml_html_clean
!pip install langchain-community langchain-core
pip install faiss-cpu
