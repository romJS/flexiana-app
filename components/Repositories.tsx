import { useSession } from "next-auth/react";
import { getRepositoriesData } from "@/services";
import { useEffect, useState } from "react";
import { CustomTable } from "@/components/CustomTable";

import { useDebounce } from "@/hooks";
import CircularProgress from "@mui/material/CircularProgress";
import { Types } from "@/types";
import { TextField } from "@mui/material";
import ControlledSwitch from "./ControlledSwitch";

export const Repositories = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [repositories, setRepositories] = useState<Types.RepositoriesData[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [checked, setChecked] = useState<boolean>(false);

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
          setTotalCount(data.totalCount);
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

  useEffect(() => {
    fetchRepositories();
  }, [page, rowsPerPage]);

  const debouncedFetchRepositories = useDebounce(fetchRepositories, 1000);

  return (
    <div className="flex flex-col m-2 items-center">
      <ControlledSwitch
        onChecked={setChecked}
        label="Limited / original count"
      />
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
          totalCount={checked ? totalCount : 1000}
          page={page}
          loading={loading}
          rowsPerPage={rowsPerPage}
          onChangePage={setPage}
          onRowsPerPage={setRowsPerPage}
        />
      )}
    </div>
  );
};
