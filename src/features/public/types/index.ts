import { DANGKITOCHUCHIENMAU_WithRelations } from "@/types";

export interface PaginationInfo {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface EventsResponse {
    data: DANGKITOCHUCHIENMAU_WithRelations[];
    pagination: PaginationInfo;
}
