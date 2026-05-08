import redis
from typing import Optional
import json
from app.core.config import settings

class RedisClient:
    def __init__(self):
        self.use_redis = settings.USE_REDIS
        self.redis_client = None
        
        if self.use_redis:
            if not settings.REDIS_URL:
                raise RuntimeError("REDIS_URL is not set")

            self.redis_client = redis.Redis.from_url(
                settings.REDIS_URL,
                decode_responses=True
            )
        else:
            print("Redis is disabled via settings. Skipping initialization.")
    
    def get(self, key: str) -> Optional[str]:
        if not self.use_redis or not self.redis_client:
            return None
        try:
            return self.redis_client.get(key)
        except Exception as e:
            print(f"Redis GET error: {e}")
            return None
    
    def set(self, key: str, value: str, expiry: int = 3600):
        if not self.use_redis or not self.redis_client:
            return False
        try:
            self.redis_client.setex(key, expiry, value)
            return True
        except Exception as e:
            print(f"Redis SET error: {e}")
            return False
    
    def delete(self, key: str):
        if not self.use_redis or not self.redis_client:
            return False
        try:
            self.redis_client.delete(key)
            return True
        except Exception as e:
            print(f"Redis DELETE error: {e}")
            return False
    
    def delete_pattern(self, pattern: str) -> int:
        if not self.use_redis or not self.redis_client:
            return 0
        try:
            deleted_count = 0
            cursor = 0
            while True:
                cursor, keys = self.redis_client.scan(cursor, match=pattern, count=100)
                if keys:
                    self.redis_client.delete(*keys)
                    deleted_count += len(keys)
                if cursor == 0:
                    break
            return deleted_count
        except Exception as e:
            print(f"Redis DELETE_PATTERN error: {e}")
            return 0
    
    def exists(self, key: str) -> bool:
        if not self.use_redis or not self.redis_client:
            return False
        try:
            return self.redis_client.exists(key) > 0
        except Exception as e:
            print(f"Redis EXISTS error: {e}")
            return False
    
    def set_json(self, key: str, value: dict, expiry: int = 3600):
        if not self.use_redis:
            return False
        try:
            json_value = json.dumps(value)
            return self.set(key, json_value, expiry)
        except Exception as e:
            print(f"Redis SET_JSON error: {e}")
            return False
    
    def get_json(self, key: str) -> Optional[dict]:
        if not self.use_redis:
            return None
        try:
            value = self.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            print(f"Redis GET_JSON error: {e}")
            return None
    
    def ping(self) -> bool:
        if not self.use_redis or not self.redis_client:
            return False
        try:
            return self.redis_client.ping()
        except Exception as e:
            print(f"Redis connection error: {e}")
            return False

redis_client = RedisClient()
