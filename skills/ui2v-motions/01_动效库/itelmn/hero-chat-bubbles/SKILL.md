# Hero Chat Bubbles

A light messaging thread fills with alternating incoming and outgoing bubbles. Function: **conversation UI reveal** for collaboration products.

## Purpose

- Chat, support, and collab heroes
- Soft cyan paper background
- Left/right bubble hierarchy

## Specs

- Four bubbles stagger in with slight scale
- Outgoing bubbles use brand cyan fill
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep each bubble to one or two short lines so the thread stays readable in a carousel thumbnail.
