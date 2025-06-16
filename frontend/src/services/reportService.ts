import api from './api';
import { BranchReport, OverallReport } from '../types';
import { format } from 'date-fns';

interface GetReportsParams {
  startDate: Date;
  endDate: Date;
  branchCode?: String; // Optional
}

export const getReports = async ({
  startDate,
  endDate,
  branchCode,
}: GetReportsParams): Promise<BranchReport | OverallReport> => {
  try {
    const response = await api.get('/report', {
      params: {
        start: format(startDate, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        end: format(endDate, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        branchCode, // Optional parameter for branch-specific reports
      },
    });

    const data = response.data;

    if (branchCode) {
      // Assume it's a BranchReport when type is provided
      return data as BranchReport;
    } else {
      // Default to OverallReport
      return data as OverallReport;
    }
  } catch (error) {
    console.error('Failed to fetch report:', error);
    throw error;
  }
};


