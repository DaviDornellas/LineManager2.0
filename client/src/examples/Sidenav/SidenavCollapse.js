import { useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Custom styles
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
} from "examples/Sidenav/styles/sidenavCollapse";

import { useMaterialUIController } from "context";

function SidenavCollapse({ icon, name, active, children, ...rest }) {
  const [controller] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const [open, setOpen] = useState(false);

  const hasChildren = Array.isArray(children) && children.length > 0;

  const toggleOpen = () => {
    if (hasChildren) setOpen(!open);
  };

  return (
    <>
      <ListItem
        component="li"
        onClick={toggleOpen}
        sx={{ cursor: hasChildren ? "pointer" : "default" }}
      >
        <MDBox
          {...rest}
          sx={(theme) =>
            collapseItem(theme, {
              active,
              transparentSidenav,
              whiteSidenav,
              darkMode,
              sidenavColor,
            })
          }
        >
          <ListItemIcon
            sx={(theme) =>
              collapseIconBox(theme, {
                transparentSidenav,
                whiteSidenav,
                darkMode,
                active,
              })
            }
          >
            {typeof icon === "string" ? (
              <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
            ) : (
              icon
            )}
          </ListItemIcon>

          <ListItemText
            primary={name}
            sx={(theme) =>
              collapseText(theme, {
                miniSidenav,
                transparentSidenav,
                whiteSidenav,
                active,
              })
            }
          />
          {hasChildren && (
            <Icon sx={{ ml: "auto", fontSize: "1rem" }}>
              {open ? "expand_less" : "expand_more"}
            </Icon>
          )}
        </MDBox>
      </ListItem>

      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            {children}
          </List>
        </Collapse>
      )}
    </>
  );
}

SidenavCollapse.defaultProps = {
  active: false,
  children: null,
};

SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
  children: PropTypes.node,
};

export default SidenavCollapse;
