module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL
    || 'postgres://cgddcqawdkkmeb:2215df5a835a46916425e38e001c3bb091164d41728298da602cfd558ee693f2@ec2-107-20-155-148.compute-1.amazonaws.com:5432/dfjj3p2cg4ri47',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}
