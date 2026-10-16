const assetPathPrefix = "/assets"
const imgCoralSculpture = `${assetPathPrefix}/ced68.png`
const imgBlueSculpture = `${assetPathPrefix}/10be3.png`
const imgStoryPhotograph = `${assetPathPrefix}/c9004.png`
const imgStoryPhotograph1 = `${assetPathPrefix}/330b4.png`
const imgStoryPhotograph2 = `${assetPathPrefix}/b8130.png`
const imgStoryPhotograph3 = `${assetPathPrefix}/20453.png`
const imgStoryPhotograph4 = `${assetPathPrefix}/5a155.png`
const imgStoryPhotograph5 = `${assetPathPrefix}/45e36.png`
const imgStoryPhotograph6 = `${assetPathPrefix}/72c82.png`
const imgStoryPhotograph7 = `${assetPathPrefix}/80031.png`
const imgStoryPhotograph8 = `${assetPathPrefix}/282e8.png`
const imgStoryPhotograph9 = `${assetPathPrefix}/e875f.png`
const imgStoryPhotograph10 = `${assetPathPrefix}/6241f.png`
const imgStoryPhotograph11 = `${assetPathPrefix}/91b97.png`
const imgStoryPhotograph12 = `${assetPathPrefix}/74a96.png`
const imgConnectionLandmark = `${assetPathPrefix}/b5153.png`
const imgMail = `${assetPathPrefix}/535ae.svg`
const imgAtmosphericLight = `${assetPathPrefix}/678bc.svg`

type InsightPageProps = { onModeChange: (mode: "event" | "insight") => void }

