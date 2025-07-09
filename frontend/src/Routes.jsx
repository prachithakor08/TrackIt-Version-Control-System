import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ProtectedRoute from "./ProtectedRoutes";
import { useAuth } from "./authContext";
import CreateRepo from "./components/repo/CreateRepo";
import LandingPage from "./components/LandingPage";
import About from './components/About';
import UserGuide from './components/UserGuide';
import CreateIssue from './components/issue/CreateIssue'
import RepoIssues from './components/issue/RepoIssues';

const ProjectRoutes = () => {
    const { isLoggedIn } = useAuth();

    const element = useRoutes([
        {
            path: "/",
            element: isLoggedIn ? (
                <Navigate to="/dashboard" replace />
            ) : (
                <LandingPage />
            ),
        },
        {
            path: "/dashboard",
            element: (
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Dashboard />
                </ProtectedRoute>
            ),
        },
        {
            path: "/profile",
            element: (
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Profile />
                </ProtectedRoute>
            ),
        },
        { path: "/auth", element: <Login /> },
        { path: "/signup", element: <Signup /> },
        {
            path: "/create",
            element: (
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <CreateRepo />
                </ProtectedRoute>
            ),
        },
        {
            path: "*",
            element: <Navigate to="/" replace />,
        },
        {
            path:"/about",
            element:<About/>
        },
         {
            path:"/guide",
            element:<UserGuide/>
        },
        {
            path:"/createIssue/:repoId",
            element:<CreateIssue/>
        },
        {
            path:"/repo/:repoId/issues",
            element:<RepoIssues/>
        }
    ]);

    return element;
};

export default ProjectRoutes;