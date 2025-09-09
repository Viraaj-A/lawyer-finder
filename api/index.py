from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Configure CORS for Next.js integration
CORS(app, origins=["http://localhost:3000"], 
     allow_headers=["Content-Type"],
     methods=["GET", "POST", "OPTIONS"])

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import routes
from routes.legal_transform import legal_transform_bp
app.register_blueprint(legal_transform_bp, url_prefix='/api/ai')

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "Flask API"}), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal error: {error}")
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    logger.info("Starting Flask API server on port 5328...")
    app.run(host="127.0.0.1", port=5328, debug=True)