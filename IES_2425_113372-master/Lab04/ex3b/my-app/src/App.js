import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Fetch posts using Axios
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts?_limit=10")
      .then((response) => {
        setPosts(response.data);
        console.log("Posts fetched:", response.data);  // Log dos posts ao buscar
      })
      .catch((err) => console.error("Error fetching data with Axios:", err));
  }, []);

  // Handle adding a new post using Axios
  const addPostAxios = async (title, body) => {
    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/posts", {
        title,
        body,
        userId: 1,
      });
      setPosts((prevPosts) => [response.data, ...prevPosts]);
      console.log("Post added:", response.data);  // Log quando o post é adicionado
    } catch (err) {
      console.error("Error adding post with Axios:", err);
    }
  };

  // Handle deleting a post using Axios
  const deletePost = (id) => {
    // Tentando excluir na API primeiro
    axios
      .delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(() => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
        console.log("Post deleted on server:", id);  // Log do sucesso de exclusão
      })
      .catch((err) => {
        console.error("Error deleting post:", err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPostAxios(title, body);
    setTitle("");
    setBody("");
  };

  return (
    <div>
      <h1>Posts</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <button type="submit">Add Post</button>
      </form>

      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <button onClick={() => deletePost(post.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
