import { Profile, Report, Upload } from './pages';
import { AddAccount } from './pages/AddAccount';

export const DASHBOARD_NAV = [
  { path: "/app/upload", text: "Upload", icon: "paper-plane", route: Upload },
  { path: "/app/reports", text: "Reports", icon: "newspaper", route: Report },
  { path: "/app/me", text: "Profile", icon: "user-circle", route: Profile },
  { path: "/app/addAccount", text: "Account", icon: "user-circle", route: AddAccount }
]

//export const TEQ_ORGANIZATION = "TEQ";

//export const NORMAL_ORGANIZATION = "NORMAL_ORGANIZATION";