#predict.py
import torch
from SIH_ML.model_train.model import DiseaseModel

# Load checkpoint
checkpoint = torch.load("disease_model.pt", map_location="cpu")

# Rebuild model
input_dim = len(checkpoint["mlb_classes"])
num_classes = len(checkpoint["label_classes"])
model = DiseaseModel(input_dim, hidden=128, num_classes=num_classes)
model.load_state_dict(checkpoint["model_state_dict"])
model.eval()

mlb_classes = checkpoint["mlb_classes"]
label_classes = checkpoint["label_classes"]

# Example input
symptoms = ["fever", "vomiting", "jaundice"]

# Convert to one-hot
x_vec = [1 if s.lower() in [sym.lower() for sym in symptoms] else 0 for s in mlb_classes]
x_tensor = torch.tensor([x_vec], dtype=torch.float32)

with torch.no_grad():
    outputs = model(x_tensor)
    probs = torch.softmax(outputs, dim=1).numpy()[0]
    pred_class = torch.argmax(outputs, dim=1).item()

print("Predicted Disease:", label_classes[pred_class])
print("\nConfidence Scores:")
for i, disease in enumerate(label_classes):
    print(f"{disease}: {probs[i]*100:.2f}%")
