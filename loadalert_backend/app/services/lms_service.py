import httpx
from bs4 import BeautifulSoup
import json
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class LMSService:
    BASE_URL = "https://lms.nust.edu.pk"
    LOGIN_URL = f"{BASE_URL}/login/index.php"
    AJAX_URL = f"{BASE_URL}/lib/ajax/service.php"

    def __init__(self):
        self.client = httpx.AsyncClient(
            base_url=self.BASE_URL,
            follow_redirects=True,
            timeout=30.0,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        )

    async def login(self, username, password) -> bool:
        """Logs into NUST LMS and returns True if successful."""
        try:
            # 1. Get the login page to grab the login token
            response = await self.client.get(self.LOGIN_URL)
            soup = BeautifulSoup(response.text, 'html.parser')
            login_token = soup.find('input', {'name': 'logintoken'})['value']

            # 2. Perform the actual login
            payload = {
                'username': username,
                'password': password,
                'logintoken': login_token
            }
            login_response = await self.client.post(self.LOGIN_URL, data=payload)

            # Check if login was successful (Moodle usually redirects to /my/ on success)
            if "login/index.php" not in str(login_response.url):
                logger.info(f"Successfully logged in as {username}")
                return True
            
            logger.warning(f"Login failed for {username}")
            return False
        except Exception as e:
            logger.error(f"Error during LMS login: {str(e)}")
            return False

    async def get_sesskey(self) -> Optional[str]:
        """Extracts the sesskey needed for AJAX calls from the dashboard."""
        try:
            response = await self.client.get(f"{self.BASE_URL}/my/")
            if '"sesskey":"' in response.text:
                return response.text.split('"sesskey":"')[1].split('"')[0]
            return None
        except Exception:
            return None

    async def get_user_full_name(self) -> Optional[str]:
        """Scrapes the user's full name from the portal profile header."""
        try:
            response = await self.client.get(f"{self.BASE_URL}/my/")
            soup = BeautifulSoup(response.text, 'html.parser')
            user_menu = soup.find('span', {'class': 'usertext'})
            if user_menu:
                return user_menu.text.strip()
            header = soup.find('div', {'class': 'usertext'})
            return header.text.strip() if header else "NUST Student"
        except Exception:
            return "NUST Student"

    async def fetch_deadlines(self, sesskey: str) -> List[Dict[str, Any]]:
        """Fetches upcoming deadlines from the Moodle Calendar API."""
        params = {
            'sesskey': sesskey,
            'info': 'core_calendar_get_action_events_by_timesort'
        }
        
        payload = [{
            "index": 0,
            "methodname": "core_calendar_get_action_events_by_timesort",
            "args": {
                "timesortfrom": 0,
                "limitnum": 50
            }
        }]

        try:
            response = await self.client.post(self.AJAX_URL, params=params, json=payload)
            data = response.json()
            events = data[0]['data']['events']
            return events
        except Exception as e:
            logger.error(f"Error fetching deadlines: {str(e)}")
            return []

    async def close(self):
        await self.client.aclose()

lms_service = LMSService()
