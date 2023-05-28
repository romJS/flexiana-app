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
    prefetchedNext: RepositoriesData[];
    prefetchedPrev: RepositoriesData[];
    totalCount: number;
    page: number;
    rowsPerPage: number;
    loading: boolean;
    prefetchLoading: boolean;
    onChangePage: (newPage: number) => void;
    onRowsPerPage: (newRowsPerPage: number) => void;
    setRows: (newRows: RepositoriesData[]) => void;
  }

  export interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    prefetchLoading: boolean;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number
    ) => void;
  }
}
