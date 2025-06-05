from app.ai_models import llm

query = "Quelle est la capitale de la France ?"
response = llm(query)
print("Réponse du modèle :", response)