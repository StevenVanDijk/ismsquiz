# NEN 7510 Quiz — Functional Specification

## User Stories

---

### US-001: View dashboard on app open
**As a** learner
**I want to** see a dashboard when I open the app
**So that** I get an immediate overview of my learning progress

**Acceptance Criteria**
- AC-1: The default route (`/`) redirects to `/dashboard`
- AC-2: The dashboard is visible without logging in
- AC-3: Unknown routes redirect to `/dashboard`

**Tests:** `app.routes.spec.ts > US-001`

---

### US-002: View total XP on dashboard
**As a** learner
**I want to** see my total XP on the dashboard
**So that** I know how much I have earned overall

**Acceptance Criteria**
- AC-1: Total XP is displayed in the hero card
- AC-2: XP starts at 0 for a new user
- AC-3: XP updates immediately after answering a question correctly

**Tests:** `dashboard.component.spec.ts > US-002`

---

### US-003: View current level on dashboard
**As a** learner
**I want to** see my current level on the dashboard
**So that** I feel a sense of progression

**Acceptance Criteria**
- AC-1: Level is displayed in the hero card with a star icon
- AC-2: Level starts at 1 for a new user (0 XP)
- AC-3: Level increases by 1 for every 100 XP earned
- AC-4: At 100 XP the level is 2; at 200 XP level is 3

**Tests:** `dashboard.component.spec.ts > US-003`

---

### US-004: View XP progress bar towards next level
**As a** learner
**I want to** see how much XP I need to reach the next level
**So that** I am motivated to keep going

**Acceptance Criteria**
- AC-1: A progress bar shows progress within the current level (0–100%)
- AC-2: At 0 XP the bar shows 0%
- AC-3: At 50 XP the bar shows 50%
- AC-4: At 100 XP (level 2) the bar resets to 0%
- AC-5: At 150 XP the bar shows 50%

**Tests:** `dashboard.component.spec.ts > US-004`

---

### US-005: View current streak on dashboard
**As a** learner
**I want to** see my current consecutive correct answer streak
**So that** I am motivated to keep answering correctly

**Acceptance Criteria**
- AC-1: Streak is displayed in the stats row with a bolt icon
- AC-2: Streak starts at 0 for a new user
- AC-3: Streak increments by 1 for each correct answer
- AC-4: Streak resets to 0 after any incorrect answer

**Tests:** `dashboard.component.spec.ts > US-005`, `progress.service.spec.ts > US-005`

---

### US-006: View overall completion percentage on dashboard
**As a** learner
**I want to** see what percentage of all chapters I have completed
**So that** I know how far along I am in total

**Acceptance Criteria**
- AC-1: Overall percentage is shown in the stats row
- AC-2: 0% shown when no chapters are completed
- AC-3: 100% shown when all chapters are completed
- AC-4: Percentage = completed chapters / total chapters × 100, rounded

**Tests:** `dashboard.component.spec.ts > US-006`, `progress.service.spec.ts > US-006`

---

### US-007: View total questions answered on dashboard
**As a** learner
**I want to** see how many questions I have answered in total
**So that** I can gauge my study effort

**Acceptance Criteria**
- AC-1: Total questions answered is shown in the stats row with a quiz icon
- AC-2: Starts at 0 for a new user
- AC-3: Increments by 1 for each answer attempt (correct or incorrect)

**Tests:** `dashboard.component.spec.ts > US-007`

---

### US-008: View recent badges on dashboard
**As a** learner
**I want to** see my recently unlocked badges on the dashboard
**So that** I feel rewarded for my progress

**Acceptance Criteria**
- AC-1: Up to 3 badges are shown in the badges section
- AC-2: Unlocked badges are shown first, then locked badges fill remaining slots
- AC-3: An "Alle badges" button links to the full badge collection
- AC-4: Unlocked badges display in colour; locked badges display in greyscale

**Tests:** `dashboard.component.spec.ts > US-008`

---

