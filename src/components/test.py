import requests
import csv
from datetime import datetime

# ================= CONFIG =================
API_KEY = "UY2Y4KRFP25QERFW8NXYJ9H43"   # <-- PUT YOUR API KEY HERE
LOCATION = "Chennai,India"
OUTPUT_FILE = "chennai_temperature.csv"

# Date, Time (12-hour format)
input_data = [
    ("2025-12-01", "03:46:09 PM"),
    ("2025-12-01", "03:46:09 PM"),
    ("2025-12-03", "08:42:50 PM"),
    ("2025-12-03", "08:42:50 PM"),
    ("2025-12-04", "04:38:05 PM"),
    ("2025-12-04", "04:38:05 PM"),
    ("2025-12-05", "01:17:19 PM"),
    ("2025-12-05", "01:17:19 PM"),
    ("2025-12-06", "01:05:10 PM"),
    ("2025-12-06", "01:05:10 PM"),
    ("2025-12-06", "08:59:46 PM"),
    ("2025-12-06", "08:59:46 PM"),
    ("2025-12-06", "10:28:41 PM"),
    ("2025-12-06", "10:28:41 PM"),
    ("2025-12-08", "04:43:56 PM"),
    ("2025-12-08", "04:43:56 PM"),
    ("2025-12-08", "09:08:21 PM"),
    ("2025-12-08", "09:08:21 PM"),
    ("2025-12-09", "01:33:12 PM"),
    ("2025-12-09", "01:33:12 PM"),
    ("2025-12-11", "01:35:55 PM"),
    ("2025-12-11", "01:35:55 PM"),
    ("2025-12-11", "04:59:35 PM"),
    ("2025-12-11", "04:59:35 PM"),
    ("2025-12-12", "04:26:32 PM"),
    ("2025-12-12", "04:26:32 PM"),
    ("2025-12-12", "04:26:32 PM"),
    ("2025-12-12", "04:26:32 PM"),
    ("2025-12-12", "10:26:44 PM"),
    ("2025-12-12", "10:26:44 PM"),
    ("2025-12-13", "07:54:12 PM"),
    ("2025-12-13", "07:54:12 PM"),
    ("2025-12-13", "07:54:12 PM"),
    ("2025-12-13", "07:54:12 PM"),
    ("2025-12-15", "08:31:35 PM"),
    ("2025-12-15", "08:31:35 PM"),
    ("2025-12-15", "08:53:00 PM"),
    ("2025-12-15", "08:53:00 PM"),
    ("2025-12-17", "01:52:20 PM"),
    ("2025-12-17", "01:52:20 PM"),
    ("2025-12-17", "10:39:31 PM"),
    ("2025-12-17", "10:39:31 PM"),
    ("2025-12-18", "01:55:34 PM"),
    ("2025-12-18", "01:55:34 PM"),
    ("2025-12-18", "10:44:00 PM"),
    ("2025-12-18", "10:44:00 PM"),
    ("2025-12-19", "01:52:37 PM"),
    ("2025-12-19", "01:52:37 PM"),
    ("2025-12-19", "09:19:26 PM"),
    ("2025-12-19", "09:19:26 PM"),
    ("2025-12-19", "09:19:26 PM"),
    ("2025-12-19", "09:19:26 PM"),
    ("2025-12-19", "09:22:40 PM"),
    ("2025-12-19", "09:22:40 PM"),
    ("2025-12-21", "09:03:41 PM"),
    ("2025-12-21", "09:03:41 PM"),
    ("2025-12-21", "09:03:41 PM"),
    ("2025-12-21", "09:03:41 PM"),
    ("2025-12-21", "09:03:41 PM"),
    ("2025-12-21", "09:03:41 PM"),
    ("2025-12-22", "11:53:44 PM"),
    ("2025-12-22", "11:53:44 PM"),
    ("2025-12-22", "11:53:44 PM"),
    ("2025-12-22", "11:53:44 PM"),
    ("2025-12-22", "11:53:44 PM"),
    ("2025-12-22", "11:53:44 PM"),
]

# ================= FUNCTIONS =================
def convert_to_24h(time_str):
    return datetime.strptime(time_str, "%I:%M:%S %p").strftime("%H:%M:%S")


# ================= MAIN =================
rows = []

for date, time_12h in input_data:
    hour_24h = convert_to_24h(time_12h)

    url = (
        "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/"
        f"timeline/{LOCATION}/{date}T{hour_24h}"
        f"?unitGroup=metric&include=hours&key={API_KEY}"
    )

    response = requests.get(url)

    if response.status_code != 200:
        print(f"❌ Failed: {date} {time_12h}")
        print("Status:", response.status_code)
        print("Response:", response.text[:200])
        rows.append([date, time_12h, "ERROR"])
        continue

    try:
        data = response.json()
        temperature = data["days"][0]["hours"][0]["temp"]
        rows.append([date, time_12h, temperature])
        print(f"✅ {date} {time_12h} → {temperature} °C")
    except Exception as e:
        print("❌ JSON parse error:", e)
        rows.append([date, time_12h, "ERROR"])

# ================= CSV WRITE =================
with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Date", "Time", "Temperature (°C)"])
    writer.writerows(rows)

print("\n🎉 DONE! File saved as:", OUTPUT_FILE)
