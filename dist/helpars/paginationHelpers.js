const Pagination = (option) => {
    const page = Number(option.page) || 1;
    const limit = Number(option.limit) || 10;
    const skip = (Number(page) - 1) * limit;
    const sortBy = option.sortBy || 'createdAt';
    const sortOrder = option.sortOrder || 'desc';
    const partyType = option.partyType || 'PARTY';
    return {
        page, limit, skip, sortBy, sortOrder, partyType
    };
};
export const paginationHelper = {
    Pagination
};
