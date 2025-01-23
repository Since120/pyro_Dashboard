"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import type { StepIconProps } from "@mui/material/StepIcon";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { Check as CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";

import { CategoryTypeStep } from "./category-type-step";
import { CategoryDetailsStep } from "./category-details-step";
import { CategoryDescriptionStep } from "./category-description-step";
import { CategoryPreview } from "./category-preview";

/** Eigenes StepIcon (Kästchen mit Check) */
function StepIcon({ active, completed, icon }: StepIconProps): React.JSX.Element {
  const highlight = active || completed;

  return (
    <Avatar
      sx={{
        ...(highlight && {
          bgcolor: "var(--mui-palette-primary-main)",
          color: "var(--mui-palette-primary-contrastText)",
        }),
      }}
      variant="rounded"
    >
      {completed ? <CheckIcon /> : icon}
    </Avatar>
  );
}

/**
 * Wizard-Form, 3 Schritte + Preview-Screen.
 */
export function CategoryCreateForm(): React.JSX.Element {
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [isComplete, setIsComplete] = React.useState<boolean>(false);

  // Schaltet weiter
  const handleNext = React.useCallback(() => {
    setActiveStep((prev) => prev + 1);
  }, []);

  // Geht zurück
  const handleBack = React.useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  // Letzter Schritt => fertig
  const handleComplete = React.useCallback(() => {
    setIsComplete(true);
  }, []);

  // Liste der Steps
  const steps = React.useMemo(() => {
    return [
      {
        label: "Category Type",
        content: <CategoryTypeStep onBack={handleBack} onNext={handleNext} />,
      },
      {
        label: "Details",
        content: <CategoryDetailsStep onBack={handleBack} onNext={handleNext} />,
      },
      {
        label: "Description",
        content: <CategoryDescriptionStep onBack={handleBack} onNext={handleComplete} />,
      },
    ];
  }, [handleBack, handleNext, handleComplete]);

  // Sobald "isComplete" => Preview
  if (isComplete) {
    return <CategoryPreview />;
  }

  return (
    <Stepper
      activeStep={activeStep}
      orientation="vertical"
      sx={{
        "& .MuiStepConnector-root": { ml: "19px" },
        "& .MuiStepConnector-line": {
          borderLeft: "2px solid var(--mui-palette-divider)",
        },
        "& .MuiStepLabel-iconContainer": { paddingRight: "16px" },
        "& .MuiStepContent-root": {
          borderLeft: "2px solid var(--mui-palette-divider)",
          ml: "19px",
        },
        "& .MuiStep-root:last-of-type .MuiStepContent-root": {
          borderColor: "transparent",
        },
      }}
    >
      {steps.map((step) => (
        <Step key={step.label}>
          <StepLabel StepIconComponent={StepIcon}>
            <Typography variant="overline">{step.label}</Typography>
          </StepLabel>
          <StepContent>
            <Box sx={{ px: 2, py: 3 }}>{step.content}</Box>
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );
}
