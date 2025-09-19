import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "No token provided" });

    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded should contain id and role (from login)
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
