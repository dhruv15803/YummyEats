import jwt from "jsonwebtoken";
const authenticatedUser = async (req, res, next) => {
    if (!req.cookies?.accessToken) {
        res.json({
            success: false,
            message: "no accessToken cookie,user not logged in",
        });
        return;
    }
    const decodedToken = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    req.userId = userId;
    next();
};
export { authenticatedUser };
