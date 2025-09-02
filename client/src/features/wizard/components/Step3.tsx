import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, TextField, Typography, Alert } from "@mui/material";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { step3Schema, Step3Form } from "../validation";
import { getEntity, patchEntity } from "../../../lib/api/wizardApi";

import { Navigation } from "./Navigation";

export const Step3 = () => {
  const { id } = useSearch({ from: "/wizard/step3" }) as { id: string };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Step3Form>({ resolver: yupResolver(step3Schema) });

  useEffect(() => {
    if (!id) return;
    (async () => {
      const e = await getEntity(id);
      reset({
        loanAmount: e.loan?.loanAmount ?? undefined,
        upfront: e.loan?.upfront ?? undefined,
        terms: e.loan?.terms ?? undefined,
      });
    })();
  }, [id, reset]);

  const onSubmit = async (data: Step3Form) => {
    const e = await getEntity(id);
    if (!e.basic?.bdate) {
      setError("terms", { type: "manual", message: "Missing bdate (Step 1)" });
      return;
    }
    const bdate = new Date(e.basic.bdate);
    const now = new Date();
    let age = now.getFullYear() - bdate.getFullYear();
    const m = now.getMonth() - bdate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < bdate.getDate())) age--;
    if (data.terms / 12 + age >= 80) {
      setError("terms", {
        type: "manual",
        message: "terms/12 + age must be < 80",
      });
      return;
    }
    await patchEntity(id, { loan: data });
    navigate({ to: "/wizard/step4", search: { id } });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Navigation />

      <Typography variant="h6" mb={2}>
        Step 3 — Loan Request
      </Typography>
      <Grid container spacing={2}>
        <Grid>
          <TextField
            type="number"
            label="Loan Amount (10k–70k)"
            fullWidth
            {...register("loanAmount", { valueAsNumber: true })}
            error={!!errors.loanAmount}
            helperText={errors.loanAmount?.message}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid>
          <TextField
            type="number"
            label="Upfront Payment"
            fullWidth
            {...register("upfront", { valueAsNumber: true })}
            error={!!errors.upfront}
            helperText={errors.upfront?.message}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid>
          <TextField
            type="number"
            label="Terms (10–30 months)"
            fullWidth
            {...register("terms", { valueAsNumber: true })}
            error={!!errors.terms}
            helperText={errors.terms?.message}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {errors.root && (
          <Grid>
            <Alert severity="error">{String(errors.root.message)}</Alert>
          </Grid>
        )}
        <Grid>
          <Button
            onClick={() => navigate({ to: "/wizard/step2", search: { id } })}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ ml: 1 }}
          >
            Save & Go next
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
