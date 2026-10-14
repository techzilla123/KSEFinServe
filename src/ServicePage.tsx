import { useState, useEffect, useRef } from "react"

const assetPathPrefix = "/assets"
const imgDotCanvas = `${assetPathPrefix}/8dd6d.png`
const imgPhoto = `${assetPathPrefix}/99851.png`
const imgPhoto1 = `${assetPathPrefix}/ee9ac.png`
const imgPhasePhoto = `${assetPathPrefix}/baec8.png`
const imgPhasePhoto1 = `${assetPathPrefix}/1f783.png`
const imgPhasePhoto2 = `${assetPathPrefix}/8b717.png`
const imgGlowLeft = `${assetPathPrefix}/7faec.svg`
const imgGlowRight = `${assetPathPrefix}/119e7.svg`
const imgGlowPink = `${assetPathPrefix}/b8ad7.svg`
const imgBrowserChrome = `${assetPathPrefix}/2c8c9.svg`
const imgStar = `${assetPathPrefix}/07871.svg`
const imgEllipse = `${assetPathPrefix}/16218.svg`
const imgDot1 = `${assetPathPrefix}/ef886.svg`
const imgDot2 = `${assetPathPrefix}/87b21.svg`
const imgScrollHint = `${assetPathPrefix}/8dc6f.svg`
const imgAmbient = `${assetPathPrefix}/092f2.svg`
const imgGlow = `${assetPathPrefix}/c3622.svg`
const imgMessageCircle = `${assetPathPrefix}/690be.svg`
const imgPieChart = `${assetPathPrefix}/197e3.svg`
const imgCompass = `${assetPathPrefix}/c1cf5.svg`
const imgSliders = `${assetPathPrefix}/0f129.svg`
const imgGitBranch = `${assetPathPrefix}/3de5f.svg`
const imgCheckCircle = `${assetPathPrefix}/86fb7.svg`
const imgGlow1 = `${assetPathPrefix}/60ccb.svg`
const imgGlow2 = `${assetPathPrefix}/f4038.svg`
const imgAmbient1 = `${assetPathPrefix}/156b5.svg`
const imgList = `${assetPathPrefix}/cd4bc.svg`
const imgUsers = `${assetPathPrefix}/35f2d.svg`
const imgRefreshCw = `${assetPathPrefix}/18a53.svg`
const imgAmbient2 = `${assetPathPrefix}/d4346.svg`

