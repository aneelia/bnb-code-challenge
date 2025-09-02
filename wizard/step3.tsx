import { createFileRoute } from "@tanstack/react-router";
import { Step3 } from "../../features/wizard/components";

export const Route = createFileRoute("/wizard/step3")({
  component: Step3,
});
