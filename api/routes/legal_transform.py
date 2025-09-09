"""
Legal text transformation endpoint using Predibase and Supabase hybrid search.
"""

from flask import Blueprint, request, jsonify
import requests
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import logging
from sentence_transformers import SentenceTransformer

# Set up logging
logger = logging.getLogger(__name__)

# Create Blueprint
legal_transform_bp = Blueprint('legal_transform', __name__)

# Initialize the embedding model (384 dimensions)
print("Loading embedding model...")
embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
print("✓ Embedding model loaded (384 dimensions)")

# Get environment variables
DB_USER = os.getenv("user")
DB_PASSWORD = os.getenv("password")
DB_HOST = os.getenv("host")
DB_PORT = os.getenv("port")
DB_NAME = os.getenv("dbname")
PREDIBASE_URL = os.getenv("PREDIBASE_URL")
PREDIBASE_TOKEN = os.getenv("PREDIBASE_TOKEN")

def get_db_connection():
    """Create database connection."""
    try:
        conn = psycopg2.connect(
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME
        )
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        raise

def transform_to_legal_text(user_input):
    """
    Convert user input to formal legal language using Predibase API.
    """
    instruction_text = (
        "Strictly adhere to the following instructions when converting any informal non-legal terminology to formal legal language in the user input: "
        "- Do not add any extra detail that detracts from the original meaning. "
        "- The output must be as close to the original meaning of the input. "
        "- The output must be as close to the original input length as possible. "
        "With these instructions convert the following text: "
    )
    
    prompt = (
        f"<|im_start|>user\n"
        f"{instruction_text}{user_input}<|im_end|>\n"
        f"<|im_start|>assistant"
    )
    
    data = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 512,
            "temperature": 0.0,
            "adapter_id": "Legal_Finder/1",
            "adapter_source": "pbase"
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": PREDIBASE_TOKEN
    }
    
    try:
        response = requests.post(PREDIBASE_URL, json=data, headers=headers)
        response_json = response.json()
        generated_text = response_json.get('generated_text', '')
        
        if isinstance(generated_text, (list, dict)):
            generated_text = str(generated_text)
        
        return generated_text.strip()
    except Exception as e:
        logger.error(f"Predibase API error: {e}")
        return user_input  # Fallback to original text

def search_legal_articles(connection, query_text, limit=3):
    """
    Perform hybrid search: keyword + semantic search using embeddings.
    This matches your working standalone script.
    """
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Generate embedding for the query
        logger.info("Generating query embedding...")
        query_embedding = embedding_model.encode(query_text, convert_to_numpy=True)
        
        # Perform hybrid search using the database function
        logger.info("Performing hybrid search...")
        cursor.execute(
            "SELECT * FROM hybrid_search(%s, %s::vector(384), %s)",
            (query_text, query_embedding.tolist(), limit)
        )
        
        results = cursor.fetchall()
        
        # Format results to match expected structure
        formatted_results = []
        for result in results:
            formatted_results.append({
                'title': result.get('title', ''),
                'category': result.get('main_category', ''),
                'subcategory': result.get('subcategory', ''),
                'url': result.get('url', ''),
                'score': float(result.get('combined_score', 0.5)) if result.get('combined_score') else 0.5
            })
        
        logger.info(f"Found {len(formatted_results)} results from hybrid search")
        return formatted_results
        
    except Exception as e:
        logger.error(f"Hybrid search error: {e}")
        # Return empty results on error
        return []
    finally:
        cursor.close()

@legal_transform_bp.route('/transform', methods=['POST'])
def transform_legal_issue():
    """
    Main endpoint to transform legal text and find relevant categories.
    """
    try:
        # Get input text from request
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Missing 'text' parameter"}), 400
        
        user_text = data['text']
        logger.info(f"Processing text: {user_text[:100]}...")
        
        # Step 1: Transform to formal legal language
        formal_query = transform_to_legal_text(user_text)
        logger.info(f"Transformed to: {formal_query[:100]}...")
        
        # Step 2: Search legal articles
        connection = get_db_connection()
        try:
            search_results = search_legal_articles(connection, formal_query, limit=3)
            
            # Results are already formatted from search_legal_articles
            categories = search_results
            
            # If no results, provide default categories
            if not categories:
                categories = [
                    {"title": "General Legal Advice", "category": "Legal Services", "score": 0.3}
                ]
            
            response = {
                "formal_query": formal_query,
                "categories": categories
            }
            
            return jsonify(response), 200
            
        finally:
            connection.close()
            
    except Exception as e:
        logger.error(f"Transform endpoint error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@legal_transform_bp.route('/test', methods=['GET'])
def test_endpoint():
    """Test endpoint to verify the route is working."""
    return jsonify({"message": "Legal transform endpoint is working"}), 200