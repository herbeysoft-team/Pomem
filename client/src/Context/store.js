import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./features/authSlice";
import ThemeReducer from "./features/themeSlice";
import UserReducer from "./features/userSlice";
import DepartmentReducer from "./features/departmentSlice";
import CategoryReducer from "./features/categorySlice";
import MemoReducer from "./features/memoSlice";
import CommentReducer from "./features/commentSlice";

export default configureStore({
  reducer: {
    auth: AuthReducer,
    theme: ThemeReducer,
    user: UserReducer,
    department: DepartmentReducer,
    category: CategoryReducer,
    memo: MemoReducer,
    comment: CommentReducer,
  },
});
