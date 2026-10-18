import { useState } from "react";
const assetPathPrefix = "/assets";
const imgCoralSculpture = `${assetPathPrefix}/ced68.png`;
const imgBlueSculpture = `${assetPathPrefix}/10be3.png`;
const imgStoryPhotograph = `${assetPathPrefix}/c9004.png`;
const imgStoryPhotograph1 = `${assetPathPrefix}/330b4.png`;
const imgStoryPhotograph2 = `${assetPathPrefix}/b8130.png`;
const imgStoryPhotograph3 = `${assetPathPrefix}/20453.png`;
const imgStoryPhotograph4 = `${assetPathPrefix}/5a155.png`;
const imgStoryPhotograph5 = `${assetPathPrefix}/45e36.png`;
const imgStoryPhotograph6 = `${assetPathPrefix}/72c82.png`;
const imgStoryPhotograph7 = `${assetPathPrefix}/80031.png`;
const imgStoryPhotograph8 = `${assetPathPrefix}/282e8.png`;
const imgStoryPhotograph9 = `${assetPathPrefix}/e875f.png`;
const imgStoryPhotograph10 = `${assetPathPrefix}/6241f.png`;
const imgStoryPhotograph11 = `${assetPathPrefix}/91b97.png`;
const imgStoryPhotograph12 = `${assetPathPrefix}/74a96.png`;
const imgConnectionLandmark = `${assetPathPrefix}/b5153.png`;
const imgEmail = `${assetPathPrefix}/f69e2.svg`;
const imgAtmosphericLight = `${assetPathPrefix}/46fb3.svg`;

type InsightsPageProps = {
  onShowEvents: () => void;
};

