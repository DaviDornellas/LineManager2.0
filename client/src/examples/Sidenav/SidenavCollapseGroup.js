import PropTypes from "prop-types";
import SidenavCollapse from "./SidenavCollapse";

function SidenavCollapseGroup({ icon, name, active, children }) {
  // Children são outros <SidenavCollapse>
  return (
    <SidenavCollapse icon={icon} name={name} active={active}>
      {children}
    </SidenavCollapse>
  );
}

SidenavCollapseGroup.defaultProps = {
  active: false,
  children: null,
};

SidenavCollapseGroup.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
  children: PropTypes.node,
};

export default SidenavCollapseGroup;
