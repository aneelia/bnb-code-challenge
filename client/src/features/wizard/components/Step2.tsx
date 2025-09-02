import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { step2Schema, Step2Form } from "../validation";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { getEntity, patchEntity } from "../../../lib/api/wizardApi";
import { Navigation } from "./Navigation";

export const Step2 = () => {
  const { id } = useSearch({ from: "/wizard/step2" }) as { id: string };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Step2Form>({ resolver: yupResolver(step2Schema) });

  useEffect(() => {
    if (!id) return;
    (async () => {
      const e = await getEntity(id);
      reset({
        email: e.contact?.email ?? "",
        phone: e.contact?.phone ?? "",
      });
    })();
  }, [id, reset]);

  const onSubmit = async (data: Step2Form) => {
    await patchEntity(id, { contact: data });
    navigate({ to: "/wizard/step3", search: { id } });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Navigation />

      <Typography variant="h6" mb={2}>
        Step 2 — Contact Details
      </Typography>
      <Grid container spacing={2}>
        <Grid>
          <TextField
            label="Email"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid>
          <TextField
            label="Phone"
            placeholder="+1234567890"
            fullWidth
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid>
          <Button
            onClick={() => navigate({ to: "/wizard/step1", search: { id } })}
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
