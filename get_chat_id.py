import requests
import time

# Put your bot token here
BOT_TOKEN = "8071098931:AAFz_EOIJDp7RrJczbimuIE-sZmXnMPjOi0"
API = f"https://api.telegram.org/bot{BOT_TOKEN}"

def get_chat_id():
    while True:
        try:
            resp = requests.get(f"{API}/getUpdates", timeout=10).json()
            results = resp.get("result", [])

            if not results:
                print("No new messages yet. Ask the new owner to send /start to the bot.")
                time.sleep(5)
                continue

            for update in results:
                if "message" in update:
                    msg = update["message"]
                    chat_id = msg["chat"]["id"]
                    first_name = msg["from"].get("first_name", "Unknown")
                    print(f"✅ {first_name}'s CHAT_ID = {chat_id}")
                    return chat_id

        except Exception as e:
            print("Error:", e)
            time.sleep(5)

if __name__ == "__main__":
    chat_id = get_chat_id()
    print(f"\n👉 Save this CHAT_ID ({chat_id}) and replace it in your bot code.")
