import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'Data');
const logosSourceDir = path.join(dataDir, 'logos');
const logosOutputDir = path.join(rootDir, 'public', 'logos');
const outputFile = path.join(rootDir, 'src', 'data', 'scholarshipData.ts');

const csvFileOrder = [
  'Class(11-12)-live-detailPage.csv',
  'Class(1-10)-live-detailPage.csv',
  'Girls-live-detailPage.csv',
  'Graduation-live-detailPage.csv',
  'Girls-upcoming-detailPage.csv',
  'Gujarat-upcoming-detailPage.csv',
];

const normalizeSpace = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const normalizeName = (value) => normalizeSpace(value).replace(/\u0000/g, '');
const toLower = (value) => normalizeSpace(value).toLowerCase();
const detectCsvStatus = (fileName) => {
  const lower = fileName.toLowerCase();
  if (lower.includes('upcoming')) return 'upcoming';
  if (lower.includes('always-open') || lower.includes('always open')) return 'open';
  if (lower.includes('open')) return 'open';
  return 'live';
};
const normalizeLogoPath = (value) => {
  const fileName = normalizeSpace(value).replace(/\\/g, '/').split('/').filter(Boolean).pop();
  return fileName ? `/logos/${fileName}` : '';
};
const splitValues = (value) =>
  normalizeSpace(value)
    .split(',')
    .map((part) => normalizeSpace(part))
    .filter(Boolean);

const unique = (values) => [...new Set(values.filter(Boolean))];

const stateMap = new Map([
  ['maharashtra', 'Maharashtra'],
  ['karnataka', 'Karnataka'],
  ['gujarat', 'Gujarat'],
  ['uttar pradesh', 'Uttar Pradesh'],
  ['rajasthan', 'Rajasthan'],
  ['madhya pradesh', 'Madhya Pradesh'],
  ['bihar', 'Bihar'],
  ['telangana', 'Telangana'],
]);

const classMap = new Map([
  ['class 1-10', 'Class 1 10'],
  ['class1-10', 'Class 1 10'],
  ['class 11-12', 'Class 11 12'],
  ['class11-12', 'Class 11 12'],
  ['polytechnic-diploma-iti', 'Polytechnic Diploma ITI'],
  ['graduation', 'Graduation'],
  ['post-graduation', 'Post Graduation'],
  ['post graduation', 'Post Graduation'],
]);

const categoryMap = new Map([
  ['girls scholarships', 'Girls Scholarship'],
  ['girls scholarship', 'Girls Scholarship'],
  ['sc/st/obc scholarships', 'SC-ST-OBC'],
  ['sc/st/obc scholarship', 'SC-ST-OBC'],
  ['sc st obc', 'SC-ST-OBC'],
  ['minority', 'Minority'],
  ['physically disabled', 'Physically Disabled'],
  ['sports-talent', 'Sports'],
  ['sports talent', 'Sports'],
  ['merit-based', 'Merit Based'],
  ['merit based', 'Merit Based'],
  ['income-based', 'Means Based'],
  ['income based', 'Means Based'],
  ['visual-art', 'Visual Art'],
  ['visual art', 'Visual Art'],
  ['cultural-talent', 'Cultural'],
  ['cultural talent', 'Cultural'],
  ['literary-art', 'Literary Art'],
  ['literary art', 'Literary Art'],
  ['study abroad scholarships in india', 'Study Abroad'],
  ['study abroad scholarships in in', 'Study Abroad'],
  ['study abroad', 'Study Abroad'],
  ['internationals', 'International'],
  ['international', 'International'],
  ['none', null],
  ['', null],
]);

const tagOrder = [
  'Girls Scholarship',
  'Study Abroad',
  'International',
  'Means Based',
  'Merit Based',
  'Sports',
  'Cultural',
  'Visual Art',
  'Literary Art',
  'General',
];

const csvFieldAliases = {
  detailedEligibility: ['Eligibility_Detail', 'Detailed_Eligibility'],
  howToApply: ['How_to_Apply'],
  benefits: ['Benefits'],
  about: ['About'],
  link: ['Link'],
  deadline: ['Deadline'],
  award: ['Award'],
  eligibility: ['Eligibility'],
  documents: ['Documents'],
  importantDates: ['Important_Dates'],
  selectionCriteria: ['Selection_Criteria'],
  terms: ['Terms_and_Conditions'],
  contact: ['Contact_Details'],
  importantLinks: ['Important_Links'],
  faqs: ['FAQs'],
  relativePath: ['Relative_Path'],
  logo: ['Logo'],
};

