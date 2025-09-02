import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { step1Schema, Step1Form } from "../validation";
import {
  createEntity,
  getEntity,
  patchEntity,
} from "../../../lib/api/wizardApi";
import { Navigation } from "./Navigation";

export const Step1 = () => {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const qs = new URLSearchParams(location.searchStr);
  const id = qs.get("id") ?? undefined;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Step1Form>({
    resolver: yupResolver(step1Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bdate: "" as any,
    },
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      const e = await getEntity(id);
      reset({
        firstName: e.basic?.firstName ?? "",
        lastName: e.basic?.lastName ?? "",
        bdate: e.basic?.bdate
          ? (e.basic.bdate as string).slice(0, 10)
          : ("" as any),
      });
    })();
  }, [id, reset, location.key]);

  const onSubmit = async (data: Step1Form) => {
    const payload = {
      basic: { ...data, bdate: new Date(data.bdate as any).toISOString() },
    };

    let nextId = id;
    if (!nextId) {
      const res = await createEntity(payload);
      nextId = res.entity.uuid;
    } else {
      await patchEntity(nextId, payload);
    }

    navigate({
      to: "/wizard/step2",
      search: (prev) => ({ ...prev, id: nextId, started: "1" }),
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Navigation />

      <Typography variant="h6" mb={2}>
        Step 1 — Personal Information
      </Typography>

      <Grid container spacing={2}>
        <Grid>
          <TextField
            label="First Name"
            fullWidth
            autoComplete="given-name"
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid>
          <TextField
            label="Last Name"
            fullWidth
            autoComplete="family-name"
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid>
          <TextField
            type="date"
            label="Birthday date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("bdate" as any)}
            error={!!errors.bdate}
            helperText={errors.bdate?.message}
            required
          />
        </Grid>

        <Grid>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Save & Go next
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
