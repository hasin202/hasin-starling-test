import axios from "axios";
import { NextApiResponse } from "next";

//Function to handle errors for API endpoints.
//If the error has a status code return the error with the same code, if not return it with 500
//Allow the api to pass a message to specifiy where the error occurred.
export const handleError = (
  res: NextApiResponse,
  error: unknown,
  message: string
) => {
  if (axios.isAxiosError(error) && error.response?.status) {
    return res.status(error.response.status).json({
      message: message || "Hmmm. We really don't know what went wrong here.",
    });
  } else {
    return res.status(500).json({
      message: message || "Hmmm. We really don't know what went wrong here",
    });
  }
};
