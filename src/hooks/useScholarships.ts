import { useEffect, useState } from 'react';
import type { Scholarship } from '../data/scholarships';
import {
  loadCSVData,
  loadXLSXData,
  convertCSVToScholarship,
  applyFiltersFromXLSX,
  filterScholarships,
} from '../data/dataLoader';

export interface FilterCriteria {
  searchTerm?: string;
  tag?: string;
  minAmount?: number;
  maxAmount?: number;
  urgentOnly?: boolean;
}

interface UseScholarshipsReturn {
  scholarships: Scholarship[];
  filteredScholarships: Scholarship[];
  loading: boolean;
  error: string | null;
  filterCriteria: FilterCriteria;
  setFilterCriteria: (criteria: FilterCriteria) => void;
  availableTags: string[];
}

/**
 * Hook to load and manage scholarships from CSV and XLSX files
 */
export const useScholarships = (): UseScholarshipsReturn => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({});

  useEffect(() => {
    const loadScholarships = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load CSV data
        const csvData = await loadCSVData('/Scholarships-detail-page.csv');

        // Load XLSX filter data
        const xlsxData = await loadXLSXData('/Scholarships-Information --- 1.xlsx');

        // Convert CSV to Scholarship format
        let scholarshipList: Scholarship[] = csvData.map((csv, index) =>
          convertCSVToScholarship(csv, index + 1)
        );

        // Apply XLSX filters
        if (xlsxData.length > 0) {
          scholarshipList = applyFiltersFromXLSX(scholarshipList, xlsxData);
        }

        setScholarships(scholarshipList);
        setFilteredScholarships(scholarshipList);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load scholarships';
        setError(errorMessage);
        console.error('Error loading scholarships:', err);
      } finally {
        setLoading(false);
      }
    };

    loadScholarships();
  }, []);

  // Apply filters whenever criteria or scholarships change
  useEffect(() => {
    const filtered = filterScholarships(scholarships, filterCriteria);
    setFilteredScholarships(filtered);
  }, [filterCriteria, scholarships]);

  // Get unique tags from scholarships
  const availableTags = Array.from(new Set(scholarships.map((s) => s.tag)));

  return {
    scholarships,
    filteredScholarships,
    loading,
    error,
    filterCriteria,
    setFilterCriteria,
    availableTags,
  };
};