export default function KseInsightMobile({ onShowEvents }: InsightsPageProps) {
  // Topic filter: "all" or a category name. Cards carry data-category and
  // the collection carries data-active-filter; CSS hides the non-matches.
  const [activeFilter, setActiveFilter] = useState("all");
  const topics: Array<{ key: string; label: string }> = [
    { key: "all", label: "All insights" },
    { key: "WEALTH FOUNDATIONS", label: "Wealth foundations" },
    { key: "INVESTING", label: "Investing" },
    { key: "RETIREMENT", label: "Retirement" },
    { key: "PROTECTION", label: "Protection" },
    { key: "LIFE & LEGACY", label: "Life & legacy" },
  ];

  return (
    <div className="bg-[#f6f3ec] content-stretch flex flex-col items-start relative size-full" data-node-id="1:550" data-name="KSE Insight — Mobile">
      <div className="bg-[#f4f4f4] content-stretch flex flex-col gap-[24px] items-center overflow-clip pb-[40px] pt-[32px] px-[24px] relative shrink-0 w-full" data-node-id="1:551" data-name="Insight hero">
        <div className="absolute h-[265px] left-[-27px] top-0 w-[92px]" data-node-id="1:552" data-name="Coral sculpture">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-full left-[-28.63%] max-w-none top-0 w-[128.63%]" src={imgCoralSculpture} />
          </div>
        </div>
        <div className="absolute h-[265px] left-[325px] top-0 w-[92px]" data-node-id="1:553" data-name="Blue sculpture">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-full left-0 max-w-none top-0 w-[128.63%]" src={imgBlueSculpture} />
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0.6)] border border-[rgba(211,176,106,0.4)] border-solid content-stretch flex gap-[4px] items-start overflow-clip p-[5px] relative rounded-[999px] shrink-0" data-node-id="1:554" data-name="Event / Insight toggle">
          <button className="bg-[rgba(255,255,255,0)] border border-[#c9d1d4] border-solid content-stretch flex h-[44px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 w-[118px] cursor-pointer" data-node-id="1:555" data-name="Topic filter" onClick={onShowEvents} type="button">
            <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap" data-node-id="I1:555;33:293">
              Event
            </p>
          </button>
          <button aria-pressed="true" className="bg-[#c9a963] content-stretch flex h-[44px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 w-[118px]" data-node-id="1:556" data-name="Active topic" type="button">
            <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap" data-node-id="I1:556;33:286">
              Insight
            </p>
          </button>
        </div>
        <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-none min-w-full not-italic relative shrink-0 text-[#24182c] text-[58px] text-center tracking-[-2.32px] w-[min-content]" data-node-id="1:557">
          Insight
        </p>
        <p className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.35] not-italic relative shrink-0 text-[#081d2b] text-[20px] text-center w-[280px]" data-node-id="1:558">
          A little perspective. A clearer future.
        </p>
        <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] text-center w-[285px]" data-node-id="1:559" style={{ fontVariationSettings: '"wdth" 100' }}>
          Fresh thinking on wealth, work and the everyday choices that shape the life you want to build.
        </p>
        <div className="bg-[#402b1d] content-stretch flex flex-col gap-[14px] h-[380px] items-start overflow-clip p-[22px] relative rounded-[20px] shrink-0 w-full" data-node-id="1:560" data-name="Editorial collage">
          <div className="[word-break:break-word] absolute font-['Anton:Regular'] leading-[0] left-[180px] not-italic text-[42px] text-[rgba(174,122,65,0.38)] top-[10px] w-[155px]" data-node-id="1:561">
            <p className="leading-[1.08] mb-0">CLARITY</p>
            <p className="leading-[1.08] mb-0">GROWTH</p>
            <p className="leading-[1.08]">PURPOSE</p>
          </div>
          <p className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[normal] min-w-full not-italic relative shrink-0 text-[#e6ba65] text-[11px] w-[min-content]" data-node-id="1:562">
            THE KSE READING ROOM
          </p>
          <div className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#fffdfa] text-[40px] w-[min-content]" data-node-id="1:563">
            <p className="leading-[1.08] mb-0">GOOD IDEAS.</p>
            <p className="leading-[1.08]">REAL LIFE.</p>
          </div>
          <p className="[word-break:break-word] font-['Special_Elite:Regular'] font-normal leading-[normal] min-w-full relative shrink-0 text-[#e6ba65] text-[13px] w-[min-content]" data-node-id="1:564" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            Explore the stories below ↓
          </p>
          <div className="absolute flex h-[167.076px] items-center justify-center left-[28px] top-[200.81px] w-[150.533px]" data-node-id="1:565">
            <div className="-rotate-7 flex-none">
              <div className="bg-[#fffdfa] content-stretch flex items-start overflow-clip p-[6px] relative" data-name="Artisan print">
                <div className="h-[140px] relative shrink-0 w-[121px]" data-node-id="1:566" data-name="Story photograph">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgStoryPhotograph} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute flex h-[167.076px] items-center justify-center left-[172.81px] top-[205px] w-[150.533px]" data-node-id="1:567">
            <div className="flex-none rotate-7">
              <div className="bg-[#fffdfa] content-stretch flex items-start overflow-clip p-[6px] relative" data-name="Musician print">
                <div className="h-[140px] relative shrink-0 w-[121px]" data-node-id="1:568" data-name="Story photograph">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgStoryPhotograph1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.5] min-w-full not-italic relative shrink-0 text-[#081d2b] text-[11px] text-center w-[min-content]" data-node-id="1:569">
          WEALTH HAS A HUMAN SIDE. LET’S EXPLORE IT.
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[28px] items-start overflow-clip px-[24px] py-[56px] relative shrink-0 w-full" data-node-id="1:570" data-name="Featured article">
        <p className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.5] not-italic relative shrink-0 text-[#081d2b] text-[11px] w-full" data-node-id="1:571">
          THE BIG PICTURE / EDITOR’S PICK
        </p>
        <div className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[#081d2b] text-[36px] tracking-[-1.44px] w-full" data-node-id="1:572" style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[1.06] mb-0">Look closer.</p>
          <p className="leading-[1.06]">There’s more to your wealth.</p>
        </div>
        <p className="[word-break:break-word] font-['Lora:Italic'] font-normal italic leading-[1.3] relative shrink-0 text-[#56646c] text-[22px] w-full" data-node-id="1:573">
          Sometimes, the most valuable things are hiding in plain sight.
        </p>
        <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[20px] shrink-0 w-full" data-node-id="1:574" data-name="Feature spread">
          <div className="h-[275px] relative shrink-0 w-full" data-node-id="1:575" data-name="Story photograph">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgStoryPhotograph2} />
            </div>
          </div>
          <div className="bg-[#e6ba65] content-stretch flex items-start overflow-clip px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="1:576" data-name="Photo caption">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Special_Elite:Regular'] leading-[1.5] min-w-px not-italic relative text-[#081d2b] text-[11px]" data-node-id="1:577">
              A DIFFERENT LENS ON EVERYDAY WEALTH
            </p>
          </div>
          <div className="bg-[#dfeff8] content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[24px] relative shrink-0 w-full" data-node-id="1:578" data-name="Article introduction">
            <p className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.5] not-italic relative shrink-0 text-[#081d2b] text-[11px] w-full" data-node-id="1:579">
              WEALTH FOUNDATIONS / FEATURED ESSAY
            </p>
            <div className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[#081d2b] text-[40px] w-full" data-node-id="1:580">
              <p className="leading-[1.05] mb-0">WHERE ARE ALL</p>
              <p className="leading-[1.05]">YOUR ASSETS?</p>
            </div>
            <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:581" style={{ fontVariationSettings: '"wdth" 100' }}>
              A closer look at hidden wealth and the gaps in your current portfolio.
            </p>
            <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#081d2b] text-[16px] w-full" data-node-id="1:582" style={{ fontVariationSettings: '"wdth" 100' }}>
              Start with what you own, what you owe and what matters most. A clearer picture is the first step towards a more intentional plan.
            </p>
            <button type="button" className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 w-full page-action" data-node-id="1:583" data-name="Page action">
              <div className="[word-break:break-word] flex flex-col font-['Mona_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-center text-white whitespace-nowrap" data-node-id="I1:583;30:2199" style={{ fontVariationSettings: '"wdth" 100' }}>
                <p className="leading-[20px]">Read the featured article</p>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[28px] items-start overflow-clip pb-[56px] px-[24px] relative shrink-0 w-full" data-node-id="1:584" data-name="Browse insights">
        <p className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.5] not-italic relative shrink-0 text-[#081d2b] text-[11px] w-full" data-node-id="1:585">
          THE LIBRARY / FIND YOUR PERSPECTIVE
        </p>
        <p className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.06] relative shrink-0 text-[#081d2b] text-[36px] tracking-[-1.44px] w-full" data-node-id="1:586" style={{ fontVariationSettings: '"wdth" 100' }}>
          Curiosity looks good on you.
        </p>
        <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:587" style={{ fontVariationSettings: '"wdth" 100' }}>
          Browse ideas to help you think clearly, ask better questions and take your next step.
        </p>
        <div className="content-start flex flex-wrap gap-[8px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:588" data-name="Topic filters">
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
        </div>
        <div className="content-stretch flex flex-col gap-[24px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:595" data-name="Article collection" data-active-filter={activeFilter}>
          <div className="bg-[#fffdfa] content-stretch flex flex-col items-start overflow-clip relative rounded-[20px] shrink-0 w-full" data-node-id="1:596" data-name="Article card" data-category="INVESTING">
            <div className="bg-[#d4bcfa] content-stretch flex flex-col items-start overflow-clip p-[14px] relative shrink-0 w-full" data-node-id="1:597" data-name="Article artwork">
              <div className="h-[220px] relative rounded-[12px] shrink-0 w-full" data-node-id="1:598" data-name="Story photograph">
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                  <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgStoryPhotograph} />
                </div>
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative shrink-0 w-full" data-node-id="1:599" data-name="Article summary">
              <p className="font-['Special_Elite:Regular'] leading-[1.5] min-w-full not-italic relative shrink-0 text-[#081d2b] text-[11px] w-[min-content]" data-node-id="1:600">
                INVESTING
              </p>
              <p className="font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]" data-node-id="1:601">
                THE CRAFT OF WEALTH
              </p>
              <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]" data-node-id="1:602" style={{ fontVariationSettings: '"wdth" 100' }}>
                How artisanal investing can help you build a more resilient financial future.
              </p>
              <button type="button" className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap article-link" data-node-id="1:603" data-name="Article link">
                <p className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]" data-node-id="1:604" style={{ fontVariationSettings: '"wdth" 100' }}>
                  Read article
                </p>
                <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]" data-node-id="1:605">
                  ↗
                </p>
              </button>
            </div>
          </div>
          <div className="bg-[#fffdfa] content-stretch flex flex-col items-start overflow-clip relative rounded-[20px] shrink-0 w-full" data-node-id="1:606" data-name="Article card" data-category="INVESTING">
            <div className="bg-[#dfeff8] content-stretch flex flex-col items-start overflow-clip p-[14px] relative shrink-0 w-full" data-node-id="1:607" data-name="Article artwork">
              <div className="h-[220px] relative rounded-[12px] shrink-0 w-full" data-node-id="1:608" data-name="Story photograph">
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                  <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgStoryPhotograph1} />
                </div>
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative shrink-0 w-full" data-node-id="1:609" data-name="Article summary">
              <p className="font-['Special_Elite:Regular'] leading-[1.5] min-w-full not-italic relative shrink-0 text-[#081d2b] text-[11px] w-[min-content]" data-node-id="1:610">
                INVESTING
              </p>
              <p className="font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]" data-node-id="1:611">
                THE RHYTHM OF RETURNS
              </p>
              <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]" data-node-id="1:612" style={{ fontVariationSettings: '"wdth" 100' }}>
                Timing the market is hard, but timing your financial goals doesn’t have to be.
              </p>
              <button type="button" className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap article-link" data-node-id="1:613" data-name="Article link">
                <p className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]" data-node-id="1:614" style={{ fontVariationSettings: '"wdth" 100' }}>
                  Read article
                </p>
                <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]" data-node-id="1:615">
                  ↗
                </p>
              </button>
            </div>
          </div>
          <div className="bg-[#fffdfa] content-stretch flex flex-col items-start overflow-clip relative rounded-[20px] shrink-0 w-full" data-node-id="1:616" data-name="Article card" data-category="WEALTH FOUNDATIONS">
            <div className="bg-[#ffe6d3] content-stretch flex flex-col items-start overflow-clip p-[14px] relative shrink-0 w-full" data-node-id="1:617" data-name="Article artwork">
              <div className="h-[220px] relative rounded-[12px] shrink-0 w-full" data-node-id="1:618" data-name="Story photograph">
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                  <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgStoryPhotograph3} />
                </div>
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative shrink-0 w-full" data-node-id="1:619" data-name="Article summary">
              <p className="font-['Special_Elite:Regular'] leading-[1.5] min-w-full not-italic relative shrink-0 text-[#081d2b] text-[11px] w-[min-content]" data-node-id="1:620">
                WEALTH FOUNDATIONS
              </p>
              <p className="font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]" data-node-id="1:621">
                THE RECIPE FOR GROWTH
              </p>
              <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]" data-node-id="1:622" style={{ fontVariationSettings: '"wdth" 100' }}>
                Mixing the right ingredients to turn your savings into long-term wealth.
              </p>
              <button type="button" className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap article-link" data-node-id="1:623" data-name="Article link">
                <p className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]" data-node-id="1:624" style={{ fontVariationSettings: '"wdth" 100' }}>
                  Read article
                </p>
                <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]" data-node-id="1:625">
                  ↗
                </p>
              </button>
            </div>
          </div>
          <div className="bg-[#fffdfa] content-stretch flex flex-col items-start overflow-clip relative rounded-[20px] shrink-0 w-full" data-node-id="1:626" data-name="Article card" data-category="RETIREMENT">
            <div className="bg-[#dfeff8] content-stretch flex flex-col items-start overflow-clip p-[14px] relative shrink-0 w-full" data-node-id="1:627" data-name="Article artwork">
              <div className="h-[220px] relative rounded-[12px] shrink-0 w-full" data-node-id="1:628" data-name="Story photograph">
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                  <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgStoryPhotograph4} />
                </div>
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative shrink-0 w-full" data-node-id="1:629" data-name="Article summary">
              <p className="font-['Special_Elite:Regular'] leading-[1.5] min-w-full not-italic relative shrink-0 text-[#081d2b] text-[11px] w-[min-content]" data-node-id="1:630">
                RETIREMENT
              </p>
              <p className="font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]" data-node-id="1:631">
                THE WORKER’S EDGE
              </p>
              <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]" data-node-id="1:632" style={{ fontVariationSettings: '"wdth" 100' }}>
                Turning everyday income into a retirement plan that actually works.
              </p>
              <button type="button" className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap article-link" data-node-id="1:633" data-name="Article link">
                <p className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]" data-node-id="1:634" style={{ fontVariationSettings: '"wdth" 100' }}>
                  Read article
                </p>
                <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]" data-node-id="1:635">
                  ↗
                </p>
              </button>
            </div>
          </div>
          <div className="bg-[#fffdfa] content-stretch flex flex-col items-start overflow-clip relative rounded-[20px] shrink-0 w-full" data-node-id="1:636" data-name="Article card" data-category="PROTECTION">
            <div className="bg-[#ffe6d3] content-stretch flex flex-col items-start overflow-clip p-[14px] relative shrink-0 w-full" data-node-id="1:637" data-name="Article artwork">
              <div className="h-[220px] relative rounded-[12px] shrink-0 w-full" data-node-id="1:638" data-name="Story photograph">
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                  <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgStoryPhotograph5} />
                </div>
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative shrink-0 w-full" data-node-id="1:639" data-name="Article summary">
              <p className="font-['Special_Elite:Regular'] leading-[1.5] min-w-full not-italic relative shrink-0 text-[#081d2b] text-[11px] w-[min-content]" data-node-id="1:640">
                PROTECTION
              </p>
              <p className="font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]" data-node-id="1:641">
                THE TASTE OF SECURITY
              </p>
              <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]" data-node-id="1:642" style={{ fontVariationSettings: '"wdth" 100' }}>
                Finding peace of mind in a financial plan that’s built to last.
              </p>
              <button type="button" className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap article-link" data-node-id="1:643" data-name="Article link">
                <p className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]" data-node-id="1:644" style={{ fontVariationSettings: '"wdth" 100' }}>
                  Read article
                </p>
                <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]" data-node-id="1:645">
                  ↗
                </p>
              </button>
            </div>
          </div>
          <div className="bg-[#fffdfa] content-stretch flex flex-col items-start overflow-clip relative rounded-[20px] shrink-0 w-full" data-node-id="1:646" data-name="Article card" data-category="INVESTING">
            <div className="bg-[#d4bcfa] content-stretch flex flex-col items-start overflow-clip p-[14px] relative shrink-0 w-full" data-node-id="1:647" data-name="Article artwork">
              <div className="h-[220px] relative rounded-[12px] shrink-0 w-full" data-node-id="1:648" data-name="Story photograph">
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                  <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgStoryPhotograph6} />
                </div>
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative shrink-0 w-full" data-node-id="1:649" data-name="Article summary">
              <p className="font-['Special_Elite:Regular'] leading-[1.5] min-w-full not-italic relative shrink-0 text-[#081d2b] text-[11px] w-[min-content]" data-node-id="1:650">
                INVESTING
              </p>
              <p className="font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]" data-node-id="1:651">
                THE ART OF DIVERSITY
              </p>
              <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]" data-node-id="1:652" style={{ fontVariationSettings: '"wdth" 100' }}>
                Why spreading your assets across different classes can protect your future.
              </p>
              <button type="button" className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap article-link" data-node-id="1:653" data-name="Article link">
                <p className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]" data-node-id="1:654" style={{ fontVariationSettings: '"wdth" 100' }}>
                  Read article
                </p>
                <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]" data-node-id="1:655">
                  ↗
                </p>
              </button>
            </div>
          </div>
        </div>
        <div className="[word-break:break-word] border-[#c9d1d4] border-solid border-t content-stretch flex flex-col gap-[18px] items-start overflow-clip pt-[24px] relative shrink-0 text-[#081d2b] w-full" data-node-id="1:656" data-name="Library continuation">
          <p className="font-['Special_Elite:Regular'] leading-[1.5] min-w-full not-italic relative shrink-0 text-[11px] w-[min-content]" data-node-id="1:657">
            MORE PERSPECTIVES, FURTHER DOWN THE PAGE
          </p>
          <div className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 whitespace-nowrap" data-node-id="1:658" data-name="Article link">
            <p className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]" data-node-id="1:659" style={{ fontVariationSettings: '"wdth" 100' }}>{`Explore life & legacy`}</p>
            <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]" data-node-id="1:660">
              ↗
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#d4bcfa] content-stretch flex flex-col gap-[28px] items-start overflow-clip px-[24px] py-[56px] relative shrink-0 w-full" data-node-id="1:661" data-name="Life and legacy reading trail">
        <p className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.5] not-italic relative shrink-0 text-[#081d2b] text-[11px] w-full" data-node-id="1:662">{`LIFE & LEGACY / A READING TRAIL`}</p>
        <div className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[#081d2b] text-[36px] tracking-[-1.44px] w-full" data-node-id="1:663" style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[1.06] mb-0">Money is part of life.</p>
          <p className="leading-[1.06]">Not the other way around.</p>
        </div>
        <p className="[word-break:break-word] font-['Lora:Italic'] font-normal italic leading-[1.3] relative shrink-0 text-[#081d2b] text-[22px] w-full" data-node-id="1:664">
          For the plans you make around the kitchen table.
        </p>
        <div className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:665" data-name="Lead story">
          <div className="flex h-[241.796px] items-center justify-center relative shrink-0 w-full" data-node-id="1:666">
            <div className="-rotate-2 flex-none w-full">
              <div className="bg-[#fffdfa] content-stretch flex flex-col items-start overflow-clip p-[10px] relative w-full" data-name="Layered photo">
                <div className="h-[210px] relative shrink-0 w-full" data-node-id="1:667" data-name="Story photograph">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgStoryPhotograph7} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.5] min-w-full not-italic relative shrink-0 text-[#081d2b] text-[11px] w-[min-content]" data-node-id="1:668">
            BEGIN WITH A CONVERSATION
          </p>
          <p className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[32px] w-[min-content]" data-node-id="1:669">
            THE KITCHEN TABLE PLAN
          </p>
          <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#081d2b] text-[16px] w-[min-content]" data-node-id="1:670" style={{ fontVariationSettings: '"wdth" 100' }}>
            Turning everyday conversations into a clear path to financial freedom.
          </p>
          <div className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap" data-node-id="1:671" data-name="Article link">
            <p className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]" data-node-id="1:672" style={{ fontVariationSettings: '"wdth" 100' }}>
              Read article
            </p>
            <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]" data-node-id="1:673">
              ↗
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[24px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:674" data-name="Related reading">
          <div className="bg-[#fffdfa] content-stretch flex flex-col gap-[18px] items-start overflow-clip p-[20px] relative rounded-[20px] shrink-0 w-full" data-node-id="1:675" data-name="Related story">
            <div className="h-[220px] relative rounded-[12px] shrink-0 w-full" data-node-id="1:676" data-name="Story photograph">
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgStoryPhotograph8} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]" data-node-id="1:677">
              THE MENU FOR TOMORROW
            </p>
            <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]" data-node-id="1:678" style={{ fontVariationSettings: '"wdth" 100' }}>
              Planning for the next decade with a financial strategy that adapts.
            </p>
            <div className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap" data-node-id="1:679" data-name="Article link">
              <p className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]" data-node-id="1:680" style={{ fontVariationSettings: '"wdth" 100' }}>
                Read article
              </p>
              <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]" data-node-id="1:681">
                ↗
              </p>
            </div>
          </div>
          <div className="bg-[#fffdfa] content-stretch flex flex-col gap-[18px] items-start overflow-clip p-[20px] relative rounded-[20px] shrink-0 w-full" data-node-id="1:682" data-name="Related story">
            <div className="h-[220px] relative rounded-[12px] shrink-0 w-full" data-node-id="1:683" data-name="Story photograph">
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgStoryPhotograph9} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]" data-node-id="1:684">
              THE HARMONY OF RISK
            </p>
            <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]" data-node-id="1:685" style={{ fontVariationSettings: '"wdth" 100' }}>
              Balancing protection and growth so your plan stays in tune.
            </p>
            <div className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap" data-node-id="1:686" data-name="Article link">
              <p className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]" data-node-id="1:687" style={{ fontVariationSettings: '"wdth" 100' }}>
                Read article
              </p>
              <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]" data-node-id="1:688">
                ↗
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#402b1d] content-stretch flex flex-col gap-[28px] items-start overflow-clip px-[24px] py-[56px] relative shrink-0 w-full" data-node-id="1:689" data-name="People and perspective">
        <p className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.5] not-italic relative shrink-0 text-[#e6ba65] text-[11px] w-full" data-node-id="1:690">
          PEOPLE / PURPOSE / POSSIBILITY
        </p>
        <div className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[#fffdfa] text-[36px] tracking-[-1.44px] w-full" data-node-id="1:691" style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[1.06] mb-0">Behind every plan,</p>
          <p className="leading-[1.06]">there’s a person.</p>
        </div>
        <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full" data-node-id="1:692" style={{ fontVariationSettings: '"wdth" 100' }}>
          Stories about the relationships, standards and fresh thinking that make wealth more human.
        </p>
        <div className="content-stretch flex flex-col gap-[40px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:693" data-name="Portrait stories">
          <div className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:694" data-name="Perspective card">
            <div className="bg-[#ae7a41] content-stretch flex flex-col items-start overflow-clip p-[10px] relative shrink-0 w-full" data-node-id="1:695" data-name="Portrait print">
              <div className="h-[230px] relative shrink-0 w-full" data-node-id="1:696" data-name="Story photograph">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgStoryPhotograph10} />
                </div>
              </div>
            </div>
            <p className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.5] min-w-full not-italic relative shrink-0 text-[#e6ba65] text-[11px] w-[min-content]" data-node-id="1:697">
              GUIDANCE
            </p>
            <p className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#fffdfa] text-[30px] w-[min-content]" data-node-id="1:698">
              THE SERVICE STANDARD
            </p>
            <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] w-[min-content]" data-node-id="1:699" style={{ fontVariationSettings: '"wdth" 100' }}>
              What exceptional service looks like when your money is on the line.
            </p>
            <div className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#e6ba65] whitespace-nowrap" data-node-id="1:700" data-name="Article link">
              <p className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]" data-node-id="1:701" style={{ fontVariationSettings: '"wdth" 100' }}>
                Read article
              </p>
              <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]" data-node-id="1:702">
                ↗
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:703" data-name="Perspective card">
            <div className="bg-[#ae7a41] content-stretch flex flex-col items-start overflow-clip p-[10px] relative shrink-0 w-full" data-node-id="1:704" data-name="Portrait print">
              <div className="h-[230px] relative shrink-0 w-full" data-node-id="1:705" data-name="Story photograph">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgStoryPhotograph11} />
                </div>
              </div>
            </div>
            <p className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.5] min-w-full not-italic relative shrink-0 text-[#e6ba65] text-[11px] w-[min-content]" data-node-id="1:706">
              CONNECTION
            </p>
            <p className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#fffdfa] text-[30px] w-[min-content]" data-node-id="1:707">
              THE COMMUNITY EFFECT
            </p>
            <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] w-[min-content]" data-node-id="1:708" style={{ fontVariationSettings: '"wdth" 100' }}>
              How local relationships can strengthen your long-term financial outlook.
            </p>
            <div className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#e6ba65] whitespace-nowrap" data-node-id="1:709" data-name="Article link">
              <p className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]" data-node-id="1:710" style={{ fontVariationSettings: '"wdth" 100' }}>
                Read article
              </p>
              <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]" data-node-id="1:711">
                ↗
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:712" data-name="Perspective card">
            <div className="bg-[#ae7a41] content-stretch flex flex-col items-start overflow-clip p-[10px] relative shrink-0 w-full" data-node-id="1:713" data-name="Portrait print">
              <div className="h-[230px] relative shrink-0 w-full" data-node-id="1:714" data-name="Story photograph">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgStoryPhotograph12} />
                </div>
              </div>
            </div>
            <p className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.5] min-w-full not-italic relative shrink-0 text-[#e6ba65] text-[11px] w-[min-content]" data-node-id="1:715">
              WHAT COMES NEXT
            </p>
            <p className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#fffdfa] text-[30px] w-[min-content]" data-node-id="1:716">
              THE FUTURE OF FINANCE
            </p>
            <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] w-[min-content]" data-node-id="1:717" style={{ fontVariationSettings: '"wdth" 100' }}>
              What the next generation of wealth-building looks like in practice.
            </p>
            <div className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#e6ba65] whitespace-nowrap" data-node-id="1:718" data-name="Article link">
              <p className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]" data-node-id="1:719" style={{ fontVariationSettings: '"wdth" 100' }}>
                Read article
              </p>
              <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]" data-node-id="1:720">
                ↗
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] bg-[#fffdfa] content-stretch flex flex-col gap-[28px] items-start overflow-clip px-[24px] py-[56px] relative shrink-0 w-full" data-node-id="1:721" data-name="From insight to intention">
        <p className="font-['Special_Elite:Regular'] leading-[1.5] not-italic relative shrink-0 text-[#081d2b] text-[11px] w-full" data-node-id="1:722">
          DON’T JUST READ. REFLECT.
        </p>
        <div className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[#081d2b] text-[36px] tracking-[-1.44px] w-full" data-node-id="1:723" style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[1.06] mb-0">One good idea.</p>
          <p className="leading-[1.06]">One next step.</p>
        </div>
        <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:724" style={{ fontVariationSettings: '"wdth" 100' }}>
          Let what you learn become a conversation with yourself — or someone you trust.
        </p>
        <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-node-id="1:725" data-name="Reflection prompts">
          <div className="border-[#c9d1d4] border-solid border-t content-stretch flex flex-col gap-[12px] items-start overflow-clip py-[22px] relative shrink-0 w-full" data-node-id="1:726" data-name="Reflection prompt">
            <p className="font-['Special_Elite:Regular'] leading-[normal] not-italic relative shrink-0 text-[#081d2b] text-[23px] w-full" data-node-id="1:727">
              Notice
            </p>
            <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:728" style={{ fontVariationSettings: '"wdth" 100' }}>
              What does this story reveal about your own financial life?
            </p>
          </div>
          <div className="border-[#c9d1d4] border-solid border-t content-stretch flex flex-col gap-[12px] items-start overflow-clip py-[22px] relative shrink-0 w-full" data-node-id="1:729" data-name="Reflection prompt">
            <p className="font-['Special_Elite:Regular'] leading-[normal] not-italic relative shrink-0 text-[#081d2b] text-[23px] w-full" data-node-id="1:730">
              Question
            </p>
            <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:731" style={{ fontVariationSettings: '"wdth" 100' }}>
              Which assumption is worth taking a second look at?
            </p>
          </div>
          <div className="border-[#c9d1d4] border-solid border-t content-stretch flex flex-col gap-[12px] items-start overflow-clip py-[22px] relative shrink-0 w-full" data-node-id="1:732" data-name="Reflection prompt">
            <p className="font-['Special_Elite:Regular'] leading-[normal] not-italic relative shrink-0 text-[#081d2b] text-[23px] w-full" data-node-id="1:733">
              Begin
            </p>
            <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:734" style={{ fontVariationSettings: '"wdth" 100' }}>
              What small, practical step could you take next?
            </p>
          </div>
          <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[13px] w-full" data-node-id="1:735" style={{ fontVariationSettings: '"wdth" 100' }}>
            These insights are for education and reflection, not personalised financial advice. Your circumstances deserve a conversation of their own.
          </p>
        </div>
      </div>
      <div className="bg-[#d4bcfa] content-stretch flex flex-col gap-[28px] items-start overflow-clip px-[24px] py-[56px] relative shrink-0 w-full" data-node-id="1:736" data-name="Insight newsletter">
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[18px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:737" data-name="Signup invitation">
          <p className="font-['Special_Elite:Regular'] leading-[1.5] not-italic relative shrink-0 text-[#081d2b] text-[11px] w-full" data-node-id="1:738">
            A LITTLE CLARITY IN YOUR INBOX
          </p>
          <div className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[#081d2b] text-[36px] tracking-[-1.44px] w-full" data-node-id="1:739" style={{ fontVariationSettings: '"wdth" 100' }}>
            <p className="leading-[1.06] mb-0">Good thinking.</p>
            <p className="leading-[1.06]">Worth keeping.</p>
          </div>
          <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:740" style={{ fontVariationSettings: '"wdth" 100' }}>
            Fresh perspectives on wealth, work and life — plus new stories from the KSE reading room, delivered by email.
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:741" data-name="Subscription form">
          <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap" data-node-id="1:742" style={{ fontVariationSettings: '"wdth" 100' }}>
            Your email address
          </p>
          <div className="bg-[#fffdfa] content-stretch flex gap-[12px] h-[58px] items-center overflow-clip p-[18px] relative rounded-[12px] shrink-0 w-full" data-node-id="1:743" data-name="Email field">
            <div className="h-[16px] relative shrink-0 w-[20px]" data-node-id="1:744" data-name="Email">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEmail} />
            </div>
            <input
              type="email"
              placeholder="you@example.com"
              aria-label="Your email address"
              className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[20px] relative shrink-0 text-[#56646c] text-[14px] bg-transparent border-0 outline-0 w-full min-w-0"
              style={{ fontVariationSettings: '"wdth" 100' }}
            />
          </div>
          <div className="content-stretch flex gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:746" data-name="Subscription consent">
            <input
              type="checkbox"
              aria-label="I’d like to receive KSE insights by email"
              className="border border-[#081d2b] border-solid relative rounded-[4px] shrink-0 size-[18px] accent-[#081d2b] cursor-pointer"
              data-node-id="1:747"
              data-name="Consent checkbox"
            />
            <p className="[word-break:break-word] flex-[1_0_0] font-['Mona_Sans:Regular'] font-normal leading-[20px] min-w-px relative text-[#081d2b] text-[14px]" data-node-id="1:748" style={{ fontVariationSettings: '"wdth" 100' }}>
              I’d like to receive KSE insights by email. I can unsubscribe at any time.
            </p>
          </div>
          <button type="button" className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 w-full page-action" data-node-id="1:749" data-name="Page action">
            <div className="[word-break:break-word] flex flex-col font-['Mona_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-center text-white whitespace-nowrap" data-node-id="I1:749;30:2199" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[20px]">Subscribe to Insight</p>
            </div>
          </button>
          <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[20px] min-w-full relative shrink-0 text-[#56646c] text-[14px] w-[min-content]" data-node-id="1:750" style={{ fontVariationSettings: '"wdth" 100' }}>
            Useful ideas. A fresh perspective. No noise.
          </p>
        </div>
      </div>
      <div className="bg-[#42b9fa] content-stretch flex flex-col gap-[28px] items-start overflow-clip px-[24px] py-[56px] relative shrink-0 w-full" data-node-id="1:751" data-name="Your next conversation">
        <div className="absolute left-[160px] size-[420px] top-[410px]" data-node-id="1:752" data-name="Atmospheric light">
          <div className="absolute inset-[-23.81%]">
            <img alt="" className="block max-w-none size-full" src={imgAtmosphericLight} />
          </div>
        </div>
        <p className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.5] min-w-full not-italic relative shrink-0 text-[#081d2b] text-[11px] w-[min-content]" data-node-id="1:753">
          TURN PERSPECTIVE INTO A PLAN
        </p>
        <div className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[44px] tracking-[-1.76px] w-[min-content]" data-node-id="1:754" style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[1.06] mb-0">Your next</p>
          <p className="leading-[1.06] mb-0">chapter deserves</p>
          <p className="leading-[1.06]">a clearer plan.</p>
        </div>
        <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]" data-node-id="1:755" style={{ fontVariationSettings: '"wdth" 100' }}>
          Reading is a beginning. Let’s talk about what these ideas mean for your life, your priorities and the future you want to build.
        </p>
        <button type="button" className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 w-full page-action" data-node-id="1:756" data-name="Page action">
          <div className="[word-break:break-word] flex flex-col font-['Mona_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-center text-white whitespace-nowrap" data-node-id="I1:756;30:2199" style={{ fontVariationSettings: '"wdth" 100' }}>
            <p className="leading-[20px]">Book a Session</p>
          </div>
        </button>
        <div className="content-stretch flex flex-col gap-[16px] items-center overflow-clip relative shrink-0 w-full" data-node-id="1:757" data-name="Possibility sculpture">
          <div className="h-[261px] relative shrink-0 w-[310px]" data-node-id="1:758" data-name="Connection landmark">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgConnectionLandmark} />
          </div>
          <p className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[normal] min-w-full not-italic relative shrink-0 text-[#081d2b] text-[11px] text-center w-[min-content]" data-node-id="1:759">
            CLARITY IS ONLY THE BEGINNING.
          </p>
        </div>
      </div>
    </div>
  );
}
