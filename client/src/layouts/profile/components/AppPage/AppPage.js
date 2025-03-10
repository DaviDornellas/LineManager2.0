// AppPage.js
import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function AppPage() {
  return (
    <MDBox pt={3}>
      <MDTypography variant="h6" fontWeight="medium">
        Welcome to the App Page
      </MDTypography>
      <MDTypography variant="body2" color="text" fontWeight="regular">
        This is the content for the app page.
      </MDTypography>
    </MDBox>
  );
}

export default AppPage;
