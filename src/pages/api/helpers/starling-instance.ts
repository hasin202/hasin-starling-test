import axios from "axios";

//axios instance with headers and baseurl set
export const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
};

export const starling = axios.create({
  baseURL: "https://api-sandbox.starlingbank.com/api/v2",
  headers: headers,
});
