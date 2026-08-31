# -*- coding: utf-8 -*-
"""합본 랜딩 /full 빌드 — style.html(얼굴형) 뼈대 + index.html(상세형) 설득섹션 4블록.

실행:  python build-full.py      (이 저장소 루트에서)
산출:  full.html · full-theme.css   → 라이브 https://impact-me.real-me.co.kr/full

설계 (2026-08-28 합의 · 2026-08-31 구현)
  얼굴형 히어로 + [공감·왜그때뿐·왜리얼미] + 얼굴형 후반부 + [가격·FAQ] + 얼굴형 신청
  상세형 12섹션을 통째로 넣지 않는다 — 8월 실측이 "정보 많은 쪽이 예약은 적다"였다
  (7/15~8/30 누적 예약 얼굴형 24건 vs 상세형 17건).

테마: 아이보리(화이트 아이보리) 배경 + 레드 액센트.
  베이스 CSS 는 style-ink.css — style.css 의 클래스를 모두 포함하는 상위집합이라
  얼굴형·상세형 섹션이 한 파일로 다 커버된다. 그 위에 full-theme.css 로 색만 덮는다.

⚠️ 반드시 이 저장소(라이브 소스)에서 빌드할 것.
   `리얼미 랜딩\\discount50\\_업로드용` 폴더는 구버전 사본이라 UTM 매크로 미치환 처리
   스크립트·리타겟 처리·이미지 일부가 빠져 있다 (2026-08-31 확인).
"""
import io, os, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))

def read(name):
    """CRLF 를 LF 로 정규화해 읽는다(처리 편의). 쓸 때 다시 CRLF 로 되돌린다."""
    with io.open(os.path.join(ROOT, name), encoding="utf-8", newline="") as f:
        return f.read().replace("\r\n", "\n").split("\n")

def write(name, text):
    with io.open(os.path.join(ROOT, name), "w", encoding="utf-8", newline="") as f:
        f.write(text.replace("\r\n", "\n").replace("\n", "\r\n"))

face, disc = read("style.html"), read("index.html")

def grab(lines, secname):
    start = next((i for i, l in enumerate(lines) if f'data-sec="{secname}"' in l), None)
    if start is None:
        sys.exit(f"[!!] 섹션 못 찾음: {secname}")
    indent = len(lines[start]) - len(lines[start].lstrip())
    for j in range(start + 1, len(lines)):
        s = lines[j]
        if s.strip().startswith("</section>") and (len(s) - len(s.lstrip())) == indent:
            return lines[start:j + 1], start, j
    sys.exit(f"[!!] </section> 못 찾음: {secname}")

def rename(block, new):
    out = list(block)
    out[0] = re.sub(r'data-sec="[^"]*"', f'data-sec="{new}"', out[0])
    return out

ORDER = [
    ("face", "face_s01_hero",         "full_s01_hero",         "얼굴형 히어로 + 오퍼 + BA 슬라이더"),
    ("disc", "disc_s02_pain",         "full_s02_pain",         "상세형 · 공감"),
    ("disc", "disc_s03_whyfail",      "full_s03_whyfail",      "상세형 · 왜 그때뿐인가"),
    ("disc", "disc_s05_whyus",        "full_s04_whyus",        "상세형 · 왜 리얼미인가"),
    ("face", "face_s02_review_kakao", "full_s05_review_kakao", "얼굴형 · 카톡 후기"),
    ("face", "face_s03_lookbook",     "full_s06_lookbook",     "얼굴형 · 룩북"),
    ("face", "face_s04_review_text",  "full_s07_review_text",  "얼굴형 · 텍스트 후기"),
    ("face", "face_s05_benefits",     "full_s08_benefits",     "얼굴형 · 혜택"),
    ("face", "face_s06_process",      "full_s09_process",      "얼굴형 · 진행 과정"),
    ("disc", "disc_s10_plans",        "full_s10_plans",        "상세형 · 가격/플랜"),
    ("disc", "disc_s11_faq",          "full_s11_faq",          "상세형 · FAQ"),
    ("face", "face_s07_apply",        "full_s12_apply",        "얼굴형 · 신청 CTA"),
]

body = []
print("=" * 74)
print("섹션 조립")
print("=" * 74)
for src, old, new, desc in ORDER:
    lines = face if src == "face" else disc
    blk, a, b = grab(lines, old)
    body.append(f"\n  <!-- ===== {new} · {desc} "
                f"({'style.html' if src == 'face' else 'index.html'} {a+1}-{b+1}) ===== -->")
    body.extend(rename(blk, new))
    print(f"   {new:<22} <- {src:<5} {old:<22} {b-a+1:>4}줄")

hero_start = next(i for i, l in enumerate(face) if 'data-sec="face_s01_hero"' in l)
head = list(face[:hero_start])          # head 에 UTM 매크로 미치환 처리 스크립트가 들어있다 — 보존
_, _, apply_end = grab(face, "face_s07_apply")
tail = "\n".join(face[apply_end + 1:])  # </main> + 스티키 + main.js

