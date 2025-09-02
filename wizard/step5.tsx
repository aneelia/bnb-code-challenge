import { createFileRoute } from "@tanstack/react-router";
import { Step5 } from "../../features/wizard/components";

export const Route = createFileRoute("/wizard/step5")({
  component: Step5,
});
