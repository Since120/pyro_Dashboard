"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Switch,
  Autocomplete
} from "@mui/material";

import { useRouter } from "next/navigation";

import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import dynamic from "next/dynamic";

// ---- DUMMY TYP-OPTIONEN (unverändert) ----
const categoryOptions = [
  {
    title: "Allianz Ebene",
    description: "Ein Zonenbereich für die Allianz eröffnen",
    value: "freelancers",
    disabled: false,
  },
  {
    title: "Organisation Ebene",
    description: "Eröffnet einen Zonenbereich für die Organisation",
    value: "contractors",
    disabled: false,
  },
  {
    title: "Sub Organisation Ebene",
    description: "Zonenbereich für die Suborganisation (Nicht Sichtbar für Nicht-Mitglieder)",
    value: "employees",
    disabled: false,
  },
] as const;

// ---- LINIEN-Auswahl (unverändert) ----
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

// ---- EMOJI-PICKER (unverändert) ----
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

// ---- DATEN-INTERFACE (unverändert) ----
interface CategoryData {
  id: string;
  categoryType: string; // z.B. "freelancers"
  name: string;         // z.B. "═══ Mining 🛠️ ═════════"
  tags: string[];       // ["FPS Team", "Releas the Quaken"]
  isVisible: boolean;   // z.B. true
}

interface CategoryEditFormProps {
  category: CategoryData;
}

/** Einfache Edit-Form in einer Seite */
export function CategoryEditForm({ category }: CategoryEditFormProps) {
  const router = useRouter();

  // 1) State: Category Type
  const [categoryType, setCategoryType] = useState(category.categoryType);

  // 2) State: Category Name
  const [name, setName] = useState(category.name);

  // 3) State: Tags
  // Wir speichern sie als Set<string>, konvertieren für Autocomplete zu string[]
  const [tags, setTags] = useState<Set<string>>(new Set(category.tags));

  // 4) State: Sichtbarkeit
  const [isVisible, setIsVisible] = useState<boolean>(category.isVisible);

  // Popover-States für Emoji und Linien
  const [emojiAnchor, setEmojiAnchor] = React.useState<HTMLButtonElement | null>(null);
  const [linesAnchor, setLinesAnchor] = React.useState<HTMLButtonElement | null>(null);

  // Popover-Logik (unverändert)
  const openEmojiPopover = (e: React.MouseEvent<HTMLButtonElement>) => {
    setEmojiAnchor(e.currentTarget);
  };
  const closeEmojiPopover = () => {
    setEmojiAnchor(null);
  };

  const openLinesPopover = (e: React.MouseEvent<HTMLButtonElement>) => {
    setLinesAnchor(e.currentTarget);
  };
  const closeLinesPopover = () => {
    setLinesAnchor(null);
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setName((prev) => prev + " " + emojiData.emoji);
  };

  const handleLineInsert = (line: string) => {
    setName((prev) => prev + " " + line);
    closeLinesPopover();
  };

  // Handler für das Autocomplete: 
  // newValue ist ein string[] => wir packen es in ein Set
  const handleTagsChange = (event: unknown, newValue: string[]) => {
    setTags(new Set(newValue));
  };

  // Handler: Speichern
  const handleSave = useCallback(async () => {
    try {
      const payload = {
        name,
        categoryType,
        isVisible,
        // tags => falls du "allowedRoles" in DB nimmst, anpassen:
        allowedRoles: Array.from(tags), 
      };
  
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const errData = await res.json();
        alert(`Fehler beim Update: ${errData.error ?? res.statusText}`);
        return;
      }
  
      const updated = await res.json();
      alert(`Kategorie aktualisiert: ${updated.name}`);
      router.push("/dashboard/categories");
    } catch (err) {
      console.error("handleSave error:", err);
      alert("Unerwarteter Fehler beim Update: " + String(err));
    }
  }, [category.id, name, categoryType, isVisible, tags, router]);
  

  // Handler: Löschen
  const handleDelete = useCallback(async () => {
    if (!window.confirm("Wirklich löschen?")) return;
  
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(`Fehler beim Löschen: ${errData.error ?? res.statusText}`);
        return;
      }
  
      alert("Kategorie gelöscht.");
      router.push("/dashboard/categories");
    } catch (err) {
      console.error("handleDelete error:", err);
      alert("Fehler beim Löschen: " + String(err));
    }
  }, [category.id, router]);
  
  

  return (
    <Stack spacing={4}>
      {/* Kategorietyp */}
      <Stack spacing={3}>
        <div>
          <Typography variant="h6">Kategorie-Typ</Typography>
        </div>
        <RadioGroup
          onChange={(e) => setCategoryType(e.target.value)}
          value={categoryType}
          sx={{
            "& .MuiFormControlLabel-root": {
              border: "1px solid var(--mui-palette-divider)",
              borderRadius: 1,
              gap: 2,
              p: 2,
              position: "relative",
              "&::before": {
                borderRadius: "inherit",
                bottom: 0,
                content: '" "',
                left: 0,
                pointerEvents: "none",
                position: "absolute",
                right: 0,
                top: 0,
              },
              "&.Mui-disabled": {
                bgcolor: "var(--mui-palette-background-level1)",
              },
            },
          }}
        >
          {categoryOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              control={<Radio />}
              value={option.value}
              disabled={option.disabled}
              label={
                <div>
                  <Typography
                    variant="inherit"
                    sx={{
                      color: option.disabled
                        ? "var(--mui-palette-action-disabled)"
                        : "var(--mui-palette-text-primary)",
                    }}
                  >
                    {option.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: option.disabled
                        ? "var(--mui-palette-action-disabled)"
                        : "var(--mui-palette-text-secondary)",
                    }}
                  >
                    {option.description}
                  </Typography>
                </div>
              }
              sx={{
                ...(option.value === categoryType && {
                  "&::before": {
                    boxShadow: "0 0 0 2px var(--mui-palette-primary-main)",
                  },
                }),
              }}
            />
          ))}
        </RadioGroup>
      </Stack>

      {/* Kategorie-Name + Buttons (Emoji + Linien) + Hinweis */}
      <Stack spacing={3}>
        <div>
          <Typography variant="h6">Kategorie Details</Typography>
        </div>

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
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            inputProps={{
              style: { textTransform: "uppercase" },
            }}
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

        <Typography variant="body2" color="text.secondary" sx={{ mt: -1 }}>
          Hinweis: Kategorien in Discord werden grundsätzlich in GROSSBUCHSTABEN angezeigt.
        </Typography>

        {/* Autocomplete für Tags (Access) */}
        <Box>
          <Autocomplete
            multiple
            freeSolo
            options={["Releas the Quaken", "FPS Team"]} // Dummy-Optionen
            value={[...tags]} // Konvertiere Set -> Array
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
        </Box>
      </Stack>

      {/* Switch: Sichtbarkeit */}
      <Stack spacing={2}>
        <Typography variant="h6">Optionen</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
            />
          }
          label="Kategorie Sichtbar?"
        />
      </Stack>

      {/* Footer: Buttons „Löschen“ / „Speichern“ */}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button color="error" variant="outlined" onClick={handleDelete}>
          Löschen
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Änderungen speichern
        </Button>
      </Stack>
    </Stack>
  );
}