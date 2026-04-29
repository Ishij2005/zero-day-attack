import numpy as np
from sklearn.ensemble import IsolationForest

# ✅ Strong separation between normal and anomaly
X_normal = np.random.normal(0, 1, (200, 31))     # normal traffic
X_anomaly = np.random.normal(10, 1, (20, 31))    # extreme anomaly

X = np.vstack([X_normal, X_anomaly])

model = IsolationForest(contamination=0.1, random_state=42)
model.fit(X)

def detect(data):
    sample = np.array(data).reshape(1, -1)
    prediction = model.predict(sample)
    return "Anomaly" if prediction[0] == -1 else "Normal"


if __name__ == "__main__":
    print("Normal test:", detect([0]*31))

    # 🔥 Make attack VERY extreme
    sample = [10]*31
    print("Attack test:", detect(sample))
    