export default function InsightPage({ onModeChange }: InsightPageProps) {
  return (
    <div className="contents relative size-full" data-node-id="1:649">
      <div
        className="absolute bg-[#f6f3ec] content-stretch flex flex-col items-start left-0 top-0 w-[1440px]"
        data-node-id="1:650"
        data-name="KSE Insight — A little perspective. A clearer future."
      >
        <div
          className="bg-[#f4f4f4] content-stretch flex flex-col gap-[24px] h-[760px] items-center overflow-clip pb-[48px] pt-[64px] relative shrink-0 w-full"
          data-node-id="1:651"
          data-name="Insight hero"
        >
          <div
            className="absolute h-[760px] left-0 top-0 w-[260px]"
            data-node-id="1:652"
            data-name="Coral sculpture"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                alt=""
                className="absolute h-full left-[-28.63%] max-w-none top-0 w-[128.63%]"
                src={imgCoralSculpture}
              />
            </div>
          </div>
          <div
            className="absolute h-[760px] left-[1180px] top-0 w-[260px]"
            data-node-id="1:653"
            data-name="Blue sculpture"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                alt=""
                className="absolute h-full left-0 max-w-none top-0 w-[128.63%]"
                src={imgBlueSculpture}
              />
            </div>
          </div>
          <div
            className="bg-[rgba(255,255,255,0.6)] border border-[rgba(211,176,106,0.4)] border-solid content-stretch flex gap-[12px] items-start overflow-clip p-[6px] relative rounded-[999px] shrink-0"
            data-node-id="1:654"
            data-name="Event / Insight toggle"
          >
            <button
              type="button"
              onClick={() => onModeChange("event")}
              aria-pressed="false"
              className="bg-[rgba(255,255,255,0)] border border-[rgba(245,240,230,0.3)] border-solid content-stretch flex h-[48px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 w-[180px] cursor-pointer"
              data-node-id="1:655"
              data-name="Event"
            >
              <p
                className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                data-node-id="I1:655;33:293"
              >
                Event
              </p>
            </button>
            <button
              type="button"
              onClick={() => onModeChange("insight")}
              aria-pressed="true"
              className="bg-[#c9a963] content-stretch flex h-[48px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 w-[180px] cursor-pointer"
              data-node-id="1:656"
              data-name="Insight active"
            >
              <p
                className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                data-node-id="I1:656;33:286"
              >
                Insight
              </p>
            </button>
          </div>
          <div
            className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-center overflow-clip relative shrink-0 text-center w-[780px]"
            data-node-id="1:657"
            data-name="Hero introduction"
          >
            <p
              className="font-['Inter:Bold'] font-bold leading-none min-w-full not-italic relative shrink-0 text-[#24182c] text-[92px] tracking-[-3.68px] w-[min-content]"
              data-node-id="1:658"
            >
              Insight
            </p>
            <p
              className="font-['Special_Elite:Regular'] leading-[1.3] min-w-full not-italic relative shrink-0 text-[#081d2b] text-[25px] w-[min-content]"
              data-node-id="1:659"
            >
              A little perspective. A clearer future.
            </p>
            <p
              className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[18px] w-[560px]"
              data-node-id="1:660"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              Fresh thinking on wealth, work and the everyday choices that shape
              the life you want to build.
            </p>
          </div>
          <div
            className="bg-[#402b1d] content-stretch flex flex-col h-[280px] items-start overflow-clip p-[28px] relative rounded-[20px] shrink-0 w-[800px]"
            data-node-id="1:661"
            data-name="Editorial collage"
          >
            <div
              className="[word-break:break-word] absolute font-['Anton:Regular'] leading-[0] left-[350px] not-italic text-[76px] text-[rgba(174,122,65,0.38)] top-[6px] w-[390px]"
              data-node-id="1:662"
            >
              <p className="leading-[1.02] mb-0">CLARITY</p>
              <p className="leading-[1.02] mb-0">GROWTH</p>
              <p className="leading-[1.02]">PURPOSE</p>
            </div>
            <div
              className="[word-break:break-word] content-stretch flex flex-col gap-[18px] items-start overflow-clip relative shrink-0 w-[330px]"
              data-node-id="1:663"
              data-name="Poster invitation"
            >
              <p
                className="font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#e6ba65] text-[13px] whitespace-nowrap"
                data-node-id="1:664"
              >
                THE KSE READING ROOM
              </p>
              <div
                className="font-['Oswald:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#fffdfa] text-[46px] w-[min-content]"
                data-node-id="1:665"
              >
                <p className="leading-[1.08] mb-0">GOOD IDEAS.</p>
                <p className="leading-[1.08]">REAL LIFE.</p>
              </div>
              <p
                className="font-['Special_Elite:Regular'] font-normal leading-[normal] relative shrink-0 text-[#e6ba65] text-[16px] whitespace-nowrap"
                data-node-id="1:666"
                style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
              >
                Explore the stories below ↓
              </p>
            </div>
            <div
              className="absolute flex h-[220.951px] items-center justify-center left-[426px] top-[19.81px] w-[199.184px]"
              data-node-id="1:667"
            >
              <div className="-rotate-7 flex-none">
                <div
                  className="bg-[#fffdfa] content-stretch flex items-start overflow-clip p-[8px] relative"
                  data-name="Artisan print"
                >
                  <div
                    className="h-[185px] relative shrink-0 w-[160px]"
                    data-node-id="1:668"
                    data-name="Story photograph"
                  >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <img
                        alt=""
                        className="absolute left-0 max-w-none size-full top-0"
                        src={imgStoryPhotograph}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="absolute flex h-[215.379px] items-center justify-center left-[588.82px] top-[47px] w-[193.612px]"
              data-node-id="1:669"
            >
              <div className="flex-none rotate-7">
                <div
                  className="bg-[#fffdfa] content-stretch flex items-start overflow-clip p-[8px] relative"
                  data-name="Musician print"
                >
                  <div
                    className="h-[180px] relative shrink-0 w-[155px]"
                    data-node-id="1:670"
                    data-name="Story photograph"
                  >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <img
                        alt=""
                        className="absolute left-0 max-w-none size-full top-0"
                        src={imgStoryPhotograph1}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p
            className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap"
            data-node-id="1:671"
          >
            WEALTH HAS A HUMAN SIDE. LET’S EXPLORE IT.
          </p>
        </div>
        <div
          className="content-stretch flex flex-col gap-[40px] items-start overflow-clip px-[80px] py-[96px] relative shrink-0 w-full"
          data-node-id="1:672"
          data-name="Featured article"
        >
          <div
            className="[word-break:break-word] content-stretch flex items-end justify-between overflow-clip relative shrink-0 w-full"
            data-node-id="1:673"
            data-name="Feature introduction"
          >
            <div
              className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 text-[#081d2b] w-[790px]"
              data-node-id="1:674"
              data-name="Introduction"
            >
              <p
                className="font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[13px] whitespace-nowrap"
                data-node-id="1:675"
              >
                THE BIG PICTURE / EDITOR’S PICK
              </p>
              <div
                className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[64px] tracking-[-2.56px] w-[min-content]"
                data-node-id="1:676"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                <p className="leading-[1.04] mb-0">Look closer.</p>
                <p className="leading-[1.04]">There’s more to your wealth.</p>
              </div>
            </div>
            <p
              className="font-['Lora:Italic'] font-normal italic leading-[1.3] relative shrink-0 text-[#56646c] text-[26px] w-[320px]"
              data-node-id="1:677"
            >
              Sometimes, the most valuable things are hiding in plain sight.
            </p>
          </div>
          <div
            className="content-stretch flex h-[480px] items-start overflow-clip relative rounded-[24px] shrink-0 w-full"
            data-node-id="1:678"
            data-name="Feature spread"
          >
            <div
              className="bg-[#402b1d] content-stretch flex flex-col h-full items-start overflow-clip relative shrink-0 w-[610px]"
              data-node-id="1:679"
              data-name="Cover photograph"
            >
              <div
                className="h-[480px] relative shrink-0 w-[610px]"
                data-node-id="1:680"
                data-name="Story photograph"
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    alt=""
                    className="absolute left-0 max-w-none size-full top-0"
                    src={imgStoryPhotograph2}
                  />
                </div>
              </div>
              <div
                className="absolute flex h-[57.015px] items-center justify-center left-[24px] top-[402.77px] w-[289.803px]"
                data-node-id="1:681"
              >
                <div className="-rotate-3 flex-none">
                  <div
                    className="bg-[#e6ba65] content-stretch flex items-start overflow-clip px-[16px] py-[12px] relative"
                    data-name="Photo caption"
                  >
                    <p
                      className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap"
                      data-node-id="1:682"
                    >
                      A DIFFERENT LENS ON EVERYDAY WEALTH
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="bg-[#dfeff8] content-stretch flex flex-[1_0_0] flex-col gap-[24px] h-full items-start min-w-px overflow-clip p-[40px] relative"
              data-node-id="1:683"
              data-name="Article introduction"
            >
              <p
                className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap"
                data-node-id="1:684"
              >
                WEALTH FOUNDATIONS / FEATURED ESSAY
              </p>
              <div
                className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[54px] w-[min-content]"
                data-node-id="1:685"
              >
                <p className="leading-[1.05] mb-0">WHERE ARE ALL</p>
                <p className="leading-[1.05]">YOUR ASSETS?</p>
              </div>
              <p
                className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[18px] w-[min-content]"
                data-node-id="1:686"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                A closer look at hidden wealth and the gaps in your current
                portfolio.
              </p>
              <p
                className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.5] min-w-full relative shrink-0 text-[#081d2b] text-[16px] w-[min-content]"
                data-node-id="1:687"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Start with what you own, what you owe and what matters most. A
                clearer picture is the first step towards a more intentional
                plan.
              </p>
              <button
                className="bg-[#0d2b42] content-stretch flex h-[48px] items-center justify-center px-[24px] relative rounded-[999px] shrink-0 w-[230px]"
                data-node-id="1:688"
                data-name="Editorial action"
              >
                <p
                  className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#fffdfa] text-[14px] whitespace-nowrap"
                  data-node-id="I1:688;33:286"
                >
                  Read the featured article
                </p>
              </button>
            </div>
          </div>
        </div>
        <div
          className="content-stretch flex flex-col gap-[40px] items-start overflow-clip pb-[96px] px-[80px] relative shrink-0 w-full"
          data-node-id="1:689"
          data-name="Browse insights"
        >
          <div
            className="content-stretch flex items-end justify-between overflow-clip relative shrink-0 w-full"
            data-node-id="1:690"
            data-name="Library introduction"
          >
            <div
              className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 text-[#081d2b] w-[700px]"
              data-node-id="1:691"
              data-name="Heading group"
            >
              <p
                className="font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[13px] whitespace-nowrap"
                data-node-id="1:692"
              >
                THE LIBRARY / FIND YOUR PERSPECTIVE
              </p>
              <p
                className="font-['Mona_Sans:SemiBold'] font-semibold leading-[1.04] min-w-full relative shrink-0 text-[60px] tracking-[-2.4px] w-[min-content]"
                data-node-id="1:693"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Curiosity looks good on you.
              </p>
            </div>
            <div
              className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-[340px]"
              data-node-id="1:694"
              data-name="Library copy"
            >
              <p
                className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[17px] w-full"
                data-node-id="1:695"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Browse ideas to help you think clearly, ask better questions and
                take your next step.
              </p>
            </div>
          </div>
          <div
            className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 w-full"
            data-node-id="1:696"
            data-name="Topic filters"
          >
            <div
              className="bg-[#0d2b42] content-stretch flex h-[48px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 w-[150px]"
              data-node-id="1:697"
              data-name="Active topic"
            >
              <p
                className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#fffdfa] text-[14px] whitespace-nowrap"
                data-node-id="I1:697;33:286"
              >
                All insights
              </p>
            </div>
            <div
              className="bg-[#fffdfa] border border-[#c9d1d4] border-solid content-stretch flex h-[48px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 w-[205px]"
              data-node-id="1:698"
              data-name="Topic filter"
            >
              <p
                className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                data-node-id="I1:698;33:293"
              >
                Wealth foundations
              </p>
            </div>
            <div
              className="bg-[#fffdfa] border border-[#c9d1d4] border-solid content-stretch flex h-[48px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 w-[150px]"
              data-node-id="1:699"
              data-name="Topic filter"
            >
              <p
                className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                data-node-id="I1:699;33:293"
              >
                Investing
              </p>
            </div>
            <div
              className="bg-[#fffdfa] border border-[#c9d1d4] border-solid content-stretch flex h-[48px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 w-[150px]"
              data-node-id="1:700"
              data-name="Topic filter"
            >
              <p
                className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                data-node-id="I1:700;33:293"
              >
                Retirement
              </p>
            </div>
            <div
              className="bg-[#fffdfa] border border-[#c9d1d4] border-solid content-stretch flex h-[48px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 w-[150px]"
              data-node-id="1:701"
              data-name="Topic filter"
            >
              <p
                className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                data-node-id="I1:701;33:293"
              >
                Protection
              </p>
            </div>
            <div
              className="bg-[#fffdfa] border border-[#c9d1d4] border-solid content-stretch flex h-[48px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 w-[160px]"
              data-node-id="1:702"
              data-name="Topic filter"
            >
              <p
                className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                data-node-id="I1:702;33:293"
              >{`Life & legacy`}</p>
            </div>
          </div>
          <div
            className="content-stretch flex flex-col gap-[32px] items-start overflow-clip relative shrink-0 w-full"
            data-node-id="1:703"
            data-name="Article rows"
          >
            <div
              className="content-stretch flex gap-[32px] items-start overflow-clip relative shrink-0 w-full"
              data-node-id="1:704"
              data-name="Article collection"
            >
              <div
                className="bg-[#fffdfa] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative rounded-[24px]"
                data-node-id="1:705"
                data-name="Article card"
              >
                <div
                  className="bg-[#d4bcfa] content-stretch flex flex-col h-[255px] items-start overflow-clip p-[16px] relative shrink-0 w-full"
                  data-node-id="1:706"
                  data-name="Article artwork"
                >
                  <div
                    className="h-[223px] relative rounded-[12px] shrink-0 w-full"
                    data-node-id="1:707"
                    data-name="Story photograph"
                  >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                      <img
                        alt=""
                        className="absolute left-0 max-w-none size-full top-0"
                        src={imgStoryPhotograph}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative shrink-0 w-full"
                  data-node-id="1:708"
                  data-name="Article summary"
                >
                  <p
                    className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap"
                    data-node-id="1:709"
                  >
                    INVESTING
                  </p>
                  <p
                    className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]"
                    data-node-id="1:710"
                  >
                    THE CRAFT OF WEALTH
                  </p>
                  <div
                    className="content-stretch flex flex-col items-start min-h-[78px] overflow-clip relative shrink-0 w-full"
                    data-node-id="1:711"
                    data-name="Description"
                  >
                    <p
                      className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full"
                      data-node-id="1:712"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      How artisanal investing can help you build a more
                      resilient financial future.
                    </p>
                  </div>
                  <div
                    className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap"
                    data-node-id="1:713"
                    data-name="Article link"
                  >
                    <p
                      className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]"
                      data-node-id="1:714"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Read article
                    </p>
                    <p
                      className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]"
                      data-node-id="1:715"
                    >
                      ↗
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="bg-[#fffdfa] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative rounded-[24px]"
                data-node-id="1:716"
                data-name="Article card"
              >
                <div
                  className="bg-[#dfeff8] content-stretch flex flex-col h-[255px] items-start overflow-clip p-[16px] relative shrink-0 w-full"
                  data-node-id="1:717"
                  data-name="Article artwork"
                >
                  <div
                    className="h-[223px] relative rounded-[12px] shrink-0 w-full"
                    data-node-id="1:718"
                    data-name="Story photograph"
                  >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                      <img
                        alt=""
                        className="absolute left-0 max-w-none size-full top-0"
                        src={imgStoryPhotograph1}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative shrink-0 w-full"
                  data-node-id="1:719"
                  data-name="Article summary"
                >
                  <p
                    className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap"
                    data-node-id="1:720"
                  >
                    INVESTING
                  </p>
                  <p
                    className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]"
                    data-node-id="1:721"
                  >
                    THE RHYTHM OF RETURNS
                  </p>
                  <div
                    className="content-stretch flex flex-col items-start min-h-[78px] overflow-clip relative shrink-0 w-full"
                    data-node-id="1:722"
                    data-name="Description"
                  >
                    <p
                      className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full"
                      data-node-id="1:723"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Timing the market is hard, but timing your financial goals
                      doesn’t have to be.
                    </p>
                  </div>
                  <div
                    className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap"
                    data-node-id="1:724"
                    data-name="Article link"
                  >
                    <p
                      className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]"
                      data-node-id="1:725"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Read article
                    </p>
                    <p
                      className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]"
                      data-node-id="1:726"
                    >
                      ↗
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="bg-[#fffdfa] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative rounded-[24px]"
                data-node-id="1:727"
                data-name="Article card"
              >
                <div
                  className="bg-[#ffe6d3] content-stretch flex flex-col h-[255px] items-start overflow-clip p-[16px] relative shrink-0 w-full"
                  data-node-id="1:728"
                  data-name="Article artwork"
                >
                  <div
                    className="h-[223px] relative rounded-[12px] shrink-0 w-full"
                    data-node-id="1:729"
                    data-name="Story photograph"
                  >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                      <img
                        alt=""
                        className="absolute left-0 max-w-none size-full top-0"
                        src={imgStoryPhotograph3}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative shrink-0 w-full"
                  data-node-id="1:730"
                  data-name="Article summary"
                >
                  <p
                    className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap"
                    data-node-id="1:731"
                  >
                    WEALTH FOUNDATIONS
                  </p>
                  <p
                    className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]"
                    data-node-id="1:732"
                  >
                    THE RECIPE FOR GROWTH
                  </p>
                  <div
                    className="content-stretch flex flex-col items-start min-h-[78px] overflow-clip relative shrink-0 w-full"
                    data-node-id="1:733"
                    data-name="Description"
                  >
                    <p
                      className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full"
                      data-node-id="1:734"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Mixing the right ingredients to turn your savings into
                      long-term wealth.
                    </p>
                  </div>
                  <div
                    className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap"
                    data-node-id="1:735"
                    data-name="Article link"
                  >
                    <p
                      className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]"
                      data-node-id="1:736"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Read article
                    </p>
                    <p
                      className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]"
                      data-node-id="1:737"
                    >
                      ↗
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex gap-[32px] items-start overflow-clip relative shrink-0 w-full"
              data-node-id="1:738"
              data-name="Article collection"
            >
              <div
                className="bg-[#fffdfa] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative rounded-[24px]"
                data-node-id="1:739"
                data-name="Article card"
              >
                <div
                  className="bg-[#dfeff8] content-stretch flex flex-col h-[255px] items-start overflow-clip p-[16px] relative shrink-0 w-full"
                  data-node-id="1:740"
                  data-name="Article artwork"
                >
                  <div
                    className="h-[223px] relative rounded-[12px] shrink-0 w-full"
                    data-node-id="1:741"
                    data-name="Story photograph"
                  >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                      <img
                        alt=""
                        className="absolute left-0 max-w-none size-full top-0"
                        src={imgStoryPhotograph4}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative shrink-0 w-full"
                  data-node-id="1:742"
                  data-name="Article summary"
                >
                  <p
                    className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap"
                    data-node-id="1:743"
                  >
                    RETIREMENT
                  </p>
                  <p
                    className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]"
                    data-node-id="1:744"
                  >
                    THE WORKER’S EDGE
                  </p>
                  <div
                    className="content-stretch flex flex-col items-start min-h-[78px] overflow-clip relative shrink-0 w-full"
                    data-node-id="1:745"
                    data-name="Description"
                  >
                    <p
                      className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full"
                      data-node-id="1:746"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Turning everyday income into a retirement plan that
                      actually works.
                    </p>
                  </div>
                  <div
                    className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap"
                    data-node-id="1:747"
                    data-name="Article link"
                  >
                    <p
                      className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]"
                      data-node-id="1:748"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Read article
                    </p>
                    <p
                      className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]"
                      data-node-id="1:749"
                    >
                      ↗
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="bg-[#fffdfa] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative rounded-[24px]"
                data-node-id="1:750"
                data-name="Article card"
              >
                <div
                  className="bg-[#ffe6d3] content-stretch flex flex-col h-[255px] items-start overflow-clip p-[16px] relative shrink-0 w-full"
                  data-node-id="1:751"
                  data-name="Article artwork"
                >
                  <div
                    className="h-[223px] relative rounded-[12px] shrink-0 w-full"
                    data-node-id="1:752"
                    data-name="Story photograph"
                  >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                      <img
                        alt=""
                        className="absolute left-0 max-w-none size-full top-0"
                        src={imgStoryPhotograph5}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative shrink-0 w-full"
                  data-node-id="1:753"
                  data-name="Article summary"
                >
                  <p
                    className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap"
                    data-node-id="1:754"
                  >
                    PROTECTION
                  </p>
                  <p
                    className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]"
                    data-node-id="1:755"
                  >
                    THE TASTE OF SECURITY
                  </p>
                  <div
                    className="content-stretch flex flex-col items-start min-h-[78px] overflow-clip relative shrink-0 w-full"
                    data-node-id="1:756"
                    data-name="Description"
                  >
                    <p
                      className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full"
                      data-node-id="1:757"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Finding peace of mind in a financial plan that’s built to
                      last.
                    </p>
                  </div>
                  <div
                    className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap"
                    data-node-id="1:758"
                    data-name="Article link"
                  >
                    <p
                      className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]"
                      data-node-id="1:759"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Read article
                    </p>
                    <p
                      className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]"
                      data-node-id="1:760"
                    >
                      ↗
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="bg-[#fffdfa] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative rounded-[24px]"
                data-node-id="1:761"
                data-name="Article card"
              >
                <div
                  className="bg-[#d4bcfa] content-stretch flex flex-col h-[255px] items-start overflow-clip p-[16px] relative shrink-0 w-full"
                  data-node-id="1:762"
                  data-name="Article artwork"
                >
                  <div
                    className="h-[223px] relative rounded-[12px] shrink-0 w-full"
                    data-node-id="1:763"
                    data-name="Story photograph"
                  >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                      <img
                        alt=""
                        className="absolute left-0 max-w-none size-full top-0"
                        src={imgStoryPhotograph6}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative shrink-0 w-full"
                  data-node-id="1:764"
                  data-name="Article summary"
                >
                  <p
                    className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap"
                    data-node-id="1:765"
                  >
                    INVESTING
                  </p>
                  <p
                    className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]"
                    data-node-id="1:766"
                  >
                    THE ART OF DIVERSITY
                  </p>
                  <div
                    className="content-stretch flex flex-col items-start min-h-[78px] overflow-clip relative shrink-0 w-full"
                    data-node-id="1:767"
                    data-name="Description"
                  >
                    <p
                      className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full"
                      data-node-id="1:768"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Why spreading your assets across different classes can
                      protect your future.
                    </p>
                  </div>
                  <div
                    className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap"
                    data-node-id="1:769"
                    data-name="Article link"
                  >
                    <p
                      className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]"
                      data-node-id="1:770"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Read article
                    </p>
                    <p
                      className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]"
                      data-node-id="1:771"
                    >
                      ↗
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="[word-break:break-word] border-[#c9d1d4] border-solid border-t content-stretch flex items-start justify-between overflow-clip pt-[24px] relative shrink-0 text-[#081d2b] w-full whitespace-nowrap"
            data-node-id="1:772"
            data-name="Library continuation"
          >
            <p
              className="font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[13px]"
              data-node-id="1:773"
            >
              MORE PERSPECTIVES, FURTHER DOWN THE PAGE
            </p>
            <div
              className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0"
              data-node-id="1:774"
              data-name="Article link"
            >
              <p
                className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]"
                data-node-id="1:775"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >{`Explore life & legacy`}</p>
              <p
                className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]"
                data-node-id="1:776"
              >
                ↗
              </p>
            </div>
          </div>
        </div>
        <div
          className="bg-[#d4bcfa] content-stretch flex flex-col gap-[40px] items-start overflow-clip p-[80px] relative shrink-0 w-full"
          data-node-id="1:777"
          data-name="Life and legacy reading trail"
        >
          <div
            className="[word-break:break-word] content-stretch flex items-end justify-between overflow-clip relative shrink-0 text-[#081d2b] w-full"
            data-node-id="1:778"
            data-name="Topic introduction"
          >
            <div
              className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-[800px]"
              data-node-id="1:779"
              data-name="Topic heading"
            >
              <p
                className="font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[13px] whitespace-nowrap"
                data-node-id="1:780"
              >{`LIFE & LEGACY / A READING TRAIL`}</p>
              <div
                className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[64px] tracking-[-2.56px] w-[min-content]"
                data-node-id="1:781"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                <p className="leading-[1.04] mb-0">Money is part of life.</p>
                <p className="leading-[1.04]">Not the other way around.</p>
              </div>
            </div>
            <p
              className="font-['Lora:Italic'] font-normal italic leading-[1.3] relative shrink-0 text-[28px] w-[280px]"
              data-node-id="1:782"
            >
              For the plans you make around the kitchen table.
            </p>
          </div>
          <div
            className="content-stretch flex gap-[32px] items-start overflow-clip relative shrink-0 w-full"
            data-node-id="1:783"
            data-name="Reading trail"
          >
            <div
              className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-[590px]"
              data-node-id="1:784"
              data-name="Lead story"
            >
              <div
                className="flex h-[364.381px] items-center justify-center relative shrink-0 w-full"
                data-node-id="1:785"
              >
                <div className="-rotate-2 flex-none w-full">
                  <div
                    className="bg-[#fffdfa] content-stretch flex flex-col items-start overflow-clip p-[12px] relative w-full"
                    data-name="Layered photo"
                  >
                    <div
                      className="h-[320px] relative shrink-0 w-full"
                      data-node-id="1:786"
                      data-name="Story photograph"
                    >
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <img
                          alt=""
                          className="absolute left-0 max-w-none size-full top-0"
                          src={imgStoryPhotograph7}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p
                className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap"
                data-node-id="1:787"
              >
                BEGIN WITH A CONVERSATION
              </p>
              <p
                className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[normal] min-w-full relative shrink-0 text-[#081d2b] text-[38px] w-[min-content]"
                data-node-id="1:788"
              >
                THE KITCHEN TABLE PLAN
              </p>
              <p
                className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#081d2b] text-[18px] w-[min-content]"
                data-node-id="1:789"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Turning everyday conversations into a clear path to financial
                freedom.
              </p>
              <div
                className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap"
                data-node-id="1:790"
                data-name="Article link"
              >
                <p
                  className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]"
                  data-node-id="1:791"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Read article
                </p>
                <p
                  className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]"
                  data-node-id="1:792"
                >
                  ↗
                </p>
              </div>
            </div>
            <div
              className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px overflow-clip relative"
              data-node-id="1:793"
              data-name="Related reading"
            >
              <div
                className="bg-[#fffdfa] content-stretch flex gap-[24px] items-start overflow-clip p-[24px] relative rounded-[24px] shrink-0 w-full"
                data-node-id="1:794"
                data-name="Related story"
              >
                <div
                  className="h-[200px] relative rounded-[12px] shrink-0 w-[170px]"
                  data-node-id="1:795"
                  data-name="Story photograph"
                >
                  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                    <img
                      alt=""
                      className="absolute left-0 max-w-none size-full top-0"
                      src={imgStoryPhotograph8}
                    />
                  </div>
                </div>
                <div
                  className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px overflow-clip relative"
                  data-node-id="1:796"
                  data-name="Story summary"
                >
                  <p
                    className="font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]"
                    data-node-id="1:797"
                  >
                    THE MENU FOR TOMORROW
                  </p>
                  <p
                    className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]"
                    data-node-id="1:798"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Planning for the next decade with a financial strategy that
                    adapts.
                  </p>
                  <div
                    className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap"
                    data-node-id="1:799"
                    data-name="Article link"
                  >
                    <p
                      className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]"
                      data-node-id="1:800"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Read article
                    </p>
                    <p
                      className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]"
                      data-node-id="1:801"
                    >
                      ↗
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="bg-[#fffdfa] content-stretch flex gap-[24px] items-start overflow-clip p-[24px] relative rounded-[24px] shrink-0 w-full"
                data-node-id="1:802"
                data-name="Related story"
              >
                <div
                  className="h-[200px] relative rounded-[12px] shrink-0 w-[170px]"
                  data-node-id="1:803"
                  data-name="Story photograph"
                >
                  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                    <img
                      alt=""
                      className="absolute left-0 max-w-none size-full top-0"
                      src={imgStoryPhotograph9}
                    />
                  </div>
                </div>
                <div
                  className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px overflow-clip relative"
                  data-node-id="1:804"
                  data-name="Story summary"
                >
                  <p
                    className="font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#081d2b] text-[29px] w-[min-content]"
                    data-node-id="1:805"
                  >
                    THE HARMONY OF RISK
                  </p>
                  <p
                    className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]"
                    data-node-id="1:806"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Balancing protection and growth so your plan stays in tune.
                  </p>
                  <div
                    className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#081d2b] whitespace-nowrap"
                    data-node-id="1:807"
                    data-name="Article link"
                  >
                    <p
                      className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]"
                      data-node-id="1:808"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Read article
                    </p>
                    <p
                      className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]"
                      data-node-id="1:809"
                    >
                      ↗
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-[#402b1d] content-stretch flex flex-col gap-[40px] items-start overflow-clip p-[80px] relative shrink-0 w-full"
          data-node-id="1:810"
          data-name="People and perspective"
        >
          <div
            className="content-stretch flex items-end justify-between overflow-clip relative shrink-0 w-full"
            data-node-id="1:811"
            data-name="Editorial introduction"
          >
            <div
              className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-[820px]"
              data-node-id="1:812"
              data-name="Heading group"
            >
              <p
                className="font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#e6ba65] text-[13px] whitespace-nowrap"
                data-node-id="1:813"
              >
                PEOPLE / PURPOSE / POSSIBILITY
              </p>
              <div
                className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#fffdfa] text-[64px] tracking-[-2.56px] w-[min-content]"
                data-node-id="1:814"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                <p className="leading-[1.04] mb-0">Behind every plan,</p>
                <p className="leading-[1.04]">there’s a person.</p>
              </div>
            </div>
            <div
              className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-[320px]"
              data-node-id="1:815"
              data-name="Introduction copy"
            >
              <p
                className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[17px] text-[rgba(255,255,255,0.7)] w-full"
                data-node-id="1:816"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Stories about the relationships, standards and fresh thinking
                that make wealth more human.
              </p>
            </div>
          </div>
          <div
            className="content-stretch flex gap-[32px] items-start overflow-clip relative shrink-0 w-full"
            data-node-id="1:817"
            data-name="Portrait stories"
          >
            <div
              className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px overflow-clip relative"
              data-node-id="1:818"
              data-name="Perspective card"
            >
              <div
                className="bg-[#ae7a41] content-stretch flex flex-col items-start overflow-clip p-[10px] relative shrink-0 w-full"
                data-node-id="1:819"
                data-name="Portrait print"
              >
                <div
                  className="h-[250px] relative shrink-0 w-full"
                  data-node-id="1:820"
                  data-name="Story photograph"
                >
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img
                      alt=""
                      className="absolute left-0 max-w-none size-full top-0"
                      src={imgStoryPhotograph10}
                    />
                  </div>
                </div>
              </div>
              <p
                className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#e6ba65] text-[13px] whitespace-nowrap"
                data-node-id="1:821"
              >
                GUIDANCE
              </p>
              <p
                className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#fffdfa] text-[30px] w-[min-content]"
                data-node-id="1:822"
              >
                THE SERVICE STANDARD
              </p>
              <div
                className="content-stretch flex flex-col items-start min-h-[74px] overflow-clip relative shrink-0 w-full"
                data-node-id="1:823"
                data-name="Description"
              >
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] w-full"
                  data-node-id="1:824"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  What exceptional service looks like when your money is on the
                  line.
                </p>
              </div>
              <div
                className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#e6ba65] whitespace-nowrap"
                data-node-id="1:825"
                data-name="Article link"
              >
                <p
                  className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]"
                  data-node-id="1:826"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Read article
                </p>
                <p
                  className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]"
                  data-node-id="1:827"
                >
                  ↗
                </p>
              </div>
            </div>
            <div
              className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px overflow-clip relative"
              data-node-id="1:828"
              data-name="Perspective card"
            >
              <div
                className="bg-[#ae7a41] content-stretch flex flex-col items-start overflow-clip p-[10px] relative shrink-0 w-full"
                data-node-id="1:829"
                data-name="Portrait print"
              >
                <div
                  className="h-[250px] relative shrink-0 w-full"
                  data-node-id="1:830"
                  data-name="Story photograph"
                >
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img
                      alt=""
                      className="absolute left-0 max-w-none size-full top-0"
                      src={imgStoryPhotograph11}
                    />
                  </div>
                </div>
              </div>
              <p
                className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#e6ba65] text-[13px] whitespace-nowrap"
                data-node-id="1:831"
              >
                CONNECTION
              </p>
              <p
                className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#fffdfa] text-[30px] w-[min-content]"
                data-node-id="1:832"
              >
                THE COMMUNITY EFFECT
              </p>
              <div
                className="content-stretch flex flex-col items-start min-h-[74px] overflow-clip relative shrink-0 w-full"
                data-node-id="1:833"
                data-name="Description"
              >
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] w-full"
                  data-node-id="1:834"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  How local relationships can strengthen your long-term
                  financial outlook.
                </p>
              </div>
              <div
                className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#e6ba65] whitespace-nowrap"
                data-node-id="1:835"
                data-name="Article link"
              >
                <p
                  className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]"
                  data-node-id="1:836"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Read article
                </p>
                <p
                  className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]"
                  data-node-id="1:837"
                >
                  ↗
                </p>
              </div>
            </div>
            <div
              className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px overflow-clip relative"
              data-node-id="1:838"
              data-name="Perspective card"
            >
              <div
                className="bg-[#ae7a41] content-stretch flex flex-col items-start overflow-clip p-[10px] relative shrink-0 w-full"
                data-node-id="1:839"
                data-name="Portrait print"
              >
                <div
                  className="h-[250px] relative shrink-0 w-full"
                  data-node-id="1:840"
                  data-name="Story photograph"
                >
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img
                      alt=""
                      className="absolute left-0 max-w-none size-full top-0"
                      src={imgStoryPhotograph12}
                    />
                  </div>
                </div>
              </div>
              <p
                className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#e6ba65] text-[13px] whitespace-nowrap"
                data-node-id="1:841"
              >
                WHAT COMES NEXT
              </p>
              <p
                className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[1.15] min-w-full relative shrink-0 text-[#fffdfa] text-[30px] w-[min-content]"
                data-node-id="1:842"
              >
                THE FUTURE OF FINANCE
              </p>
              <div
                className="content-stretch flex flex-col items-start min-h-[74px] overflow-clip relative shrink-0 w-full"
                data-node-id="1:843"
                data-name="Description"
              >
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] w-full"
                  data-node-id="1:844"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  What the next generation of wealth-building looks like in
                  practice.
                </p>
              </div>
              <div
                className="[word-break:break-word] content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 text-[#e6ba65] whitespace-nowrap"
                data-node-id="1:845"
                data-name="Article link"
              >
                <p
                  className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px]"
                  data-node-id="1:846"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Read article
                </p>
                <p
                  className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[22px]"
                  data-node-id="1:847"
                >
                  ↗
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-[#fffdfa] content-stretch flex gap-[100px] items-start overflow-clip p-[80px] relative shrink-0 w-full"
          data-node-id="1:848"
          data-name="From insight to intention"
        >
          <div
            className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-[480px]"
            data-node-id="1:849"
            data-name="Reflection introduction"
          >
            <p
              className="font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap"
              data-node-id="1:850"
            >
              DON’T JUST READ. REFLECT.
            </p>
            <div
              className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[56px] tracking-[-2.24px] w-[min-content]"
              data-node-id="1:851"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              <p className="leading-[1.04] mb-0">One good idea.</p>
              <p className="leading-[1.04]">One next step.</p>
            </div>
            <p
              className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[17px] w-[min-content]"
              data-node-id="1:852"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              Let what you learn become a conversation with yourself — or
              someone you trust.
            </p>
          </div>
          <div
            className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative"
            data-node-id="1:853"
            data-name="Reflection prompts"
          >
            <div
              className="border-[#c9d1d4] border-solid border-t content-stretch flex gap-[32px] items-start overflow-clip py-[22px] relative shrink-0 w-full"
              data-node-id="1:854"
              data-name="Reflection prompt"
            >
              <p
                className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[normal] not-italic relative shrink-0 text-[#081d2b] text-[23px] w-[140px]"
                data-node-id="1:855"
              >
                Notice
              </p>
              <div
                className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative"
                data-node-id="1:856"
                data-name="Prompt copy"
              >
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full"
                  data-node-id="1:857"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  What does this story reveal about your own financial life?
                </p>
              </div>
            </div>
            <div
              className="border-[#c9d1d4] border-solid border-t content-stretch flex gap-[32px] items-start overflow-clip py-[22px] relative shrink-0 w-full"
              data-node-id="1:858"
              data-name="Reflection prompt"
            >
              <p
                className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[normal] not-italic relative shrink-0 text-[#081d2b] text-[23px] w-[140px]"
                data-node-id="1:859"
              >
                Question
              </p>
              <div
                className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative"
                data-node-id="1:860"
                data-name="Prompt copy"
              >
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full"
                  data-node-id="1:861"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Which assumption is worth taking a second look at?
                </p>
              </div>
            </div>
            <div
              className="border-[#c9d1d4] border-solid border-t content-stretch flex gap-[32px] items-start overflow-clip py-[22px] relative shrink-0 w-full"
              data-node-id="1:862"
              data-name="Reflection prompt"
            >
              <p
                className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[normal] not-italic relative shrink-0 text-[#081d2b] text-[23px] w-[140px]"
                data-node-id="1:863"
              >
                Begin
              </p>
              <div
                className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative"
                data-node-id="1:864"
                data-name="Prompt copy"
              >
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full"
                  data-node-id="1:865"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  What small, practical step could you take next?
                </p>
              </div>
            </div>
            <p
              className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.5] relative shrink-0 text-[#56646c] text-[13px] w-full"
              data-node-id="1:866"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              These insights are for education and reflection, not personalised
              financial advice. Your circumstances deserve a conversation of
              their own.
            </p>
          </div>
        </div>
        <div
          className="bg-[#d4bcfa] content-stretch flex gap-[100px] items-center overflow-clip p-[80px] relative shrink-0 w-full"
          data-node-id="1:867"
          data-name="Insight newsletter"
        >
          <div
            className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-[580px]"
            data-node-id="1:868"
            data-name="Newsletter invitation"
          >
            <p
              className="font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap"
              data-node-id="1:869"
            >
              A LITTLE CLARITY IN YOUR INBOX
            </p>
            <div
              className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[60px] tracking-[-2.4px] w-[min-content]"
              data-node-id="1:870"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              <p className="leading-[1.04] mb-0">Good thinking.</p>
              <p className="leading-[1.04]">Worth keeping.</p>
            </div>
            <p
              className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[18px] w-[min-content]"
              data-node-id="1:871"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              Fresh perspectives on wealth, work and life — plus new stories
              from the KSE reading room, delivered by email.
            </p>
          </div>
          <div
            className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px overflow-clip relative"
            data-node-id="1:872"
            data-name="Newsletter form"
          >
            <p
              className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
              data-node-id="1:873"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              Your email address
            </p>
            <div
              className="bg-[#fffdfa] content-stretch flex gap-[14px] h-[60px] items-center overflow-clip px-[20px] relative rounded-[12px] shrink-0 w-full"
              data-node-id="1:874"
              data-name="Email field"
            >
              <div
                className="relative shrink-0 size-[21px]"
                data-node-id="1:875"
                data-name="mail"
              >
                <img
                  alt=""
                  className="absolute block inset-0 max-w-none size-full"
                  src={imgMail}
                />
              </div>
              <p
                className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[20px] relative shrink-0 text-[#56646c] text-[14px] whitespace-nowrap"
                data-node-id="1:877"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                you@example.com
              </p>
            </div>
            <div
              className="content-stretch flex gap-[12px] items-start overflow-clip relative shrink-0 w-full"
              data-node-id="1:878"
              data-name="Newsletter consent"
            >
              <div
                className="border border-[#081d2b] border-solid relative rounded-[4px] shrink-0 size-[18px]"
                data-node-id="1:879"
                data-name="Unchecked consent"
              />
              <p
                className="[word-break:break-word] flex-[1_0_0] font-['Mona_Sans:Regular'] font-normal leading-[20px] min-w-px relative text-[#081d2b] text-[14px]"
                data-node-id="1:880"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                I’d like to receive KSE insights by email. I can unsubscribe at
                any time.
              </p>
            </div>
            <div
              className="bg-[#0d2b42] content-stretch flex h-[48px] items-center justify-center px-[24px] relative rounded-[999px] shrink-0 w-[230px]"
              data-node-id="1:881"
              data-name="Editorial action"
            >
              <p
                className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#fffdfa] text-[14px] whitespace-nowrap"
                data-node-id="I1:881;33:286"
              >
                Subscribe to Insight
              </p>
            </div>
            <p
              className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[20px] min-w-full relative shrink-0 text-[#56646c] text-[14px] w-[min-content]"
              data-node-id="1:882"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              Useful ideas. A fresh perspective. No noise.
            </p>
          </div>
        </div>
        <div
          className="bg-[#42b9fa] content-stretch flex gap-[50px] items-center overflow-clip px-[80px] py-[88px] relative shrink-0 w-full"
          data-node-id="1:883"
          data-name="Your next conversation"
        >
          <div
            className="absolute left-[900px] size-[800px] top-[-200px]"
            data-node-id="1:884"
            data-name="Atmospheric light"
          >
            <div className="absolute inset-[-12.5%]">
              <img
                alt=""
                className="block max-w-none size-full"
                src={imgAtmosphericLight}
              />
            </div>
          </div>
          <div
            className="content-stretch flex flex-col gap-[28px] items-start overflow-clip relative shrink-0 w-[760px]"
            data-node-id="1:885"
            data-name="Consultation invitation"
          >
            <p
              className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap"
              data-node-id="1:886"
            >
              TURN PERSPECTIVE INTO A PLAN
            </p>
            <div
              className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[86px] tracking-[-3.44px] w-[min-content]"
              data-node-id="1:887"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              <p className="leading-[1.04] mb-0">Your next</p>
              <p className="leading-[1.04] mb-0">chapter deserves</p>
              <p className="leading-[1.04]">a clearer plan.</p>
            </div>
            <div
              className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-[610px]"
              data-node-id="1:888"
              data-name="Consultation description"
            >
              <p
                className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[18px] w-full"
                data-node-id="1:889"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Reading is a beginning. Let’s talk about what these ideas mean
                for your life, your priorities and the future you want to build.
              </p>
            </div>
            <div
              className="bg-[#0d2b42] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0"
              data-node-id="1:890"
              data-name="Book a Session"
            >
              <div
                className="[word-break:break-word] flex flex-col font-['Mona_Sans:Medium'] font-medium justify-center leading-[0] relative shrink-0 text-[15px] text-center text-white whitespace-nowrap"
                data-node-id="I1:890;30:2199"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                <p className="leading-[20px]">Book a Session</p>
              </div>
            </div>
          </div>
          <div
            className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-center min-w-px overflow-clip relative"
            data-node-id="1:891"
            data-name="Possibility sculpture"
          >
            <div
              className="h-[370px] relative shrink-0 w-[440px]"
              data-node-id="1:892"
              data-name="Connection landmark"
            >
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src={imgConnectionLandmark}
              />
            </div>
            <p
              className="[word-break:break-word] font-['Special_Elite:Regular'] leading-[1.4] not-italic relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap"
              data-node-id="1:893"
            >
              CLARITY IS ONLY THE BEGINNING.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
