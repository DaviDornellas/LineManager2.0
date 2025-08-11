import React from "react";
import { GridToolbarContainer } from "@mui/x-data-grid";
import ExportExcel from "./ExportExcel";
import PropTypes from "prop-types";

const CustomToolbar = ({ data }) => {
  return (
    <GridToolbarContainer>
      <ExportExcel data={data} />
    </GridToolbarContainer>
  );
};

CustomToolbar.propTypes = {
  data: PropTypes.array.isRequired,
};

export default CustomToolbar;
