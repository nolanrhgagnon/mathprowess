import asyncio
import re
import subprocess
from os import getenv

import boto3
import discord
import requests
from dotenv import load_dotenv
from fpdf import FPDF
from openai import OpenAI
from twilio.rest import Client

from mpai.prompts import build_prompt

load_dotenv()

TOKEN = getenv("DISCORD_BOT_TOKEN")
CHANNEL_ID = int(getenv("DISCORD_BOT_CHANNEL"))

ZOOM_CLIENT_ID = getenv("ZOOM_CLIENT_ID")
ZOOM_CLIENT_SECRET = getenv("ZOOM_CLIENT_SECRET")
ZOOM_REDIRECT_URI = getenv("ZOOM_REDIRECT_URI")
ZOOM_AUTH_CODE = "EBk7NUYDQwjy6gboJ1pSma-0R7sQofmlQ"

AWS_BUCKET = getenv("AWS_BUCKET")
AWS_REGION = getenv("AWS_REGION")
AWS_KEY = getenv("AWS_KEY")
AWS_SECRET = getenv("AWS_SECRET")
LOCAL_PDF = "hw.pdf"

TWILIO_ACCOUNT_SID = getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = getenv("TWILIO_AUTH_TOKEN")

OPENAI_API_KEY = getenv("OPENAI_API_KEY")

intents = discord.Intents.default()
discord_client = discord.Client(intents=intents)
twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
openai_client = OpenAI(api_key=OPENAI_API_KEY)


def clean_zoom_transcript(transcript: str) -> str:
    transcript = re.sub(r"^WEBVTT.*\n?", "", transcript, flags=re.MULTILINE)
    transcript = re.sub(r".*-->.*\n?", "", transcript)
    transcript = re.sub(r"^[A-Za-z0-9_ ]+: ", "", transcript, flags=re.MULTILINE)
    transcript = "\n".join(
        [
            line
            for line in transcript.splitlines()
            if line.strip() and not line.strip().isdigit()
        ]
    )

    return transcript


def create_document(transcript: str):
    prompt = build_prompt(10, "integration", transcript)
    response = openai_client.chat.completions.create(
        model="gpt-4.1-mini", messages=[{"role": "user", "content": prompt}]
    )

    questions = re.search(r"\\begin\{enumerate\}.*?\\end\{enumerate\}", response.choices[0].message.content, re.S)

    tex_content = rf"""
    \documentclass{{article}}
    \usepackage{{amsmath}}
    \usepackage{{amssymb}}

    \begin{{document}}

    {questions.group(0)}

    \end{{document}}
    """

    with open("hw.tex", "w") as f:
        f.write(tex_content)

    subprocess.run(
        ["/Library/TeX/texbin/pdflatex", "-interaction=nonstopmode", "hw.tex"],
        check=True,
    )


def upload_document():
    s3 = boto3.client(
        "s3",
        aws_access_key_id=AWS_KEY,
        aws_secret_access_key=AWS_SECRET,
        region_name=AWS_REGION,
    )

    s3.upload_file(
        LOCAL_PDF,
        AWS_BUCKET,
        LOCAL_PDF,
        ExtraArgs={"ACL": "public-read", "ContentType": "application/pdf"},
    )

    return f"https://{AWS_BUCKET}.s3.amazonaws.com/{LOCAL_PDF}"


def send_document(url: str, recipients: [str], name: str) -> int:
    for number in recipients:
        message = twilio_client.messages.create(
            from_="whatsapp:+14155238886",
            body=f"Sup {name}, this train just keeps on a comin'",
            media_url=[url],
            to=number,
        )
        print(f"Sent to {number}: {message.sid}")

def fetch_transcript():
    auth = (ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET)
    payload = {
        "grant_type": "authorization_code",
        "code": ZOOM_AUTH_CODE,
        "redirect_uri": ZOOM_REDIRECT_URI,
    }

    r = requests.post("https://zoom.us/oauth/token", auth=auth, data=payload)
    if r.status_code != 200:
        print("Failed to get token:", r.text)
        exit()

    access_token = r.json()["access_token"]

    r2 = requests.get(
        "https://api.zoom.us/v2/users/me/recordings",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    clean_transcript = ""
    if r2.status_code != 200:
        print("Failed to get recordings:", r2.text)
    else:
        recordings = r2.json().get("meetings", [])
        for meeting in recordings:
            topic = meeting.get("topic", "No Topic")
            for f in meeting.get("recording_files", []):
                if f.get("file_type") == "TRANSCRIPT":
                    transcript_url = f["download_url"]
                    transcript = requests.get(transcript_url, headers=headers).text
                    clean_transcript = clean_zoom_transcript(transcript)
    return clean_transcript


def post_hw(student: str, number: str):
    # recipients = ["whatsapp:+12079517723", "whatsapp:+17152097720"]
    recipients = set({"whatsapp:+12079517723"}).union(set({number}))
    transcript = fetch_transcript()
    create_document(transcript)
    document_url = upload_document()
    send_document(document_url, recipients, student)


@discord_client.event
async def on_ready():
    channel = discord_client.get_channel(CHANNEL_ID)

    hw_pdf_path = "hw.pdf"

    msg = await channel.send(
        content="Here is a homework for your approval", file=discord.File(hw_pdf_path)
    )

    await msg.add_reaction("✅")
    await msg.add_reaction("❌")

    def check(reaction, user):
        return (
            reaction.message.id == msg.id
            and str(reaction.emoji) in ["✅", "❌"]
            and not user.bot
        )

    reaction, user = await discord_client.wait_for("reaction_add", check=check)

    if str(reaction.emoji) == "✅":
        print("Homework sent to user")
        post_hw("Tardio", "whatsapp:+12079517723")
    else:
        print("Homework not approved")


discord_client.run(TOKEN)
