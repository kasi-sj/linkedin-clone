import { useState, useEffect } from "react";
import axios from "axios";

const useCommentFetchById = (commentId) => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const [comment, setComment] = useState(null);
  const [liked, setLiked] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);
  const [commentLoading , setCommentLoading] = useState(false);

  const fetchComment = async () => {
    try {
      console.log("fetching comment" + " " + commentId);
      setloading(true);
      const response = await axios.get(`${url}commentById/${commentId}`);
      setComment(response.data.comment);
      setLiked(response.data.likedUsers);
      setComments(response.data.comment.comments);
      setError(false);
    } catch (err) {
      setError(true);
      console.log("error fetching comment");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (commentId) {
      fetchComment();
    }
  }, [commentId]);

  const refetchComment = () => {
    fetchComment();
  };

  const addCommentonComment = async (text, userId) => {
    try{
      setCommentLoading(true);
      const response = await axios.post(`${url}addCommentOnComment`, {
        userId: userId,
        CommentId: commentId,
        text: text,
      });
      setCommentLoading(false);
      refetchComment();
      if (response.status == 200) return true;
      return false;
    }catch(e){
      console.log(e);
    }
  };

  return { comment, loading, error, refetchComment, liked, comments , addCommentonComment , commentLoading };
};

export default useCommentFetchById;
