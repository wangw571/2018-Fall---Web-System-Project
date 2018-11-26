export const DASHBOARD_NAV = [
  { path: "/app/upload", text: "Upload", icon: "paper-plane", Component: "Upload" },
  { path: "/app/reports", text: "Reports", icon: "newspaper", Component: "Report" },
  { path: "/app/queries", text: "Queries", icon: "search", Component: "Queries" },
  { path: "/app/orgs", text: "Organizations", icon: "sitemap", Component: "Organization" },
  { path: "/app/users", text: "Users", icon: "users", Component: "User" }
];

export const COLUMN_TYPES = [ "text", "number", "select", "check" ];
export const CHARTS = [ "bar", "line", "pie" ];
export const COLORS = [ "#4357ad", "#48a9a6", "#e4dfda", "#d4b483", "#c1666b", "#52489c", "#4062bb", "#59c3c3", "#ebebeb", "#f45b69" ];
export const DEFAULT_CHART_OPTIONS = {
  scales: {
    xAxes: [{
      ticks: { beginAtZero: true }
    }]
  }
}