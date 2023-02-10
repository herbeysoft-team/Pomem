import axios from "axios";

const API = axios.create({
  //baseURL: "http://localhost:5000/",
  baseURL: "https://polarpetrochemicalsltd.com/",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

export const signIn = (formData) => API.post("/api/user/signin", formData); //sign in for all users
export const signUp = (formData) => API.post("/api/user/signup", formData); //signup for the role of admin
export const passwordChange = (formValue) =>
  API.post("/api/user/changepassword", formValue); //change user password

export const getAllUsers = () => API.get("/api/user/alluser"); //get all user
export const getAllUsersCount = () => API.get("/api/user/allusercount"); //get all user count
export const deleteUser = (userId) => API.delete(`/api/user/${userId}`); //delete user
export const getUser = (id) => API.get(`/api/user/getuser/${id}`); //get one user
export const getUserProfile = (id) => API.get(`/api/user/getuserprofile/${id}`); //get one user profile
export const updateUser = (updatedValue, userId) =>
  API.put(`/api/user/updateuser/${userId}`, updatedValue); //update user

export const getAllDepartments = () =>
  API.get("/api/department/alldepartments"); //get all department
export const getDepartment = (id) =>
  API.get(`/api/department/getdepartment/${id}`); //get one department
export const updateDepartment = (updatedValue, deptId) =>
  API.put(`/api/department/updatedepartment/${deptId}`, updatedValue); //update one department
export const deleteDepartment = (deptId) =>
  API.delete(`/api/department/deletedepartment/${deptId}`); //delete one department
export const createDepartment = (formData) =>
  API.post("/api/department/createdepartment", formData); //create department

export const getAllCategories = () => API.get("/api/category/allcategories"); //get all categories
export const getCategory = (id) => API.get(`/api/category/getcategory/${id}`); //get one category
export const updateCategory = (updatedValue, catId) =>
  API.put(`/api/category/updatecategory/${catId}`, updatedValue); //update one category
export const deleteCategory = (deptId) =>
  API.delete(`/api/category/deleteCategory/${deptId}`); //delete one category
export const createCategory = (formValue) =>
  API.post("/api/category/createCategory", formValue); //create category

export const getAllMemos = () => API.get("/api/memo/allmemos"); //get all memo
export const getAllMemosCount = () => API.get("/api/memo/allmemoscount"); //get all memo count
export const getAllMemosByCategory = (id) =>
  API.get(`/api/memo/allmemosbycategory/${id}`); //get all memo by category
export const getAllMemosByUser = (id) =>
  API.get(`/api/memo/allmemosbyuser/${id}`); //get all memo by user
export const getAllMemosToAttend = (id) =>
  API.get(`/api/memo/allmemostoattend/${id}`); //get all memo to attend
export const getMemo = (id) => API.get(`/api/memo/getmemo/${id}`); //get one memo
export const updateMemo = (updatedValue, memoId) =>
  API.put(`/api/memo/updatememo/${memoId}`, updatedValue); //update one memo
export const updateMemoStatus = (updatedValue, memoId) =>
  API.put(`/api/memo/updatememostatus/${memoId}`, updatedValue); //update one memo status
export const deleteMemo = (memoId) =>
  API.delete(`/api/memo/deletememo/${memoId}`); //delete one memo
export const createMemo = (formValue) =>
  API.post("/api/memo/creatememo", formValue); //create memo
export const memoNotification = (formValue) =>
  API.post("/api/memo/memonotification", formValue); //send memo notification
export const getMemosBySearch = (searchName) =>
  API.post("/api/memo/allmemosbysearch", searchName); //get memo by Search

export const createComment = (formValue) =>
  API.post("/api/comment/createcomment", formValue); //create comment
