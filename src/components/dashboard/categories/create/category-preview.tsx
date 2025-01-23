import type * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Check as CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";

export function CategoryPreview(): React.JSX.Element {
  return (
    <Stack spacing={2}>
      {/* Grünes Icon */}
      <Avatar
        sx={{
          "--Icon-fontSize": "var(--icon-fontSize-lg)",
          bgcolor: "var(--mui-palette-success-main)",
          color: "var(--mui-palette-success-contrastText)",
        }}
      >
        <CheckIcon fontSize="var(--Icon-fontSize)" />
      </Avatar>

      <div>
        <Typography variant="h6">All done!</Typography>
        <Typography variant="body2" color="text.secondary">
          Here&apos;s a preview of your newly created category
        </Typography>
      </div>

      {/* Beispiel-Card als "Erfolgsmeldung" */}
      <Card variant="outlined">
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
          }}
        >
          <div>
            <Typography variant="subtitle1">My new category name</Typography>
            <Typography variant="caption" color="text.secondary">
              Some additional info about the category ...
            </Typography>
          </div>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography color="text.secondary" variant="caption">
              Just created
            </Typography>
            <Button size="small">Go to categories</Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