export default function KseFinServeOurProcess() {
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const rootRef = useRef<HTMLDivElement>(null)
  const [activePhase, setActivePhase] = useState(0)
  const [phasePaused, setPhasePaused] = useState(false)
  const PHASE_COUNT = 3
  const PHASE_DURATION = 15000

  useEffect(() => {
    if (phasePaused) return
    const t = setTimeout(() => {
      setActivePhase((p) => (p + 1) % PHASE_COUNT)
    }, PHASE_DURATION)
    return () => clearTimeout(t)
  }, [activePhase, phasePaused])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    const els = rootRef.current?.querySelectorAll('[data-reveal]')
    els?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className="service-page bg-[#f0ede6] content-stretch flex flex-col items-start relative size-full"
      data-node-id="1:8"
      data-name="KSEFinServe — Our process"
    >
      <div
        className="bg-[#f0ede6] content-stretch flex flex-col h-[860px] items-center overflow-clip relative shrink-0 w-full"
        data-node-id="1:9"
        data-name="Hero section"
        data-reveal
      >
        {/* Dot texture spans the full hero width on any screen. */}
        <div
          className="absolute h-[860px] left-0 opacity-30 top-0 w-full"
          data-node-id="1:10"
          data-name="dot-canvas"
        >
          <div
            aria-hidden
            className="absolute bg-size-[216.00000858306885px_161.2800064086914px] bg-top-left inset-0 opacity-6 pointer-events-none"
            style={{ backgroundImage: `url("${imgDotCanvas}")` }}
          />
        </div>
        {/* Decoration stage: keeps every hero decoration at its exact Figma
            position on any screen width by pinning the 1440px design canvas
            to the centre of the hero instead of letting pixel offsets drift. */}
        <div className="hero-stage" aria-hidden="true">
        <div
          className="absolute left-[-120px] size-[500px] top-[180px]"
          data-node-id="1:11"
          data-name="glow-left"
        >
          <div className="absolute inset-[-8%]">
            <img
              alt=""
              className="block max-w-none size-full"
              src={imgGlowLeft}
            />
          </div>
        </div>
        <div
          className="absolute left-[1080px] size-[420px] top-[100px]"
          data-node-id="1:12"
          data-name="glow-right"
        >
          <div className="absolute inset-[-14.29%]">
            <img
              alt=""
              className="block max-w-none size-full"
              src={imgGlowRight}
            />
          </div>
        </div>
        <div
          className="absolute left-[900px] size-[340px] top-[500px]"
          data-node-id="1:13"
          data-name="glow-pink"
        >
          <div className="absolute inset-[-14.71%]">
            <img
              alt=""
              className="block max-w-none size-full"
              src={imgGlowPink}
            />
          </div>
        </div>
        <div
          className="-translate-x-1/2 absolute bg-white border border-[#e0dad0] border-solid content-stretch flex h-[28px] items-center justify-center left-1/2 rounded-[100px] top-[58px] w-[300px]"
          data-node-id="1:14"
          data-name="eyebrow"
        >
          <p
            className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[#94702f] text-[11px] tracking-[1.4px] uppercase whitespace-nowrap"
            data-node-id="1:15"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            KSEFinServe · Wealth Guidance
          </p>
        </div>
        <div
          className="-translate-x-1/2 [word-break:break-word] absolute content-stretch flex flex-col gap-[10px] items-center left-1/2 text-center top-[108px] w-[700px] whitespace-nowrap"
          data-node-id="1:16"
          data-name="hero-headline"
        >
          <div
            className="font-['Mona_Sans:Bold'] font-bold leading-[0] relative shrink-0 text-[#081d2b] text-[68px] tracking-[-2.04px]"
            data-node-id="1:17"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            <p className="leading-[normal] mb-0">Your wealth,</p>
            <p className="leading-[normal] text-[#c9a963]">made clear.</p>
          </div>
          <p
            className="font-['Mona_Sans:Light'] font-light leading-[1.6] relative shrink-0 text-[#56646c] text-[16px]"
            data-node-id="1:18"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            Clarity · Growth · Impact
          </p>
        </div>
        <div
          className="-translate-x-1/2 absolute bg-[#081d2b] content-stretch flex flex-col h-[340px] items-start left-1/2 overflow-clip rounded-[24px] shadow-[0px_24px_60px_-8px_rgba(0,0,0,0.2)] top-[280px] w-[520px]"
          data-node-id="1:19"
          data-name="hero-main-card"
        >
          <div
            className="h-[340px] relative shrink-0 w-[520px]"
            data-node-id="1:20"
            data-name="hero-photo"
          >
            <img
              alt=""
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
              src={imgDotCanvas}
            />
          </div>
          <div
            className="absolute bg-gradient-to-b content-stretch flex flex-col from-[30%] from-[rgba(8,29,43,0)] gap-[12px] h-[340px] items-start left-0 pb-[28px] pt-[24px] px-[28px] to-[rgba(8,29,43,0.9)] top-0 w-[520px]"
            data-node-id="1:21"
            data-name="card-overlay"
          >
            <div
              className="absolute bg-[#c9a963] content-stretch flex items-start left-[28px] px-[12px] py-[6px] rounded-[100px] top-[264px]"
              data-node-id="1:22"
              data-name="card-badge"
            >
              <p
                className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[11px] tracking-[0.8px] uppercase whitespace-nowrap"
                data-node-id="1:23"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Wealth Strategy
              </p>
            </div>
            <p
              className="[word-break:break-word] absolute font-['Oswald:SemiBold'] font-semibold leading-[1.08] left-[28px] text-[36px] text-white top-[196px] w-[340px]"
              data-node-id="1:24"
            >
              BUILD WEALTH WITH CLARITY.
            </p>
          </div>
          <div
            className="absolute h-[10px] left-[16px] top-[14px] w-[42px]"
            data-node-id="1:25"
            data-name="browser-chrome"
          >
            <img
              alt=""
              className="absolute block inset-0 max-w-none size-full"
              src={imgBrowserChrome}
            />
          </div>
        </div>
        <div
          className="absolute flex h-[190.918px] items-center justify-center left-[1013.02px] top-[300px] w-[231.741px]"
          data-node-id="1:29"
        >
          <div className="flex-none rotate-4">
            <div
              className="bg-white content-stretch drop-shadow-[0px_12px_16px_rgba(0,0,0,0.09)] flex flex-col gap-[8px] items-start p-[20px] relative rounded-[18px] w-[220px]"
              data-name="float-card-1"
            >
              <p
                className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[#94702f] text-[11px] tracking-[0.8px] uppercase whitespace-nowrap"
                data-node-id="1:30"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                1,000+
              </p>
              <p
                className="[word-break:break-word] font-['Mona_Sans:Bold'] font-bold leading-[normal] min-w-full relative shrink-0 text-[#081d2b] text-[26px] w-[min-content]"
                data-node-id="1:31"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Advisors developed
              </p>
              <p
                className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[normal] relative shrink-0 text-[#56646c] text-[13px] whitespace-nowrap"
                data-node-id="1:32"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Across North America
              </p>
              <div
                className="bg-[#e5e7eb] content-stretch flex h-[4px] items-start relative rounded-[2px] shrink-0 w-full"
                data-node-id="1:33"
                data-name="progress"
              >
                <div
                  className="bg-[#c9a963] h-[4px] relative rounded-[2px] shrink-0 w-[160px]"
                  data-node-id="1:34"
                  data-name="fill"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute flex h-[73.123px] items-center justify-center left-[168px] top-[334.77px] w-[179.108px]"
          data-node-id="1:35"
        >
          <div className="-rotate-3 flex-none">
            <div
              className="bg-[#d4bcfa] content-stretch drop-shadow-[0px_8px_10px_rgba(0,0,0,0.08)] flex gap-[12px] items-center px-[18px] py-[14px] relative rounded-[16px]"
              data-name="float-card-2"
            >
              <div
                className="bg-[#7c3aed] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]"
                data-node-id="1:36"
                data-name="icon-wrap"
              >
                <div
                  className="relative shrink-0 size-[18px]"
                  data-node-id="1:37"
                  data-name="star"
                >
                  <img
                    alt=""
                    className="absolute block inset-0 max-w-none size-full"
                    src={imgStar}
                  />
                </div>
              </div>
              <div
                className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap"
                data-node-id="1:39"
                data-name="Frame"
              >
                <p
                  className="font-['Mona_Sans:SemiBold'] font-semibold relative shrink-0 text-[#081d2b] text-[13px]"
                  data-node-id="1:40"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Discovery call
                </p>
                <p
                  className="font-['Mona_Sans:Regular'] font-normal relative shrink-0 text-[#4c1d95] text-[11px]"
                  data-node-id="1:41"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Start your journey
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute flex h-[120.91px] items-center justify-center left-[136.51px] top-[490px] w-[203.857px]"
          data-node-id="1:42"
        >
          <div className="flex-none rotate-2">
            <div
              className="bg-[#dfeff8] content-stretch drop-shadow-[0px_6px_8px_rgba(0,0,0,0.07)] flex flex-col gap-[10px] items-start p-[18px] relative rounded-[16px] w-[200px]"
              data-name="float-card-3"
            >
              <p
                className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[#0077b5] text-[11px] tracking-[0.8px] uppercase whitespace-nowrap"
                data-node-id="1:43"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Phase 03
              </p>
              <p
                className="[word-break:break-word] font-['Mona_Sans:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[18px] whitespace-nowrap"
                data-node-id="1:44"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Execution
              </p>
              <div
                className="content-stretch flex gap-[6px] items-center relative shrink-0"
                data-node-id="1:45"
                data-name="Frame"
              >
                <div
                  className="relative shrink-0 size-[8px]"
                  data-node-id="1:46"
                  data-name="Ellipse"
                >
                  <img
                    alt=""
                    className="absolute block inset-0 max-w-none size-full"
                    src={imgEllipse}
                  />
                </div>
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[normal] relative shrink-0 text-[#56646c] text-[12px] whitespace-nowrap"
                  data-node-id="1:47"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Plan in motion
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute flex h-[137.9px] items-center justify-center left-[1048px] top-[483.02px] w-[204.45px]"
          data-node-id="1:48"
        >
          <div className="-rotate-2 flex-none">
            <div
              className="[word-break:break-word] bg-[#081d2b] content-stretch drop-shadow-[0px_12px_14px_rgba(0,0,0,0.19)] flex flex-col gap-[8px] items-start leading-[normal] p-[20px] relative rounded-[16px] w-[200px] whitespace-nowrap"
              data-name="float-card-4"
            >
              <p
                className="font-['Mona_Sans:Medium'] font-medium relative shrink-0 text-[#c9a963] text-[11px] tracking-[0.8px] uppercase"
                data-node-id="1:49"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Annual production
              </p>
              <p
                className="font-['Mona_Sans:Bold'] font-bold relative shrink-0 text-[#c9a963] text-[30px]"
                data-node-id="1:50"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                $9M+
              </p>
              <p
                className="font-['Mona_Sans:Regular'] font-normal relative shrink-0 text-[12px] text-[rgba(255,255,255,0.7)]"
                data-node-id="1:51"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Team milestone
              </p>
            </div>
          </div>
        </div>
        <div
          className="absolute border-3 border-[#c9a963] border-solid left-[610px] opacity-40 rounded-[40px] size-[80px] top-[270px]"
          data-node-id="1:52"
          data-name="arc-1"
        />
        <div
          className="absolute border-2 border-[#42b9fa] border-solid left-[750px] opacity-50 rounded-[28px] size-[56px] top-[258px]"
          data-node-id="1:53"
          data-name="arc-2"
        />
        <div
          className="absolute border-2 border-[#d4bcfa] border-solid left-[618px] opacity-50 rounded-[32px] size-[64px] top-[278px]"
          data-node-id="1:54"
          data-name="arc-3"
        />
        <div
          className="absolute flex items-center justify-center left-[646.51px] size-[16.971px] top-[255px]"
          data-node-id="1:55"
        >
          <div className="flex-none rotate-45">
            <div
              className="bg-[#c9a963] opacity-70 relative rounded-[2px] size-[12px]"
              data-name="diamond-deco"
            />
          </div>
        </div>
        <div
          className="absolute flex items-center justify-center left-[714.34px] size-[11.314px] top-[620px]"
          data-node-id="1:56"
        >
          <div className="flex-none rotate-45">
            <div
              className="bg-[#42b9fa] opacity-60 relative rounded-[2px] size-[8px]"
              data-name="diamond-deco-2"
            />
          </div>
        </div>
        <div
          className="absolute left-[490px] size-[8px] top-[630px]"
          data-node-id="1:57"
          data-name="dot-1"
        >
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src={imgDot1}
          />
        </div>
        <div
          className="absolute left-[946px] size-[6px] top-[282px]"
          data-node-id="1:58"
          data-name="dot-2"
        >
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src={imgDot2}
          />
        </div>
        </div>
        <div
          className="-translate-x-1/2 absolute content-stretch flex gap-[16px] items-center justify-center left-1/2 top-[762px]"
          data-node-id="1:59"
          data-name="hero-ctas"
        >
          <a
            href="#contact"
            className="bg-[#081d2b] content-stretch drop-shadow-[0px_8px_10px_rgba(8,29,43,0.2)] flex flex-col items-center justify-center px-[28px] py-[14px] relative rounded-[100px] shrink-0 no-underline"
            data-node-id="1:60"
            data-name="primary-cta"
          >
            <p
              className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[15px] text-white whitespace-nowrap"
              data-node-id="1:61"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              Book a Session
            </p>
          </a>
          <a
            href="#process"
            className="border border-[rgba(201,169,99,0.4)] border-solid content-stretch flex flex-col items-center justify-center px-[24px] py-[14px] relative rounded-[100px] shrink-0 no-underline"
            data-node-id="1:62"
            data-name="secondary-cta"
          >
            <p
              className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[#56646c] text-[15px] whitespace-nowrap"
              data-node-id="1:63"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              Explore the process ↓
            </p>
          </a>
        </div>
        <div
          className="-translate-x-1/2 absolute h-[12px] left-1/2 top-[824px] w-[4px]"
          data-node-id="1:64"
          data-name="scroll-hint"
        >
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src={imgScrollHint}
          />
        </div>
      </div>
      <div
        className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full"
        data-node-id="1:67"
        data-name="Services section"
        data-reveal
      >
        <div
          className="bg-[#081d2b] content-stretch flex flex-col gap-[16px] items-center overflow-clip pb-[48px] pt-[72px] px-[80px] relative shrink-0 w-full"
          data-node-id="1:68"
          data-name="services-header"
        >
          <div
            className="absolute left-[600px] size-[600px] top-[-100px]"
            data-node-id="1:69"
            data-name="ambient"
          >
            <div className="absolute inset-[-6.67%]">
              <img
                alt=""
                className="block max-w-none size-full"
                src={imgAmbient}
              />
            </div>
          </div>
          <div
            className="content-stretch flex gap-[12px] items-center relative shrink-0"
            data-node-id="1:70"
            data-name="eyebrow-row"
          >
            <div
              className="bg-[#c9a963] h-[2px] relative shrink-0 w-[24px]"
              data-node-id="1:71"
              data-name="Rectangle"
            />
            <p
              className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[#c9a963] text-[12px] tracking-[1.4px] uppercase whitespace-nowrap"
              data-node-id="1:72"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              How we work together
            </p>
            <div
              className="bg-[#c9a963] h-[2px] relative shrink-0 w-[24px]"
              data-node-id="1:73"
              data-name="Rectangle"
            />
          </div>
          <div
            className="[word-break:break-word] font-['Mona_Sans:Bold'] font-bold leading-[0] relative shrink-0 text-[58px] text-center text-white tracking-[-1.45px] w-[860px]"
            data-node-id="1:74"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            <p className="leading-[normal] mb-0">Two paths.</p>
            <p className="leading-[normal]">Both lead to clarity.</p>
          </div>
          <p
            className="[word-break:break-word] font-['Mona_Sans:Light'] font-light leading-[1.6] relative shrink-0 text-[18px] text-[rgba(255,255,255,0.7)] text-center w-[600px]"
            data-node-id="1:75"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >{`Whether you're building your own wealth or building a business helping others, the foundation is the same: clarity, purpose, and a plan.`}</p>
        </div>
        <div
          className="content-stretch flex items-start overflow-clip relative shrink-0 w-full"
          data-node-id="1:76"
          data-name="service-cards"
        >
          <div
            className="bg-[#c9a963] content-stretch flex flex-[1_0_0] flex-col h-[680px] items-start min-w-px overflow-clip relative"
            data-node-id="1:77"
            data-name="wealth-card"
          >
            <div
              className="absolute h-[680px] left-0 top-0 w-[720px]"
              data-node-id="1:78"
              data-name="photo"
            >
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src={imgPhoto}
              />
            </div>
            <div
              className="absolute bg-gradient-to-r from-[rgba(201,169,99,0.56)] h-[680px] left-0 to-[rgba(8,29,43,0.8)] top-0 w-[720px]"
              data-node-id="1:79"
              data-name="overlay"
            />
            <p
              className="[word-break:break-word] absolute font-['Mona_Sans:ExtraBold'] font-extrabold inset-[340px_485px_0_0] leading-none overflow-hidden text-[240px] text-[rgba(255,255,255,0.04)] text-ellipsis whitespace-nowrap"
              data-node-id="1:80"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              01
            </p>
            <div
              className="absolute content-stretch flex flex-col gap-[28px] h-[680px] items-start left-0 p-[60px] top-0 w-[720px]"
              data-node-id="1:81"
              data-name="card-content"
            >
              <div
                className="bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.27)] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[100px] shrink-0"
                data-node-id="1:82"
                data-name="tag"
              >
                <p
                  className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[11px] text-white tracking-[1px] uppercase whitespace-nowrap"
                  data-node-id="1:83"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Wealth Guidance
                </p>
              </div>
              <div
                className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[72px] text-white w-[540px]"
                data-node-id="1:84"
              >
                <p className="leading-[normal] mb-0">BUILD</p>
                <p className="leading-[normal] mb-0">WEALTH</p>
                <p className="leading-[normal] mb-0">WITH</p>
                <p className="leading-[normal]">CLARITY.</p>
              </div>
              <p
                className="[word-break:break-word] font-['Mona_Sans:Light'] font-light leading-[1.65] relative shrink-0 text-[17px] text-[rgba(255,255,255,0.8)] w-[460px]"
                data-node-id="1:85"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                For individuals, professionals and families planning for
                retirement, growing their assets, and making more confident
                financial decisions.
              </p>
              <div
                className="content-start flex flex-wrap gap-[10px] items-start relative shrink-0 w-[480px]"
                data-node-id="1:86"
                data-name="feature-pills"
              >
                <div
                  className="bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.19)] border-solid content-stretch flex items-start px-[14px] py-[8px] relative rounded-[100px] shrink-0"
                  data-node-id="1:87"
                  data-name="Frame"
                >
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="1:88"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Retirement planning
                  </p>
                </div>
                <div
                  className="bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.19)] border-solid content-stretch flex items-start px-[14px] py-[8px] relative rounded-[100px] shrink-0"
                  data-node-id="1:89"
                  data-name="Frame"
                >
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="1:90"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Wealth growth
                  </p>
                </div>
                <div
                  className="bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.19)] border-solid content-stretch flex items-start px-[14px] py-[8px] relative rounded-[100px] shrink-0"
                  data-node-id="1:91"
                  data-name="Frame"
                >
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="1:92"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Financial clarity
                  </p>
                </div>
              </div>
              <div
                className="content-stretch flex gap-[16px] items-center relative shrink-0"
                data-node-id="1:93"
                data-name="cta-row"
              >
                <div
                  className="bg-white content-stretch flex flex-col items-center justify-center px-[28px] py-[14px] relative rounded-[100px] shrink-0"
                  data-node-id="1:94"
                  data-name="Frame"
                >
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                    data-node-id="1:95"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Book a Strategy Session
                  </p>
                </div>
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap"
                  data-node-id="1:96"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Learn more →
                </p>
              </div>
            </div>
            <div
              className="absolute flex h-[133.818px] items-center justify-center left-[529.55px] top-[60px] w-[159.628px]"
              data-node-id="1:97"
            >
              <div className="flex-none rotate-6">
                <div
                  className="[word-break:break-word] bg-white content-stretch drop-shadow-[0px_8px_8px_rgba(0,0,0,0.13)] flex flex-col gap-[10px] items-start leading-[normal] p-[16px] relative rounded-[16px] w-[148px]"
                  data-name="float-accent"
                >
                  <p
                    className="font-['Mona_Sans:Bold'] font-bold relative shrink-0 text-[#c9a963] text-[32px] whitespace-nowrap"
                    data-node-id="1:98"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    7-fig
                  </p>
                  <p
                    className="font-['Mona_Sans:Regular'] font-normal min-w-full relative shrink-0 text-[#56646c] text-[11px] w-[min-content]"
                    data-node-id="1:99"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Personal annual production
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="bg-[#0d2b42] content-stretch flex flex-[1_0_0] flex-col h-[680px] items-start min-w-px overflow-clip relative"
            data-node-id="1:100"
            data-name="biz-card"
          >
            <div
              className="absolute h-[680px] left-0 top-0 w-[720px]"
              data-node-id="1:101"
              data-name="photo"
            >
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src={imgPhoto1}
              />
            </div>
            <div
              className="absolute bg-gradient-to-b from-[rgba(13,43,66,0.5)] h-[680px] left-0 to-[rgba(13,43,66,0.91)] top-0 w-[720px]"
              data-node-id="1:102"
              data-name="overlay"
            />
            <div
              className="absolute bg-[#42b9fa] h-[680px] left-0 top-0 w-[6px]"
              data-node-id="1:103"
              data-name="accent-bar"
            />
            <p
              className="[word-break:break-word] absolute font-['Mona_Sans:ExtraBold'] font-extrabold inset-[340px_451px_0_0] leading-none overflow-hidden text-[240px] text-[rgba(255,255,255,0.03)] text-ellipsis whitespace-nowrap"
              data-node-id="1:104"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              02
            </p>
            <div
              className="absolute content-stretch flex flex-col gap-[28px] h-[680px] items-start left-0 p-[60px] top-0 w-[720px]"
              data-node-id="1:105"
              data-name="card-content"
            >
              <div
                className="bg-[rgba(66,185,250,0.13)] border border-[rgba(66,185,250,0.27)] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[100px] shrink-0"
                data-node-id="1:106"
                data-name="tag"
              >
                <p
                  className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#42b9fa] text-[11px] tracking-[1px] uppercase whitespace-nowrap"
                  data-node-id="1:107"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Business Development
                </p>
              </div>
              <div
                className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[72px] text-white w-[540px]"
                data-node-id="1:108"
              >
                <p className="leading-[normal] mb-0">BUILD</p>
                <p className="leading-[normal] mb-0">LEADERS</p>
                <p className="leading-[normal] mb-0">WITH</p>
                <p className="leading-[normal]">PURPOSE.</p>
              </div>
              <p
                className="[word-break:break-word] font-['Mona_Sans:Light'] font-light leading-[1.65] relative shrink-0 text-[17px] text-[rgba(255,255,255,0.8)] w-[460px]"
                data-node-id="1:109"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >{`For purpose-driven professionals ready to launch or grow a financial services career. Mentorship, systems, and the support of someone who's done it.`}</p>
              <div
                className="content-start flex flex-wrap gap-[10px] items-start relative shrink-0 w-[480px]"
                data-node-id="1:110"
                data-name="feature-pills"
              >
                <div
                  className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.15)] border-solid content-stretch flex items-start px-[14px] py-[8px] relative rounded-[100px] shrink-0"
                  data-node-id="1:111"
                  data-name="Frame"
                >
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="1:112"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Mentorship
                  </p>
                </div>
                <div
                  className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.15)] border-solid content-stretch flex items-start px-[14px] py-[8px] relative rounded-[100px] shrink-0"
                  data-node-id="1:113"
                  data-name="Frame"
                >
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="1:114"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Business systems
                  </p>
                </div>
                <div
                  className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.15)] border-solid content-stretch flex items-start px-[14px] py-[8px] relative rounded-[100px] shrink-0"
                  data-node-id="1:115"
                  data-name="Frame"
                >
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="1:116"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Career path
                  </p>
                </div>
              </div>
              <div
                className="content-stretch flex gap-[16px] items-center relative shrink-0"
                data-node-id="1:117"
                data-name="cta-row"
              >
                <div
                  className="bg-[#42b9fa] content-stretch flex flex-col items-center justify-center px-[28px] py-[14px] relative rounded-[100px] shrink-0"
                  data-node-id="1:118"
                  data-name="Frame"
                >
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                    data-node-id="1:119"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Explore the opportunity
                  </p>
                </div>
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.7)] whitespace-nowrap"
                  data-node-id="1:120"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Learn more →
                </p>
              </div>
            </div>
            <div
              className="absolute flex h-[115.507px] items-center justify-center left-[540px] top-[47.1px] w-[156.414px]"
              data-node-id="1:121"
            >
              <div className="-rotate-5 flex-none">
                <div
                  className="[word-break:break-word] bg-[#081d2b] border border-[rgba(66,185,250,0.2)] border-solid content-stretch drop-shadow-[0px_8px_8px_rgba(0,0,0,0.19)] flex flex-col gap-[10px] items-start leading-[normal] p-[16px] relative rounded-[16px] w-[148px] whitespace-nowrap"
                  data-name="float-accent-2"
                >
                  <p
                    className="font-['Mona_Sans:Bold'] font-bold relative shrink-0 text-[#42b9fa] text-[32px]"
                    data-node-id="1:122"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    1K+
                  </p>
                  <p
                    className="font-['Mona_Sans:Regular'] font-normal relative shrink-0 text-[11px] text-[rgba(255,255,255,0.7)]"
                    data-node-id="1:123"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Advisors developed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-[#c9a963] content-stretch flex items-center justify-between overflow-clip px-[80px] py-[32px] relative shrink-0 w-full"
          data-node-id="1:124"
          data-name="services-bottom-bar"
        >
          <p
            className="[word-break:break-word] font-['Mona_Sans:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[22px] whitespace-nowrap"
            data-node-id="1:125"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            Helping You Multiply What Matters.
          </p>
          <a
            href="#contact"
            className="bg-[#1a1a1a] content-stretch flex items-center justify-center overflow-clip px-[12px] py-[13px] relative rounded-[100px] shrink-0 no-underline"
            data-node-id="1:126"
            data-name="Get in touch"
          >
            <p
              className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap"
              data-node-id="I1:126;37:415"
            >
              Get in Touch
            </p>
          </a>
        </div>
      </div>
      <div
        className="bg-[#f0ede6] content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full"
        data-node-id="1:127"
        data-name="Process section"
        data-reveal
      >
        <div
          className="bg-[#f0ede6] content-stretch flex flex-col gap-[20px] items-start overflow-clip pb-[60px] pt-[80px] px-[80px] relative shrink-0 w-full"
          data-node-id="1:128"
          data-name="process-header"
        >
          <div
            className="content-stretch flex gap-[12px] items-center relative shrink-0"
            data-node-id="1:129"
            data-name="eyebrow-row"
          >
            <div
              className="bg-[#c9a963] h-[2px] relative shrink-0 w-[24px]"
              data-node-id="1:130"
              data-name="Rectangle"
            />
            <p
              className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[#94702f] text-[12px] tracking-[1.4px] uppercase whitespace-nowrap"
              data-node-id="1:131"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              Our process — three phases
            </p>
          </div>
          <div
            className="[word-break:break-word] content-stretch flex items-end justify-between relative shrink-0 w-full"
            data-node-id="1:132"
            data-name="heading-row"
          >
            <div
              className="font-['Mona_Sans:Bold'] font-bold leading-[0] relative shrink-0 text-[#081d2b] text-[62px] tracking-[-1.55px] w-[700px]"
              data-node-id="1:133"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              <p className="leading-[normal] mb-0">One conversation.</p>
              <p className="leading-[normal]">Three clear phases.</p>
            </div>
            <p
              className="font-['Mona_Sans:Light'] font-light leading-[1.65] relative shrink-0 text-[#56646c] text-[16px] w-[340px]"
              data-node-id="1:134"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              A thoughtful path designed around your situation, not a
              one-size-fits-all prescription.
            </p>
          </div>
          <div
            className="bg-[#e0dad0] content-stretch flex h-[4px] items-start relative rounded-[2px] shrink-0 w-full"
            data-node-id="1:135"
            data-name="phase-track"
          >
            <div
              key={activePhase}
              className="bg-[#c9a963] h-[4px] relative rounded-[2px] shrink-0 track-fill-anim"
              data-node-id="1:136"
              data-name="track-fill"
              style={{
                animationPlayState: phasePaused ? "paused" : "running",
                ["--track-from" as string]: `${(activePhase / PHASE_COUNT) * 100}%`,
                ["--track-to" as string]: `${((activePhase + 1) / PHASE_COUNT) * 100}%`,
              }}
            />
          </div>
          <div
            className="[word-break:break-word] content-stretch flex items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap"
            data-node-id="1:137"
            data-name="phase-labels"
          >
            <button
              type="button"
              className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative phase-label-btn"
              data-node-id="1:138"
              data-name="label"
              onClick={() => setActivePhase(0)}
            >
              <p
                className={`font-['Mona_Sans:Bold'] font-bold relative shrink-0 text-[20px] ${activePhase === 0 ? "text-[#c9a963]" : "text-[#94702f]"}`}
                data-node-id="1:139"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                01
              </p>
              <p
                className={`font-['Mona_Sans:Regular'] font-normal relative shrink-0 text-[13px] ${activePhase === 0 ? "text-[#081d2b]" : "text-[#56646c]"}`}
                data-node-id="1:140"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Discovery
              </p>
            </button>
            <button
              type="button"
              className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-center min-w-px relative phase-label-btn"
              data-node-id="1:141"
              data-name="label"
              onClick={() => setActivePhase(1)}
            >
              <p
                className={`font-['Mona_Sans:Bold'] font-bold relative shrink-0 text-[20px] ${activePhase === 1 ? "text-[#c9a963]" : "text-[#94702f]"}`}
                data-node-id="1:142"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                02
              </p>
              <p
                className={`font-['Mona_Sans:Regular'] font-normal relative shrink-0 text-[13px] ${activePhase === 1 ? "text-[#081d2b]" : "text-[#56646c]"}`}
                data-node-id="1:143"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Strategy
              </p>
            </button>
            <button
              type="button"
              className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-end min-w-px relative phase-label-btn"
              data-node-id="1:144"
              data-name="label"
              onClick={() => setActivePhase(2)}
            >
              <p
                className={`font-['Mona_Sans:Bold'] font-bold relative shrink-0 text-[20px] ${activePhase === 2 ? "text-[#c9a963]" : "text-[#94702f]"}`}
                data-node-id="1:145"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                03
              </p>
              <p
                className={`font-['Mona_Sans:Regular'] font-normal relative shrink-0 text-[13px] ${activePhase === 2 ? "text-[#081d2b]" : "text-[#56646c]"}`}
                data-node-id="1:146"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Execution
              </p>
            </button>
          </div>
        </div>
        <div className="phase-carousel">
          {activePhase === 0 && (
        <div
          className="bg-[#081d2b] content-stretch flex h-[560px] items-start overflow-clip relative shrink-0 w-full"
          data-node-id="1:147"
          data-name="Phase 01 - Discovery"
        >
          <div
            className="bg-[#0d2b42] content-stretch flex flex-col gap-[28px] items-start overflow-clip p-[60px] relative shrink-0 size-[560px]"
            data-node-id="1:148"
            data-name="phase-left"
          >
            <div
              className="absolute border border-[rgba(201,169,99,0.13)] border-solid left-[-60px] rounded-[170px] size-[340px] top-[-60px]"
              data-node-id="1:149"
              data-name="orbit"
            />
            <div
              className="absolute border border-[rgba(201,169,99,0.08)] border-solid left-[-20px] rounded-[130px] size-[260px] top-[-20px]"
              data-node-id="1:150"
              data-name="orbit-2"
            />
            <div
              className="absolute left-[-40px] size-[300px] top-[-40px]"
              data-node-id="1:151"
              data-name="glow"
            >
              <img
                alt=""
                className="absolute block inset-0 max-w-none size-full"
                src={imgGlow}
              />
            </div>
            <p
              className="[word-break:break-word] absolute font-['Mona_Sans:ExtraBold'] font-extrabold leading-none left-[20px] text-[120px] text-[rgba(255,255,255,0.02)] top-[320px] whitespace-nowrap"
              data-node-id="1:152"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              01
            </p>
            <div
              className="bg-[rgba(201,169,99,0.13)] border border-[rgba(201,169,99,0.27)] border-solid content-stretch flex items-start px-[14px] py-[8px] relative rounded-[100px] shrink-0"
              data-node-id="1:153"
              data-name="phase-tag"
            >
              <p
                className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#c9a963] text-[11px] tracking-[1px] uppercase whitespace-nowrap"
                data-node-id="1:154"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Phase One
              </p>
            </div>
            <div
              className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[52px] text-white w-[420px]"
              data-node-id="1:155"
            >
              <p className="leading-[normal] mb-0">FIRST,</p>
              <p className="leading-[normal]">YOUR STORY.</p>
            </div>
            <p
              className="[word-break:break-word] font-['Mona_Sans:Light'] font-light leading-[1.65] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-[400px]"
              data-node-id="1:156"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              The discovery call focuses on understanding what matters to you —
              not jumping straight to a recommendation.
            </p>
            <div
              className="absolute h-[300px] left-[320px] opacity-70 rounded-[16px] top-[260px] w-[260px]"
              data-node-id="1:157"
              data-name="phase-photo"
            >
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full"
                src={imgPhasePhoto}
              />
            </div>
          </div>
          <div
            className="bg-[#f8f4ee] content-stretch flex flex-[1_0_0] flex-col gap-[32px] h-[560px] items-start min-w-px overflow-clip p-[60px] relative"
            data-node-id="1:158"
            data-name="phase-right"
          >
            <p
              className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[#94702f] text-[13px] tracking-[1px] uppercase whitespace-nowrap"
              data-node-id="1:159"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              What to expect
            </p>
            <div
              className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full"
              data-node-id="1:160"
              data-name="points"
            >
              <div
                className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full"
                data-node-id="1:161"
                data-name="point"
              >
                <div
                  className="bg-[#e7dcf7] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]"
                  data-node-id="1:162"
                  data-name="icon"
                >
                  <div
                    className="relative shrink-0 size-[16px]"
                    data-node-id="1:163"
                    data-name="message-circle"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgMessageCircle}
                    />
                  </div>
                </div>
                <div
                  className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative"
                  data-node-id="1:165"
                  data-name="text"
                >
                  <p
                    className="font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[16px] whitespace-nowrap"
                    data-node-id="1:166"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Talk through your goals
                  </p>
                  <p
                    className="font-['Mona_Sans:Light'] font-light leading-[1.6] min-w-full relative shrink-0 text-[#56646c] text-[14px] w-[min-content]"
                    data-node-id="1:167"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Goals, family priorities and the questions that matter most
                    to you right now.
                  </p>
                </div>
              </div>
              <div
                className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full"
                data-node-id="1:168"
                data-name="point"
              >
                <div
                  className="bg-[#dfeff8] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]"
                  data-node-id="1:169"
                  data-name="icon"
                >
                  <div
                    className="relative shrink-0 size-[16px]"
                    data-node-id="1:170"
                    data-name="pie-chart"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgPieChart}
                    />
                  </div>
                </div>
                <div
                  className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative"
                  data-node-id="1:172"
                  data-name="text"
                >
                  <p
                    className="font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[16px] whitespace-nowrap"
                    data-node-id="1:173"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Explore your current picture
                  </p>
                  <p
                    className="font-['Mona_Sans:Light'] font-light leading-[1.6] min-w-full relative shrink-0 text-[#56646c] text-[14px] w-[min-content]"
                    data-node-id="1:174"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Income, savings, debt and existing commitments — a candid
                    look at where things stand.
                  </p>
                </div>
              </div>
              <div
                className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full"
                data-node-id="1:175"
                data-name="point"
              >
                <div
                  className="bg-[#ffe6d3] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]"
                  data-node-id="1:176"
                  data-name="icon"
                >
                  <div
                    className="relative shrink-0 size-[16px]"
                    data-node-id="1:177"
                    data-name="compass"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgCompass}
                    />
                  </div>
                </div>
                <div
                  className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative"
                  data-node-id="1:179"
                  data-name="text"
                >
                  <p
                    className="font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[16px] whitespace-nowrap"
                    data-node-id="1:180"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Clarify the next question
                  </p>
                  <p
                    className="font-['Mona_Sans:Light'] font-light leading-[1.6] min-w-full relative shrink-0 text-[#56646c] text-[14px] w-[min-content]"
                    data-node-id="1:181"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Discuss where guidance could help and what to bring into
                    focus before the next step.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="bg-[#081d2b] content-stretch flex flex-col gap-[12px] items-start p-[20px] relative rounded-[16px] shrink-0 w-full"
              data-node-id="1:182"
              data-name="outcome"
            >
              <div
                className="content-stretch flex gap-[8px] items-center relative shrink-0"
                data-node-id="1:183"
                data-name="Frame"
              >
                <div
                  className="bg-[#c9a963] h-[2px] relative shrink-0 w-[20px]"
                  data-node-id="1:184"
                  data-name="Rectangle"
                />
                <p
                  className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#c9a963] text-[11px] tracking-[1px] uppercase whitespace-nowrap"
                  data-node-id="1:185"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  The aim
                </p>
              </div>
              <p
                className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[1.5] relative shrink-0 text-[16px] text-white whitespace-nowrap"
                data-node-id="1:186"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                A shared starting point and a clearer question to work on
                together.
              </p>
            </div>
          </div>
        </div>
          )}
          {activePhase === 1 && (
        <div
          className="bg-[#c9a963] content-stretch flex h-[560px] items-start overflow-clip relative shrink-0 w-full"
          data-node-id="1:187"
          data-name="Phase 02 - Strategy"
        >
          <div
            className="bg-[#fffdfa] content-stretch flex flex-[1_0_0] flex-col gap-[32px] h-[560px] items-start min-w-px overflow-clip p-[60px] relative"
            data-node-id="1:188"
            data-name="phase-left"
          >
            <p
              className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[#94702f] text-[13px] tracking-[1px] uppercase whitespace-nowrap"
              data-node-id="1:189"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              What to expect
            </p>
            <div
              className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full"
              data-node-id="1:190"
              data-name="points"
            >
              <div
                className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full"
                data-node-id="1:191"
                data-name="point"
              >
                <div
                  className="bg-[#d4bcfa] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]"
                  data-node-id="1:192"
                  data-name="icon"
                >
                  <div
                    className="relative shrink-0 size-[16px]"
                    data-node-id="1:193"
                    data-name="sliders"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgSliders}
                    />
                  </div>
                </div>
                <div
                  className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative"
                  data-node-id="1:195"
                  data-name="text"
                >
                  <p
                    className="font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[16px] whitespace-nowrap"
                    data-node-id="1:196"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >{`Prioritise what's urgent`}</p>
                  <p
                    className="font-['Mona_Sans:Light'] font-light leading-[1.6] min-w-full relative shrink-0 text-[#56646c] text-[14px] w-[min-content]"
                    data-node-id="1:197"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Decide what needs attention now and what can wait — with
                    full context for that decision.
                  </p>
                </div>
              </div>
              <div
                className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full"
                data-node-id="1:198"
                data-name="point"
              >
                <div
                  className="bg-[#dfeff8] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]"
                  data-node-id="1:199"
                  data-name="icon"
                >
                  <div
                    className="relative shrink-0 size-[16px]"
                    data-node-id="1:200"
                    data-name="git-branch"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgGitBranch}
                    />
                  </div>
                </div>
                <div
                  className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative"
                  data-node-id="1:202"
                  data-name="text"
                >
                  <p
                    className="font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[16px] whitespace-nowrap"
                    data-node-id="1:203"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Compare your options
                  </p>
                  <p
                    className="font-['Mona_Sans:Light'] font-light leading-[1.6] min-w-full relative shrink-0 text-[#56646c] text-[14px] w-[min-content]"
                    data-node-id="1:204"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Weigh relevant routes, including their risks and tradeoffs,
                    so the choice is genuinely informed.
                  </p>
                </div>
              </div>
              <div
                className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full"
                data-node-id="1:205"
                data-name="point"
              >
                <div
                  className="bg-[#ffe6d3] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]"
                  data-node-id="1:206"
                  data-name="icon"
                >
                  <div
                    className="relative shrink-0 size-[16px]"
                    data-node-id="1:207"
                    data-name="check-circle"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgCheckCircle}
                    />
                  </div>
                </div>
                <div
                  className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative"
                  data-node-id="1:209"
                  data-name="text"
                >
                  <p
                    className="font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[16px] whitespace-nowrap"
                    data-node-id="1:210"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Agree on a direction
                  </p>
                  <p
                    className="font-['Mona_Sans:Light'] font-light leading-[1.6] min-w-full relative shrink-0 text-[#56646c] text-[14px] w-[min-content]"
                    data-node-id="1:211"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Ask questions, refine the thinking, and land on a direction
                    that genuinely fits your situation.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="bg-[#f0ede6] border border-[#d8c89a] border-solid content-stretch flex flex-col gap-[12px] items-start p-[20px] relative rounded-[16px] shrink-0 w-full"
              data-node-id="1:212"
              data-name="outcome"
            >
              <div
                className="content-stretch flex gap-[8px] items-center relative shrink-0"
                data-node-id="1:213"
                data-name="Frame"
              >
                <div
                  className="bg-[#c9a963] h-[2px] relative shrink-0 w-[20px]"
                  data-node-id="1:214"
                  data-name="Rectangle"
                />
                <p
                  className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#94702f] text-[11px] tracking-[1px] uppercase whitespace-nowrap"
                  data-node-id="1:215"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  The aim
                </p>
              </div>
              <p
                className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[1.5] relative shrink-0 text-[#081d2b] text-[16px] whitespace-nowrap"
                data-node-id="1:216"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                A proposed roadmap with priorities and decisions made clear.
              </p>
            </div>
          </div>
          <div
            className="bg-[#c9a963] content-stretch flex flex-col gap-[28px] items-start overflow-clip p-[60px] relative shrink-0 size-[560px]"
            data-node-id="1:217"
            data-name="phase-right"
          >
            <div
              className="absolute border border-[rgba(8,6,2,0.13)] border-solid left-[280px] rounded-[180px] size-[360px] top-[-60px]"
              data-node-id="1:218"
              data-name="orbit"
            />
            <div
              className="absolute left-[300px] size-[280px] top-[-40px]"
              data-node-id="1:219"
              data-name="glow"
            >
              <img
                alt=""
                className="absolute block inset-0 max-w-none size-full"
                src={imgGlow1}
              />
            </div>
            <p
              className="[word-break:break-word] absolute font-['Mona_Sans:ExtraBold'] font-extrabold leading-none left-[80px] text-[120px] text-[rgba(8,6,2,0.06)] top-[320px] whitespace-nowrap"
              data-node-id="1:220"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              02
            </p>
            <div
              className="bg-[rgba(8,6,2,0.09)] border border-[rgba(8,6,2,0.19)] border-solid content-stretch flex items-start px-[14px] py-[8px] relative rounded-[100px] shrink-0"
              data-node-id="1:221"
              data-name="phase-tag"
            >
              <p
                className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[11px] tracking-[1px] uppercase whitespace-nowrap"
                data-node-id="1:222"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Phase Two
              </p>
            </div>
            <div
              className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[#081d2b] text-[52px] w-[420px]"
              data-node-id="1:223"
            >
              <p className="leading-[normal] mb-0">THEN, A</p>
              <p className="leading-[normal] mb-0">CONSIDERED</p>
              <p className="leading-[normal]">DIRECTION.</p>
            </div>
            <p
              className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.65] relative shrink-0 text-[16px] text-[rgba(8,29,43,0.75)] w-[400px]"
              data-node-id="1:224"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              With your starting point understood, the next phase turns your
              priorities into options you can weigh with confidence.
            </p>
            <div
              className="absolute h-[320px] left-[240px] opacity-55 rounded-[16px] top-[240px] w-[300px]"
              data-node-id="1:225"
              data-name="phase-photo"
            >
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full"
                src={imgPhasePhoto1}
              />
            </div>
          </div>
        </div>
          )}
          {activePhase === 2 && (
        <div
          className="bg-[#42b9fa] content-stretch flex h-[560px] items-start overflow-clip relative shrink-0 w-full"
          data-node-id="1:226"
          data-name="Phase 03 - Execution"
        >
          <div
            className="bg-[#081d2b] content-stretch flex flex-col gap-[28px] items-start overflow-clip p-[60px] relative shrink-0 size-[560px]"
            data-node-id="1:227"
            data-name="phase-left"
          >
            <div
              className="absolute left-[-60px] size-[400px] top-[200px]"
              data-node-id="1:228"
              data-name="glow"
            >
              <div className="absolute inset-[-7.5%]">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src={imgGlow2}
                />
              </div>
            </div>
            <p
              className="[word-break:break-word] absolute font-['Mona_Sans:ExtraBold'] font-extrabold leading-none left-[20px] text-[120px] text-[rgba(255,255,255,0.02)] top-[320px] whitespace-nowrap"
              data-node-id="1:229"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              03
            </p>
            <div
              className="bg-[rgba(66,185,250,0.13)] border border-[rgba(66,185,250,0.27)] border-solid content-stretch flex items-start px-[14px] py-[8px] relative rounded-[100px] shrink-0"
              data-node-id="1:230"
              data-name="phase-tag"
            >
              <p
                className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#42b9fa] text-[11px] tracking-[1px] uppercase whitespace-nowrap"
                data-node-id="1:231"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Phase Three
              </p>
            </div>
            <div
              className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[52px] text-white w-[420px]"
              data-node-id="1:232"
            >
              <p className="leading-[normal] mb-0">NEXT,</p>
              <p className="leading-[normal] mb-0">PURPOSEFUL</p>
              <p className="leading-[normal]">ACTION.</p>
            </div>
            <p
              className="[word-break:break-word] font-['Mona_Sans:Light'] font-light leading-[1.65] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-[400px]"
              data-node-id="1:233"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              If you choose to move forward, this phase puts the agreed
              direction into practice — and makes room to revisit it as life
              changes.
            </p>
            <div
              className="absolute h-[310px] left-[300px] opacity-60 rounded-[16px] top-[250px] w-[280px]"
              data-node-id="1:234"
              data-name="phase-photo"
            >
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full"
                src={imgPhasePhoto2}
              />
            </div>
          </div>
          <div
            className="bg-[#eff8ff] content-stretch flex flex-[1_0_0] flex-col gap-[32px] h-[560px] items-start min-w-px overflow-clip p-[60px] relative"
            data-node-id="1:235"
            data-name="phase-right"
          >
            <div
              className="absolute left-[400px] size-[400px] top-[-80px]"
              data-node-id="1:236"
              data-name="ambient"
            >
              <div className="absolute inset-[-10%]">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src={imgAmbient1}
                />
              </div>
            </div>
            <p
              className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[#0077b5] text-[13px] tracking-[1px] uppercase whitespace-nowrap"
              data-node-id="1:237"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              What to expect
            </p>
            <div
              className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full"
              data-node-id="1:238"
              data-name="points"
            >
              <div
                className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full"
                data-node-id="1:239"
                data-name="point"
              >
                <div
                  className="bg-[rgba(66,185,250,0.13)] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]"
                  data-node-id="1:240"
                  data-name="icon"
                >
                  <div
                    className="relative shrink-0 size-[16px]"
                    data-node-id="1:241"
                    data-name="list"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgList}
                    />
                  </div>
                </div>
                <div
                  className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative"
                  data-node-id="1:243"
                  data-name="text"
                >
                  <p
                    className="font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[16px] whitespace-nowrap"
                    data-node-id="1:244"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Confirm the action plan
                  </p>
                  <p
                    className="font-['Mona_Sans:Light'] font-light leading-[1.6] min-w-full relative shrink-0 text-[#56646c] text-[14px] w-[min-content]"
                    data-node-id="1:245"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Clarify actions, responsibilities and the information needed
                    to get things moving.
                  </p>
                </div>
              </div>
              <div
                className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full"
                data-node-id="1:246"
                data-name="point"
              >
                <div
                  className="bg-[rgba(66,185,250,0.13)] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]"
                  data-node-id="1:247"
                  data-name="icon"
                >
                  <div
                    className="relative shrink-0 size-[16px]"
                    data-node-id="1:248"
                    data-name="users"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgUsers}
                    />
                  </div>
                </div>
                <div
                  className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative"
                  data-node-id="1:250"
                  data-name="text"
                >
                  <p
                    className="font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[16px] whitespace-nowrap"
                    data-node-id="1:251"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Co-ordinate the steps
                  </p>
                  <p
                    className="font-['Mona_Sans:Light'] font-light leading-[1.6] min-w-full relative shrink-0 text-[#56646c] text-[14px] w-[min-content]"
                    data-node-id="1:252"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Connect agreed steps with the relevant providers or
                    professionals needed to carry them out.
                  </p>
                </div>
              </div>
              <div
                className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full"
                data-node-id="1:253"
                data-name="point"
              >
                <div
                  className="bg-[rgba(66,185,250,0.13)] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]"
                  data-node-id="1:254"
                  data-name="icon"
                >
                  <div
                    className="relative shrink-0 size-[16px]"
                    data-node-id="1:255"
                    data-name="refresh-cw"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgRefreshCw}
                    />
                  </div>
                </div>
                <div
                  className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative"
                  data-node-id="1:257"
                  data-name="text"
                >
                  <p
                    className="font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[16px] whitespace-nowrap"
                    data-node-id="1:258"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Build in review
                  </p>
                  <p
                    className="font-['Mona_Sans:Light'] font-light leading-[1.6] min-w-full relative shrink-0 text-[#56646c] text-[14px] w-[min-content]"
                    data-node-id="1:259"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Agree how to monitor progress and revisit priorities as your
                    life and goals evolve.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="bg-[#0077b5] content-stretch flex flex-col gap-[12px] items-start p-[20px] relative rounded-[16px] shrink-0 w-full"
              data-node-id="1:260"
              data-name="outcome"
            >
              <div
                className="content-stretch flex gap-[8px] items-center relative shrink-0"
                data-node-id="1:261"
                data-name="Frame"
              >
                <div
                  className="bg-white h-[2px] relative shrink-0 w-[20px]"
                  data-node-id="1:262"
                  data-name="Rectangle"
                />
                <p
                  className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[11px] text-white tracking-[1px] uppercase whitespace-nowrap"
                  data-node-id="1:263"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  The aim
                </p>
              </div>
              <p
                className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[1.5] relative shrink-0 text-[16px] text-white whitespace-nowrap"
                data-node-id="1:264"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                An agreed action plan and a basis for future review — built to
                adapt.
              </p>
            </div>
          </div>
        </div>
          )}
          <div className="phase-controls">
            <button
              type="button"
              className="phase-arrow"
              aria-label="Previous phase"
              onClick={() => setActivePhase((p) => (p - 1 + PHASE_COUNT) % PHASE_COUNT)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 5L8 12L15 19" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className="phase-playpause"
              aria-label={phasePaused ? "Play" : "Pause"}
              onClick={() => setPhasePaused((v) => !v)}
            >
              {phasePaused ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 5.5V18.5L19 12L8 5.5Z" fill="#000000" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="7" y="5" width="3.5" height="14" rx="1" fill="#000000" />
                  <rect x="13.5" y="5" width="3.5" height="14" rx="1" fill="#000000" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="phase-arrow"
              aria-label="Next phase"
              onClick={() => setActivePhase((p) => (p + 1) % PHASE_COUNT)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 5L16 12L9 19" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div
          className="bg-[#fffdfa] content-stretch flex gap-[100px] items-start overflow-clip px-[80px] py-[72px] relative shrink-0 w-full"
          data-node-id="1:265"
          data-name="Before conversation"
          data-reveal
        >
          <div
            className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[400px]"
            data-node-id="1:266"
            data-name="left"
          >
            <div
              className="content-stretch flex gap-[12px] items-center relative shrink-0"
              data-node-id="1:267"
              data-name="eyebrow"
            >
              <div
                className="bg-[#c9a963] h-[2px] relative shrink-0 w-[24px]"
                data-node-id="1:268"
                data-name="Rectangle"
              />
              <p
                className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[#94702f] text-[12px] tracking-[1.4px] uppercase whitespace-nowrap"
                data-node-id="1:269"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                A little preparation
              </p>
            </div>
            <div
              className="[word-break:break-word] font-['Oswald:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[#081d2b] text-[52px] whitespace-nowrap"
              data-node-id="1:270"
            >
              <p className="leading-[normal] mb-0">Bring your</p>
              <p className="leading-[normal] mb-0">questions.</p>
              <p className="leading-[normal] mb-0">Not a</p>
              <p className="leading-[normal]">perfect plan.</p>
            </div>
            <p
              className="[word-break:break-word] font-['Mona_Sans:Light'] font-light leading-[1.7] min-w-full relative shrink-0 text-[#56646c] text-[15px] w-[min-content]"
              data-node-id="1:271"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              Think about what you want your money to make possible. The
              conversation can begin there.
            </p>
            <p
              className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#94702f] text-[13px] w-[min-content]"
              data-node-id="1:272"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              Keep account numbers and sensitive financial details out of
              booking messages.
            </p>
          </div>
          <div
            className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative"
            data-node-id="1:273"
            data-name="right"
          >
            <details
              className="border-[#e0dad0] border-solid border-t content-stretch flex flex-col gap-[10px] items-start py-[24px] relative shrink-0 w-full"
              data-node-id="1:274"
              data-name="qa"
              open
            >
              <summary className="content-stretch flex items-center justify-between gap-[16px] w-full cursor-pointer list-none">
                <p
                  className="font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[18px]"
                  data-node-id="1:275"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  What should I have in mind?
                </p>
                <span className="faq-icon" />
              </summary>
              <p
                className="font-['Mona_Sans:Light'] font-light leading-[1.7] relative shrink-0 text-[#56646c] text-[14px] w-full"
                data-node-id="1:276"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                A few goals, the questions on your mind and a broad picture of
                your finances. You can ask which documents would help later.
              </p>
            </details>
            <details
              className="border-[#e0dad0] border-solid border-t content-stretch flex flex-col gap-[10px] items-start py-[24px] relative shrink-0 w-full"
              data-node-id="1:277"
              data-name="qa"
              open
            >
              <summary className="content-stretch flex items-center justify-between gap-[16px] w-full cursor-pointer list-none">
                <p
                  className="font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[18px]"
                  data-node-id="1:278"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >{`What if I'm not sure where to start?`}</p>
                <span className="faq-icon" />
              </summary>
              <p
                className="font-['Mona_Sans:Light'] font-light leading-[1.7] relative shrink-0 text-[#56646c] text-[14px] w-full"
                data-node-id="1:279"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Start with what feels most important — or most unclear.
                Discovery is a place to explore the question before trying to
                solve it.
              </p>
            </details>
            <details
              className="border-[#e0dad0] border-solid border-t content-stretch flex flex-col gap-[10px] items-start py-[24px] relative shrink-0 w-full"
              data-node-id="1:280"
              data-name="qa"
              open
            >
              <summary className="content-stretch flex items-center justify-between gap-[16px] w-full cursor-pointer list-none">
                <p
                  className="font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[18px]"
                  data-node-id="1:281"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  What should we agree before moving ahead?
                </p>
                <span className="faq-icon" />
              </summary>
              <p
                className="font-['Mona_Sans:Light'] font-light leading-[1.7] relative shrink-0 text-[#56646c] text-[14px] w-full"
                data-node-id="1:282"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Clarify the scope, any costs, responsibilities and review
                arrangements before deciding on a next step.
              </p>
            </details>
            <details
              className="border-[#e0dad0] border-b border-solid border-t content-stretch flex flex-col gap-[10px] items-start py-[24px] relative shrink-0 w-full"
              data-node-id="1:283"
              data-name="qa"
              open
            >
              <summary className="content-stretch flex items-center justify-between gap-[16px] w-full cursor-pointer list-none">
                <p
                  className="font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[18px]"
                  data-node-id="1:284"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Is this a free consultation?
                </p>
                <span className="faq-icon" />
              </summary>
              <p
                className="font-['Mona_Sans:Light'] font-light leading-[1.7] relative shrink-0 text-[#56646c] text-[14px] w-full"
                data-node-id="1:285"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                The initial discovery conversation is exploratory — the purpose
                is to see whether working together makes sense for your
                situation, not to sell you something.
              </p>
            </details>
          </div>
        </div>
        <div
          className="bg-[#081d2b] content-stretch flex gap-[80px] items-center overflow-clip p-[80px] relative shrink-0 w-full"
          data-node-id="1:286"
          data-name="CTA banner"
          data-reveal
        >
          <div
            className="absolute left-[900px] size-[600px] top-[-150px]"
            data-node-id="1:287"
            data-name="ambient"
          >
            <div className="absolute inset-[-10%]">
              <img
                alt=""
                className="block max-w-none size-full"
                src={imgAmbient2}
              />
            </div>
          </div>
          <div
            className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[700px]"
            data-node-id="1:288"
            data-name="left"
          >
            <div
              className="content-stretch flex gap-[12px] items-center relative shrink-0"
              data-node-id="1:289"
              data-name="eyebrow"
            >
              <div
                className="bg-[#c9a963] h-[2px] relative shrink-0 w-[24px]"
                data-node-id="1:290"
                data-name="Rectangle"
              />
              <p
                className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[normal] relative shrink-0 text-[#c9a963] text-[12px] tracking-[1.4px] uppercase whitespace-nowrap"
                data-node-id="1:291"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Your next conversation
              </p>
            </div>
            <div
              className="[word-break:break-word] font-['Mona_Sans:Bold'] font-bold leading-[0] relative shrink-0 text-[58px] text-white tracking-[-1.16px] whitespace-nowrap"
              data-node-id="1:292"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              <p className="leading-[normal] mb-0">
                A clearer direction starts
              </p>
              <p className="leading-[normal]">with a conversation.</p>
            </div>
            <p
              className="[word-break:break-word] font-['Mona_Sans:Light'] font-light leading-[1.65] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] whitespace-nowrap"
              data-node-id="1:293"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >{`Let's explore your priorities and whether working together is a fit.`}</p>
          </div>
          <div
            className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-center min-w-px relative"
            data-node-id="1:294"
            data-name="right"
          >
            <a
              href="#contact"
              className="bg-[#c9a963] content-stretch drop-shadow-[0px_12px_15px_rgba(201,169,99,0.25)] flex flex-col items-center justify-center px-[40px] py-[18px] relative rounded-[100px] shrink-0 no-underline"
              data-node-id="1:295"
              data-name="book-btn"
            >
              <p
                className="[word-break:break-word] font-['Mona_Sans:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[16px] whitespace-nowrap"
                data-node-id="1:296"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Book a Session
              </p>
            </a>
            <p
              className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[normal] relative shrink-0 text-[13px] text-[rgba(255,255,255,0.38)] whitespace-nowrap"
              data-node-id="1:297"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              Begin with what matters to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
