import { Profile, Report, Upload } from './pages';

export const DASHBOARD_NAV = [
  { path: "/", text: "Upload", icon: "paper-plane", route: Upload },
  { path: "/reports", text: "Reports", icon: "newspaper", route: Report },
  { path: "/me", text: "Profile", icon: "user-circle", route: Profile }
]