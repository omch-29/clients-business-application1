import jwt from "jsonwebtoken";

export function protectAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.admin = { email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
}
