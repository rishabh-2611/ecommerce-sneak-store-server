module.exports = {
    app: {
      clientApp: process.env.CLIENT_APP,
      serverApp: process.env.SERVER_APP,
      host: process.env.HOST
    },
    mongodb: {
      uri: process.env.MONGODB_URI
    },
    jwt_secret: process.env.JWT_SECRET,
  }
  