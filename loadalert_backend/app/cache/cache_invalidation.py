from .redis_client import redis_client

def invalidate_user_dashboard_cache(user_id: int):
    cache_keys = [
        f"dashboard:summary:{user_id}",
    ]
    for key in cache_keys:
        redis_client.delete(key)

def invalidate_user_session_cache(user_email: str):
    pattern = f"user:{user_email}"
    redis_client.delete(pattern)

def invalidate_user_all_caches(user_id: int, user_email: str):
    invalidate_user_dashboard_cache(user_id)
    invalidate_user_session_cache(user_email)
    
    patterns = [
        f"user_data:{user_id}:*",
        f"user_deadlines:{user_id}:*",
    ]
    for pattern in patterns:
        redis_client.delete_pattern(pattern)
