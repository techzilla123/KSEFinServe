"""
Make the mobile Insights/Events pages interactive, matching desktop:
working topic filters, clickable article links, button hover effects,
a real email input.

Strategy: operate on exact, unambiguous line patterns only. The Article link
blocks are self-contained divs whose closing tag sits on its own line, so we
convert the opening tag and that specific closing line together.
"""
import re

BASE = r"C:/Users/PC/Documents/techzilla-test/learn/src"

INSIGHTS = f"{BASE}/InsightsMobilePage.tsx"
EVENTS = f"{BASE}/EventsMobilePage.tsx"


def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


def write(p, c):
    with open(p, "w", encoding="utf-8") as f:
        f.write(c)


# ============================================================ INSIGHTS
c = read(INSIGHTS)

if not c.startswith('import { useState }'):
    c = 'import { useState } from "react";\n' + c

anchor = "export default function KseInsightMobile({ onShowEvents }: InsightsPageProps) {\n  return ("
assert anchor in c, "insights component signature not found"
c = c.replace(
    anchor,
    'export default function KseInsightMobile({ onShowEvents }: InsightsPageProps) {\n'
    '  // Topic filter: "all" or a category name. Cards carry data-category and\n'
    '  // the collection carries data-active-filter; CSS hides the non-matches.\n'
    '  const [activeFilter, setActiveFilter] = useState("all");\n'
    '  const topics: Array<{ key: string; label: string }> = [\n'
    '    { key: "all", label: "All insights" },\n'
    '    { key: "WEALTH FOUNDATIONS", label: "Wealth foundations" },\n'
    '    { key: "INVESTING", label: "Investing" },\n'
    '    { key: "RETIREMENT", label: "Retirement" },\n'
    '    { key: "PROTECTION", label: "Protection" },\n'
    '    { key: "LIFE & LEGACY", label: "Life & legacy" },\n'
    '  ];\n\n'
    '  return (',
    1,
)

start = c.find('data-node-id="1:588" data-name="Topic filters"')
assert start != -1, "topic filters not found"
block_start = c.rfind("<div", 0, start)
block_end = c.find("\n        </div>", start)
assert block_end != -1, "topic filters closing tag not found"
block_end += len("\n        </div>")

new_filters = '''<div className="content-start flex flex-wrap gap-[8px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:588" data-name="Topic filters">
          {topics.map((topic) => {
            const active = topic.key === activeFilter;
            return (
              <button
                key={topic.key}
                type="button"
                onClick={() => setActiveFilter(topic.key)}
                aria-pressed={active}
                className={
                  active
                    ? "bg-[#081d2b] content-stretch flex h-[44px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 cursor-pointer topic-pill"
                    : "bg-[#fffdfa] border border-[#c9d1d4] border-solid content-stretch flex h-[44px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 cursor-pointer topic-pill"
                }
                data-name={active ? "Active topic" : "Topic filter"}
              >
                <p
                  className={
                    active
                      ? "[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#fffdfa] text-[13px] whitespace-nowrap"
                      : "[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap"
                  }
                >
                  {topic.label}
                </p>
              </button>
            );
          })}
        </div>'''
c = c[:block_start] + new_filters + c[block_end:]

CATS = ("INVESTING", "WEALTH FOUNDATIONS", "RETIREMENT", "PROTECTION",
        "LIFE & LEGACY", "GUIDANCE", "CONNECTION", "WHAT COMES NEXT")


def tag_cards(text):
    out = []
    idx = 0
    while True:
        i = text.find('data-name="Article card"', idx)
        if i == -1:
            out.append(text[idx:])
            break
        seg_end = text.find('data-name="Article card"', i + 10)
        seg = text[i:seg_end if seg_end != -1 else len(text)]
        cat = None
        for cand in CATS:
            if re.search(r">\s*" + re.escape(cand) + r"\s*<", seg):
                cat = cand
                break
        out.append(text[idx:i])
        out.append(f'data-name="Article card" data-category="{cat}"' if cat
                   else 'data-name="Article card"')
        idx = i + len('data-name="Article card"')
    return "".join(out)


c = tag_cards(c)

c = c.replace(
    'data-node-id="1:595" data-name="Article collection"',
    'data-node-id="1:595" data-name="Article collection" data-active-filter={activeFilter}',
    1,
)

