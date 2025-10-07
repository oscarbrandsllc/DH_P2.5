// === Legend hard-hide helper ===
function hideLegend(){ try{ document.getElementById('legend-section')?.classList.add('hidden'); }catch(e){} }
function showLegend(){ try{ document.getElementById('legend-section')?.classList.remove('hidden'); }catch(e){} }


        // --- DOM Elements ---
        const usernameInput = document.getElementById('usernameInput');
        const fetchRostersButton = document.getElementById('fetchRostersButton');
        const fetchOwnershipButton = document.getElementById('fetchOwnershipButton');
        const leagueSelect = document.getElementById('leagueSelect');
        const contextualControls = document.getElementById('contextual-controls');
        const rosterControls = document.getElementById('rosterControls');
        const loadingIndicator = document.getElementById('loading');
        const welcomeScreen = document.getElementById('welcome-screen');
        const rosterView = document.getElementById('rosterView');
        const playerListView = document.getElementById('playerListView');
        const rosterContainer = document.getElementById('rosterContainer');
        const rosterGrid = document.getElementById('rosterGrid');
        const rosterContentVisibilityQuery = (typeof window !== 'undefined' && typeof window.matchMedia === 'function')
            ? window.matchMedia('(max-width: 819px)')
            : null;
        let rosterContentVisibilityEnabled = false;
        const compareButton = document.getElementById('compareButton');
        const compareSearchToggle  = document.getElementById('compareSearchToggle');
        const compareSearchPopover = document.getElementById('compareSearchPopover');
        const compareSearchInput   = document.getElementById('compareSearchInput');
        const compareSearchClose   = document.getElementById('compareSearchClose');
        const positionalViewBtn = document.getElementById('positionalViewBtn');
        const depthChartViewBtn = document.getElementById('depthChartViewBtn');
        const viewControls = document.getElementById('view-controls');
        const positionalFiltersContainer = document.getElementById('positional-filters');
        const clearFiltersButton = document.getElementById('clearFiltersButton');
        const tradeSimulator = document.getElementById('tradeSimulator');
        const mainContent = document.getElementById('content');
        const pageType = document.body.dataset.page || 'welcome';
        const researchButton = document.getElementById('researchButton');
        const headerQuickLinks = document.getElementById('header-quick-links');
        const analyzerButtonSlot = document.getElementById('analyzer-button-slot');
        const researchButtonSlot = document.getElementById('research-button-slot');
        const analyzerButtonContainer = analyzerButtonSlot?.querySelector('.analyzer-button-container') || null;
        const researchButtonContainer = researchButtonSlot?.querySelector('.research-button-container') || null;

        const gameLogsModal = document.getElementById('game-logs-modal');
        const modalCloseBtn = document.querySelector('.modal-close-btn');
        const modalInfoBtn = document.querySelector('.modal-info-btn');
        const statsKeyContainer = document.getElementById('stats-key-container');
        const modalOverlay = document.querySelector('.modal-overlay');
        const modalPlayerName = document.getElementById('modal-player-name');
        const modalPlayerVitals = document.getElementById('modal-player-vitals');
        const modalBody = document.getElementById('modal-body');
        const playerComparisonModal = document.getElementById('player-comparison-modal');
        const comparisonBackgroundOverlay = document.getElementById('comparison-modal-background-overlay');
        const supportsContentVisibility = typeof CSS !== 'undefined'
            && typeof CSS.supports === 'function'
            && CSS.supports('content-visibility', 'auto');

        function updateRosterContentVisibility() {
            if (!supportsContentVisibility || !rosterGrid) {
                rosterContentVisibilityEnabled = false;
                rosterGrid?.classList.remove('roster-cv-enabled');
                return;
            }
            const shouldEnable = rosterContentVisibilityQuery ? rosterContentVisibilityQuery.matches : false;
            rosterContentVisibilityEnabled = shouldEnable;
            rosterGrid.classList.toggle('roster-cv-enabled', shouldEnable);
        }

        if (supportsContentVisibility) {
            updateRosterContentVisibility();
            if (rosterContentVisibilityQuery) {
                const cvListener = () => updateRosterContentVisibility();
                if (typeof rosterContentVisibilityQuery.addEventListener === 'function') {
                    rosterContentVisibilityQuery.addEventListener('change', cvListener);
                } else if (typeof rosterContentVisibilityQuery.addListener === 'function') {
                    rosterContentVisibilityQuery.addListener(cvListener);
                }
            }
        }

        const COMPARE_BUTTON_PREVIEW_HTML = '<span class="button-text">Preview</span>';
        const COMPARE_BUTTON_SHOW_ALL_HTML = '<span class="compare-show-all-stack"><i aria-hidden="true" class="fa-solid fa-arrows-left-right-to-line compare-show-all-icon"></i><span class="compare-show-all-label">Show All</span></span>';

        if (compareButton) {
            compareButton.innerHTML = COMPARE_BUTTON_PREVIEW_HTML;
        }

        // --- Menu Button ---
        const menuButton = document.getElementById('menu-button');
        const dropdownMenu = document.getElementById('dropdown-menu');
        const menuRosters = document.getElementById('menu-rosters');
        const menuOwnership = document.getElementById('menu-ownership');
        const menuAnalyzer = document.getElementById('menu-analyzer');
        const menuResearch = document.getElementById('menu-research');
        const analyzeLeagueButton = document.getElementById('analyzeLeagueButton');
        const resolveResearchUrl = () => {
            const username = usernameInput.value.trim();
            const suffix = username ? `?username=${encodeURIComponent(username)}` : '';
            if (pageType === 'welcome') {
                return `research/research.html${suffix}`;
            }
            if (pageType === 'research') {
                return `research/research.html${suffix}`;
            }
            return `../research/research.html${suffix}`;
        };

        menuButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (dropdownMenu && !dropdownMenu.classList.contains('hidden') && !menuButton.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
            }
        });

        menuRosters?.addEventListener('click', () => {
            const username = usernameInput.value.trim();
            if (!username) return;
            if (pageType === 'rosters') {
                handleFetchRosters();
            } else {
                let url = pageType === 'welcome'
                    ? `rosters/rosters.html?username=${encodeURIComponent(username)}`
                    : `../rosters/rosters.html?username=${encodeURIComponent(username)}`;
                const selected = leagueSelect?.value;
                if (selected && selected !== 'Select a league...') {
                    url += `&leagueId=${selected}`;
                } else if (state.currentLeagueId) {
                    url += `&leagueId=${state.currentLeagueId}`;
                }
                window.location.href = url;
            }
            dropdownMenu.classList.add('hidden');
        });

        menuAnalyzer?.addEventListener('click', () => {
            const username = usernameInput.value.trim();
            if (!username) return;
            let url = pageType === 'welcome'
                ? `analyzer/analyzer.html?username=${encodeURIComponent(username)}`
                : `../analyzer/analyzer.html?username=${encodeURIComponent(username)}`;
            const selected = leagueSelect?.value || state.currentLeagueId;
            if (selected && selected !== 'Select a league...') {
                url += `&leagueId=${selected}`;
            }
            window.location.href = url;
            dropdownMenu.classList.add('hidden');
        });

        analyzeLeagueButton?.addEventListener('click', () => {
            const username = usernameInput.value.trim();
            if (!username || !state.currentLeagueId) return;
            window.location.href = `../analyzer/analyzer.html?username=${encodeURIComponent(username)}&leagueId=${state.currentLeagueId}`;
        });

        menuOwnership?.addEventListener('click', () => {
            const username = usernameInput.value.trim();
            if (!username) return;
            if (pageType === 'ownership') {
                handleFetchOwnership();
            } else {
                let url = pageType === 'welcome'
                    ? `ownership/ownership.html?username=${encodeURIComponent(username)}`
                    : `../ownership/ownership.html?username=${encodeURIComponent(username)}`;
                const selected = leagueSelect?.value;
                if (selected && selected !== 'Select a league...') {
                    url += `&leagueId=${selected}`;
                } else if (state.currentLeagueId) {
                    url += `&leagueId=${state.currentLeagueId}`;
                }
                window.location.href = url;
            }
            dropdownMenu.classList.add('hidden');
        });

        menuResearch?.addEventListener('click', () => {
            if (pageType === 'research') {
                dropdownMenu.classList.add('hidden');
                return;
            }
            const url = resolveResearchUrl();
            window.location.href = url;
            dropdownMenu.classList.add('hidden');
        });

        researchButton?.addEventListener('click', () => {
            if (pageType === 'research') {
                return;
            }
            const url = resolveResearchUrl();
            window.location.href = url;
        });

        if (headerQuickLinks && analyzerButtonSlot && researchButtonSlot && analyzerButtonContainer && researchButtonContainer) {
            const quickLinksQuery = window.matchMedia('(min-width: 1024px)');
            const placeQuickLinks = (isDesktop) => {
                if (isDesktop) {
                    if (!headerQuickLinks.contains(researchButtonContainer)) {
                        headerQuickLinks.appendChild(researchButtonContainer);
                    }
                    if (!headerQuickLinks.contains(analyzerButtonContainer)) {
                        headerQuickLinks.appendChild(analyzerButtonContainer);
                    }
                } else {
                    if (!analyzerButtonSlot.contains(analyzerButtonContainer)) {
                        analyzerButtonSlot.appendChild(analyzerButtonContainer);
                    }
                    if (!researchButtonSlot.contains(researchButtonContainer)) {
                        researchButtonSlot.appendChild(researchButtonContainer);
                    }
                }
            };

            placeQuickLinks(quickLinksQuery.matches);
            const quickLinksListener = (event) => placeQuickLinks(event.matches);
            if (typeof quickLinksQuery.addEventListener === 'function') {
                quickLinksQuery.addEventListener('change', quickLinksListener);
            } else if (typeof quickLinksQuery.addListener === 'function') {
                quickLinksQuery.addListener(quickLinksListener);
            }
        }

        // --- State ---
        let state = { userId: null, leagues: [], players: {}, oneQbData: {}, sflxData: {}, currentLeagueId: null, isSuperflex: false, cache: {}, teamsToCompare: new Set(), isCompareMode: false, currentRosterView: 'positional', activePositions: new Set(), tradeBlock: {}, isTradeCollapsed: false, weeklyStats: {}, playerSeasonStats: {}, playerSeasonRanks: {}, playerWeeklyStats: {}, statsSheetsLoaded: false, seasonRankCache: null, isGameLogModalOpenFromComparison: false, liveWeeklyStats: {}, liveStatsLoaded: false, currentNflSeason: null, currentNflWeek: null, calculatedRankCache: null };
        const assignedLeagueColors = new Map();
        let nextColorIndex = 0;
        const assignedRyColors = new Map();
        let nextRyColorIndex = 0;

        // --- Constants ---
        const API_BASE = 'https://api.sleeper.app/v1';
        const GOOGLE_SHEET_ID = '1MDTf1IouUIrm4qabQT9E5T0FsJhQtmaX55P32XK5c_0';
        const PLAYER_STATS_SHEET_ID = '1i-cKqSfYw0iFiV9S-wBw8lwZePwXZ7kcaWMdnaMTHDs';
        const PLAYER_STATS_SHEETS = { season: 'SZN', seasonRanks: 'SZN_RKs', weeks: { 1: 'WK1', 2: 'WK2', 3: 'WK3', 4: 'WK4', 5: 'WK5' } };
        const TAG_COLORS = { QB:"var(--pos-qb)", RB:"var(--pos-rb)", WR:"var(--pos-wr)", TE:"var(--pos-te)", BN:"var(--pos-bn)", TX:"var(--pos-tx)", FLX: "var(--pos-flx)", SFLX: "var(--pos-sflx)" };
        const STARTER_ORDER = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'SUPER_FLEX'];
        const TEAM_COLORS = { ARI:"#97233F", ATL:"#A71930", BAL:"#241773", BUF:"#00338D", CAR:"#0085CA", CHI:"#1a2d4e", CIN:"#FB4F14", CLE:"#311D00", DAL:"#003594", DEN:"#FB4F14", DET:"#0076B6", GB:"#203731", HOU:"#03202F", IND:"#002C5F", JAX:"#006778", KC:"#E31837", LAC:"#0080C6", LAR:"#003594", LV:"#A5ACAF", MIA:"#008E97", MIN:"#4F2683", NE:"#002244", NO:"#D3BC8D", NYG:"#0B2265", NYJ:"#125740", PHI:"#004C54", PIT:"#FFB612", SEA:"#69BE28", SF:"#B3995D", TB:"#D50A0A", TEN:"#4B92DB", WAS:"#5A1414", FA: "#64748b" };
      const LEAGUE_COLOR_PALETTE = [
          '#9a99f2',
          '#77b6fb',
          '#f2a8ff',
          '#a0f1da',
          '#96d7ff',
          '#c879ff',
          '#bbdbfe',
          '#8b79d9',
          '#63d4cc',
          '#eabaf6'
        ];
        
            const RY_COLOR_PALETTE = ['#d7f2ff', '#cfe9ff', '#e0f6ea', '#fff1d6', '#efe2ff', '#ffe0ea', '#e4f0ff'];
              const LEAGUE_ABBR_OVERRIDES = {
            "ff d-league": "DL",
            "the most important league": "TMIL",
            "big boofers club bbc": "BBC",
            "trade hoard eat league": "THE",
            "dynasty footballers": "DFB", "la leaguaaa dynasty est2024": "LLGA",
            "la leaugaaa dynasty est2024": "LLGA"
        };

        // --- Event Listeners ---
        if (pageType === 'welcome') {
            fetchRostersButton?.addEventListener('click', () => {
                const username = usernameInput.value.trim();
                if (!username) return;
                window.location.href = `rosters/rosters.html?username=${encodeURIComponent(username)}`;
            });
            fetchOwnershipButton?.addEventListener('click', () => {
                const username = usernameInput.value.trim();
                if (!username) return;
                window.location.href = `ownership/ownership.html?username=${encodeURIComponent(username)}`;
            });
        } else if (pageType === 'research') {
            fetchRostersButton?.addEventListener('click', () => {
                const username = usernameInput.value.trim();
                if (!username) return;
                window.location.href = `../rosters/rosters.html?username=${encodeURIComponent(username)}`;
            });
            fetchOwnershipButton?.addEventListener('click', () => {
                const username = usernameInput.value.trim();
                if (!username) return;
                window.location.href = `../ownership/ownership.html?username=${encodeURIComponent(username)}`;
            });
        } else if (pageType === 'rosters') {
            fetchRostersButton?.addEventListener('click', handleFetchRosters);
            fetchOwnershipButton?.addEventListener('click', () => {
                const username = usernameInput.value.trim();
                if (!username) return;
                window.location.href = `../ownership/ownership.html?username=${encodeURIComponent(username)}`;
            });
        } else if (pageType === 'ownership') {
            fetchOwnershipButton?.addEventListener('click', handleFetchOwnership);
            fetchRostersButton?.addEventListener('click', () => {
                const username = usernameInput.value.trim();
                if (!username) return;
                window.location.href = `../rosters/rosters.html?username=${encodeURIComponent(username)}`;
            });
        }

        if (pageType === 'rosters') {
            leagueSelect?.addEventListener('change', (e) => {
                handleLeagueSelect(e);
                if (e && e.target && e.target.blur) e.target.blur();
            });
            rosterGrid?.addEventListener('click', handleTeamSelect);
            mainContent?.addEventListener('click', handleAssetClickForTrade);

            tradeSimulator.addEventListener('click', (e) => {
                const compareButton = e.target.closest('#comparePlayersButton');
                if (compareButton) {
                    const isModalOpen = !playerComparisonModal.classList.contains('hidden');

                    if (isModalOpen) {
                        closeComparisonModal();
                    } else {
                        const selectedPlayers = Object.values(state.tradeBlock).flat().filter(asset => asset.pos !== 'DP');
                        if (selectedPlayers.length !== 2) {
                            showTemporaryTooltip(compareButton, 'Please select exactly 2 players to compare.');
                        } else {
                            handlePlayerCompare(e);
                        }
                    }
                }
            });

            compareButton?.addEventListener('click', handleCompareClick);
            positionalViewBtn?.addEventListener('click', () => setRosterView('positional'));
            depthChartViewBtn?.addEventListener('click', () => setRosterView('depth'));
            positionalFiltersContainer?.addEventListener('click', handlePositionFilter);
            clearFiltersButton?.addEventListener('click', handleClearFilters);

            if (gameLogsModal) {
                modalCloseBtn.addEventListener('click', () => closeModal());
                modalOverlay.addEventListener('click', () => closeModal());
                modalInfoBtn.addEventListener('click', () => {
                    statsKeyContainer.classList.toggle('hidden');
                });
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && !gameLogsModal.classList.contains('hidden')) {
                        closeModal();
                    }
                });
            }

            if (playerComparisonModal) {
                const closeBtn = playerComparisonModal.querySelector('.modal-close-btn');
                const overlay = playerComparisonModal.querySelector('.modal-overlay');
                if (closeBtn) closeBtn.addEventListener('click', () => closeComparisonModal());
                if (overlay) overlay.addEventListener('click', () => closeComparisonModal());
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && !playerComparisonModal.classList.contains('hidden')) {
                        closeComparisonModal();
                    }
                });
            }
        }
        
        // --- Initialization ---
        document.addEventListener('DOMContentLoaded', async () => {
            if (pageType === 'analyzer') return;
            if (pageType === 'research') {
                const params = new URLSearchParams(window.location.search);
                const uname = params.get('username');
                if (uname) {
                    usernameInput.value = uname;
                }
                return;
            }
            setLoading(true, 'Loading initial data...');
            await Promise.all([ fetchSleeperPlayers(), fetchDataFromGoogleSheet(), fetchPlayerStatsSheets() ]);
            setLoading(false);
            if (welcomeScreen) welcomeScreen.classList.remove('hidden');

            const params = new URLSearchParams(window.location.search);
            const uname = params.get('username');
            if (uname) {
                usernameInput.value = uname;
                if (pageType === 'rosters') {
                    await handleFetchRosters();
                } else if (pageType === 'ownership') {
                    await handleFetchOwnership();
                }
            }
        });

        // --- View Toggling and Main Handlers ---
        function setRosterView(view) {
    closeComparisonModal();
    hideLegend();
            state.currentRosterView = view;
            const isPositional = view === 'positional';
            positionalViewBtn.classList.toggle('active', isPositional);
            depthChartViewBtn.classList.toggle('active', !isPositional);

            positionalViewBtn.classList.toggle('counterpart-active', !isPositional);
            depthChartViewBtn.classList.toggle('counterpart-active', isPositional);

            if (state.currentTeams) {
                renderAllTeamData(state.currentTeams);
            }
        }

        function updateButtonStates(activeButton) {
            const isRosters = activeButton === 'rosters';
            fetchRostersButton.classList.toggle('active', isRosters);
            fetchOwnershipButton.classList.toggle('active', !isRosters);

            fetchRostersButton.classList.toggle('counterpart-active', !isRosters);
            fetchOwnershipButton.classList.toggle('counterpart-active', isRosters);
        }

        async function handleFetchRosters() {
    hideLegend();
            const username = usernameInput.value.trim();
            if (!username) return;
            
            setLoading(true, 'Fetching user leagues...');
            
            try {
                await fetchAndSetUser(username);
                const leagues = await fetchUserLeagues(state.userId);
                state.leagues = leagues.sort((a, b) => a.name.localeCompare(b.name));
                
                updateButtonStates('rosters');
                contextualControls.classList.remove('hidden');
                adjustStickyHeaders(); // Recalculate header height for correct padding
                playerListView.classList.add('hidden');
                rosterView.classList.remove('hidden');
                setRosterView('positional'); // Set default view
                
                populateLeagueSelect(state.leagues);

                const params = new URLSearchParams(window.location.search);
                const preselectId = params.get('leagueId');

                if (state.leagues.length > 0) {
                    if (preselectId && state.leagues.some(l => l.league_id === preselectId)) {
                        leagueSelect.value = preselectId;
                        await handleLeagueSelect();
                    } else {
                        leagueSelect.selectedIndex = 1;
                        await handleLeagueSelect();
                    }
                } else {
                    contextualControls.classList.add('hidden');
                }
            } catch (error) {
                handleError(error, username);
            } finally {
                setLoading(false);
            }
        }

        async function handleFetchOwnership() {
            const username = usernameInput.value.trim();
            if (!username) return;
            
            setLoading(true, 'Fetching ownership data...');

            try {
                await fetchAndSetUser(username);
                
                updateButtonStates('ownership');
                contextualControls.classList.add('hidden');
                rosterView.classList.add('hidden');
                playerListView.classList.remove('hidden');

                await renderPlayerList();
            } catch (error) {
                handleError(error, username);
            } finally {
                setLoading(false);
            }
        }

        async function handleLeagueSelect() {
    hideLegend();
            const leagueId = leagueSelect.value;
            if (!leagueId || leagueId === 'Select a league...') {
                rosterView.classList.add('hidden');
                return;
            };
            
            state.currentLeagueId = leagueId;
            state.calculatedRankCache = null;
            handleClearCompare(); 
            const leagueInfo = state.leagues.find(l => l.league_id === leagueId);
            const leagueName = leagueInfo?.name || 'league';
            setLoading(true, `Loading ${leagueName}...`);
            rosterGrid.innerHTML = '';

            try {
                const rosterPositions = leagueInfo.roster_positions;
                const superflexSlots = rosterPositions.filter(p => p === 'SUPER_FLEX').length;
                const qbSlots = rosterPositions.filter(p => p === 'QB').length;
                state.isSuperflex = (superflexSlots > 0) || (qbSlots > 1);
                
                const [rosters, users, tradedPicks] = await Promise.all([
                    fetchWithCache(`${API_BASE}/league/${leagueId}/rosters`),
                    fetchWithCache(`${API_BASE}/league/${leagueId}/users`),
                    fetchWithCache(`${API_BASE}/league/${leagueId}/traded_picks`),
                ]);
                
                const teams = processRosterData(rosters, users, tradedPicks, leagueInfo);
                
                const userTeam = teams.find(team => team.isUserTeam);
                if (userTeam) {
                    state.userTeamName = userTeam.teamName;
                    state.teamsToCompare.add(userTeam.teamName);
                } else {
                    state.userTeamName = null;
                }
                updateCompareButtonState();

                renderAllTeamData(teams);
                
                rosterView.classList.remove('hidden');

            } catch (error) {
                console.error(`Error loading league ${leagueId}:`, error);
            } finally {
                setLoading(false);
            }
        }
        
        // --- Compare & Trade Logic ---
        function handleTeamSelect(e) {
            const header = e.target.closest('.team-header-item');
            if (header) {
                const checkbox = header.querySelector('.team-compare-checkbox');
                const teamName = checkbox.dataset.teamName;

                const isSelected = state.teamsToCompare.has(teamName);

                if (isSelected) {
                    // If a team is deselected, hide the trade preview
                    state.teamsToCompare.delete(teamName);
                    checkbox.classList.remove('selected');

                    state.isCompareMode = false;
                    rosterView.classList.remove('is-trade-mode');
                    rosterGrid.classList.remove('is-preview-mode');

                    clearTrade();
                    setTimeout(() => window.scrollTo(0, 0), 0); // scroll to top
                    updateHeaderPreviewState(); // call before render
                    renderAllTeamData(state.currentTeams);


                } else {
                    // If a new team is selected
                    if (state.teamsToCompare.size >= 2) {
                        // Prevent selecting more than 2 teams
                        return;
                    }

                    state.teamsToCompare.add(teamName);
                    checkbox.classList.add('selected');

                    if (state.teamsToCompare.size === 2) {
                        // If we now have 2 teams, show the preview
                        state.isCompareMode = true;
                        rosterView.classList.add('is-trade-mode');
                        rosterGrid.classList.add('is-preview-mode');
                        setTimeout(() => window.scrollTo(0, 0), 0); // scroll to top
                        updateHeaderPreviewState(); // call before render
                        renderAllTeamData(state.currentTeams);
                        renderTradeBlock();
                    }
                }
                updateCompareButtonState();
            }
        }

        function updateHeaderPreviewState() {
            const appHeader = document.querySelector('.app-header');
            if (appHeader) {
                appHeader.classList.toggle('preview-active', state.isCompareMode);
            }
        }

        function handleCompareClick() {
            state.isCompareMode = !state.isCompareMode;
            rosterView.classList.toggle('is-trade-mode', state.isCompareMode);
            rosterGrid.classList.toggle('is-preview-mode', state.isCompareMode);
            updateCompareButtonState();
            updateHeaderPreviewState(); // call before render
            if (!state.isCompareMode) {
                clearTrade();
                setTimeout(() => window.scrollTo(0, 0), 0); // scroll to top
            } else {
                setTimeout(() => window.scrollTo(0, 0), 0); // scroll to top
                renderTradeBlock();
            }
            renderAllTeamData(state.currentTeams);
        }

        function handleClearCompare(keepUserTeam = false) {
            const userTeamName = state.currentTeams?.find(team => team.isUserTeam)?.teamName;
            
            const teamsToKeep = new Set();
            if (keepUserTeam && userTeamName && state.teamsToCompare.has(userTeamName)) {
                teamsToKeep.add(userTeamName);
            }
            state.teamsToCompare = teamsToKeep;

            state.isCompareMode = false;
            rosterView.classList.remove('is-trade-mode');
            rosterGrid.classList.remove('is-preview-mode');
            
            updateCompareButtonState();
            clearTrade();
            window.scrollTo(0, 0); // scroll to top
            updateHeaderPreviewState(); // call before render
            if (state.currentTeams) {
                renderAllTeamData(state.currentTeams);
            }
        }

        function lockCompareButtonSize() {
            if (!compareButton) return;
            if (compareButton.style.width && compareButton.style.height) {
                return;
            }
            const rect = compareButton.getBoundingClientRect();
            compareButton.style.width = `${rect.width}px`;
            compareButton.style.height = `${rect.height}px`;
        }

        function unlockCompareButtonSize() {
            if (!compareButton) return;
            compareButton.style.width = '';
            compareButton.style.height = '';
        }

        function updateCompareButtonState() {
            if (!compareButton) {
                return;
            }
            const count = state.teamsToCompare.size;
            compareButton.disabled = count < 2;

            if (count > 1) {
                compareButton.classList.add('glow-on-select');
            } else {
                compareButton.classList.remove('glow-on-select');
            }

            if (state.isCompareMode) {
                lockCompareButtonSize();
                compareButton.innerHTML = COMPARE_BUTTON_SHOW_ALL_HTML;
                compareButton.classList.add('active', 'compare-show-all');
                compareButton.classList.remove('glow-on-select');
            } else {
                compareButton.innerHTML = COMPARE_BUTTON_PREVIEW_HTML;
                compareButton.classList.remove('active');
                compareButton.classList.remove('compare-show-all');
                unlockCompareButtonSize();
            }

            if (count < 2 && state.isCompareMode) {
                handleCompareClick(); // Automatically exit compare mode
            }
        }

        function openCompareSearch() {
            if (!compareSearchPopover || !compareSearchToggle || !compareSearchInput) {
                return;
            }
            compareSearchPopover.classList.remove('hidden');
            compareSearchToggle.setAttribute('aria-expanded', 'true');
            compareSearchInput.focus();
        }

        function closeCompareSearch() {
            if (!compareSearchPopover || !compareSearchToggle || !compareSearchInput) {
                return;
            }
            compareSearchPopover.classList.add('hidden');
            compareSearchToggle.setAttribute('aria-expanded', 'false');
            compareSearchInput.value = '';
            filterTeamsByQuery('');
            if (document.activeElement === compareSearchInput) {
                compareSearchToggle.focus();
            }
        }

        function filterTeamsByQuery(q) {
            if (!rosterGrid) {
                return;
            }

            const query = (q || '').trim().toLowerCase();
            const rosterColumns = rosterGrid.querySelectorAll('.roster-column');

            rosterColumns.forEach(column => {
                const playerRows = column.querySelectorAll('.player-row');
                let hasMatch = false;

                playerRows.forEach(row => {
                    const playerName = (row.dataset.playerName || row.dataset.assetLabel || '').toLowerCase();
                    const matches = !query || playerName.includes(query);
                    row.classList.toggle('compare-search-hidden', Boolean(query) && !matches);
                    if (matches) {
                        hasMatch = true;
                    }
                });

                const sections = column.querySelectorAll('.roster-section');
                sections.forEach(section => {
                    const visiblePlayer = section.querySelector('.player-row:not(.compare-search-hidden)');
                    section.classList.toggle('compare-search-hidden', Boolean(query) && !visiblePlayer);
                });

                const pickRows = column.querySelectorAll('.pick-row');
                pickRows.forEach(row => {
                    row.classList.toggle('compare-search-hidden', Boolean(query));
                });

                column.classList.toggle('compare-search-hidden', Boolean(query) && !hasMatch);
            });
        }

        let searchDebounce;

        compareSearchToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = compareSearchToggle.getAttribute('aria-expanded') === 'true';
            if (isOpen) {
                closeCompareSearch();
            } else {
                openCompareSearch();
            }
        });

        document.addEventListener('click', (e) => {
            if (!compareSearchPopover || !compareSearchToggle) {
                return;
            }
            if (compareSearchPopover.classList.contains('hidden')) {
                return;
            }
            if (!compareSearchPopover.contains(e.target) && !compareSearchToggle.contains(e.target)) {
                closeCompareSearch();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeCompareSearch();
            }
        });

        compareSearchInput?.addEventListener('input', (e) => {
            const val = e.target.value;
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => filterTeamsByQuery(val), 120);
        });

        compareSearchClose?.addEventListener('click', (e) => {
            e.stopPropagation();
            closeCompareSearch();
            compareSearchToggle?.focus();
        });

        function handleAssetClickForTrade(e) {
            if (!state.isCompareMode) return;

            const assetRow = e.target.closest('.player-row, .pick-row');
            if (!assetRow) return;

            const teamName = assetRow.closest('.roster-column')?.dataset.teamName;
            if (!teamName || !state.teamsToCompare.has(teamName)) return;

            const { assetId, assetLabel, assetKtc, assetPos, assetBasePos, assetTeam } = assetRow.dataset;
            if (!assetId) return;

            if (!state.tradeBlock[teamName]) {
                state.tradeBlock[teamName] = [];
            }

            const assetIndex = state.tradeBlock[teamName].findIndex(a => a.id === assetId);

            if (assetIndex > -1) {
                state.tradeBlock[teamName].splice(assetIndex, 1);
                assetRow.classList.remove('player-selected');
            } else {
                state.tradeBlock[teamName].push({
                    id: assetId,
                    label: assetLabel,
                    ktc: parseInt(assetKtc, 10) || 0,
                    pos: assetPos,
                    basePos: assetBasePos || assetPos,
                    team: assetTeam || ''
                });
                assetRow.classList.add('player-selected');
            }
            
            renderTradeBlock();
        }

        function clearTrade() {
            state.tradeBlock = {};
            document.querySelectorAll('.player-selected').forEach(el => el.classList.remove('player-selected'));
            renderTradeBlock();
            closeComparisonModal();
        }


        // --- Position Filter Logic ---
        function handleClearFilters() {
            closeComparisonModal();
            state.activePositions.clear();
            updatePositionFilterButtons();
            renderAllTeamData(state.currentTeams);
            clearFiltersButton.classList.remove('active');
        }

        function handlePositionFilter(e) {
            closeComparisonModal();
            if (e.target.tagName !== 'BUTTON') return;
            const btn = e.target;
            const position = btn.dataset.position;
            const flexPositions = ['RB', 'WR', 'TE'];

            if (position === 'FLX') {
                const isActivating = !state.activePositions.has('FLX');
                state.activePositions.clear();
                if (isActivating) {
                    flexPositions.forEach(p => state.activePositions.add(p));
                    state.activePositions.add('FLX');
                }
            } else {
                state.activePositions.delete('FLX');
                if (state.activePositions.has(position)) {
                    state.activePositions.delete(position);
                } else {
                    state.activePositions.add(position);
                }
            }
            
            updatePositionFilterButtons();
            renderAllTeamData(state.currentTeams);
            clearFiltersButton.classList.toggle('active', state.activePositions.size > 0);
        }
        
        function updatePositionFilterButtons() {
            const buttons = positionalFiltersContainer.querySelectorAll('.filter-btn');
            buttons.forEach(btn => {
                const pos = btn.dataset.position;
                btn.classList.toggle('active', state.activePositions.has(pos));
            });
        }


        // --- Data Fetching & Processing ---
        async function fetchAndSetUser(username) {
            const userRes = await fetchWithCache(`${API_BASE}/user/${username}`);
            if (!userRes || !userRes.user_id) throw new Error('User not found.');
            state.userId = userRes.user_id;
        }

        async function fetchUserLeagues(userId) {
            const currentYear = new Date().getFullYear();
            const leaguesRes = await fetchWithCache(`${API_BASE}/user/${userId}/leagues/nfl/${currentYear}`);
            if (!leaguesRes || leaguesRes.length === 0) throw new Error(`No leagues found for this user for ${currentYear}.`);
            return leaguesRes;
        }

        async function fetchSleeperPlayers() {
            try {
                state.players = await fetchWithCache(`${API_BASE}/players/nfl`);
                state.calculatedRankCache = null;
            } catch (e) { console.error("Failed to fetch Sleeper players:", e); }
        }
        
        async function fetchGameLogs(playerId) {
            if (!state.statsSheetsLoaded) {
                await fetchPlayerStatsSheets();
            } else {
                await ensureSleeperLiveStats();
            }

            const allWeeklyStats = [];
            const weeklyStats = getCombinedWeeklyStats();
            const weeks = Object.keys(weeklyStats).map(Number).sort((a, b) => a - b);

            weeks.forEach(week => {
                const statsForWeek = weeklyStats[week]?.[playerId];
                if (statsForWeek) {
                    allWeeklyStats.push({ week, stats: statsForWeek });
                }
            });

            return allWeeklyStats;
        }

        function getDefaultPlayerRanks() {
            return {
                total_pts: '0.00',
                overallRank: 'NA',
                posRank: 'NA',
                ppg: '0.00',
                ppgOverallRank: 'NA',
                ppgPosRank: 'NA',
            };
        }

        function formatRankValue(rank) {
            if (typeof rank !== 'number' || !Number.isFinite(rank) || rank <= 0) {
                return 'NA';
            }
            return rank > 999 ? 'NA' : rank;
        }

        function buildCalculatedRankCache(scoringSettings, leagueId, scoringHash) {
            const playersById = {};
            for (const pId in state.players) {
                playersById[pId] = {
                    id: pId,
                    pos: state.players[pId]?.position || 'N/A',
                    totalPts: 0,
                    gamesPlayed: 0,
                    ppg: 0,
                    overallRank: null,
                    posRank: null,
                    ppgOverallRank: null,
                    ppgPosRank: null,
                };
            }

            const combinedWeeklyStats = getCombinedWeeklyStats();
            for (const week of Object.keys(combinedWeeklyStats)) {
                const weeklyData = combinedWeeklyStats[week];
                for (const [pId, statLine] of Object.entries(weeklyData)) {
                    const playerEntry = playersById[pId];
                    if (!playerEntry) continue;
                    const points = calculateFantasyPoints(statLine, scoringSettings);
                    playerEntry.totalPts += points;
                    if (points > 0) {
                        playerEntry.gamesPlayed += 1;
                    }
                }
            }

            const entries = Object.values(playersById);
            entries.forEach(entry => {
                entry.ppg = entry.gamesPlayed > 0 ? entry.totalPts / entry.gamesPlayed : 0;
            });

            const totalSorted = entries.slice().sort((a, b) => b.totalPts - a.totalPts);
            totalSorted.forEach((entry, index) => {
                entry.overallRank = index + 1;
            });

            const posGroups = new Map();
            entries.forEach(entry => {
                const posKey = entry.pos || 'N/A';
                if (!posGroups.has(posKey)) posGroups.set(posKey, []);
                posGroups.get(posKey).push(entry);
            });

            posGroups.forEach(group => {
                group.slice().sort((a, b) => b.totalPts - a.totalPts).forEach((entry, index) => {
                    entry.posRank = index + 1;
                });
                group.slice().sort((a, b) => b.ppg - a.ppg).forEach((entry, index) => {
                    entry.ppgPosRank = index + 1;
                });
            });

            const ppgSorted = entries.slice().sort((a, b) => b.ppg - a.ppg);
            ppgSorted.forEach((entry, index) => {
                entry.ppgOverallRank = index + 1;
            });

            const cache = {};
            entries.forEach(entry => {
                cache[entry.id] = {
                    total_pts: entry.totalPts.toFixed(2),
                    overallRank: formatRankValue(entry.overallRank),
                    posRank: formatRankValue(entry.posRank),
                    ppg: entry.ppg.toFixed(2),
                    ppgOverallRank: formatRankValue(entry.ppgOverallRank),
                    ppgPosRank: formatRankValue(entry.ppgPosRank),
                };
            });

            return { leagueId, scoringHash, players: cache };
        }

        function calculatePlayerStatsAndRanks(playerId) {
            const league = state.leagues.find(l => l.league_id === state.currentLeagueId);
            if (!league) return getDefaultPlayerRanks();

            const scoringSettings = league.scoring_settings || {};
            const scoringHash = JSON.stringify(scoringSettings || {});

            if (!state.calculatedRankCache || state.calculatedRankCache.leagueId !== state.currentLeagueId || state.calculatedRankCache.scoringHash !== scoringHash) {
                state.calculatedRankCache = buildCalculatedRankCache(scoringSettings, league.league_id, scoringHash);
            }

            return state.calculatedRankCache.players[playerId] || getDefaultPlayerRanks();
        }

        async function fetchDataFromGoogleSheet() {
            const sheetNames = { oneQb: 'KTC_1QB', sflx: 'KTC_SFLX' };
            try {
                const [oneQbCsv, sflxCsv] = await Promise.all([
                    fetch(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetNames.oneQb}`).then(res => res.text()),
                    fetch(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetNames.sflx}`).then(res => res.text())
                ]);
                state.oneQbData = parseSheetData(oneQbCsv);
                state.sflxData = parseSheetData(sflxCsv);
            } catch (e) { console.error("Fatal Error: Could not fetch data from Google Sheet.", e); }
        }

        function parseSheetData(csvText) {
            const dataMap = {};
            const { headers, rows } = parseCsv(csvText);
            if (!headers.length || !rows.length) return dataMap;

            const normalizedHeaders = headers.map(normalizeHeader);
            const headerIndex = new Map();
            normalizedHeaders.forEach((header, idx) => {
                headerIndex.set(header.toUpperCase(), idx);
            });

            const normalizeKey = (key) => normalizeHeader(key).toUpperCase();
            const getColumnValue = (columns, names) => {
                const keys = Array.isArray(names) ? names : [names];
                for (const name of keys) {
                    const idx = headerIndex.get(normalizeKey(name));
                    if (idx !== undefined) {
                        const value = columns[idx];
                        if (value !== undefined) return value.trim();
                    }
                }
                return '';
            };

            const toFloat = (value) => {
                const num = parseFloat(value);
                return Number.isNaN(num) ? null : num;
            };

            const toInt = (value) => {
                const num = parseInt(value, 10);
                return Number.isNaN(num) ? null : num;
            };

            rows.forEach(columns => {
                const pos = getColumnValue(columns, 'POS');
                const sleeperId = getColumnValue(columns, 'SLPR_ID');
                const ktcValue = toInt(getColumnValue(columns, ['VALUE', 'KTC']));
                const adp = toFloat(getColumnValue(columns, 'ADP'));
                const posRank = getColumnValue(columns, ['POS·RK', 'POS RK', 'POS_RK']);
                const age = toFloat(getColumnValue(columns, 'AGE'));
                const overallRank = toInt(getColumnValue(columns, ['RANK', 'OVR', 'OVERALL']));

                if (pos === 'RDP') {
                    const pickName = getColumnValue(columns, 'PLAYER NAME');
                    if (pickName) {
                        dataMap[pickName] = {
                            adp: null,
                            ktc: ktcValue,
                            posRank: null,
                            overallRank: null
                        };
                    }
                    return;
                }

                if (!sleeperId || sleeperId === 'NA') return;

                dataMap[sleeperId] = {
                    age: age,
                    adp: adp,
                    ktc: ktcValue,
                    posRank: posRank || null,
                    overallRank: overallRank
                };
            });

            return dataMap;
        }

        async function fetchPlayerStatsSheets() {
            if (state.statsSheetsLoaded) {
                await ensureSleeperLiveStats();
                return;
            }
            try {
                const seasonPromise = fetch(`https://docs.google.com/spreadsheets/d/${PLAYER_STATS_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${PLAYER_STATS_SHEETS.season}`).then(res => res.text());
                const seasonRanksPromise = fetch(`https://docs.google.com/spreadsheets/d/${PLAYER_STATS_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${PLAYER_STATS_SHEETS.seasonRanks}`).then(res => res.text());
                const weeklyPromises = Object.entries(PLAYER_STATS_SHEETS.weeks).map(async ([week, sheetName]) => {
                    const csv = await fetch(`https://docs.google.com/spreadsheets/d/${PLAYER_STATS_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`).then(res => res.text());
                    return { week: Number(week), csv };
                });

                const [seasonCsv, seasonRanksCsv, ...weeklyCsvs] = await Promise.all([seasonPromise, seasonRanksPromise, ...weeklyPromises]);

                state.playerSeasonStats = parseSeasonStatsCsv(seasonCsv);
                state.playerSeasonRanks = parseSeasonRanksCsv(seasonRanksCsv);
                state.seasonRankCache = computeSeasonRankings(state.playerSeasonStats);
                const weeklyStats = {};
                weeklyCsvs.forEach(({ week, csv }) => {
                    weeklyStats[week] = parseWeeklyStatsCsv(csv);
                });
                state.playerWeeklyStats = weeklyStats;
                state.weeklyStats = weeklyStats;
                state.statsSheetsLoaded = true;
                state.liveStatsLoaded = false;
                state.calculatedRankCache = null;
                await ensureSleeperLiveStats();
            } catch (error) {
                console.error('Failed to fetch player stats from sheet.', error);
                state.playerSeasonStats = {};
                state.playerSeasonRanks = {};
                state.playerWeeklyStats = {};
                state.weeklyStats = {};
                state.seasonRankCache = null;
                state.statsSheetsLoaded = false;
                state.liveWeeklyStats = {};
                state.liveStatsLoaded = true;
                state.calculatedRankCache = null;
            }
        }

        async function ensureSleeperLiveStats() {
            if (state.liveStatsLoaded) return;
            await fetchSleeperLiveStats();
        }

        async function fetchSleeperLiveStats() {
            const sheetWeeks = Object.keys(state.playerWeeklyStats || {}).map(week => Number(week)).filter(week => Number.isFinite(week));
            const latestSheetWeek = sheetWeeks.length > 0 ? Math.max(...sheetWeeks) : 0;
            state.liveWeeklyStats = {};

            try {
                const response = await fetch(`${API_BASE}/state/nfl`);
                if (!response.ok) throw new Error(`Sleeper state request failed: ${response.status}`);
                const sleeperState = await response.json();
                const season = sleeperState?.season || null;
                const currentWeek = Number(sleeperState?.week);

                state.currentNflSeason = season;
                state.currentNflWeek = Number.isFinite(currentWeek) ? currentWeek : null;

                if (!season || !Number.isFinite(currentWeek) || currentWeek <= latestSheetWeek) {
                    return;
                }

                const liveWeeklyStats = {};

                for (let week = latestSheetWeek + 1; week <= currentWeek; week++) {
                    try {
                        const statsResponse = await fetch(`${API_BASE}/stats/nfl/regular/${season}/${week}`);
                        if (!statsResponse.ok) throw new Error(`Sleeper stats request failed: ${statsResponse.status}`);
                        const statsData = await statsResponse.json();
                        if (!statsData || typeof statsData !== 'object') continue;

                        const weekStats = {};
                        for (const [playerId, statLine] of Object.entries(statsData)) {
                            if (!statLine) continue;
                            const override = Number(statLine?.pts_ppr ?? statLine?.pts ?? statLine?.pts_ppr_total ?? statLine?.fantasy_points_ppr);
                            if (!Number.isFinite(override)) continue;
                            weekStats[playerId] = { fpts_override: override, __live: true };
                        }

                        if (Object.keys(weekStats).length > 0) {
                            liveWeeklyStats[week] = weekStats;
                        }
                    } catch (weekError) {
                        console.warn(`Unable to fetch live fantasy points for week ${week}.`, weekError);
                    }
                }

                state.liveWeeklyStats = liveWeeklyStats;
                state.calculatedRankCache = null;
            } catch (error) {
                console.warn('Sleeper live stats unavailable.', error);
                state.liveWeeklyStats = {};
                state.calculatedRankCache = null;
            } finally {
                state.liveStatsLoaded = true;
            }
        }

        function getCombinedWeeklyStats() {
            const combined = { ...(state.weeklyStats || {}) };
            const liveWeeklyStats = state.liveWeeklyStats || {};
            for (const [week, stats] of Object.entries(liveWeeklyStats)) {
                if (!combined[week]) {
                    combined[week] = stats;
                }
            }
            return combined;
        }

        function getAdjustedGamesPlayed(playerId, scoringSettings = null) {
            const baseGames = state.playerSeasonStats?.[playerId]?.games_played;
            const initialGames = Number.isFinite(baseGames) ? baseGames : Number(baseGames) || 0;
            const liveWeeklyStats = state.liveWeeklyStats || {};
            let additionalGames = 0;

            for (const [week, stats] of Object.entries(liveWeeklyStats)) {
                if (state.weeklyStats && state.weeklyStats[week]) continue;
                const playerWeek = stats?.[playerId];
                if (!playerWeek) continue;
                const points = calculateFantasyPoints(playerWeek, scoringSettings || {});
                if (points > 0) additionalGames += 1;
            }

            return initialGames + additionalGames;
        }

        const PLAYER_STAT_HEADER_MAP = {
            'paATT': 'pass_att',
            'CMP': 'pass_cmp',
            'paYDS': 'pass_yd',
            'paTD': 'pass_td',
            'pa1D': 'pass_fd',
            'IMP/G': 'imp_per_g',
            'paRTG': 'pass_rtg',
            'pIMP': 'pass_imp',
            'pIMP/A': 'pass_imp_per_att',
            'INT': 'pass_int',
            'SAC': 'pass_sack',
            'TTT': 'ttt',
            'PRS%': 'prs_pct',
            'CAR': 'rush_att',
            'ruYDS': 'rush_yd',
            'YPC': 'ypc',
            'ruTD': 'rush_td',
            'ru1D': 'rush_fd',
            'MTF': 'mtf',
            'ELU': 'elu',
            'YCO': 'rush_yac',
            'YCO/A': 'yco_per_att',
            'MTF/A': 'mtf_per_att',
            'TGT': 'rec_tgt',
            'REC': 'rec',
            'recYDS': 'rec_yd',
            'recTD': 'rec_td',
            'rec1D': 'rec_fd',
            'YAC': 'rec_yar',
            'YPR': 'ypr',
            'RR': 'rr',
            'TS%': 'ts_per_rr',
            'YPRR': 'yprr',
            '1DRR': 'first_down_rec_rate',
            'IMP': 'imp',
            'FUM': 'fum',
            'SNP%': 'snp_pct',
            'YDS(t)': 'yds_total',
            'FPOE': 'fpoe'
        };

        const WEEKLY_META_HEADER_MAP = {
            'VS': 'opponent',
            'vsRK': 'opponent_rank'
        };

        
        // === Label builder and no-fallback config (added) ===
        function buildStatLabels() {
            const labels = {};
            for (const [header, key] of Object.entries(PLAYER_STAT_HEADER_MAP)) {
                labels[key] = header;
            }
            labels['fpts'] = 'FPTS'; // computed, not from sheet
            labels['ppg'] = 'PPG';   // keep if used elsewhere
            labels['ts_per_rr'] = 'TS%';
            return labels;
        }

        // Stats that must not use code-derived fallbacks; sheet is source of truth
        const NO_FALLBACK_KEYS = new Set([
            'yprr',
            'ts_per_rr',
            'imp_per_g',
            'snp_pct',
            'prs_pct',
            'ypr',
            'first_down_rec_rate'
        ]);
