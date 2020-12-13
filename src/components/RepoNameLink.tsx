import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

interface Props {
  owner: string;
  name: string;
  isNew: boolean;
}

const useStyles = makeStyles((theme) => ({
  newNotification: {
    color: theme.palette.warning.main,
    paddingLeft: 5,
  },
}));

export default function RepoNameLink(props: Props) {
  const classes = useStyles();

  return (
    <div style={{ display: "flex" }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href={`https://github.com/${props.owner}`}>{props.owner}</Link>
        <Link href={`https://github.com/${props.owner}/${props.name}`}>
          {props.name}
        </Link>
      </Breadcrumbs>
      {props.isNew && <sup className={classes.newNotification}>(new)</sup>}
    </div>
  );
}
