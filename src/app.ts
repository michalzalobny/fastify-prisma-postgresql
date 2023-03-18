import Fastify from "fastify";

const server = Fastify();

//Used to check if the server is running
server.get("/healthcheck", async () => {
  return {
    status: "OK",
  };
});

async function main() {
  try {
    await server.listen({ port: 5000, host: "0.0.0.0" });
    console.log("Server ready at http://localhost:5000");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
