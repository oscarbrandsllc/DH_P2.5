from playwright.sync_api import sync_playwright, expect
import os
import time

def run_verification(playwright):
    # Get the absolute path to the HTML file
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    rosters_page_path = os.path.join(base_path, 'DH_P2.53', 'rosters', 'rosters.html')

    if not os.path.exists(rosters_page_path):
        raise FileNotFoundError(f"Could not find rosters.html at {rosters_page_path}")

    rosters_page_url = f'file://{rosters_page_path}'

    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto(rosters_page_url, wait_until='domcontentloaded')

        username_input = page.locator("#usernameInput")
        expect(username_input).to_be_visible(timeout=10000)

        # Explicitly fill the username input
        username_input.fill("The_Oracle")

        rosters_button = page.locator("#fetchRostersButton")
        rosters_button.click()

        league_select = page.locator("#leagueSelect")
        expect(league_select).to_be_enabled(timeout=20000)

        # Wait for league options to be populated by polling the count
        start_time = time.time()
        while page.locator("#leagueSelect option").count() <= 1:
            if time.time() - start_time > 20: # 20 second timeout
                raise TimeoutError("Timed out waiting for league options to load.")
            page.wait_for_timeout(100) # wait 100ms before checking again

        league_select.select_option(index=1)

        # Wait for player cards to appear inside the roster grid
        expect(page.locator("#rosterGrid .player-row").first).to_be_visible(timeout=20000)

        # Click on the first player in the RB section to increase chances of finding game logs
        rb_player_name = page.locator(".rb-section .player-name-clickable").first
        if rb_player_name.count() > 0:
            rb_player_name.click()
        else:
            # Fallback to the first player if no RB is found
            page.locator("#rosterGrid .player-name-clickable").first.click()

        game_logs_modal = page.locator("#game-logs-modal")
        expect(game_logs_modal).not_to_have_class("hidden", timeout=10000)

        modal_content = game_logs_modal.locator(".modal-content")
        expect(modal_content).to_be_visible()

        page.wait_for_timeout(1000) # Wait for animations/rendering

        screenshot_path = os.path.join(os.path.dirname(__file__), "verification.png")
        modal_content.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path=os.path.join(os.path.dirname(__file__), "error_screenshot.png"))
        raise

    finally:
        browser.close()

if __name__ == "__main__":
    with sync_playwright() as p:
        run_verification(p)