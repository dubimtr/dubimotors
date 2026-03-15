# Review 3 Feedback Items

## Slide 1 — Place Your Ad (AI Photo Mode)
1. AI failed to identify model and trim from black Mercedes C63 photo — should be easily identifiable. Also didn't detect exterior color (black) or body type (coupe). Fix the AI photo analysis prompt.
2. Step progress bar looks weird when scrolling — text flows behind it. Also not shifting between steps (Vehicle Details → Photos → Pricing) as user scrolls. Fix sticky progress bar z-index and make steps advance on scroll/completion.
3. VIN Mode: Give option to upload backside of "Mulkiya" (UAE registration card). When uploaded, AI should read the Chassis No. (VIN) field highlighted in the image (e.g. WBS8M9109J5K19627) and auto-fill it.

## Slide 2 — Place Your Ad (VIN Mode)
4. VIN lookup did not select Model and Trim — should be easily identified from VIN. Fix VIN decode prompt to always return model and trim.
5. AI Price Estimator used BMW 3-series pricing for a BMW M3 — completely different price. Fix price estimator to use the exact model+trim in the prompt, not just the brand.

## Slide 3 — Listing Detail Page
6. Full Specifications: Model field shows full title "2024 Volkswagen Golf GTI P1RTG" — should show just "Golf". Add separate Trim row showing "GTI".
7. Finance calculator max is 5,000,000 — too high. Max should be 2,000,000.
8. Allow manual text input for Car Price (not just slider) so user can type exact number like 105,490.
9. Down Payment: show the AED amount alongside the percentage, e.g. "35% (AED 1,750,000)".

## Slide 4 — Cars Listing Page
10. Brand logo strip: show only top 10 most popular brands in UAE, make sure all logos are included (with actual logo images).
11. Filters are not automatically applying — listed items not changing when filters are adjusted. Fix filter logic to apply in real-time.
12. Listing detail specs: Missing Exterior Color and Interior Color in Full Specifications. Make sure all fields are present.
