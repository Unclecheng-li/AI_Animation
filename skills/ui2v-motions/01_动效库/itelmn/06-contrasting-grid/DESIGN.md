# contrasting-grid — Design Notes

## Layout
- 3×N grid auto-sized to fit canvas
- Each cell: .cell-bg (colour fill div), large .cell-number, hidden .cell-content

## Animation
- Initial 2s: all cells visible as numbered tiles
- Per item: number fades/scales out → bg dims to 8% opacity → content fades in (y: 20→0)
- TOTAL = 2 + items.length × durPerItem + 1

## V3 Constraints
- No tl.call()
- .cell-bg handles colour fill separately from cell border so opacity can be animated independently
