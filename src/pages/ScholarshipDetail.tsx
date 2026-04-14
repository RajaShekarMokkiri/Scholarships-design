import { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { SCHOLARSHIP_DATA } from '../data/scholarshipData';

const TAG_COLORS: Record<string, string> = {
  'Merit Based': 'bg-[#61fcc9] text-[#002116]',
  'Means Based': 'bg-[#fef3c7] text-[#78350f]',
  'International': 'bg-[#dde1ff] text-[#001356]',
  'Girls Scholarship': 'bg-[#fbe2f4] text-[#831860]',
  'Study Abroad': 'bg-[#e0f2fe] text-[#075985]',
  'General': 'bg-[#e5e9e7] text-[#444654]',
}

/** Split a big text blob into bullet points intelligently */
function splitIntoBullets(text: string): string[] {
  if (!text) return [];
  // Try splitting by common patterns
  let items = text.split(/(?:^|\s)(?:Step \d+[:.]?\s*|•\s*|\d+[.)]\s+|- )/i).filter(Boolean);
  if (items.length <= 1) {
    // Try splitting by sentences
    items = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10);
  }
  // Clean up
  return items.map(s => s.trim().replace(/^[-•:]+\s*/, '')).filter(Boolean).slice(0, 12);
}

/** Format benefits text into structured items */
function parseBenefits(text: string): { title: string; value: string }[] {
  if (!text) return [];
  const items = splitIntoBullets(text);
  return items.map(item => {
    // Try to split on colon for title:value pairs
    const colonIdx = item.indexOf(':');
    if (colonIdx > 0 && colonIdx < 60) {
      return { title: item.slice(0, colonIdx).trim(), value: item.slice(colonIdx + 1).trim() };
    }
    return { title: '', value: item };
  });
}

