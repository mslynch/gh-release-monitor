import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import React, { Dispatch, SetStateAction, useState } from "react";
import repoDao, { Repo } from "../lib/database";
import getRepoInfo from "../lib/get-repo-info";
import { getRepoId } from "../lib/util";
import { Map } from "immutable";

interface Props {
  setRepos: Dispatch<SetStateAction<Map<string, Repo>>>;
}

export default function AddRepository(props: Props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUrl("");
  };

  const [url, setUrl] = useState("");

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  let urlValidationErrorMessage = null;
  let parsedPath: string[];
  if (url) {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.host !== "github.com") {
        urlValidationErrorMessage = "Only Github repositories are supported.";
      } else {
        parsedPath = parsedUrl.pathname.split("/");
        if (parsedPath.length !== 3) {
          urlValidationErrorMessage =
            "Please enter the URL of a Github repository.";
        }
      }
    } catch (err) {
      urlValidationErrorMessage = "Enter a valid URL.";
    }
  }

  const isError = !!urlValidationErrorMessage;

  const handleAdd = async () => {
    const [, owner, repoName] = parsedPath;
    const newRepo = await getRepoInfo({ owner, name: repoName, isNew: true });
    props.setRepos((repos) => repos.set(getRepoId(newRepo), newRepo));
    repoDao.add(newRepo);
    handleClose();
  };

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add repository
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">Add repository</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"Enter the URL of a repository to add (e.g. "}
            <Link href="https://github.com/facebook/react">
              https://github.com/facebook/react
            </Link>
            ).
          </DialogContentText>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
          >
            <TextField
              value={url}
              onChange={handleUrlChange}
              error={isError}
              helperText={urlValidationErrorMessage}
              autoFocus
              margin="dense"
              id="url"
              label="Repository URL"
              type="url"
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            color="primary"
            disabled={!url || isError}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