# CSS 교체: style.css(얼굴형 다크) → style-ink.css(라이트 베이스) + full-theme.css(아이보리+레드)
for i, l in enumerate(head):
    if re.search(r'href="style\.css', l):
        head[i] = ('<link rel="stylesheet" href="style-ink.css?v=20260724blue" />\n'
                   '<link rel="stylesheet" href="full-theme.css?v=20260831b" />')
        break
else:
    sys.exit("[!!] style.css 링크를 못 찾음")

full = "\n".join(head) + "\n" + "\n".join(body) + "\n" + tail
write("full.html", full)
print(f"\n[생성] full.html  ({len(full.split(chr(10)))}줄)")

THEME = """/* full-theme.css — 합본 랜딩 /full 전용 테마 (2026-08-31)
   베이스는 style-ink.css(라이트). 여기서 색만 '화이트 아이보리 배경 + 레드 액센트'로 덮는다.
   style-ink.css 의 변수명을 그대로 재정의하므로, 반드시 style-ink.css *뒤에* 로드할 것. */

:root{
  /* 배경 — 화이트 아이보리 (거의 화이트에 온기만 남긴 값)
     카드(#FFF)와 대비가 얕아지므로 보더로 경계를 잡는다. */
  --navy:#FDFCF9;                    /* 기본 배경 */
  --navy-deep:#F7F5F0;               /* 한 톤 진한 섹션 */
  --navy-card:#FFFFFF;               /* 카드 */

  /* 액센트·CTA — 레드 (얼굴형 style.css 의 레드를 승계) */
  --lime:#e23b3b;                    /* 강조·체크·아이콘 */
  --lime-soft:#eba0a0;               /* 강조 보조 */
  --red:#e23b3b;                     /* CTA */
  --red-deep:#c42b2b;                /* CTA hover */

  /* 텍스트 — 아이보리에 맞춘 웜 차콜 */
  --white:#2E2A26;                   /* 본문·타이틀 */
  --muted:#7A7268;                   /* 설명·caption */

  /* style-ink.css 헬퍼 변수의 대응값 */
  --line:#EAE5DB;
  --line-soft:rgba(46,42,38,.04);
  --shadow:rgba(46,42,38,.08);
  --ink-mid:#7A7268;
  --terra-soft:rgba(226,59,59,.10);
  --terra-line:rgba(226,59,59,.30);
  --terra-bright:#e23b3b;
}

/* 히어로는 얼굴형 원본이 화이트 텍스트를 전제로 쓰던 곳이 있어, 밝은 배경에서 글자가
   사라지지 않도록 본문색을 명시한다. */
.hero, .hero .hero-sub, .hero .hero-title{ color:var(--white); }
.hero .nav-row{ color:var(--muted); }

/* 브랜드 로고가 화이트 PNG 라 밝은 배경에서 안 보인다 → 반전 */
.hero .brand-logo{ filter:invert(1) brightness(.25); }

/* 오퍼 카드 */
.offer{ background:var(--navy-card); border-color:var(--terra-line); box-shadow:0 6px 24px var(--shadow); }
.offer-kicker{ background:var(--red); color:#fff; }

/* 고정 푸터 CTA · 실시간 배지 */
.sticky-cta{ background:rgba(253,252,249,.95); border-top:1px solid var(--line); }
.sticky-cta__text{ color:var(--white); }
.live-viewers{ background:var(--navy-card); color:var(--white);
               border:1px solid var(--line); box-shadow:0 4px 14px var(--shadow); }
"""
write("full-theme.css", THEME)
print(f"[생성] full-theme.css  ({len(THEME.split(chr(10)))}줄)")

# ── 검증 ──────────────────────────────────────────────────
print("\n" + "=" * 74)
print("검증")
print("=" * 74)
secs = re.findall(r'data-sec="([^"]+)"', full)
marks = re.findall(r'data-mark="([^"]+)"', full)
dup = [s for s in set(secs) if secs.count(s) > 1] or "없음"
dupm = [m for m in set(marks) if marks.count(m) > 1] or "없음"
print(f"   섹션 {len(secs)}개 · 중복 {dup} · 미변경 {[s for s in secs if not s.startswith('full_')] or '없음'}")
print(f"   히어로 마크 {marks} · 중복 {dupm}")
print(f"   UTM 매크로 스크립트 보존: {'OK' if 'UTM 매크로 미치환' in full else '!! 사라짐'}")
print(f"   CSS: style-ink {'OK' if 'style-ink.css' in full else '!!'} · "
      f"full-theme {'OK' if 'full-theme.css' in full else '!!'} · "
      f"style.css(다크) 잔존 {'!! 있음' if re.search(r'href=.style\.css', full) else '없음 OK'}")
print(f"   main.js {'OK' if 'main.js' in full else '!!'} · js-typeform CTA {full.count('js-typeform')}개")
print(f"   인라인 트래커 잔존: {'!! 있음' if 'querySelectorAll(\"[data-sec]\")' in full else '없음 OK'}")
