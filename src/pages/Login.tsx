import React from "react";
import {
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
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

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      dispatch(
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
      );

      navigate("/task-manager");
    } catch (error: any) {
      console.error(error.message);
    }
  };
  return (
    <Grid
      container
      sx={{
        maxHeight: "95vh",
        height:{sm:"inherit",xs:"95vh"},
        backgroundColor: "#f9f6f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        position:"relative"
      }}
    >
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
          height:"100%"
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#7f2087",
            marginBottom: 1,
            textAlign: { xs: "center" },
            margin: { xs: "0px auto",sm:"inherit" },
          }}
        >
          TaskBuddy
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#555", marginBottom: 3 ,textAlign:{xs:"center",sm:"left",},width:{sm:"70%",xs:"inherit"}}}>
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
            margin:{xs:"0px auto",sm:"inherit"}
          }}
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>
        <BackgroundCircles></BackgroundCircles>
      </Grid>

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
     {["40vw", "45vw", "48vw"].map((size, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              border: "2px solid rgba(127, 32, 135, 0.4)", // Light Purple Border
              zIndex: 1,
              right: "15%",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        ))}

        <Card
          sx={{
            width: "100%",
            maxWidth: "100%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            borderRadius: 4,
            zIndex:2,
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
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;




const BackgroundCircles: React.FC = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display:{sm:"none",xs:"inherit"}
      }}
    >
      {[
       { top: "19px", right:"-125px" },
               { top:"50%"},
               { bottom: "-20px", left: "50%" },
      ].map((pos, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "2px solid rgba(127, 32, 135, 0.4)", 
            ...pos,
            transform: "translate(-50%, -50%)",
          }}
        >
          {[25, 50, 75].map((size, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                width: `${size}%`,
                height: `${size}%`,
                borderRadius: "50%",
                border: "2px solid rgba(127, 32, 135, 0.4)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

