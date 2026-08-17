import jwt from 'jsonwebtoken';
const generateToken = (payload, secret, expiresIn) => {
    try {
        return jwt.sign(payload, secret, {
            algorithm: 'HS256',
            expiresIn
        });
    }
    catch (error) {
        console.error('JWT Token Generation Error:', error);
        throw error;
    }
};
const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};
export const jwtHelpers = {
    generateToken,
    verifyToken
};
