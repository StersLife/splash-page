export const validateReportId = (reportId) => {
    if (!reportId || typeof reportId !== 'string' || !reportId.trim()) {
      throw new Error('Valid report ID is required');
    }
  };
  