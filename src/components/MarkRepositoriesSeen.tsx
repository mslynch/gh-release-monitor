import Button from "@material-ui/core/Button";
import { Set, Map } from "immutable";
import React, { Dispatch, SetStateAction } from "react";
import repoDao, { Repo } from "../lib/database";
import { getRepoId } from "../lib/util";

interface Props {
  selectedRepos: Set<string>;
  setSelectedRepos: Dispatch<SetStateAction<Set<string>>>;
  repos: Map<string, Repo>;
  setRepos: Dispatch<SetStateAction<Map<string, Repo>>>;
}

export default function DeleteRepositories(props: Props) {
  const handleClick = () => {
    const updatedRepos = props.selectedRepos.reduce(
      (acc, repoId) =>
        acc.set(repoId, { ...props.repos.get(repoId)!, isNew: false }),
      Map() as Map<string, Repo>
    );
    props.setRepos(props.repos.merge(updatedRepos));
    props.setSelectedRepos(Set());
    props.repos
      .filter((repo) => props.selectedRepos.has(getRepoId(repo)))
      .forEach((repo) => {
        repoDao.put({ ...repo, isNew: false });
      });
  };

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClick}>
        Mark as seen
      </Button>
    </>
  );
}
