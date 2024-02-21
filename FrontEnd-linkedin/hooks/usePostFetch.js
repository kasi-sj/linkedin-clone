import { useState, useEffect } from "react";
import axios from "axios";

const usePostFetch = (userId) => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const [posts, setPosts] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);

  const fetchPosts = async () => {
    try {
      setloading(true);
      const response = await axios.get(
        `${url}post/${userId}`
      );
      const postData = response.data;
      setPosts(postData.posts);
      console.log("posts fetched");
      setError(false);
    } catch (err) {
      setError(true);
      console.log("error fetching posts");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  const refetchPosts = () => {
    fetchPosts();
  }

  const removePost = (postId) => {
    setPosts(posts.filter((post) => post.id != postId));
  }

  return { posts, loading, error , refetchPosts , removePost};
};

export default usePostFetch;
