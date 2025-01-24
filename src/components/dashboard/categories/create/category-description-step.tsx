"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Stack,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider
} from "@mui/material";
import { ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon } from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";

// 1) Tiptap: Dynamischer Import (SSR-Vermeidung)
const TiptapEditor = dynamic(() => import("./tiptap-description"), { ssr: false });

// 2) Typen für Embed-Felder
interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordEmbed {
  title: string;
  description: string;
  color: string;
  authorName?: string;
  authorIcon?: string;
  footerText?: string;
  footerIcon?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  timestamp?: boolean;
  fields: EmbedField[];
}

// 3) Props für Step-Komponente
export interface CategoryDescriptionStepProps {
  onBack?: () => void;
  onNext?: () => void;
}

// 4) Hauptkomponente
export function CategoryDescriptionStep({ onBack, onNext }: CategoryDescriptionStepProps) {
  // State für das gesamte Embed
  const [embed, setEmbed] = useState<DiscordEmbed>({
    title: "",
    description: "",
    color: "#2f3136",
    authorName: "",
    authorIcon: "",
    footerText: "",
    footerIcon: "",
    thumbnailUrl: "",
    imageUrl: "",
    timestamp: false,
    fields: []
  });

  // Handlers
  const handleChange = (field: keyof DiscordEmbed) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmbed((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleTimestamp = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmbed((prev) => ({ ...prev, timestamp: e.target.checked }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.trim();
    if (!val.startsWith("#")) {
      val = "#" + val;
    }
    setEmbed((prev) => ({ ...prev, color: val }));
  };

  // Tiptap-Editor Update
  const handleDescriptionUpdate = useCallback((newContent: string) => {
    setEmbed((prev) => ({ ...prev, description: newContent }));
  }, []);

  // Fields
  const addField = () => {
    setEmbed((prev) => ({
      ...prev,
      fields: [...prev.fields, { name: "", value: "", inline: false }]
    }));
  };

  const removeField = (index: number) => {
    setEmbed((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const updateField = (index: number, fieldName: keyof EmbedField, value: string | boolean) => {
    setEmbed((prev) => {
      const fieldsCopy = [...prev.fields];
      fieldsCopy[index] = { ...fieldsCopy[index], [fieldName]: value };
      return { ...prev, fields: fieldsCopy };
    });
  };

  return (
    <Stack spacing={4}>
      {/* Kopfzeile */}
      <Stack spacing={2}>
        <Typography variant="h6">Schritt 3: Erstelle deinen Discord-Embed</Typography>
        <Typography variant="body2" color="text.secondary">
          Links: Felder bearbeiten, Rechts: Live-Vorschau
        </Typography>
      </Stack>

      {/* Zweispaltenlayout, aber ab unter 1600px => Preview unten */}
      <Box
        sx={{
          display: "flex",
          gap: 4,
          // Standard: "row"
          flexDirection: "row",
          alignItems: "stretch",
          "@media (max-width: 1600px)": {
            // <1600px => Spaltenweise, Preview unten
            flexDirection: "column"
          }
        }}
      >
        {/* LEFT: Formular-Eingaben */}
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Stack spacing={2}>
            {/* Title */}
            <TextField
              label="Embed Title"
              placeholder="Max. 256 Zeichen"
              value={embed.title}
              onChange={handleChange("title")}
              inputProps={{ maxLength: 256 }}
            />

            {/* Color */}
            <TextField
              label="Embed Color (HEX)"
              placeholder="#ffffff"
              value={embed.color}
              onChange={handleColorChange}
            />

            {/* Author */}
            <TextField
              label="Author Name"
              placeholder="(Optional)"
              value={embed.authorName}
              onChange={handleChange("authorName")}
            />
            <TextField
              label="Author Icon URL"
              placeholder="https://example.com/icon.png"
              value={embed.authorIcon}
              onChange={handleChange("authorIcon")}
            />

            {/* Description (Tiptap) */}
            <Typography variant="subtitle2">Description (Markdown erlaubt)</Typography>
            {/* (1) Entferne den äußeren Rahmen, damit kein "Feld im Feld"-Eindruck entsteht */}
            <Box sx={{ bgcolor: "background.paper", minHeight: 10 }}>
              <TiptapEditor
                content={embed.description}
                onContentChange={handleDescriptionUpdate}
              />
            </Box>

            {/* Fields */}
            <Divider />
            <Typography variant="subtitle2">Fields (max. 25)</Typography>
            {embed.fields.map((f, idx) => (
              <Box
                key={idx}
                sx={{ border: "1px solid #666", p: 1, borderRadius: 1, mb: 1 }}
              >
                <Stack spacing={1}>
                  <TextField
                    label="Field Name"
                    value={f.name}
                    onChange={(e) => updateField(idx, "name", e.target.value)}
                  />
                  <TextField
                    label="Field Value"
                    multiline
                    rows={2}
                    value={f.value}
                    onChange={(e) => updateField(idx, "value", e.target.value)}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(f.inline)}
                        onChange={(e) => updateField(idx, "inline", e.target.checked)}
                      />
                    }
                    label="Inline?"
                  />
                  <Button color="error" onClick={() => removeField(idx)}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
            {embed.fields.length < 25 && (
              <Button variant="outlined" onClick={addField}>
                + Add Field
              </Button>
            )}
            <Divider />

            {/* Footer */}
            <TextField
              label="Footer Text"
              placeholder="(Optional)"
              value={embed.footerText}
              onChange={handleChange("footerText")}
            />
            <TextField
              label="Footer Icon URL"
              placeholder="(Optional)"
              value={embed.footerIcon}
              onChange={handleChange("footerIcon")}
            />

            {/* Thumbnail, Image */}
            <TextField
              label="Thumbnail URL"
              placeholder="(Optional)"
              value={embed.thumbnailUrl}
              onChange={handleChange("thumbnailUrl")}
            />
            <TextField
              label="Image URL"
              placeholder="(Optional)"
              value={embed.imageUrl}
              onChange={handleChange("imageUrl")}
            />

            <FormControlLabel
              control={<Checkbox checked={embed.timestamp} onChange={handleTimestamp} />}
              label="Zeitstempel aktivieren"
            />
          </Stack>
        </Box>

        {/* RIGHT: Sticky Preview */}
        <Box
          sx={{
            flex: 1,
            minWidth: "300px",
            maxWidth: "300px",
            // (2) Sticky-Vorschau
            position: "sticky",
            top: 20, // Abstand von oben, damit es nicht unterm Header verschwindet
            alignSelf: "flex-start"
          }}
        >
          <EmbedPreview embed={embed} />
        </Box>
      </Box>

      {/* Footer-Buttons: Back / Weiter */}
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

// 5) Preview-Komponente
function EmbedPreview({ embed }: { embed: DiscordEmbed }) {
  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "#2f3136",
        color: "#fff",
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
        p: 2,
        fontFamily: "sans-serif",
        overflow: "hidden",
        wordBreak: "break-word"
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 2,
          bottom: 2,
          left: 2,
          width: "4px",
          borderRadius: 2,
          backgroundColor: embed.color
        }}
      />

      <Box sx={{ ml: 2 }}>
        {embed.authorName && (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            {embed.authorIcon && (
              <Box
                component="img"
                src={embed.authorIcon}
                alt="Author icon"
                sx={{ width: 24, height: 24, borderRadius: "50%" }}
              />
            )}
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              {embed.authorName}
            </Typography>
          </Stack>
        )}

        {embed.title && (
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            {embed.title}
          </Typography>
        )}

        {embed.thumbnailUrl && (
          <Box
            component="img"
            src={embed.thumbnailUrl}
            alt="Thumbnail"
            sx={{
              width: 60,
              height: 60,
              position: "absolute",
              top: 16,
              right: 16,
              borderRadius: 1
            }}
          />
        )}

        {embed.description && (
          <Box sx={{ mb: 1 }}>
            <ReactMarkdown>{embed.description}</ReactMarkdown>
          </Box>
        )}

        {embed.fields.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {embed.fields.map((f, i) => (
              <Box
                key={i}
                sx={{
                  flex: f.inline ? "0 0 calc(50% - 8px)" : "1 1 100%",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  p: 1,
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  {f.name}
                </Typography>
                <ReactMarkdown>{f.value}</ReactMarkdown>
              </Box>
            ))}
          </Box>
        )}

        {embed.imageUrl && (
          <Box
            component="img"
            src={embed.imageUrl}
            alt="EmbedImage"
            sx={{ maxWidth: "100%", mt: 1, borderRadius: 2 }}
          />
        )}

        {(embed.footerText || embed.timestamp) && (
          <Box
            sx={{
              mt: 1,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              pt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.8rem"
            }}
          >
            {embed.footerIcon && (
              <Box
                component="img"
                src={embed.footerIcon}
                alt="Footer icon"
                sx={{ width: 20, height: 20, borderRadius: "50%" }}
              />
            )}
            <Box>
              {embed.footerText && <span>{embed.footerText}</span>}
              {embed.timestamp && (
                <span style={{ marginLeft: embed.footerText ? 8 : 0 }}>
                  • {new Date().toLocaleString()}
                </span>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
