export default () => ({
  documentation: {
    enabled: true,
    config: {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "Grupo SER API",
        description: "API documentation for Grupo SER CMS",
        termsOfService: "",
        contact: {
          name: "Grupo SER",
          email: "",
          url: "",
        },
        license: {
          name: "MIT",
          url: "https://opensource.org/licenses/MIT",
        },
      },
      "x-strapi-config": {
        // Mutate the plugins configuration
        plugins: null,
        path: "/documentation",
      },
      servers: [
        {
          url: "http://localhost:1337/api",
          description: "Development server",
        },
      ],
      externalDocs: {
        description: "Find out more",
        url: "https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html",
      },
      security: [{ bearerAuth: [] }],
    },
  },
});
