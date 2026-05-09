import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  AppBar,
  Typography,
  Toolbar,
  Box,
  Button,
  Tabs,
  Tab,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { authActions, setDarkmode } from "../store";
import { lightTheme, darkTheme } from "../utils/theme";

const Header = () => {
  const dispatch = useDispatch();

  const isDark = useSelector(
    (state) => state.theme.isDarkmode
  );

  const isLoggedIn = useSelector(
    (state) => state.auth.isLoggedIn
  );

  const theme = isDark ? darkTheme : lightTheme;

  const [value, setValue] = useState(0);

  // Router hooks
  const location = useLocation();
  const navigate = useNavigate();

  // Load saved settings
  useEffect(() => {
    const savedTab =
      localStorage.getItem("selectedTab");

    const savedTheme =
      localStorage.getItem("isDarkMode");

    if (savedTab !== null) {
      setValue(parseInt(savedTab, 10));
    }

    if (savedTheme !== null) {
      dispatch(
        setDarkmode(JSON.parse(savedTheme))
      );
    }
  }, [dispatch]);

  // Detect current route
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/blogs/add")) {
      setValue(2);
    } else if (path.startsWith("/myBlogs")) {
      setValue(1);
    } else if (
      path.startsWith("/blogs")
    ) {
      setValue(0);
    } else {
      setValue(0);
    }
  }, [location.pathname]);

  // Tab change
  const handleTabChange = (
    event,
    newValue
  ) => {
    setValue(newValue);

    localStorage.setItem(
      "selectedTab",
      newValue
    );
  };

  // Dark mode toggle
  const handleDarkModeToggle = () => {
    const newTheme = !isDark;

    localStorage.setItem(
      "isDarkMode",
      JSON.stringify(newTheme)
    );

    dispatch(setDarkmode(newTheme));
  };

  // Login
  const handleLoginClick = () => {
    navigate("/login", {
      state: {
        isSignupButtonPressed: false,
      },
    });
  };

  // Signup
  const handleSignupClick = () => {
    navigate("/login", {
      state: {
        isSignupButtonPressed: true,
      },
    });
  };

  // Logout
  const handleLogout = () => {
    dispatch(authActions.logout());

    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: theme.bg,
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Typography variant="h4">
          BlogsApp
        </Typography>

        {/* Tabs */}
        {isLoggedIn && (
          <Box
            display="flex"
            marginLeft="auto"
            marginRight="auto"
          >
            <Tabs
              textColor="inherit"
              value={value}
              onChange={handleTabChange}
            >
              <Tab
                component={Link}
                to="/blogs"
                label="All Blogs"
              />

              <Tab
                component={Link}
                to="/myBlogs"
                label="My Blogs"
              />

              <Tab
                component={Link}
                to="/blogs/add"
                label="Add Blog"
              />
            </Tabs>
          </Box>
        )}

        {/* Buttons */}
        <Box
          display="flex"
          marginLeft="auto"
          alignItems="center"
        >
          {!isLoggedIn ? (
            <>
              <Button
                onClick={handleLoginClick}
                sx={{
                  margin: 1,
                  fontWeight: "bold",
                  color: "white",
                  borderRadius: 10,
                }}
              >
                Login
              </Button>

              <Button
                onClick={handleSignupClick}
                sx={{
                  margin: 1,
                  fontWeight: "bold",
                  color: "white",
                  borderRadius: 10,
                }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Button
              onClick={handleLogout}
              variant="contained"
              sx={{
                margin: 1,
                borderRadius: 10,
              }}
              color="warning"
            >
              Logout
            </Button>
          )}

          {/* Theme Toggle */}
          <Box
            onClick={handleDarkModeToggle}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              ml: 2,
            }}
          >
            {isDark ? (
              <LightModeIcon />
            ) : (
              <DarkModeIcon />
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;