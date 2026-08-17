type IOptions = {
        page?:number,
        limit?: number, 
        sortBy?:string, 
    sortOrder?: string,
    partyType?: string
}

type IOptionResult = {
    page:number,
    limit:number,
    skip:number,
    sortBy:string,
    sortOrder: string,
    partyType: string
}
const Pagination = (option:IOptions ):IOptionResult => {
    const page:number = Number(option.page) || 1;
    const limit:number = Number(option.limit) || 10;
    const skip:number = (Number(page)-1)*limit
    const sortBy:string = option.sortBy || 'createdAt';
    const sortOrder: string = option.sortOrder || 'desc';
    const partyType = option.partyType || 'PARTY';
    return {
        page, limit, skip, sortBy, sortOrder, partyType
    }
    }


    export const paginationHelper = {
        Pagination
    }