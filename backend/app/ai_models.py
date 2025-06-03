import torch
from transformers import pipeline
from langchain.llms import CTransformers
from langchain_community.llms import HuggingFacePipeline

hf_auth = "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" 
# Détection automatique du device
device = 0 if torch.cuda.is_available() else -1

# Pipeline de résumé avec BART
summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn",
    device=device
)

llm = CTransformers(
    model='TheBloke/Llama-2-7B-Chat-GGUF',
    model_type='llama',
    model_kwargs={
        'max_new_tokens': 128,
        'temperature': 0.01,
    }
)


