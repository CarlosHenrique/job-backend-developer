export class GetMovieReviewsFilterDto {
  sortRelease?: SortDirectionEnum;
  sortRating?: SortDirectionEnum;
  search?: string;
}

export class PaginationDto {
  pageSize: number;
  pageNumber: number;
}

export const DefaultPageable: PaginationDto = {
  pageSize: 2,
  pageNumber: 1,
};
export enum SortDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}
