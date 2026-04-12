import hashlib
import hmac
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request

app = Flask(__name__)

load_dotenv()

ZOOM_SECRET = os.getenv("ZOOM_TRAIN_SECRET_TOKEN")


@app.route("/webhook", methods=["POST"])
def webhook():
    data = request.json
    print(data.get("event"))

    if data.get("event") == "endpoint.url_validation":
        plain_token = data["payload"]["plainToken"]

        encrypted = hmac.new(
            ZOOM_SECRET.encode(), plain_token.encode(), hashlib.sha256
        ).hexdigest()

        return jsonify({"plainToken": plain_token, "encryptedToken": encrypted})

    print("🔥 Webhook received:")
    print(data)

    return "", 200


if __name__ == "__main__":
    app.run(port=3000)
