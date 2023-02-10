import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Container from "@mui/material/Container";
import { useDispatch } from "react-redux";
import {
  getMemos,
  getMemosByCategory,
  clearMemo,
} from "../Context/features/memoSlice";

const CategoryTab = ({ categories }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      dispatch(clearMemo());
      dispatch(getMemos());
    } else {
      dispatch(clearMemo());
      dispatch(getMemosByCategory(newValue));
    }
  };

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          px: { xs: 0, md: 2 },
          mt: { xs: 2, md: 10 },
          alignItems: "center",
          mb: 2,
          justifyItems: "center",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              "&.Mui-disabled": { opacity: 0.3 },
            },
          }}
        >
          <Tab key={0} label="Latest Memo" />
          {categories.map((tab) => {
            return <Tab key={tab.id} label={tab.cat_name} />;
          })}
        </Tabs>
      </Box>
    </Container>
  );
};

export default CategoryTab;
