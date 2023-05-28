import { useSession } from "next-auth/react";
import { getRepositoriesData } from "@/services";
import { useEffect, useState } from "react";
import { CustomTable } from "@/components/CustomTable";

import { useDebounce } from "@/hooks";
import CircularProgress from "@mui/material/CircularProgress";
import { Types } from "@/types";
import { TextField } from "@mui/material";

export const Repositories = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [repositories, setRepositories] = useState<Types.RepositoriesData[]>(
    []
  );
  const [prefetchedNext, setPrefetchedNext] = useState<
    Types.RepositoriesData[]
  >([]);
  const [prefetchedPrev, setPrefetchedPrev] = useState<
    Types.RepositoriesData[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [prefetchLoading, setPrefetchLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const TOTAL_COUNT = 1000;

  const { data: session } = useSession();

  const fetchRepositories = async () => {
    if (session && searchQuery) {
      setLoading(true);
      try {
        const data = await getRepositoriesData(
          session.accessToken,
          searchQuery,
          page,
          rowsPerPage
        );
        if (data) {
          setRepositories(data.repositoriesData);
          const prefetchedNext = await prefetchRepositories(1);
          if (prefetchedNext) {
            setPrefetchedNext(prefetchedNext);
          }
        }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        alert(error.message);
      }
    } else {
      setRepositories([]);
    }
  };

  const prefetchRepositories = async (numOfPrefetchedPage: number) => {
    if (session && searchQuery) {
      try {
        const data = await getRepositoriesData(
          session.accessToken,
          searchQuery,
          page + numOfPrefetchedPage,
          rowsPerPage
        );
        if (data) {
          return data.repositoriesData;
        }
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    const prefetching = async () => {
      setPrefetchLoading(true);

      if (page === 0) {
        await fetchRepositories();
      }

      if (page > 0 && page < TOTAL_COUNT / rowsPerPage - 1) {
        const prefetchedNext = await prefetchRepositories(1);
        if (prefetchedNext) {
          setPrefetchedNext(prefetchedNext);
        }
      }
      if (page === TOTAL_COUNT / rowsPerPage - 1) {
        const fetchData = await prefetchRepositories(0);
        if (fetchData) {
          setRepositories(fetchData);
        }
      }
      if (page > 0) {
        const prefetchedPrev = await prefetchRepositories(-1);
        if (prefetchedPrev) {
          setPrefetchedPrev(prefetchedPrev);
        }
      }
      setPrefetchLoading(false);
    };

    prefetching();
  }, [page, rowsPerPage]);

  const debouncedFetchRepositories = useDebounce(fetchRepositories, 1000);

  return (
    <div className="flex flex-col m-2 items-center">
      <div className="m-4">
        <TextField
          id="outlined-basic"
          label="Search in repositories"
          variant="outlined"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            debouncedFetchRepositories();
            setSearchQuery(e.target.value);
          }}
        />
      </div>

      {loading && !repositories.length && <CircularProgress />}
      {repositories.length > 0 && (
        <CustomTable
          rows={repositories}
          prefetchedNext={prefetchedNext}
          prefetchedPrev={prefetchedPrev}
          totalCount={TOTAL_COUNT}
          page={page}
          loading={loading}
          prefetchLoading={prefetchLoading}
          rowsPerPage={rowsPerPage}
          onChangePage={setPage}
          onRowsPerPage={setRowsPerPage}
          setRows={setRepositories}
        />
      )}
    </div>
  );
};
