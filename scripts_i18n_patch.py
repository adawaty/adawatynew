import json, re

ROOT = "/home/user/workspace/website/adawaty-official-site"
TS_PATH = f"{ROOT}/src/contexts/I18nContext.tsx"
J_PATH = f"{ROOT}/.i18n_auto_translations.json"

with open(TS_PATH, "r", encoding="utf-8") as f:
    ts = f.read()

with open(J_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)


def ts_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def build_block(lang: str, d: dict) -> str:
    # Keep stable order for diffs
    keys = sorted(d.keys())
    key = f"\"{lang}\"" if "-" in lang else lang
    lines = [f"  {key}: {{"]
    for k in keys:
        v = d[k]
        lines.append(f"    \"{ts_escape(k)}\": \"{ts_escape(v)}\",")
    lines.append("  },")
    return "\n".join(lines)


def replace_lang_block(ts: str, lang: str, new_block: str) -> str:
    # Find '  fr: {' and replace until matching '  },' at same indent level.
    m = re.search(rf"^\s{{2}}(?:\"{re.escape(lang)}\"|{re.escape(lang)}):\s*\{{\s*$", ts, re.MULTILINE)
    if not m:
        raise RuntimeError(f"lang start not found: {lang}")
    start = m.start()

    # Find end: next line that starts with two spaces then '},'
    # but must correspond to this block; use brace depth.
    i = m.end()
    depth = 0
    while i < len(ts):
        if ts[i] == '{':
            depth += 1
        elif ts[i] == '}':
            depth -= 1
            if depth < 0:
                # shouldn't happen
                break
        i += 1
    # naive brace matching from the first '{'
    # better: scan from m.end()-1 where '{' is
    i = m.end() - 1
    depth = 0
    while i < len(ts):
        ch = ts[i]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                # consume following comma if present
                j = i + 1
                while j < len(ts) and ts[j] in " \t":
                    j += 1
                if j < len(ts) and ts[j] == ',':
                    j += 1
                # consume trailing whitespace/newline
                while j < len(ts) and ts[j] in " \t\r":
                    j += 1
                if j < len(ts) and ts[j] == "\n":
                    j += 1
                end = j
                return ts[:start] + new_block + "\n" + ts[end:]
        i += 1

    raise RuntimeError(f"lang end not found: {lang}")


for lang in ["fr", "es", "de", "it", "ja", "ar-EG"]:
    new_block = build_block(lang, data[lang])
    ts = replace_lang_block(ts, lang, new_block)

with open(TS_PATH, "w", encoding="utf-8") as f:
    f.write(ts)

print("Updated", TS_PATH)
