from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 375, "height": 812}) # Mobile viewport
    page = context.new_page()

    try:
        # Navigate to the rosters page with username in query params to trigger auto-load
        page.goto("http://localhost:8084/rosters/rosters.html?username=the_oracle", timeout=30000)

        # Wait for the league select to be populated as a sign that the initial fetch worked.
        league_select = page.locator("#leagueSelect")
        expect(league_select).to_be_visible(timeout=20000)

        # Wait for options to be populated using a JS function
        page.wait_for_function("document.querySelectorAll('#leagueSelect option').length > 1", timeout=20000)

        # Select the first available league
        league_select.select_option(index=1)

        # Wait for the roster grid to be populated with team data
        roster_grid = page.locator("#rosterGrid")
        expect(roster_grid.locator(".roster-column").first).to_be_visible(timeout=30000)

        # Ensure the new header is visible
        expect(page.locator(".app-header")).to_be_visible()

        # Give a little time for images to load
        page.wait_for_timeout(1000)

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/rosters_page_verification.png")

        print("Verification script completed successfully.")

    except Exception as e:
        print(f"An error occurred during verification: {e}")
        page.screenshot(path="jules-scratch/verification/rosters_page_error.png")
        raise

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)