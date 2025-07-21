 import jwt from "jsonwebtoken";
 export const auth = (req, res, next) => {
    let token;
    if(req.headers.athorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
        try 
        {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.userId = decoded.id;
            next();
            return;
        }
        catch (err)
        {
            next(err);
            return;
        }
    }
    const error = new Error("Not authenticated!")
    error.statusCode = 401;
    next();
 }