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

def summarize_text(text, level="medium"):
    text = clean_text(text)
    text = truncate_text(text)

    if level == "short":
        max_len = 80
        min_len = 30
        max_new = 60
    elif level == "long":
        max_len = 500
        min_len = 150
        max_new = 300
    else:  # medium
        max_len = 200
        min_len = 50
        max_new = 150

    summary = summarizer(
        text,
        max_length=max_len,
        min_length=min_len,
        max_new_tokens=max_new,
        do_sample=False
    )

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

def fetch_articles_from_rss(url, level="medium"):
    feed = feedparser.parse(url)
    articles = []
    for entry in feed.entries[:5]:
        content = clean_summary(entry.summary)
        summary = summarize_text(content, level=level)
        articles.append({
            "title": entry.title,
            "summary": summary,
            "content": content
        })
    return articles


def text_to_speech(text):
    audio_dir = "audio"
    os.makedirs(audio_dir, exist_ok=True)
    audio_path = os.path.join(audio_dir, "summary_audio.mp3")
    gTTS(text).save(audio_path)
    print(f"Audio généré à : {audio_path}")
    return audio_path

def process_input(choice, text_input, file_path, url_input, rss_input, summary_level="medium"):
    global rag_chain

    print(f"process_input appelé avec choice={choice}")

    articles = None
    content = ""
    summary = ""

    if choice == "text":
        content = text_input

    elif choice in ["pdf", "file"]:
        content = load_pdf(file_path)

    elif choice == "url":
        content = fetch_article_from_url(url_input)

    elif choice == "rss":
        articles = fetch_articles_from_rss(rss_input, level=summary_level)
        print("Articles RSS résumés :", articles)
        content = "\n\n".join([a['content'] for a in articles])
        # Texte pour l'audio : résumés concaténés avec titres
        audio_summary_text = "\n\n".join([f"{a['title']}: {a['summary']}" for a in articles])
        summary = articles  # Le résumé retourné est la liste des articles
    else:
        print("Choice invalide")
        return "", None, None, None

    if choice != "rss":
        summary = summarize_text(content, level=summary_level)
        audio_summary_text = summary

    # Création des chunks pour RAG
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.create_documents([content])

    embeddings = HuggingFaceEmbeddings(
        model_name="BAAI/bge-base-en-v1.5", model_kwargs={"device": "cpu"}
    )
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

    audio = text_to_speech(audio_summary_text)
    print("Audio généré à :", audio)

    return summary, rag_chain, content, audio
