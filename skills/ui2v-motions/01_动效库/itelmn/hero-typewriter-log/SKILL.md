# Hero Typewriter Log

A terminal window types a ui2v publish command, then prints success lines. Function: developer ritual / CLI demo, not abstract motion.

## Purpose
- Developer-tool marketing
- Showing the real publish command path
- Monospace deterministic typewriter effect

## Specs
- Characters appear via onUpdate slice of a fixed string
- Success lines fade after the command completes

## Usage
Install hero-typewriter-log and scrub around 2.5s to see the OK line.

## Notes
Never use Math.random for typing delays; the slice counter stays seek-safe.
