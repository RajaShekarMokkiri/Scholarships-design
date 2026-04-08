import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { Scholarship } from './scholarships';

/**
 * Interface for CSV data from Scholarships-detail-page.csv
 */
export interface CSVScholarship {
  Name: string;
  Link?: string;
  Deadline: string;
  Award: string;
  Eligibility: string;
  About: string;
  Detailed_Eligibility: string;
  Benefits: string;
  How_to_Apply: string;
}

/**
 * Interface for XLSX filter data
 */
export interface XLSXFilterData {
  'Scholarship Name': string;
  'Filter Category'?: string;
  'Filter Value'?: string;
  [key: string]: unknown;
}

/**
 * Load CSV data from file or fetch
 */
export const loadCSVData = async (filePath: string): Promise<CSVScholarship[]> => {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse<CSVScholarship>(csvText, {
        header: true,
        dynamicTyping: false,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<CSVScholarship>) => {
          resolve(results.data);
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Error loading CSV data:', error);
    return [];
  }
};

/**
 * Load XLSX data from file
 */
export const loadXLSXData = async (filePath: string): Promise<XLSXFilterData[]> => {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json<XLSXFilterData>(sheet);
    return data;
  } catch (error) {
    console.error('Error loading XLSX data:', error);
    return [];
  }
};

/**
 * Convert CSV scholarship data to application Scholarship format
 */
export const convertCSVToScholarship = (csv: CSVScholarship, id: number): Scholarship => {
  return {
    id,
    tag: 'External', // You can enhance this with category detection
    tagColor: 'bg-blue-100 text-blue-900',
    title: csv.Name || '',
    amount: csv.Award || 'Varies',
    deadline: csv.Deadline || 'Not specified',
    deadlineUrgent: isDeadlineSoon(csv.Deadline),
    grantAmount: csv.Award,
    studyIn: 'India', // Default, can be updated from XLSX filters
    description: csv.About || csv.Detailed_Eligibility,
    eligibility: csv.Eligibility ? [csv.Eligibility] : [],
    benefits: csv.Benefits 
      ? [{ title: 'Benefits', value: csv.Benefits }]
      : [],
  };
};

/**
 * Check if deadline is within 30 days (urgent)
 */
export const isDeadlineSoon = (dateString: string): boolean => {
  if (!dateString || dateString === 'N/A') return false;
  
  try {
    const deadline = new Date(dateString);
    const today = new Date();
    const daysUntilDeadline = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysUntilDeadline <= 30 && daysUntilDeadline > 0;
  } catch {
    return false;
  }
};

/**
 * Apply XLSX filter data to scholarships
 */
export const applyFiltersFromXLSX = (
  scholarships: Scholarship[],
  filterData: XLSXFilterData[]
): Scholarship[] => {
  return scholarships.map((scholarship) => {
    const matchingFilter = filterData.find(
      (filter) =>
        filter['Scholarship Name']?.toLowerCase() === scholarship.title.toLowerCase()
    );

    if (matchingFilter) {
      return {
        ...scholarship,
        tag: matchingFilter['Filter Category'] as string || scholarship.tag,
        familyIncome: matchingFilter['Family Income'] as string,
        boardResult: matchingFilter['Board Result'] as string,
        studyIn: matchingFilter['Study In'] as string || scholarship.studyIn,
      };
    }

    return scholarship;
  });
};

/**
 * Filter scholarships based on criteria
 */
export const filterScholarships = (
  scholarships: Scholarship[],
  criteria: {
    searchTerm?: string;
    tag?: string;
    minAmount?: number;
    maxAmount?: number;
    urgentOnly?: boolean;
  }
): Scholarship[] => {
  return scholarships.filter((scholarship) => {
    // Search term filter
    if (criteria.searchTerm) {
      const search = criteria.searchTerm.toLowerCase();
      if (
        !scholarship.title.toLowerCase().includes(search) &&
        !scholarship.description?.toLowerCase().includes(search) &&
        !scholarship.eligibility?.some((e) => e.toLowerCase().includes(search))
      ) {
        return false;
      }
    }

    // Tag filter
    if (criteria.tag && scholarship.tag !== criteria.tag) {
      return false;
    }

    // Urgent only filter
    if (criteria.urgentOnly && !scholarship.deadlineUrgent) {
      return false;
    }

    return true;
  });
};
