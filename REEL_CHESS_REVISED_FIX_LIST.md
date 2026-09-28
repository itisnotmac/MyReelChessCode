# Reel Chess Revised Fix List

This replaces the earlier pre-launch checklist as the working plan. Tasks are grouped by the model best suited to complete and verify them. Finish and test one task before committing it; continue directly on `android-native`.

## Already complete

- [x] **B1-1 — Remove retired Grandmaster avatars.** Completed and pushed as `e2c137b`.
- [x] **B1-2 — Repair rated ELO updates and labels.** Completed and pushed as `98e7d6c`.
- [x] **B1-3 — Repair bottom-tab navigation.** Completed and pushed as `5c6b162`.
- [x] **Lobby hamburger and Sign Out.** Completed and pushed as `610724b`.

## Luna queue — work through these in order

### B2 — Lobby and layout

- [ ] **B2-1 — Keep the three lobby actions visible.** At 375×812 and desktop sizes, show and allow taps on Learn Chess, Play Chess, and Earn Chess without scrolling or bottom-bar overlap.
- [ ] **B2-2 — Contain the latency badge.** Default it off for new players; show it only in the lobby when enabled; keep it clear of content and absent from public pages.
- [ ] **B2-3 — Keep settings switches inside the screen.** Check phone and desktop layouts.
- [ ] **B2-4 — Start each page at the top.** Route changes should reset scroll position; browser Back and in-page navigation must still work.
- [ ] **B2-5 — Avoid a false zero while Tempo loads.** Show a loading placeholder until the real balance arrives; show zero only for a confirmed zero balance.

### B3 — Store

- [ ] **B3-1 — Render store cards promptly while scrolling.** Inspect delayed rendering and preload section thumbnails where that fixes the observed blank cards.
- [ ] **B3-2 — Correct every “None” option label.** Show Equip when inactive and Equipped when active, including Username Glow.

### B4 — Game details and account activity

- [ ] **B4-2 — Show the selected AI difficulty in the opponent card.** Include the difficulty name and its existing icon.
- [ ] **B4-4 — Correct game-history times.** Store UTC timestamps and display in the device’s local timezone; verify with a newly recorded game.
- [ ] **B4-5 — Keep settings changes out of the activity feed.** Retain match, challenge-progress, and reward activity.

### B5 — Reel Chess University

- [ ] **B5-1 — Improve lesson-menu readability.** Dim or blur the scene behind the open menu, increase item opacity, and align item edges.
- [ ] **B5-2 — Separate the Beginner card from carousel text.** Ensure the selected card cleanly covers or hides labels behind it.
- [ ] **B5-3 — Use the actual lesson count.** Make the About page and University agree, preferably from one source of truth.

### B6 — Public site copy

- [ ] **B6-1 — Correct AI difficulty descriptions.** Update the feature card, game-mode section, and FAQ to match the modes in the app.
- [ ] **B6-2 — Remove the inaccurate “No accounts needed” claim.** Keep login requirements consistent across the Local PvP card and Play buttons.
- [ ] **B6-3 — Describe the available game modes and features.** Include BlitzSchach, online PvP, WiFi Match by QR, 2v2 Team, Daily Challenges/Tempo, and the store/cosmetics.
- [ ] **B6-5 — Polish About page voice and copy.** Use one consistent voice; correct grammar and typos; keep difficulty and lesson details accurate.

## Sol queue — resume after the Luna queue

- [ ] **B1-4 — Add the confirmed departure policy across online human-vs-human matches.** AI and same-device local departures are recorded as Abandoned but do not advance the online penalty sequence. For online play: first departure is tracked without loss or ELO deduction; another within 30 minutes adds one Loss and −50 ELO; another within 2 hours adds one Loss and −100 ELO; another within 6 hours adds one Loss and −150 ELO; another within 24 hours starts a 30-day online-only suspension. The fifth departure adds no further loss or ELO deduction. Account access and AI/local play remain available during suspension. Expired windows start a fresh sequence. Warn with the applicable consequence before leaving. Enforce the policy on the server, preserve the record across devices and history deletion, and make interrupted exits safely retryable.
- [ ] **B4-3 — Show match history from the player’s perspective.** Use Win, Loss, Tie, and Abandoned. Penalized online departures count in both Loss and Abandoned; preserve the played side as secondary information where useful. Keep history and summary counts consistent with B1-4.
- [ ] **B4-1 — Fix the 3D chess view.** Give the two armies clearly different materials and fit the full board and pieces at desktop and phone sizes.
- [ ] **B6-4 — Remove the old “Coming Soon” hero artwork.** Replace the embedded-text background with a text-free version of the art, preserve the existing fill treatment, and verify the live page has one hero title and no stale banner.

## Shared working rules

- Work only on `android-native`. Commit each completed task directly to that branch. Never open a pull request. If push is rejected, pull, resolve, and push to the same branch.
- Before editing each task, name the files to be changed. Keep each task in its own commit and pause for the user’s test approval before starting the next task.
- Test UI changes at 375×812 and desktop sizes. A local build or mocked API check does not prove the live Base44 backend or website is updated; report which environment was actually verified.
- Do not change signing configuration, keystores, application ID, or release-signing files under `android/app`.
- Do not add a `serverUrl` override to `base44Client.js`.
- Do not use `Date.now()` as an animation key.
- The unfinished B1-4 changes in the working tree are an uncommitted draft. Review and complete that work under the Sol queue before relying on it; it has not been pushed or marked complete.
