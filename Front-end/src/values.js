import { Profile, Report, Upload } from './pages';

export const DASHBOARD_NAV = [
  { path: "/app/upload", text: "Upload", icon: "paper-plane", route: Upload },
  { path: "/app/reports", text: "Reports", icon: "newspaper", route: Report },
  { path: "/app/me", text: "Profile", icon: "user-circle", route: Profile }
]