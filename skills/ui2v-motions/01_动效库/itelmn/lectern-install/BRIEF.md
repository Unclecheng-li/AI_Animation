---
workflow: general-video
flow: automation
storyboard: no
message: "Install Lectern in 3 steps — download, drag to Applications, approve with Open Anyway"
destination: website-embed
aspect: 1600x1000
language: en
length: 26s
angle: install-walkthrough
---

## Intent

A silent install walkthrough for the Lectern website, in the style of the Wispr Flow reference recording. A persistent left panel lists the 3 steps while the right stage animates a browser Downloads window, a drag of Lectern.app onto Applications, and a System Settings Privacy & Security approval with Open Anyway. Forest-green Lectern identity, Outfit type, orange cursor. No narration, no new claims — every step matches install.html.

## Assets

- videos/lectern-install/assets/icon.png — Lectern app icon; brand row and installer window.
- videos/lectern-install/assets/settings-general.png — real System Settings General screenshot; step 3 opens on it, cursor searches Privacy.
- videos/lectern-install/assets/privacy-security.png — real Privacy & Security screenshot; step 3 pushes in on it and simulates the Open Anyway press.
- assets/install/download.svg — reference for the Downloads + DMG beat.
- assets/install/applications.svg — reference for the drag-to-Applications beat.
- assets/install/open.svg — reference for the Open Anyway beat.
- assets/install/setup.svg — out-of-scope for this cut; setup assistant stays on the page, not in the video.

## Customizations

- Split layout like the reference: dark steps panel left, animated macOS windows right, orange cursor with click rings.
- After a download starts from any data-mac-download link off the install and film pages, navigate to downloads.html, a fullscreen page playing only this film.

## Notes

- Reference recording is 14.7s, 2940x1598, drag-only; this cut extends the same language to the Open Anyway approval install.html already documents.
- Step 3 reshoot: real screenshots replace the vector mock. Cursor clicks the Settings search field, types "Privacy" letter by letter, picks the Privacy & Security result, then the pane crossfades with a push-in on the Open Anyway row; a press flash plus click ring simulates the press and an approval pill confirms it.
- Duration driver is the three beats plus intro/outro; 26s total at 1600x1000 to match lectern-product.
