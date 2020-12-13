import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import React from "react";

interface Props {
  owner: string;
  name: string;
  version: string;
}

//

export default function RepoNameLink(props: Props) {
  return (
    <Typography>
      <Link
        href={`https://github.com/${props.owner}/${props.name}/releases/tag/${props.version}`}
      >
        {props.version}
      </Link>
    </Typography>
  );
}
