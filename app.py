from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS counts (
        id INTEGER PRIMARY KEY,
        text1 INTEGER DEFAULT 0,
        text2 INTEGER DEFAULT 0,
        text3 INTEGER DEFAULT 0,
        text4 INTEGER DEFAULT 0
    )''')
    c.execute('INSERT INTO counts (id) VALUES (1) ON CONFLICT(id) DO NOTHING')
    conn.commit()
    conn.close()

@app.route('/update_count', methods=['POST'])
def update_count():
    data = request.get_json()
    text_id = data['id']
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    c.execute(f'UPDATE counts SET {text_id} = {text_id} + 1 WHERE id = 1')
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})

@app.route('/get_counts', methods=['GET'])
def get_counts():
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    c.execute('SELECT text1, text2, text3, text4 FROM counts WHERE id = 1')
    row = c.fetchone()
    conn.close()
    return jsonify({'text1': row[0], 'text2': row[1], 'text3': row[2], 'text4': row[3]})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
