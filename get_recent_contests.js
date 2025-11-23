import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.LUQTA_BASE_URL;
const API_GROUP = __ENV.LUQTA_API_GROUP;
const AUTH_TOKEN = __ENV.LUQTA_TOKEN || "";

const paging = JSON.stringify({ page: 1, per_page: 20 });

const URL_CONTEST_LIST = `${BASE_URL}/${API_GROUP}/getrecentcontest?paging=${encodeURIComponent(paging)}`; //more parameters here

export const options = {
  vus: 1,
  duration: "5s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1500"],
  },
};

function authHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (AUTH_TOKEN) {
    headers["Authorization"] = `Bearer ${AUTH_TOKEN}`;
  }
  return headers;
}

export default function () {
  const res = http.get(URL_CONTEST_LIST, {
    headers: authHeaders(),
  });

  check(res, {
    "status is 200": (r) => r.status == 200,
  });

  //console.log("STATUS:", res.status, "BODY:", res.body); // to output the error

  sleep(1); //to simulate user scrolling a bit before the next request
}
