import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Entity, getEntity, patchEntity } from "../../../lib/api/wizardApi";
import { Navigation } from "./Navigation";

export const Step5 = () => {
  const [success, setSuccess] = useState(false);
  const { id } = useSearch({ from: "/wizard/step5" }) as { id: string };
  const navigate = useNavigate();
  const [entity, setEntity] = useState<Entity | null>(null);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    getEntity(id).then(setEntity);
  }, [id]);

  const finalize = async () => {
    if (!confirm) return;
    await patchEntity(id, {
      status: "finalized",
      confirmed: true,
      confirmedAt: new Date().toISOString(),
    });
    setSuccess(true);
    setTimeout(() => {
      navigate({ to: "/", search: {} });
    }, 3500);
  };

  if (!entity) return <Typography>Loading…</Typography>;

  const Row = (p: { l: string; v: any }) => (
    <Grid container spacing={1}>
      <Grid sx={{ color: "text.secondary" }}>{p.l}</Grid>
      <Grid>{String(p.v ?? "")}</Grid>
    </Grid>
  );

  return (
    <Box>
      <Navigation />

      <Typography variant="h6" mb={2}>
        Step 5 — Finalization
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">Personal Information</Typography>
        <Row l="First Name" v={entity.basic?.firstName} />
        <Row l="Last Name" v={entity.basic?.lastName} />
        <Row l="Birthday date" v={entity.basic?.bdate} />
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">Contact Details</Typography>
        <Row l="Email" v={entity.contact?.email} />
        <Row l="Phone" v={entity.contact?.phone} />
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">Loan Request</Typography>
        <Row l="Loan Amount" v={entity.loan?.loanAmount} />
        <Row l="Upfront" v={entity.loan?.upfront} />
        <Row l="Terms" v={entity.loan?.terms} />
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">Financial Information</Typography>
        <Row l="Salary" v={entity.finance?.salary} />
        <Row l="Extra Income" v={entity.finance?.extraIncome} />
        <Row l="Mortgage" v={entity.finance?.mortgage} />
        <Row l="Other Credits" v={entity.finance?.otherCredits} />
      </Paper>

      <FormControlLabel
        control={
          <Checkbox
            checked={confirm}
            onChange={(e) => setConfirm(e.target.checked)}
          />
        }
        label="I confirm"
      />
      <Box mt={1}>
        <Button
          onClick={() => navigate({ to: "/wizard/step4", search: { id } })}
        >
          Back
        </Button>
        <Button
          variant="contained"
          disabled={!confirm}
          onClick={finalize}
          sx={{ ml: 1 }}
        >
          Finalization
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Your information has been saved!
        </Alert>
      )}
    </Box>
  );
};
