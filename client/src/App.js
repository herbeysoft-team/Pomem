import React, {useEffect} from "react";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useDispatch } from "react-redux";
import { setUser } from "./Context/features/authSlice";
import Login from "./Pages/Login";
import AdminLayout from "./Layout/Admin";
import ManagerLayout from "./Layout/Manager";
import ManagerLayoutPage from "./Layout/ManagerPage";
import { useSelector } from "react-redux";

import AdminDashboard from "./Pages/Admin/Dashboard";
import AdminUser from "./Pages/Admin/User";
import AdminDepartment from "./Pages/Admin/Department";
import AdminCategory from "./Pages/Admin/Category";
import AdminProfile from "./Pages/Admin/Profile";
import AdminMemo from "./Pages/Admin/Memos";
import AdminMemoView from "./Pages/Admin/MemoView";
import ManagerDashboard from "./Pages/Manager/Dashboard";
import ManagerCreate from "./Pages/Manager/CreateMemo";
import ManagerMemo from "./Pages/Manager/MyMemos";
import ManagerAttendTo from "./Pages/Manager/AttendTo";
import ManagerMemoDetail from "./Pages/Manager/MemoDetail";
import ManagerMemoDetailToAttend from "./Pages/Manager/MemoDetailsToAttend";
import ManagerProfile from "./Pages/Manager/Profile";
import ManagerEditMemo from "./Pages/Manager/MemoEdit";

import PrivateRoute from './Component/PrivateRoute';


function App() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  useEffect(() => {
    dispatch(setUser(user));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { mode } = useSelector((state) => ({ ...state.theme }));
  const theme = createTheme({
    fontFamily: '"Outfit", sans-serif',
    spacing: 10,
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // palette values for light mode
            primary: {
              main: "#da1919",
              light: "#e74e48",
              dark: "#d70e05",
            },
            secondary: {
              main: "#2a2728",
              light: "#424041",
              dark: "#080405",
            },
          }
        : {
            // palette values for dark mode
            primary: {
              main: "#2a2728",
              light: "#e74e48",
              dark: "#d70e05",
            },
            secondary: {
              main: "#2a2728",
              light: "#424041",
              dark: "#080405",
            },
          }),
    },
  });

  return (
    <BrowserRouter>
      <ToastContainer position="top-center" />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route
            exact
            path="/a_dashboard"
            element={
              <PrivateRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/a_user"
            element={
              <AdminLayout>
                <AdminUser />
              </AdminLayout>
            }
          />
          <Route
            exact
            path="/a_department"
            element={
              <AdminLayout>
                <AdminDepartment />
              </AdminLayout>
            }
          />
          <Route
            exact
            path="/a_category"
            element={
              <AdminLayout>
                <AdminCategory />
              </AdminLayout>
            }
          />
          <Route
            exact
            path="/a_edit/:id"
            element={
              <AdminLayout>
                <AdminProfile />
              </AdminLayout>
            }
          />
          <Route
            exact
            path="/a_memo"
            element={
              <AdminLayout>
                <AdminMemo />
              </AdminLayout>
            }
          />
          <Route
            exact
            path="/a_memoview/:id"
            element={
              <AdminLayout>
                <AdminMemoView />
              </AdminLayout>
            }
          />
          <Route
            exact
            path="/m_dashboard"
            element={
              <PrivateRoute>
              <ManagerLayout>
                <ManagerDashboard />
              </ManagerLayout>
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/m_create"
            element={
              <ManagerLayoutPage>
                <ManagerCreate />
              </ManagerLayoutPage>
            }
          />
          <Route
            exact
            path="/m_mymemo"
            element={
              <ManagerLayoutPage>
                <ManagerMemo />
              </ManagerLayoutPage>
            }
          />
          <Route
            exact
            path="/m_attendto"
            element={
              <ManagerLayoutPage>
                <ManagerAttendTo />
              </ManagerLayoutPage>
            }
          />
          <Route
            exact
            path="/m_detail/:id"
            element={
              <ManagerLayoutPage>
                <ManagerMemoDetail />
              </ManagerLayoutPage>
            }
          />
          <Route
            exact
            path="/m_editmemo/:id"
            element={
              <ManagerLayoutPage>
                <ManagerEditMemo />
              </ManagerLayoutPage>
            }
          />
          <Route
            exact
            path="/m_detailtoattend/:id"
            element={
              <ManagerLayoutPage>
                <ManagerMemoDetailToAttend />
              </ManagerLayoutPage>
            }
          />
          <Route
            exact
            path="/m_edit/:id"
            element={
              <ManagerLayoutPage>
                <ManagerProfile />
              </ManagerLayoutPage>
            }
          />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
