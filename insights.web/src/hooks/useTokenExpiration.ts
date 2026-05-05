import { logout } from "@src/services/login";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "../store";

const useTokenExpirationCheck = (simulatedExpireTime = 60 * 1000) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { token, expire } = useSelector((state: RootState) => state.login.data);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!token) {
      setExpired(true);
      dispatch(logout());
      return;
    }

    const checkTokenExpiration = () => {
      const currentTime = Date.now();
      if (expire <= currentTime) {
        setExpired(true);
        dispatch(logout());
      }
    };

    const intervalId = setInterval(checkTokenExpiration, simulatedExpireTime);
    //clear interval
    return () => clearInterval(intervalId);
  }, [expire, dispatch, router, token, simulatedExpireTime]);

  return expired;
};

export default useTokenExpirationCheck;
