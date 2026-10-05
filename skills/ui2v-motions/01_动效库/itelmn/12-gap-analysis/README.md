# gap-analysis

Animated bar chart showing current vs target scores across multiple performance dimensions.

## Variables

| Variable | Type | Default | Notes |
|---|---|---|---|
| title | string | "Performance Gap Analysis" | Slide heading |
| subtitle | string | "Current State vs Target State" | Sub-heading |
| currentScore | number | 62 | Overall current % |
| targetScore | number | 88 | Overall target % |
| items | JSON string | 4 items | Array of {label,current,target} |
| primaryColor | color | #285f9f | ACS blue |
| performanceColor | color | #cd5746 | Current bar colour |
| potentialColor | color | #2f765f | Target bar colour |
| bgColor | color | #f5f2ea | Canvas background |
| basePlateImage | string | v2-base-blue.png | Base plate graphic |
| duration | number | 10 | Slide duration (seconds) |

## Render

```bat
render.bat
```
