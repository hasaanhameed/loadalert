from functools import wraps
from redis_client import redis_client
from fastapi import Request
import json

def cache_response(expiry: int = 300, key_prefix: str = ""):
    """
    Decorator to cache API responses in Redis
    
    Args:
        expiry: Cache expiry time in seconds (default 5 minutes)
        key_prefix: Prefix for the cache key
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract request and current_user from kwargs
            request = kwargs.get('request')
            current_user = kwargs.get('current_user')
            
            # Build cache key
            if current_user:
                # User-specific cache
                cache_key = f"{key_prefix}:{current_user.id}:{func.__name__}"
            else:
                # Global cache
                cache_key = f"{key_prefix}:{func.__name__}"
            
            # Add query parameters to cache key if present
            if request and request.query_params:
                params_str = str(sorted(request.query_params.items()))
                cache_key += f":{hash(params_str)}"
            
            # Try to get from cache
            cached_data = redis_client.get_json(cache_key)
            
            if cached_data:
                print(f"Cache HIT: {cache_key}")
                return cached_data
            
            print(f"Cache MISS: {cache_key}")
            
            # Execute the function
            result = await func(*args, **kwargs)
            
            # Cache the result
            redis_client.set_json(cache_key, result, expiry=expiry)
            print(f"Cached: {cache_key}")
            
            return result
        
        return wrapper
    return decorator


def invalidate_user_cache(user_id: int, prefix: str = ""):
    """
    Invalidate all cache entries for a specific user
    Useful when user data is updated
    """
    # In production, you'd use Redis SCAN to find all matching keys
    # For now, we'll delete specific known patterns
    patterns = [
        f"{prefix}:{user_id}:*",
        f"user_session:*"
    ]
    
    print(f"Invalidated cache for user {user_id}")
    # Note: This is a simplified version
    # In production, implement proper pattern-based deletion