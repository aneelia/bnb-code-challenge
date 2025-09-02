import {
  createFileRoute,
  Link,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const qs = new URLSearchParams(location.searchStr);
  const started = qs.get("started") === "1";
  const id = qs.get("id") ?? undefined;

  const start = () => {
    navigate({
      to: "/wizard/step1",
      search: { started: "1", ...(id ? { id } : {}) },
    });
  };

  return !started ? (
    <button onClick={start} style={{ padding: 8 }}>
      Fill the data
    </button>
  ) : null;
}
