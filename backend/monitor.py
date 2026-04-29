import time
import random
from model import detect

def generate_traffic_data(is_anomaly=False):
    # Normal = all zeros, Attack = high values
    return [10]*31 if is_anomaly else [0]*31

def monitor():
    while True:
        # 70% normal, 30% anomaly
        if random.random() < 0.7:
            traffic_data = generate_traffic_data(False)
        else:
            traffic_data = generate_traffic_data(True)

        result = detect(traffic_data)

        # Prepare log message
        if result == "Anomaly":
            log = "🚨 ALERT: Anomaly detected!"
        else:
            log = "✅ Traffic is normal"

        # Print to terminal
        print(log)

        # Save to file
        with open("logs.txt", "a") as f:
            f.write(log + "\n")

        time.sleep(2)

if __name__ == "__main__":
    monitor()
    
    