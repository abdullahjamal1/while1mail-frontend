import React, { useEffect } from "react";
import httpService from "../../services/httpService";
import { loginWithJwt } from "../../services/authService";
import queryString from "query-string";

export default function OauthCallBack(props) {
  //   window.location = "/";

  useEffect(() => {
    async function getCurrentHeaders() {
      //   const response = await httpService.get(window.location);
      //   console.log(response.headers);
      //   console.log(response.headers["x-auth-token"]);
      const params = queryString.parse(props.location.search);
      console.log(params.token);
      loginWithJwt(params.token);
      document.location = "/";
    }
    getCurrentHeaders();
  }, []);

  return <div></div>;
}
