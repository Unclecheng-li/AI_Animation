# Hero Form Validate

Three form fields turn green with checkmarks, then the CTA unlocks. Function: **signup / validation / trust**.

## Purpose

- Onboarding forms, workspace create, profile complete
- Sequential field success then button enable
- Cool blue product chrome

## Specs

- Fields validate at 1.1s / 1.7s / 2.3s
- Button gains `.ready` after the last check
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep filled values static — the motion is the validation, not typing.
