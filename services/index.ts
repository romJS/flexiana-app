import axios from "axios";
import { Types } from "../types";

const get = async (url: string, accessToken: string) =>
  axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

async function getRepositories(
  accessToken: string,
  searchQuery: string,
  page: number,
  rowsPerPage: number
): Promise<Types.SearchResults | undefined> {
  try {
    const response = await get(
      `https://api.github.com/search/repositories?q=${searchQuery}&per_page=${rowsPerPage}&page=${page}`,
      accessToken
    );

    return {
      repositories: response.data.items,
      total_count: response.data.total_count,
    };
  } catch (error: any) {
    console.error("Error searching for repositories:", error.message);
    throw new Error(error.response.data.message);
  }
}

export async function getRepositoriesData(
  accessToken: string,
  searchQuery: string,
  page: number,
  rowsPerPage: number
) {
  const repositoriesData = [];
  try {
    const searchResults = await getRepositories(
      accessToken,
      searchQuery,
      page,
      rowsPerPage
    );

    if (!searchResults) return;
    const { repositories } = searchResults;

    for (const repository of repositories) {
      const contributorsResponse = await get(
        repository.contributors_url,
        accessToken
      );

      const contributors = contributorsResponse.data as Array<{
        login: string;
      }>;

      if (!contributors) continue;
      const usernames = contributors.map((contributor) => contributor.login);

      const data: Types.RepositoriesData = {
        id: repository.id,
        repositoryName: repository.full_name,
        usernames,
      };

      repositoriesData.push(data);
    }

    return { repositoriesData, totalCount: searchResults.total_count };
  } catch (error: any) {
    console.error("Error fetch repositories data:", error.message);
    throw error;
  }
}
