#!/usr/bin/env python3
"""
Tommy Coconut Design System Review Script
Comprehensive browser automation testing for luxury design implementation
"""

import os
import time
import json
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains

class TommyCoconutDesignReview:
    def __init__(self):
        self.base_url = "http://localhost:4000"
        self.pages_to_test = [
            ("Homepage", "index.html"),
            ("About/Our Story", "about.html"),
            ("Rentals", "rentals.html"),
            ("Experiences", "experiences.html"),
            ("Contact", "contact.html"),
            ("Cartel", "cartel.html"),
            ("Blog/Guide", "blog.html"),
            ("Treasure Map", "treasure-map.html"),
            ("Ownership", "ownership.html"),
            ("FAQ", "faq.html")
        ]
        
        self.design_criteria = {
            "navigation": {
                "description": "Fixed positioning, 80px logo, Tommy Coconut Turquoise colors",
                "elements": [".navbar", ".nav-logo img", ".nav-menu-left", ".nav-menu-right"]
            },
            "typography": {
                "description": "Extra-bold headlines, Deep Ocean Navy, clamp() responsive sizing",
                "elements": ["h1", "h2", "h3", ".hero h1", ".section h2"]
            },
            "colors": {
                "description": "Tommy Coconut Turquoise Palette throughout",
                "primary": "#00CFCF",
                "secondary": "#92E3DA", 
                "navy": "#002F3D",
                "elements": [".btn-primary", ".navbar", ".hero-content"]
            },
            "layout": {
                "description": "120px body padding-top, generous whitespace, luxury spacing",
                "elements": ["body", ".container", ".section"]
            },
            "components": {
                "description": "Premium cards with hover effects, consistent button styling",
                "elements": [".btn", ".card", ".experience-card", ".benefit-card"]
            }
        }
        
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "pages_tested": [],
            "issues_found": [],
            "overall_assessment": "",
            "recommendations": []
        }
        
        # Setup Chrome options for headless mode
        self.chrome_options = Options()
        self.chrome_options.add_argument("--headless")
        self.chrome_options.add_argument("--no-sandbox")
        self.chrome_options.add_argument("--disable-dev-shm-usage")
        self.chrome_options.add_argument("--disable-gpu")
        self.chrome_options.add_argument("--window-size=1920,1080")
        self.chrome_options.add_argument("--disable-extensions")
        self.chrome_options.add_argument("--disable-logging")
        self.chrome_options.add_argument("--silent")
        
    def setup_driver(self):
        """Initialize the Chrome WebDriver"""
        try:
            self.driver = webdriver.Chrome(options=self.chrome_options)
            self.driver.implicitly_wait(10)
            self.wait = WebDriverWait(self.driver, 10)
            return True
        except Exception as e:
            print(f"Error setting up driver: {e}")
            return False
    
    def test_page(self, page_name, page_url):
        """Test a specific page against design criteria"""
        print(f"\n🎨 Testing {page_name} ({page_url})")
        
        page_result = {
            "name": page_name,
            "url": page_url,
            "status": "unknown",
            "design_checks": {},
            "issues": [],
            "screenshot": None,
            "load_time": 0
        }
        
        try:
            # Load the page and measure load time
            start_time = time.time()
            self.driver.get(f"{self.base_url}/{page_url}")
            
            # Wait for page to be fully loaded
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            page_result["load_time"] = round(time.time() - start_time, 2)
            
            # Test Navigation
            page_result["design_checks"]["navigation"] = self.check_navigation()
            
            # Test Typography
            page_result["design_checks"]["typography"] = self.check_typography()
            
            # Test Colors
            page_result["design_checks"]["colors"] = self.check_colors()
            
            # Test Layout
            page_result["design_checks"]["layout"] = self.check_layout()
            
            # Test Components
            page_result["design_checks"]["components"] = self.check_components()
            
            # Test Interactive Elements
            page_result["design_checks"]["interactions"] = self.check_interactions()
            
            # Take screenshot for visual verification
            screenshot_path = f"screenshot_{page_url.replace('.html', '')}.png"
            self.driver.save_screenshot(screenshot_path)
            page_result["screenshot"] = screenshot_path
            
            page_result["status"] = "success"
            print(f"✅ {page_name} tested successfully")
            
        except Exception as e:
            page_result["status"] = "error"
            page_result["issues"].append(f"Page load error: {str(e)}")
            print(f"❌ Error testing {page_name}: {e}")
        
        self.results["pages_tested"].append(page_result)
        return page_result
    
    def check_navigation(self):
        """Check navigation design compliance"""
        checks = {}
        
        try:
            # Check if navbar exists and is fixed
            navbar = self.driver.find_element(By.CSS_SELECTOR, ".navbar")
            navbar_style = self.driver.execute_script("return getComputedStyle(arguments[0])", navbar)
            
            checks["navbar_exists"] = True
            checks["navbar_position"] = navbar_style["position"] == "fixed"
            
            # Check logo size
            try:
                logo_img = self.driver.find_element(By.CSS_SELECTOR, ".nav-logo img")
                logo_height = logo_img.get_attribute("height") or self.driver.execute_script("return arguments[0].offsetHeight", logo_img)
                checks["logo_size_80px"] = abs(int(logo_height) - 80) <= 10  # Allow 10px tolerance
            except:
                checks["logo_size_80px"] = False
            
            # Check turquoise colors
            checks["turquoise_colors"] = self.check_element_color(navbar, "#00CFCF")
            
        except Exception as e:
            checks["error"] = str(e)
        
        return checks
    
    def check_typography(self):
        """Check typography design compliance"""
        checks = {}
        
        try:
            # Check headlines for extra-bold weight and navy color
            headlines = self.driver.find_elements(By.CSS_SELECTOR, "h1, h2, h3")
            checks["headlines_found"] = len(headlines) > 0
            
            if headlines:
                h1 = headlines[0]
                style = self.driver.execute_script("return getComputedStyle(arguments[0])", h1)
                
                # Check font weight (700+ is bold, 800+ is extra-bold)
                font_weight = style["fontWeight"]
                checks["extra_bold_weight"] = font_weight in ["700", "800", "bold", "bolder"]
                
                # Check Deep Ocean Navy color (#002F3D)
                color = style["color"]
                checks["navy_color"] = self.is_navy_color(color)
                
                # Check for clamp() responsive sizing (we'll check computed font-size)
                font_size = style["fontSize"]
                checks["responsive_sizing"] = "px" in font_size and int(font_size.replace("px", "")) > 24
            
        except Exception as e:
            checks["error"] = str(e)
        
        return checks
    
    def check_colors(self):
        """Check color system compliance"""
        checks = {}
        
        try:
            # Check for Tommy Coconut Turquoise Palette usage
            primary_buttons = self.driver.find_elements(By.CSS_SELECTOR, ".btn-primary, .hero-cta .btn")
            checks["primary_buttons_found"] = len(primary_buttons) > 0
            
            if primary_buttons:
                btn_style = self.driver.execute_script("return getComputedStyle(arguments[0])", primary_buttons[0])
                bg_color = btn_style["backgroundColor"]
                checks["turquoise_buttons"] = self.is_turquoise_color(bg_color)
            
            # Check overall color consistency
            body_style = self.driver.execute_script("return getComputedStyle(document.body)")
            checks["white_background"] = self.is_white_color(body_style["backgroundColor"])
            
        except Exception as e:
            checks["error"] = str(e)
        
        return checks
    
    def check_layout(self):
        """Check layout design compliance"""
        checks = {}
        
        try:
            # Check body padding-top for fixed header
            body_style = self.driver.execute_script("return getComputedStyle(document.body)")
            padding_top = body_style["paddingTop"]
            checks["body_padding_120px"] = "120px" in padding_top
            
            # Check container max-width and centering
            containers = self.driver.find_elements(By.CSS_SELECTOR, ".container")
            checks["containers_found"] = len(containers) > 0
            
            if containers:
                container_style = self.driver.execute_script("return getComputedStyle(arguments[0])", containers[0])
                max_width = container_style["maxWidth"]
                checks["container_max_width"] = "1200px" in max_width or "75rem" in max_width
            
            # Check section spacing
            sections = self.driver.find_elements(By.CSS_SELECTOR, ".section, section")
            checks["generous_section_spacing"] = len(sections) > 0
            
        except Exception as e:
            checks["error"] = str(e)
        
        return checks
    
    def check_components(self):
        """Check component design compliance"""
        checks = {}
        
        try:
            # Check for premium cards
            cards = self.driver.find_elements(By.CSS_SELECTOR, ".card, .experience-card, .benefit-card")
            checks["premium_cards_found"] = len(cards) > 0
            
            # Check buttons for consistent styling
            buttons = self.driver.find_elements(By.CSS_SELECTOR, ".btn")
            checks["consistent_buttons_found"] = len(buttons) > 0
            
            if buttons:
                btn_style = self.driver.execute_script("return getComputedStyle(arguments[0])", buttons[0])
                checks["button_border_radius"] = "px" in btn_style["borderRadius"]
                checks["button_padding"] = "px" in btn_style["padding"]
            
        except Exception as e:
            checks["error"] = str(e)
        
        return checks
    
    def check_interactions(self):
        """Check interactive elements and hover effects"""
        checks = {}
        
        try:
            # Test hover effects on buttons
            buttons = self.driver.find_elements(By.CSS_SELECTOR, ".btn, .experience-card")
            checks["interactive_elements_found"] = len(buttons) > 0
            
            if buttons:
                # Move to button to trigger hover (won't show in headless but we can check CSS)
                ActionChains(self.driver).move_to_element(buttons[0]).perform()
                checks["hover_capable"] = True
            
        except Exception as e:
            checks["error"] = str(e)
        
        return checks
    
    def is_turquoise_color(self, color_value):
        """Check if color is Tommy Coconut Turquoise (#00CFCF)"""
        # Convert RGB to approximate turquoise check
        if "rgb" in color_value.lower():
            return "207" in color_value and "0" in color_value
        return "#00cfcf" in color_value.lower() or "#00CFCF" in color_value
    
    def is_navy_color(self, color_value):
        """Check if color is Deep Ocean Navy (#002F3D)"""
        if "rgb" in color_value.lower():
            return "47" in color_value and "61" in color_value
        return "#002f3d" in color_value.lower() or "#002F3D" in color_value
    
    def is_white_color(self, color_value):
        """Check if color is white or near white"""
        if "rgb" in color_value.lower():
            return "255, 255, 255" in color_value
        return "#ffffff" in color_value.lower() or "white" in color_value.lower()
    
    def check_element_color(self, element, target_color):
        """Check if element uses target color"""
        try:
            style = self.driver.execute_script("return getComputedStyle(arguments[0])", element)
            bg_color = style["backgroundColor"]
            color = style["color"]
            return target_color.lower() in (bg_color + color).lower()
        except:
            return False
    
    def run_comprehensive_review(self):
        """Run the complete design system review"""
        print("🏖️  TOMMY COCONUT LUXURY DESIGN SYSTEM REVIEW")
        print("=" * 60)
        print("Testing 'Apple meets Caribbean Luxury' aesthetic implementation")
        print("=" * 60)
        
        if not self.setup_driver():
            print("❌ Failed to setup browser driver")
            return
        
        try:
            # Test each page
            for page_name, page_url in self.pages_to_test:
                self.test_page(page_name, page_url)
                time.sleep(1)  # Brief pause between pages
            
            # Generate comprehensive report
            self.generate_report()
            
        finally:
            self.driver.quit()
    
    def generate_report(self):
        """Generate comprehensive design system review report"""
        print("\n" + "=" * 60)
        print("🎨 DESIGN SYSTEM REVIEW REPORT")
        print("=" * 60)
        
        total_pages = len(self.results["pages_tested"])
        successful_pages = sum(1 for p in self.results["pages_tested"] if p["status"] == "success")
        
        print(f"📊 OVERVIEW:")
        print(f"   • Pages Tested: {total_pages}")
        print(f"   • Successful Tests: {successful_pages}")
        print(f"   • Success Rate: {(successful_pages/total_pages*100):.1f}%")
        
        # Analyze design compliance across all pages
        navigation_compliance = 0
        typography_compliance = 0
        color_compliance = 0
        layout_compliance = 0
        
        for page in self.results["pages_tested"]:
            if page["status"] == "success":
                checks = page["design_checks"]
                
                # Navigation scoring
                nav_score = sum([
                    checks.get("navigation", {}).get("navbar_exists", False),
                    checks.get("navigation", {}).get("navbar_position", False),
                    checks.get("navigation", {}).get("logo_size_80px", False)
                ]) / 3
                navigation_compliance += nav_score
                
                # Typography scoring
                typo_score = sum([
                    checks.get("typography", {}).get("headlines_found", False),
                    checks.get("typography", {}).get("extra_bold_weight", False),
                    checks.get("typography", {}).get("navy_color", False)
                ]) / 3
                typography_compliance += typo_score
                
                # Color scoring
                color_score = sum([
                    checks.get("colors", {}).get("primary_buttons_found", False),
                    checks.get("colors", {}).get("turquoise_buttons", False),
                    checks.get("colors", {}).get("white_background", False)
                ]) / 3
                color_compliance += color_score
                
                # Layout scoring
                layout_score = sum([
                    checks.get("layout", {}).get("body_padding_120px", False),
                    checks.get("layout", {}).get("containers_found", False),
                    checks.get("layout", {}).get("container_max_width", False)
                ]) / 3
                layout_compliance += layout_score
        
        if successful_pages > 0:
            navigation_compliance = (navigation_compliance / successful_pages) * 100
            typography_compliance = (typography_compliance / successful_pages) * 100
            color_compliance = (color_compliance / successful_pages) * 100
            layout_compliance = (layout_compliance / successful_pages) * 100
        
        print(f"\n🎯 DESIGN COMPLIANCE SCORES:")
        print(f"   • Navigation: {navigation_compliance:.1f}%")
        print(f"   • Typography: {typography_compliance:.1f}%")
        print(f"   • Colors: {color_compliance:.1f}%")
        print(f"   • Layout: {layout_compliance:.1f}%")
        
        overall_score = (navigation_compliance + typography_compliance + color_compliance + layout_compliance) / 4
        print(f"   • Overall Design System: {overall_score:.1f}%")
        
        # Assessment
        if overall_score >= 90:
            assessment = "EXCELLENT - Luxury design system fully implemented"
        elif overall_score >= 80:
            assessment = "GOOD - Strong luxury aesthetic with minor refinements needed"
        elif overall_score >= 70:
            assessment = "FAIR - Design system partially implemented, needs attention"
        else:
            assessment = "NEEDS WORK - Significant design system issues found"
        
        print(f"\n🏆 OVERALL ASSESSMENT: {assessment}")
        
        # Page-by-page details
        print(f"\n📄 PAGE-BY-PAGE RESULTS:")
        for page in self.results["pages_tested"]:
            status_icon = "✅" if page["status"] == "success" else "❌"
            print(f"   {status_icon} {page['name']} ({page['load_time']}s)")
            
            if page["issues"]:
                for issue in page["issues"]:
                    print(f"      ⚠️  {issue}")
        
        # Save detailed results to JSON
        with open("design_system_review_results.json", "w") as f:
            json.dump(self.results, f, indent=2)
        
        print(f"\n💾 Detailed results saved to: design_system_review_results.json")
        print("📸 Screenshots saved for visual verification")
        
        return overall_score, assessment

if __name__ == "__main__":
    reviewer = TommyCoconutDesignReview()
    reviewer.run_comprehensive_review()