### US-009: Navigate to chapter list from dashboard
**As a** learner
**I want to** navigate to the full chapter list from the dashboard
**So that** I can choose which chapter to study

**Acceptance Criteria**
- AC-1: Each chapter mini-card on the dashboard is clickable
- AC-2: Clicking a chapter mini-card navigates to `/chapters/:id`
- AC-3: An "Alle hoofdstukken" button navigates to `/chapters`

**Tests:** `dashboard.component.spec.ts > US-009`

---

### US-010: View chapter progress on dashboard
**As a** learner
**I want to** see a progress bar for each chapter on the dashboard
**So that** I know at a glance which chapters need more work

**Acceptance Criteria**
- AC-1: Each chapter card shows a progress bar
- AC-2: Progress bar reflects percentage of questions answered correctly
- AC-3: Chapter colour accent is visible on each card

**Tests:** `dashboard.component.spec.ts > US-010`

---

### US-011: View all chapters in chapter list
**As a** learner
**I want to** see all NEN 7510 chapters listed
**So that** I can choose which one to study

**Acceptance Criteria**
- AC-1: All chapters from `index.json` are displayed
- AC-2: Each card shows: icon, chapter number, title, subtitle, progress bar, question count, completion %
- AC-3: A page title "Hoofdstukken" is visible

**Tests:** `chapter-list.component.spec.ts > US-011`

---

### US-012: See chapter completion indicator in chapter list
**As a** learner
**I want to** see which chapters I have fully completed
**So that** I can focus on incomplete chapters

**Acceptance Criteria**
- AC-1: A green checkmark icon is shown on completed chapters
- AC-2: No checkmark is shown on incomplete chapters
- AC-3: A chapter is complete when all questions have been answered correctly at least once

**Tests:** `chapter-list.component.spec.ts > US-012`, `progress.service.spec.ts > US-012`

---

### US-013: Navigate to chapter detail from chapter list
**As a** learner
**I want to** tap a chapter card to see its details
**So that** I can review the chapter before starting a quiz

**Acceptance Criteria**
- AC-1: Clicking a chapter card navigates to `/chapters/:id`
- AC-2: The correct chapter ID is passed in the URL

**Tests:** `chapter-list.component.spec.ts > US-013`

---

### US-014: View chapter detail page
**As a** learner
**I want to** see details about a chapter before starting its quiz
**So that** I know what I am about to study

**Acceptance Criteria**
- AC-1: The chapter title, subtitle, icon, and colour are displayed in a hero section
- AC-2: Chapter number is displayed
- AC-3: Total question count is shown
- AC-4: XP reward per correct answer is shown
- AC-5: A progress bar shows current completion percentage

**Tests:** `chapter-detail.component.spec.ts > US-014`

---

### US-015: Start a quiz from chapter detail
**As a** learner
**I want to** start a quiz directly from the chapter detail page
**So that** I can begin learning immediately

**Acceptance Criteria**
- AC-1: A prominent "Start quiz" button is visible
- AC-2: Clicking it navigates to `/quiz/:chapterId`
- AC-3: When the chapter is already completed, the button reads "Opnieuw oefenen"

**Tests:** `chapter-detail.component.spec.ts > US-015`

---

### US-016: See questions during a quiz
**As a** learner
**I want to** be shown quiz questions one at a time
**So that** I can focus on each question individually

**Acceptance Criteria**
- AC-1: One question is shown at a time
- AC-2: The question text is clearly visible
- AC-3: Four answer options (A, B, C, D) are shown as large tappable buttons
- AC-4: The section reference (e.g. "4.1") and difficulty badge are shown
- AC-5: A loading spinner is shown while questions are being fetched

**Tests:** `quiz.component.spec.ts > US-016`, `question-card.component.spec.ts > US-016`

---

### US-017: See progress through the quiz
**As a** learner
**I want to** see how far through the quiz I am
**So that** I know how many questions remain

**Acceptance Criteria**
- AC-1: A "Vraag X / Y" counter is shown above the question
- AC-2: A progress bar fills as questions are answered
- AC-3: Progress bar value = (current index / total questions) × 100

