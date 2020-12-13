import { Repo } from "./database";

export function getRepoId(repo: Repo): string {
  return `${repo.owner},${repo.name}`;
}
