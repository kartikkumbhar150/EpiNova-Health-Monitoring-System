import torch
import torch.nn as nn
import torch.nn.functional as F

class DiseaseClassifier(nn.Module):
    def __init__(self, input_dim, hidden=128, num_classes=16):
        super(DiseaseClassifier, self).__init__()
        self.fc1 = nn.Linear(input_dim, hidden)
        self.fc2 = nn.Linear(hidden, num_classes)

    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = self.fc2(x)   # logits
        return x
