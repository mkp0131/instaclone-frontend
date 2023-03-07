module.exports = {
  client: {
    includes: ["./src/**/*.{tsx,ts}"],
    tagName: "gql",
    service: {
      name: "instaclone-backend",
      url: "http://localhost:4444/graphql",
    },
  },
};
