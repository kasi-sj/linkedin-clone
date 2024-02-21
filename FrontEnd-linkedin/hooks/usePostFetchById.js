import { useState, useEffect } from "react";
import axios from "axios";

const usePostFetchById = (postId) => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);
  const [commentLoading , setCommentLoading] = useState(false);

  const fetchPost = async () => {
    try {
      console.log("fetching post" + " " + postId);
      setloading(true);
      const response = await axios.get(`${url}postById/${postId}`);
      setPost(response.data.post);
      setLiked(response.data.likedUsers);
      setComments(response.data.post.comments);
      console.log(response.data.post.comments)
      setError(false);
    } catch (err) {
      setError(true);
      console.log("error fetching post");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const refetchPost = () => {
    fetchPost();
  };

  const addCommentonPost = async (text, userId) => {
    setCommentLoading(true);
    const response = await axios.post(`${url}addCommentOnPost`, {
      userId: userId,
      postId: postId,
      text: text,
    });
    setCommentLoading(false);
    refetchPost();
    if (response.status == 200) return true;
    return false;
  };

  return { post, loading, error, refetchPost, liked, comments , addCommentonPost , commentLoading };
};

export default usePostFetchById;
