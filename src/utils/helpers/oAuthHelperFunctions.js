import axios from "axios";
import { linkedInClientId, linkedInClientSecret } from "../../config/config";

export function linkedInOAuth() {
  let url =
    "https://www.linkedin.com/oauth/v2/authorization" +
    "?response_type=code" +
    "&client_id=" +
    linkedInClientId +
    "&redirect_uri=http://localhost:8080/action-linkedin-oauth2" +
    "&scope=" +
    "w_member_social%20" +
    "r_emailaddress%20" +
    "r_liteprofile%20";
  window.open(url);
}

export async function linkedInAccessTokenRequester(authCode) {
  console.log("access code will be requested with", authCode);
  response = await axios({
    method: "POST",
    url: "https://www.linkedin.com/oauth/v2/accessToken",
    data: {
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: "http://localhost:8080/action-linkedin-oauth2",
      client_id: linkedInClientId,
      client_secret: linkedInClientSecret
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).catch(error => {
    console.log(error);
  });
  console.log("linkedInOAuth response", response);
}