const getFirst = (row, keys) => {
  for (const key of keys) {
    const value = row[key];
    const text = normalizeSpace(value);
    if (text) return text;
  }
  return '';
};

const mergeText = (...parts) => unique(parts.map(normalizeSpace).filter(Boolean)).join(' ');

const normalizeRow = (row) => {
  const name = normalizeName(row.Name);
  if (!name) return null;

  const detailedEligibility = mergeText(
    getFirst(row, csvFieldAliases.detailedEligibility),
    getFirst(row, csvFieldAliases.selectionCriteria),
    getFirst(row, csvFieldAliases.terms)
  );

  const howToApply = mergeText(
    getFirst(row, csvFieldAliases.howToApply),
    getFirst(row, csvFieldAliases.documents),
    getFirst(row, csvFieldAliases.contact),
    getFirst(row, csvFieldAliases.importantLinks)
  );

  const about = mergeText(getFirst(row, csvFieldAliases.about));
  const benefits = mergeText(getFirst(row, csvFieldAliases.benefits), getFirst(row, csvFieldAliases.importantDates));

  return {
    name,
    link: getFirst(row, csvFieldAliases.link),
    deadline: getFirst(row, csvFieldAliases.deadline),
    award: getFirst(row, csvFieldAliases.award),
    eligibility: getFirst(row, csvFieldAliases.eligibility),
    about,
    detailedEligibility,
    benefits,
    howToApply,
    relativePath: getFirst(row, csvFieldAliases.relativePath),
    logo: getFirst(row, csvFieldAliases.logo),
    logoUrl: normalizeLogoPath(getFirst(row, csvFieldAliases.logo)),
  };
};

const parseCsvFiles = () => {
  const files = fs
    .readdirSync(dataDir)
    .filter((file) => file.endsWith('.csv'))
    .sort((a, b) => {
      const ai = csvFileOrder.indexOf(a);
      const bi = csvFileOrder.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

  const merged = new Map();

  for (const fileName of files) {
    const fileStatus = detectCsvStatus(fileName);
    const filePath = path.join(dataDir, fileName);
    const csvText = fs.readFileSync(filePath, 'utf8');
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true, dynamicTyping: false });

    for (const rawRow of parsed.data) {
      const row = normalizeRow(rawRow);
      if (!row) continue;

      const existing = merged.get(row.name) ?? { statuses: new Set() };
      const statuses = existing.statuses ?? new Set();
      statuses.add(fileStatus);
      merged.set(row.name, {
        name: row.name,
        link: existing.link || row.link,
        deadline: existing.deadline || row.deadline,
        award: existing.award || row.award,
        eligibility: existing.eligibility || row.eligibility,
        about: existing.about || row.about,
        detailedEligibility: existing.detailedEligibility || row.detailedEligibility,
        benefits: existing.benefits || row.benefits,
        howToApply: existing.howToApply || row.howToApply,
        relativePath: existing.relativePath || row.relativePath,
        logo: existing.logo || row.logo,
        logoUrl: existing.logoUrl || row.logoUrl,
        statuses,
      });
    }
  }

  return merged;
};

const sheetToState = {
  'Maharashtra': 'Maharashtra',
  'Karnataka': 'Karnataka',
  'Gujarat': 'Gujarat',
  'Uttar-Pradesh': 'Uttar Pradesh',
  'Rajasthan': 'Rajasthan',
  'Madhya-Pradesh': 'Madhya Pradesh',
  'Bihar': 'Bihar',
  'Telangana': 'Telangana',
};

const sheetToClass = {
  'Class(1-10)': 'Class 1 10',
  'Class(11-12)': 'Class 11 12',
  'Polytechnic-Diploma-ITI ': 'Polytechnic Diploma ITI',
  'Graduation': 'Graduation',
  'Post-Graduation': 'Post Graduation',
};

const sheetToCategory = {
  'Girls-Scholarships': 'Girls Scholarship',
  'SC-ST-OBC': 'SC-ST-OBC',
  'Minority': 'Minority',
  'Physically-Disabled': 'Physically Disabled',
  'Sports-Talent': 'Sports',
  'Income-based': 'Means Based',
  'Merit-based': 'Merit Based',
  'Cultural-talent': 'Cultural',
  'Visual-Art': 'Visual Art',
  'Literary-Art': 'Literary Art',
  'Study-Abroad-scholarships-in-In': 'Study Abroad',
  'International': 'International',
};

