import React, { Dispatch, SetStateAction } from "react";
import DeleteRepositories from "./DeleteRepositories";
import { Repo } from "../lib/database";
import AddRepository from "./AddRepository";
import { Map, Set } from "immutable";
import MarkRepositoriesSeen from "./MarkRepositoriesSeen";
import { Box, makeStyles } from "@material-ui/core";

interface Props {
  selectedRepos: Set<string>;
  setSelectedRepos: Dispatch<SetStateAction<Set<string>>>;
  repos: Map<string, Repo>;
  setRepos: Dispatch<SetStateAction<Map<string, Repo>>>;
}

const useStyles = makeStyles({
  actionButtons: {
    display: "flex",
    paddingTop: 18,
    paddingBottom: 18,
  },
});

export default function Actions(props: Props) {
  const classes = useStyles();

  const anyMarkableAsSeen = props.selectedRepos
    .map((repoId) => props.repos.get(repoId)?.isNew)
    .find((it) => it || false);

  return (
    <div className={classes.actionButtons}>
      <AddRepository setRepos={props.setRepos} />
      {anyMarkableAsSeen && (
        <>
          <Box m={0.5} />
          <MarkRepositoriesSeen
            repos={props.repos}
            setRepos={props.setRepos}
            selectedRepos={props.selectedRepos}
            setSelectedRepos={props.setSelectedRepos}
          />
        </>
      )}

      {props.selectedRepos.size > 0 && (
        <>
          <Box m={0.5} />
          <DeleteRepositories
            setRepos={props.setRepos}
            selectedRepos={props.selectedRepos}
            setSelectedRepos={props.setSelectedRepos}
          />
        </>
      )}
    </div>
  );
}
