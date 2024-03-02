export class GetMovieReviewsFilterDto {
  sortRelease?: SortDirectionEnum;
  sortRating?: SortDirectionEnum;

  search?: string;
}
export enum SortDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}
