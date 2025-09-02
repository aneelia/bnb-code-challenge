import { createFileRoute } from "@tanstack/react-router";
import { Step1 } from "../../features/wizard/components";

export const Route = createFileRoute("/wizard/step1")({
  component: Step1,
});