const SEASON_META_HEADERS = {
            'POS': 'pos',
            'TM': 'team',
            'GM_P': 'games_played'
        };

        const SEASON_VALUE_HEADERS = {
            'FPT_PPR': 'fpts_ppr',
            'FPTS_PPR': 'fpts_ppr',
            'PRK_PPR': 'pos_rank_ppr'
        };

        function parseSeasonStatsCsv(csvText) {
            const { headers, rows } = parseCsv(csvText);
            const normalizedHeaders = headers.map(normalizeHeader);
            const result = {};

            rows.forEach(columns => {
                let playerId = null;
                const stats = {};

                normalizedHeaders.forEach((header, idx) => {
                    const value = columns[idx];
                    if (!value) return;

                    if (header === 'SLPR_ID') {
                        playerId = value.trim();
                        return;
                    }

                    const statKey = PLAYER_STAT_HEADER_MAP[header];
                    if (statKey) {
                        const parsedValue = parseStatValue(header, value);
                        if (parsedValue !== null) stats[statKey] = parsedValue;
                        return;
                    }

                    const metaKey = SEASON_META_HEADERS[header];
                    if (metaKey) {
                        if (metaKey === 'games_played') {
                            const num = parseFloat(value);
                            if (!Number.isNaN(num)) stats[metaKey] = num;
                        } else {
                            const trimmed = value.trim();
                            if (trimmed) stats[metaKey] = trimmed;
                        }
                        return;
                    }

                    const valueKey = SEASON_VALUE_HEADERS[header];
                    if (valueKey) {
                        const parsed = parseSeasonValue(header, value);
                        if (parsed !== null) stats[valueKey] = parsed;
                        return;
                    }
                });

                if (playerId) {
                    result[playerId] = stats;
                }
            });

            return result;
        }

        function parseSeasonRanksCsv(csvText) {
            const { headers, rows } = parseCsv(csvText);
            const normalizedHeaders = headers.map(normalizeHeader);
            const result = {};

            rows.forEach(columns => {
                let playerId = null;
                const ranks = {};

                normalizedHeaders.forEach((header, idx) => {
                    const value = columns[idx];
                    if (!value) return;

                    if (header === 'SLPR_ID') {
                        playerId = value.trim();
                        return;
                    }

                    const statKey = PLAYER_STAT_HEADER_MAP[header] || SEASON_VALUE_HEADERS[header];
                    if (!statKey) return;

                    const parsedRank = parseRankValue(value);
                    if (parsedRank !== null) ranks[statKey] = parsedRank;
                });

                if (playerId) {
                    result[playerId] = ranks;
                }
            });

            return result;
        }

        function parseSeasonValue(header, value) {
            const trimmed = value.trim();
            if (!trimmed || trimmed.toUpperCase() === 'NA') return null;

            if (header === 'PRK_PPR') {
                const intVal = parseInt(trimmed, 10);
                return Number.isNaN(intVal) ? null : intVal;
            }

            const numVal = parseFloat(trimmed);
            return Number.isNaN(numVal) ? null : numVal;
        }

        function parseRankValue(value) {
            const trimmed = value.trim();
            if (!trimmed) return null;
            const upper = trimmed.toUpperCase();
            if (upper === 'NA' || upper === 'N/A') return null;

            const numVal = parseFloat(trimmed);
            return Number.isNaN(numVal) ? null : numVal;
        }

        const STAT_KEY_RANK_OVERRIDES = { fpts: 'fpts_ppr' };

        function getSeasonRankKey(statKey) {
            return STAT_KEY_RANK_OVERRIDES[statKey] || statKey;
        }

        function getSeasonRankValue(playerId, statKey) {
            const normalizeRank = (value) => {
                if (value === null || value === undefined) return null;
                if (typeof value === 'number') {
                    return Number.isFinite(value) ? value : null;
                }
                if (typeof value === 'string') {
                    return parseRankValue(value) ?? null;
                }
                return parseRankValue(String(value)) ?? null;
            };

            if (statKey === 'fpts' || statKey === 'ppg') {
                if (typeof calculatePlayerStatsAndRanks === 'function') {
                    const ranks = calculatePlayerStatsAndRanks(playerId);
                    if (ranks) {
                        const liveRank = statKey === 'fpts' ? ranks.posRank : ranks.ppgPosRank;
                        const normalizedLiveRank = normalizeRank(liveRank);
                        if (normalizedLiveRank !== null) {
                            return normalizedLiveRank;
                        }
                    }
                }

                return null;
            }

            const ranks = state.playerSeasonRanks?.[playerId];
            if (!ranks) return null;
            const key = getSeasonRankKey(statKey);
            if (!(key in ranks)) return null;
            const value = ranks[key];
            if (typeof value === 'number') return value;
            if (typeof value === 'string') {
                const trimmed = value.trim();
                if (!trimmed) return null;
                const upper = trimmed.toUpperCase();
                if (upper === 'NA' || upper === 'N/A') return null;
                const parsed = parseFloat(trimmed);
                return Number.isNaN(parsed) ? null : parsed;
            }
            return null;
        }

        function getRankDisplayText(rank) {
            if (rank === null || rank === undefined || Number.isNaN(rank)) {
                return 'NA';
            }

            const rankStr = String(rank).trim();
            if (!rankStr) return 'NA';
            const upper = rankStr.toUpperCase();
            if (upper === 'NA' || upper === 'N/A') return 'NA';

            return rankStr;
        }

        function createRankAnnotation(rank, { wrapInParens = true } = {}) {
            const span = document.createElement('span');
            span.className = 'stat-rank-annotation';
            const displayText = getRankDisplayText(rank);
            span.textContent = wrapInParens ? `(${displayText})` : displayText;
            return span;
        }

        function computeSeasonRankings(seasonStats) {
            if (!seasonStats || typeof seasonStats !== 'object') return null;

            const entries = [];
            for (const [playerId, stats] of Object.entries(seasonStats)) {
                const fpts = typeof stats.fpts_ppr === 'number' ? stats.fpts_ppr : 0;
                const gamesPlayed = typeof stats.games_played === 'number' ? stats.games_played : 0;
                const pos = stats.pos || state.players[playerId]?.position || null;
                const ppg = gamesPlayed > 0 ? fpts / gamesPlayed : 0;

                stats.fpts_ppr = fpts;
                stats.games_played = gamesPlayed;
                stats.pos = pos;
                stats.ppg = ppg;

                entries.push({ playerId, pos, fpts, gamesPlayed, ppg });
            }

            const overallSorted = entries.slice().sort((a, b) => {
                if (b.fpts !== a.fpts) return b.fpts - a.fpts;
                if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
                if (b.ppg !== a.ppg) return b.ppg - a.ppg;
                return a.playerId.localeCompare(b.playerId);
            });

            overallSorted.forEach((entry, index) => {
                seasonStats[entry.playerId].overall_rank_ppr = index + 1;
            });

            const ppgSorted = entries
                .filter(entry => entry.gamesPlayed > 0)
                .sort((a, b) => {
                    if (b.ppg !== a.ppg) return b.ppg - a.ppg;
                    if (b.fpts !== a.fpts) return b.fpts - a.fpts;
                    if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
                    return a.playerId.localeCompare(b.playerId);
                });

            ppgSorted.forEach((entry, index) => {
                seasonStats[entry.playerId].ppg_rank_ppr = index + 1;
            });

            const positionalRankings = {};

            const groupedByPos = entries.reduce((acc, entry) => {
                if (!entry.pos) return acc;
                if (!acc[entry.pos]) acc[entry.pos] = [];
                acc[entry.pos].push(entry);
                return acc;
            }, {});

            Object.entries(groupedByPos).forEach(([pos, group]) => {
                const posSorted = group.slice().sort((a, b) => {
                    if (b.fpts !== a.fpts) return b.fpts - a.fpts;
                    if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
                    if (b.ppg !== a.ppg) return b.ppg - a.ppg;
                    return a.playerId.localeCompare(b.playerId);
                });

                posSorted.forEach((entry, index) => {
                    if (typeof seasonStats[entry.playerId].pos_rank_ppr !== 'number') {
                        seasonStats[entry.playerId].pos_rank_ppr = index + 1;
                    }
                });

                const posPpgSorted = group
                    .filter(entry => entry.gamesPlayed > 0)
                    .sort((a, b) => {
                        if (b.ppg !== a.ppg) return b.ppg - a.ppg;
                        if (b.fpts !== a.fpts) return b.fpts - a.fpts;
                        if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
                        return a.playerId.localeCompare(b.playerId);
                    });

                posPpgSorted.forEach((entry, index) => {
                    seasonStats[entry.playerId].ppg_pos_rank_ppr = index + 1;
                });

                positionalRankings[pos] = {
                    total: posSorted.map(entry => entry.playerId),
                    ppg: posPpgSorted.map(entry => entry.playerId)
                };
            });

            return {
                overall: overallSorted.map(entry => entry.playerId),
                ppg: ppgSorted.map(entry => entry.playerId),
                positional: positionalRankings
            };
        }

        function parseWeeklyStatsCsv(csvText) {
            const { headers, rows } = parseCsv(csvText);
            const normalizedHeaders = headers.map(normalizeHeader);
            const result = {};

            rows.forEach(columns => {
                let playerId = null;
                const stats = {};

                normalizedHeaders.forEach((header, idx) => {
                    const value = columns[idx];
                    if (!value) return;

                    if (header === 'SLPR_ID') {
                        playerId = value.trim();
                        return;
                    }

                    const metaKey = WEEKLY_META_HEADER_MAP[header];
                    if (metaKey) {
                        if (metaKey === 'opponent_rank') {
                            const parsed = parseFloat(value.trim());
                            if (!Number.isNaN(parsed)) stats[metaKey] = parsed;
                        } else {
                            const trimmedOpponent = value.trim();
                            if (trimmedOpponent) stats[metaKey] = trimmedOpponent;
                        }
                        return;
                    }

                    const statKey = PLAYER_STAT_HEADER_MAP[header];
                    if (statKey) {
                        const parsedValue = parseStatValue(header, value);
                        if (parsedValue !== null) stats[statKey] = parsedValue;
                    }
                });

                if (playerId) {
                    result[playerId] = stats;
                }
            });

            return result;
        }

        function parseCsv(csvText) {
            const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
            if (lines.length === 0) return { headers: [], rows: [] };
            const headers = parseCsvLine(lines[0]).map(cell => cell.trim());
            const rows = lines.slice(1).map(line => parseCsvLine(line).map(cell => cell.trim()))
                .filter(columns => columns.some(col => col.trim().length > 0));
            return { headers, rows };
        }

        function parseCsvLine(line) {
            const result = [];
            let current = '';
            let inQuotes = false;
            const sanitizedLine = line.replace(/\r$/, '');

            for (let i = 0; i < sanitizedLine.length; i++) {
                const char = sanitizedLine[i];
                if (inQuotes) {
                    if (char === '"') {
                        if (sanitizedLine[i + 1] === '"') {
                            current += '"';
                            i++;
                        } else {
                            inQuotes = false;
                        }
                    } else {
                        current += char;
                    }
                } else {
                    if (char === '"') {
                        inQuotes = true;
                    } else if (char === ',') {
                        result.push(current);
                        current = '';
                    } else {
                        current += char;
                    }
                }
            }
            result.push(current);
            return result;
        }

        function normalizeHeader(header) {
            return header.replace(/[\u00a0\u202f]/g, ' ').trim();
        }

        function parseStatValue(header, value) {
            const trimmed = value.trim();
            if (!trimmed || trimmed.toUpperCase() === 'NA') return null;

            if (header === 'SNP%') {
                const numericPortion = parseFloat(trimmed.replace('%', ''));
                if (Number.isNaN(numericPortion)) return null;
                if (trimmed.includes('%') || numericPortion > 1.5) {
                    return numericPortion;
                }
                return numericPortion * 100;
            }

            const num = parseFloat(trimmed);
            if (Number.isNaN(num)) return null;
            return num;
        }

        function processRosterData(rosters, users, tradedPicks, leagueInfo) {
            const userMap = users.reduce((acc, user) => ({ ...acc, [user.user_id]: user }), {});
            const rosterPositions = leagueInfo.roster_positions;
            const taxiSlots = leagueInfo.settings.taxi_slots || 0;

            const teams = rosters.map(roster => {
                const owner = userMap[roster.owner_id];
                const allPlayers = roster.players || [];

                const starterIds = roster.starters || [];
                const starters = starterIds.map((playerId, index) => {
                    const slot = rosterPositions[index] || 'FLEX';
                    return getPlayerData(playerId, slot);
                }).sort((a, b) => STARTER_ORDER.indexOf(a.slot) - STARTER_ORDER.indexOf(b.slot));

                const currentTaxiPlayers = (roster.taxi || []).map(p => getPlayerData(p, 'TX')).sort((a, b) => (b.ktc || 0) - (a.ktc || 0));
                const emptyTaxiSlots = Array(Math.max(0, taxiSlots - currentTaxiPlayers.length)).fill({ isPlaceholder: true });
                const taxi = [...currentTaxiPlayers, ...emptyTaxiSlots];

                const bench = allPlayers.filter(pId => pId && !starterIds.includes(pId) && !(roster.taxi || []).includes(pId));
                const draftPicks = getOwnedPicks(roster.roster_id, tradedPicks, leagueInfo);
               
               
               const isUserTeam = roster.owner_id === state.userId || 
               (roster.co_owners?.includes(state.userId) ?? false);

                return {
                    isUserTeam,
                    teamName: owner?.display_name || `Team ${roster.roster_id}`,
                    record: formatTeamRecord(roster.settings),
                    starters,
                    bench: bench.map(p => getPlayerData(p, 'BN')).sort((a, b) => (b.ktc || 0) - (a.ktc || 0)),
                    taxi,
                    draftPicks: draftPicks.map(p => getPickData(p, leagueInfo)),
                    allPlayers: allPlayers.map(pId => getPlayerData(pId, ''))
                };
            });

            state.currentTeams = teams;

            return teams.sort((a, b) => {
                if (a.isUserTeam) return -1;
                if (b.isUserTeam) return 1;
                return a.teamName.localeCompare(b.teamName);
            });
        }

        function formatTeamRecord(settings = {}) {
            const wins = Number.isFinite(settings?.wins) ? settings.wins : null;
            const losses = Number.isFinite(settings?.losses) ? settings.losses : null;
            const ties = Number.isFinite(settings?.ties) ? settings.ties : 0;

            if (wins === null || losses === null) {
                return null;
            }

            const baseRecord = `${wins}-${losses}`;
            return ties ? `${baseRecord}-${ties}` : baseRecord;
        }
        
        function getOwnedPicks(rosterId, tradedPicks, leagueInfo) {
            const defaultRounds = leagueInfo.settings.draft_rounds || 5;
            const leagueSeason = parseInt(leagueInfo.season);
            const firstPickSeason = leagueSeason + 1;
            let ownedPicks = [];

            for (let i = 0; i < 4; i++) {
                const season = firstPickSeason + i;
                for (let round = 1; round <= defaultRounds; round++) {
                    ownedPicks.push({ season: String(season), round, original_owner_id: rosterId });
                }
            }

            tradedPicks.forEach(pick => {
                if (pick.roster_id === rosterId && pick.owner_id !== rosterId) {
                    const i = ownedPicks.findIndex(p => p.season === pick.season && p.round === pick.round && p.original_owner_id === rosterId);
                    if (i > -1) ownedPicks.splice(i, 1);
                }
                if (pick.owner_id === rosterId && pick.roster_id !== rosterId) {
                    if (parseInt(pick.season) >= firstPickSeason) {
                        ownedPicks.push({ season: pick.season, round: pick.round, original_owner_id: pick.roster_id });
                    }
                }
            });
            ownedPicks = ownedPicks.filter(p => parseInt(p.season) < 2029);
            return ownedPicks.sort((a, b) => a.season.localeCompare(b.season) || a.round - b.round);
        }

        function getPlayerData(playerId, slot) {
            const player = state.players[playerId];
            if (!player) return { id: playerId, name: 'Unknown Player', pos: '?', age: '?', team: '?', adp: null, ktc: null, slot, posRank: null };
            const valueData = state.isSuperflex ? state.sflxData[playerId] : state.oneQbData[playerId];
            let lastName = player.last_name || '';
            if (lastName.length > 10) lastName = lastName.slice(0, 10) + '..'; // add ellipsis if truncated
            let displayName = `${player.first_name.charAt(0)}. ${lastName}`;

            // Prioritize age from the sheet and format it to one decimal place
            const ageFromSheet = valueData?.age;
            const formattedAge = (typeof ageFromSheet === 'number') ? ageFromSheet.toFixed(1) : (player.age ? Number(player.age).toFixed(1) : '?');

            return { 
                id: playerId, 
                name: displayName, 
                pos: player.position || '?', 
                age: formattedAge, // Use the new formatted age
                team: player.team || 'FA', 
                adp: valueData?.adp || null, 
                ktc: valueData?.ktc || null, 
                slot, 
                posRank: valueData?.posRank || null,
                overallRank: valueData?.overallRank || null
            };
        }

        function getPickData(pick) {
            const { season, round } = pick;
            const label = `${season} ${ordinalSuffix(round)}`;
            const staticVals = { oneqb: { 1: 5200, 2: 3200, 3: 2000, 4: 1200, 5: 400 }, sflx: { 1: 4300, 2: 2600, 3: 1700, 4: 1000, 5: 400 } };
            let ktc = null;
            if (parseInt(season) >= 2028 || round >= 5) {
                ktc = (state.isSuperflex ? staticVals.sflx : staticVals.oneqb)[round] || null;
            } else {
                const sfx = round === 1 ? 'st' : round === 2 ? 'nd' : round === 3 ? 'rd' : 'th';
                const ktcKey = `${season} Mid ${round}${sfx}`;
                const dataSet = state.isSuperflex ? state.sflxData : state.oneQbData;
                ktc = dataSet[ktcKey]?.ktc || null;
            }
            return { label, ktc, id: `${season}-${round}-${pick.original_owner_id}` };
        }

        // --- UI Rendering ---
        async function handlePlayerNameClick(player) {
            const fullPlayer = state.players[player.id];
            const playerName = fullPlayer ? `${fullPlayer.first_name} ${fullPlayer.last_name}` : player.name;

            modalPlayerName.textContent = `${playerName}`;
            if (modalPlayerVitals) {
                modalPlayerVitals.innerHTML = '';
            }
            document.getElementById('modal-summary-chips').innerHTML = ''; // Clear previous chips
            const existingHeaderContainer = document.querySelector('.modal-header-left-container');
            if(existingHeaderContainer) existingHeaderContainer.remove();
            modalBody.innerHTML = '<p class="text-center p-4">Loading game logs...</p>';

            if (state.isGameLogModalOpenFromComparison) {
                gameLogsModal.style.zIndex = '1050';
            }
            openModal();

            const gameLogs = await fetchGameLogs(player.id);
            const playerRanks = calculatePlayerStatsAndRanks(player.id);
            renderGameLogs(gameLogs, player, playerRanks);
        }

        function getOpponentRankColor(rank) {
            const numericRank = typeof rank === 'number' ? rank : parseFloat(rank);
            if (!Number.isFinite(numericRank)) return null;
            if (numericRank <= 8) return '#82d8be90';
            if (numericRank <= 16) return '#73b9e790';
            if (numericRank <= 24) return '#c093eb90';
            if (numericRank <= 32) return '#c456b190';
            return null;
        }

        function renderGameLogs(gameLogs, player, playerRanks) {
            const league = state.leagues.find(l => l.league_id === state.currentLeagueId);
            if (!league) return;
            const scoringSettings = league.scoring_settings;

            const fullPlayer = state.players[player.id];
            const playerName = fullPlayer ? `${fullPlayer.first_name} ${fullPlayer.last_name}` : player.name;

            const modalHeader = document.getElementById('modal-header');
            const headerContainer = document.createElement('div');
            headerContainer.className = 'modal-header-left-container';

            const posTag = document.createElement('div');
            posTag.className = `player-tag modal-pos-tag ${player.pos}`;
            posTag.textContent = player.pos;
            headerContainer.appendChild(posTag);

            const teamKey = (player.team || 'FA').toUpperCase();
            const logoKeyMap = { 'WSH': 'was', 'WAS': 'was', 'JAC': 'jax', 'LA': 'lar' };
            const normalizedKey = logoKeyMap[teamKey] || teamKey.toLowerCase();
            const src = `../assets/NFL-Tags_webp/${normalizedKey}.webp`;
            const teamLogoChip = document.createElement('div');
            teamLogoChip.className = 'player-tag modal-team-logo-chip';
            teamLogoChip.dataset.team = teamKey;
            teamLogoChip.innerHTML = (player.team && player.team !== 'FA')
              ? `<img class="team-logo glow" src="${src}" alt="${teamKey}" width="24" height="24" loading="eager">`
              : `<span>FA</span>`;
            headerContainer.appendChild(teamLogoChip);
            modalHeader.insertBefore(headerContainer, modalHeader.firstChild);

            if (modalPlayerVitals) {
                modalPlayerVitals.innerHTML = '';
                const vitals = getPlayerVitals(player.id);
                modalPlayerVitals.appendChild(createPlayerVitalsElement(vitals, { variant: 'modal' }));
            }

            // Render summary chips
            const summaryChipsContainer = document.getElementById('modal-summary-chips');
            summaryChipsContainer.innerHTML = `
                <div class="gamelogs-summary-chip">
                    <h4>
                        <span class="chip-header-value" style="color: ${getConditionalColorByRank(playerRanks.posRank, player.pos)}">${playerRanks.total_pts} </span>
                        <span class="chip-unit"> FPTS</span>
                    </h4>
                    <div class="chip-values">
                         <span class="pos-rank-container">
                            <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
                            <span style="color: ${getConditionalColorByRank(playerRanks.posRank, player.pos)}">${playerRanks.posRank || 'NA'}</span>
                        </span>
                        <span class="chip-separator">•</span>
                        <span style="color: ${getRankColor(playerRanks.overallRank)}">${typeof playerRanks.overallRank === 'number' ? '#' + playerRanks.overallRank : 'NA'}</span>
                    </div>
                </div>
                <div class="gamelogs-summary-chip">
                    <h4>
                        <span class="chip-header-value" style="color: ${getConditionalColorByRank(playerRanks.ppgPosRank, player.pos)}">${playerRanks.ppg}</span>
                        <span class="chip-unit"> PPG</span>
                    </h4>
                    <div class="chip-values">
                        <span class="pos-rank-container">
                            <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
                            <span style="color: ${getConditionalColorByRank(playerRanks.ppgPosRank, player.pos)}">${playerRanks.ppgPosRank || 'NA'}</span>
                        </span>
                      <span class="chip-separator">•</span>
                        <span style="color: ${getRankColor(playerRanks.ppgOverallRank)}">${typeof playerRanks.ppgOverallRank === 'number' ? '#' + playerRanks.ppgOverallRank : 'NA'}</span>
                    </div>
                </div>
                <div class="gamelogs-summary-chip">
                    <h4>
                        <span class="chip-header-value" style="color: ${getKtcColor(player.ktc)}">${player.ktc}</span>
                        <span class="chip-unit"> KTC</span>
                    </h4>
                    <div class="chip-values">
                        <span class="pos-rank-container">
                            <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
                            <span style="color: ${getConditionalColorByRank(parseInt(player.posRank?.split('·')[1], 10), player.pos)}">${player.posRank?.split('·')[1] || 'NA'}</span>
                        </span>
                        <span class="chip-separator">•</span>
                        <span style="color: ${getRankColor(player.overallRank)}">${typeof player.overallRank === 'number' ? '#' + player.overallRank : 'NA'}</span>
                    </div>
                </div>
            `;

            modalBody.innerHTML = ''; // Clear existing content

            if (!gameLogs || gameLogs.length === 0) {
                const noLogsEl = document.createElement('p');
                noLogsEl.className = 'no-logs';
                noLogsEl.textContent = `No game logs found for ${playerName} for the current season.`;
                modalBody.appendChild(noLogsEl);
                return;
            }

            const statLabels = buildStatLabels();

const qbStatOrder = [
  'fpts',
  'pass_rtg',
  'pass_yd',
  'pass_td',
  'pass_att',
  'pass_cmp',  
  'yds_total',  
  'rush_yd',
  'rush_td',
  'pass_fd',
  'imp_per_g',
  'pass_imp',
  'pass_imp_per_att',
  'rush_att',
  'ypc',
  'ttt',
  'prs_pct',
  'pass_sack',
  'pass_int',
  'fum',
  'fpoe'
];

const rbStatOrder = [
  'fpts',
  'snp_pct',
  'rush_att',
  'rush_yd',
  'ypc',
  'rush_td',
  'elu',
  'rec',
  'rec_tgt',
  'yds_total',
  'rec_yd',
  'mtf_per_att',
  'yco_per_att',  
  'mtf',
  'rush_yac',
  'rush_fd',
  'rec_td',
  'rec_fd',
  'rec_yar',
  'imp_per_g',
  'fum',
  'fpoe'
];

const wrTeStatOrder = [
  'fpts',
  'snp_pct',
  'rec_tgt',
  'rec',
  'ts_per_rr',
  'rec_yd',
  'rec_td',
  'yprr',
  'rec_fd',
  'first_down_rec_rate',
  'rec_yar',
  'ypr',
  'imp_per_g',
  'rr',
  'fpoe',
  'yds_total',
  'rush_att',
  'rush_yd',
  'rush_td',
  'ypc',
  'fum'
];
            let orderedStatKeys;
            if (player.pos === 'QB') orderedStatKeys = qbStatOrder;
            else if (player.pos === 'RB') orderedStatKeys = rbStatOrder;
            else if (player.pos === 'WR' || player.pos === 'TE') orderedStatKeys = wrTeStatOrder;
            else orderedStatKeys = ['fpts', 'pass_att', 'pass_cmp', 'pass_yd', 'pass_td', 'pass_fd', 'imp_per_g', 'pass_rtg', 'pass_imp', 'pass_imp_per_att', 'rush_att', 'rush_yd', 'ypc', 'rush_td', 'rush_fd', 'ttt', 'prs_pct', 'mtf', 'mtf_per_att', 'rush_yac', 'yco_per_att', 'rec_tgt', 'rec', 'rec_yd', 'rec_td', 'rec_fd', 'rec_yar', 'ypr', 'yprr', 'ts_per_rr', 'rr', 'fum', 'snp_pct', 'yds_total', 'fpoe'];

            const container = document.createElement('div');
            container.className = 'game-logs-table-container';

            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            const headerRow = document.createElement('tr');
            const wkTh = document.createElement('th');
            wkTh.classList.add('week-column-header');
            wkTh.textContent = 'WK';
            headerRow.appendChild(wkTh);

            for (const key of orderedStatKeys) {
                if (statLabels[key]) {
                    const th = document.createElement('th');
                    th.textContent = statLabels[key];
                    headerRow.appendChild(th);
                }
            }
            thead.appendChild(headerRow);

            const gameLogsWithData = [];
            gameLogs.sort((a, b) => parseInt(a.week) - parseInt(b.week)).forEach(weekStats => {
                let hasData = false;
                const row = document.createElement('tr');

                const weekTd = document.createElement('td');
                weekTd.classList.add('week-cell');

                const weekNumberSpan = document.createElement('span');
                weekNumberSpan.className = 'week-number';
                weekNumberSpan.textContent = weekStats.week;
                weekTd.appendChild(weekNumberSpan);
                const opponent = weekStats.stats?.opponent;
                if (opponent) {
                    const separatorSpan = document.createElement('span');
                    separatorSpan.className = 'week-opponent-separator';
                    separatorSpan.textContent = ' ·';
                    const weekNumberColor = typeof window !== 'undefined'
                        ? window.getComputedStyle(weekNumberSpan)?.color
                        : null;
                    if (weekNumberColor) {
                        separatorSpan.style.color = weekNumberColor;
                    }

                    const opponentSpan = document.createElement('span');
                    opponentSpan.className = 'week-opponent-label';
                    opponentSpan.textContent = ` ${opponent}`;
                    const color = getOpponentRankColor(weekStats.stats?.opponent_rank);
                    if (color) opponentSpan.style.color = color;

                    const opponentRank = weekStats.stats?.opponent_rank;
                    const opponentRankDisplay = getRankDisplayText(opponentRank);
                    if (opponentRankDisplay !== 'NA') {
                        opponentSpan.classList.add('has-rank-annotation');
                        const rankAnnotation = createRankAnnotation(opponentRank, { wrapInParens: false });
                        opponentSpan.appendChild(rankAnnotation);
                    }

                    weekTd.appendChild(separatorSpan);
                    weekTd.appendChild(opponentSpan);
                }
                row.appendChild(weekTd);

                const isLiveWeek = weekStats.stats?.__live === true;

                for (const key of orderedStatKeys) {
                    if (!statLabels[key]) continue;

                    if (isLiveWeek && key !== 'fpts') {
                        const td = document.createElement('td');
                        td.textContent = 'N/A';
                        row.appendChild(td);
                        continue;
                    }

                    let value;
                    if (NO_FALLBACK_KEYS.has(key)) {
                        const raw = weekStats.stats[key];
                        value = (typeof raw === 'number') ? raw : null;
                    } else if (key === 'fpts') value = calculateFantasyPoints(weekStats.stats, scoringSettings);
                    else if (key === 'ypc') value = (weekStats.stats['rush_att'] || 0) > 0 ? ((weekStats.stats['rush_yd'] || 0) / weekStats.stats['rush_att']) : 0;
                    else if (key === 'yco_per_att') value = (weekStats.stats['rush_att'] || 0) > 0 ? ((weekStats.stats['rush_yac'] || 0) / weekStats.stats['rush_att']) : 0;
                    else if (key === 'mtf_per_att') value = (weekStats.stats['rush_att'] || 0) > 0 ? ((weekStats.stats['mtf'] || 0) / weekStats.stats['rush_att']) : 0;
                    else if (key === 'pass_imp_per_att') {
                        const passImp = weekStats.stats['pass_imp'];
                        const passAtt = weekStats.stats['pass_att'];
                        if (typeof weekStats.stats[key] === 'number') value = weekStats.stats[key];
                        else if (typeof passImp === 'number' && typeof passAtt === 'number' && passAtt > 0) value = (passImp / passAtt) * 100;
                        else value = 0;
                    }
                    else if (key === 'ts_per_rr') {
                        if (typeof weekStats.stats[key] === 'number') value = weekStats.stats[key];
                        else {
                            const routes = weekStats.stats['rr'] || 0;
                            const targets = weekStats.stats['rec_tgt'] || 0;
                            value = routes > 0 ? (targets / routes) * 100 : 0;
                        }
                    }
                    else if (key === 'yprr') {
                        if (typeof weekStats.stats[key] === 'number') value = weekStats.stats[key];
                        else {
                            const routes = weekStats.stats['rr'] || 0;
                            const yards = weekStats.stats['rec_yd'] || 0;
                            value = routes > 0 ? yards / routes : 0;
                        }
                    }
                    else if (key === 'ypr') {
                        if (typeof weekStats.stats[key] === 'number') value = weekStats.stats[key];
                        else {
                            const receptions = weekStats.stats['rec'] || 0;
                            const yards = weekStats.stats['rec_yd'] || 0;
                            value = receptions > 0 ? yards / receptions : 0;
                        }
                    }
                    else if (key === 'first_down_rec_rate') {
                        if (typeof weekStats.stats[key] === 'number') value = weekStats.stats[key];
                        else {
                            const rec_fd = weekStats.stats['rec_fd'] || 0;
                            const rec = weekStats.stats['rec'] || 0;
                            value = rec > 0 ? (rec_fd / rec) : 0;
                        }
                    }
                    else if (key === 'imp_per_g') {
                        if (typeof weekStats.stats[key] === 'number') value = weekStats.stats[key];
                        else value = weekStats.stats['imp'] || 0;
                    }
                    else if (key === 'prs_pct' || key === 'snp_pct') value = typeof weekStats.stats[key] === 'number' ? weekStats.stats[key] : 0;
                    else if (key === 'ttt') value = typeof weekStats.stats[key] === 'number' ? weekStats.stats[key] : 0;
                    else value = weekStats.stats[key] || 0;

                    if (value > 0) hasData = true;

                    let displayValue;
                    if (value === null || typeof value !== 'number') displayValue = 'N/A';
                    else if (key === 'yco_per_att') displayValue = value.toFixed(2);
                    else if (key === 'mtf_per_att' || key === 'ypc' || key === 'ttt' || key === 'ypr' || key === 'yprr' || key === 'first_down_rec_rate') displayValue = value.toFixed(2);
                    else if (key === 'pass_imp_per_att' || key === 'prs_pct' || key === 'snp_pct' || key === 'ts_per_rr') displayValue = formatPercentage(value);
                    else displayValue = value.toFixed(2).replace(/\.00$/, '');

                    const td = document.createElement('td');
                    td.textContent = displayValue;
                    row.appendChild(td);
                }

                if (hasData) {
                    tbody.appendChild(row);
                    gameLogsWithData.push(weekStats);
                }
            });

            table.appendChild(thead);
            table.appendChild(tbody);

            // Add table footer for totals
            if (gameLogsWithData.length > 0) {
                const tfoot = document.createElement('tfoot');
                const footerRow = document.createElement('tr');
                const totalTh = document.createElement('th');
                totalTh.className = 'modal-table-footer-label week-column-header';
                const gamesPlayed = getAdjustedGamesPlayed(player.id, scoringSettings);
                totalTh.innerHTML = `<span class="season-label">2025</span><br><span class="gp-label">(GP: ${gamesPlayed})</span>`;
                footerRow.appendChild(totalTh);

                const seasonTotals = state.playerSeasonStats?.[player.id] || null;
                const aggregatedTotals = {};
                const snapPctValues = [];
                const statValueCounts = {};

                gameLogsWithData.forEach(weekStats => {
                    for (const key in weekStats.stats) {
                        const statValue = parseFloat(weekStats.stats[key]);
                        if (Number.isNaN(statValue)) continue;
                        if (key === 'snp_pct') {
                            snapPctValues.push(statValue);
                        } else {
                            aggregatedTotals[key] = (aggregatedTotals[key] || 0) + statValue;
                        }
                        statValueCounts[key] = (statValueCounts[key] || 0) + 1;
                    }
                });

                for (const key of orderedStatKeys) {
                    if (!statLabels[key]) continue;

                    const td = document.createElement('td');
                    let displayValue;
                    if (NO_FALLBACK_KEYS.has(key)) {
                        const raw = (seasonTotals && typeof seasonTotals[key] === 'number') ? seasonTotals[key] : null;
                        if (raw === null) {
                            displayValue = 'N/A';
                        } else if (key === 'snp_pct' || key === 'prs_pct' || key === 'ts_per_rr') {
                            displayValue = formatPercentage(raw);
                        } else {
                            displayValue = Number(raw).toFixed(2).replace(/\.00$/, '');
                        }
                    } else if (key === 'fpts') {
                        const totalPoints = gameLogsWithData.reduce((sum, week) => sum + calculateFantasyPoints(week.stats, scoringSettings), 0);
                        displayValue = totalPoints.toFixed(2).replace(/\.00$/, '');
                    } else if (key === 'ypc') {
                        const totalYards = seasonTotals && typeof seasonTotals.rush_yd === 'number' ? seasonTotals.rush_yd : (aggregatedTotals['rush_yd'] || 0);
                        const totalCarries = seasonTotals && typeof seasonTotals.rush_att === 'number' ? seasonTotals.rush_att : (aggregatedTotals['rush_att'] || 0);
                        const avgYpc = totalCarries > 0 ? totalYards / totalCarries : 0;
                        displayValue = avgYpc.toFixed(2);
                    } else if (key === 'yco_per_att') {
                        const totalYco = seasonTotals && typeof seasonTotals.rush_yac === 'number' ? seasonTotals.rush_yac : (aggregatedTotals['rush_yac'] || 0);
                        const totalCarries = seasonTotals && typeof seasonTotals.rush_att === 'number' ? seasonTotals.rush_att : (aggregatedTotals['rush_att'] || 0);
                        const avgYcoPerCar = totalCarries > 0 ? totalYco / totalCarries : 0;
                        displayValue = avgYcoPerCar.toFixed(2);
                    } else if (key === 'mtf_per_att') {
                        const totalMtf = seasonTotals && typeof seasonTotals.mtf === 'number' ? seasonTotals.mtf : (aggregatedTotals['mtf'] || 0);
                        const totalCarries = seasonTotals && typeof seasonTotals.rush_att === 'number' ? seasonTotals.rush_att : (aggregatedTotals['rush_att'] || 0);
                        const avgMtfPerAtt = totalCarries > 0 ? totalMtf / totalCarries : 0;
                        displayValue = avgMtfPerAtt.toFixed(2);
                    } else if (key === 'pass_rtg') {
                        if (seasonTotals && typeof seasonTotals.pass_rtg === 'number') {
                            const rating = seasonTotals.pass_rtg;
                            displayValue = Number.isInteger(rating) ? String(rating) : rating.toFixed(2).replace(/\.00$/, '');
                        } else {
                            const totalPassRtg = aggregatedTotals['pass_rtg'] || 0;
                            const gamesWithPassAttempts = gameLogsWithData.filter(w => (w.stats['pass_att'] || 0) > 0).length;
                            const avgPassRtg = gamesWithPassAttempts > 0 ? totalPassRtg / gamesWithPassAttempts : 0;
                            displayValue = avgPassRtg.toFixed(2).replace(/\.00$/, '');
                        }
                    } else if (key === 'pass_imp_per_att') {
                        let pctValue = seasonTotals && typeof seasonTotals.pass_imp_per_att === 'number' ? seasonTotals.pass_imp_per_att : null;
                        if (pctValue === null) {
                            const totalPassImp = seasonTotals && typeof seasonTotals.pass_imp === 'number' ? seasonTotals.pass_imp : (aggregatedTotals['pass_imp'] || 0);
                            const totalPassAtt = seasonTotals && typeof seasonTotals.pass_att === 'number' ? seasonTotals.pass_att : (aggregatedTotals['pass_att'] || 0);
                            if (totalPassAtt > 0) pctValue = (totalPassImp / totalPassAtt) * 100;
                            else if (statValueCounts['pass_imp_per_att']) pctValue = (aggregatedTotals['pass_imp_per_att'] || 0) / statValueCounts['pass_imp_per_att'];
                            else pctValue = 0;
                        }
                        displayValue = formatPercentage(pctValue);
                    } else if (key === 'ttt') {
                        let avgTtt = seasonTotals && typeof seasonTotals.ttt === 'number' ? seasonTotals.ttt : null;
                        if (avgTtt === null) {
                            const totalTtt = aggregatedTotals['ttt'] || 0;
                            const count = statValueCounts['ttt'] || 0;
                            avgTtt = count > 0 ? totalTtt / count : 0;
                        }
                        displayValue = Number(avgTtt).toFixed(2).replace(/\.00$/, '');
                    } else if (key === 'prs_pct') {
                        let pctValue = seasonTotals && typeof seasonTotals.prs_pct === 'number' ? seasonTotals.prs_pct : null;
                        if (pctValue === null) {
                            const total = aggregatedTotals['prs_pct'] || 0;
                            const count = statValueCounts['prs_pct'] || 0;
                            pctValue = count > 0 ? total / count : 0;
                        }
                        displayValue = formatPercentage(pctValue);
                    } else if (key === 'snp_pct') {
                        let pctValue = seasonTotals && typeof seasonTotals.snp_pct === 'number' ? seasonTotals.snp_pct : null;
                        if (pctValue === null) {
                            pctValue = snapPctValues.length > 0 ? snapPctValues.reduce((sum, val) => sum + val, 0) / snapPctValues.length : 0;
                        }
                        displayValue = formatPercentage(pctValue);
                    } else if (key === 'imp_per_g') {
                        let impPerGame = seasonTotals && typeof seasonTotals.imp_per_g === 'number' ? seasonTotals.imp_per_g : null;
                        if (impPerGame === null) {
                            const totalImp = seasonTotals && typeof seasonTotals.imp === 'number' ? seasonTotals.imp : (aggregatedTotals['imp'] || 0);
                            const games = seasonTotals && typeof seasonTotals.games_played === 'number' ? seasonTotals.games_played : gameLogsWithData.length;
                            impPerGame = games > 0 ? totalImp / games : 0;
                        }
                        displayValue = Number(impPerGame).toFixed(2).replace(/\.00$/, '');
                    } else if (key === 'yprr') {
                        let value = seasonTotals && typeof seasonTotals.yprr === 'number' ? seasonTotals.yprr : null;
                        if (value === null) {
                            const totalRoutes = seasonTotals && typeof seasonTotals.rr === 'number' ? seasonTotals.rr : (aggregatedTotals['rr'] || 0);
                            const totalRecYds = seasonTotals && typeof seasonTotals.rec_yd === 'number' ? seasonTotals.rec_yd : (aggregatedTotals['rec_yd'] || 0);
                            value = totalRoutes > 0 ? totalRecYds / totalRoutes : 0;
                        }
                        displayValue = Number(value).toFixed(2).replace(/\.00$/, '');
                    } else if (key === 'ts_per_rr') {
                        let pctValue = seasonTotals && typeof seasonTotals.ts_per_rr === 'number' ? seasonTotals.ts_per_rr : null;
                        if (pctValue === null) {
                            const totalRoutes = seasonTotals && typeof seasonTotals.rr === 'number' ? seasonTotals.rr : (aggregatedTotals['rr'] || 0);
                            const totalTargets = seasonTotals && typeof seasonTotals.rec_tgt === 'number' ? seasonTotals.rec_tgt : (aggregatedTotals['rec_tgt'] || 0);
                            pctValue = totalRoutes > 0 ? (totalTargets / totalRoutes) * 100 : 0;
                        }
                        displayValue = formatPercentage(pctValue);
                    } else if (key === 'ypr') {
                        let value = seasonTotals && typeof seasonTotals.ypr === 'number' ? seasonTotals.ypr : null;
                        if (value === null) {
                            const totalReceptions = seasonTotals && typeof seasonTotals.rec === 'number' ? seasonTotals.rec : (aggregatedTotals['rec'] || 0);
                            const totalRecYds = seasonTotals && typeof seasonTotals.rec_yd === 'number' ? seasonTotals.rec_yd : (aggregatedTotals['rec_yd'] || 0);
                            value = totalReceptions > 0 ? totalRecYds / totalReceptions : 0;
                        }
                        displayValue = Number(value).toFixed(2).replace(/\.00$/, '');
                    } else if (key === 'first_down_rec_rate') {
                        let value = seasonTotals && typeof seasonTotals.first_down_rec_rate === 'number' ? seasonTotals.first_down_rec_rate : null;
                        if (value === null) {
                            const totalRecFd = seasonTotals && typeof seasonTotals.rec_fd === 'number' ? seasonTotals.rec_fd : (aggregatedTotals['rec_fd'] || 0);
                            const totalRec = seasonTotals && typeof seasonTotals.rec === 'number' ? seasonTotals.rec : (aggregatedTotals['rec'] || 0);
                            value = totalRec > 0 ? (totalRecFd / totalRec) : 0;
                        }
                        displayValue = Number(value).toFixed(2);
                    } else {
                        const totalValue = seasonTotals && typeof seasonTotals[key] === 'number' ? seasonTotals[key] : (aggregatedTotals[key] || 0);
                        displayValue = Number.isInteger(totalValue) ? String(totalValue) : Number(totalValue || 0).toFixed(2).replace(/\.00$/, '');
                    }
                    const rankValue = getSeasonRankValue(player.id, key);
                    const rankAnnotation = createRankAnnotation(rankValue);
                    td.textContent = displayValue;
                    td.appendChild(rankAnnotation);
                    td.classList.add('has-rank-annotation');
                    td.style.color = getConditionalColorByRank(rankValue, player.pos);
                    footerRow.appendChild(td);
                }
                tfoot.appendChild(footerRow);
                table.appendChild(tfoot);
            }

            container.appendChild(table);
            modalBody.appendChild(container);
            modalBody.scrollLeft = 0;

            // Set player vitals width to match summary chips
            const summaryChipsWidth = summaryChipsContainer.offsetWidth;
            const playerVitalsElement = document.querySelector('.player-vitals--modal');
            if (playerVitalsElement) {
                playerVitalsElement.style.width = `${summaryChipsWidth}px`;
            }
        }

        async function handlePlayerCompare(e) {
            const selectedPlayersWithTeams = [];
            for (const teamName in state.tradeBlock) {
                if (Object.prototype.hasOwnProperty.call(state.tradeBlock, teamName)) {
                    const assets = state.tradeBlock[teamName];
                    assets.forEach(asset => {
                        if (asset.pos !== 'DP') {
                            const fullPlayer = state.players[asset.id];
                            const playerName = fullPlayer
                                ? `${fullPlayer.first_name} ${fullPlayer.last_name}`
                                : asset.label;
                            const normalizedTeam = (asset.team || fullPlayer?.team || 'FA').toUpperCase();
                            const primaryPos = (asset.basePos || fullPlayer?.position || asset.pos || '').toUpperCase();

                            selectedPlayersWithTeams.push({
                                ...asset,
                                teamName,
                                name: playerName,
                                pos: primaryPos || asset.pos,
                                displayPos: asset.pos,
                                team: normalizedTeam
                            });
                        }
                    });
                }
            }


            // Sort to ensure user's player is first
            selectedPlayersWithTeams.sort((a, b) => {
                if (a.teamName === state.userTeamName) return -1;
                if (b.teamName === state.userTeamName) return 1;
                return 0;
            });

            const comparisonModalBody = document.getElementById('comparison-modal-body');
            comparisonModalBody.innerHTML = '<p class="text-center p-4">Loading player comparison...</p>';
            openComparisonModal();

            const playerData = await Promise.all(selectedPlayersWithTeams.map(async (player) => {
                const gameLogs = await fetchGameLogs(player.id);
                const playerRanks = calculatePlayerStatsAndRanks(player.id);
                const seasonStats = state.playerSeasonStats?.[player.id] || null;
                return { ...player, gameLogs, seasonStats, ...playerRanks };
            }));

            renderPlayerComparison(playerData);
        }

        function renderPlayerComparison(players) {
            const comparisonModalBody = document.getElementById('comparison-modal-body');
            comparisonModalBody.innerHTML = ''; // Clear existing content

            const container = document.createElement('div');
            container.className = 'player-comparison-container';

            // Player Names Row
            const playerNamesRow = document.createElement('div');
            playerNamesRow.className = 'player-names-row';
            players.forEach(player => {
                const fullPlayer = state.players[player.id];
                const playerName = player.name || (fullPlayer ? `${fullPlayer.first_name} ${fullPlayer.last_name}` : player.label);

                const headerContainer = document.createElement('div');
                headerContainer.className = 'player-name-header-container';

                const nameHeader = document.createElement('div');
                nameHeader.className = 'player-name-header';

                const nameButton = document.createElement('button');
                nameButton.type = 'button';
                nameButton.className = 'player-name-header-link';
                nameButton.textContent = playerName;
                nameButton.onclick = () => {
                    state.isGameLogModalOpenFromComparison = true;

                    const rosterMeta = getPlayerData(player.id, player.displayPos || player.pos || '');
                    const valuations = state.isSuperflex ? state.sflxData[player.id] : state.oneQbData[player.id];

                    const parseNumeric = (value) => {
                        if (typeof value === 'number' && Number.isFinite(value)) return value;
                        if (typeof value === 'string') {
                            const stripped = value.replace(/[^0-9.\-]/g, '');
                            const parsed = Number(stripped);
                            return Number.isFinite(parsed) ? parsed : null;
                        }
                        const parsed = Number(value);
                        return Number.isFinite(parsed) ? parsed : null;
                    };

                    const firstValidNumber = (candidates, { allowZero = false } = {}) => {
                        for (const candidate of candidates) {
                            const parsed = parseNumeric(candidate);
                            if (parsed === null) continue;
                            if (!allowZero && parsed <= 0) continue;
                            return parsed;
                        }
                        return null;
                    };

                    const basePos = (player.pos || rosterMeta.pos || fullPlayer?.position || '').toUpperCase();
                    const canonicalPos = basePos || 'FA';
                    const resolvedTeam = (player.team || rosterMeta.team || fullPlayer?.team || 'FA').toUpperCase();

                    const ktcValue = firstValidNumber([
                        player.ktc,
                        rosterMeta.ktc,
                        valuations?.ktc
                    ]);

                    const overallRankValue = firstValidNumber([
                        player.overallRank,
                        rosterMeta.overallRank,
                        valuations?.overallRank,
                        valuations?.overall_rank_ppr
                    ]);

                    const posRankNumeric = firstValidNumber([
                        player.posRank,
                        rosterMeta.posRank,
                        valuations?.posRank,
                        valuations?.pos_rank_ppr
                    ]);

                    const mergedPlayerData = {
                        id: player.id,
                        name: player.name || playerName,
                        pos: canonicalPos,
                        team: resolvedTeam,
                        ktc: ktcValue,
                        overallRank: overallRankValue ?? null,
                        posRank: posRankNumeric ? `${canonicalPos}·${posRankNumeric}` : null
                    };

                    handlePlayerNameClick(mergedPlayerData);
                };
                const tagsRow = document.createElement('div');
                tagsRow.className = 'player-header-tags';

                const posTag = document.createElement('div');
                posTag.className = `player-tag modal-pos-tag ${player.pos}`;
                posTag.textContent = player.pos;

                const teamKey = (player.team || fullPlayer?.team || 'FA').toUpperCase();
                const logoKeyMap = { 'WSH': 'was', 'WAS': 'was', 'JAC': 'jax', 'LA': 'lar' };
                const normalizedKey = logoKeyMap[teamKey] || teamKey.toLowerCase();
                const src = `../assets/NFL-Tags_webp/${normalizedKey}.webp`;
                const teamLogoChip = document.createElement('div');
                teamLogoChip.className = 'player-tag modal-team-logo-chip';
                if (teamKey && teamKey !== 'FA') {
                    teamLogoChip.dataset.team = teamKey;
                    teamLogoChip.innerHTML = `<img class="team-logo glow" src="${src}" alt="${teamKey}" width="20" height="20" loading="eager">`;
                } else {
                    teamLogoChip.innerHTML = '<span>FA</span>';
                }

                tagsRow.appendChild(posTag);
                tagsRow.appendChild(teamLogoChip);

                nameHeader.appendChild(nameButton);
                nameHeader.appendChild(tagsRow);
                headerContainer.appendChild(nameHeader);

                playerNamesRow.appendChild(headerContainer);
            });
            container.appendChild(playerNamesRow);
        
            // Summary Chips Row
            const summaryChipsRow = document.createElement('div');
            summaryChipsRow.className = 'comparison-summary-chips-row';

            players.forEach(player => {
                const summaryChipsContainer = document.createElement('div');
                summaryChipsContainer.className = 'summary-chips-container';
                const compareVitals = createPlayerVitalsElement(getPlayerVitals(player.id), { variant: 'compare' });

                const overallRankNumber = typeof player.overallRank === 'number' ? player.overallRank : Number(player.overallRank);
                const overallRankDisplay = Number.isFinite(overallRankNumber)
                  ? `#${overallRankNumber}`
                  : (player.overallRank || 'NA');

                const rawPosRank = player.posRank;
                const posRankNumber = typeof rawPosRank === 'number'
                  ? rawPosRank
                  : Number.parseInt(String(rawPosRank).split('·')[1] || String(rawPosRank), 10);
                const posRankDisplay = Number.isFinite(posRankNumber)
                  ? posRankNumber
                  : (rawPosRank || 'NA');
                const posRankColor = Number.isFinite(posRankNumber)
                  ? getConditionalColorByRank(posRankNumber, player.pos)
                  : 'inherit';

                const ppgOverallRankNumber = typeof player.ppgOverallRank === 'number'
                  ? player.ppgOverallRank
                  : Number(player.ppgOverallRank);
                const ppgOverallRankDisplay = Number.isFinite(ppgOverallRankNumber)
                  ? `#${ppgOverallRankNumber}`
                  : (player.ppgOverallRank || 'NA');

                const ppgPosRankNumber = typeof player.ppgPosRank === 'number'
                  ? player.ppgPosRank
                  : Number(player.ppgPosRank);
                const ppgPosRankDisplay = Number.isFinite(ppgPosRankNumber)
                  ? ppgPosRankNumber
                  : (player.ppgPosRank || 'NA');
                const ppgPosRankColor = Number.isFinite(ppgPosRankNumber)
                  ? getConditionalColorByRank(ppgPosRankNumber, player.pos)
                  : 'inherit';

                summaryChipsContainer.innerHTML = `
                  <div class="summary-chip">
                    <h4>
                      <span class="chip-header-value" style="color: ${posRankColor}">${player.total_pts}</span>
                      <span class="chip-unit"> FPTS</span>
                    </h4>
                    <div class="chip-values">
                      <span class="pos-rank-container">
                        <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
                        <span style="color: ${posRankColor}">${posRankDisplay}</span>
                      </span>
                      <span class="chip-separator">•</span>
                      <span style="color: ${getRankColor(overallRankNumber)}">${overallRankDisplay}</span>
                    </div>
                  </div>

                  <div class="summary-chip">
                    <h4>
                      <span class="chip-header-value" style="color: ${ppgPosRankColor}">${player.ppg}</span>
                      <span class="chip-unit"> PPG</span>
                    </h4>
                    <div class="chip-values">
                      <span class="pos-rank-container">
                        <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
                        <span style="color: ${ppgPosRankColor}">${ppgPosRankDisplay}</span>
                      </span>
                      <span class="chip-separator">•</span>
                      <span style="color: ${getRankColor(ppgOverallRankNumber)}">${ppgOverallRankDisplay}</span>
                    </div>
                  </div>
                `;
                summaryChipsContainer.insertBefore(compareVitals, summaryChipsContainer.firstChild);
                summaryChipsRow.appendChild(summaryChipsContainer);
            });

            container.appendChild(summaryChipsRow);


            // Detailed Stats Table
            const table = document.createElement('table');
            table.className = 'player-comparison-table';
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            // Table Header
            const tr = document.createElement('tr');
            players.forEach((player, index) => {
                const fullPlayer = state.players[player.id];
                const playerName = fullPlayer ? `${fullPlayer.first_name} ${fullPlayer.last_name}` : player.label;
                const th = document.createElement('th');
                th.className = 'player-header';
                th.innerHTML = `<h4>${playerName}</h4>`;
                tr.appendChild(th);
                if (index === 0) {
                    const statTh = document.createElement('th');
                    statTh.textContent = 'STAT';
                    statTh.className = 'stat-header';
                    tr.appendChild(statTh);
                }
            });
            if (players.length === 0) {
                const statTh = document.createElement('th');
                statTh.textContent = 'STAT';
                statTh.className = 'stat-header';
                tr.appendChild(statTh);
            }
            thead.appendChild(tr);

            // Table Body
            const statLabels = buildStatLabels();

            const userPlayer = players[0];
            const otherPlayer = players[1];

const qbStatOrder = [
  'fpts',
  'pass_rtg',
  'pass_yd',
  'pass_td',
  'pass_att',
  'pass_cmp',  
  'yds_total',  
  'rush_yd',
  'rush_td',
  'pass_fd',
  'imp_per_g',
  'pass_imp',
  'pass_imp_per_att',
  'rush_att',
  'ypc',
  'ttt',
  'prs_pct',
  'pass_sack',
  'pass_int',
  'fum',
  'fpoe'
];

const rbStatOrder = [
  'fpts',
  'snp_pct',
  'rush_att',
  'rush_yd',
  'ypc',
  'rush_td',
  'elu',
  'rec',
  'rec_tgt',
  'yds_total',
  'rec_yd',
  'mtf_per_att',
  'yco_per_att',  
  'mtf',
  'rush_yac',
  'rush_fd',
  'rec_td',
  'rec_fd',
  'rec_yar',
  'imp_per_g',
  'fum',
  'fpoe'
];

const wrTeStatOrder = [
  'fpts',
  'snp_pct',
  'rec_tgt',
  'rec',
  'ts_per_rr',
  'rec_yd',
  'rec_td',
  'yprr',
  'rec_fd',
  'first_down_rec_rate',
  'rec_yar',
  'ypr',
  'imp_per_g',
  'rr',
  'fpoe',
  'yds_total',
  'rush_att',
  'rush_yd',
  'rush_td',
  'ypc',
  'fum'
];

            const getStatOrderForPosition = (pos) => {
                if (pos === 'QB') return qbStatOrder;
                if (pos === 'RB') return rbStatOrder;
                if (pos === 'WR' || pos === 'TE') return wrTeStatOrder;
                return ['fpts', 'pass_att', 'pass_cmp', 'pass_yd', 'pass_td', 'pass_fd', 'imp_per_g', 'pass_rtg', 'pass_imp', 'pass_imp_per_att', 'rush_att', 'rush_yd', 'ypc', 'rush_td', 'rush_fd', 'ttt', 'prs_pct', 'mtf', 'mtf_per_att', 'rush_yac', 'yco_per_att', 'rec_tgt', 'rec', 'rec_yd', 'rec_td', 'rec_fd', 'rec_yar', 'ypr', 'yprr', 'ts_per_rr', 'rr', 'fum', 'snp_pct', 'yds_total', 'fpoe'];
            };

            const userPlayerStatOrder = getStatOrderForPosition(userPlayer.pos);
            const otherPlayerStatOrder = getStatOrderForPosition(otherPlayer.pos);

            const commonStats = userPlayerStatOrder.filter(stat => otherPlayerStatOrder.includes(stat));
            const userSpecificStats = userPlayerStatOrder.filter(stat => !otherPlayerStatOrder.includes(stat));
            const otherSpecificStats = otherPlayerStatOrder.filter(stat => !userPlayerStatOrder.includes(stat));

            const orderedStatKeys = [...commonStats, ...userSpecificStats, ...otherSpecificStats];

            const league = state.leagues.find(l => l.league_id === state.currentLeagueId);
            const scoringSettings = league?.scoring_settings || {};

            for (const statKey of orderedStatKeys) {
                if (statLabels[statKey]) {
                    const row = document.createElement('tr');
                    const labelCell = document.createElement('td');
                    labelCell.textContent = statLabels[statKey];
                    labelCell.className = 'stat-label-cell';

                    let bestValue = -Infinity;
                    let bestValueIndices = [];
                    const values = [];
                    const displayValues = [];
                    const rankAnnotations = [];
                    let bestRank = Infinity;
                    let bestRankIndices = [];

                    for (let i = 0; i < players.length; i++) {
                        const player = players[i];
                        let calculatedValue;
                        let displayValue;

                        const seasonTotals = player.seasonStats || state.playerSeasonStats?.[player.id] || null;
                        const aggregatedTotals = {};
                        const snapPctValues = [];
                        const statValueCounts = {};

                        player.gameLogs.forEach(week => {
                            for (const key in week.stats) {
                                const numericValue = parseFloat(week.stats[key]);
                                if (Number.isNaN(numericValue)) continue;
                                if (key === 'snp_pct') {
                                    snapPctValues.push(numericValue);
                                } else {
                                    aggregatedTotals[key] = (aggregatedTotals[key] || 0) + numericValue;
                                }
                                statValueCounts[key] = (statValueCounts[key] || 0) + 1;
                            }
                        });

                        if (NO_FALLBACK_KEYS.has(statKey)) {
                            const raw = (seasonTotals && typeof seasonTotals[statKey] === 'number') ? seasonTotals[statKey] : null;
                            calculatedValue = (raw === null) ? null : raw;
                            if (raw === null) displayValue = 'N/A';
                            else if (statKey === 'snp_pct' || statKey === 'prs_pct' || statKey === 'ts_per_rr') displayValue = formatPercentage(raw);
                            else displayValue = Number(raw).toFixed(2).replace(/\.00$/, '');
                        } else switch (statKey) {
                            case 'fpts':
                                calculatedValue = player.gameLogs.reduce((sum, week) => sum + calculateFantasyPoints(week.stats, scoringSettings), 0);
                                displayValue = calculatedValue.toFixed(2).replace(/\.00$/, '');
                                break;
                            case 'ypc':
                                {
                                    const totalYards = seasonTotals && typeof seasonTotals.rush_yd === 'number' ? seasonTotals.rush_yd : (aggregatedTotals['rush_yd'] || 0);
                                    const totalCarries = seasonTotals && typeof seasonTotals.rush_att === 'number' ? seasonTotals.rush_att : (aggregatedTotals['rush_att'] || 0);
                                    calculatedValue = totalCarries > 0 ? totalYards / totalCarries : 0;
                                }
                                displayValue = calculatedValue.toFixed(2);
                                break;
                            case 'yco_per_att':
                                {
                                    const totalYco = seasonTotals && typeof seasonTotals.rush_yac === 'number' ? seasonTotals.rush_yac : (aggregatedTotals['rush_yac'] || 0);
                                    const totalCarriesYco = seasonTotals && typeof seasonTotals.rush_att === 'number' ? seasonTotals.rush_att : (aggregatedTotals['rush_att'] || 0);
                                    calculatedValue = totalCarriesYco > 0 ? totalYco / totalCarriesYco : 0;
                                }
                                displayValue = calculatedValue.toFixed(2);
                                break;
                            case 'mtf_per_att':
                                {
                                    const totalMtf = seasonTotals && typeof seasonTotals.mtf === 'number' ? seasonTotals.mtf : (aggregatedTotals['mtf'] || 0);
                                    const totalCarriesMtf = seasonTotals && typeof seasonTotals.rush_att === 'number' ? seasonTotals.rush_att : (aggregatedTotals['rush_att'] || 0);
                                    calculatedValue = totalCarriesMtf > 0 ? totalMtf / totalCarriesMtf : 0;
                                }
                                displayValue = calculatedValue.toFixed(2);
                                break;
                            case 'pass_rtg':
                                if (seasonTotals && typeof seasonTotals.pass_rtg === 'number') {
                                    calculatedValue = seasonTotals.pass_rtg;
                                    displayValue = Number.isInteger(calculatedValue) ? String(calculatedValue) : calculatedValue.toFixed(2).replace(/\.00$/, '');
                                } else {
                                    const totalPassRtg = aggregatedTotals['pass_rtg'] || 0;
                                    const gamesWithPassAttempts = player.gameLogs.filter(w => (w.stats['pass_att'] || 0) > 0).length;
                                    calculatedValue = gamesWithPassAttempts > 0 ? totalPassRtg / gamesWithPassAttempts : 0;
                                    displayValue = calculatedValue.toFixed(2).replace(/\.00$/, '');
                                }
                                break;
                            case 'pass_imp_per_att':
                                {
                                    if (seasonTotals && typeof seasonTotals.pass_imp_per_att === 'number') {
                                        calculatedValue = seasonTotals.pass_imp_per_att;
                                    } else {
                                        const totalPassImp = seasonTotals && typeof seasonTotals.pass_imp === 'number' ? seasonTotals.pass_imp : (aggregatedTotals['pass_imp'] || 0);
                                        const totalPassAtt = seasonTotals && typeof seasonTotals.pass_att === 'number' ? seasonTotals.pass_att : (aggregatedTotals['pass_att'] || 0);
                                        if (totalPassAtt > 0) calculatedValue = (totalPassImp / totalPassAtt) * 100;
                                        else if (statValueCounts['pass_imp_per_att']) calculatedValue = (aggregatedTotals['pass_imp_per_att'] || 0) / statValueCounts['pass_imp_per_att'];
                                        else calculatedValue = 0;
                                    }
                                }
                                displayValue = formatPercentage(calculatedValue);
                                break;
                            case 'ttt':
                                {
                                    if (seasonTotals && typeof seasonTotals.ttt === 'number') {
                                        calculatedValue = seasonTotals.ttt;
                                    } else {
                                        const totalTtt = aggregatedTotals['ttt'] || 0;
                                        const count = statValueCounts['ttt'] || 0;
                                        calculatedValue = count > 0 ? totalTtt / count : 0;
                                    }
                                }
                                displayValue = Number(calculatedValue).toFixed(2).replace(/\.00$/, '');
                                break;
                            case 'prs_pct':
                                {
                                    if (seasonTotals && typeof seasonTotals.prs_pct === 'number') {
                                        calculatedValue = seasonTotals.prs_pct;
                                    } else {
                                        const total = aggregatedTotals['prs_pct'] || 0;
                                        const count = statValueCounts['prs_pct'] || 0;
                                        calculatedValue = count > 0 ? total / count : 0;
                                    }
                                }
                                displayValue = formatPercentage(calculatedValue);
                                break;
                            case 'snp_pct':
                                {
                                    const pct = seasonTotals && typeof seasonTotals.snp_pct === 'number'
                                        ? seasonTotals.snp_pct
                                        : (snapPctValues.length > 0 ? snapPctValues.reduce((sum, val) => sum + val, 0) / snapPctValues.length : 0);
                                    calculatedValue = pct;
                                    displayValue = formatPercentage(pct);
                                }
                                break;
                            case 'imp_per_g':
                                {
                                    if (seasonTotals && typeof seasonTotals.imp_per_g === 'number') {
                                        calculatedValue = seasonTotals.imp_per_g;
                                    } else {
                                        const totalImp = seasonTotals && typeof seasonTotals.imp === 'number' ? seasonTotals.imp : (aggregatedTotals['imp'] || 0);
                                        const games = seasonTotals && typeof seasonTotals.games_played === 'number' ? seasonTotals.games_played : player.gameLogs.length;
                                        calculatedValue = games > 0 ? totalImp / games : 0;
                                    }
                                }
                                displayValue = Number(calculatedValue).toFixed(2).replace(/\.00$/, '');
                                break;
                            case 'yprr':
                                {
                                    if (seasonTotals && typeof seasonTotals.yprr === 'number') {
                                        calculatedValue = seasonTotals.yprr;
                                    } else {
                                        const totalRoutes = seasonTotals && typeof seasonTotals.rr === 'number' ? seasonTotals.rr : (aggregatedTotals['rr'] || 0);
                                        const totalRecYds = seasonTotals && typeof seasonTotals.rec_yd === 'number' ? seasonTotals.rec_yd : (aggregatedTotals['rec_yd'] || 0);
                                        calculatedValue = totalRoutes > 0 ? totalRecYds / totalRoutes : 0;
                                    }
                                }
                                displayValue = Number(calculatedValue).toFixed(2).replace(/\.00$/, '');
                                break;
                            case 'ts_per_rr':
                                {
                                    if (seasonTotals && typeof seasonTotals.ts_per_rr === 'number') {
                                        calculatedValue = seasonTotals.ts_per_rr;
                                    } else {
                                        const totalRoutes = seasonTotals && typeof seasonTotals.rr === 'number' ? seasonTotals.rr : (aggregatedTotals['rr'] || 0);
                                        const totalTargets = seasonTotals && typeof seasonTotals.rec_tgt === 'number' ? seasonTotals.rec_tgt : (aggregatedTotals['rec_tgt'] || 0);
                                        calculatedValue = totalRoutes > 0 ? (totalTargets / totalRoutes) * 100 : 0;
                                    }
                                }
                                displayValue = formatPercentage(calculatedValue);
                                break;
                            case 'ypr':
                                {
                                    if (seasonTotals && typeof seasonTotals.ypr === 'number') {
                                        calculatedValue = seasonTotals.ypr;
                                    } else {
                                        const totalReceptions = seasonTotals && typeof seasonTotals.rec === 'number' ? seasonTotals.rec : (aggregatedTotals['rec'] || 0);
                                        const totalRecYds = seasonTotals && typeof seasonTotals.rec_yd === 'number' ? seasonTotals.rec_yd : (aggregatedTotals['rec_yd'] || 0);
                                        calculatedValue = totalReceptions > 0 ? totalRecYds / totalReceptions : 0;
                                    }
                                }
                                displayValue = Number(calculatedValue).toFixed(2).replace(/\.00$/, '');
                                break;
                            case 'first_down_rec_rate':
                                {
                                    if (seasonTotals && typeof seasonTotals.first_down_rec_rate === 'number') {
                                        calculatedValue = seasonTotals.first_down_rec_rate;
                                    } else {
                                        const totalRecFd = seasonTotals && typeof seasonTotals.rec_fd === 'number' ? seasonTotals.rec_fd : (aggregatedTotals['rec_fd'] || 0);
                                        const totalRec = seasonTotals && typeof seasonTotals.rec === 'number' ? seasonTotals.rec : (aggregatedTotals['rec'] || 0);
                                        calculatedValue = totalRec > 0 ? (totalRecFd / totalRec) : 0;
                                    }
                                }
                                displayValue = Number(calculatedValue).toFixed(2);
                                break;
                            default:
                                {
                                    const totalValue = seasonTotals && typeof seasonTotals[statKey] === 'number' ? seasonTotals[statKey] : (aggregatedTotals[statKey] || 0);
                                    calculatedValue = totalValue;
                                    displayValue = Number.isInteger(totalValue) ? String(totalValue) : Number(totalValue || 0).toFixed(2).replace(/\.00$/, '');
                                }
                        }

                        const playerStatOrder = getStatOrderForPosition(player.pos);
                        if (!playerStatOrder.includes(statKey)) {
                            displayValue = 'N/A';
                            calculatedValue = -1;
                        }

                        const rankValue = getSeasonRankValue(player.id, statKey);
                        const rankAnnotation = createRankAnnotation(rankValue);

                        values.push(calculatedValue);
                        displayValues.push(displayValue);
                        rankAnnotations.push(rankAnnotation);

                        if (typeof rankValue === 'number' && Number.isFinite(rankValue)) {
                            if (rankValue < bestRank) {
                                bestRank = rankValue;
                                bestRankIndices = [i];
                            } else if (rankValue === bestRank) {
                                bestRankIndices.push(i);
                            }
                        }

                        if (typeof calculatedValue === 'number' && Number.isFinite(calculatedValue)) {
                            if (calculatedValue > bestValue) {
                                bestValue = calculatedValue;
                                bestValueIndices = [i];
                            } else if (calculatedValue === bestValue) {
                                bestValueIndices.push(i);
                            }
                        }
                    }

                    const useRankHighlight = bestRankIndices.length > 0;

                    displayValues.forEach((val, i) => {
                        const td = document.createElement('td');
                        td.classList.add('player-stat-cell');
                        td.textContent = val;
                        const rankAnnotation = rankAnnotations[i];
                        if (rankAnnotation) {
                            td.appendChild(rankAnnotation);
                            td.classList.add('has-rank-annotation');
                        }
                        if (val !== 'N/A') {
                            if (useRankHighlight) {
                                if (bestRankIndices.length > 1 && bestRankIndices.includes(i)) {
                                    td.style.color = '#8ab4f8';
                                } else if (bestRankIndices.length === 1 && bestRankIndices[0] === i) {
                                    td.classList.add('best-stat');
                                }
                            } else {
                                if (bestValueIndices.length > 1 && bestValueIndices.includes(i)) {
                                    td.style.color = '#8ab4f8';
                                } else if (bestValueIndices.length === 1 && bestValueIndices[0] === i) {
                                    td.classList.add('best-stat');
                                }
                            }
                        }
                        if (i === 0) {
                            row.appendChild(td);
                            row.appendChild(labelCell);
                        } else {
                            row.appendChild(td);
                        }
                    });

                    tbody.appendChild(row);
                }
            }

            table.appendChild(thead);
            table.appendChild(tbody);

            const tableContainer = document.createElement('div');
            tableContainer.className = 'comparison-table-container';
            tableContainer.appendChild(table);

            container.appendChild(tableContainer);
            comparisonModalBody.appendChild(container);

            const footer = playerComparisonModal.querySelector('.modal-footer');
            const keyContainer = document.getElementById('comparison-stats-key-container');

            if (footer && keyContainer) {
                // Styles moved to CSS
                footer.innerHTML = `
                    <div class="key-chip modal-info-btn">
                        <i class="fa-solid fa-key"></i>
                        <span>Key</span>
                    </div>
                `;

                const statDescriptions = {
                    'fpts': 'Fantasy Points',
                    'pass_att': 'Passing Attempts',
                    'pass_cmp': 'Completions',
                    'pass_yd': 'Passing Yards',
                    'pass_td': 'Passing Touchdowns',
                    'pass_fd': 'Passing First Downs',
                    'imp_per_g': 'Impact per Game',
                    'pass_rtg': 'Passer Rating',
                    'pass_imp': 'Passing Impact',
                    'pass_imp_per_att': 'Passing Impact per Attempt',
                    'pass_int': 'Interceptions',
                    'pass_sack': 'Sacks Taken',
                    'rush_att': 'Carries',
                    'rush_yd': 'Rushing Yards',
                    'ypc': 'Yards Per Carry',
                    'rush_td': 'Rushing Touchdowns',
                    'rush_fd': 'Rushing First Downs',
                    'ttt': 'Average Time to Throw',
                    'prs_pct': 'Pressure Rate',
                    'mtf': 'Missed Tackles Forced',
                    'mtf_per_att': 'Missed Tackles Forced per Attempt',
                    'elu': 'Elusiveness Rating',
                    'rush_yac': 'Yards After Contact',
                    'yco_per_att': 'Yards After Contact per Attempt',
                    'rec_tgt': 'Targets',
                    'rec': 'Receptions',
                    'rec_yd': 'Receiving Yards',
                    'rec_td': 'Receiving Touchdowns',
                    'rec_fd': 'Receiving First Downs',
                    'rec_yar': 'Yards After Catch',
                    'yprr': 'Yards per Route Run',
                    'first_down_rec_rate': 'First Down Reception Rate',
                    'ts_per_rr': 'Targets per Route Run',
                    'rr': 'Routes Run',
                    'ypr': 'Yards per Reception',
                    'fum': 'Fumbles Lost',
                    'snp_pct': 'Snap Percentage',
                    'yds_total': 'Total Yards (sheet provided)',
                    'fpoe': 'Fantasy Points Over Expected',
                };

                let listHtml = '<h4>Player Comparison Stats Key<i class="fa-solid fa-square-xmark" id="close-comparison-key"></i></h4><ul>';
                for (const key in statLabels) {
                    if (statDescriptions[key]) {
                        listHtml += `<li><strong>${statLabels[key]}:</strong> ${statDescriptions[key]}</li>`;
                    }
                }
                listHtml += '</ul>';
                keyContainer.innerHTML = listHtml;

                const keyBtn = footer.querySelector('.modal-info-btn');
                if (keyBtn) {
                    keyBtn.addEventListener('click', () => {
                        keyContainer.classList.toggle('hidden');
                    });
                }
                const closeBtn = keyContainer.querySelector('#close-comparison-key');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        keyContainer.classList.add('hidden');
                    });
                }
            }
        }

        function populateLeagueSelect(leagues) {
            leagueSelect.innerHTML = '<option>Select a league...</option>';
            leagues.forEach(l => {
                const opt = document.createElement('option');
                opt.value = l.league_id;
                opt.textContent = l.name;
                leagueSelect.appendChild(opt);
            });
            leagueSelect.disabled = false;
        }

        function calibrateTeamCardIntrinsicSize(card) {
            if (!supportsContentVisibility || !rosterContentVisibilityEnabled || !card) return;
            requestAnimationFrame(() => {
                const measuredHeight = card.getBoundingClientRect().height;
                if (measuredHeight > 0) {
                    card.style.setProperty('--team-card-intrinsic-size', `${Math.ceil(measuredHeight)}px`);
                }
            });
        }

        function renderAllTeamData(teams) {
            updateRosterContentVisibility();
            rosterGrid.innerHTML = '';
            rosterGrid.style.justifyContent = ''; // Reset style

            let teamsToRender = teams;
            if (state.isCompareMode) {
                teamsToRender = teams.filter(team => state.teamsToCompare.has(team.teamName));
                rosterGrid.style.justifyContent = 'center';
            }

            teamsToRender.forEach(team => {
                const columnWrapper = document.createElement('div');
                columnWrapper.className = 'roster-column';
                columnWrapper.dataset.teamName = team.teamName;

                const header = document.createElement('div');
                header.className = 'team-header-item';

                const checkbox = document.createElement('div');
                checkbox.className = 'team-compare-checkbox';
                if (state.teamsToCompare.has(team.teamName)) {
                    checkbox.classList.add('selected');
                }
                checkbox.dataset.teamName = team.teamName;

                const teamNameSpan = document.createElement('span');
                teamNameSpan.className = 'team-name';
                teamNameSpan.textContent = team.teamName;

                if (team.record) {
                    header.title = `${team.teamName} (${team.record})`;
                } else {
                    header.title = team.teamName;
                }


                header.appendChild(checkbox);
                header.appendChild(teamNameSpan);

                if (team.record) {
                    const recordSpan = document.createElement('span');
                    recordSpan.className = 'team-record';
                    recordSpan.textContent = `(${team.record})`;
                    header.appendChild(recordSpan);
                }

                const card = state.currentRosterView === 'positional' ? createPositionalTeamCard(team) : createDepthChartTeamCard(team);

                columnWrapper.appendChild(header);
                columnWrapper.appendChild(card);
                rosterGrid.appendChild(columnWrapper);
                calibrateTeamCardIntrinsicSize(card);
            });

            if (compareSearchInput && compareSearchInput.value) {
                filterTeamsByQuery(compareSearchInput.value);
            }
            adjustStickyHeaders();
            syncRosterHeaderPosition();
        }

        function createDepthChartTeamCard(team) {
            const card = document.createElement('div');
            card.className = 'team-card';
            card.innerHTML = `<div class="roster-section starters-section"><h3>Starters</h3></div><div class="roster-section bench-section"><h3>Bench</h3></div><div class="roster-section taxi-section"><h3>Taxi</h3></div><div class="roster-section picks-section"><h3>Draft Picks</h3></div>`;
            
            const filterActive = state.activePositions.size > 0;
            const filterFunc = player => !filterActive || state.activePositions.has(player.pos) || (state.activePositions.has('FLX') && ['RB', 'WR', 'TE'].includes(player.pos));

            const populate = (sel, data, creator) => {
                const el = card.querySelector(sel);
                const filteredData = data.filter(item => item.isPlaceholder || filterFunc(item));
                
                const h3 = el.querySelector('h3');
                el.innerHTML = '';
                el.appendChild(h3);

                if (filteredData.length > 0) {
                    filteredData.forEach(item => el.appendChild(creator(item, team.teamName)));
                } else {
                    el.innerHTML += `<div class="text-xs text-slate-500 p-1 italic">None</div>`;
                }
            };

            populate('.starters-section', team.starters, createPlayerRow);
            populate('.bench-section', team.bench, createPlayerRow);
            populate('.taxi-section', team.taxi, createTaxiRow);
            
            const picksEl = card.querySelector('.picks-section');
            const picksH3 = picksEl.querySelector('h3');
            picksEl.innerHTML = '';
            picksEl.appendChild(picksH3);
            if (team.draftPicks && team.draftPicks.length > 0) {
                team.draftPicks.forEach(item => picksEl.appendChild(createPickRow(item, team.teamName)));
            } else {
                picksEl.innerHTML += `<div class="text-xs text-slate-500 p-1 italic">None</div>`;
            }
            return card;
        }

        function createPositionalTeamCard(team) {
            const card = document.createElement('div');
            card.className = 'team-card';
            card.innerHTML = `
                <div class="roster-section qb-section"><h3>QB</h3></div>
                <div class="roster-section rb-section"><h3>RB</h3></div>
                <div class="roster-section wr-section"><h3>WR</h3></div>
                <div class="roster-section te-section"><h3>TE</h3></div>
                <div class="roster-section picks-section"><h3>Draft Picks</h3></div>
            `;

            const filterActive = state.activePositions.size > 0;
            const isFlexActive = state.activePositions.has('FLX');

            const positions = {
                QB: team.allPlayers.filter(p => p.pos === 'QB').sort((a, b) => (b.ktc || 0) - (a.ktc || 0)),
                RB: team.allPlayers.filter(p => p.pos === 'RB').sort((a, b) => (b.ktc || 0) - (a.ktc || 0)),
                WR: team.allPlayers.filter(p => p.pos === 'WR').sort((a, b) => (b.ktc || 0) - (a.ktc || 0)),
                TE: team.allPlayers.filter(p => p.pos === 'TE').sort((a, b) => (b.ktc || 0) - (a.ktc || 0)),
            };

            const populate = (sel, data, creator) => {
                const el = card.querySelector(sel);
                const pos = sel.split('-')[0].toUpperCase().replace('.', '');
                
                el.style.display = 'none';
                if (!filterActive || state.activePositions.has(pos) || (isFlexActive && ['RB', 'WR', 'TE'].includes(pos))) {
                    el.style.display = 'block';
                    const h3 = el.querySelector('h3');
                    el.innerHTML = '';
                    el.appendChild(h3);
                    if (data && data.length > 0) {
                        data.forEach(item => el.appendChild(creator(item, team.teamName)));
                    } else {
                        el.innerHTML += `<div class="text-xs text-slate-500 p-1 italic">None</div>`;
                    }
                }
            };

            populate('.qb-section', positions.QB, createPlayerRow);
            populate('.rb-section', positions.RB, createPlayerRow);
            populate('.wr-section', positions.WR, createPlayerRow);
            populate('.te-section', positions.TE, createPlayerRow);
            
            const picksEl = card.querySelector('.picks-section');
            if (picksEl) {
                const picksH3 = picksEl.querySelector('h3');
                picksEl.innerHTML = '';
                picksEl.appendChild(picksH3);
                if (team.draftPicks && team.draftPicks.length > 0) {
                    team.draftPicks.forEach(item => picksEl.appendChild(createPickRow(item, team.teamName)));
                } else {
                    picksEl.innerHTML += `<div class="text-xs text-slate-500 p-1 italic">None</div>`;
                }
            }
            return card;
        }

        function createEmptyTaxiRow() {
            const row = document.createElement('div');
            row.className = 'player-row';
            row.innerHTML = `<span style="color: var(--color-text-tertiary); font-style: italic; font-size: 0.8rem; padding: 1.2rem 0.5rem; display: block; width: 100%; text-align: center;">Empty Slot</span>`;
            return row;
        }
        
        function createTaxiRow(item, teamName) {
            if (item.isPlaceholder) return createEmptyTaxiRow();
            return createPlayerRow(item, teamName);
        }

        function createPlayerRow(player, teamName) {
            const row = document.createElement('div');
            row.className = 'player-row';
            const slotAbbr = { 'SUPER_FLEX': 'SFLX', 'FLEX': 'FLX' };
            const displaySlot = state.currentRosterView === 'depth' ? (slotAbbr[player.slot] || player.slot) : player.pos;
            const fullPlayer = state.players?.[player.id];
            const playerRanks = calculatePlayerStatsAndRanks(player.id) || getDefaultPlayerRanks();
            const firstName = (player.first_name || fullPlayer?.first_name || '').trim();
            const lastName = (player.last_name || fullPlayer?.last_name || '').trim();
            const nameCandidates = [
                player.name,
                player.full_name,
                player.display_name,
                `${firstName} ${lastName}`.trim(),
                fullPlayer?.full_name,
                `${(fullPlayer?.first_name || '').trim()} ${(fullPlayer?.last_name || '').trim()}`.trim(),
                firstName,
                lastName,
                fullPlayer?.first_name,
                fullPlayer?.last_name
            ];
            const playerSearchKey = Array.from(new Set(
                nameCandidates
                    .map(name => (name || '').trim().toLowerCase())
                    .filter(Boolean)
            )).join(' ');
            row.dataset.assetId = player.id;
            row.dataset.assetLabel = player.name;
            row.dataset.playerName = playerSearchKey || (player.name || '').toLowerCase();
            row.dataset.assetKtc = player.ktc || 0;
            row.dataset.assetPos = displaySlot;
            row.dataset.assetBasePos = (player.pos || displaySlot || '').toUpperCase();
            row.dataset.assetTeam = (player.team || 'FA').toUpperCase();

            if (state.tradeBlock[teamName]?.find(a => a.id === player.id)) {
                row.classList.add('player-selected');
            }

            const ktc = player.ktc || '—';

            const teamKey = (player.team || 'FA').toUpperCase();
            const logoKeyMap = { 'WSH': 'was', 'WAS': 'was', 'JAC': 'jax', 'LA': 'lar' };
            const normalizedKey = logoKeyMap[teamKey] || teamKey.toLowerCase();
            const src = `../assets/NFL-Tags_webp/${normalizedKey}.webp`;
            const teamTagHTML = (player.team && player.team !== 'FA')
              ? `<img class="team-logo glow" src="${src}" alt="${teamKey}" width="19" height="19" loading="eager">`
              : `<div class="team-tag" style="background-color: #64748b; color: white;">FA</div>`;

            const basePos = (player.pos || fullPlayer?.position || displaySlot || '').toUpperCase();
            const fptsPosRankNumber = Number.parseInt(playerRanks.posRank, 10);
            const hasFptsPosRank = Number.isFinite(fptsPosRankNumber) && fptsPosRankNumber > 0;
            const fptsPosRankDisplay = hasFptsPosRank ? `${basePos}·${fptsPosRankNumber}` : basePos;
            const posRankColor = getPosRankColor(fptsPosRankDisplay);
            const ppgRawString = typeof playerRanks.ppg === 'string' ? playerRanks.ppg.trim() : '';
            const numericPpgValue = typeof playerRanks.ppg === 'number'
                ? playerRanks.ppg
                : Number.parseFloat(ppgRawString || '');
            const hasNumericPpgValue = Number.isFinite(numericPpgValue);
            const hasPositivePpgValue = hasNumericPpgValue && numericPpgValue > 0;
            const ppgValue = hasPositivePpgValue
                ? numericPpgValue.toFixed(1)
                : (!hasNumericPpgValue && ppgRawString && ppgRawString.toUpperCase() !== 'NA' ? ppgRawString : 'NA');
            const rawPpgPosRankNumber = Number.parseInt(playerRanks.ppgPosRank, 10);
            const hasPpgPosRank = Number.isFinite(rawPpgPosRankNumber) && rawPpgPosRankNumber > 0;
            const ppgPosRankNumber = hasPpgPosRank ? rawPpgPosRankNumber : null;
            const ktcPosRankMatch = typeof player.posRank === 'string' ? player.posRank.match(/(\d+)/) : null;
            const rawKtcPosRankNumber = ktcPosRankMatch ? Number.parseInt(ktcPosRankMatch[1], 10) : null;
            const ktcPosRankNumber = Number.isFinite(rawKtcPosRankNumber) && rawKtcPosRankNumber > 0 ? rawKtcPosRankNumber : null;

            row.innerHTML = `
                <div class="player-main-line">
                    <div class="player-tag" style="background-color: ${TAG_COLORS[displaySlot] || 'var(--pos-bn)'};">${displaySlot}</div>
                    <div class="player-name"><span class="player-name-clickable">${player.name}</span></div>
                </div>
                <div class="player-meta-line">
                    <span class="player-pos-rank" style="color: ${posRankColor}; font-weight: 400;">${fptsPosRankDisplay}</span>
                    <span class="separator">•</span>
                    <span><span class="player-age">${player.age || '?'}</span> y.o. </span>
                    <span class="separator">•</span>
                    ${teamTagHTML}
                </div>
                <div class="player-value-line">
                    <span class="player-ktc-wrapper">KTC: <span class="value player-ktc">${ktc}</span></span>
                    <span class="player-ppg-wrapper">PPG: <span class="value player-ppg">${ppgValue}</span></span>
                </div>
            `;

            const ageEl = row.querySelector('.player-age');
            const ktcEl = row.querySelector('.player-ktc');
            const ppgEl = row.querySelector('.player-ppg');
            const playerPosRankEl = row.querySelector('.player-pos-rank');
            if (playerPosRankEl) {
                playerPosRankEl.textContent = fptsPosRankDisplay;
                playerPosRankEl.style.color = posRankColor;
            }
            if (ageEl && player.age && player.age !== '?') ageEl.style.color = getAgeColorForRoster(player.pos, parseFloat(player.age));
            if (ktcEl && player.ktc) ktcEl.style.color = getKtcColor(player.ktc);
            if (ppgEl) {
                ppgEl.textContent = ppgValue;
                if (hasPositivePpgValue && typeof ppgPosRankNumber === 'number') {
                    ppgEl.style.color = getConditionalColorByRank(ppgPosRankNumber, basePos);
                } else if (!hasPositivePpgValue) {
                    ppgEl.style.color = 'var(--color-text-tertiary)';
                }
            }

            const ktcWrapper = row.querySelector('.player-ktc-wrapper');
            if (ktcWrapper) {
                ktcWrapper.classList.add('has-rank-annotation');
                ktcWrapper.appendChild(createRankAnnotation(typeof ktcPosRankNumber === 'number' ? ktcPosRankNumber : 'NA'));
            }

            const playerNameClickableEl = row.querySelector('.player-name-clickable');
            if (playerNameClickableEl) {
                playerNameClickableEl.style.cursor = 'pointer';
                playerNameClickableEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handlePlayerNameClick(player);
                });
            }

            return row;
        }

        function createPickRow(pick, teamName) {
            const row = document.createElement('div');
            row.className = 'pick-row';
            row.dataset.assetId = pick.id;
            row.dataset.assetLabel = pick.label;
            row.dataset.assetKtc = pick.ktc || 0;

            if (state.tradeBlock[teamName]?.find(a => a.id === pick.id)) {
                row.classList.add('player-selected');
            }
            
            const ktcValue = pick.ktc || '—';
            row.innerHTML = `<span class="pick-label">${pick.label}</span><span class="pick-ktc">KTC: <span class="value">${ktcValue}</span></span>`;
            if (pick.ktc) row.querySelector('.pick-ktc .value').style.color = getKtcColor(pick.ktc);
            return row;
        }

        function renderTradeBlock() {
  const isEligible = state.isCompareMode && state.teamsToCompare.size >= 2;

  if (!isEligible) {
    tradeSimulator.style.display = 'none';
    mainContent.style.paddingBottom = '1rem';
    return;
  }

  tradeSimulator.style.display = 'block';
  tradeSimulator.innerHTML = `
              <div class="trade-container glass-panel">
          <div class="trade-header">
            <div class="trade-header-left">
              <h3>Trade Preview <i class="fa-solid fa-code-compare fa-rotate-270"></i></h3>
            </div>
            <div class="trade-header-center">
              <button id="collapseTradeButton"><i class="fa-solid fa-caret-down"></i></button>
            </div>
            <div class="trade-header-right">
              <button id="comparePlayersButton" class="control-button-subtle">
                <i class="fa-solid fa-chart-simple"></i>
                <span class="label">Compare</span>
              </button>
              <button id="clearTradeButton" type="button">
                <i class="fa-solid fa-eraser"></i>
                <span class="label">Clear</span>
              </button>
              <button id="closeTradeButton" type="button">
                <i class="fa-solid fa-circle-xmark"></i>
                <span class="label">Close</span>
              </button>
            </div>
          </div>
        
          <div class="trade-body"></div>
          <div class="trade-footnote">• Non-Adjusted Values •</div>
        </div>
        
        <button id="showTradeButton"><i class="fa-solid fa-circle-chevron-up"></i> Trade Preview <i class="fa-solid fa-circle-chevron-up"></i></button>
  `;

            const tradeBody = tradeSimulator.querySelector('.trade-body');
            const teamNames = Array.from(state.teamsToCompare);
            const tradeData = {};

            teamNames.forEach(name => {
                const assets = state.tradeBlock[name] || [];
                const totalKtc = assets.reduce((sum, asset) => sum + asset.ktc, 0);
                tradeData[name] = { assets, totalKtc };
            });

            const totals = teamNames.map(name => tradeData[name].totalKtc);
            const totalClasses = {};

            if (teamNames.length === 2) {
                const diff = totals[0] - totals[1];
                if (diff > 500) {
                    totalClasses[teamNames[0]] = 'winning';
                    totalClasses[teamNames[1]] = 'losing';
                } else if (diff < -500) {
                    totalClasses[teamNames[0]] = 'losing';
                    totalClasses[teamNames[1]] = 'winning';
                } else {
                    totalClasses[teamNames[0]] = 'even';
                    totalClasses[teamNames[1]] = 'even';
                }
            }

            let bodyHtml = '';
            teamNames.forEach((teamName, index) => {
                const { assets, totalKtc } = tradeData[teamName];
                let assetsHTML = '';
                if (assets.length > 0) {
                    assets.forEach(asset => {
                        const ktcColor = getKtcColor(asset.ktc);
                        const tagColor = TAG_COLORS[asset.pos] || 'var(--pos-bn)';
                        assetsHTML += `<div class="trade-asset-chip"><span class="player-tag" style="background-color: ${tagColor};">${asset.pos || 'DP'}</span><span>${asset.label}</span><span class="ktc" style="color: ${ktcColor}">(${asset.ktc})</span></div>`;
                    });
                } else {
                    assetsHTML = `<span class="text-xs text-slate-500 p-2">Select assets...</span>`;
                }
                
                const totalClass = totalClasses[teamName] || 'even';
              
                let teamNameDisplay = teamName;
                if (teamNames.length === 2) {
                    if (index === 0) teamNameDisplay = `${teamName}`;
                    if (index === 1) teamNameDisplay = `${teamName}`;
                }
                bodyHtml += `
                    <div class="trade-team-column">
                       <h4>${teamNameDisplay}</h4>
                        <div class="trade-assets">${assetsHTML}</div>
                        <div class="trade-total ${totalClass}">
                            Total KTC: ${totalKtc}
                        </div>
                    </div>
                `;

                if (index < teamNames.length - 1 && teamNames.length > 1) {
                     bodyHtml += `<div class="trade-divider"></div>`;
                }
            });
            
            
            tradeBody.innerHTML = bodyHtml;

            // Disable/enable Clear button based on whether any assets are selected
            const clearBtn = document.getElementById('clearTradeButton');
            try {
                const hasAnyAssets = Object.values(tradeData).some(d => Array.isArray(d.assets) && d.assets.length > 0);
                if (clearBtn) clearBtn.disabled = !hasAnyAssets;
            } catch (e) { /* no-op */ }

            const comparePlayersButton = document.getElementById('comparePlayersButton');
            if (comparePlayersButton) {
                const selectedPlayers = Object.values(state.tradeBlock).flat().filter(asset => asset.pos !== 'DP');
                if (selectedPlayers.length === 2) {
                    comparePlayersButton.classList.add('enabled');
                } else {
                    comparePlayersButton.classList.remove('enabled');
                }
            }

            tradeSimulator.classList.toggle('collapsed', state.isTradeCollapsed);

            document.getElementById('clearTradeButton').addEventListener('click', clearTrade);
            const closeTradeButton = document.getElementById('closeTradeButton');
            if (closeTradeButton) {
                closeTradeButton.addEventListener('click', () => {
                    handleClearCompare(true);
                });
            }
            document.getElementById('collapseTradeButton').addEventListener('click', () => {
                tradeSimulator.classList.add('collapsed');
                state.isTradeCollapsed = true;
                mainContent.style.paddingBottom = `${tradeSimulator.offsetHeight + 20}px`;
                closeComparisonModal();
            });
            document.getElementById('showTradeButton').addEventListener('click', () => {
                tradeSimulator.classList.remove('collapsed');
                state.isTradeCollapsed = false;
                mainContent.style.paddingBottom = `${tradeSimulator.offsetHeight + 20}px`;
            });

            mainContent.style.paddingBottom = `${tradeSimulator.offsetHeight + 20}px`;
        }


        // --- Player List (Ownership) Functions ---
        async function renderPlayerList() {
    hideLegend();
            playerListView.innerHTML = '<p class="text-center p-4">Fetching user leagues and rosters...</p>';
            assignedLeagueColors.clear();
            nextColorIndex = 0;
            assignedRyColors.clear();
            nextRyColorIndex = 0;

            const userLeagues = await fetchUserLeagues(state.userId);
            const rostersByLeague = await Promise.all(userLeagues.map(l => fetchWithCache(`${API_BASE}/league/${l.league_id}/rosters`)));

            const agg = new Map();
            rostersByLeague.forEach((rosters, idx) => {
                const leagueName = userLeagues[idx].name;
                const leagueAbbr = getLeagueAbbr(leagueName);
                const myRoster = rosters.find(r => r.owner_id === state.userId || (Array.isArray(r.co_owners) && r.co_owners.includes(state.userId)));
                if (!myRoster) return;
                const pids = new Set((myRoster.players || []).filter(Boolean));
                pids.forEach(pid => {
                    if (!agg.has(pid)) agg.set(pid, new Set());
                    agg.get(pid).add(leagueAbbr);
                });
            });

            const section = document.createElement('div');
            section.className = 'player-list-section';
            
            const header = createPlayerListHeader();
            section.appendChild(header);

            const rows = Array.from(agg.entries()).map(([pid, leagueSet]) => createPlayerListRow(pid, leagueSet, userLeagues.length)).filter(Boolean);
            rows.sort((a, b) => {
                const countDiff = Number(b.dataset.count || 0) - Number(a.dataset.count || 0);
                if (countDiff !== 0) return countDiff;
                return a.dataset.search.localeCompare(b.dataset.search);
            });

            rows.forEach(r => section.appendChild(r));
            playerListView.innerHTML = '';
            
            const searchInput = document.createElement('input');
            searchInput.id = 'playerSearch';
            searchInput.type = 'text';
            searchInput.placeholder = 'Filter players by name...';
            playerListView.appendChild(searchInput);
            playerListView.appendChild(section);

            searchInput.oninput = () => {
                const term = searchInput.value.trim().toLowerCase();
                section.querySelectorAll('.pl-player-row:not(.pl-list-header)').forEach(r => {
                    r.style.display = (r.dataset.search || '').includes(term) ? 'flex' : 'none';
                });
            };
        }

        function createPlayerListHeader() {
            const header = document.createElement('div');
            header.className = 'pl-player-row pl-list-header';
            
            const tagSpacer = document.createElement('div');
            tagSpacer.className = 'pl-list-tag-spacer';
            header.appendChild(tagSpacer);

            const headerInfo = document.createElement('div');
            headerInfo.className = 'pl-player-info';
            headerInfo.innerHTML = '<div class="pl-player-name">Player & Info</div>';
            header.appendChild(headerInfo);

            const headerMeta = document.createElement('div');
            headerMeta.className = 'pl-right-meta';
            headerMeta.innerHTML = `
                <span class="pl-col-count">#</span>
                <span class="pl-col-pct">%</span>
                <span class="pl-col-lgs">Leagues</span>
            `;
            header.appendChild(headerMeta);
            
            return header;
        }

        function createPlayerListRow(pid, leagueSet, totalLeagues) {
            const p = state.players[pid];
            if (!p) return null;

            const pos = p.position || (p.fantasy_positions && p.fantasy_positions[0]) || '';
            const first = (p.first_name || '').trim();
            const last = (p.last_name || '').trim();
            let displayName = `${first} ${last}`.trim() || pid;
            if (first && last) displayName = `${first.charAt(0)}. ${last}`;
            if (displayName.length > 14) displayName = displayName.substring(0, 14) + '…';


            const row = document.createElement('div');
            row.className = 'pl-player-row';
            row.dataset.search = `${first.toLowerCase()} ${last.toLowerCase()} ${displayName.toLowerCase()}`;
            row.dataset.count = leagueSet.size;

            const valueData = state.isSuperflex ? state.sflxData[pid] : state.oneQbData[pid];
            const ageFromSheet = valueData?.age;
            const formattedAge = (typeof ageFromSheet === 'number') ? ageFromSheet.toFixed(1) : (p.age ? Number(p.age).toFixed(1) : '?');

            const detailParts = [];
            const adp1QB = state.oneQbData[pid]?.adp;
            const adpSFLX = state.sflxData[pid]?.adp;
            const rookieYear = deriveRookieYear(p);
            if (adp1QB) detailParts.push(`ADP <span style="color:${getAdpColorForRoster(adp1QB) || 'inherit'}">${adp1QB.toFixed(1)}</span>`);
            if (adpSFLX) detailParts.push(`SFLX <span style="color:${getAdpColorForRoster(adpSFLX) || 'inherit'}">${adpSFLX.toFixed(1)}</span>`);
            if (rookieYear) {
                const ryAbbr = String(rookieYear).slice(-2);
                detailParts.push(`RY-<span style="color:${getRyColor(rookieYear) || 'inherit'}">${ryAbbr}</span>`);
            }
            const detailsHTML = detailParts.join(' • ');

            const count = leagueSet.size;
            const pctVal = Math.round((count / totalLeagues) * 100);
            let countClass, pctClass;
            if (pctVal >= 80) { countClass = 'pl-count-high'; pctClass = 'pl-pct-high'; }
            else if (pctVal >= 50) { countClass = 'pl-count-mid'; pctClass = 'pl-pct-mid'; }
            else { countClass = 'pl-count-low'; pctClass = 'pl-pct-low'; }

            const sortedAbbrs = Array.from(leagueSet).sort();
            const leaguesHTML = sortedAbbrs.map((abbr, index) => `<span style="color: ${getLeagueColor(abbr)}">${abbr}</span>`).join(', ');

            row.innerHTML = `
                <div class="pl-list-tag" style="background-color: ${TAG_COLORS[pos] || 'var(--pos-bn)'};">${pos}</div>
                <div class="pl-player-info">
                    <div class="pl-player-name">
                        <span>${displayName}</span>
                        <div class="team-tag" style="background-color: ${TEAM_COLORS[p.team] || '#64748b'}; color: white;">${p.team || 'FA'}</div>
                        ${formattedAge !== '?' ? `<span style="font-size: 0.8rem; color: var(--color-text-tertiary);">Age: <span style="color:${getAgeColorForRoster(p.position, parseFloat(formattedAge)) || 'inherit'}">${formattedAge}</span></span>` : ''}
                    </div>
                    <div class="pl-player-details">${detailsHTML}</div>
                </div>
                <div class="pl-right-meta">
                    <span class="pl-col-count ${countClass}">${count}</span>
                    <span class="pl-col-pct ${pctClass}">${pctVal}%</span>
                    <span class="pl-col-lgs">${leaguesHTML}</span>
                </div>
            `;
            
            return row;
        }

        // --- Formatting Helpers ---
        function deriveRookieYear(player) {
            if (!player) return null;
            let ry = player.metadata?.rookie_year ? Number(player.metadata.rookie_year) : 0;
            const exp = player.years_exp;
            const expNum = (exp === '' || exp === null || exp === undefined) ? null : Number(exp);
            if ((!ry || ry === 0) && expNum === 0) {
                return new Date().getFullYear();
            }
            return ry > 0 ? ry : null;
        }
        function getPosRankColor(posRank) {
            if (!posRank || typeof posRank !== 'string') return 'var(--color-text-secondary)';
            const position = posRank.split('·')[0];
            const colors = {
                QB: '#FFB2D8',
                RB: '#bbf7e0',
                WR: '#A0C2F7',
                TE: '#FFC78A'
            };
            return colors[position] || 'var(--color-text-secondary)';
        }
        function calculateFantasyPoints(stats, scoringSettings) {
            if (!stats) return 0;

            if (typeof stats.fpts_override === 'number' && Number.isFinite(stats.fpts_override)) {
                return stats.fpts_override;
            }

            if (!scoringSettings) return 0;

            let totalPoints = 0;
            for (const statKey in stats) {
                if (!Object.prototype.hasOwnProperty.call(stats, statKey)) continue;
                if (statKey === 'fpts_override' || statKey === '__live') continue;
                if (scoringSettings[statKey]) {
                    totalPoints += stats[statKey] * scoringSettings[statKey];
                }
            }
            return totalPoints;
        }

        function formatPercentage(value, decimals = 1) {
            if (value === null || value === undefined || Number.isNaN(value)) return '0%';
            const numericValue = Number(value);
            if (Number.isNaN(numericValue)) return '0%';
            const fixed = numericValue.toFixed(decimals);
            let trimmed = fixed;
            if (trimmed.includes('.')) {
                trimmed = trimmed.replace(/0+$/, '').replace(/\.$/, '');
            }
            return `${trimmed}%`;
        }

        function getPlayerVitals(playerId) {
            const fallback = { age: '—', height: '—', weight: '—' };
            const playerData = state.players?.[playerId];
            if (!playerData) return fallback;

            const collect = (...values) => values
                .map(value => (typeof value === 'string' ? value.trim() : value))
                .filter(value => value !== undefined && value !== null && value !== '');

            const parseAge = () => {
                const valueData = state.isSuperflex ? state.sflxData?.[playerId] : state.oneQbData?.[playerId];
                const ageFromSheet = valueData?.age;

                if (typeof ageFromSheet === 'number') {
                    return ageFromSheet.toFixed(1);
                }

                const candidates = collect(
                    playerData.age,
                    playerData.metadata?.age,
                    playerData.metadata?.player_age
                );

                for (const candidate of candidates) {
                    const numeric = Number.parseInt(candidate, 10);
                    if (Number.isFinite(numeric) && numeric > 0) {
                        return Number(numeric).toFixed(1);
                    }
                }

                if (playerData.birthdate) {
                    const birth = new Date(playerData.birthdate);
                    if (!Number.isNaN(birth.getTime())) {
                        const today = new Date();
                        let age = today.getFullYear() - birth.getFullYear();
                        const hasHadBirthdayThisYear =
                            today.getMonth() > birth.getMonth() ||
                            (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
                        if (!hasHadBirthdayThisYear) age -= 1;
                        if (Number.isFinite(age) && age > 0 && age < 80) {
                            return Number(age).toFixed(1);
                        }
                    }
                }

                return null;
            };

            const formatHeightFromParts = (feet, inches) => {
                const f = Number.parseInt(feet, 10);
                const i = Number.parseInt(inches, 10);
                if (!Number.isFinite(f) && !Number.isFinite(i)) return null;
                const safeFeet = Number.isFinite(f) ? f : Math.floor(i / 12);
                const safeInches = Number.isFinite(i) ? i % 12 : 0;
                if (!Number.isFinite(safeFeet) || safeFeet <= 0) return null;
                const boundedInches = Math.max(0, Math.min(11, safeInches));
                return `${safeFeet}'${boundedInches}"`;
            };

            const parseHeightString = (value) => {
                if (value === undefined || value === null) return null;
                const str = String(value).trim();
                if (!str) return null;

                const digits = str.match(/\d+/g);
                if (!digits || digits.length === 0) return null;
                if (digits.length >= 2) {
                    return formatHeightFromParts(digits[0], digits[1]);
                }

                const only = Number.parseInt(digits[0], 10);
                if (!Number.isFinite(only) || only <= 0) return null;

                const raw = digits[0];
                if (raw.length >= 3) {
                    const feetPart = raw.slice(0, raw.length - 2);
                    const inchPart = raw.slice(-2);
                    const formattedFromRaw = formatHeightFromParts(feetPart, inchPart);
                    if (formattedFromRaw) return formattedFromRaw;
                }

                if (only > 12) {
                    const feet = Math.floor(only / 12);
                    const inches = only % 12;
                    return `${feet}'${inches}"`;
                }

                return `${only}'0"`;
            };

            const parseHeight = () => {
                const pairCandidates = [
                    [playerData.height_feet, playerData.height_inches],
                    [playerData.metadata?.height_feet, playerData.metadata?.height_inches],
                    [playerData.height_ft, playerData.height_in],
                    [playerData.metadata?.height_ft, playerData.metadata?.height_in]
                ];
                for (const [feet, inches] of pairCandidates) {
                    const formatted = formatHeightFromParts(feet, inches);
                    if (formatted) return formatted;
                }

                const heightCandidates = collect(
                    playerData.height,
                    playerData.metadata?.height,
                    playerData.metadata?.player_height,
                    playerData.height_inches,
                    playerData.height_in,
                    playerData.metadata?.height_inches,
                    playerData.metadata?.height_in
                );

                for (const candidate of heightCandidates) {
                    const formatted = parseHeightString(candidate);
                    if (formatted) return formatted;
                }

                return null;
            };

            const parseWeight = () => {
                const weightCandidates = collect(
                    playerData.weight,
                    playerData.metadata?.weight,
                    playerData.metadata?.player_weight,
                    playerData.weight_lbs,
                    playerData.metadata?.weight_lbs
                );

                for (const candidate of weightCandidates) {
                    const numeric = Number.parseInt(candidate, 10);
                    if (Number.isFinite(numeric) && numeric > 0) {
                        return `${numeric} lbs`;
                    }
                }

                return null;
            };

            const parseYearsExperience = () => {
                const exp = playerData.years_exp;
                if (exp === null || exp === undefined) return '—';
                return String(exp);
            };

            const parseRookieYear = () => {
                const rookieYear = playerData.rookie_year;
                if (rookieYear && rookieYear !== '0') {
                    return String(rookieYear);
                }
                const exp = playerData.years_exp;
                if (exp !== null && exp !== undefined) {
                    return String(2025 - Number(exp));
                }
                return '—';
            };

            return {
                age: parseAge() ?? '—',
                height: parseHeight() ?? '—',
                weight: parseWeight() ?? '—',
                exp: parseYearsExperience(),
                ry: parseRookieYear()
            };
        }

        function createPlayerVitalsElement(vitals, { variant = 'modal' } = {}) {
            const container = document.createElement('div');
            container.className = `player-vitals player-vitals--${variant}`;

            const items = [
                { label: 'AGE', value: vitals.age },
                { label: 'HEIGHT', value: vitals.height },
                { label: 'WEIGHT', value: vitals.weight },
                { label: 'EXP', value: vitals.exp },
                { label: 'RY', value: vitals.ry }
            ];

            items.forEach(({ label, value }) => {
                const item = document.createElement('div');
                item.className = 'player-vitals__item';

                const labelEl = document.createElement('span');
                labelEl.className = 'player-vitals__label';
                labelEl.textContent = label;

                const valueEl = document.createElement('span');
                valueEl.className = 'player-vitals__value';
                valueEl.textContent = value;

                item.appendChild(labelEl);
                item.appendChild(valueEl);
                container.appendChild(item);
            });

            return container;
        }

        function getRankColor(rank) {
            if (typeof rank !== 'number') return 'var(--color-text-primary)';
            const thresholds = [
                { v: 24, c: '#8BEBCDbb' },
                { v: 48, c: '#97EBE3ab' },
                { v: 72, c: '#7dd1ffaa' },
                { v: 96, c: '#48a6ffaa' },
                { v: 120, c: '#957cffbb' },
                { v: 156, c: '#a642ffbb' },
                { v: 180, c: '#cf60ffcc' },
                { v: 204, c: '#ff6fe1cc' },
                { v: 250, c: '#ff2eb2' },
            ];

            for (const t of thresholds) {
                if (rank <= t.v) return t.c;
            }

            if (rank > 250 && rank < 300) return '#ff0080';
            if (rank >= 300) return '#656565';

            return 'var(--color-text-secondary)';
        }
        function getConditionalColorByRank(rank, position) {
            if (typeof rank !== 'number' || rank <= 0)  return 'inherit';

            const normalizedPos = typeof position === 'string' ? position.trim().toUpperCase() : '';
            const thresholds = normalizedPos === 'WR'
                ? [
                    { v: 12, c: '#51CBA5CF' },
                    { v: 24, c: '#34aabfDA' },
                    { v: 36, c: '#4798fcDA' },
                    { v: 48, c: '#957CFFC5' },
                    { v: 60, c: '#FF6FE1A5' },
                    { v: 72, c: '#FF2EB289' },
                ]
                : [
                    { v: 8, c: '#51CBA5CF' },
                    { v: 16, c: '#34aabfDA' },
                    { v: 24, c: '#4798fcDA' },
                    { v: 32, c: '#957CFFC5' },
                    { v: 44, c: '#FF6FE1A5' },
                    { v: 60, c: '#FF2EB289' },
                ];

            for (const threshold of thresholds) {
                if (rank <= threshold.v) return threshold.c;
            }

            return '#767693';
        }
        function getKtcColor(v) {
        const s = [
          { v: 9e3, c: "#72edd0B3" },
          { v: 8e3, c: "#58d5ceB3" },
          { v: 7e3, c: "#5bdae8B3" },
          { v: 6e3, c: "#6eb4ebB3" },
          { v: 5500, c: "#62a5f9B3" },
          { v: 5e3, c: "#848bffB3" },
          { v: 4500, c: "#7b63ffB3" },
          { v: 4e3, c: "#964effB3" },
          { v: 3500, c: "#c449f9B3" },
          { v: 3e3, c: "#ee42ffB3" },
          { v: 2500, c: "#d13eb8B3" },
          { v: 2e3, c: "#d032aaB3" },
          { v: 0,   c: "#f94ea4B3" }
        ];        
          if (v === null || v === 0) return "#e0e6ed";
        
          for (const t of s) {
            if (v >= t.v) return t.c;
          }
        
          return s[s.length - 1].c;
        }
        function getAdpColorForRoster(a){const s=[{v:12,c:"#00EEB6"},{v:24,c:"#14D7CB"},{v:36,c:"#0599AA"},{v:48,c:"#03a8ce"},{v:60,c:"#0690DC"},{v:72,c:"#066CDC"},{v:84,c:"#1350fd"},{v:96,c:"#5e41ff"},{v:108,c:"#7158ff"},{v:120,c:"#964eff"},{v:144,c:"#9200ff"},{v:168,c:"#b70fff"},{v:192,c:"#ba00cc"},{v:216,c:"#e800ff"},{v:240,c:"#db00af"},{v:280,c:"#c70097"},{v:320,c:"#FF0080"}];if(!a||a===0)return null;for(const t of s)if(a<=t.v)return t.c;return s[s.length-1].c}
        function getAgeColorForRoster(p,a){const s={wrTe:[{v:22.5,c:"#00ffc4"},{v:25,c:"#85fff3"},{v:26,c:"#56dfe8"},{v:27,c:"#7dd1ff"},{v:29,c:"#89a3ff"},{v:30,c:"#957cff"},{v:31,c:"#a642ff"},{v:32,c:"#cf60ff"},{v:33,c:"#ff6fe1"}],rb:[{v:22.5,c:"#00ffc4"},{v:24,c:"#85fff3"},{v:25,c:"#56dfe8"},{v:26,c:"#7dd1ff"},{v:27,c:"#89a3ff"},{v:28,c:"#957cff"},{v:29,c:"#a642ff"},{v:30,c:"#cf60ff"},{v:31,c:"#ff6fe1"}],qb:[{v:25.5,c:"#00ffc4"},{v:28,c:"#85fff3"},{v:29,c:"#7dd1ff"},{v:31,c:"#48a6ff"},{v:33,c:"#957cff"},{v:36,c:"#a642ff"},{v:40,c:"#cf60ff"},{v:44,c:"#ff6fe1"}]};let sc=p==="WR"||p==="TE"?s.wrTe:p==="RB"?s.rb:p==="QB"?s.qb:null;if(!sc||!a||a===0)return null;for(const t of sc)if(a<=t.v)return t.c;return sc[sc.length-1].c}
       function getLeagueAbbr(name) {
            if (!name) return "LG";
            const trimmed = name.trim();                       const normalized = trimmed.toLowerCase().replace(/[.,()]/g, '');
            if (LEAGUE_ABBR_OVERRIDES[normalized]) return LEAGUE_ABBR_OVERRIDES[normalized];
            if (trimmed.length <= 4 && !trimmed.includes(' ') && !trimmed.includes('-')) return trimmed.toUpperCase();
            const words = trimmed.split(/[\s-]+/);
            let abbr = words.map(w => w[0] || '').join('');
            return abbr.toUpperCase();
        }
         function getLeagueColor(abbr) { if (!assignedLeagueColors.has(abbr)) { assignedLeagueColors.set(abbr, LEAGUE_COLOR_PALETTE[nextColorIndex % LEAGUE_COLOR_PALETTE.length]); nextColorIndex++; } return assignedLeagueColors.get(abbr); }
        function getRyColor(year) { if (!assignedRyColors.has(year)) { assignedRyColors.set(year, RY_COLOR_PALETTE[nextRyColorIndex % RY_COLOR_PALETTE.length]); nextRyColorIndex++; } return assignedRyColors.get(year); }
        function ordinalSuffix(i){ const j=i%10, k=i%100; if(j===1&&k!==11) return i+'st'; if(j===2&&k!==12) return i+'nd'; if(j===3&&k!==13) return i+'rd'; return i+'th'; }

        // --- Utility Functions ---
        function adjustStickyHeaders() {
            const headerContainer = document.getElementById('header-container');
            if (!headerContainer) return;
            const headerHeight = headerContainer.offsetHeight;
            const rootStyles = getComputedStyle(document.documentElement);
            // The gap is controlled via the --roster-header-gap custom property so designers can fine-tune spacing without
            // touching the JavaScript. Update the value in styles.css to move the sticky team headers closer to or farther
            // from the global header.
            const rosterGapRaw = rootStyles.getPropertyValue('--roster-header-gap');
            const rosterGap = Number.parseFloat(rosterGapRaw) || 0;
            const stickyOffset = Math.max(headerHeight - rosterGap, 0);

            const teamHeaders = document.querySelectorAll('.team-header-item');
            teamHeaders.forEach(header => {
                header.style.top = `${stickyOffset}px`;
            });

            const isRosterPage = document.body?.dataset?.page === 'rosters';
            if (isRosterPage) {
                document.documentElement.style.setProperty('--roster-header-height', `${headerHeight}px`);
            } else {
                document.documentElement.style.removeProperty('--roster-header-height');
            }
        }
        window.addEventListener('resize', adjustStickyHeaders);

        function syncRosterHeaderPosition() {
            const header = document.getElementById('header-container');
            if (!header) return;
            const isRosterPage = document.body?.dataset?.page === 'rosters';
            if (!isRosterPage) {
                if (header.style.transform) {
                    header.style.transform = '';
                }
                return;
            }
            if (header.style.transform) {
                header.style.transform = '';
            }
        }

        window.addEventListener('scroll', syncRosterHeaderPosition, { passive: true });
        window.addEventListener('resize', syncRosterHeaderPosition);
        syncRosterHeaderPosition();

        function showTemporaryTooltip(element, message) {
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = message;
            document.body.appendChild(tooltip);

            const rect = element.getBoundingClientRect();
            tooltip.style.position = 'absolute';
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
            tooltip.style.background = 'black';
            tooltip.style.color = 'white';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.zIndex = '1000';
            tooltip.style.border = '1px solid #ccc';
            tooltip.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

            setTimeout(() => {
                tooltip.remove();
            }, 2000);
        }

        function openModal() {
            gameLogsModal.classList.remove('hidden');
            statsKeyContainer.classList.add('hidden');
        }

        function closeModal() {
            gameLogsModal.classList.add('hidden');
            statsKeyContainer.classList.add('hidden');
            if (!state.isGameLogModalOpenFromComparison) {
                closeComparisonModal();
            } else {
                gameLogsModal.style.zIndex = ''; // Reset z-index
            }
            // Reset the flag
            state.isGameLogModalOpenFromComparison = false;
        }

        function openComparisonModal() {
            if (playerComparisonModal) {
                const modalContent = playerComparisonModal.querySelector('.modal-content');
                const header = document.getElementById('header-container');
                const tradePreview = document.getElementById('tradeSimulator');

                if (modalContent && header && tradePreview) {
                    const headerRect = header.getBoundingClientRect();
                    const tradePreviewRect = tradePreview.getBoundingClientRect();

                    const topPosition = headerRect.bottom + 10;
                    const spacingAdjustment = 6;
                    const availableHeight = tradePreviewRect.top - topPosition - spacingAdjustment;

                    modalContent.style.top = `${topPosition}px`;
                    modalContent.style.height = `${availableHeight}px`;
                    modalContent.style.bottom = 'auto';
                }

                playerComparisonModal.classList.remove('hidden');
                if (comparisonBackgroundOverlay) {
                    comparisonBackgroundOverlay.classList.remove('hidden');
                }
                if (rosterGrid) {
                    rosterGrid.classList.add('hidden');
                }
            }
        }

        function closeComparisonModal() {
            if (playerComparisonModal) {
                const modalContent = playerComparisonModal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.style.top = '';
                    modalContent.style.height = '';
                    modalContent.style.bottom = '';
                }
                playerComparisonModal.classList.add('hidden');
                if (comparisonBackgroundOverlay) {
                    comparisonBackgroundOverlay.classList.add('hidden');
                }
                const comparisonModalBody = document.getElementById('comparison-modal-body');
                if (comparisonModalBody) {
                    comparisonModalBody.innerHTML = '';
                }
                if (rosterGrid) {
                    rosterGrid.classList.remove('hidden');
                }
            }
        }

