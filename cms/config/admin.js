module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '1540edfd9417d5e8c5e89cab117a9413'),
  },
});
