# Hero Search Focus

A large search field focuses, types `progress`, and opens a result list. Function: **discover / query / find**.

## Purpose

- Registry search, docs find, and command-palette heroes
- Focus ring + typed query + staggered hits
- Warm stone editorial chrome

## Specs

- Query string is authored as `progress` (7 chars over 1.1s)
- Results expand after typing completes
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Match highlighted `<em>` tokens to the typed query so the demo stays coherent.
