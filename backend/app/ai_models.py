# app/ai_models.py

import torch
import transformers
from transformers import pipeline
from langchain.llms import HuggingFacePipeline

# Résumé
summarizer = pipeline("summarization", model="facebook/bart-large-cnn", device=-1)

# Chatbot
model_id = "distilgpt2"
hf_auth = "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"  # à remplacer

device = "cuda" if torch.cuda.is_available() else "cpu"



model = transformers.AutoModelForCausalLM.from_pretrained(
    model_id,
    trust_remote_code=True,
    device_map="auto",
    token=hf_auth
)

tokenizer = transformers.AutoTokenizer.from_pretrained(model_id, token=hf_auth)

stop_list = ["\nHuman:", "\n```\n"]
stop_token_ids = [torch.LongTensor(tokenizer(x)["input_ids"]).to(device) for x in stop_list]

class StopOnTokens(transformers.StoppingCriteria):
    def __call__(self, input_ids, scores, **kwargs):
        for stop_ids in stop_token_ids:
            if torch.eq(input_ids[0][-len(stop_ids):], stop_ids).all():
                return True
        return False

stopping_criteria = transformers.StoppingCriteriaList([StopOnTokens()])

generate_text = transformers.pipeline(
    model=model,
    tokenizer=tokenizer,
    return_full_text=False,
    task="text-generation",
    stopping_criteria=stopping_criteria,
    max_new_tokens=300,
    repetition_penalty=1.1
)

llm = HuggingFacePipeline(pipeline=generate_text)
