/* Shared insight-article data + modal, used by both the desktop and the
   mobile Insights pages so they stay in sync. */

const assetPathPrefix = "/assets";

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

export const insightArticles = [
  { id: "craft-of-wealth", category: "INVESTING", title: "THE CRAFT OF WEALTH", description: "How artisanal investing can help you build a more resilient financial future.", image: imgStoryPhotograph, color: "#d4bcfa", readTime: "5 min read", content: "Investing is not about chasing the hottest stock or timing the market perfectly. It is about understanding your goals, your time horizon, and your comfort with risk.\n\nLike any craft, it requires patience, discipline, and a willingness to learn. An artisanal approach to investing can help you build a more resilient financial future.\n\nIn this article, we discuss the importance of research, the value of patience, and the power of compounding." },
  { id: "rhythm-of-returns", category: "INVESTING", title: "THE RHYTHM OF RETURNS", description: "Timing the market is hard, but timing your financial goals doesn't have to be.", image: imgStoryPhotograph1, color: "#b8d4e8", readTime: "4 min read", content: "The market moves in cycles, and while no one can predict the future, you can prepare for it.\n\nThis article discusses the importance of aligning your investment strategy with your financial goals. We explore goal-based investing, where your portfolio is designed around specific life milestones.\n\nLearn how to create a rhythm for your returns that matches your life stages." },
  { id: "recipe-for-growth", category: "WEALTH FOUNDATIONS", title: "THE RECIPE FOR GROWTH", description: "Mixing the right ingredients to turn your savings into long-term wealth.", image: imgStoryPhotograph3, color: "#ffd4b8", readTime: "6 min read", content: "Building wealth is like cooking a great meal - it requires the right ingredients, proper timing, and patience.\n\nThis article explores the essential ingredients of a solid financial foundation: budgeting, saving, investing, and protecting what you have built.\n\nDiscover how to combine these elements to create a financial plan that grows steadily over time." },
  { id: "workers-edge", category: "RETIREMENT", title: "THE WORKER'S EDGE", description: "Turning everyday income into a retirement plan that actually works.", image: imgStoryPhotograph4, color: "#c8e6c9", readTime: "5 min read", content: "Retirement planning doesn't have to be complicated. This article shows how everyday workers can turn their income into a retirement plan that actually works.\n\nWe explain the power of employer-sponsored plans, the benefits of automatic contributions, and how small consistent amounts grow into substantial nest eggs over a career.\n\nLearn practical strategies that any worker can use today to build a more secure retirement tomorrow." },
  { id: "taste-of-security", category: "PROTECTION", title: "THE TASTE OF SECURITY", description: "Finding peace of mind in a financial plan that's built to last.", image: imgStoryPhotograph5, color: "#ffcdd2", readTime: "4 min read", content: "Protection is the foundation of any solid financial plan. This article explores how insurance, emergency funds, and risk management can provide the security you need.\n\nWe discuss the different types of protection every household needs: health insurance, life insurance, disability coverage, and property protection.\n\nUnderstand how to assess your protection needs and build a safety net that gives you genuine peace of mind." },
  { id: "art-of-diversity", category: "INVESTING", title: "THE ART OF DIVERSITY", description: "Why spreading your assets across different classes can protect your future.", image: imgStoryPhotograph6, color: "#e1bee7", readTime: "5 min read", content: "Diversification is one of the most powerful tools in investing. This article explains why spreading your assets across different classes can help protect your future.\n\nWe explore the different asset classes - stocks, bonds, real estate, commodities, and alternatives - and how each behaves under different market conditions.\n\nLearn the principles of diversification and how to build a balanced portfolio." },
  { id: "kitchen-table-plan", category: "LIFE & LEGACY", title: "THE KITCHEN TABLE PLAN", description: "Turning everyday conversations into a clear path to financial freedom.", image: imgStoryPhotograph7, color: "#b3e5fc", readTime: "5 min read", content: "Money is part of life. Not the other way around. For the plans you make around the kitchen table.\n\nBegin with a conversation. The kitchen table plan is about turning everyday conversations into a clear path to financial freedom. It starts with listening - understanding what matters most to your family.\n\nThis article explores how the most effective financial plans are built not in spreadsheets, but in honest conversations around the kitchen table." },
  { id: "menu-for-tomorrow", category: "LIFE & LEGACY", title: "THE MENU FOR TOMORROW", description: "Planning for the next decade with a financial strategy that adapts.", image: imgStoryPhotograph8, color: "#b3e5fc", readTime: "4 min read", content: "Planning for the next decade with a financial strategy that adapts.\n\nThe menu for tomorrow is about creating a financial strategy that evolves with your life. Just as a good menu changes with the seasons, your financial plan should adapt as your circumstances change.\n\nLearn how to build a plan that is flexible enough to handle life's unexpected turns." },
  { id: "harmony-of-risk", category: "LIFE & LEGACY", title: "THE HARMONY OF RISK", description: "Balancing protection and growth so your plan stays in tune.", image: imgStoryPhotograph9, color: "#b3e5fc", readTime: "5 min read", content: "Balancing protection and growth so your plan stays in tune.\n\nThe harmony of risk is about finding the right balance between protecting what you have and growing what you need. Too much protection can limit your growth; too little can leave you vulnerable.\n\nThis article explores how to find the right harmony in your financial plan." },
  { id: "service-standard", category: "GUIDANCE", title: "THE SERVICE STANDARD", description: "What exceptional service looks like when your money is on the line.", image: imgStoryPhotograph10, color: "#d4bcfa", readTime: "4 min read", content: "What exceptional service looks like when your money is on the line.\n\nThe service standard is about understanding what you should expect when someone is managing your money. It is about the relationships, standards and fresh thinking that make wealth more human.\n\nThis article explores the principles that define exceptional service in financial advice." },
  { id: "community-effect", category: "CONNECTION", title: "THE COMMUNITY EFFECT", description: "How local relationships can strengthen your long-term financial outlook.", image: imgStoryPhotograph11, color: "#d4bcfa", readTime: "4 min read", content: "How local relationships can strengthen your long-term financial outlook.\n\nThe community effect is about the power of local relationships in building financial resilience. When you are connected to your community, you have access to knowledge, support and opportunities.\n\nDiscover how local relationships can play a crucial role in your long-term financial success." },
  { id: "future-of-finance", category: "WHAT COMES NEXT", title: "THE FUTURE OF FINANCE", description: "What the next generation of wealth-building looks like in practice.", image: imgStoryPhotograph12, color: "#d4bcfa", readTime: "5 min read", content: "What the next generation of wealth-building looks like in practice.\n\nThe future of finance is already here. From digital assets to sustainable investing, the landscape of wealth-building is changing rapidly.\n\nThis article explores what the next generation of wealth-building looks like in practice." },
  { id: "different-lens", category: "WEALTH FOUNDATIONS", title: "WHERE ARE ALL YOUR ASSETS?", description: "A closer look at hidden wealth and the gaps in your current portfolio.", image: imgStoryPhotograph12, color: "#ffd4b8", readTime: "7 min read", content: "A closer look at hidden wealth and the gaps in your current portfolio.\n\nStart with what you own, what you owe and what matters most. A clearer picture is the first step towards a more intentional plan.\n\nThis featured essay takes a different lens on everyday wealth, exploring the hidden assets and gaps in your current portfolio.\n\nDiscover how to get a clearer picture of your financial situation." },
];