**Tests:** `quiz.component.spec.ts > US-017`

---

### US-018: Select an answer
**As a** learner
**I want to** tap an answer option to select it
**So that** I can submit my answer

**Acceptance Criteria**
- AC-1: Tapping an option triggers answer evaluation immediately
- AC-2: Only one answer can be selected per question
- AC-3: After selection all other options become disabled

**Tests:** `question-card.component.spec.ts > US-018`

---

### US-019: See correct answer feedback
**As a** learner
**I want to** know immediately whether my answer was correct
**So that** I can learn from each attempt

**Acceptance Criteria**
- AC-1: If correct: the selected option turns green with a checkmark icon
- AC-2: If incorrect: the selected option turns red with an X icon, and the correct option turns green
- AC-3: Unselected incorrect options are dimmed
- AC-4: An explanation text is shown below the options after any answer

**Tests:** `question-card.component.spec.ts > US-019`

---

### US-020: See XP earned after a correct answer
**As a** learner
**I want to** see how much XP I earned for a correct answer
**So that** I feel rewarded

**Acceptance Criteria**
- AC-1: "+X XP" is shown in the action area after a correct answer
- AC-2: The XP badge is hidden (opacity 0) after an incorrect answer
- AC-3: XP value matches `question.xpValue`

**Tests:** `quiz.component.spec.ts > US-020`

---

### US-021: Proceed to next question
**As a** learner
**I want to** tap a button to go to the next question after seeing feedback
**So that** I can continue the quiz at my own pace

**Acceptance Criteria**
- AC-1: A "Volgende vraag" button appears after answering
- AC-2: Tapping it advances to the next question
- AC-3: Feedback state is cleared; all options are re-enabled

**Tests:** `quiz.component.spec.ts > US-021`

---

### US-022: Complete a quiz and be taken to results
**As a** learner
**I want to** be automatically taken to the results page after the last question
**So that** I see my performance summary

**Acceptance Criteria**
- AC-1: After the last question the "Volgende vraag" button reads "Bekijk resultaten"
- AC-2: Tapping it navigates to `/results/:chapterId`
- AC-3: The results page receives the correct chapter ID

**Tests:** `quiz.component.spec.ts > US-022`

---

### US-023: Questions are shuffled each session
**As a** learner
**I want to** get questions in a different order each time
**So that** I genuinely learn the material rather than memorising order

**Acceptance Criteria**
- AC-1: `QuizStateService.startSession` shuffles questions by default
- AC-2: The original array is not mutated
- AC-3: All questions are present after shuffling (no items lost)

**Tests:** `quiz-state.service.spec.ts > US-023`

---

### US-024: View results score
**As a** learner
**I want to** see my score as a percentage on the results page
**So that** I know how well I did

**Acceptance Criteria**
- AC-1: Score percentage is displayed in a circular ring
- AC-2: Correct / total count is shown (e.g. "4/5 goed")
- AC-3: Score = correct answers / total answers × 100, rounded

**Tests:** `results.component.spec.ts > US-024`

---

### US-025: View motivational message on results
**As a** learner
**I want to** see an encouraging message based on my score
**So that** I feel motivated regardless of result

**Acceptance Criteria**
- AC-1: Score = 100% → "Perfect! Uitstekend gedaan!" with 🏆
- AC-2: Score ≥ 80% → "Geweldig resultaat!" with 🌟
- AC-3: Score ≥ 60% → "Goed bezig!" with 👍
- AC-4: Score < 60% → "Blijf oefenen, je komt er!" with 📚

**Tests:** `results.component.spec.ts > US-025`

---

### US-026: View XP earned on results page
**As a** learner
**I want to** see how much XP I earned in the session
**So that** I understand the reward I received

**Acceptance Criteria**
- AC-1: "+X XP verdiend!" is shown in an XP banner
- AC-2: The banner also shows total XP accumulated
- AC-3: Session XP = sum of xpValue for all correct answers in the session

