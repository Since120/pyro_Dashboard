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
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import type { Dayjs } from "dayjs";
import { dayjs } from "@/lib/dayjs";

// NEU: Zusätzliche Importe:
import { IconButton, Popover, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import dynamic from "next/dynamic";
// Wir laden das Emoji-Picker-Paket dynamisch, um SSR-Probleme zu vermeiden
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });
// Beispiel-Icons (kannst du natürlich ersetzen)
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

// Beispiel-Linien/Sonderzeichen, die eingefügt werden können
const LINES = [
  "─", "──", "───", "────", "─────",
  "═", "══", "═══", "════", "═════", "══════", "════════",
  "╔", "╗", "╚", "╝", "╠", "╣", "╬",
  "╔══", "══╗", "╚══", "══╝", "╠══", "══╣",
  "█", "██", "███", "▓", "▒", "░",
  "〓〓〓", "〓〓〓〓〓", "〓〓〓〓〓〓〓",
  "━", "━━", "━━━━", "━━━━━", "┃",
  "～", "〜", "〰", "﹏",
  "꧁", "꧂",
  "◆", "◇", "■", "□", "●", "○", "◎", "◉", "△", "▽",
  "★", "☆", "✦", "✧", "✪", "✯", "✰",
  "→", "⇒", "➜", "➤", "➔", "►", "➢", "➠",
  "←", "⇐", "◄", "⬅",
  "❀", "✿", "❃", "♥", "❤", "♡", "❥",
  "♪", "♫", "♬", "♭", "♯",
  "━━━━━━━━", "━━━━━━━━━━", "━━━━━━━━━━━━"
];

interface CategoryDetailsStepProps {
  // neu: Props, um die Werte zu lesen
  name: string;
  tags: string[];
  isVisible: boolean;

  // wir geben Änderungen an den Eltern weiter
  onChange: (partial: Partial<{ name: string; tags: string[]; isVisible: boolean }>) => void;

  onBack?: () => void;
  onNext?: () => void;
}

export function CategoryDetailsStep({
  name,
  tags,
  isVisible,
  onChange,
  onNext,
  onBack,
}: CategoryDetailsStepProps) {
  // Alle anderen Felder (Datum etc.) lassen wir so, falls du sie irgendwann brauchst
  const [startDate, setStartDate] = React.useState<Date | null>(dayjs().toDate());
  const [endDate, setEndDate] = React.useState<Date | null>(dayjs().add(1, "month").toDate());

  const handleStartDateChange = React.useCallback((newValue: Dayjs | null) => {
    setStartDate(newValue?.toDate() ?? null);
  }, []);

  const handleEndDateChange = React.useCallback((newValue: Dayjs | null) => {
    setEndDate(newValue?.toDate() ?? null);
  }, []);

  // Ref für das Textfeld (so bleiben deine bisherigen Logiken unangetastet)
  const categoryTitleRef = React.useRef<HTMLInputElement | null>(null);

  // Popover-States für Emoji und Linien
  const [emojiAnchor, setEmojiAnchor] = React.useState<HTMLButtonElement | null>(null);
  const [linesAnchor, setLinesAnchor] = React.useState<HTMLButtonElement | null>(null);

  // Emoji-Popover
  const openEmojiPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setEmojiAnchor(event.currentTarget);
  };
  const closeEmojiPopover = () => {
    setEmojiAnchor(null);
  };

  // Linien-Popover
  const openLinesPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLinesAnchor(event.currentTarget);
  };
  const closeLinesPopover = () => {
    setLinesAnchor(null);
  };

  // Emoji einfügen
  const handleEmojiClick = (emojiData: { emoji: string }) => {
    if (!categoryTitleRef.current) return;
    const currentValue = categoryTitleRef.current.value;
    categoryTitleRef.current.value = currentValue + " " + emojiData.emoji;
    // Wir updaten den "name" in den Eltern-State
    onChange({ name: categoryTitleRef.current.value.toUpperCase() });
  };

  // Linien einfügen
  const handleLineInsert = (line: string) => {
    if (!categoryTitleRef.current) return;
    const currentValue = categoryTitleRef.current.value;
    categoryTitleRef.current.value = currentValue + " " + line;
    closeLinesPopover();
    // Updaten
    onChange({ name: categoryTitleRef.current.value.toUpperCase() });
  };

  // *** WICHTIG: Name-Änderung => set in onChange
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ name: e.target.value.toUpperCase() });
  };

  // *** Switch: isVisible
  const handleVisibleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ isVisible: e.target.checked });
  };

  // *** Tags => wir nutzen Autocomplete. 
  // => transform (string[]) => in onChange({ tags: [...] })
  const handleTagsChange = (event: unknown, newValue: string[]) => {
    onChange({ tags: newValue });
  };

  React.useEffect(() => {
    // Falls name != "", ins categoryTitleRef eintragen
    if (categoryTitleRef.current) {
      categoryTitleRef.current.value = name;
    }
  }, [name]);

  return (
    <Stack spacing={4}>
      {/* Block 1: Kategorie-Name + Tags */}
      <Stack spacing={3}>
        <div>
          <Typography variant="h6">Kategorie Details</Typography>
        </div>

        {/* Eingabefeld + Picker-Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "stretch", sm: "flex-end" }}
        >
          <TextField
            variant="outlined"
            label="Kategorie Name"
            name="categoryTitle"
            placeholder="z.B. '═══ Mining 🛠️ ═════════'"
            inputRef={categoryTitleRef}
            defaultValue={name}
            // => Text groß anzeigen
            inputProps={{
              style: { textTransform: "uppercase" },
            }}
            onChange={handleNameChange}
            sx={{ flex: 1 }}
          />

          {/* Emoji/Linien Buttons */}
          <Stack direction="row" spacing={1}>
            <IconButton onClick={openEmojiPopover}>
              <EmojiEmotionsIcon />
            </IconButton>
            <Popover
              open={Boolean(emojiAnchor)}
              anchorEl={emojiAnchor}
              onClose={closeEmojiPopover}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <Box sx={{ p: 1 }}>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </Box>
            </Popover>

            <IconButton onClick={openLinesPopover}>
              <MoreHorizIcon />
            </IconButton>
            <Popover
              open={Boolean(linesAnchor)}
              anchorEl={linesAnchor}
              onClose={closeLinesPopover}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <List dense sx={{ minWidth: 100 }}>
                {LINES.map((line) => (
                  <ListItem key={line} disablePadding>
                    <ListItemButton onClick={() => handleLineInsert(line)}>
                      <ListItemText primary={line} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Popover>
          </Stack>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mt: -2.5 }}>
          Hinweis: Kategorien in Discord werden grundsätzlich in GROSSBUCHSTABEN angezeigt.
        </Typography>

        {/* Autocomplete für Tags */}
        <Autocomplete
          multiple
          freeSolo
          options={["Releas the Quaken", "FPS Team"]} // Beispiel
          value={tags}
          onChange={handleTagsChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Wer hat Zugang?"
              placeholder="Tippe und drücke Enter"
            />
          )}
        />
      </Stack>

      {/* Titel + Switches in einer Reihe */}
      <Stack spacing={2}>
        <Typography variant="h6">Optionen</Typography>
        <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
          <FormControlLabel
            control={
              <Switch
                checked={isVisible}
                onChange={handleVisibleChange}
              />
            }
            label="Kategorie Sichtbar?"
          />
        </Stack>
      </Stack>

      {/* Buttons „Back“ / „Weiter“ */}
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
