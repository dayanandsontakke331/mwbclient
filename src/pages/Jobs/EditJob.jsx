import React, { useEffect, useState } from 'react';
import { useParams, } from 'react-router-dom';
import axios from 'axios';
import PostJob from './PostJob';
import { CircularProgress, Box } from '@mui/material';

const EditJob = () => {
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/getJob/${jobId}`);
      if (response.data.success) {
        setJobData(response.data.data);
      }
    } catch (error) {
      console.log("Failed to fetch job details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <PostJob initialData={jobData} />;
};

export default EditJob;
