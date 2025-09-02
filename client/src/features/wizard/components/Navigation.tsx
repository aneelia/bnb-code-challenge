import { Link, useRouterState } from "@tanstack/react-router";
import { STEPS } from "../const";

export function Navigation() {
  const { location } = useRouterState();
  const qs = new URLSearchParams(location.searchStr);
  const id = qs.get("id") ?? undefined;

  return (
    <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
      {STEPS.map((s) => (
        <Link
          key={s}
          to={`/wizard/step${s}` as string}
          search={(prev) => ({ ...prev, started: "1", ...(id ? { id } : {}) })}
        >
          Step {s}
        </Link>
      ))}
    </nav>
  );
}
