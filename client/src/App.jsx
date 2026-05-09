import "./App.css";
import React, { useEffect } from "react";

import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";

import Header from "./componets/Header";
import Login from "./componets/Login";
import Blogs from "./componets/Blogs";
import UserBlogs from "./componets/UserBlogs";
import AddBlogs from "./componets/AddBlogs";
import BlogDetail from "./componets/BlogDetail";

import { authActions } from "./store";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      dispatch(authActions.login());
    }
  }, [dispatch]);

  return (
    <React.Fragment>
      <header>
        <Header />
      </header>

      <main>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/blogs"
            element={<Blogs />}
          />

          <Route
            path="/myBlogs"
            element={<UserBlogs />}
          />

          <Route
            path="/myBlogs/:id"
            element={<BlogDetail />}
          />

          <Route
            path="/blogs/add"
            element={<AddBlogs />}
          />
        </Routes>
      </main>
    </React.Fragment>
  );
}

export default App;