**Tests:** `results.component.spec.ts > US-026`

---

### US-027: View newly unlocked badges on results page
**As a** learner
**I want to** see badges I unlocked during the quiz
**So that** I feel rewarded for my achievement

**Acceptance Criteria**
- AC-1: A "Nieuwe badges!" section appears if any badges were unlocked
- AC-2: Each new badge is shown with highlight styling (pop animation)
- AC-3: The section is hidden when no new badges were unlocked
- AC-4: After the results page is loaded, `newlyUnlockedBadgeIds` is cleared

**Tests:** `results.component.spec.ts > US-027`, `progress.service.spec.ts > US-027`

---

### US-028: Review answers on results page
**As a** learner
**I want to** see a review of every answer I gave
**So that** I can learn from my mistakes

**Acceptance Criteria**
- AC-1: Every answered question is listed
- AC-2: Each entry shows the question text and the user's answer
- AC-3: For incorrect answers, the correct answer is also shown
- AC-4: A green/red icon indicates correctness per question

**Tests:** `results.component.spec.ts > US-028`

---

### US-029: Retry a quiz from results page
**As a** learner
**I want to** immediately retry a quiz from the results page
**So that** I can practice until I master the material

**Acceptance Criteria**
- AC-1: An "Opnieuw proberen" button is visible
- AC-2: Tapping it navigates to `/quiz/:chapterId`
- AC-3: A new shuffled session starts

**Tests:** `results.component.spec.ts > US-029`

---

### US-030: Navigate to chapter list from results page
**As a** learner
**I want to** go back to the chapter list from the results page
**So that** I can choose a different chapter

**Acceptance Criteria**
- AC-1: A "Hoofdstukken" button is visible
- AC-2: Tapping it navigates to `/chapters`

**Tests:** `results.component.spec.ts > US-030`

---

### US-031: View all badges in badge collection
**As a** learner
**I want to** see all available badges
**So that** I know what I can earn

**Acceptance Criteria**
- AC-1: All badges from `badges.json` are displayed
- AC-2: Unlocked badges are shown in full colour
- AC-3: Locked badges are shown in greyscale with a lock icon
- AC-4: Page title shows "X / Y ontgrendeld"

**Tests:** `badge-collection.component.spec.ts > US-031`

---

### US-032: View badge details
**As a** learner
**I want to** see each badge's name and description
**So that** I know what I need to do to earn it

**Acceptance Criteria**
- AC-1: Badge name is shown on the card
- AC-2: Badge description/criteria is shown on the card
- AC-3: A tooltip shows the description on hover/long-press
- AC-4: Locked badge tooltip reads "Vergrendeld: {description}"

**Tests:** `badge-card.component.spec.ts > US-032`

---

### US-033: View badge unlock progress
**As a** learner
**I want to** see overall badge unlock progress
**So that** I know how close I am to collecting all badges

**Acceptance Criteria**
- AC-1: A horizontal progress bar at the top shows unlock percentage
- AC-2: Bar width = (unlocked / total) × 100%

**Tests:** `badge-collection.component.spec.ts > US-033`

---

### US-034: Unlock first-quiz badge
**As a** learner
**I want to** receive a badge the first time I answer a question
**So that** I am immediately rewarded for starting

**Acceptance Criteria**
- AC-1: "Eerste stap" badge is unlocked when answering the very first question ever
- AC-2: The badge appears in the newly unlocked list on the results page
- AC-3: It is only unlocked once (not again on subsequent sessions)

**Tests:** `badge.service.spec.ts > US-034`, `progress.service.spec.ts > US-034`

---

### US-035: Unlock chapter completion badge
**As a** learner
**I want to** receive a badge when I complete all questions in a chapter
**So that** I am rewarded for finishing a chapter

**Acceptance Criteria**
- AC-1: Chapter badge unlocks when `questionsCorrect >= totalQuestions` for that chapter
- AC-2: Each chapter has its own badge
- AC-3: Badge is only unlocked once per chapter

