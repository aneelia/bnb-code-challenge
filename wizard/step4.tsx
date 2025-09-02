import { createFileRoute } from "@tanstack/react-router";
import { Step4 } from "../../features/wizard/components";

export const Route = createFileRoute("/wizard/step4")({
  component: Step4,
});
