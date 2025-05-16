# app/utils.py

import re
import os
from bs4 import BeautifulSoup
from newspaper import Article
import feedparser
from langchain_community.document_loaders import PyPDFLoader
from gtts import gTTS

from app.ai_models import summarizer, llm
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS

rag_chain = None  # Global to reuse

def truncate_text(text, max_tokens=1024):
    tokens = text.split()
    return " ".join(tokens[:max_tokens])

def clean_text(text):
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    return text.strip()

def clean_summary(summary):
    soup = BeautifulSoup(summary, "html.parser")
    return soup.get_text()

def summarize_text(text):
    text = clean_text(text)
    text = truncate_text(text)
    summary = summarizer(text, max_length=200, min_length=50, max_new_tokens=150, do_sample=False)
    return summary[0]["summary_text"]

def load_pdf(file_path):
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    return " ".join([doc.page_content for doc in documents])

def fetch_article_from_url(url):
    article = Article(url)
    article.download()
    article.parse()
    return article.text

def fetch_articles_from_rss(url):
    feed = feedparser.parse(url)
    return [clean_summary(entry.summary) for entry in feed.entries]

def text_to_speech(text):
    audio_dir = "audio"
    os.makedirs(audio_dir, exist_ok=True)
    audio_path = os.path.join(audio_dir, "summary_audio.mp3")
    gTTS(text).save(audio_path)
    print(f"Audio généré à : {audio_path}")
    return audio_path

def process_input(choice, text_input, file_path, url_input, rss_input):
    global rag_chain

    print(f"process_input appelé avec choice={choice}")

    if choice == "text":
        content = text_input
    elif choice == "pdf":
        content = load_pdf(file_path)
    elif choice == "url":
        content = fetch_article_from_url(url_input)
    elif choice == "rss":
        summaries = fetch_articles_from_rss(rss_input)
        content = "\n\n".join(summaries)
    else:
        print("Choice invalide")
        return "", None, None, None

    summary = summarize_text(content)
    print("Résumé généré :", summary)

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.create_documents([content])

    embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-base-en-v1.5", model_kwargs={"device": "cpu"})  # J'ai mis cpu ici pour éviter problème CUDA
    vectorstore = FAISS.from_documents(chunks, embeddings)

    prompt_template = PromptTemplate(
        template="""You are an AI assistant that only answers using the following context.\nIf you cannot find the answer in the context, just say: "I don't know".\n\nContext:\n{context}\n\nQuestion: {question}\nAnswer:""",
        input_variables=["context", "question"]
    )

    rag_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=vectorstore.as_retriever(search_kwargs={"k": 2}),
        chain_type="stuff",
        chain_type_kwargs={"prompt": prompt_template},
        return_source_documents=True
    )

    audio = text_to_speech(summary)
    print("Audio généré à :", audio)

    return summary, rag_chain, content, audio