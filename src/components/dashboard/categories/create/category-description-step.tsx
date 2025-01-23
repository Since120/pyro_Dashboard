"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { TextEditor } from "@/components/core/text-editor/text-editor"; 
// <-- Falls du deinen Editor hast
import type { EditorEvents } from "@tiptap/react";

export interface CategoryDescriptionStepProps {
  onBack?: () => void;
  onNext?: () => void;
}

/**
 * Schritt 3: Beschreibung
 */
export function CategoryDescriptionStep({ onBack, onNext }: CategoryDescriptionStepProps) {
  const [content, setContent] = React.useState<string>("");

  // Tiptap-Update-Callback
  const handleContentChange = React.useCallback(
    ({ editor }: EditorEvents["update"]) => {
      setContent(editor.getText());
    },
    []
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={3}>
        <div>
          <Typography variant="h6">How would you describe this category?</Typography>
        </div>

        {/* Editor */}
        <Box sx={{ "& .tiptap-container": { height: "400px" } }}>
          <TextEditor
            content={content}
            placeholder="Write something..."
            onUpdate={handleContentChange}
          />
        </Box>
      </Stack>

      {/* Buttons */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
        <Button color="secondary" onClick={onBack} startIcon={<ArrowLeftIcon />}>
          Back
        </Button>
        <Button variant="contained" onClick={onNext}>
          Confirm creation
        </Button>
      </Stack>
    </Stack>
  );
}
