import sqlite3
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Name of your database file
DB_NAME = 'portfolio.db'

def init_db():
    """Initialize the database and create the contacts table if it doesn't exist."""
    # Using 'with' ensures the database file is never locked, even if the app crashes
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
    # Serves your index.html file (Make sure index.html is inside a 'templates' folder!)
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    try:
        # Get JSON data sent from your frontend script.js
        data = request.get_json()
        
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        # Basic validation to ensure no empty messages are sent
        if not all([name, email, subject, message]):
            return jsonify({"status": "error", "message": "All fields are required!"}), 400

        # Insert into database safely using 'with' and a timeout to prevent locks
        with sqlite3.connect(DB_NAME, timeout=10) as conn:
            cursor = conn.cursor()
            # We don't insert 'created_at' because the database does it automatically now
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
    """Endpoint to view all submissions (I saw this in your logs)"""
    try:
        with sqlite3.connect(DB_NAME, timeout=10) as conn:
            conn.row_factory = sqlite3.Row # This makes rows behave like dictionaries
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM contacts ORDER BY created_at DESC")
            rows = cursor.fetchall()
            
            # Convert rows to a list of dictionaries to send as JSON
            submissions = [dict(row) for row in rows]
            
        return jsonify(submissions), 200
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Could not fetch submissions."}), 500

if __name__ == '__main__':
    # debug=True automatically restarts the server when you save changes
    app.run(debug=True, port=5000)