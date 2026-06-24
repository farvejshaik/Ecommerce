const sendToken = (user, statusCode, res) => {
  const accessToken = user.getJwtToken();
  const refreshToken = user.getRefreshToken();

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  };

  res.status(statusCode).cookie("refreshToken", refreshToken, options).json({
    success: true,
    user,
    token: accessToken,
  });
};


module.exports = sendToken;