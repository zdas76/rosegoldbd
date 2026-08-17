export type IPaginationOptions = {
    page?: number;
    limit?: number;
    sortBy?: string | undefined;
    sortOrder?: string | undefined;
    startDate?: string | null;
    endDate?: string | null;
}