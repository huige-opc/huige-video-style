#!/usr/bin/env python3
"""Import an existing ASR result into HUIGE Core's transcript contract.

Lets the pipeline run with an existing transcript: use local Whisper
(openai-whisper / faster-whisper), the Volcengine (火山) helper, talkcraft /
Fish TTS timestamps, or any generic segments/words JSON.

usage: import_transcript.py INPUT.json OUT_BASE
  OUT_BASE.asr.json        HUIGE ASR payload (language + segments + words)
  OUT_BASE.transcript.js   window.EV_ASR = {...}: word times for the planner
  OUT_BASE.bilingual.srt   editable source-language captions
  OUT_BASE.en.srt          English block when the input has one (optional)

Accepted inputs (auto-detected):
  local Whisper       {"segments": [{"start","end","text","words":[{"word","start","end"}]?}]}
  Volcengine helper   {"utterances": [{"start_time","end_time","text","words":[...]}]}  (seconds)
  Fish / talkcraft    {"sentences": [{"start","end","text","words":[{"text","start","end"}]}]}
  generic source      {"source": {"language","segments":[...]}} (or {"segments":[...]})
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

CJK = re.compile(r"[぀-ヿ㐀-鿿가-힯]")


def word_of(item):
    text = item.get("text") if item.get("text") is not None else item.get("word", item.get("w", ""))
    start = item.get("start_time", item.get("start", item.get("st", 0)))
    end = item.get("end_time", item.get("end", item.get("ed", start)))
    return {"w": str(text).strip(), "start": round(float(start or 0), 3), "end": round(float(end or 0), 3)}


def segment_of(item):
    words = [word_of(word) for word in (item.get("words") or []) if word_of(word)["w"]]
    start = item.get("start_time", item.get("start", words[0]["start"] if words else 0))
    end = item.get("end_time", item.get("end", words[-1]["end"] if words else start))
    return {"start": round(float(start or 0), 3), "end": round(float(end or 0), 3),
            "text": str(item.get("text", "")).strip(), "words": words}


def load(path: Path):
    data = json.loads(path.read_text(encoding="utf-8-sig"))
    fmt = "generic"
    if isinstance(data.get("utterances"), list):
        fmt, items = "volc", data["utterances"]
    elif isinstance(data.get("sentences"), list):
        fmt, items = "talkcraft", data["sentences"]
    elif isinstance(data.get("source"), dict) and isinstance(data["source"].get("segments"), list):
        fmt, items = "source", data["source"]["segments"]
    elif isinstance(data.get("segments"), list):
        fmt, items = "segments", data["segments"]
    elif isinstance(data.get("words"), list):
        fmt, items = "words", [{"start": data["words"][0].get("start", 0), "end": data["words"][-1].get("end", 0),
                                "text": " ".join(str(w.get("text", w.get("word", ""))) for w in data["words"]),
                                "words": data["words"]}]
    else:
        raise ValueError("unrecognised transcript JSON: expected utterances[], sentences[], segments[] or words[]")
    segments = []
    for item in items:
        segment = segment_of(item)
        if not segment["words"] and segment["text"]:
            tokens = re.findall(r"[぀-ヿ㐀-鿿가-힯]|[A-Za-z0-9']+", segment["text"])
            span = max(segment["end"] - segment["start"], .01)
            segment["words"] = [{"w": token, "start": round(segment["start"] + i * span / max(1, len(tokens)), 3),
                                 "end": round(segment["start"] + (i + 1) * span / max(1, len(tokens)), 3)}
                                for i, token in enumerate(tokens)]
        if segment["text"] or segment["words"]:
            segments.append(segment)
    segments.sort(key=lambda item: (item["start"], item["end"]))
    if not segments:
        raise ValueError("transcript has no usable segments")
    joined = " ".join(segment["text"] for segment in segments)
    language = str(data.get("language") or "").split("-")[0].lower()
    if language not in ("zh", "en", "ja", "ko", "yue"):
        language = "zh" if CJK.search(joined) else "en"
    return fmt, language, segments


def stamp(value: float, sep: str) -> str:
    value = max(0.0, float(value))
    milliseconds = round(value * 1000)
    hours, milliseconds = divmod(milliseconds, 3_600_000)
    minutes, milliseconds = divmod(milliseconds, 60_000)
    seconds, milliseconds = divmod(milliseconds, 1000)
    return f"{hours:02}:{minutes:02}:{seconds:02}{sep}{milliseconds:03}"


def write_srt(path: Path, segments):
    lines = []
    for index, segment in enumerate(segments, 1):
        lines.append(f"{index}\n{stamp(segment['start'], ',')} --> {stamp(segment['end'], ',')}\n{segment['text']}\n")
    path.write_text("\n".join(lines), encoding="utf-8")


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("input", type=Path)
    parser.add_argument("out_base", type=Path)
    args = parser.parse_args(argv)
    source = args.input.resolve()
    if not source.is_file():
        sys.exit(f"transcript not found: {source}")
    fmt, language, segments = load(source)
    base = args.out_base
    base.parent.mkdir(parents=True, exist_ok=True)
    outputs = [base.with_suffix(".asr.json"), base.with_suffix(".transcript.js"), base.with_suffix(".bilingual.srt")]
    clash = [str(path) for path in outputs if path.exists()]
    if clash:
        sys.exit("Refusing to overwrite " + ", ".join(clash))
    payload = {"source": {"language": language, "segments": segments,
                          "origin": f"imported:{fmt}", "file": source.name}, "en": []}
    outputs[0].write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    transcript = {"source": f"imported:{fmt}", "language": language, "segments": segments, "en": []}
    outputs[1].write_text("/* imported from " + source.name + " (" + fmt + "); word times are the ASR's own */\n"
                          "window.EV_ASR = " + json.dumps(transcript, ensure_ascii=False) + ";\n", encoding="utf-8")
    write_srt(outputs[2], segments)
    print(f"imported {fmt} transcript: {len(segments)} segments, language {language} -> {base}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
