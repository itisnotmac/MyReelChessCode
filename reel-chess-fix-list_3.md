# Reel Chess — Pre-Launch Fix List

## Context for the developer (paste this part first)

Reel Chess is a React/Vite chess game, originally built on Base44, now wrapped with Capacitor for Android. This repo is the Capacitor version. The backend still runs on Base44 (via the Base44 SDK).

Ground rules:
- Work in small batches. One commit per task, with the task ID in the message (e.g. "B1-2: fix ELO update").
- Do NOT touch signing config, keystores, `applicationId`, or anything in `android/app` related to release signing.
- Do NOT re-add `serverUrl: ''` (or any `serverUrl` override) in `base44Client.js`. It breaks every API call on Capacitor.
- Do NOT key animations with `Date.now()`. It caused a flicker bug in BlitzSchach before.
- Before changing anything, tell me which files you plan to edit, then make the change.
- Test at desktop width AND phone width (375×812).

---

## Batch 1 — Launch blockers (do first)

**B1-1. Remove the "Grandmaster Avatars" store category**
- Where: Store → Grandmaster Avatars (Alekhine, Fischer, Capablanca, Karpov, Carlsen, Morphy, Nakamura, Pillsbury, Timman).
- Problem: uses real people's names and photos. That's a legal risk once items are sold.
- Fix: remove the category, its images and its data entries. If a player has one equipped, fall back to their default/custom avatar with no errors. Leave space for a replacement category (coming separately).
- Done when: no real names or photos anywhere in the app or repo, and nobody's profile breaks.

**B1-2. ELO never changes**
- Where: Profile. The account shows ELO 1200 / Peak 1200 after 31 games (18 W, 9 L, 3 D).
- Fix: find where results are saved and make sure ELO and peak ELO update after rated games. If vs-AI games are meant to be unrated, say so in the UI (e.g. "Unrated" label on AI games) and confirm online PvP does update ELO.
- Done when: winning or losing a rated game visibly changes ELO, and peak ELO tracks the highest value.

**B1-3. Bottom tab bar doesn't work from the Store**
- Repro: Lobby → Store tab → scroll down → tap "Profile" in the bottom tab bar. Nothing happens (tried twice). The header profile button works.
- Fix: bottom tabs must navigate from every page. Check for an overlay or scroll container covering the tab bar, or a click handler that stops the event.
- Done when: all 4 tabs work from every page, including after scrolling.

**B1-4. Leaving a game mid-match records a loss with no warning**
- Repro: start vs AI, make a few moves, go to the lobby. History shows "Black Won" (a loss).
- Fix: when a player tries to leave an active game, show a confirmation: "Leave game? This will count as a loss/forfeit." Decide on "Abandoned" vs "Loss" and label it consistently in history.
- Done when: you can't lose a game without seeing the warning first.

---

## Batch 2 — Lobby and layout

**B2-1. Main buttons hidden below the fold**
- Where: Lobby. LEARN CHESS / PLAY CHESS / EARN CHESS sit below the fold on desktop. On a phone (375×812) they're mostly hidden behind the bottom tab bar.
- Fix: the three buttons must be fully visible without scrolling at 375×812 and on desktop. Shrink or reposition the hero art/title if needed. Account for the tab bar height and the safe-area inset.
- Done when: all three buttons are fully visible and tappable on first load at both sizes.

**B2-2. Ping badge overlaps content and shows everywhere**
- Where: the "###ms" latency badge. It covers lesson instructions (RCU), the Store button on Daily Challenges, and the lobby title on mobile. It also appears on the public About page. The setting says "Show live latency badge in the lobby corner".
- Fix: default it to OFF for all players. When on, show it only in the lobby, positioned so it never overlaps anything. Never show it on public pages (About, landing, Privacy, Terms).
- Done when: new players never see it, and when enabled it overlaps nothing.

**B2-3. Settings toggles clipped at the right edge**
- Where: Settings page. The toggle switches are cut off on the right.
- Fix: fix padding/overflow so the toggles are fully visible at desktop and phone widths.

**B2-4. Pages open partway scrolled down**
- Where: Daily Challenges ("REPORT CARD" header is off screen when it opens) and RCU/Tutorial.
- Fix: scroll to the top on every route change.

