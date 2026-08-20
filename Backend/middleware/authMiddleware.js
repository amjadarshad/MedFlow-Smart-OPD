import jwt from "jsonwebtoken";

// Use this on any route that should only work for logged-in users.
// It reads the token from the "Authorization: Bearer <token>" header,
// verifies it, and attaches the decoded { id, role } to req.user.
export function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next(); // token is valid, continue to the actual route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
}

// Use AFTER protect() on routes that should only work for specific roles.
// Example: router.get("/admin-only", protect, allowRoles("admin"), handler);
export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You don't have permission to do this." });
    }
    next();
  };
}
