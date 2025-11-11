import { Box } from "@mui/material";
import React, { useEffect } from "react";
import CategoryTab from "../../Component/CategoryTab";
import MemoCards from "../../Component/MemoCards";
import MobileSearch from "../../Component/MobileSearch";
import { useSelector, useDispatch } from "react-redux";
import { getCategories } from "../../Context/features/categorySlice";
import scrollreveal from "scrollreveal";

const Dashboard = () => {
  const { categories } = useSelector((state) => ({
    ...state.category,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    const sr = scrollreveal({
      origin: "bottom",
      distance: "80px",
      duration: 2000,
      reset: false,
    });
    sr.reveal(
      `
        .card
    `,
      {
        opacity: 0,
        interval: 100,
      }
    );
  }, []);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyItems: "center",
        alignItems: "center",
      }}
    >

      <MobileSearch />
      <CategoryTab categories={categories} />
      <Box sx={{ width: "100%" }} className="card">
        <MemoCards />
      </Box>
    </Box>
  );
};

export default Dashboard;
