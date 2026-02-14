#!/usr/bin/env python3
"""
Backend API Testing for Toothless Discord Bot Dashboard
Tests all required API endpoints from the review request
"""

import requests
import json
import sys
from datetime import datetime
import os

class ToothlessAPITester:
    def __init__(self):
        self.base_url = "https://dragon-trainer-bot.preview.emergentagent.com"
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "name": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        print(f"{status} - {name}")
        if details:
            print(f"    {details}")
        
    def test_health_endpoint(self):
        """Test GET /api/health - should return status healthy"""
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("Health Check", True, f"Status: {data.get('status')}, Service: {data.get('service')}")
                    return True
                else:
                    self.log_test("Health Check", False, f"Expected 'healthy', got: {data.get('status')}")
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
        return False
    
    def test_bot_info_endpoint(self):
        """Test GET /api/bot/info - should return bot info with commands"""
        try:
            response = self.session.get(f"{self.base_url}/api/bot/info", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["name", "guilds", "users", "commands", "commandCategories"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    commands_count = data.get("commands", 0)
                    categories = data.get("commandCategories", {})
                    self.log_test("Bot Info", True, f"Bot: {data.get('name')}, Commands: {commands_count}, Categories: {len(categories)}")
                    return True
                else:
                    self.log_test("Bot Info", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("Bot Info", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Bot Info", False, f"Exception: {str(e)}")
        return False
    
    def test_discord_auth_endpoint(self):
        """Test GET /api/auth/discord - should return OAuth URL"""
        try:
            response = self.session.get(f"{self.base_url}/api/auth/discord", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                auth_url = data.get("url", "")
                
                if auth_url and "discord.com/api/oauth2/authorize" in auth_url:
                    self.log_test("Discord Auth URL", True, f"URL received (length: {len(auth_url)})")
                    return True
                else:
                    self.log_test("Discord Auth URL", False, f"Invalid or missing URL: {auth_url}")
            else:
                self.log_test("Discord Auth URL", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Discord Auth URL", False, f"Exception: {str(e)}")
        return False
    
    def test_guild_endpoint(self):
        """Test GET /api/guild/{id} - should return server data"""
        test_guild_id = "123456789"  # Demo guild ID
        try:
            response = self.session.get(f"{self.base_url}/api/guild/{test_guild_id}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["id", "name", "memberCount", "channels", "roles", "categories", "settings"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    channels = len(data.get("channels", []))
                    roles = len(data.get("roles", []))
                    self.log_test("Guild Data", True, f"Guild: {data.get('name')}, Channels: {channels}, Roles: {roles}")
                    return True
                else:
                    self.log_test("Guild Data", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("Guild Data", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Guild Data", False, f"Exception: {str(e)}")
        return False
    
    def test_welcomer_save_endpoint(self):
        """Test POST /api/guild/{id}/welcomer - should save configuration"""
        test_guild_id = "123456789"
        test_data = {
            "enabled": True,
            "channelId": "test_channel_123",
            "message": "Benvenuto {user} nel server {server}!",
            "roleId": "test_role_456"
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/guild/{test_guild_id}/welcomer", 
                json=test_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "data" in data:
                    saved_data = data.get("data")
                    if saved_data.get("enabled") == test_data["enabled"]:
                        self.log_test("Welcomer Save", True, "Configuration saved successfully")
                        return True
                    else:
                        self.log_test("Welcomer Save", False, f"Data mismatch in response: {saved_data}")
                else:
                    self.log_test("Welcomer Save", False, f"Unexpected response format: {data}")
            else:
                self.log_test("Welcomer Save", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Welcomer Save", False, f"Exception: {str(e)}")
        return False
    
    def test_bot_invite_endpoint(self):
        """Test GET /api/bot/invite - should return bot invite URL"""
        try:
            response = self.session.get(f"{self.base_url}/api/bot/invite", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                invite_url = data.get("url", "")
                
                if invite_url and "discord.com/api/oauth2/authorize" in invite_url:
                    self.log_test("Bot Invite URL", True, "Invite URL generated successfully")
                    return True
                else:
                    self.log_test("Bot Invite URL", False, f"Invalid invite URL: {invite_url}")
            else:
                self.log_test("Bot Invite URL", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Bot Invite URL", False, f"Exception: {str(e)}")
        return False
    
    def test_additional_guild_endpoints(self):
        """Test additional guild configuration endpoints"""
        test_guild_id = "123456789"
        
        # Test log settings
        log_data = {"enabled": True, "channelId": "log_channel_123"}
        try:
            response = self.session.post(f"{self.base_url}/api/guild/{test_guild_id}/log", json=log_data, timeout=10)
            success = response.status_code == 200 and response.json().get("success")
            self.log_test("Log Settings Save", success, f"HTTP {response.status_code}" if not success else "Saved successfully")
        except Exception as e:
            self.log_test("Log Settings Save", False, f"Exception: {str(e)}")
        
        # Test ticket settings
        ticket_data = {"enabled": True, "categoryId": "ticket_cat_123", "supportRoleId": "support_role_456"}
        try:
            response = self.session.post(f"{self.base_url}/api/guild/{test_guild_id}/tickets", json=ticket_data, timeout=10)
            success = response.status_code == 200 and response.json().get("success")
            self.log_test("Ticket Settings Save", success, f"HTTP {response.status_code}" if not success else "Saved successfully")
        except Exception as e:
            self.log_test("Ticket Settings Save", False, f"Exception: {str(e)}")
        
        # Test level settings
        level_data = {"enabled": True, "announceChannelId": "level_channel_123", "xpPerMessage": {"min": 15, "max": 25}}
        try:
            response = self.session.post(f"{self.base_url}/api/guild/{test_guild_id}/levels", json=level_data, timeout=10)
            success = response.status_code == 200 and response.json().get("success")
            self.log_test("Level Settings Save", success, f"HTTP {response.status_code}" if not success else "Saved successfully")
        except Exception as e:
            self.log_test("Level Settings Save", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all API tests"""
        print("=" * 60)
        print("🐉 TOOTHLESS API TESTING")
        print("=" * 60)
        print(f"Testing against: {self.base_url}")
        print()
        
        # Run all required tests from the review request
        self.test_health_endpoint()
        self.test_bot_info_endpoint()
        self.test_discord_auth_endpoint()
        self.test_guild_endpoint()
        self.test_welcomer_save_endpoint()
        
        # Run additional API tests
        self.test_bot_invite_endpoint()
        self.test_additional_guild_endpoints()
        
        # Print final results
        print()
        print("=" * 60)
        print("📊 FINAL RESULTS")
        print("=" * 60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        print("=" * 60)
        
        return self.tests_passed == self.tests_run

def main():
    """Main function"""
    tester = ToothlessAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    results = {
        "timestamp": datetime.now().isoformat(),
        "tests_run": tester.tests_run,
        "tests_passed": tester.tests_passed,
        "success_rate": (tester.tests_passed/tester.tests_run)*100,
        "test_results": tester.test_results
    }
    
    with open("/app/backend_test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())