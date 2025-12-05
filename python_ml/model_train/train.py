import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Paths
DATA_PATH = r"E:\SIH Machine Learning\SIH_ML\data\synthetic_waterborne_disease_dataset.csv"
MODEL_DIR = r"E:\SIH Machine Learning\SIH_ML\trained_model"

# Ensure trained_model folder exists
os.makedirs(MODEL_DIR, exist_ok=True)

# Load dataset
df = pd.read_csv(DATA_PATH)

# Features = all symptom columns (everything except Disease)
X = df.drop("Disease", axis=1).values
y = df["Disease"].values

# Save symptom column order for inference
symptom_columns = df.drop("Disease", axis=1).columns.tolist()
with open(os.path.join(MODEL_DIR, "symptom_columns.pkl"), "wb") as f:
    pickle.dump(symptom_columns, f)

# Encode labels
le = LabelEncoder()
y = le.fit_transform(y)

# Save label encoder
with open(os.path.join(MODEL_DIR, "label_encoder.pkl"), "wb") as f:
    pickle.dump(le, f)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Convert to tensors
X_train = torch.tensor(X_train, dtype=torch.float32)
X_test = torch.tensor(X_test, dtype=torch.float32)
y_train = torch.tensor(y_train, dtype=torch.long)
y_test = torch.tensor(y_test, dtype=torch.long)

# Simple feedforward network
class DiseasePredictor(nn.Module):
    def __init__(self, input_dim, output_dim):
        super(DiseasePredictor, self).__init__()
        self.fc1 = nn.Linear(input_dim, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, output_dim)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        return self.fc3(x)

# Initialize model
input_dim = X_train.shape[1]
output_dim = len(le.classes_)
model = DiseasePredictor(input_dim, output_dim)

# Loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Train
for epoch in range(100):
    optimizer.zero_grad()
    outputs = model(X_train)
    loss = criterion(outputs, y_train)
    loss.backward()
    optimizer.step()
    if (epoch + 1) % 10 == 0:
        print(f"Epoch {epoch+1}/100, Loss: {loss.item():.4f}")

# Save model
torch.save(model.state_dict(), os.path.join(MODEL_DIR, "model.pth"))
print(f"✅ Model trained and saved in {MODEL_DIR}")
