const register = {
  type: "object",
  required: ["firstName", "lastName", "email", "password"],
  properties: {
    firstName: { type: "string", isNotEmpty: true },
    lastName: { type: "string", isNotEmpty: true },
    email: { type: "string", isNotEmpty: true },
    password: { type: "string", isNotEmpty: true },
  },
  errorMessage: {
    properties: {
      firstName: "firstName should be a valid string",
      lastName: "lastName should be a valid string",
      email: "email should be a valid string",
      password: "password should be valid",
    },
    required: {
      firstName: "firstName is required",
      lastName: "lastName is required",
      email: "email is required",
      password: "password is required",
    },
  },
};

export default {
  register
};