function setLoading(isLoading, message = 'Loading...') {
    welcomeScreen?.classList.add('hidden');
    if (document.body?.dataset?.page === 'rosters') {
        adjustStickyHeaders();
    }
    const buttons = [fetchRostersButton, fetchOwnershipButton].filter(Boolean);
    if (isLoading) {
        const msgEl = loadingIndicator.querySelector('.loading-message'); if (msgEl) { msgEl.textContent = message; } else { loadingIndicator.textContent = message; }
        loadingIndicator.classList.remove('hidden');
        buttons.forEach(btn => { btn.disabled = true; btn.classList.add('opacity-50', 'cursor-not-allowed'); });
    } else {
        loadingIndicator.classList.add('hidden');
        buttons.forEach(btn => { btn.disabled = false; btn.classList.remove('opacity-50', 'cursor-not-allowed'); });
    }
        }

        function handleError(error, username) {
            console.error(`Error for user ${username}:`, error);
            if (welcomeScreen) {
                welcomeScreen.classList.remove('hidden');
                welcomeScreen.innerHTML = `<h2 class="text-red-400">Error</h2><p>Could not fetch data for user: ${username}</p><p>${error.message}</p>`;
            }
            rosterView?.classList.add('hidden');
            playerListView?.classList.add('hidden');
        }

        async function fetchWithCache(url) {
            if (state.cache[url]) return state.cache[url];
            const response = await fetch(url);
            if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
            const data = await response.json();
            state.cache[url] = data;
            return data;
        }
    


