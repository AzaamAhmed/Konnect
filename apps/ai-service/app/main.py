from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(
    title="Konnect AI Service",
    description="AI-powered matching, recommendations, and analytics",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class User(BaseModel):
    id: str
    name: str
    skills: List[str]
    interests: List[str]
    bio: Optional[str] = ""

class Post(BaseModel):
    id: str
    title: str
    description: str
    techStack: List[str]
    lookingFor: List[str]

class MatchRequest(BaseModel):
    user: User
    posts: List[Post]

class SimilarityRequest(BaseModel):
    post: Post
    existingPosts: List[Post]

# Initialize TF-IDF vectorizer
vectorizer = TfidfVectorizer(stop_words='english', max_features=100)

@app.get("/")
def root():
    return {
        "service": "Konnect AI Service",
        "status": "running",
        "version": "1.0.0",
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/matching/talent-to-post")
def match_talent_to_post(request: MatchRequest):
    """
    Match users to relevant posts based on skills, interests, and requirements
    Returns scored matches
    """
    user = request.user
    posts = request.posts
    
    if not posts:
        return {"matches": []}
    
    # Create user profile text
    user_text = " ".join([
        user.name,
        user.bio or "",
        " ".join(user.skills),
        " ".join(user.interests),
    ])
    
    # Create post texts
    post_texts = []
    for post in posts:
        post_text = " ".join([
            post.title,
            post.description,
            " ".join(post.techStack),
            " ".join(post.lookingFor),
        ])
        post_texts.append(post_text)
    
    # Calculate similarity
    all_texts = [user_text] + post_texts
    
    try:
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        user_vector = tfidf_matrix[0:1]
        post_vectors = tfidf_matrix[1:]
        
        similarities = cosine_similarity(user_vector, post_vectors)[0]
        
        # Create matches with scores
        matches = []
        for idx, post in enumerate(posts):
            score = float(similarities[idx]) * 100  # Convert to percentage
            
            # Boost score for skill matches
            skill_match_count = len(set(user.skills) & set(post.techStack))
            if skill_match_count > 0:
                score += skill_match_count * 10
            
            # Cap at 100
            score = min(score, 100)
            
            matches.append({
                "postId": post.id,
                "score": round(score, 2),
                "reasons": [
                    f"Matched {skill_match_count} required skills" if skill_match_count > 0 else "Profile alignment",
                    "Good fit based on interests",
                ],
            })
        
        # Sort by score descending
        matches.sort(key=lambda x: x["score"], reverse=True)
        
        return {"matches": matches}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching error: {str(e)}")

@app.post("/api/similarity/detect-duplicates")
def detect_similar_posts(request: SimilarityRequest):
    """
    Detect similar or duplicate posts using content similarity
    """
    new_post = request.post
    existing_posts = request.existingPosts
    
    if not existing_posts:
        return {"similarPosts": []}
    
    # Create post texts
    new_post_text = " ".join([new_post.title, new_post.description, " ".join(new_post.techStack)])
    
    existing_texts = []
    for post in existing_posts:
        text = " ".join([post.title, post.description, " ".join(post.techStack)])
        existing_texts.append(text)
    
    # Calculate similarity
    all_texts = [new_post_text] + existing_texts
    
    try:
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        new_vector = tfidf_matrix[0:1]
        existing_vectors = tfidf_matrix[1:]
        
        similarities = cosine_similarity(new_vector, existing_vectors)[0]
        
        # Find similar posts (above 60% similarity)
        similar_posts = []
        for idx, post in enumerate(existing_posts):
            similarity = float(similarities[idx]) * 100
            if similarity >= 60:
                similar_posts.append({
                    "postId": post.id,
                    "similarity": round(similarity, 2),
                    "title": post.title,
                })
        
        # Sort by similarity descending
        similar_posts.sort(key=lambda x: x["similarity"], reverse=True)
        
        return {"similarPosts": similar_posts}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Similarity detection error: {str(e)}")

@app.post("/api/recommendations/for-user")
def get_recommendations_for_user(request: MatchRequest):
    """
    Get personalized post recommendations for a user
    Similar to matching but optimized for discovery
    """
    # Reuse the matching logic
    matches = match_talent_to_post(request)
    
    # Filter to high-quality matches (score > 40)
    recommendations = [
        match for match in matches["matches"]
        if match["score"] > 40
    ]
    
    return {
        "recommendations": recommendations[:10],  # Top 10
        "count": len(recommendations),
    }

@app.post("/api/search/smart-search")
def smart_search(query: str, posts: List[Post]):
    """
    Smart search with NLP-enhanced relevance
    """
    if not query or not posts:
        return {"results": []}
    
    # Create post texts
    post_texts = []
    for post in posts:
        text = " ".join([post.title, post.description, " ".join(post.techStack)])
        post_texts.append(text)
    
    # Calculate relevance
    all_texts = [query] + post_texts
    
    try:
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        query_vector = tfidf_matrix[0:1]
        post_vectors = tfidf_matrix[1:]
        
        relevance_scores = cosine_similarity(query_vector, post_vectors)[0]
        
        # Create results
        results = []
        for idx, post in enumerate(posts):
            score = float(relevance_scores[idx]) * 100
            if score > 10:  # Filter low relevance
                results.append({
                    "postId": post.id,
                    "title": post.title,
                    "relevance": round(score, 2),
                })
        
        # Sort by relevance
        results.sort(key=lambda x: x["relevance"], reverse=True)
        
        return {"results": results}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

class ContentScoreRequest(BaseModel):
    title: str
    description: str
    techStack: List[str]

@app.post("/api/analytics/content-score")
def content_quality_score(request: ContentScoreRequest):
    """
    Analyze post content quality based on length, clarity, and detail
    Returns a score out of 100 and suggestions
    """
    score = 0
    suggestions = []
    
    # Title analysis
    if len(request.title) < 10:
        suggestions.append("Title is too short. enhance it for better visibility.")
    elif len(request.title) > 80:
        suggestions.append("Title is too long. Keep it concise.")
    else:
        score += 20
        
    # Description analysis
    desc_words = len(request.description.split())
    if desc_words < 50:
        suggestions.append("Description is too brief. Elaborate on your idea.")
    elif desc_words > 500:
        score += 40
    else:
        score += 30 + (desc_words / 500) * 10
        
    # Tech stack analysis
    if len(request.techStack) == 0:
        suggestions.append("Add technology tags to reach relevant developers.")
    elif len(request.techStack) < 3:
        score += 10
        suggestions.append("Adding more specific tech tags can help.")
    else:
        score += 20
        
    # Formatting check (paragraphs)
    if "\n\n" in request.description:
        score += 20
    else:
        suggestions.append("Use paragraphs to make your description readable.")
        
    return {
        "score": min(round(score), 100),
        "level": "Excellent" if score > 80 else "Good" if score > 50 else "Needs Improvement",
        "suggestions": suggestions
    }

class TrendRequest(BaseModel):
    posts: List[Post]

@app.post("/api/analytics/trends")
def analyze_trends(request: TrendRequest):
    """
    Analyze trending skills and keywords from a batch of posts
    """
    if not request.posts:
        return {"trends": []}
        
    skill_counts = {}
    keyword_counts = {}
    
    for post in request.posts:
        # Count skills
        for skill in post.techStack:
            skill = skill.lower()
            skill_counts[skill] = skill_counts.get(skill, 0) + 1
            
        # simple keyword extraction from description
        words = [w.lower() for w in post.description.split() if len(w) > 5]
        for word in words:
            keyword_counts[word] = keyword_counts.get(word, 0) + 1
            
    # Sort and format
    top_skills = [
        {"name": k, "count": v} 
        for k, v in sorted(skill_counts.items(), key=lambda item: item[1], reverse=True)[:10]
    ]
    
    top_keywords = [
        {"name": k, "count": v} 
        for k, v in sorted(keyword_counts.items(), key=lambda item: item[1], reverse=True)[:10]
    ]
    
    return {
        "top_skills": top_skills,
        "top_keywords": top_keywords,
        "sample_size": len(request.posts)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
