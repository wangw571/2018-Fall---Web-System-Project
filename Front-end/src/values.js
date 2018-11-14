import { OrganizationInfo } from "./util/OrganizationInfo";

const org = OrganizationInfo.getInstance();

let _DASHBOARD_NAV;
if (org.getOrganizationType() === "TEQ"){
  _DASHBOARD_NAV = [
    { path: "/app/upload", text: "Upload", icon: "paper-plane", Component: "Upload" },
    { path: "/app/reports", text: "Reports", icon: "newspaper", Component: "Report" },
    { path: "/app/me", text: "Profile", icon: "user-circle", Component: "Profile" },
    { path: "/app/addAccount", text: "Add Account", icon: "user-circle", Component: "AddAccount"},
    { path: "/app/addOrganization", text: "Add Organization", icon: "user-circle", Component: "AddOrganization"}
  ]
} else {
  _DASHBOARD_NAV = [
    { path: "/app/upload", text: "Upload", icon: "paper-plane", Component: "Upload" },
    { path: "/app/reports", text: "Reports", icon: "newspaper", Component: "Report" },
    { path: "/app/me", text: "Profile", icon: "user-circle", Component: "Profile" }
  ]
}

export const DASHBOARD_NAV = _DASHBOARD_NAV;
