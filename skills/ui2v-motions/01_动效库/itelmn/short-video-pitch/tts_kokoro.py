#!/usr/bin/env python3
"""
Kokoro 中文 TTS 生成脚本

绕过 hyperframes tts 命令(在用户机器找不到 venv 的 kokoro-onnx),
直接用 kokoro-onnx Python lib 生成 wav。

用法:
    /Users/qiu/.kokoro-venv/bin/python tts_kokoro.py "文本" zf_xiaobei output.wav

模型在 ~/.kokoro-models/ 下:
- kokoro-v1.0.fp16.onnx (155 MB,half precision,质量与 full 几乎一样)
- voices-v1.0.bin (27 MB,含 54 个 voice)
"""

import sys
import os
from pathlib import Path

from kokoro_onnx import Kokoro
import soundfile as sf

MODEL_DIR = Path.home() / ".kokoro-models"
MODEL_PATH = MODEL_DIR / "kokoro-v1.0.fp16.onnx"
VOICES_PATH = MODEL_DIR / "voices-v1.0.bin"


def main():
    if len(sys.argv) < 4:
        print("Usage: tts_kokoro.py <text> <voice> <output.wav> [speed]", file=sys.stderr)
        sys.exit(1)

    text = sys.argv[1]
    voice = sys.argv[2]
    output = sys.argv[3]
    speed = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0

    # voice 前缀决定语言:z=普通话,a=美式英语,b=英式...
    lang_prefix = voice[0]
    lang_map = {
        "a": "en-us", "b": "en-gb", "e": "es", "f": "fr-fr",
        "h": "hi", "i": "it", "j": "ja", "p": "pt-br", "z": "cmn",
    }
    lang = lang_map.get(lang_prefix, "en-us")

    if not MODEL_PATH.exists():
        print(f"Model missing: {MODEL_PATH}", file=sys.stderr)
        sys.exit(2)
    if not VOICES_PATH.exists():
        print(f"Voices missing: {VOICES_PATH}", file=sys.stderr)
        sys.exit(2)

    print(f"[Kokoro] Loading model from {MODEL_PATH}", file=sys.stderr)
    kokoro = Kokoro(str(MODEL_PATH), str(VOICES_PATH))

    print(f"[Kokoro] Synthesizing voice={voice} lang={lang} speed={speed}", file=sys.stderr)
    samples, sr = kokoro.create(text, voice=voice, speed=speed, lang=lang)

    sf.write(output, samples, sr)
    duration = len(samples) / sr
    print(f"[Kokoro] Wrote {output} duration={duration:.2f}s sr={sr}", file=sys.stderr)
    print(duration)  # stdout: 时长(秒),给 shell 脚本读


if __name__ == "__main__":
    main()
