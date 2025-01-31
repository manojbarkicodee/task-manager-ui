import React from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setUser } from "../store/authSlice";
import { auth } from "../firebase";
const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const auth = getAuth();

  // Google login function
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("user===>", user);
      // Dispatch user data to Redux
      dispatch(
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
      );

      // Redirect to task manager after login
      navigate("/task-manager");
    } catch (error: any) {
      console.error(error.message);
    }
  };
  return (
    <Grid
      container
      sx={{
        height: "95vh",
        backgroundColor: "#f9f6f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      {/* Left Section */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: { sm: 4, xs: 0 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#7f2087",
            marginBottom: 1,
            textAlign: { xs: "center" },
            margin: { xs: "auto" },
          }}
        >
          TaskBuddy
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#555", marginBottom: 3 ,textAlign:{xs:"center"}}}>
          Streamline your workflow and track progress effortlessly with our
          all-in-one task management app.
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "30px",
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "#333",
            },
            margin:{xs:"auto"}
          }}
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>
      </Grid>

      {/* Right Section */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: "100%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            borderRadius: 4,
          }}
        >
          <CardContent>
            <img
              src={"/assets/login_page.png"}
              alt="TaskBuddy Dashboard Preview"
              style={{
                width: "100%",
                borderRadius: "10px",
                marginBottom: 10,
                objectFit: "cover",
                height: "100%",
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;
