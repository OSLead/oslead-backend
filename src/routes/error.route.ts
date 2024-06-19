import express from "express";
const router = express.Router();

router.get("/login", (req, res) => {
  res.redirect(
    "https://colorlib.com/wp/wp-content/uploads/sites/2/404-error-template-18.png"
  );
});

export default router;
