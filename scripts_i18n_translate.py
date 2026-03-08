import os, re, json, time
from typing import Dict, List, Tuple

from openai import OpenAI

ROOT = "/home/user/workspace/website/adawaty-official-site"
PATH = f"{ROOT}/src/contexts/I18nContext.tsx"

LANGS = ["fr", "es", "de", "it", "ja", "ar-EG"]  # fill missing keys too

PAIR_RE = re.compile(r'"(?P<k>[^"]+)"\s*:\s*"(?P<v>(?:\\.|[^"\\])*)"', re.MULTILINE)


def extract_dict(ts: str, lang: str) -> Dict[str, str]:
    m = re.search(rf"(?:\"{re.escape(lang)}\"|\b{re.escape(lang)}\b)\s*:\s*\{{", ts)
    if not m:
        raise RuntimeError(f"lang block not found: {lang}")
    start = m.end()
    # naive brace matching from start
    depth = 1
    i = start
    while i < len(ts) and depth > 0:
        ch = ts[i]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
        i += 1
    block = ts[start:i-1]
    d = {}
    for km in PAIR_RE.finditer(block):
        k = km.group('k')
        v = km.group('v').encode('utf-8').decode('unicode_escape')
        d[k] = v
    return d


def translate_batch(client: OpenAI, lang: str, pairs: List[Tuple[str, str]]) -> Dict[str, str]:
    # pairs: (key, english)
    prompt = (
        "You are a professional localizer for a premium digital agency website. "
        "Translate the given English UI strings into the target language while preserving meaning, tone (cyber-corporate premium), "
        "and placeholders. Do NOT translate keys. Return ONLY valid JSON mapping keys to translated strings."
    )
    data = {k: v for k, v in pairs}
    resp = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": f"Target language: {lang}\n\nJSON:\n" + json.dumps(data, ensure_ascii=False)},
        ],
        temperature=0.2,
    )
    txt = resp.choices[0].message.content.strip()
    # strip code fences if any
    if txt.startswith("```"):
        txt = re.sub(r"^```[a-zA-Z0-9]*\n", "", txt)
        txt = txt.replace("```", "").strip()
    return json.loads(txt)


def main():
    ts = open(PATH, "r", encoding="utf-8").read()
    en = extract_dict(ts, "en")

    client = OpenAI()

    out = {}
    for lang in LANGS:
        existing = extract_dict(ts, lang)
        missing = [(k, en[k]) for k in en.keys() if k not in existing]
        print(lang, "existing", len(existing), "missing", len(missing))
        translated = dict(existing)

        # translate in chunks
        chunk = 30
        for i in range(0, len(missing), chunk):
            part = missing[i:i+chunk]
            tr = translate_batch(client, lang, part)
            translated.update(tr)
            time.sleep(0.2)

        out[lang] = translated

    # write json output for manual patching
    out_path = f"{ROOT}/.i18n_auto_translations.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print("Wrote", out_path)


if __name__ == "__main__":
    main()
