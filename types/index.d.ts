export module Types {
  export interface SearchResults {
    repositories: any[];
    total_count: number;
  }

  export interface RepositoriesData {
    id: number;
    repositoryName: string;
    usernames: string[];
  }

  export interface TableProps {
    rows: RepositoriesData[];
    totalCount: number;
    page: number;
    rowsPerPage: number;
    loading: boolean;
    onChangePage: (newPage: number) => void;
    onRowsPerPage: (newRowsPerPage: number) => void;
  }

  export interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number
    ) => void;
  }
}
