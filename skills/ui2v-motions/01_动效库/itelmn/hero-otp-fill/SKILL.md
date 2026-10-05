# Hero OTP Fill

Six one-time-passcode cells fill digit by digit, then all confirm. Function: **2FA / verify / login**.

## Purpose

- Auth, checkout confirm, and device trust heroes
- Focus ring moves with each digit
- Centered night UI

## Specs

- Digits: `842916` at 0.35s intervals
- Final beat marks all cells verified
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Use a fake code only — never embed real production secrets in demos.
