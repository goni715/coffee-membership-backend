

export const isJWTIssuedBeforePassChanged = (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
) => {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000; //seconds
  return passwordChangedTime > jwtIssuedTimestamp;
};