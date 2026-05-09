import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import axios from "axios";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import config from "../config";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStyles } from "./utils";

const labelStyles = {
  mb: 1,
  mt: 2,
  fontSize: "24px",
  fontWeight: "bold",
};

const AddBlogs = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    imageURL: "",
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async () => {
    try {
      const userId = localStorage.getItem("userId");

      // Check if user exists
      if (!userId) {
        console.log("User ID not found");
        return null;
      }

      const res = await axios.post(
        `${config.BASE_URL}/api/blogs/add`,
        {
          title: inputs.title,
          desc: inputs.description,

          // Use online placeholder image
          img:
            inputs.imageURL.trim() === ""
              ? "https://via.placeholder.com/600x400"
              : inputs.imageURL,

          user: userId,
        }
      );

      const data = res.data;

      console.log("Blog Added Successfully");
      console.log(data);

      return data;
    } catch (err) {
      console.log("FULL ERROR:");
      console.log(err);

      if (err.response) {
        console.log("SERVER ERROR:");
        console.log(err.response.data);
      }

      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(inputs);

    // Frontend validation
    if (
      !inputs.title ||
      !inputs.description
    ) {
      console.log("Please fill all fields");
      return;
    }

    const data = await sendRequest();

    if (!data) {
      console.log("Blog creation failed");
      return;
    }

    navigate("/blogs");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          borderRadius={10}
          boxShadow="10px 10px 20px #ccc"
          padding={3}
          margin={"auto"}
          marginTop={3}
          display="flex"
          flexDirection={"column"}
          width={"80%"}
        >
          <Typography
            className={classes.font}
            sx={{ pt: 3, pb: 3 }}
            color="grey"
            variant="h2"
            textAlign={"center"}
          >
            Post Your Blog
          </Typography>

          <InputLabel
            className={classes.font}
            sx={labelStyles}
          >
            Title
          </InputLabel>

          <TextField
            className={classes.font}
            name="title"
            onChange={handleChange}
            value={inputs.title}
            margin="normal"
            variant="outlined"
            required
          />

          <InputLabel
            className={classes.font}
            sx={labelStyles}
          >
            Description
          </InputLabel>

          <TextareaAutosize
            className={classes.font}
            name="description"
            onChange={handleChange}
            minRows={10}
            value={inputs.description}
            required
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "4px",
            }}
          />

          <InputLabel
            className={classes.font}
            sx={labelStyles}
          >
            Image URL
          </InputLabel>

          <TextField
            className={classes.font}
            name="imageURL"
            onChange={handleChange}
            value={inputs.imageURL}
            margin="normal"
            variant="outlined"
          />

          <Button
            sx={{ mt: 2, borderRadius: 4 }}
            variant="contained"
            type="submit"
          >
            Submit
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default AddBlogs;