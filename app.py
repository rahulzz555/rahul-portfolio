import sqlite3
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Name of your database file
DB_NAME = 'portfolio.db'

def init_db():
    """Initialize the database and create the contacts table if it doesn't exist."""
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        print("Database initialized successfully.")

# Run database initialization when the app starts
init_db()

@app.route('/')
def index():
    # FIX: Fetch submissions from the database and pass them to index.html 
    # so they show up immediately when the page loads!
    try:
        with sqlite3.connect(DB_NAME, timeout=10) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM contacts ORDER BY created_at DESC")
            submissions = [dict(row) for row in cursor.fetchall()]
    except Exception:
        submissions = []
        
    return render_template('index.html', submissions=submissions)

@app.route('/submit', methods=['POST'])
def submit():
    try:
        data = request.get_json()
        
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        if not all([name, email, subject, message]):
            return jsonify({"status": "error", "message": "All fields are required!"}), 400

        with sqlite3.connect(DB_NAME, timeout=10) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO contacts (name, email, subject, message)
                VALUES (?, ?, ?, ?)
            """, (name, email, subject, message))
            conn.commit()
            
        return jsonify({"status": "success", "message": "Message sent successfully!"}), 200

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "A database error occurred."}), 500
    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred."}), 500

@app.route('/api/submissions', methods=['GET'])
def get_submissions():
    """Endpoint to view all submissions"""
    try:
        with sqlite3.connect(DB_NAME, timeout=10) as conn:
            conn.row_factory = sqlite3.Row 
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM contacts ORDER BY created_at DESC")
            rows = cursor.fetchall()
            
            submissions = [dict(row) for row in rows]
            
        return jsonify(submissions), 200
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Could not fetch submissions."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)