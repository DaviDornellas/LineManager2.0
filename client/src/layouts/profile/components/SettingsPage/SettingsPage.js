// SettingsPage.js
import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function SettingsPage() {
  return (
    <MDBox pt={3}>
      <MDTypography variant="h6" fontWeight="medium">
        Settings
      </MDTypography>
      <MDTypography variant="body2" color="text" fontWeight="regular">
        Configure your settings here.
      </MDTypography>
    </MDBox>
  );
}

export default SettingsPage;
