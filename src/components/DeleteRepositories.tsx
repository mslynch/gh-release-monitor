import Button from "@material-ui/core/Button";
import { Map, Set } from "immutable";
import React, { Dispatch, SetStateAction } from "react";
import repoDao, { Repo } from "../lib/database";

interface Props {
  selectedRepos: Set<string>;
  setSelectedRepos: Dispatch<SetStateAction<Set<string>>>;
  setRepos: Dispatch<SetStateAction<Map<string, Repo>>>;
}

export default function DeleteRepositories(props: Props) {
  const handleClick = () => {
    props.setRepos((repos) => repos.deleteAll(props.selectedRepos));
    props.setSelectedRepos(Set());
    props.selectedRepos.forEach((repo) => {
      const key = repo.split(",");
      repoDao.delete(key);
    });
  };

  return (
    <>
      {
        <Button variant="outlined" color="primary" onClick={handleClick}>
          Delete selected
        </Button>
      }
    </>
  );
}
