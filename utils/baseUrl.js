const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://react-market.herokuapp.com"
    : "http://localhost:3000"

export default baseUrl;