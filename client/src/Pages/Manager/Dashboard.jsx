import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import CategoryTab from "../../Component/CategoryTab";
import MemoCards from "../../Component/MemoCards";
import MobileSearch from "../../Component/MobileSearch";
import { useSelector, useDispatch } from "react-redux";
import { getCategories } from "../../Context/features/categorySlice";
import { Backdrop } from "@mui/material";
import loaderImg from "../../assets/loader.gif";
import { toast } from "react-toastify";
import scrollreveal from "scrollreveal";

const Dashboard = () => {
  const { categories, loading, error } = useSelector((state) => ({
    ...state.category,
  }));
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    loading && setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <img src={loaderImg} alt="Loading..." />
        </Backdrop>
      )}
      <MobileSearch />
      <CategoryTab categories={categories} />
      <Box sx={{ width: "100%" }} className="card">
        <MemoCards />
      </Box>
    </Box>
  );
};

export default Dashboard;