export type InsightArticle = typeof insightArticles[number];

/* The article modal, shared by the desktop and mobile insights pages. */
export function InsightModal({
  article,
  onClose,
}: {
  article: InsightArticle | null;
  onClose: () => void;
}) {
  if (!article) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-[24px] max-w-[720px] w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[280px] overflow-hidden rounded-t-[24px]" style={{ backgroundColor: article.color }}>
          <img src={article.image} alt="" className="absolute inset-0 w-full h-full object-cover rounded-t-[24px]" />
          <button
            onClick={onClose}
            aria-label="Close article"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-xl font-bold text-[#081d2b] hover:bg-white transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-8 pb-10">
          <div className="flex items-center gap-3 mb-4">
            <p className="font-['Special_Elite:Regular'] text-[13px] text-[#081d2b]">{article.category}</p>
            {article.readTime && <span className="text-[12px] text-[#56646c]">· {article.readTime}</span>}
          </div>
          <h2 className="font-['Oswald:SemiBold'] text-[32px] leading-[1.15] text-[#081d2b] mb-6">{article.title}</h2>
          <div className="font-['Mona_Sans:Regular'] text-[16px] leading-[1.7] text-[#56646c] mb-8">
            {article.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className={i > 0 ? "mt-4" : ""}>{paragraph}</p>
            ))}
          </div>
          <button
            onClick={onClose}
            className="bg-[#0d2b42] text-white px-8 py-3 rounded-[100px] font-['Manrope:Bold'] text-[14px] hover:brightness(1.15) transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
