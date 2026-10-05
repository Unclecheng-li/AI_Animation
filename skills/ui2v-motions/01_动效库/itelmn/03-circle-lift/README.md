# circle-lift

Central letter circle that swaps letters as content cycles through steps. Text panels alternate left/right.

## Variables

| Variable | Type | Default |
|---|---|---|
| title | string | "Leadership Capability Framework" |
| steps | JSON string | Array of {letter,label,side,heading,body} |
| primaryColor | color | #285f9f |
| bgColor | color | #f5f2ea |
| basePlateImage | string | v2-base-blue.png |
| durPerStep | number | 4 |

`side` in each step item must be `"left"` or `"right"` — controls which text panel is visible.
