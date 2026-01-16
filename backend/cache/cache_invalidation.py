from .redis_client import redis_client

def invalidate_user_dashboard_cache(user_id: int):
    """
    Invalidate all dashboard-related caches for a specific user
    Call this when:
    - User adds a deadline
    - User updates a deadline
    - User deletes a deadline
    """
    cache_keys = [
        f"dashboard:summary:{user_id}",
    ]
    
    for key in cache_keys:
        redis_client.delete(key)
        print(f"Invalidated cache: {key}")

def invalidate_user_session_cache(user_email: str):
    """
    Invalidate user session cache
    Call this when user data changes (name, email, password)
    """
    pattern = f"user:{user_email}"
    redis_client.delete(pattern)
    print(f"Invalidated user session cache: {pattern}")

def invalidate_user_all_caches(user_id: int, user_email: str):
    """
    Invalidate ALL caches for a user
    Call this when user data changes significantly
    """
    # Delete dashboard caches
    invalidate_user_dashboard_cache(user_id)
    
    # Delete user session cache
    invalidate_user_session_cache(user_email)
    
    # Delete any other user-specific patterns
    patterns = [
        f"user_data:{user_id}:*",
        f"user_deadlines:{user_id}:*",
    ]
    
    for pattern in patterns:
        deleted = redis_client.delete_pattern(pattern)
        if deleted > 0:
            print(f"Deleted {deleted} keys matching pattern: {pattern}")
    
    print(f"Invalidated all caches for user {user_id}")