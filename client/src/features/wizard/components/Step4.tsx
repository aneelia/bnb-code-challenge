import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { step4Schema, Step4Form } from "../validation";
import { getEntity, patchEntity } from "../../../lib/api/wizardApi";
import { Navigation } from "./Navigation";

export const Step4 = () => {
  const { id } = useSearch({ from: "/wizard/step4" }) as { id: string };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Step4Form>({
    resolver: yupResolver(step4Schema),
    defaultValues: { hasExtra: false, hasMortgage: false, hasCredits: false },
  });

  const hasExtra = watch("hasExtra");
  const hasMortgage = watch("hasMortgage");
  const hasCredits = watch("hasCredits");

  useEffect(() => {
    if (!id) return;
    (async () => {
      const e = await getEntity(id);
      const f = e.finance ?? {};
      reset({
        salary: f.salary ?? undefined,
        hasExtra: "extraIncome" in f,
        extraIncome: f.extraIncome ?? undefined,
        hasMortgage: "mortgage" in f,
        mortgage: f.mortgage ?? undefined,
        hasCredits: "otherCredits" in f,
        otherCredits: f.otherCredits ?? undefined,
      });
    })();
  }, [id, reset]);

  const onSubmit = async (f: Step4Form) => {
    const e = await getEntity(id);
    const terms = e.loan?.terms ?? 0;
    const loan = e.loan?.loanAmount ?? Number.MAX_SAFE_INTEGER;
    const income = (f.salary ?? 0) + (f.hasExtra ? (f.extraIncome ?? 0) : 0);
    const debts =
      (f.hasMortgage ? (f.mortgage ?? 0) : 0) +
      (f.hasCredits ? (f.otherCredits ?? 0) : 0);
    const capacity = (income - debts) * terms * 0.5;
    if (!(capacity > loan)) {
      setError("root", {
        type: "manual",
        message:
          "Financial capacity is insufficient. Reduce loan (Step 3) or restart (Step 1).",
      });
      return;
    }
    await patchEntity(id, {
      finance: {
        salary: f.salary,
        ...(f.hasExtra ? { extraIncome: f.extraIncome ?? 0 } : {}),
        ...(f.hasMortgage ? { mortgage: f.mortgage ?? 0 } : {}),
        ...(f.hasCredits ? { otherCredits: f.otherCredits ?? 0 } : {}),
      },
    });
    navigate({ to: "/wizard/step5", search: { id } });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Navigation />

      <Typography variant="h6" mb={2}>
        Step 4 — Financial Information
      </Typography>
      <Grid container spacing={2}>
        <Grid>
          <TextField
            type="number"
            label="Monthly Salary"
            fullWidth
            {...register("salary", { valueAsNumber: true })}
            error={!!errors.salary}
            helperText={errors.salary?.message}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid>
          <FormControlLabel
            control={<Checkbox {...register("hasExtra")} />}
            label="Additional Income"
          />
          {hasExtra && (
            <TextField
              type="number"
              label="Extra Income"
              sx={{ ml: 2, width: 220 }}
              {...register("extraIncome", { valueAsNumber: true })}
              InputLabelProps={{ shrink: true }}
            />
          )}
        </Grid>

        <Grid>
          <FormControlLabel
            control={<Checkbox {...register("hasMortgage")} />}
            label="Mortgage"
          />
          {hasMortgage && (
            <TextField
              type="number"
              label="Mortgage"
              sx={{ ml: 2, width: 220 }}
              {...register("mortgage", { valueAsNumber: true })}
              InputLabelProps={{ shrink: true }}
            />
          )}
        </Grid>

        <Grid>
          <FormControlLabel
            control={<Checkbox {...register("hasCredits")} />}
            label="Other Credits"
          />
          {hasCredits && (
            <TextField
              type="number"
              label="Other Credits"
              sx={{ ml: 2, width: 220 }}
              {...register("otherCredits", { valueAsNumber: true })}
              InputLabelProps={{ shrink: true }}
            />
          )}
        </Grid>

        {errors.root && (
          <Grid>
            <Alert severity="error">{String(errors.root.message)}</Alert>
          </Grid>
        )}
        <Grid>
          <Button
            onClick={() => navigate({ to: "/wizard/step3", search: { id } })}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ ml: 1 }}
          >
            Save & Finalize
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
