import { Link } from 'react-router-dom'

// Helper: wraps any card content in a Link to /scholarships?category=...
function CategoryLink({ category, children, className }: { category: string; children: React.ReactNode; className: string }) {
  return (
    <Link to={`/scholarships?category=${encodeURIComponent(category)}`} className={className}>
      {children}
    </Link>
  )
}

export default function Home() {
  return (
    <div className="bg-[#f6faf8] text-[#181d1c]">

      {/* ── Top App Bar ── */}
      <header className="fixed top-0 w-full z-50 bg-[#f6faf8]/80 backdrop-blur-md border-b border-[#e5e9e7]">
        <nav className="flex justify-between items-center px-8 h-20 max-w-full mx-auto">
          <div className="flex items-center gap-10">
            <img src="/logo.png" alt="College Mentor" className="h-10 w-auto" />
            <div className="hidden md:flex gap-8 items-center">
              <Link to="/scholarships" className="text-[#002691] border-b-2 border-[#002691] font-bold transition-colors duration-200 py-1">
                Scholarships
              </Link>
              <a href="#" className="text-[#444654] hover:text-[#002691] transition-colors duration-200 py-1 font-medium">Fellowships</a>
              <a href="#" className="text-[#444654] hover:text-[#002691] transition-colors duration-200 py-1 font-medium">Institutions</a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-[#e5e9e7] rounded-full px-5 py-2 gap-3 focus-within:ring-2 ring-[#002691]/20 transition-all">
              <span className="material-symbols-outlined text-[#757685] text-lg">search</span>
              <input className="bg-transparent border-none outline-none text-sm w-64 p-0" placeholder="Search NSP, PMRF, NOS..." type="text" />
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 hover:bg-[#e5e9e7] rounded-full transition-colors relative">
                <span className="material-symbols-outlined text-[#444654]">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
              </button>
              <button className="p-2.5 hover:bg-[#e5e9e7] rounded-full transition-colors">
                <span className="material-symbols-outlined text-[#444654]">favorite</span>
              </button>
            </div>
            <button className="bg-[#002691] text-white px-8 py-2.5 rounded-full font-bold hover:shadow-lg hover:shadow-[#002691]/30 transition-all active:scale-95">
              Apply Now
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-[#173cba] overflow-hidden">
              <img alt="User profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3jzBWJnIyCIePQpiEOz7dp45AXQyXPtPrVZzv4NxeJMrdrwH371eslUAYA_Fs24xLJEnheO_zENebWFMw-zBE1tkSVrOX455eblfcyzw2rlgCJ-_r-5dyl1sY8qBf0cBuG9zzxq4lsMBibHNSXxK4oHtXiQR19Ik_b6PI09qesv-CYMK_viWdpTMsikTObjT8wxt_79VL5Q0RG55ybFYavynWkczpRqyOl61emZFfAstr3hY04C__c-JtyOFdy9eFVHBVsjQYN13u" />
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-20">

        {/* ── Hero Section ── */}
        <section className="relative min-h-[calc(100vh-80px)] flex items-center px-8 lg:px-24 overflow-hidden bg-[#f6faf8]">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#002691]/5 -skew-x-12 transform translate-x-24 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center py-20">

            <div className="lg:col-span-7 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#006c51]/10 text-[#006c51] font-extrabold text-xs tracking-widest uppercase mb-8 border border-[#006c51]/20">
                <span className="w-2 h-2 bg-[#006c51] rounded-full animate-pulse"></span>
                Empowering India's Brightest Minds
              </div>
              <h1 className="text-6xl lg:text-[84px] font-black text-[#181d1c] tracking-tighter leading-[0.95] mb-8">
                Ignite Your <br />
                <span className="text-[#002691] italic">Academic Legacy</span>
              </h1>
              <p className="text-2xl text-[#444654] leading-relaxed mb-12 max-w-2xl font-light">
                Unlock elite opportunities like <span className="font-bold text-[#181d1c]">PMRF</span>,{" "}
                <span className="font-bold text-[#181d1c]">National Overseas Scholarship</span>, and curated institutional grants.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link to="/scholarships" className="editorial-gradient text-white px-10 py-5 rounded-full font-black text-xl shadow-2xl shadow-[#002691]/30 hover:-translate-y-1 transition-transform flex items-center gap-3">
                  Start Application
                  <span className="material-symbols-outlined">rocket_launch</span>
                </Link>
                <button className="bg-white border-2 border-[#dfe3e1] text-[#181d1c] px-10 py-5 rounded-full font-black text-xl hover:bg-[#f0f4f2] transition-colors shadow-sm">
                  Success Stories
                </button>
              </div>
              <div className="mt-16 flex items-center gap-6">
                <div className="flex -space-x-4">
                  <img alt="Scholar 1" className="w-14 h-14 rounded-full border-4 border-white shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9Ge7j5xU0vK1HPz7vGd5v2Ra_HWqy53xMbgE6r85WhIXSYJW4pOOA8IPOZpgbS4aHyn388ZiIfU1XzYTaeagbIW5c69URhrFE2fHLL5AI1ru8j0dtJ3qnBrzSJArrGNV9o5IwbVkn48wcTVa0I6jchZWP1Z5FZ_Gb6vnB560QEO1faMID21AiAdBv36IuO-pGPDhUOYZe9-y-fUJ6SdAqXstrrmZ8cg4rgfoqPs5RMFfkJLErTjzCSlf-8Oh-LAj2loP6W0UCVqp6" />
                  <img alt="Scholar 2" className="w-14 h-14 rounded-full border-4 border-white shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhc_2isxCNdk26gNVqCbmCYMmAuSBYKn7mcpCUnQgncqZQGepX0zOEuSaQ4OCv-JYJuzIo_nvwQHX2AG3DbzUqXMq1qnN1VEMQW9AbWo7pOtyh_ba3ZPHNeJfczF-xEGgGGM2ayl_I5VZAOf7zo3IMZq5_82nO3cDCJ-QyaErqesu2bajyr1jGysv8YR_JO9SAq0vFx2LSe32dQbPJx_wdtRxaB_D1QkJAWvh03DC5tgn1mcCZFwjWpE_PUGFNWUq56T2stxqxUlut" />
                  <img alt="Scholar 3" className="w-14 h-14 rounded-full border-4 border-white shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5LFZqF4dScGV6-SXEdItlakMn1UGQd_TLHsak7OxVZ2haitRE6cZYeX36n-wi2ZlOutgX9Hz94bszw-kDt00vibd914j9fePSgomBq_A4AVVtTi1aSEu8U6bvTDaizTUEUY81cGM-SMTVxqirhvRlhUjAbD0DZd-RRnQZ77_F3Wp1aMLQrjDlkUGSNeakMRYhGb1n1MWxNepp7-TWIOWgAKd-EPqUYVrsclkFKoDFCf6xcm-Lr8tEJUuv8KOPezEdd2jYhE7hL0S-" />
                </div>
                <div>
                  <p className="text-lg font-black text-[#181d1c]">1,20,000+ Aspirants</p>
                  <p className="text-sm text-[#444654] font-medium">Secured over ₹850 Cr in funding last year</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden premium-shadow transform lg:rotate-2 transition-transform hover:rotate-0 duration-700">
                <img alt="Indian University Campus" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM_gjcfMSEzodkGDRzjBPXxdcOikHom8lL0TcIhs6_zwlZxrCne6MfIyIvL6OPPgyelmNhKOjlalmGyB47Ob_AK5P0NUfg1nOpwKnJenBp-hL2dUyFbzryZVYDE54rFWqVngqZe0JZzvHvXRFgtVNcDFu_Au9-GgrowSK7BgRBWYxh4vADX3_VNXeHoBiz_zhVMbaHqRWj_d22KrnmMvi_4AQyn3PXuOHs2NLYgJ_Cwor4cxLeL9wWEqKFPpk-Ori7YuI2pzGC8Qiv" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002691]/60 via-transparent to-transparent"></div>
              </div>
              <div className="absolute -bottom-8 -left-12 bg-white p-8 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] z-20 min-w-[240px] border border-[#e5e9e7]">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#006c51] flex items-center justify-center shadow-lg shadow-[#006c51]/20">
                    <span className="material-symbols-outlined text-white font-bold text-2xl">account_balance_wallet</span>
                  </div>
                  <span className="text-3xl font-black text-[#181d1c]">₹4.8 Cr</span>
                </div>
                <p className="text-sm text-[#444654] font-bold leading-tight">Average daily scholarship disbursement in India</p>
              </div>
              <div className="absolute -top-6 -right-6 bg-[#002691] text-white p-6 rounded-full w-32 h-32 flex flex-col items-center justify-center text-center shadow-xl shadow-[#002691]/40 animate-bounce">
                <span className="text-xs font-black uppercase tracking-tighter">PMRF 2024</span>
                <span className="text-xl font-black">OPEN</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Scholarship Categories: Bento Grid ── */}
        <section className="py-32 px-8 lg:px-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div>
                <h2 className="text-5xl font-black text-[#181d1c] mb-6 tracking-tight">Prime Opportunities</h2>
                <p className="text-xl text-[#444654] max-w-2xl font-medium">
                  Tailored funding pathways for every Indian student, from Premier Institutes to State Board excellence.
                </p>
              </div>
              <Link to="/scholarships" className="text-[#002691] font-black text-lg flex items-center gap-3 group px-6 py-3 rounded-full hover:bg-[#002691]/5 transition-all">
                Browse All Schemes
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-8">

              {/* 1. Merit Based — large */}
              <CategoryLink
                category="Merit Based"
                className="md:col-span-2 lg:col-span-6 group relative overflow-hidden rounded-[2.5rem] bg-[#f0f4f2] p-10 flex flex-col justify-between min-h-[400px] transition-all hover:shadow-2xl hover:bg-white border border-transparent hover:border-[#002691]/10 cursor-pointer"
              >
                <div className="relative z-10">
                  <span className="inline-block px-4 py-1 rounded-full bg-[#002691]/10 text-[#002691] font-bold text-xs mb-6">FEATURED</span>
                  <h3 className="text-3xl font-black text-[#181d1c] mb-4">Merit Based Scholarship</h3>
                  <p className="text-[#444654] text-lg max-w-sm">
                    Recognition for academic excellence, including PMRF and KVPY fellowships for India's top intellectual talent.
                  </p>
                </div>
                <div className="absolute right-[-10%] bottom-[-10%] w-2/3 h-full opacity-30 group-hover:scale-110 transition-transform duration-700">
                  <img alt="Academic Excellence" className="w-full h-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCQGGBqwv1FMTH4Yvsy6xgCbrqFtU-rnHWu7PVE3GO5FE2eXCmZ8rPlSMXzy1phtjBBn3y6_K23XgVTP2oo_21RD7e8Ss2qUymDCSICT3U9jy8yfYviKZ0nKC3EykWdS9RqFflS9dhmfzgBMjJY7pc68sdAJ25wcj3e6-DnhiY9fGk3Yfck1_q297AXE-h40clONx_FjZ2IVVWAklFAC35fQbu2vntixOp3MkwUE1_n2neYR9dAzwMiDEZnJp1lG8G3z0g-yuE9nQW" />
                </div>
                <span className="mt-8 text-[#002691] font-black flex items-center gap-3 group/btn text-lg">
                  Apply Now <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">trending_flat</span>
                </span>
              </CategoryLink>

              {/* 2. Means Based */}
              <CategoryLink
                category="Means Based"
                className="md:col-span-2 lg:col-span-3 group rounded-[2.5rem] bg-[#f0f4f2] p-10 flex flex-col justify-between transition-all hover:shadow-2xl hover:bg-white border border-transparent hover:border-[#006c51]/10 cursor-pointer"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-[#006c51]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl text-[#006c51]">payments</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#181d1c] mb-3">Means Based</h3>
                  <p className="text-[#444654] font-medium">Financial support for economically weaker sections including MCM and Post-Matric schemes across India.</p>
                </div>
                <span className="mt-8 text-[#006c51] font-black flex items-center gap-2 group-hover:gap-4 transition-all">
                  Check Eligibility <span className="material-symbols-outlined">chevron_right</span>
                </span>
              </CategoryLink>

              {/* 3. Girls Scholarship */}
              <CategoryLink
                category="Girls Scholarship"
                className="md:col-span-2 lg:col-span-3 group rounded-[2.5rem] editorial-gradient p-10 flex flex-col justify-between transition-all hover:shadow-2xl hover:scale-[1.02] text-white cursor-pointer"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-8">
                    <span className="material-symbols-outlined text-4xl">woman</span>
                  </div>
                  <h3 className="text-2xl font-black mb-3">Girls Scholarship</h3>
                  <p className="text-white/80 font-medium leading-relaxed">Empowering women in STEM and higher education through Pragati, UDAAN, and specialized state grants.</p>
                </div>
                <span className="mt-8 bg-white text-[#002691] px-6 py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-[#61fcc9] transition-colors">
                  Explore Now
                </span>
              </CategoryLink>

              {/* 4. International */}
              <CategoryLink
                category="International"
                className="md:col-span-2 lg:col-span-4 group rounded-[2.5rem] bg-[#f0f4f2] p-10 flex gap-8 items-center transition-all hover:shadow-xl hover:bg-white border border-transparent hover:border-[#002691]/10 overflow-hidden relative cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-[#002691]/5 flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform z-10">
                  <span className="material-symbols-outlined text-4xl text-[#002691]">flight_takeoff</span>
                </div>
                <div className="z-10">
                  <h3 className="text-xl font-black text-[#181d1c]">International</h3>
                  <p className="text-sm text-[#444654] font-medium mt-1">NOS and global grants for pursuing Master's and PhD programs in world-renowned universities.</p>
                </div>
                <div className="absolute right-0 bottom-0 w-24 h-24 opacity-10 group-hover:scale-125 transition-transform">
                  <img alt="Global" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM_gjcfMSEzodkGDRzjBPXxdcOikHom8lL0TcIhs6_zwlZxrCne6MfIyIvL6OPPgyelmNhKOjlalmGyB47Ob_AK5P0NUfg1nOpwKnJenBp-hL2dUyFbzryZVYDE54rFWqVngqZe0JZzvHvXRFgtVNcDFu_Au9-GgrowSK7BgRBWYxh4vADX3_VNXeHoBiz_zhVMbaHqRWj_d22KrnmMvi_4AQyn3PXuOHs2NLYgJ_Cwor4cxLeL9wWEqKFPpk-Ori7YuI2pzGC8Qiv" />
                </div>
              </CategoryLink>

              {/* 5. Sports */}
              <CategoryLink
                category="Sports"
                className="md:col-span-2 lg:col-span-4 group rounded-[2.5rem] bg-[#f0f4f2] p-10 flex gap-8 items-center transition-all hover:shadow-xl hover:bg-white border border-transparent hover:border-[#006c51]/10 overflow-hidden relative cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-[#006c51]/5 flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform z-10">
                  <span className="material-symbols-outlined text-4xl text-[#006c51]">sports_cricket</span>
                </div>
                <div className="z-10">
                  <h3 className="text-xl font-black text-[#181d1c]">Sports Based</h3>
                  <p className="text-sm text-[#444654] font-medium mt-1">Khelo India and TAME schemes for national and state-level athletes representing the country.</p>
                </div>
              </CategoryLink>

              {/* 6 & 7. School & College */}
              <div className="md:col-span-2 lg:col-span-4 grid grid-cols-2 gap-6">
                <CategoryLink
                  category="School"
                  className="bg-[#dfe3e1]/30 p-8 rounded-[2rem] flex flex-col items-center text-center justify-center hover:bg-[#002691] hover:text-white transition-all duration-500 group border border-[#dfe3e1] cursor-pointer relative overflow-hidden"
                >
                  <span className="material-symbols-outlined text-4xl mb-4 group-hover:scale-125 group-hover:-rotate-12 transition-transform z-10">school</span>
                  <span className="font-black text-lg z-10">School Scholarship</span>
                </CategoryLink>
                <CategoryLink
                  category="College"
                  className="bg-[#dfe3e1]/30 p-8 rounded-[2rem] flex flex-col items-center text-center justify-center hover:bg-[#006c51] hover:text-white transition-all duration-500 group border border-[#dfe3e1] cursor-pointer relative overflow-hidden"
                >
                  <span className="material-symbols-outlined text-4xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-transform z-10">account_balance</span>
                  <span className="font-black text-lg z-10">College Scholarship</span>
                </CategoryLink>
              </div>

              {/* 8 & 9. Minorities & State-wise — split into two clickable halves */}
              <div className="md:col-span-2 lg:col-span-7 group rounded-[2.5rem] bg-[#f0f4f2] p-10 flex flex-col md:flex-row gap-10 items-center justify-between border border-transparent hover:border-[#c4c5d6]/30 transition-all overflow-hidden">
                <CategoryLink
                  category="Minorities"
                  className="flex items-center gap-6 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#181d1c]/5 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-3xl text-[#444654]">diversity_1</span>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-[#181d1c]">Minorities Scholarship</h3>
                    <p className="text-sm text-[#444654] font-medium">Pre &amp; Post Matric funding for minority communities through NSP.</p>
                  </div>
                </CategoryLink>
                <div className="h-px w-full md:w-px md:h-16 bg-[#c4c5d6]/30"></div>
                <CategoryLink
                  category="State-wise"
                  className="flex items-center gap-6 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#181d1c]/5 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-3xl text-[#444654]">location_on</span>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-[#181d1c]">State-wise scholarships</h3>
                    <p className="text-sm text-[#444654] font-medium">Dashboards for E-Kalyan, MahaDBT, and state-specific portals.</p>
                  </div>
                </CategoryLink>
              </div>

              {/* Advisor CTA */}
              <div className="md:col-span-2 lg:col-span-5 bg-[#002691]/5 rounded-[2.5rem] p-10 flex items-center justify-center border-4 border-dashed border-[#002691]/20">
                <div className="text-center">
                  <p className="font-black text-2xl text-[#002691] mb-3">Confused about NSP?</p>
                  <p className="text-[#444654] font-medium mb-6">Get 1-on-1 counseling for scholarship selection.</p>
                  <button className="bg-[#002691] text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all">Talk to an Expert</button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Newsletter Section ── */}
        <section className="py-32 px-8 lg:px-24">
          <div className="max-w-7xl mx-auto rounded-[3.5rem] bg-[#181d1c] text-[#f6faf8] py-24 px-8 lg:px-20 overflow-hidden relative premium-shadow">
            <div className="absolute top-0 right-0 w-2/5 h-full opacity-30 pointer-events-none">
              <img alt="Elite Library" className="w-full h-full object-cover mix-blend-luminosity"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1UT9IGRhTTv_eeeudYLlzZdBBA6IKtoEvKorbUTEpN4Lnh9cLo4i0Of_py5qoMNNzGvC7O7twNp9cUJY115COKq1ybIVBvBxBfb2ck-wJr8rTmsEblXkSseIN47jVqNuH1LCfUAJ6sYEDwvxXxnC19QL1D0yPzYFRalXqswEkrDWuwghUMTLgfpDCZ1ViqQNtdGhI4KnqZstCR3XkNqsFSUIIQ3glo4nZNM8WNEVxeb24SB2vsrxlPLvYkCXzmOcIFiSlf_2_1erE" />
            </div>
            <div className="relative z-10 max-w-3xl">
              <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-white font-bold text-xs mb-8 border border-white/20 uppercase tracking-widest">Never miss a deadline</span>
              <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-[1.1]">
                Deadlines come fast.<br />
                <span className="text-[#61fcc9]">Be faster.</span>
              </h2>
              <p className="text-xl opacity-80 mb-12 font-medium leading-relaxed max-w-xl">
                Join 50,000+ Indian students receiving weekly alerts on government, private, and international scholarship openings.
              </p>
              <form className="flex flex-col sm:flex-row gap-5">
                <input className="flex-grow bg-white/5 border border-white/20 rounded-2xl px-8 py-5 text-white focus:ring-2 focus:ring-[#006c51] focus:outline-none placeholder:text-white/30 text-lg" placeholder="Enter your academic email (e.g. .edu or .ac.in)" type="email" />
                <button className="bg-[#006c51] text-white px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl shadow-[#006c51]/20" type="submit">Subscribe Now</button>
              </form>
              <p className="mt-8 text-sm opacity-50 flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">verified_user</span>
                Secure &amp; Privacy Focused. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#f0f4f2] w-full py-20 px-8 border-t border-[#e5e9e7]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          <div className="col-span-1 md:col-span-1">
            <img src="/logo.png" alt="College Mentor" className="h-10 w-auto mb-6" />
            <p className="text-base text-[#444654] mb-8 font-medium leading-relaxed">India's leading independent scholarship discovery platform, bridging the gap between talent and elite funding.</p>
            <div className="flex gap-5">
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#002691] shadow-sm hover:bg-[#002691] hover:text-white transition-all"><span className="material-symbols-outlined">share</span></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#002691] shadow-sm hover:bg-[#002691] hover:text-white transition-all"><span className="material-symbols-outlined">language</span></a>
            </div>
          </div>
          <div>
            <h4 className="font-black text-[#181d1c] mb-8 text-sm tracking-widest uppercase">Popular Portals</h4>
            <ul className="space-y-5">
              {["National Scholarship Portal (NSP)", "AICTE Pragati Portal", "UGC Fellowship Window", "CSIR-NET Dashboard"].map(item => (
                <li key={item}><a href="#" className="text-[#444654] hover:text-[#002691] font-bold text-sm transition-all">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[#181d1c] mb-8 text-sm tracking-widest uppercase">Guidelines</h4>
            <ul className="space-y-5">
              {["Income Certificate Guide", "Aadhaar Linking Process", "Institutional Verification", "Document Renewal"].map(item => (
                <li key={item}><a href="#" className="text-[#444654] hover:text-[#002691] font-bold text-sm transition-all">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[#181d1c] mb-8 text-sm tracking-widest uppercase">Helpdesk</h4>
            <ul className="space-y-5">
              {["Grievance Redressal", "State Nodal Officers", "Technical Support", "WhatsApp Alerts"].map(item => (
                <li key={item}><a href="#" className="text-[#444654] hover:text-[#002691] font-bold text-sm transition-all">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-[#dfe3e1] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#444654] font-bold text-sm">© 2024 Bharat Shiksha Portal. A unit of Academic Curator India.</p>
          <span className="flex items-center gap-3 text-xs text-[#444654] font-bold uppercase tracking-widest">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006c51] shadow-[0_0_10px_rgba(0,108,81,0.5)]"></span>
            Verified Government Links
          </span>
        </div>
      </footer>

    </div>
  )
}
