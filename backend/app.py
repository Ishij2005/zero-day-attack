from flask import Flask, jsonify, send_file, request
from flask_cors import CORS
from datetime import datetime, timedelta
import re
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# BUG 5 FIX: Use absolute path so Flask works from any CWD
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(BASE_DIR, "logs.txt")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:5173", "http://127.0.0.1:5173",
    "http://localhost:5174", "http://127.0.0.1:5174",
    "http://localhost:3000", "http://127.0.0.1:3000",
    "http://127.0.0.1:8000", "http://localhost:8000"
]}})


def read_logs():
    """Helper to read logs from file"""
    # BUG 10 FIX: Specific exception instead of bare except
    try:
        with open(LOG_FILE, "r") as f:
            return f.readlines()
    except (OSError, IOError) as e:
        logger.error(f"Failed to read logs: {e}")
        return []


@app.route("/")
def home():
    return send_file(os.path.join(BASE_DIR, "index.html"))


@app.route("/logs")
def get_logs():
    logs = read_logs()
    return jsonify(logs)


@app.route("/api/logs", methods=["GET"])
def api_logs():
    """Paginated logs endpoint with filtering"""
    logs = read_logs()
    limit = request.args.get("limit", 100, type=int)
    # BUG 2 is on frontend side; backend correctly uses 'offset'
    offset = request.args.get("offset", 0, type=int)
    filter_type = request.args.get("filter", "all")

    # BUG 11 FIX: More robust filtering
    if filter_type == "anomaly":
        filtered = [log for log in logs if "ALERT" in log and log.strip()]
    elif filter_type == "normal":
        filtered = [log for log in logs if "ALERT" not in log and log.strip()]
    else:
        filtered = [log for log in logs if log.strip()]

    # Reverse to show newest first
    filtered = list(reversed(filtered))

    total = len(filtered)
    paginated = filtered[offset:offset + limit]

    return jsonify({
        "logs": paginated,
        "total": total,
        "offset": offset,
        "limit": limit,
        "has_more": offset + limit < total
    })


@app.route("/api/stats", methods=["GET"])
def api_stats():
    """Statistics endpoint"""
    logs = read_logs()
    non_empty = [l for l in logs if l.strip()]
    total_logs = len(non_empty)
    anomalies = sum(1 for log in non_empty if "ALERT" in log)
    normal = total_logs - anomalies
    detection_rate = (anomalies / total_logs * 100) if total_logs > 0 else 0

    if detection_rate > 50:
        threat_level = "CRITICAL"
    elif detection_rate > 30:
        threat_level = "HIGH"
    elif detection_rate > 10:
        threat_level = "MEDIUM"
    else:
        threat_level = "LOW"

    return jsonify({
        "total_logs": total_logs,
        "anomalies": anomalies,
        "normal": normal,
        "detection_rate": round(detection_rate, 2),
        "threat_level": threat_level,
        "timestamp": datetime.now().isoformat()
    })


@app.route("/api/trends", methods=["GET"])
def api_trends():
    """Attack trends endpoint — real timestamp-based bucketing for accurate dynamic charts"""
    logs = read_logs()
    window = request.args.get("window", "1h")

    # (bucket_count, total_seconds, seconds_per_bucket)
    WINDOW_CONFIG = {
        "1h": (60, 3600,   60),
        "1d": (24, 86400,  3600),
        "1w": (7,  604800, 86400),
    }
    points, total_seconds, bucket_size = WINDOW_CONFIG.get(window, WINDOW_CONFIG["1h"])

    now = datetime.now()
    window_start = now - timedelta(seconds=total_seconds)

    buckets = [0] * points
    TS_PATTERN = re.compile(r"^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]")

    total_anomalies = 0
    timestamped_in_window = 0

    for log in logs:
        if "ALERT" not in log:
            continue
        total_anomalies += 1
        m = TS_PATTERN.match(log.strip())
        if not m:
            continue
        try:
            ts = datetime.strptime(m.group(1), "%Y-%m-%d %H:%M:%S")
            if ts >= window_start:
                elapsed = (ts - window_start).total_seconds()
                bucket_idx = min(int(elapsed // bucket_size), points - 1)
                buckets[bucket_idx] += 1
                timestamped_in_window += 1
        except ValueError:
            pass

    # Build labeled buckets
    trends = []
    for i in range(points):
        bucket_time = window_start + timedelta(seconds=i * bucket_size)
        if window == "1h":
            label = bucket_time.strftime("%H:%M")
        elif window == "1d":
            label = bucket_time.strftime("%H:00")
        else:
            label = bucket_time.strftime("%a")
        trends.append({"label": label, "anomalies": buckets[i], "timestamp": i})

    return jsonify({
        "window": window,
        "total_anomalies": total_anomalies,
        "in_window": timestamped_in_window,
        "trends": trends
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
