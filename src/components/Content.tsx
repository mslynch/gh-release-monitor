import { makeStyles } from "@material-ui/core/styles";
import { Map, Set } from "immutable";
import React, { useEffect, useState } from "react";
import repoDao, { Repo } from "../lib/database";
import getRepoInfo from "../lib/get-repo-info";
import { getRepoId } from "../lib/util";
import Actions from "./Actions";
import RepoTable from "./RepoTable";

interface Props {}
const useStyles = makeStyles({
  content: {
    width: 960,
    margin: "auto",
  },
});

export default function Content(props: Props) {
  const [repos, setRepos] = useState(Map() as Map<string, Repo>);
  const [selectedRepos, setSelectedRepos] = useState(Set());

  const loadData = async () => {
    const retrievedRepos = await repoDao.getAll();
    const newRepoPromises = retrievedRepos.map(getRepoInfo);
    const newRepos = await Promise.all(newRepoPromises);
    const newRepoMap = newRepos.reduce(
      (acc, repo) => acc.set(getRepoId(repo), repo),
      Map() as Map<string, Repo>
    );
    setRepos(newRepoMap);
  };

  useEffect(() => {
    loadData();
  }, []);

  const classes = useStyles();

  return (
    <div className={classes.content}>
      <Actions
        repos={repos}
        setRepos={setRepos}
        selectedRepos={selectedRepos}
        setSelectedRepos={setSelectedRepos}
      />
      <RepoTable
        repos={repos}
        selectedRepos={selectedRepos}
        setSelectedRepos={setSelectedRepos}
      />
    </div>
  );
}
