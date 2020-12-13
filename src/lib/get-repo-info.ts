import { Octokit } from "@octokit/rest";
import { Repo } from "./database";

const octokit = new Octokit();

export default async function getRepoInfo(repo: Repo): Promise<Repo> {
  const releaseResponse = await octokit.repos.listReleases({
    owner: repo.owner,
    repo: repo.name,
  });
  const latestRelease =
    releaseResponse.data.length > 0 ? releaseResponse.data[0] : undefined;
  const discoveredVersion = latestRelease?.tag_name;
  return {
    owner: repo.owner,
    name: repo.name,
    latestVersion: latestRelease?.tag_name,
    releaseDate: latestRelease?.published_at
      ? new Date(latestRelease.published_at)
      : undefined,
    isNew: repo.isNew || repo.latestVersion !== discoveredVersion,
  };
}
