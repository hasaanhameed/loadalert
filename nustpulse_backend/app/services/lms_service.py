import httpx
from bs4 import BeautifulSoup
import logging
import time
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)


class LMSSession:
    """
    A per-request LMS session that creates a fresh httpx client.
    This avoids the stale-cookie problem caused by the singleton pattern,
    where the shared client is already 'logged in' and /login/index.php
    no longer returns a logintoken form field.
    """

    BASE_URL = "https://lms.nust.edu.pk/portal"
    LOGIN_URL = f"{BASE_URL}/login/index.php"
    AJAX_URL  = f"{BASE_URL}/lib/ajax/service.php"

    def __init__(self):
        self.client = httpx.AsyncClient(
            follow_redirects=True,
            verify=False,
            timeout=30.0,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                )
            },
        )

    async def login(self, username: str, password: str) -> bool:
        """Logs into NUST LMS and returns True if successful."""
        try:
            # 1. Fetch fresh login page to obtain the CSRF logintoken
            response = await self.client.get(self.LOGIN_URL)
            logger.info(f"Initial LMS GET Status: {response.status_code}")

            soup = BeautifulSoup(response.text, "html.parser")
            token_element = soup.find("input", {"name": "logintoken"})
            if not token_element:
                logger.error(
                    f"Could not find login token on NUST LMS page. "
                    f"Status: {response.status_code}"
                )
                return False

            login_token = token_element["value"]
            logger.info(f"Retrieved login token for {username}")

            # 2. Submit credentials
            payload = {
                "username": username,
                "password": password,
                "logintoken": login_token,
            }
            login_response = await self.client.post(self.LOGIN_URL, data=payload)

            # Detect explicit rejection
            final_url = str(login_response.url)
            if "login/index.php" in final_url and (
                "error=" in login_response.text
                or "Invalid login" in login_response.text
            ):
                logger.warning(f"LMS login rejected credentials for {username}")
                return False

            # Success: redirected away from login page OR session cookie present
            if login_response.status_code in [200, 302, 303]:
                if "login/index.php" not in final_url or "MoodleSession" in str(
                    self.client.cookies
                ):
                    logger.info(f"Successfully authenticated {username} with NustPulse")
                    return True

            logger.warning(
                f"Login failed for {username} - Final URL: {login_response.url} "
                f"- Status: {login_response.status_code}"
            )
            return False

        except Exception as e:
            logger.error(f"Critical error during LMS login: {str(e)}")
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

    async def get_user_full_name(self) -> str:
        """
        Gets the authenticated user's full name.

        Strategy (most reliable first):
        1. Moodle AJAX API — core_webservice_get_site_info returns `fullname`
           directly; this works regardless of the Moodle theme in use.
        2. HTML scraping with multiple selectors covering common Moodle themes
           (NUST's theme does not use the standard `.usertext` span).
        """
        # ── Strategy 1: Moodle AJAX API ──────────────────────────────────────
        try:
            sesskey = await self.get_sesskey()
            if sesskey:
                params  = {"sesskey": sesskey, "info": "core_webservice_get_site_info"}
                payload = [{"index": 0, "methodname": "core_webservice_get_site_info", "args": {}}]
                resp = await self.client.post(self.AJAX_URL, params=params, json=payload)
                data = resp.json()
                fullname = data[0].get("data", {}).get("fullname", "")
                if fullname:
                    logger.info(f"Got full name from Moodle API: {fullname}")
                    return fullname.strip()
        except Exception as e:
            logger.warning(f"Moodle API name fetch failed, falling back to HTML scrape: {e}")

        # ── Strategy 2: HTML scraping ─────────────────────────────────────────
        try:
            response = await self.client.get(f"{self.BASE_URL}/my/")
            soup = BeautifulSoup(response.text, "html.parser")

            # Try selectors in order of likelihood for NUST / generic Moodle themes
            selectors = [
                ("span",  {"class": "usertext"}),        # Boost / Clean theme
                ("div",   {"class": "usertext"}),
                ("span",  {"class": "username"}),
                ("h1",    {}),                            # Profile page heading
                ("div",   {"class": "page-header-headings"}),  # Some Moodle themes
            ]
            for tag, attrs in selectors:
                el = soup.find(tag, attrs) if attrs else soup.find(tag)
                if el and el.text.strip():
                    name = el.text.strip()
                    logger.info(f"Got full name from HTML ({tag}.{attrs}): {name}")
                    return name

        except Exception as e:
            logger.warning(f"HTML name scrape failed: {e}")

        return "NUST Student"

    async def get_calendar_events(self, sesskey: str) -> List[Dict[str, Any]]:
        """
        Fetches upcoming events from the Moodle Calendar AJAX API.
        Uses timesortfrom ~24 h ago so near-due items are still included.
        """
        params = {
            "sesskey": sesskey,
            "info": "core_calendar_get_action_events_by_timesort",
        }
        payload = [
            {
                "index": 0,
                "methodname": "core_calendar_get_action_events_by_timesort",
                "args": {
                    "timesortfrom": int(time.time()) - 86400,
                    "limitnum": 50,
                },
            }
        ]

        try:
            response = await self.client.post(
                self.AJAX_URL, params=params, json=payload
            )
            data = response.json()
            events = data[0]["data"]["events"]
            logger.info(f"Fetched {len(events)} raw events from LMS calendar")
            return events
        except Exception as e:
            logger.error(f"Error fetching calendar events: {str(e)}")
            return []

    async def close(self):
        await self.client.aclose()


# ---------------------------------------------------------------------------
# Backward-compatible singleton shim used by auth_service for standalone
# credential validation (no session state required after that call).
# ---------------------------------------------------------------------------
class _LMSServiceShim:
    async def login(self, username: str, password: str) -> bool:
        session = LMSSession()
        try:
            return await session.login(username, password)
        finally:
            await session.close()

    async def get_user_full_name(self) -> str:
        return "NUST Student"


lms_service = _LMSServiceShim()
