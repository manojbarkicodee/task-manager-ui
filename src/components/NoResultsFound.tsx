import React from "react";
import { Box, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff"; // No results icon

const NoResultsFound = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      textAlign="center"
      sx={{ p: 4 }}
      width="400px"
      margin={"auto"}
    >
      {/* Icon or Image */}
      <SearchOffIcon sx={{ fontSize: 80, color: "gray" }} />

      {/* Message */}
      <Typography variant="h6" sx={{ mt: 2, color: "secondary" }}>
        It looks like we can't find any results that match.
      </Typography>
    </Box>
  );
};

export default NoResultsFound;