**B2-5. Tempo shows 0 while loading**
- Where: header Tempo counter. It briefly shows 0 before the real balance loads.
- Fix: show a placeholder/skeleton (e.g. "—") until the balance loads. Never show 0 unless the balance really is 0.

---

## Batch 3 — Store

**B3-1. Store cards stay blank for 1–3 seconds while scrolling**
- Fix: make cards render right away (check for lazy-load/fade-in or `content-visibility` settings causing it). Preload thumbnail images for each section.

**B3-2. Wrong label on "None" options**
- Where: Store → Username Glow. The "None" card says "UNEQUIP" while Crimson is equipped.
- Fix: "None" should say "EQUIP" when it isn't active and "EQUIPPED" when it is, matching every other category. Check all categories that have a "None" option.

---

## Batch 4 — Game screen and history

**B4-1. 3D view: the two armies look the same, and the board is cropped**
- Where: in-game → "Switch to 3D".
- Fix: give white and black clearly different materials/colors (e.g. ivory vs dark bronze). Fit the board to the viewport so no pieces are cut off at the sides or bottom, at desktop and phone sizes.

**B4-2. Opponent label just says "AI"**
- Fix: show the chosen difficulty name (e.g. "Tough Guy", "Final Boss") with its icon in the opponent card.

**B4-3. History says "White Won" / "Black Won"**
- Fix: show results from the player's point of view: "Win" / "Loss" / "Draw" / "Abandoned", colored to match. Keep the side played as small secondary text if useful.

**B4-4. Timestamps may be off**
- Where: Game History. A game played around 10:15 PM Central appeared to show 07:35 PM.
- Fix: store timestamps in UTC and display them in the device's local timezone. Double-check with a fresh test game.

**B4-5. Activity feed shows settings changes**
- Where: Daily Challenges → Activity Feed shows "Theme: Dark", "Theme: Light".
- Fix: only show game and reward events there (games completed, challenges progressed, Tempo earned). Hide settings changes.

---

## Batch 5 — RCU (Reel Chess University)

**B5-1. Lesson menus are hard to read**
- Where: Tutorial → Beginner → section lists (e.g. "Pieces"). Semi-transparent items sit over the busy 3D arena and the left edges zig-zag.
- Fix: dim/blur the background behind open menus, make list items more opaque, and left-align them consistently.

**B5-2. Beginner card overlaps the carousel text**
- Where: RCU home. The "BEGINNER" card overlaps the rotating carousel labels behind it.
- Fix: make sure the active card sits cleanly on top or the carousel labels hide behind it.

**B5-3. Lesson count doesn't match**
- The About page says 64 lessons; the RCU shows 65. Make the copy match the real number (or pull it from the data).

---

## Batch 6 — Public website copy (reelchess.org)

Note: the live site is currently served by Base44. These fixes only go live if they're also made in Base44, or once the site is hosted from this repo.

**B6-1. Wrong AI difficulty info**
- Landing page says 3 levels: "Novice, Arrogant, Grandmaster". The real list is Novice (Practice) + Yellow Belt, Tough Guy, Getting Serious, Brick Top, Final Boss. Update the feature card, the Game Modes section and the FAQ answers.

**B6-2. "No accounts needed" is false**
- The Local PvP card says no account is needed, but every Play button requires login. Either remove the claim or allow guest local play.

**B6-3. Missing game modes and features**
- Add BlitzSchach, Online PvP, WiFi Match (QR), 2v2 Team, Daily Challenges/Tempo, and cosmetics/store to the landing page.

**B6-4. Old "Coming Soon" banner behind the hero title**
- The landing hero background is an old pre-launch banner image with "REEL CHESS / Master the Game of Kings / Coming Soon" drawn into the picture itself (not HTML text). It shows through behind the real hero title, so two titles overlap and the page says "Coming Soon" on a live game.
- Fix: replace the hero background with a text-free version of the image (same art, text removed), keeping the blurred fill above/below. Then search the repo for "Coming Soon" to confirm nothing else references it.
- Done when: only one title shows in the hero, and "Coming Soon" appears nowhere on the site.

**B6-5. About page polish**
- Rewrite in one consistent voice (it switches between "we" and "I" and refers to "the creator's mind"). Fix grammar and typos, and update the difficulty and lesson counts to match the app.
