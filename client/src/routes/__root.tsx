import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1>Welcome to the club!</h1>
      <Outlet />
    </div>
  ),
});
