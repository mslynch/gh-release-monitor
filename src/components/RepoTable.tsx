import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Map, Set } from "immutable";
import React, { Dispatch, SetStateAction } from "react";
import { Repo } from "../lib/database";
import RepoNameLink from "./RepoNameLink";
import RepoReleaseLink from "./RepoReleaseLink";

interface Props {
  repos: Map<string, Repo>;
  selectedRepos: Set<string>;
  setSelectedRepos: Dispatch<SetStateAction<Set<string>>>;
}

export default function RepoTable(props: Props) {
  const masterChecked = props.selectedRepos.size > 0;

  const handleMasterCheckClick = () => {
    if (masterChecked) {
      props.setSelectedRepos(Set());
    } else {
      props.setSelectedRepos(Set(props.repos.keys()));
    }
  };

  const sortedRepos = props.repos.sort((a, b) => {
    if (a.isNew === b.isNew) {
      return (b.releaseDate?.getTime() || 0) - (a.releaseDate?.getTime() || 0);
    }
    return +b.isNew - +a.isNew;
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                checked={masterChecked}
                onClick={handleMasterCheckClick}
              />
            </TableCell>
            <TableCell>Repository</TableCell>
            <TableCell>Latest version</TableCell>
            <TableCell>Release date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRepos.entrySeq().map((entry: [string, Repo]) => {
            const [repoId, repo] = entry;
            const checked = props.selectedRepos.has(repoId);
            const handleCheckClick = () => {
              if (checked) {
                props.setSelectedRepos(props.selectedRepos.delete(repoId));
              } else {
                props.setSelectedRepos(props.selectedRepos.add(repoId));
              }
            };
            return (
              <TableRow key={repoId}>
                <TableCell>
                  <Checkbox checked={checked} onClick={handleCheckClick} />
                </TableCell>
                <TableCell component="th" scope="row">
                  <RepoNameLink
                    owner={repo.owner}
                    name={repo.name}
                    isNew={repo.isNew}
                  />
                </TableCell>
                <TableCell>
                  {repo.latestVersion && (
                    <RepoReleaseLink
                      owner={repo.owner}
                      name={repo.name}
                      version={repo.latestVersion}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {repo.releaseDate?.toISOString().split("T")[0]}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
