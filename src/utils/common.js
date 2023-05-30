import * as jose from 'jose'

const IS_USER_URN_FOR_TOKEN = process.env.IS_USER_URN_FOR_TOKEN;
const AUDIENCE_USER_URN_FOR_TOKEN = process.env.AUDIENCE_USER_URN_FOR_TOKEN;

export const createToken = async (req, res, next) => {
    console.group(" ** createToken ** ")
    const secret = jose.base64url.decode(process.env.ENCRYPTION_KEY)
    const jwt = await new jose.EncryptJWT(req.body)
        .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
        .setIssuedAt()
        .setIssuer(IS_USER_URN_FOR_TOKEN)
        .setAudience(AUDIENCE_USER_URN_FOR_TOKEN)
        .setExpirationTime('2m')
        .encrypt(secret);
    req.body.token = jwt;
    next();
}

export const verifyToken = async (req, res, next) => {
    const jwt = req.headers.authorization;
    console.log(" ** verifyToken middleware ** ");
    if (jwt) {
        const secret = jose.base64url.decode(process.env.ENCRYPTION_KEY)
        const { payload, protectedHeader } = await jose.jwtDecrypt(jwt, secret, {
            issuer: IS_USER_URN_FOR_TOKEN,
            audience: AUDIENCE_USER_URN_FOR_TOKEN,
        }).catch((err) => {
            console.log("verifyToken error ** ", err.code);
        })
        req.body.encryptedToken = payload && payload;
        next();
    }
    else {
        next();
    }
}

export const dataSort = () => {

}