import redis
from typing import Optional, List
import json
from dotenv import load_dotenv
import os

load_dotenv()

class RedisClient:
    def __init__(self):
        redis_url = os.getenv("REDIS_URL")
        if not redis_url:
            raise RuntimeError("REDIS_URL is not set")

        self.redis_client = redis.Redis.from_url(
            redis_url,
            decode_responses=True
        )
    
    def get(self, key: str) -> Optional[str]:
        """Get value from Redis"""
        try:
            return self.redis_client.get(key)
        except Exception as e:
            print(f"Redis GET error: {e}")
            return None
    
    def set(self, key: str, value: str, expiry: int = 3600):
        """
        Set value in Redis with expiry time
        expiry: Time in seconds (default 1 hour)
        """
        try:
            self.redis_client.setex(key, expiry, value)
            return True
        except Exception as e:
            print(f"Redis SET error: {e}")
            return False
    
    def delete(self, key: str):
        """Delete key from Redis"""
        try:
            self.redis_client.delete(key)
            return True
        except Exception as e:
            print(f"Redis DELETE error: {e}")
            return False
    
    def delete_pattern(self, pattern: str) -> int:
        """
        Delete all keys matching a pattern using SCAN
        Returns number of keys deleted
        """
        try:
            deleted_count = 0
            cursor = 0
            
            while True:
                cursor, keys = self.redis_client.scan(cursor, match=pattern, count=100)
                
                if keys:
                    self.redis_client.delete(*keys)
                    deleted_count += len(keys)
                    print(f"Deleted {len(keys)} keys matching pattern: {pattern}")
                
                if cursor == 0:
                    break
            
            return deleted_count
        except Exception as e:
            print(f"Redis DELETE_PATTERN error: {e}")
            return 0
    
    def exists(self, key: str) -> bool:
        """Check if key exists"""
        try:
            return self.redis_client.exists(key) > 0
        except Exception as e:
            print(f"Redis EXISTS error: {e}")
            return False
    
    # JSON helpers
    def set_json(self, key: str, value: dict, expiry: int = 3600):
        """Store JSON data in Redis"""
        try:
            json_value = json.dumps(value)
            return self.set(key, json_value, expiry)
        except Exception as e:
            print(f"Redis SET_JSON error: {e}")
            return False
    
    def get_json(self, key: str) -> Optional[dict]:
        """Get JSON data from Redis"""
        try:
            value = self.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            print(f"Redis GET_JSON error: {e}")
            return None
    
    def ping(self) -> bool:
        """Check if Redis is connected"""
        try:
            return self.redis_client.ping()
        except Exception as e:
            print(f"Redis connection error: {e}")
            return False

redis_client = RedisClient()