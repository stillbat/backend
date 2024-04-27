const postsJson = require ("./post.json")
const fs = require("fs");

const getUserPosts = (req, res) => {
    const userId = req.params.id;
    const userPosts = postsJson.filter((value)=> value.owner == userId);
    res.send(userPosts)
};

const postsServer = (myServer) => {
    myServer.get("/users/:id/post", getUserPosts);

    myServer.get("/posts/:id", (req,res) => {
        const postId = req.params.id
        const post = posts.postsJson.filter ((value)=> value.id == postID);
        res.send(post);
    });
} ;

module.exports = {getUserPosts, postsServer};

