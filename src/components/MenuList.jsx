import React, { useState } from "react";
import { Button, Menu, MenuItem, Typography } from "@mui/material";

const FilterMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      {/* Filter Button */}
      <Typography variant="body1" style={{ color: "#1976d2", cursor: "pointer" }}>
        Filter by:
      </Typography>

      {/* Category Menu */}
      <Button
        variant="outlined"
        onClick={handleClick}
        style={{
          textTransform: "none",
          borderRadius: "2rem",
        }}
      >
        Category
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "0.5rem",
          },
        }}
      >
        <MenuItem onClick={handleClose}>Work</MenuItem>
        <MenuItem onClick={handleClose}>Personal</MenuItem>
      </Menu>

      {/* Due Date Menu */}
      <Button
        variant="outlined"
        style={{
          textTransform: "none",
          borderRadius: "2rem",
        }}
      >
        Due Date
      </Button>
    </div>
  );
};

export default FilterMenu;
