from flask import Flask, jsonify, send_file

app = Flask(__name__)

@app.route("/")
def home():
    return send_file("index.html")   # ✅ THIS IS THE KEY FIX

@app.route("/logs")
def get_logs():
    try:
        with open("logs.txt", "r") as f:
            logs = f.readlines()
        return jsonify(logs)
    except:
        return jsonify(["No logs found"])

if __name__ == "__main__":
    app.run(debug=True)
    

