import './App.css';
import { Navigate, Route, Routes } from "react-router-dom";
import { Registration } from "./pages/Registration/Registration.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth.js";
import { useEffect, useState } from "react";
import { Main } from "./pages/Main/Main.jsx";
import CircularProgress from '@mui/material/CircularProgress';
import {Header} from "./components/Header/Header.jsx";
import {Login} from "./pages/Login/Login.jsx";
import {Profile} from "./pages/Profile/Profile.jsx";
function App() {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [dataUser, setDataUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dispatch(fetchAuthMe());
                setDataUser(response.payload);
                console.log(response.payload);
            } catch (error) {
                console.error("Error fetching auth data:", error);
            } finally {
                setIsCheckingAuth(false);
            }
        };
        fetchData();
    }, [dispatch]);

    if (isCheckingAuth) {

        return <CircularProgress />;
    }


    return (
        <>
            <Header dataUser={dataUser}/>
            <Routes>
                <Route path="/" element={isAuth ? <Main /> : <Registration />} />
                <Route path="/login" element={isAuth ? <Main /> : <Login />} />
                <Route path="/account" element={isAuth ? <Profile /> : <Login />} />
                <Route path="/people" element={isAuth ? <Main /> : <Login />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;
