import signup from "../src/signup";

const PORT = 3000;
signup.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
