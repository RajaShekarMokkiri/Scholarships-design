import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { SCHOLARSHIP_DATA, ALL_TAGS, ALL_FILTER_STATES } from '../data/scholarshipData'

const getLogo = (id: number) => {
  const logos = [
    "https://upload.wikimedia.org/wikipedia/commons/4/4e/CollegeBoard_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/23/Tata_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/c/c5/Reliance_Industries_Logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/b/b5/Kotak_Mahindra_Bank_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png"
  ];
  return logos[(id - 1) % logos.length];
}

const parseAmount = (amt: string) => {
  const match = amt.match(/[\d,]+/);
  if (!match) return 0;
  return parseInt(match[0].replace(/,/g, ''), 10) || 0;
}

const TAG_COLORS: Record<string, string> = {
  'Merit Based': 'bg-[#61fcc9] text-[#002116]',
  'Means Based': 'bg-[#fef3c7] text-[#78350f]',
  'International': 'bg-[#dde1ff] text-[#001356]',
  'Girls Scholarship': 'bg-[#fbe2f4] text-[#831860]',
  'Study Abroad': 'bg-[#e0f2fe] text-[#075985]',
  'General': 'bg-[#e5e9e7] text-[#444654]',
  'Sports': 'bg-[#d1fae5] text-[#065f46]',
  'Cultural': 'bg-[#fef9c3] text-[#713f12]',
  'Visual Art': 'bg-[#fce7f3] text-[#831843]',
  'Literary Art': 'bg-[#ede9fe] text-[#5b21b6]',
  'School': 'bg-[#ccfbf1] text-[#134e4a]',
}

const ITEMS_PER_PAGE = 12;
const COUNTRY_OPTIONS = ['India', 'Study Abroad'] as const;
const CLASS_FILTER_OPTIONS = [
  'Upto Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
  'Graduation',
  'Post Graduation',
  'Post Graduation Diploma',
] as const;
const COURSE_FILTER_OPTIONS = [
  'Engineering',
  'Medical',
  'Management',
  'Law',
  'Talent',
  'Sports',
] as const;

const matchesClassFilter = (scholarshipClasses: string[], selectedClass: string) => {
  if (selectedClass === 'Upto Class 8' || selectedClass === 'Class 9' || selectedClass === 'Class 10') {
    return scholarshipClasses.includes('Class 1 10');
  }
  if (selectedClass === 'Class 11' || selectedClass === 'Class 12') {
    return scholarshipClasses.includes('Class 11 12');
  }
  if (selectedClass === 'Post Graduation Diploma') {
    return scholarshipClasses.some(cls => cls.includes('Polytechnic') || cls.includes('Diploma') || cls.includes('ITI'));
  }
  return scholarshipClasses.includes(selectedClass);
}

