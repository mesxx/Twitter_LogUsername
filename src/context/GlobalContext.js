import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";
import axios from "axios";
import Cookies from "js-cookie";

export const GlobalContext = createContext();
export const GlobalProvider = ({ children }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [userLogin, setUserLogin] = useState(null);
  const [inputLogin, setInputLogin] = useState({ username: "" });

  const state = {
    data,
    setData,
    inputLogin,
    setInputLogin,
    userLogin,
    setUserLogin,
  };

  const fetchDataUser = async () => {
    const res = await axios({
      method: "GET",
      url: "https://twitter135.p.rapidapi.com/UserByRestId/",
      params: { id: Cookies.get("token") },
      headers: {
        "X-RapidAPI-Key": "0d5ee77e62mshe7b65350fb23a36p1aef5bjsn74758f060ebf",
        "X-RapidAPI-Host": "twitter135.p.rapidapi.com",
      },
    });
    setUserLogin(res.data.data.user.result.legacy);
  };

  const handleInputLogin = (e) => {
    const { name, value } = e.target;
    setInputLogin({ ...inputLogin, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { username } = inputLogin;
    axios
      .request({
        method: "GET",
        url: "https://twitter135.p.rapidapi.com/UserByScreenName/",
        params: { username },
        headers: {
          "X-RapidAPI-Key":
            "0d5ee77e62mshe7b65350fb23a36p1aef5bjsn74758f060ebf",
          "X-RapidAPI-Host": "twitter135.p.rapidapi.com",
        },
      })
      .then((res) => {
        Cookies.set("token", res.data.data.user.result.rest_id);
        if (!res) {
          return (
            <div className="grid h-screen place-items-center">
              <Spinner aria-label="Center-aligned spinner example" size="xl" />
            </div>
          );
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        alert(err.message);
      });
    setInputLogin({ username: "" });
  };

  const handleFunction = {
    fetchDataUser,
    handleInputLogin,
    handleLogin,
  };

  return (
    <GlobalContext.Provider value={{ state, handleFunction }}>
      {children}
    </GlobalContext.Provider>
  );
};
