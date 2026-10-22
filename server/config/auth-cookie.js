const getAuthCookieOptions = (req) => {
    const secure = req.secure;

    return {
        httpOnly: true,
        secure,
        sameSite: secure ? "none" : "lax"
    };
};

module.exports = { getAuthCookieOptions };