export default function ScholarshipDetail() {
  const { id } = useParams();
  const { hash } = useLocation();
  const scholarship = SCHOLARSHIP_DATA.find(s => s.id === Number(id));

  useEffect(() => {
    if (!scholarship || !hash) return;

    const targetId = hash.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    requestAnimationFrame(() => {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [hash, scholarship]);

  if (!scholarship) {
    return (
      <div className="bg-[#f6faf8] text-[#181d1c] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-8xl text-[#c4c5d6] mb-6 block">search_off</span>
          <h1 className="text-4xl font-bold text-[#002691] mb-4">Scholarship Not Found</h1>
          <p className="text-[#444654] mb-8">The scholarship you're looking for doesn't exist or has been removed.</p>
          <Link to="/scholarships" className="bg-[#002691] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#173cba] transition-colors">Go back to Discover</Link>
        </div>
      </div>
    );
  }

  const tagColor = TAG_COLORS[scholarship.primaryTag] || TAG_COLORS['General'];
  const eligibilityItems = splitIntoBullets(scholarship.detailedEligibility || scholarship.eligibility);
  const benefitItems = parseBenefits(scholarship.benefits);
  const howToApplySteps = splitIntoBullets(scholarship.howToApply);
  const isClosedOrExpired = scholarship.deadline.toLowerCase() === 'closed';

  // Get related scholarships (same primary tag, excluding current)
  const related = SCHOLARSHIP_DATA
    .filter(s => s.id !== scholarship.id && s.primaryTag === scholarship.primaryTag)
    .slice(0, 3);

  return (
    <div className="bg-[#f6faf8] text-[#181d1c] min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-[#f6faf8]/80 backdrop-blur-md flex justify-between items-center px-8 h-16 max-w-full mx-auto border-b border-[#e5e9e7]">
        <div className="flex items-center gap-8">
          <Link to="/">
            <img src="/logo.png" alt="College Mentor" className="h-9 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/scholarships" className="text-[#444654] hover:text-[#002691] text-base transition-colors duration-200">Discover</Link>
            <a className="text-[#444654] hover:text-[#002691] text-base transition-colors duration-200" href="#">My Applications</a>
            <a className="text-[#444654] hover:text-[#002691] text-base transition-colors duration-200" href="#">Mentorship</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#444654] hover:bg-[#e5e9e7] rounded-full transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-[#444654] hover:bg-[#e5e9e7] rounded-full transition-colors">
            <span className="material-symbols-outlined">bookmarks</span>
          </button>
          <div className="h-8 w-8 rounded-full overflow-hidden bg-[#e5e9e7]">
            <img alt="User profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGmvV49AjYwvIQHC8BMCPg3VkSQPG1fa18qC62VLKvpw025JL0UV1bQKzj0S0bUMl2YfqCKpOxuID_niBfs3gZhugZDhRyICgLBKxP2cz2dT5i6rycP82vaXUI86nx_TmZoo7J9Aos_McaQYNztCc3zgXHMQnhMBWizEKu3F7XxKDVBT9WHdGnktCQjZ_BMB9pPfsSS_mcB13gUo_fWm3jOzzgT7ZcVd_kRGIv7_mGOiHMC902AYhdl6jYvp-d_F20kpcTXNkBjRjQ"/>
          </div>
          {scholarship.link && (
            <a href={scholarship.link} target="_blank" rel="noopener noreferrer" className="ml-2 px-6 py-2 bg-[#002691] text-white rounded-lg font-bold text-sm hover:bg-[#173cba] transition-all">Apply Now</a>
          )}
        </div>
      </nav>

      <main className="pt-24 pb-20 px-8 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#757685] mb-8">
          <Link to="/" className="hover:text-[#002691] transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/scholarships" className="hover:text-[#002691] transition-colors">Scholarships</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-[#181d1c] font-medium truncate max-w-[300px]">{scholarship.name}</span>
        </div>

        {/* Hero Section */}
        <header className="relative mb-12 rounded-2xl overflow-hidden p-12 min-h-[400px] flex flex-col justify-end shadow-2xl" style={{ background: 'linear-gradient(135deg, #002691 0%, #006c51 100%)' }}>
          <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDkmAZRIS3SsE3EuGOLqRmLwxLK2v_LaV5rW-c7U3rMdS2pBN5c62swbGG2K6013HAViWTpoW8SXgeO2XHz6EKwB7ntn2_3OHh7R8hKb8uZPF0s_FQcJyiT0SXooieftXcpTb5d_pSz_ySOUhDgyNB4Emrr9j7qOAjAjcDo2aWwCyWJt6MLCG5YtVJeItMcCYRc2d4kF559t0I9pLIhL_Qe1xVmgzwNP1MhccZ17If952qut3oqF2KVK4Wak-zql9cQGn5Npyt-xKW9')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm ${tagColor}`}>{scholarship.primaryTag}</span>
              <span className={`bg-white/20 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-white/30 ${isClosedOrExpired ? 'bg-red-500/30' : ''}`}>
                Deadline: {scholarship.deadline}
              </span>
              {scholarship.categories.slice(0, 2).map(cat => (
                <span key={cat} className="bg-white/10 text-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold border border-white/20">{cat}</span>
              ))}
            </div>
            {scholarship.logo && (
              <div className="mb-6 inline-flex items-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3">
                <img src={scholarship.logo} alt={`${scholarship.name} logo`} className="h-12 w-auto object-contain" />
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight drop-shadow-lg">{scholarship.name}</h1>
            <p className="text-lg text-white/90 font-medium max-w-2xl leading-relaxed drop-shadow-md">
              {scholarship.about ? scholarship.about.slice(0, 200) + (scholarship.about.length > 200 ? '...' : '') : scholarship.eligibility}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {/* Key Facts Bento Grid */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-[#e5e9e7] hover:border-[#002691]/20 transition-all group">
                <span className="material-symbols-outlined text-[#002691] mb-3 text-3xl group-hover:scale-110 transition-transform">payments</span>
                <p className="text-[#757685] text-xs font-bold uppercase tracking-widest mb-1">Award</p>
                <p className="text-xl font-bold text-[#181d1c]">{scholarship.award}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#e5e9e7] hover:border-[#002691]/20 transition-all group">
                <span className="material-symbols-outlined text-[#002691] mb-3 text-3xl group-hover:scale-110 transition-transform">schedule</span>
                <p className="text-[#757685] text-xs font-bold uppercase tracking-widest mb-1">Deadline</p>
                <p className={`text-xl font-bold ${isClosedOrExpired ? 'text-[#ba1a1a]' : 'text-[#181d1c]'}`}>{scholarship.deadline}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#e5e9e7] hover:border-[#002691]/20 transition-all group">
                <span className="material-symbols-outlined text-[#002691] mb-3 text-3xl group-hover:scale-110 transition-transform">location_on</span>
                <p className="text-[#757685] text-xs font-bold uppercase tracking-widest mb-1">States</p>
                <p className="text-lg font-bold text-[#181d1c]">{scholarship.states.length > 0 ? `${scholarship.states.length} States` : 'All India'}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#e5e9e7] hover:border-[#002691]/20 transition-all group">
                <span className="material-symbols-outlined text-[#002691] mb-3 text-3xl group-hover:scale-110 transition-transform">school</span>
                <p className="text-[#757685] text-xs font-bold uppercase tracking-widest mb-1">Level</p>
                <p className="text-lg font-bold text-[#181d1c]">{scholarship.classes.length > 0 ? scholarship.classes[0] : 'Open'}</p>
              </div>
            </section>

            {/* About Section */}
            {scholarship.about && (
              <section id="about-scholarship" className="prose prose-slate max-w-none scroll-mt-28">
                <h2 className="text-3xl font-bold text-[#181d1c] mb-6">About the Scholarship</h2>
                <div className="bg-white p-8 rounded-2xl border border-[#e5e9e7]">
                  <p className="text-[#444654] text-lg leading-relaxed whitespace-pre-line">{scholarship.about}</p>
                </div>
              </section>
            )}

            {/* Eligibility & Benefits Asymmetric Layout */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Eligibility */}
              <div id="scholarship-eligibility" className="bg-white p-8 rounded-2xl shadow-sm border border-[#e5e9e7] scroll-mt-28">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006c51]">check_circle</span>
                  Eligibility Criteria
                </h3>
                {eligibilityItems.length > 0 ? (
                  <ul className="space-y-4">
                    {eligibilityItems.map((item, i) => (
                      <li key={i} className="flex gap-3 text-[#444654]">
                        <span className="material-symbols-outlined text-[#006c51] text-sm shrink-0 mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#444654] text-sm">{scholarship.eligibility || 'Please refer to the official website for eligibility details.'}</p>
                )}
              </div>

              {/* Benefits */}
              <div id="benefits-documents" className="bg-[#f0f4f2] p-8 rounded-2xl scroll-mt-28">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#002691]">stars</span>
                  Benefits & Documents
                </h3>
                {benefitItems.length > 0 ? (
                  <ul className="space-y-3">
                    {benefitItems.map((item, idx) => (
                      <li key={idx} className="bg-white/80 p-4 rounded-xl border border-white/50">
                        {item.title ? (
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-medium text-sm text-[#181d1c]">{item.title}</span>
                            <span className="text-xs font-bold text-[#002691] text-right shrink-0 max-w-[50%]">{item.value}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-[#444654]">{item.value}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="bg-white/80 p-4 rounded-xl">
                    <span className="text-sm text-[#444654]">{scholarship.award}</span>
                  </div>
                )}
                <div className="mt-6 bg-white/80 p-4 rounded-xl">
                  <p className="text-sm font-bold text-[#181d1c] mb-2">Documents</p>
                  <p className="text-sm text-[#444654] leading-relaxed">
                    Please keep your academic records, identity proof, income certificate, and a recent photograph ready before applying.
                  </p>
                </div>
              </div>
            </section>

            {/* How to Apply */}
            {howToApplySteps.length > 0 && (
              <section id="how-to-apply" className="scroll-mt-28">
                <h2 className="text-3xl font-bold text-[#181d1c] mb-8">How to Apply</h2>
                <div className="bg-white p-8 rounded-2xl border border-[#e5e9e7] shadow-sm">
                  <ol className="space-y-6">
                    {howToApplySteps.map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#002691] text-white flex items-center justify-center font-bold text-sm">{i + 1}</span>
                        <span className="text-[#444654] text-base leading-relaxed pt-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            )}

            {/* FAQ Section */}
            <section>
              <h2 className="text-3xl font-bold text-[#181d1c] mb-8">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="group bg-white rounded-xl overflow-hidden transition-all border border-[#e5e9e7]">
                  <summary className="list-none p-6 cursor-pointer flex justify-between items-center font-bold text-[#181d1c] hover:bg-[#f0f4f2]/50">
                    Is there an application fee?
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-[#444654] leading-relaxed">
                    No, applying for the {scholarship.name} is completely free of charge.
                  </div>
                </details>
                <details className="group bg-white rounded-xl overflow-hidden transition-all border border-[#e5e9e7]">
                  <summary className="list-none p-6 cursor-pointer flex justify-between items-center font-bold text-[#181d1c] hover:bg-[#f0f4f2]/50">
                    What documents are required?
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-[#444654] leading-relaxed">
                    Typically required documents include academic transcripts, identity proof (Aadhaar/Passport), income certificate, and passport-sized photographs. Please refer to the official scholarship page for the exact requirements.
                  </div>
                </details>
                <details className="group bg-white rounded-xl overflow-hidden transition-all border border-[#e5e9e7]">
                  <summary className="list-none p-6 cursor-pointer flex justify-between items-center font-bold text-[#181d1c] hover:bg-[#f0f4f2]/50">
                    When will results be announced?
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-[#444654] leading-relaxed">
                    Results are typically announced within 4-8 weeks after the application deadline. Selected candidates will be notified via email and/or SMS.
                  </div>
                </details>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Action Card */}
              <div className="bg-white p-8 rounded-2xl shadow-xl shadow-[#002691]/5 border border-[#e5e9e7]">
                <div className="flex items-center gap-3 mb-4">
                  {isClosedOrExpired ? (
                    <>
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-bold text-red-600">Applications Closed</span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-bold text-green-600">Applications Open</span>
                    </>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">Apply for this Scholarship</h3>
                <p className="text-sm text-[#444654] mb-8">Deadline: {scholarship.deadline}. Don't miss this opportunity!</p>
                
                <div className="space-y-4">
                  {scholarship.link ? (
                    <a
                      href={scholarship.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 group ${
                        isClosedOrExpired
                          ? 'bg-[#e5e9e7] text-[#757685] cursor-not-allowed'
                          : 'bg-[#002691] text-white hover:bg-[#173cba] shadow-[#002691]/20'
                      }`}
                    >
                      {isClosedOrExpired ? 'Closed' : 'Apply Now'}
                      {!isClosedOrExpired && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                    </a>
                  ) : (
                    <button className="w-full py-4 bg-[#e5e9e7] text-[#757685] rounded-xl font-bold text-lg cursor-not-allowed">
                      Link Unavailable
                    </button>
                  )}
                  <button className="w-full py-4 bg-[#f0f4f2] text-[#181d1c] rounded-xl font-bold text-lg hover:bg-[#e5e9e7] transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">bookmark</span>
                    Save for later
                  </button>
                </div>

                {/* Related scholarships */}
                {related.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-[#e5e9e7]">
                    <h4 className="text-xs font-bold text-[#757685] uppercase tracking-widest mb-6">Related Scholarships</h4>
                    <div className="space-y-5">
                      {related.map(r => (
                        <Link key={r.id} to={`/scholarship/${r.id}`} className="group block">
                          <p className="text-sm font-bold text-[#181d1c] group-hover:text-[#002691] transition-colors line-clamp-2">{r.name}</p>
                          <p className="text-xs text-[#757685] mt-1">{r.award} • {r.deadline}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-10 pt-8 border-t border-[#e5e9e7]">
                  <div className="bg-[#002691]/5 p-4 rounded-xl flex items-start gap-4">
                    <span className="material-symbols-outlined text-[#002691]">info</span>
                    <p className="text-xs text-[#002691] leading-relaxed">
                      Always verify the scholarship details on the official website before applying. Deadlines and eligibility criteria may change.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f0f4f2] w-full py-16 px-8 border-t border-[#e5e9e7] mt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="block mb-4">
              <img src="/logo.png" alt="College Mentor" className="h-9 w-auto" />
            </Link>
            <p className="text-[#757685] text-sm leading-relaxed">India's leading platform for academic excellence, guiding students to prestigious opportunities globally and locally.</p>
          </div>
          <div>
            <h4 className="font-bold text-[#181d1c] mb-6">Resources</h4>
            <ul className="space-y-3 text-sm text-[#444654]">
              <li><a className="hover:text-[#002691] transition-all" href="#">Board Exam Tips</a></li>
              <li><a className="hover:text-[#002691] transition-all" href="#">College Admissions India</a></li>
              <li><a className="hover:text-[#002691] transition-all" href="#">Entrance Exam Prep</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#181d1c] mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-[#444654]">
              <li><a className="hover:text-[#002691] transition-all" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-[#002691] transition-all" href="#">Terms & Conditions</a></li>
              <li><a className="hover:text-[#002691] transition-all" href="#">Scholarship Calendar</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#181d1c] mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#002691] text-sm">mail</span>
                <span className="text-sm text-[#444654] font-medium">helpdesk@academiccurator.in</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#002691] text-sm">call</span>
                <span className="text-sm text-[#444654] font-medium">1800-419-8800</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#dfe3e1] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm tracking-wide text-[#757685]">© 2024 College Mentor India. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm text-[#c4c5d6] hover:text-[#002691] transition-all" href="#"><span className="material-symbols-outlined">language</span></a>
            <a className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm text-[#c4c5d6] hover:text-[#002691] transition-all" href="#"><span className="material-symbols-outlined">share</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
