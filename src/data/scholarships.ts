export interface Scholarship {
  id: number;
  tag: string;
  tagColor: string;
  title: string;
  amount: string;
  deadline: string;
  deadlineUrgent: boolean;
  grantAmount?: string;
  boardResult?: string;
  familyIncome?: string;
  studyIn?: string;
  description?: string;
  eligibility?: string[];
  benefits?: { title: string; value: string }[];
}