**Tests:** `badge.service.spec.ts > US-035`, `progress.service.spec.ts > US-035`

---

### US-036: Unlock perfect score badge
**As a** learner
**I want to** receive a badge for getting 100% in a single session
**So that** I am rewarded for mastery

**Acceptance Criteria**
- AC-1: Badge unlocks when sessionCorrect === sessionTotal === totalQuestionsInChapter
- AC-2: Does not unlock if any question was skipped or answered incorrectly
- AC-3: Can be earned in any chapter

**Tests:** `badge.service.spec.ts > US-036`

---

### US-037: Unlock streak badges
**As a** learner
**I want to** receive badges for maintaining answer streaks
**So that** I am rewarded for consistency

**Acceptance Criteria**
- AC-1: "Op stoom" badge unlocks at streak ≥ 5
- AC-2: "Niet te stoppen" badge unlocks at streak ≥ 10
- AC-3: Streak counts across sessions and chapters
- AC-4: Streak resets to 0 on any incorrect answer

**Tests:** `badge.service.spec.ts > US-037`, `progress.service.spec.ts > US-037`

---

### US-038: Unlock XP milestone badges
**As a** learner
**I want to** receive badges when I reach XP milestones
**So that** I have long-term goals to work towards

**Acceptance Criteria**
- AC-1: "Honderd punten" badge unlocks at totalXP ≥ 100
- AC-2: "Kennis verzamelaar" badge unlocks at totalXP ≥ 500
- AC-3: "Informatiebeveiligingsprofessional" badge unlocks at totalXP ≥ 1000
- AC-4: Badges only unlock once each

**Tests:** `badge.service.spec.ts > US-038`

---

### US-039: Unlock questions-answered badges
**As a** learner
**I want to** receive badges for answering many questions
**So that** I am rewarded for effort regardless of correctness

**Acceptance Criteria**
- AC-1: "Leerling" badge unlocks at totalQuestionsAnswered ≥ 25
- AC-2: "Doorgewinterd" badge unlocks at totalQuestionsAnswered ≥ 100
- AC-3: Counts all attempts including incorrect answers

**Tests:** `badge.service.spec.ts > US-039`

---

### US-040: Unlock all-chapters-complete badge
**As a** learner
**I want to** receive a special badge when I complete every chapter
**So that** I have an ultimate goal to work towards

**Acceptance Criteria**
- AC-1: "NEN 7510 Expert" badge unlocks when all chapters are completed
- AC-2: Requires every chapter to have `completed === true`
- AC-3: Unlocks in the same answer evaluation pass that completes the last chapter

**Tests:** `badge.service.spec.ts > US-040`

---

### US-041: XP is only awarded once per correct question
**As a** learner
**I want to** earn XP for learning new material, not for repeating it
**So that** the XP system measures genuine progress

**Acceptance Criteria**
- AC-1: Answering a question correctly for the first time awards XP
- AC-2: Answering the same question correctly again awards 0 XP
- AC-3: Answering a question incorrectly awards 0 XP

**Tests:** `progress.service.spec.ts > US-041`

---

### US-042: Progress persists across sessions
**As a** learner
**I want to** resume where I left off when I reopen the app
**So that** I do not lose my progress

**Acceptance Criteria**
- AC-1: Progress is saved to localStorage after every answer
- AC-2: On app reload, the same XP, streak, badges, and chapter progress are shown
- AC-3: localStorage key is `nen7510_progress_v1`

**Tests:** `progress.service.spec.ts > US-042`

---

### US-043: Progress resets gracefully on corrupted storage
**As a** learner
**I want to** see a clean app even if my stored data is corrupted
**So that** the app never crashes on startup

**Acceptance Criteria**
- AC-1: If localStorage contains invalid JSON, default progress is used
- AC-2: If schema version mismatches, default progress is used
- AC-3: No error is thrown or displayed to the user

**Tests:** `progress.service.spec.ts > US-043`

---

