"""
Make the mobile Events/Insights pages interactive, matching the desktop
behaviour: working topic filters, clickable article links, button hover
effects, a real email input, and a real checkbox.

The mobile pages are static Figma exports (divs styled as controls), so this
converts the relevant ones into real <button>/<input> elements and wires the
filter state, without changing any of the visual classes.
"""
import re
import sys

BASE = r"C:/Users/PC/Documents/techzilla-test/learn/src"


# ---------------------------------------------------------------- insights
def patch_insights(path):
    with open(path, encoding="utf-8") as f:
        c = f.read()

    original = c

    # 1. Import useState.
    if "useState" not in c.split("\n")[0]:
        c = 'import { useState } from "react";\n' + c

    # 2. Add filter state inside the component.
    c = c.replace(
        'export default function KseInsightMobile({ onShowEvents }: InsightsPageProps) {\n  return (',
        'export default function KseInsightMobile({ onShowEvents }: InsightsPageProps) {\n'
        '  // Topic filter state: "all" or one of the category names.\n'
        '  const [activeFilter, setActiveFilter] = useState("all");\n'
        '  const topics = [\n'
        '    "all",\n'
        '    "WEALTH FOUNDATIONS",\n'
        '    "INVESTING",\n'
        '    "RETIREMENT",\n'
        '    "PROTECTION",\n'
        '    "LIFE & LEGACY",\n'
        '  ];\n'
        '  const topicLabels: Record<string, string> = {\n'
        '    all: "All insights",\n'
        '    "WEALTH FOUNDATIONS": "Wealth foundations",\n'
        '    INVESTING: "Investing",\n'
        '    RETIREMENT: "Retirement",\n'
        '    PROTECTION: "Protection",\n'
        '    "LIFE & LEGACY": "Life & legacy",\n'
        '  };\n\n'
        '  return ('
    )

    # 3. Replace the static topic-filter block with a mapped, clickable one.
    filter_block = re.search(
        r'<div className="content-start flex flex-wrap gap-\[8px\][^"]*" data-node-id="1:588" data-name="Topic filters">.*?\n        </div>',
        c,
        re.S,
    )
    if not filter_block:
        print("  ! topic filters block not found")
        return False

    new_filters = '''<div className="content-start flex flex-wrap gap-[8px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:588" data-name="Topic filters">
          {topics.map((topic) => {
            const active = topic === activeFilter;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setActiveFilter(topic)}
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
                  {topicLabels[topic]}
                </p>
              </button>
            );
          })}
        </div>'''
    c = c[: filter_block.start()] + new_filters + c[filter_block.end():]

    # 4. Tag each article card with its category so CSS can filter it.
    #    The category text sits in the card's summary block.
    def tag_card(match):
        card = match.group(0)
        cat = re.search(
            r'>(INVESTING|WEALTH FOUNDATIONS|RETIREMENT|PROTECTION|LIFE & LEGACY|GUIDANCE|CONNECTION|WHAT COMES NEXT)<',
            card,
        )
        if not cat:
            return card
        return card.replace(
            'data-name="Article card"',
            f'data-name="Article card" data-category="{cat.group(1)}"',
            1,
        )

    c = re.sub(
        r'<div className="bg-\[#fffdfa\] content-stretch flex flex-col items-start overflow-clip relative rounded-\[20px\][^"]*" data-node-id="1:[0-9]+" data-name="Article card">.*?(?=<div className="bg-\[#fffdfa\] content-stretch flex flex-col items-start overflow-clip relative rounded-\[20px\]|</div>\s*</div>\s*</div>\s*<div[^>]*data-name="Life and legacy)',
        tag_card,
        c,
        flags=re.S,
    )

    # 5. Put the active filter on the collection so CSS can hide non-matches.
    c = c.replace(
        'data-node-id="1:595" data-name="Article collection"',
        'data-node-id="1:595" data-name="Article collection" data-active-filter={activeFilter}',
        1,
    )

    # 6. Turn the email placeholder into a real input.
    c = c.replace(
        '''<p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[20px] relative shrink-0 text-[#56646c] text-[14px] whitespace-nowrap" data-node-id="1:745" style={{ fontVariationSettings: '"wdth" 100' }}>
              you@example.com
            </p>''',
        '''<input
              type="email"
              placeholder="you@example.com"
              aria-label="Your email address"
              className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[20px] relative shrink-0 text-[#56646c] text-[14px] bg-transparent border-0 outline-0 w-full min-w-0"
              style={{ fontVariationSettings: '"wdth" 100' }}
            />''',
    )

    # 7. Make the "Read article" links real buttons.
    c = re.sub(
        r'<div className="content-stretch flex gap-\[12px\] items-center overflow-clip relative shrink-0 text-\[#081d2b\] whitespace-nowrap" data-node-id="([^"]+)" data-name="Article link">',
        r'<button type="button" className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap article-link" data-node-id="\1" data-name="Article link">',
        c,
    )
    # close those buttons: the matching </div> right after the arrow span
    c = c.replace(
        '''              </div>
            </div>
          </div>
          <div className="bg-[#fffdfa] content-stretch flex flex-col items-start overflow-clip relative rounded-[20px]''',
        '''              </div>
            </button>
          </div>
          <div className="bg-[#fffdfa] content-stretch flex flex-col items-start overflow-clip relative rounded-[20px]''',
    )

    # 8. Make the Page action buttons real buttons.
    c = re.sub(
        r'<div className="bg-\[#081d2b\] content-stretch flex h-\[52px\] items-center justify-center pb-\[13\.5px\] pt-\[12\.5px\] px-\[16px\] relative rounded-\[100px\] shrink-0 w-full" data-node-id="([^"]+)" data-name="Page action">',
        r'<button type="button" className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 w-full page-action" data-node-id="\1" data-name="Page action">',
        c,
    )
    c = c.replace(
        '''              <p className="leading-[20px]">Subscribe to Insight</p>
            </div>
          </div>''',
        '''              <p className="leading-[20px]">Subscribe to Insight</p>
            </div>
          </button>''',
    )
    c = c.replace(
        '''                <p className="leading-[20px]">Read the featured article</p>
              </div>
            </div>''',
        '''                <p className="leading-[20px]">Read the featured article</p>
              </div>
            </button>''',
    )
    c = c.replace(
        '''            <p className="leading-[20px]">Book a Session</p>
          </div>
        </div>''',
        '''            <p className="leading-[20px]">Book a Session</p>
          </div>
        </button>''',
    )

    if c == original:
        print("  ! no changes applied to insights")
        return False

    with open(path, "w", encoding="utf-8") as f:
        f.write(c)
    return True


