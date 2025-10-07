from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the rosters page
        page.goto("http://localhost:8000/rosters/rosters.html", wait_until="networkidle")

        # Input username
        username_input = page.locator("#usernameInput")
        expect(username_input).to_be_visible()
        username_input.fill("the_oracle")

        # Click the rosters button to load leagues
        rosters_button = page.locator("#menu-rosters")
        expect(rosters_button).to_be_visible()
        rosters_button.click()

        # Wait for the league select to be populated and enabled
        league_select = page.locator("#leagueSelect")
        expect(league_select).to_be_enabled(timeout=30000)

        # Select the first league
        options = page.locator("#leagueSelect option")
        first_option_value = options.nth(1).get_attribute("value")
        if first_option_value:
            league_select.select_option(first_option_value)

        # Wait for the roster grid to be populated
        expect(page.locator(".roster-column")).to_have_count(12, timeout=30000)

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/rosters_page.png")
        print("Screenshot taken successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)