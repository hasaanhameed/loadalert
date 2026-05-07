from functools import wraps
from .redis_client import redis_client
from fastapi import Request
import json

def cache_response(expiry: int = 300, key_prefix: str = ""):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request = kwargs.get('request')
            current_user = kwargs.get('current_user')
            
            if current_user:
                cache_key = f"{key_prefix}:{current_user.id}:{func.__name__}"
            else:
                cache_key = f"{key_prefix}:{func.__name__}"
            
            if request and hasattr(request, "query_params") and request.query_params:
                params_str = str(sorted(request.query_params.items()))
                cache_key += f":{hash(params_str)}"
            
            cached_data = redis_client.get_json(cache_key)
            if cached_data:
                return cached_data
            
            result = await func(*args, **kwargs)
            redis_client.set_json(cache_key, result, expiry=expiry)
            return result
        return wrapper
    return decorator