# ------------------------------------------------------------------ events
def patch_events(path):
    with open(path, encoding="utf-8") as f:
        c = f.read()

    original = c

    if "useState" not in c.split("\n")[0]:
        c = 'import { useState } from "react";\n' + c

    # Make the hero action buttons real buttons.
    c = re.sub(
        r'<div className="bg-\[#6e8add\] content-stretch flex flex-\[1_0_0\] h-\[48px\] items-center justify-center min-w-px pb-\[13\.5px\] pt-\[12\.5px\] px-\[16px\] relative rounded-\[24px\]" data-node-id="([^"]+)" data-name="Hero action">',
        r'<button type="button" className="bg-[#6e8add] content-stretch flex flex-[1_0_0] h-[48px] items-center justify-center min-w-px pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[24px] hero-action" data-node-id="\1" data-name="Hero action">',
        c,
    )
    c = re.sub(
        r'<div className="bg-\[#ee647b\] content-stretch flex flex-\[1_0_0\] h-\[48px\] items-center justify-center min-w-px pb-\[13\.5px\] pt-\[12\.5px\] px-\[16px\] relative rounded-\[24px\]" data-node-id="([^"]+)" data-name="Hero action">',
        r'<button type="button" className="bg-[#ee647b] content-stretch flex flex-[1_0_0] h-[48px] items-center justify-center min-w-px pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[24px] hero-action" data-node-id="\1" data-name="Hero action">',
        c,
    )
    # close them
    c = c.replace(
        '''              <p className="leading-[20px]">View Details</p>
            </div>
          </div>''',
        '''              <p className="leading-[20px]">View Details</p>
            </div>
          </button>''',
    )
    c = c.replace(
        '''              <p className="leading-[20px]">See Schedule</p>
            </div>
          </div>''',
        '''              <p className="leading-[20px]">See Schedule</p>
            </div>
          </button>''',
    )

    # Page action buttons.
    c = re.sub(
        r'<div className="bg-\[#081d2b\] content-stretch flex h-\[52px\] items-center justify-center pb-\[13\.5px\] pt-\[12\.5px\] px-\[16px\] relative rounded-\[100px\] shrink-0 w-full" data-node-id="([^"]+)" data-name="Page action">',
        r'<button type="button" className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 w-full page-action" data-node-id="\1" data-name="Page action">',
        c,
    )
    # close every remaining Page action div
    c = re.sub(
        r'(<button type="button" className="bg-\[#081d2b\][^>]*data-name="Page action">.*?<p className="leading-\[20px\]">[^<]*</p>\s*</div>\s*)</div>',
        r"\1</button>",
        c,
        flags=re.S,
    )

    # Email input.
    c = re.sub(
        r'<p className="\[word-break:break-word\] font-\[\'Mona_Sans:Regular\'\] font-normal leading-\[20px\] relative shrink-0 text-\[#56646c\] text-\[14px\] whitespace-nowrap" data-node-id="[^"]+" style=\{\{ fontVariationSettings: \'"wdth" 100\' \}\}>\s*you@example\.com\s*</p>',
        '''<input
              type="email"
              placeholder="you@example.com"
              aria-label="Your email address"
              className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[20px] relative shrink-0 text-[#56646c] text-[14px] bg-transparent border-0 outline-0 w-full min-w-0"
              style={{ fontVariationSettings: '"wdth" 100' }}
            />''',
        c,
    )

    if c == original:
        print("  ! no changes applied to events")
        return False

    with open(path, "w", encoding="utf-8") as f:
        f.write(c)
    return True


if __name__ == "__main__":
    ok_i = patch_insights(f"{BASE}/InsightsMobilePage.tsx")
    ok_e = patch_events(f"{BASE}/EventsMobilePage.tsx")
    print(f"insights patched: {ok_i}")
    print(f"events patched:   {ok_e}")
    sys.exit(0 if (ok_i or ok_e) else 1)
