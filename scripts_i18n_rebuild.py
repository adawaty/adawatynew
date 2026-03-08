import ast
import json
import re
import time
from pathlib import Path

from openai import OpenAI

ROOT = Path("/home/user/workspace/website/adawaty-official-site")
TS_PATH = ROOT / "src/contexts/I18nContext.tsx"

LANGS = [
    ("ar-EG", "Arabic (Egyptian), natural Modern Standard with Egyptian tone"),
]

PAIR_RE = re.compile(r'"(?P<k>[^"]+)"\s*:\s*"(?P<v>(?:\\.|[^"\\])*)"\s*,?')


def extract_block(text: str, lang: str) -> tuple[int, int, str]:
    # matches:  en: {   OR  "ar-EG": {
    pat = rf"^\s{{2}}(?:\"{re.escape(lang)}\"|{re.escape(lang)}):\s*\{{\s*$"
    m = re.search(pat, text, re.MULTILINE)
    if not m:
        raise RuntimeError(f"lang start not found: {lang}")
    start = m.start()

    i = m.end() - 1  # points to '{'
    depth = 0
    while i < len(text):
        ch = text[i]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                j = i + 1
                # consume trailing comma
                while j < len(text) and text[j] in " \t":
                    j += 1
                if j < len(text) and text[j] == ',':
                    j += 1
                # consume newline
                if j < len(text) and text[j] == "\n":
                    j += 1
                end = j
                return start, end, text[m.end(): i]
        i += 1
    raise RuntimeError(f"lang end not found: {lang}")


def unescape_ts_string(s: str) -> str:
    # Safely unescape a TS/JS double-quoted string fragment
    return ast.literal_eval('"' + s.replace('"', '\\"') + '"')


def parse_dict(block: str) -> dict[str, str]:
    d = {}
    for m in PAIR_RE.finditer(block):
        k = m.group('k')
        v_raw = m.group('v')
        d[k] = unescape_ts_string(v_raw)
    return d


def ts_escape(s: str) -> str:
    return s.replace('\\', '\\\\').replace('"', '\\"')


def build_block(lang: str, d: dict[str, str]) -> str:
    key = f'"{lang}"' if '-' in lang else lang
    lines = [f"  {key}: {{"]
    for k in sorted(d.keys()):
        v = d[k]
        lines.append(f"    \"{ts_escape(k)}\": \"{ts_escape(v)}\",")
    lines.append("  },")
    return "\n".join(lines)


def translate_all(client: OpenAI, target_lang: str, guidance: str, en: dict[str, str]) -> dict[str, str]:
    sys = (
        "You are a senior localization specialist. Translate UI strings from English into the target language. "
        "Keep meaning, keep short UI tone, and preserve brand name Adawaty / أدواتي as-is. "
        "Never output mojibake. Use proper UTF-8 characters. "
        "Do NOT translate keys. Return ONLY valid JSON mapping keys to translated strings."
    )

    # chunk to avoid token blowups
    items = list(en.items())
    out: dict[str, str] = {}
    chunk = 60
    for i in range(0, len(items), chunk):
        part = dict(items[i:i+chunk])
        user = {
            "target_language": target_lang,
            "style_guidance": guidance,
            "strings": part,
        }
        resp = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": sys},
                {"role": "user", "content": json.dumps(user, ensure_ascii=False)},
            ],
            temperature=0.15,
        )
        txt = resp.choices[0].message.content.strip()
        if txt.startswith("```"):
            txt = re.sub(r"^```[a-zA-Z0-9]*\n", "", txt)
            txt = txt.replace("```", "").strip()
        data = json.loads(txt)
        out.update(data)
        time.sleep(0.15)

    # sanity: fill any missing keys with english
    for k, v in en.items():
        out.setdefault(k, v)

    return out


def main():
    text = TS_PATH.read_text(encoding="utf-8")
    en_start, en_end, en_block = extract_block(text, "en")
    en = parse_dict(en_block)

    client = OpenAI()

    new_blocks = {}
    for lang, guidance in LANGS:
        translated = translate_all(client, lang, guidance, en)
        new_blocks[lang] = build_block(lang, translated)
        print(lang, "ok", len(translated))

    # Replace blocks in-place
    for lang, _ in LANGS:
        start, end, _ = extract_block(text, lang)
        text = text[:start] + new_blocks[lang] + "\n" + text[end:]

    TS_PATH.write_text(text, encoding="utf-8")
    print("Updated", TS_PATH)


if __name__ == "__main__":
    main()
