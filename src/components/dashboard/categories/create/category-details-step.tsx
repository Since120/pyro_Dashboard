"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import type { Dayjs } from "dayjs";
import { dayjs } from "@/lib/dayjs";

interface CategoryDetailsStepProps {
  onBack?: () => void;
  onNext?: () => void;
}

export function CategoryDetailsStep({ onNext, onBack }: CategoryDetailsStepProps) {
  // State für Tags
  const [tagValue, setTagValue] = React.useState("");
  const [tags, setTags] = React.useState<Set<string>>(new Set());

  const handleTagAdd = React.useCallback(() => {
    if (!tagValue) return;
    setTags((prev) => new Set(prev).add(tagValue));
    setTagValue("");
  }, [tagValue]);

  const handleTagDelete = React.useCallback((tag: string) => {
    setTags((prev) => {
      const copy = new Set(prev);
      copy.delete(tag);
      return copy;
    });
  }, []);

  // State für Datum
  const [startDate, setStartDate] = React.useState<Date | null>(dayjs().toDate());
  const [endDate, setEndDate] = React.useState<Date | null>(dayjs().add(1, "month").toDate());

  const handleStartDateChange = React.useCallback((newValue: Dayjs | null) => {
    setStartDate(newValue?.toDate() ?? null);
  }, []);

  const handleEndDateChange = React.useCallback((newValue: Dayjs | null) => {
    setEndDate(newValue?.toDate() ?? null);
  }, []);

  return (
    <Stack spacing={4}>
      {/* Block 1: Kategorie-Name + Tags */}
      <Stack spacing={3}>
        <div>
          <Typography variant="h6">Kategorie Details</Typography>
        </div>

        {/* Eingabefelder */}
        <Stack spacing={3}>
          <FormControl>
            <OutlinedInput
              placeholder="Kategorie Name"
              name="categoryTitle"
              // label geht bei OutlinedInput nur über <InputLabel>, hier zur Vereinfachung weggelassen
            />
          </FormControl>

          <FormControl>
            <OutlinedInput
              placeholder="Add some tags"
              name="tags"
              value={tagValue}
              onChange={(e) => setTagValue(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <Button color="secondary" size="small" onClick={handleTagAdd}>
                    Add
                  </Button>
                </InputAdornment>
              }
            />
          </FormControl>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", alignItems: "center" }}>
            {[...tags].map((tag) => (
              <Chip key={tag} label={tag} onDelete={() => handleTagDelete(tag)} variant="outlined" />
            ))}
          </Stack>
        </Stack>
      </Stack>

      {/* NEU: Titel + Switches in einer Reihe */}
      <Stack spacing={2}>
        <Typography variant="h6">Optionen</Typography>
        <Stack
          direction="row"
          spacing={3}
          sx={{ flexWrap: "wrap" }} // Hiermit erzwingst du das automatische Umbrechen
          >
          <FormControlLabel control={<Switch />} label="Member Only" />
          <FormControlLabel control={<Switch />} label="Tracking" />
          <FormControlLabel control={<Switch />} label="Hervorheben" />
          <FormControlLabel control={<Switch />} label="Beta" />
        </Stack>
      </Stack>

      {/* Block 2: Datumseingaben */}
      <Stack spacing={3}>
        <div>
          <Typography variant="h6">When is this category relevant?</Typography>
        </div>
        <Stack direction="row" spacing={3}>
          <DatePicker
            format="MMM D, YYYY"
            label="Start date"
            value={dayjs(startDate)}
            onChange={handleStartDateChange}
            sx={{ flex: "1 1 auto" }}
          />
          <DatePicker
            format="MMM D, YYYY"
            label="End date"
            value={dayjs(endDate)}
            onChange={handleEndDateChange}
            sx={{ flex: "1 1 auto" }}
          />
        </Stack>
      </Stack>

      {/* Block 3: Buttons „Back“ / „Weiter“ */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
        <Button color="secondary" startIcon={<ArrowLeftIcon />} onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" endIcon={<ArrowRightIcon />} onClick={onNext}>
          Weiter
        </Button>
      </Stack>
    </Stack>
  );
}