c = c.replace(
    """<p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[20px] relative shrink-0 text-[#56646c] text-[14px] whitespace-nowrap" data-node-id="1:745" style={{ fontVariationSettings: '"wdth" 100' }}>
              you@example.com
            </p>""",
    """<input
              type="email"
              placeholder="you@example.com"
              aria-label="Your email address"
              className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[20px] relative shrink-0 text-[#56646c] text-[14px] bg-transparent border-0 outline-0 w-full min-w-0"
              style={{ fontVariationSettings: '"wdth" 100' }}
            />""",
)

c = re.sub(
    r'<div className="content-stretch flex gap-\[12px\] items-center overflow-clip relative shrink-0 text-\[#081d2b\] whitespace-nowrap" (data-node-id="[^"]+" data-name="Article link")>',
    r'<button type="button" className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap article-link" \1>',
    c,
)
c = c.replace(
    """                  ↗
                </p>
              </div>
            </div>""",
    """                  ↗
                </p>
              </button>
            </div>""",
)

c = re.sub(
    r'<div className="bg-\[#081d2b\] content-stretch flex h-\[52px\] items-center justify-center pb-\[13\.5px\] pt-\[12\.5px\] px-\[16px\] relative rounded-\[100px\] shrink-0 w-full" (data-node-id="[^"]+" data-name="Page action")>',
    r'<button type="button" className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 w-full page-action" \1>',
    c,
)
c = c.replace(
    """                <p className="leading-[20px]">Read the featured article</p>
              </div>
            </div>""",
    """                <p className="leading-[20px]">Read the featured article</p>
              </div>
            </button>""",
)
c = c.replace(
    """              <p className="leading-[20px]">Subscribe to Insight</p>
            </div>
          </div>""",
    """              <p className="leading-[20px]">Subscribe to Insight</p>
            </div>
          </button>""",
)
c = c.replace(
    """            <p className="leading-[20px]">Book a Session</p>
          </div>
        </div>""",
    """            <p className="leading-[20px]">Book a Session</p>
          </div>
        </button>""",
)

write(INSIGHTS, c)
print("insights written")


# ============================================================== EVENTS
e = read(EVENTS)

if not e.startswith('import { useState }'):
    e = 'import { useState } from "react";\n' + e

e = re.sub(
    r'<div className="(bg-\[#6e8add\]|bg-\[#ee647b\]) content-stretch flex flex-\[1_0_0\] h-\[48px\] items-center justify-center min-w-px pb-\[13\.5px\] pt-\[12\.5px\] px-\[16px\] relative rounded-\[24px\]" (data-node-id="[^"]+" data-name="Hero action")>',
    r'<button type="button" className="\1 content-stretch flex flex-[1_0_0] h-[48px] items-center justify-center min-w-px pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[24px] hero-action" \2>',
    e,
)
e = e.replace(
    """              <p className="leading-[20px]">View Details</p>
            </div>
          </div>""",
    """              <p className="leading-[20px]">View Details</p>
            </div>
          </button>""",
)
e = e.replace(
    """              <p className="leading-[20px]">See Schedule</p>
            </div>
          </div>""",
    """              <p className="leading-[20px]">See Schedule</p>
            </div>
          </button>""",
)

e = re.sub(
    r'<div className="bg-\[#081d2b\] content-stretch flex h-\[52px\] items-center justify-center pb-\[13\.5px\] pt-\[12\.5px\] px-\[16px\] relative rounded-\[100px\] shrink-0 w-full" (data-node-id="[^"]+" data-name="Page action")>',
    r'<button type="button" className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 w-full page-action" \1>',
    e,
)
e = re.sub(
    r'(<button type="button" className="bg-\[#081d2b\][^>]*data-name="Page action">.*?<p className="leading-\[20px\]">[^<]*</p>\s*</div>\s*)</div>',
    r"\1</button>",
    e,
    flags=re.S,
)

e = re.sub(
    r'<p className="\[word-break:break-word\] font-\[\'Mona_Sans:Regular\'\] font-normal leading-\[20px\] relative shrink-0 text-\[#56646c\] text-\[14px\] whitespace-nowrap" data-node-id="[^"]+" style=\{\{ fontVariationSettings: \'"wdth" 100\' \}\}>\s*you@example\.com\s*</p>',
    """<input
              type="email"
              placeholder="you@example.com"
              aria-label="Your email address"
              className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[20px] relative shrink-0 text-[#56646c] text-[14px] bg-transparent border-0 outline-0 w-full min-w-0"
              style={{ fontVariationSettings: '"wdth" 100' }}
            />""",
    e,
)

write(EVENTS, e)
print("events written")
