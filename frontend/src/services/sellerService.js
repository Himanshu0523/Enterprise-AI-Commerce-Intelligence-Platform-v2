import API from "./api";

export const registerSeller = (sellerDetails) => API.post("/sellers/register", sellerDetails);
