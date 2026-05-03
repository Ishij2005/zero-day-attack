import time
import random
from datetime import datetime
from model import detect
import os

# BUG 5 FIX: Absolute path so script works from any CWD
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(BASE_DIR, "logs.txt")


def generate_traffic_data(is_anomaly=False):
    """BUG 9 FIX: Realistic varied feature vectors instead of binary hardcoded values"""
    if is_anomaly:
        # Attack traffic: high-magnitude varied values
        return [random.uniform(7.0, 13.0) for _ in range(31)]
    else:
        # Normal traffic: near-zero varied values
        return [random.uniform(-1.5, 1.5) for _ in range(31)]


def monitor():
    while True:
        # 70% normal, 30% anomaly
        is_anomaly = random.random() >= 0.7
        traffic_data = generate_traffic_data(is_anomaly)
        result = detect(traffic_data)

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # BUG 7 FIX: Include real timestamp in log so frontend can display it
        if result == "Anomaly":
            log = f"[{timestamp}] 🚨 ALERT: Anomaly detected!"
        else:
            log = f"[{timestamp}] ✅ Traffic is normal"

        print(log)

        with open(LOG_FILE, "a") as f:
            f.write(log + "\n")

        time.sleep(2)


if __name__ == "__main__":
    monitor()