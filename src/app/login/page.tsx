"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { DynamicLogo } from "@/components/core/logo";
// Optional: If you want toast notifications
// import { toast } from "@/components/core/toaster";

export default function LoginPage() {
  // (Optional) Falls du z.B. Query-Params abfragen willst
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [isPending, setIsPending] = React.useState(false);

  const handleDiscordSignIn = async () => {
    setIsPending(true);
    try {
      // Sagt NextAuth: "Mache OAuth-Login mit 'discord'"
      // callbackUrl: Wohin du nach erfolgreichem Login willst
      await signIn("discord", { callbackUrl });
    } catch (error) {
      // Falls du toast hast:
      // toast.error("Login failed, please try again.");
      console.error(error);
      setIsPending(false);
    }
  };

  return (
    <Stack
      spacing={4}
      sx={{
        width: "100%",
        maxWidth: 400,
        mx: "auto",
        px: 2,
        minHeight: "100vh",         // Der Container ist mind. so groß wie das Browser-Fenster
        justifyContent: "center",   // Stack-Items werden vertikal zentriert
      }}
    >
      {/* Logo-Bereich */}
      <Box sx={{ textAlign: "center" }}>
        <DynamicLogo colorDark="light" colorLight="dark" height={100} width={350} />
      </Box>

      {/* Überschrift */}
      <Stack spacing={1} alignItems="center">
        <Typography variant="h5">Login SIF Dashboard</Typography>
        <Typography color="text.secondary" variant="body2">
          Du kannst Dich über Discord Einloggen
        </Typography>
      </Stack>

      {/* Nur ein Button für Discord */}
      <Button
        onClick={handleDiscordSignIn}
        disabled={isPending}
        variant="contained"
        color="primary"
        size="large"
      >
        Mit Discord Einloggen
      </Button>

      {/* Optionaler Footer-Link */}
      <Typography variant="body2" color="text.secondary" align="center">
        Du hast keinen Account?{" "}
        <Link href="https://discord.com/register" target="_blank" underline="hover">
          Erstelle einen
        </Link>
      </Typography>
    </Stack>
  );
}
