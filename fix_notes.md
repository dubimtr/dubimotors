# Issues to Fix

## 1. Filter Bar Z-Index Overlap (CRITICAL)
- The sticky filter bar (All Cities / All Makes / All Models / All Trims) overlaps the listing card images when scrolling
- The filter bar has `position: sticky; top: 68px; z-index: 100` in style.css
- The listing cards are behind it but their images/badges bleed through
- FIX: The filter bar is sticky and overlaps the listing cards below it. Need to ensure the listing layout has proper top padding to account for the sticky filter bar height, OR remove sticky positioning from filter bar.
- The circle in the screenshot shows the filter bar overlapping the car images - the filter bar is sticky and sits on top of the listing cards as you scroll

## 2. Brand Logos Not Showing
- CDN hotlink protection issues
- Currently using text-based SVG badges as fallback
- Need better solution: inline SVG logos or reliable API

## 3. Missing Exterior/Interior Color in Full Specs
- The Full Specifications table in listing.html doesn't show Exterior Color or Interior Color
- The listings in shared.js lack extColor/intColor fields
- Need to: add extColor/intColor to all listings in shared.js AND add rows to the specs table in listing.html

## 4. AI Photo Upload Not Detecting Trim
- FIXED: Upgraded prompt with detailed trim detection instructions
- Changed model to gemini-2.5-flash for better vision
- Increased max_tokens to 600

## 5. Sidebar Price Card Overlapping
- FIXED: Removed sticky positioning from sidebar

## Current State of Fixes
- AI prompt: UPGRADED
- Filter bar: NEEDS FIX (remove sticky or add padding)
- Brand logos: NEEDS BETTER SOLUTION
- Color fields: NEEDS DATA + SPEC TABLE ROWS
- Sidebar: ALREADY FIXED (position: relative)