(function(){
  const KEY = 'sleeper_username';
  const input = document.getElementById('usernameInput');
  if (!input) return;

  const normalize = () => (input.value || '').trim().toLowerCase();

  function persistNormalized() {
    const v = normalize();
    input.value = v;
    if (v) localStorage.setItem(KEY, v);
    else localStorage.removeItem(KEY);
    if (document.activeElement === input) input.blur();
  }

  // iOS viewport reset helper (temporary max-scale=1 toggle)
  function resetIOSZoom() {
    const meta = document.querySelector('meta[name="viewport"]');
    if (!meta) return;
    const orig = meta.getAttribute('content') || 'width=device-width, initial-scale=1';
    const cleaned = orig
      .replace(/\s*,?\s*maximum-scale\s*=\s*[^,]+/gi, '')
      .replace(/\s*,?\s*user-scalable\s*=\s*[^,]+/gi, '');
    meta.setAttribute('content', cleaned + ', maximum-scale=1, user-scalable=no');
    setTimeout(() => meta.setAttribute('content', cleaned), 300);
  }

  // hydrate
  const saved = (localStorage.getItem(KEY) || '').trim();
  if (saved) input.value = saved; else { input.removeAttribute('value'); input.value = ''; }

  // listeners
  input.addEventListener('change', persistNormalized);
  input.addEventListener('blur', () => { persistNormalized(); });
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { persistNormalized(); resetIOSZoom(); }});

  // Hook buttons (capture) so normalization executes before fetch handlers, then reset zoom
  ['fetchRostersButton','fetchOwnershipButton'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', () => { persistNormalized(); resetIOSZoom(); }, { capture: true });
  });
})();


