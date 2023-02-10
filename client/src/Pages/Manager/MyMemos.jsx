import { Box, Typography, Backdrop } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMemosByUser } from "../../Context/features/memoSlice";
import { toast } from "react-toastify";
import loaderImg from "../../assets/loader.gif";
import MemoCardsMine from "../../Component/MemoCardsMine";
import scrollreveal from "scrollreveal";

const MyMemos = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState([]);
  const [userId, setUserId] = useState(null);
  const { memosByUser, loading, error } = useSelector((state) => ({
    ...state.memo,
  }));
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
    let user = JSON.parse(localStorage.getItem("profile"));
    setName(user);
    setUserId(user?.result?.id);
  }, []);

  useEffect(() => {
    if (name?.result?.id) {
      dispatch(getMemosByUser(name?.result?.id));
    }
  }, [dispatch, name?.result?.id]);

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
        marginTop: "5rem",
        marginBottom: "5rem",
        padding: { xs: "0rem", md: "2rem" },
      }}
      className="card"
    >
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <img src={loaderImg} alt="Loading..." />
        </Backdrop>
      )}
      <Typography
        component="h4"
        variant="h4"
        fontWeight="bold"
        marginBottom={2}
      >
        My Memos
      </Typography>
      <Box sx={{ width: "100%" }}>
        <MemoCardsMine memos={memosByUser} />
      </Box>
    </Box>
  );
};

export default MyMemos;