### US-044: Navigate using bottom navigation bar
**As a** learner
**I want to** switch between Home, Chapters, and Badges using a bottom bar
**So that** I can navigate the app with one hand on mobile

**Acceptance Criteria**
- AC-1: Bottom nav always visible (except during quiz — still visible but quiz fills content area)
- AC-2: Three items: Home (dashboard), Chapters (list), Badges (collection)
- AC-3: Active item is highlighted in primary colour
- AC-4: Tapping an item navigates to the corresponding route

**Tests:** `shell.component.spec.ts > US-044`

---

### US-045: See back button on sub-pages
**As a** learner
**I want to** tap a back button to go up one level
**So that** I can navigate without relying on the browser back button

**Acceptance Criteria**
- AC-1: Back button appears on `/chapters/:id`, `/quiz/:chapterId`, `/results/:chapterId`
- AC-2: Back button is hidden on `/dashboard`, `/chapters`, `/badges`
- AC-3: From `/quiz/:chapterId` back navigates to `/chapters/:chapterId`
- AC-4: From `/results/:chapterId` back navigates to `/chapters`
- AC-5: From `/chapters/:id` back navigates to `/chapters`

**Tests:** `shell.component.spec.ts > US-045`

---

### US-046: See correct page title in toolbar
**As a** learner
**I want to** see a relevant page title in the top bar
**So that** I always know where I am in the app

**Acceptance Criteria**
- AC-1: `/dashboard` → "NEN 7510 Quiz"
- AC-2: `/chapters` → "Hoofdstukken"
- AC-3: `/chapters/:id` → "Hoofdstuk"
- AC-4: `/quiz/*` → "Quiz"
- AC-5: `/results/*` → "Resultaten"
- AC-6: `/badges` → "Badges"

**Tests:** `shell.component.spec.ts > US-046`

---

### US-047: See total XP in toolbar
**As a** learner
**I want to** see my XP in the toolbar at all times
**So that** I am always aware of my progress

**Acceptance Criteria**
- AC-1: XP chip is visible in the top-right of the toolbar
- AC-2: Displays current totalXP value
- AC-3: Updates after each answered question

**Tests:** `shell.component.spec.ts > US-047`

---

### US-048: Progress bar shows correct value
**As a** developer
**I want to** use a reusable progress bar component
**So that** consistent progress visualisation is used throughout the app

**Acceptance Criteria**
- AC-1: `value` input (0–100) controls fill percentage
- AC-2: `label` input text is displayed on the left when `showLabel` is true
- AC-3: Percentage is displayed on the right when `showLabel` is true
- AC-4: `showLabel = false` hides both label and percentage
- AC-5: `height` input controls bar height in pixels

**Tests:** `progress-bar.component.spec.ts > US-048`

---

### US-049: Badge card shows locked state
**As a** learner
**I want to** clearly see which badges are locked
**So that** I know what I still need to earn

**Acceptance Criteria**
- AC-1: Locked badge icon is greyscale (`color: #9E9E9E`)
- AC-2: A lock icon overlay is shown on locked badges
- AC-3: Tooltip reads "Vergrendeld: {description}"

**Tests:** `badge-card.component.spec.ts > US-049`

---

### US-050: Badge card shows unlocked state
**As a** learner
**I want to** clearly see which badges I have already earned
**So that** I feel proud of my collection

**Acceptance Criteria**
- AC-1: Unlocked badge icon is shown in the badge's colour
- AC-2: No lock icon is shown
- AC-3: Tooltip shows the badge description directly
- AC-4: Background is tinted with the badge's colour

**Tests:** `badge-card.component.spec.ts > US-050`

---

### US-051: Badge card compact mode hides text
**As a** developer
**I want to** show badge cards without name/description in tight spaces
**So that** the dashboard badges row fits cleanly

**Acceptance Criteria**
- AC-1: `compact = true` hides the badge name
- AC-2: `compact = true` hides the badge description
- AC-3: Icon is still displayed

**Tests:** `badge-card.component.spec.ts > US-051`

