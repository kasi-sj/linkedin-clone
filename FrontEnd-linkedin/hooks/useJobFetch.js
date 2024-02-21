import { useState , useEffect } from "react";
import axios from "axios";

const useJobFetch = ({keyword , page}) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL ;
    const [jobs , setJobs] = useState([]);
    const [loading , setLoading] = useState(false);
    const [error , setError] = useState(false);

    const fetchJobs = async () => {
        try{
            setLoading(true);
            const props = {
                keyword,
                page
            }
            const response = await axios.post(`${url}jobs` , props);
            setJobs(response.data.jobs);
            setError(false);
        } catch(err){
            setError(true);
            console.log("error fetching jobs",err);
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchJobs();
    }, [keyword , page]);

    const refetchJobs = () => {
        fetchJobs();
    }

    return { jobs , loading , error , refetchJobs };
};

export default useJobFetch;