// === Hotfix guards (20250825104842) ===
(function(){ 
  const welcome = document.getElementById('welcome-screen');
  const legend  = document.getElementById('legend-section');
  const roster  = document.getElementById('rosterView');
  const list    = document.getElementById('playerListView');

  function setWelcomeWidthVar(){ 
    if (!welcome) return; 
    const w = Math.round(welcome.getBoundingClientRect().width);
    document.documentElement.style.setProperty('--welcome-width', w>0? w+'px' : '720px');
  }
  function enforceLegendVisibility(){ 
    if (!legend) return;
    const onWelcome = welcome && !welcome.classList.contains('hidden');
    const rosterVisible = roster && !roster.classList.contains('hidden');
    const listVisible = list && !list.classList.contains('hidden');
    // Only show legend on welcome, otherwise hide
    legend.classList.toggle('hidden', !(onWelcome && !rosterVisible && !listVisible));
  }

  window.addEventListener('load', () => { setWelcomeWidthVar(); enforceLegendVisibility(); });
  window.addEventListener('resize', setWelcomeWidthVar);
  if (welcome) new MutationObserver(() => { enforceLegendVisibility(); setWelcomeWidthVar(); }).observe(welcome, { attributes:true, attributeFilter:['class'] });
  if (roster)  new MutationObserver(enforceLegendVisibility).observe(roster,  { attributes:true, attributeFilter:['class'] });
  if (list)    new MutationObserver(enforceLegendVisibility).observe(list,    { attributes:true, attributeFilter:['class'] });

  // Service worker update hard reload once
  navigator.serviceWorker && navigator.serviceWorker.addEventListener('controllerchange', () => { 
    if (!window.__reloadedOnce) { window.__reloadedOnce = true; location.reload(); }
  });
})();

// PWA registration (with version bump to bust old caches)
if ('serviceWorker' in navigator) {
  const swPath = pageType === 'welcome'
    ? 'service-worker.js?v=20250825104842'
    : '../service-worker.js?v=20250825104842';
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swPath).catch(()=>{});
  });
}


// Hide legend when switching away from Welcome via UI controls
['rostersButton','ownershipButton','previewButton','leagueSelect','positionalViewBtn','depthChartViewBtn'].forEach(id=>{
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', hideLegend, {capture:true});
});

/* one-shot legend guard */
document.addEventListener('DOMContentLoaded', function(){
  var legend = document.getElementById('legend-section');
  var roster = document.getElementById('rosterView');
  var list   = document.getElementById('playerListView');
  if (legend && ((roster && !roster.classList.contains('hidden')) || (list && !list.classList.contains('hidden')))) {
    legend.classList.add('hidden');
  }
});