---

### US-052: FindOption pipe resolves option text
**As a** developer
**I want to** resolve an answer option ID to its text
**So that** the results page can display human-readable answers

**Acceptance Criteria**
- AC-1: Given an options array and a valid ID, returns the matching text
- AC-2: Given an invalid ID, returns empty string
- AC-3: Given an empty array, returns empty string

**Tests:** `find-option-pipe.spec.ts > US-052`

---

### US-053: Content service loads chapter index
**As a** developer
**I want to** load the chapter index from JSON
**So that** the app knows which chapters exist

**Acceptance Criteria**
- AC-1: `getChapters()` returns the array of chapters from `assets/data/index.json`
- AC-2: Subsequent calls return the same cached observable (shareReplay)
- AC-3: `getChapter(id)` returns the single matching chapter or `undefined`

**Tests:** `content.service.spec.ts > US-053`

---

### US-054: Content service loads questions per chapter
**As a** developer
**I want to** load questions for a specific chapter on demand
**So that** only needed questions are fetched

**Acceptance Criteria**
- AC-1: `getQuestions('ch04')` fetches from `assets/data/chapters/chapter-04.json`
- AC-2: `getQuestions('annex-a')` fetches from `assets/data/chapters/annex-a.json`
- AC-3: Questions are cached per chapter after first load

**Tests:** `content.service.spec.ts > US-054`

---

### US-055: Content service loads badges
**As a** developer
**I want to** load all badge definitions from JSON
**So that** badge evaluation and display always uses current definitions

**Acceptance Criteria**
- AC-1: `getAllBadges()` returns badges sorted by `sortOrder` ascending
- AC-2: Subsequent calls return the cached observable

**Tests:** `content.service.spec.ts > US-055`

---

### US-056: Quiz state records answers correctly
**As a** developer
**I want to** track answer correctness in quiz state
**So that** scores and XP can be calculated

**Acceptance Criteria**
- AC-1: `recordAnswer(correctId)` returns `correct: true` and `xpEarned = question.xpValue`
- AC-2: `recordAnswer(wrongId)` returns `correct: false` and `xpEarned = 0`
- AC-3: `sessionResults` array grows by 1 per call

**Tests:** `quiz-state.service.spec.ts > US-056`

---

### US-057: Quiz state advances questions
**As a** developer
**I want to** advance through questions in order
**So that** each question is shown once per session

**Acceptance Criteria**
- AC-1: `nextQuestion()` increments `currentIndex` by 1
- AC-2: After the last question `isComplete` becomes `true`
- AC-3: `currentQuestion` returns `null` after completion

**Tests:** `quiz-state.service.spec.ts > US-057`

---

### US-058: Quiz state calculates session score
**As a** developer
**I want to** calculate the percentage score for a session
**So that** the results page can display it

**Acceptance Criteria**
- AC-1: Score = 100 when all answers correct
- AC-2: Score = 0 when all answers incorrect
- AC-3: Score = 50 when half correct (rounded)
- AC-4: Score = 0 when no answers recorded

**Tests:** `quiz-state.service.spec.ts > US-058`

---

### US-059: Quiz state reports active status
**As a** developer
**I want to** know whether a quiz is in progress
**So that** the back-navigation guard can warn the user

**Acceptance Criteria**
- AC-1: `isQuizActive()` returns `false` before session starts
- AC-2: Returns `true` after first answer and before completion
- AC-3: Returns `false` after `isComplete` is `true`

**Tests:** `quiz-state.service.spec.ts > US-059`

---

### US-060: Chapter completion requires all questions correct
**As a** learner
**I want to** complete a chapter only when I have answered all questions correctly
**So that** completion means genuine mastery

**Acceptance Criteria**
- AC-1: `completed` is `false` until every question has been answered correctly at least once
- AC-2: A question answered incorrectly then correctly later counts as correct
- AC-3: `completed` becomes `true` the moment the last question is answered correctly

**Tests:** `progress.service.spec.ts > US-060`

---
