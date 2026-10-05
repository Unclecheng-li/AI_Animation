# Hero Toast Stack

Three product toasts (success → info → warning) slide in and settle. Function: **system feedback / notification stack**.

## Purpose

- Publish confirmations, sync notices, soft warnings
- Staggered entrance without overlapping property fights
- Neutral zinc product UI

## Specs

- Toasts enter 0.6s apart from the right
- Soft float hold after stack completes
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep each toast to one title + one line of body copy for readability at 1920×1080.
