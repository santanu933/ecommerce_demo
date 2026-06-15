
from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
from datetime import datetime
import csv
import os

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ORDERS_FILE = os.path.join(BASE_DIR, "orders.csv")

FIELDS = [
    "OrderID","Created","Customer","Phone","Address",
    "Payment","Items","Total","Status"
]

def create_csv():
    if not os.path.exists(ORDERS_FILE):
        with open(ORDERS_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=FIELDS)
            writer.writeheader()

def read_orders():
    create_csv()
    with open(ORDERS_FILE, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))

def save_orders(rows):
    with open(ORDERS_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/admin")
def admin():
    return render_template("admin.html")

@app.route("/place-order", methods=["POST"])
def place_order():
    d = request.get_json()
    rows = read_orders()
    oid = len(rows) + 1
    total = sum(i["price"] * i["qty"] for i in d["items"])

    rows.append({
        "OrderID": oid,
        "Created": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "Customer": d.get("name",""),
        "Phone": d.get("phone",""),
        "Address": d.get("address",""),
        "Payment": d.get("payment",""),
        "Items": "; ".join([f"{i['name']} x{i['qty']}" for i in d["items"]]),
        "Total": total,
        "Status": "Placed"
    })

    save_orders(rows)
    return jsonify({"success": True, "orderId": oid})

@app.route("/orders")
def orders():
    return jsonify(read_orders())

@app.route("/update-status/<int:oid>/<status>")
def update_status(oid, status):
    rows = read_orders()
    for r in rows:
        if int(r["OrderID"]) == oid:
            r["Status"] = status
    save_orders(rows)
    return jsonify({"success": True})

@app.route("/download-csv")
def download_csv():
    create_csv()
    return send_file(ORDERS_FILE, as_attachment=True, download_name="orders.csv")

if __name__ == "__main__":
    create_csv()
    app.run(host="0.0.0.0", port=5000, debug=True)
