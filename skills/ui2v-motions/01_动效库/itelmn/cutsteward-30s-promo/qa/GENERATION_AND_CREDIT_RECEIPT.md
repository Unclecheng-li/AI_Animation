# Generation and credit receipt

## Authorized actions

| Action | Count | Provider surface | Locked settings | Result |
|---|---:|---|---|---|
| Video generation | 1 submit | ElevenLabs Image & Video | Veo 3.1 Fast · 16:9 · 720p · 4s · audio off · one generation | Downloaded and full-decode verified for private evaluation; excluded from public release because the service is Beta |
| Voice generation | 1 submit | ElevenLabs Text to Speech | Ben - Deep, Warm, Conversational · Eleven v3 · MP3 44.1 kHz | First result downloaded and full-decode verified |

No retry, enhancement, alternate submit, batch, upscale, extension, lip sync, ElevenLabs music generation, purchase, or top-up was performed.

## Observed credit ledger

Absolute account balances are intentionally excluded as private quota metadata.

- Observed total change: `9,067` credits.
- Verified TTS change: `1,484` credits.
- Observed video-period change: `7,583` credits.
- The video submission UI displayed `4,000` credits before submit. Because that display differs from the observed balance change, this receipt records both facts and does not speculate about the cause.

## Public-release decision

- Logged-in account evidence showed an active ElevenLabs Grant plan through 2027-01-12.
- ElevenLabs documents Startup Grants as Scale access for building, testing, and launching a product, and documents Eleven v3 as generally available. The final mix therefore retains the single Eleven v3 narration, subject to the account agreement and provider policies.
- ElevenLabs documents Image & Video as Beta, and its Beta Services terms prohibit commercial or production use. The Veo evaluation is therefore local and Git-ignored; it is not used in the public master.

## Integrity

- Video SHA-256: `d6e42c0b892af1b509703bc9b4231384f1d9bfb5554896d7dbdd35e8765c39ed`.
- Voice SHA-256: `bfd7b5939e9f059d0262535065f45f35bf83ea285ece155995723e0daa05432f`.
- Both files passed a complete FFmpeg decode with error escalation.
