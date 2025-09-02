import { createFileRoute } from "@tanstack/react-router";
import { Step2 } from "../../features/wizard/components";

export const Route = createFileRoute("/wizard/step2")({
  component: Step2,
});