export default function Scholarships() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') ?? ''

  const [selectedTags, setSelectedTags] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  )
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [selectedGenders, setSelectedGenders] = useState<string[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [selectedMinority, setSelectedMinority] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [sortOption, setSortOption] = useState('latest')
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'open'>('live')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [openFilters, setOpenFilters] = useState({
    states: true,
    country: true,
    gender: true,
    courses: true,
    minority: true,
    class: true,
  })

  // Sync URL param → local state when navigating here
  useEffect(() => {
    if (categoryParam && !selectedTags.includes(categoryParam)) {
      setSelectedTags([categoryParam])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryParam])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTags, selectedStates, selectedClasses, selectedGenders, selectedCourses, selectedMinority, selectedCountries, search, sortOption, activeTab])

  const toggleTag = (cat: string) => {
    setSelectedTags(prev => {
      const next = prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
      if (next.length === 1) setSearchParams({ category: next[0] })
      else setSearchParams({})
      return next
    })
  }

  const toggleState = (st: string) => {
    setSelectedStates(prev => prev.includes(st) ? prev.filter(s => s !== st) : [...prev, st])
  }

  const toggleClass = (cls: string) => {
    setSelectedClasses(prev => prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls])
  }

  const toggleGender = (gen: string) => {
    setSelectedGenders(prev => prev.includes(gen) ? prev.filter(g => g !== gen) : [...prev, gen])
  }

  const toggleCourse = (course: string) => {
    setSelectedCourses(prev => prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course])
  }

  const toggleMinority = (min: string) => {
    setSelectedMinority(prev => prev.includes(min) ? prev.filter(m => m !== min) : [...prev, min])
  }

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev => prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country])
  }

  const clearAll = () => {
    setSelectedTags([])
    setSelectedStates([])
    setSelectedClasses([])
    setSelectedGenders([])
    setSelectedCourses([])
    setSelectedMinority([])
    setSelectedCountries([])
    setSearchParams({})
  }

  const toggleFilterSection = (section: keyof typeof openFilters) => {
    setOpenFilters(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const tabCounts = useMemo(() => ({
    live: SCHOLARSHIP_DATA.filter(s => s.statuses.includes('live')).length,
    upcoming: SCHOLARSHIP_DATA.filter(s => s.statuses.includes('upcoming')).length,
    open: SCHOLARSHIP_DATA.filter(s => s.statuses.includes('open')).length,
  }), [])

  const filtered = useMemo(() => {
    return SCHOLARSHIP_DATA.filter(s => {
      const matchesTab = s.statuses.includes(activeTab)
      const matchesTag = selectedTags.length === 0 || selectedTags.includes(s.primaryTag)
      const matchesState = selectedStates.length === 0 || selectedStates.some(st => s.states.includes(st))
      const matchesClass = selectedClasses.length === 0 || selectedClasses.some(cls => matchesClassFilter(s.classes, cls))
      const courseKeywordMap: Record<string, string[]> = {
        Engineering: ['engineering', 'b.tech', 'btech', 'technology', 'technical'],
        Medical: ['medical', 'mbbs', 'nursing', 'health', 'pharma', 'paramedical'],
        Management: ['management', 'mba', 'business', 'commerce', 'bba'],
        Law: ['law', 'legal', 'llb'],
        Talent: ['talent', 'art', 'cultural', 'music', 'dance', 'literary', 'visual'],
        Sports: ['sports', 'athlete', 'athletic', 'game'],
      }
      const searchableCourseText = `${s.name} ${s.eligibility} ${s.about} ${s.primaryTag} ${s.categories.join(' ')}`.toLowerCase()
      const matchesCourse = selectedCourses.length === 0 || selectedCourses.some(course => {
        const keywords = courseKeywordMap[course] || [course.toLowerCase()]
        return keywords.some(keyword => searchableCourseText.includes(keyword))
      })
      const scholarshipCountry = (s.primaryTag === 'International' || s.primaryTag === 'Study Abroad' || s.categories.includes('International') || s.categories.includes('Study Abroad')) ? 'Study Abroad' : 'India'
      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(scholarshipCountry)
      const matchesSearch = search === '' || s.name.toLowerCase().includes(search.toLowerCase()) || s.eligibility.toLowerCase().includes(search.toLowerCase())
      
      // Note: Because scholarship data does not have explicit male/female flags currently, 
      // we check if gender filter is selected. If 'Female' is selected, you might only want 'Girls Scholarship'.
      // For now, since data is not rich enough, we won't strictly exclude data based on gender 
      // other than just rendering the UI.
      
      return matchesTab && matchesTag && matchesSearch && matchesState && matchesClass && matchesCourse && matchesCountry
    })
  }, [selectedTags, selectedStates, selectedClasses, selectedCourses, selectedCountries, search, activeTab])

  const parseDeadline = (deadline: string) => {
    if (deadline.toLowerCase() === 'closed') return new Date(0);
    try {
      const [day, month, year] = deadline.split('-');
      const monthMap: Record<string, number> = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      return new Date(parseInt(year), monthMap[month] || 0, parseInt(day));
    } catch {
      return new Date(0);
    }
  }

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortOption === 'highest_amount') return parseAmount(b.award) - parseAmount(a.award)
      if (sortOption === 'deadline') {
        const dateA = parseDeadline(a.deadline);
        const dateB = parseDeadline(b.deadline);
        return dateA.getTime() - dateB.getTime();
      }
      if (sortOption === 'latest') return b.id - a.id
      return 0
    })
  }, [filtered, sortOption])

  // Pagination
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginatedData = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }

  // Has any filter selected?
  const hasSelectedFilters = selectedTags.length > 0 || selectedStates.length > 0 || selectedClasses.length > 0 || selectedGenders.length > 0 || selectedCourses.length > 0 || selectedMinority.length > 0 || selectedCountries.length > 0;

  const renderFilterDropdown = (
    title: string,
    section: keyof typeof openFilters,
    count: number,
    content: JSX.Element,
  ) => (
    <section className="rounded-2xl border border-[#e5e9e7] bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => toggleFilterSection(section)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[#002691]">{title}</h3>
          <p className="mt-1 text-xs font-semibold text-[#757685]">{count} options</p>
        </div>
        <span className={`material-symbols-outlined text-[#002691] transition-transform duration-200 ${openFilters[section] ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {openFilters[section] && (
        <div className="border-t border-[#e5e9e7] px-5 py-4 max-h-64 overflow-y-auto pr-2">
          {content}
        </div>
      )}
    </section>
  )

  return (
    <div className="bg-[#f6faf8] text-[#181d1c] min-h-screen">

      {/* ── Navbar ── */}
      <nav className="bg-[#f6faf8]/80 backdrop-blur-md fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 border-b border-[#e5e9e7]">
        <div className="flex items-center gap-8">
          <Link to="/">
            <img src="/logo.png" alt="College Mentor" className="h-9 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-[#002691] border-b-2 border-[#002691] font-bold py-1 cursor-default">Discover</span>
            <a href="#" className="text-[#444654] hover:text-[#002691] py-1 transition-colors duration-200">My Applications</a>
            <a href="#" className="text-[#444654] hover:text-[#002691] py-1 transition-colors duration-200">Mentorship</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-[#e5e9e7] transition-colors">
            <span className="material-symbols-outlined text-[#444654]">notifications</span>
          </button>
          <button className="p-2 rounded-full hover:bg-[#e5e9e7] transition-colors">
            <span className="material-symbols-outlined text-[#444654]">bookmarks</span>
          </button>
          <div className="h-8 w-8 rounded-full bg-[#e5e9e7] overflow-hidden">
            <img
              alt="User profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGmvV49AjYwvIQHC8BMCPg3VkSQPG1fa18qC62VLKvpw025JL0UV1bQKzj0S0bUMl2YfqCKpOxuID_niBfs3gZhugZDhRyICgLBKxP2cz2dT5i6rycP82vaXUI86nx_TmZoo7J9Aos_McaQYNztCc3zgXHMQnhMBWizEKu3F7XxKDVBT9WHdGnktCQjZ_BMB9pPfsSS_mcB13gUo_fWm3jOzzgT7ZcVd_kRGIv7_mGOiHMC902AYhdl6jYvp-d_F20kpcTXNkBjRjQ"
            />
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-8 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[#002691] mb-2 tracking-tight">Scholarship Discovery India</h1>
          <p className="text-[#444654] mb-6">{SCHOLARSHIP_DATA.length} scholarships available • Updated daily</p>

          {/* Search */}
          <div className="bg-white p-1 lg:p-2 rounded-xl flex flex-wrap items-center gap-3 shadow-sm border border-[#c4c5d6]/20">
            <div className="flex-1 min-w-[280px] flex items-center px-4 bg-[#e5e9e7] rounded-lg">
              <span className="material-symbols-outlined text-[#757685]">search</span>
              <input
                className="w-full bg-transparent border-none outline-none py-3 text-[#181d1c] placeholder:text-[#757685]/70"
                placeholder="Search by scholarship name, eligibility..."
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="bg-[#173cba] text-white px-8 py-3 rounded-lg font-bold hover:scale-95 transition-transform duration-150">
              Search
            </button>
          </div>

          {/* Tags Horizontal */}
          <div className="mt-6 flex gap-3 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
            {ALL_TAGS.map(tag => {
              const isSelected = selectedTags.includes(tag)
              return (
                <button 
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full font-bold text-sm transition-all border ${isSelected ? 'bg-[#002691] text-white border-[#002691] shadow-md' : 'bg-white text-[#444654] border-[#c4c5d6]/50 hover:border-[#002691]/50'}`}
                >
                  {tag}
                </button>
              )
            })}
          </div>

          {/* Active Filters */}
          {hasSelectedFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-[#c4c5d6] uppercase tracking-wider">Active Filters:</span>
              
              {/* Tag filters */}
              {selectedTags.map(tag => (
                <div key={`tag-${tag}`} className="flex items-center gap-2 bg-[#61fcc9] text-[#007256] px-3 py-1 rounded-full text-sm font-medium">
                  {tag}
                  <span
                    className="material-symbols-outlined text-sm cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >close</span>
                </div>
              ))}

              {/* State tags */}
              {selectedStates.map(st => (
                <div key={`st-${st}`} className="flex items-center gap-2 bg-[#dde1ff] text-[#001356] px-3 py-1 rounded-full text-sm font-medium">
                  {st}
                  <span
                    className="material-symbols-outlined text-sm cursor-pointer"
                    onClick={() => toggleState(st)}
                  >close</span>
                </div>
              ))}

              {/* Country tags */}
              {selectedCountries.map(country => (
                <div key={`country-${country}`} className="flex items-center gap-2 bg-[#e0f2fe] text-[#075985] border border-[#075985]/20 px-3 py-1 rounded-full text-sm font-medium">
                  {country}
                  <span
                    className="material-symbols-outlined text-sm cursor-pointer"
                    onClick={() => toggleCountry(country)}
                  >close</span>
                </div>
              ))}

              {/* Class tags */}
              {selectedClasses.map(cls => (
                <div key={`cls-${cls}`} className="flex items-center gap-2 bg-[#fbe2f4] text-[#b81d89] px-3 py-1 rounded-full text-sm font-medium">
                  {cls}
                  <span
                    className="material-symbols-outlined text-sm cursor-pointer"
                    onClick={() => toggleClass(cls)}
                  >close</span>
                </div>
              ))}

              {/* Gender tags */}
              {selectedGenders.map(gen => (
                <div key={`gen-${gen}`} className="flex items-center gap-2 bg-[#f0f4f2] text-[#002691] border border-[#002691]/20 px-3 py-1 rounded-full text-sm font-medium">
                  {gen}
                  <span
                    className="material-symbols-outlined text-sm cursor-pointer"
                    onClick={() => toggleGender(gen)}
                  >close</span>
                </div>
              ))}

              {/* Course tags */}
              {selectedCourses.map(course => (
                <div key={`course-${course}`} className="flex items-center gap-2 bg-[#eef2ff] text-[#1e3a8a] border border-[#1e3a8a]/20 px-3 py-1 rounded-full text-sm font-medium">
                  {course}
                  <span
                    className="material-symbols-outlined text-sm cursor-pointer"
                    onClick={() => toggleCourse(course)}
                  >close</span>
                </div>
              ))}

              {/* Religion tags */}
              {selectedMinority.map(min => (
                <div key={`min-${min}`} className="flex items-center gap-2 bg-[#fef9c3] text-[#713f12] border border-[#713f12]/20 px-3 py-1 rounded-full text-sm font-medium">
                  {min}
                  <span
                    className="material-symbols-outlined text-sm cursor-pointer"
                    onClick={() => toggleMinority(min)}
                  >close</span>
                </div>
              ))}
              
              <button className="text-[#002691] text-sm font-bold hover:underline ml-2" onClick={clearAll}>
                Clear All
              </button>
            </div>
          )}
        </header>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-8">

              {renderFilterDropdown(
                'States',
                'states',
                ALL_FILTER_STATES.length,
                <div className="space-y-3">
                  {ALL_FILTER_STATES.map(st => (
                    <label key={st} className="flex items-center gap-3 group cursor-pointer" onClick={() => toggleState(st)}>
                      <input
                        readOnly
                        className="rounded border-[#c4c5d6] text-[#002691] focus:ring-[#002691] h-5 w-5 cursor-pointer"
                        type="checkbox"
                        checked={selectedStates.includes(st)}
                      />
                      <span className={`transition-colors ${selectedStates.includes(st) ? 'text-[#002691] font-semibold' : 'text-[#444654] group-hover:text-[#002691]'}`}>
                        {st}
                      </span>
                    </label>
                  ))}
                </div>,
              )}

              {renderFilterDropdown(
                'Country',
                'country',
                COUNTRY_OPTIONS.length,
                <div className="space-y-3">
                  {COUNTRY_OPTIONS.map(country => (
                    <label key={country} className="flex items-center gap-3 group cursor-pointer" onClick={() => toggleCountry(country)}>
                      <input
                        readOnly
                        className="rounded border-[#c4c5d6] text-[#002691] focus:ring-[#002691] h-5 w-5 cursor-pointer"
                        type="checkbox"
                        checked={selectedCountries.includes(country)}
                      />
                      <span className={`transition-colors ${selectedCountries.includes(country) ? 'text-[#002691] font-semibold' : 'text-[#444654] group-hover:text-[#002691]'}`}>
                        {country}
                      </span>
                    </label>
                  ))}
                </div>,
              )}

              {renderFilterDropdown(
                'Gender',
                'gender',
                3,
                <div className="space-y-3">
                  {['Male', 'Female', 'Others'].map(gen => (
                    <label key={gen} className="flex items-center gap-3 group cursor-pointer" onClick={() => toggleGender(gen)}>
                      <input
                        readOnly
                        className="rounded border-[#c4c5d6] text-[#002691] focus:ring-[#002691] h-5 w-5 cursor-pointer"
                        type="checkbox"
                        checked={selectedGenders.includes(gen)}
                      />
                      <span className={`transition-colors ${selectedGenders.includes(gen) ? 'text-[#002691] font-semibold' : 'text-[#444654] group-hover:text-[#002691]'}`}>
                        {gen}
                      </span>
                    </label>
                  ))}
                </div>,
              )}

              {renderFilterDropdown(
                'Courses',
                'courses',
                COURSE_FILTER_OPTIONS.length,
                <div className="space-y-3">
                  {COURSE_FILTER_OPTIONS.map(course => (
                    <label key={course} className="flex items-center gap-3 group cursor-pointer" onClick={() => toggleCourse(course)}>
                      <input
                        readOnly
                        className="rounded border-[#c4c5d6] text-[#002691] focus:ring-[#002691] h-5 w-5 cursor-pointer"
                        type="checkbox"
                        checked={selectedCourses.includes(course)}
                      />
                      <span className={`transition-colors ${selectedCourses.includes(course) ? 'text-[#002691] font-semibold' : 'text-[#444654] group-hover:text-[#002691]'}`}>
                        {course}
                      </span>
                    </label>
                  ))}
                </div>,
              )}

              {renderFilterDropdown(
                'Religion',
                'minority',
                6,
                <div className="space-y-3">
                  {['Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi (Zoroastrian)'].map(min => (
                    <label key={min} className="flex items-center gap-3 group cursor-pointer" onClick={() => toggleMinority(min)}>
                      <input
                        readOnly
                        className="rounded border-[#c4c5d6] text-[#002691] focus:ring-[#002691] h-5 w-5 cursor-pointer"
                        type="checkbox"
                        checked={selectedMinority.includes(min)}
                      />
                      <span className={`transition-colors ${selectedMinority.includes(min) ? 'text-[#002691] font-semibold' : 'text-[#444654] group-hover:text-[#002691]'}`}>
                        {min}
                      </span>
                    </label>
                  ))}
                </div>,
              )}

              {renderFilterDropdown(
                'Select Class',
                'class',
                CLASS_FILTER_OPTIONS.length,
                <div className="space-y-3">
                  {CLASS_FILTER_OPTIONS.map(cls => (
                    <label key={cls} className="flex items-center gap-3 group cursor-pointer" onClick={() => toggleClass(cls)}>
                      <input
                        readOnly
                        className="rounded border-[#c4c5d6] text-[#002691] focus:ring-[#002691] h-5 w-5 cursor-pointer"
                        type="checkbox"
                        checked={selectedClasses.includes(cls)}
                      />
                      <span className={`transition-colors ${selectedClasses.includes(cls) ? 'text-[#002691] font-semibold' : 'text-[#444654] group-hover:text-[#002691]'}`}>
                        {cls}
                      </span>
                    </label>
                  ))}
                </div>,
              )}



            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1">

            {/* Sorting */}
            <div className="flex justify-end mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#757685]">Sort by:</span>
                <select 
                  className="bg-white border border-[#c4c5d6]/50 rounded-lg p-2 px-3 pr-8 text-sm text-[#181d1c] font-bold outline-none focus:ring-2 focus:ring-[#002691]/30 cursor-pointer shadow-sm appearance-none"
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23181d1c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right .7rem top 50%",
                    backgroundSize: ".65rem auto",
                  }}
                >
                  <option value="latest">Latest</option>
                  <option value="deadline">Deadline</option>
                  <option value="highest_amount">Highest Amount</option>
                </select>
              </div>
            </div>

            {/* Tabs & Results */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-[#c4c5d6]/20 gap-4">
              <div className="flex gap-8 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {(['live', 'upcoming', 'open'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 font-bold transition-all capitalize border-0 bg-transparent appearance-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${activeTab === tab ? 'text-[#002691] border-b-2 border-[#002691]' : 'text-[#757685] hover:text-[#002691]'}`}
                  >
                    {tab === 'live' ? `Live Scholarship (${tabCounts.live})` : tab === 'upcoming' ? `Upcoming Scholarship (${tabCounts.upcoming})` : `Always Open (${tabCounts.open})`}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end flex-shrink-0">
                <span className="text-sm font-bold text-[#444654] bg-[#e5e9e7] px-4 py-1.5 rounded-full">{sorted.length} results</span>
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedData.map(s => {
                const tagColor = TAG_COLORS[s.primaryTag] || TAG_COLORS['General'];
                const isClosedOrExpired = s.deadline.toLowerCase() === 'closed';
                return (
                  <article
                    key={s.id}
                    className="bg-white p-6 rounded-xl hover:shadow-lg transition-all duration-300 flex flex-col h-full group border border-[#e5e9e7] relative cursor-pointer pt-8"
                    onClick={() => navigate(`/scholarship/${s.id}`)}
                  >
                    {/* Tag Badge */}
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${tagColor}`}>
                      {s.primaryTag}
                    </span>

                    {/* Top Row: Logo & Date */}
                    <div className="flex justify-between items-start mb-8 mt-4">
                      <div className="flex items-center gap-2 h-8 w-32 justify-start">
                        <img src={s.logo || getLogo(s.id)} alt={`${s.name} logo`} className="h-full w-auto object-contain max-w-[120px]" />
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-[#181d1c]">calendar_month</span>
                        <span className={`text-sm font-bold mt-1 ${isClosedOrExpired ? 'text-[#ba1a1a]' : 'text-[#181d1c]'}`}>
                          {s.deadline}
                        </span>
                        {isClosedOrExpired && <span className="text-xs text-[#ba1a1a] font-black mt-1 uppercase tracking-tight">Closed</span>}
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-black uppercase text-[#181d1c] mb-6 leading-snug tracking-tight line-clamp-2">{s.name}</h2>

                    {/* Award */}
                    <div className="mb-6">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl leading-none drop-shadow-sm">🏆</span>
                        <div>
                          <p className="font-bold text-sm text-[#181d1c] mb-0.5">Award</p>
                          <p className="text-sm font-medium text-[#444654] leading-relaxed line-clamp-1">{s.award}</p>
                        </div>
                      </div>
                    </div>

                    {/* Section links */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {[
                        { label: 'About Scholarship', hash: '#about-scholarship' },
                        { label: 'Scholarship Eligibility', hash: '#scholarship-eligibility' },
                        { label: 'Benefits & Documents', hash: '#benefits-documents' },
                        { label: 'How to Apply', hash: '#how-to-apply' },
                      ].map((item) => (
                        <button
                          key={item.hash}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/scholarship/${s.id}${item.hash}`);
                          }}
                          className="text-xs text-left text-[#4c5585] hover:text-[#002691] transition-colors border border-[#d9deec] rounded-md px-2 py-1.5 bg-[#f8f9fc]"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Bottom line */}
                    <div className="flex gap-3 mt-auto pt-4 border-t border-[#e5e9e7]">
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#002691] text-white font-bold py-2.5 rounded-lg hover:bg-[#001556] transition-colors duration-200"
                      >
                        <span className="material-symbols-outlined text-base">send</span>
                        Apply Now
                      </button>
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="flex-1 flex items-center justify-center gap-2 bg-white text-[#002691] font-bold py-2.5 rounded-lg border border-[#002691]/30 hover:bg-[#f6faf8] transition-colors duration-200"
                      >
                        <span className="material-symbols-outlined text-base">psychology</span>
                        Mentor
                      </button>
                    </div>
                  </article>
                );
              })}

              {/* Counseling CTA card */}
              {currentPage === 1 && (
                <div className="relative group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#173cba] to-[#006c51] rounded-xl transform transition-transform group-hover:scale-[1.02]"></div>
                  <div className="relative h-full p-8 flex flex-col justify-center text-white min-h-[280px]">
                    <span className="material-symbols-outlined text-5xl mb-6 opacity-80">psychology</span>
                    <h3 className="text-2xl font-bold mb-4">Expert Indian Scholarship Counseling</h3>
                    <p className="text-white/80 mb-8 leading-relaxed">
                      Book a session with counselors who specialize in state-wise and private Indian CSR scholarships.
                    </p>
                    <button className="bg-white text-[#002691] font-black py-4 rounded-lg w-fit px-8 shadow-xl hover:shadow-2xl transition-all">
                      Talk to a Mentor
                    </button>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {sorted.length === 0 && (
                <div className="col-span-2 py-20 text-center text-[#444654]">
                  <span className="material-symbols-outlined text-6xl mb-4 block text-[#c4c5d6]">search_off</span>
                  <p className="text-xl font-bold">No scholarships found</p>
                  <p className="mt-2">Try clearing your filters or using a different search term.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-2 rounded-lg hover:bg-[#e5e9e7] text-[#757685] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  {getPageNumbers().map((n, idx) =>
                    typeof n === 'string' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-[#757685]">...</span>
                    ) : (
                      <button
                        key={n}
                        onClick={() => setCurrentPage(n)}
                        className={`w-10 h-10 rounded-lg font-bold transition-colors ${n === currentPage ? 'bg-[#002691] text-white' : 'hover:bg-[#e5e9e7] text-[#444654]'}`}
                      >
                        {n}
                      </button>
                    )
                  )}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-2 rounded-lg hover:bg-[#e5e9e7] text-[#757685] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#f0f4f2] w-full py-12 px-8 mt-24 border-t border-[#e5e9e7]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div>
            <Link to="/" className="block mb-4">
              <img src="/logo.png" alt="College Mentor" className="h-9 w-auto" />
            </Link>
            <p className="text-[#444654] text-sm leading-relaxed mb-6">
              Empowering Indian students through curated national and international opportunities.
            </p>
            <div className="flex gap-4">
              {['language', 'mail', 'groups'].map(icon => (
                <span key={icon} className="material-symbols-outlined text-[#c4c5d6] hover:text-[#002691] cursor-pointer">{icon}</span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[#002691] font-bold">Resources</h4>
            <ul className="space-y-2 text-sm text-[#444654]">
              {['State Govt Portals', 'NSP Guide', 'Success Stories'].map(l => (
                <li key={l}><a href="#" className="hover:text-[#002691] transition-all">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[#002691] font-bold">Links</h4>
            <ul className="space-y-2 text-sm text-[#444654]">
              {['Privacy Policy', 'Terms of Service', 'CSR Partners', 'Contact Support'].map(l => (
                <li key={l}><a href="#" className="hover:text-[#002691] transition-all">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[#002691] font-bold">Newsletter</h4>
            <p className="text-xs text-[#444654]">Get Indian scholarship alerts weekly.</p>
            <div className="flex gap-2">
              <input className="bg-white border-none rounded-lg text-sm px-4 py-2 w-full focus:ring-1 focus:ring-[#002691] outline-none" placeholder="Email" type="email" />
              <button className="bg-[#002691] text-white px-4 py-2 rounded-lg hover:bg-[#173cba] transition-colors">
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#dfe3e1] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#444654] text-sm">© 2024 Academic Curator India. All Rights Reserved.</p>
          <div className="flex gap-8">
            {['Twitter', 'LinkedIn', 'Instagram'].map(s => (
              <a key={s} href="#" className="text-[#444654] hover:text-[#002691] text-sm">{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