const extractMembershipFilters = () => {
  const workbook = XLSX.readFile(path.join(dataDir, 'Scholarships-Information --- 1.xlsx'));
  const byName = new Map();

  for (const sheetName of workbook.SheetNames) {
    if (sheetName === 'Master-data' || sheetName === 'Live-Scholarships' || sheetName === 'Upcoming-Scholarships' || sheetName === 'Categories-wise') {
      continue;
    }

    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    for (const row of rows.slice(2)) {
      const name = normalizeName(row[0]);
      if (!name) continue;

      const current = byName.get(name) ?? {
        states: new Set(),
        classes: new Set(),
        categories: new Set(),
      };

      if (sheetToState[sheetName]) current.states.add(sheetToState[sheetName]);
      if (sheetToClass[sheetName]) current.classes.add(sheetToClass[sheetName]);
      if (sheetToCategory[sheetName]) current.categories.add(sheetToCategory[sheetName]);

      byName.set(name, current);
    }
  }

  return byName;
};

const decidePrimaryTag = (filters) => {
  const categories = [...(filters?.categories ?? [])];

  const has = (label) => categories.some((value) => toLower(value) === toLower(label));

  if (has('Girls Scholarship')) return 'Girls Scholarship';
  if (has('Study Abroad')) return 'Study Abroad';
  if (has('International')) return 'International';
  if (has('Sports')) return 'Sports';
  if (has('Cultural')) return 'Cultural';
  if (has('Visual Art')) return 'Visual Art';
  if (has('Literary Art')) return 'Literary Art';
  if (has('Means Based') || has('SC-ST-OBC') || has('Minority') || has('Physically Disabled')) return 'Means Based';
  if (has('Merit Based')) return 'Merit Based';
  return 'General';
};

const generate = () => {
  if (fs.existsSync(logosSourceDir)) {
    fs.mkdirSync(logosOutputDir, { recursive: true });
    fs.cpSync(logosSourceDir, logosOutputDir, { recursive: true });
  }

  const records = parseCsvFiles();
  const filtersByName = extractMembershipFilters();

  const data = [];
  let id = 1;

  for (const [name, row] of records.entries()) {
    const filters = filtersByName.get(name) ?? { categories: [], states: [], classes: [] };
    const primaryTag = decidePrimaryTag(filters);
    const categories = unique([...filters.categories]);
    const states = unique([...filters.states]);
    const classes = unique([...filters.classes]);

    data.push({
      id,
      name,
      link: row.link,
      deadline: row.deadline,
      award: row.award,
      eligibility: row.eligibility,
      about: row.about,
      detailedEligibility: row.detailedEligibility,
      benefits: row.benefits,
      howToApply: row.howToApply,
      logo: row.logoUrl,
      statuses: unique([...row.statuses]).sort((a, b) => ['live', 'upcoming', 'open'].indexOf(a) - ['live', 'upcoming', 'open'].indexOf(b)),
      primaryTag,
      states,
      classes,
      categories,
    });
    id += 1;
  }

  const allTags = unique([
    'General',
    ...data.map((item) => item.primaryTag),
  ]).filter(Boolean);

  const allStates = unique(data.flatMap((item) => item.states));
  const allClasses = unique(data.flatMap((item) => item.classes));
  const allCategories = unique(data.flatMap((item) => item.categories));

  const fileContent = `// Auto-generated from CSV + XLSX data. Do not edit manually.\n// Generated by scripts/generate-scholarship-data.mjs\n\nexport interface ScholarshipData {\n  id: number;\n  name: string;\n  link: string;\n  deadline: string;\n  award: string;\n  eligibility: string;\n  about: string;\n  detailedEligibility: string;\n  benefits: string;\n  howToApply: string;\n  logo?: string;\n  statuses: string[];\n  primaryTag: string;\n  states: string[];\n  classes: string[];\n  categories: string[];\n}\n\nexport const SCHOLARSHIP_DATA: ScholarshipData[] = ${JSON.stringify(data, null, 2)};\n\nexport const ALL_TAGS: string[] = ${JSON.stringify(allTags, null, 2)};\nexport const ALL_FILTER_STATES: string[] = ${JSON.stringify(allStates, null, 2)};\nexport const ALL_FILTER_CLASSES: string[] = ${JSON.stringify(allClasses, null, 2)};\nexport const ALL_FILTER_CATEGORIES: string[] = ${JSON.stringify(allCategories, null, 2)};\n`;

  fs.writeFileSync(outputFile, fileContent, 'utf8');
  console.log(`Generated ${data.length} scholarship records.`);
  console.log(`Wrote ${outputFile}`);
};

generate();
