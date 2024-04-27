myServer.get("/users/:id", (request, response) => {
    const userId = request.params.id;
    for (let i = 0; i < usersJson.length; i++) {
      if (usersJson[i].id == userId) {
        response.json(usersJson[i]);
      }
    }
    response.send("User not found!");
  });
 

