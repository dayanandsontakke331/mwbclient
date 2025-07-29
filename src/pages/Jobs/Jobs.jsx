import { useEffect, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import debounce from "lodash.debounce";
import JobList from "./JobList";
import JobDetails from "./JobDetails";

const PER_PAGE = 5;

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async (term = "", pg = 1) => {
    try {
      setLoading(true);
      console.log("Fetching with:", term, pg);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/jobs/list`, {
        params: {
          search: term,
          page: pg,
          limit: PER_PAGE,
        },
      });
      setJobs(res.data.data);
      setTotalCount(res.data.totalCount);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchJobs = useCallback(
    debounce((term, pg) => fetchJobs(term, pg), 500),
    []
  );

  useEffect(() => {
    debouncedFetchJobs(searchTerm, page);
  }, [searchTerm, page]);

  useEffect(() => {
    return () => {
      debouncedFetchJobs.cancel();
    };
  }, [debouncedFetchJobs]);

  const count = Math.ceil(totalCount / PER_PAGE);

  return (
    <Box
      sx={{
        height: "calc(100vh - 100px)",
        display: "flex",
        borderRadius: 1,
        overflow: "hidden",
        backgroundColor: "background.paper",
        boxShadow: 4,
      }}
    >
      <Box sx={{ width: "35%", minWidth: 320, borderRight: "1px solid #eee", p: 2, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" gutterBottom>Jobs</Typography>
        <JobList
          jobs={jobs}
          onSelect={setSelectedJob}
          page={page}
          setPage={setPage}
          count={count}
          loading={loading}
          search={searchTerm}
          setSearch={setSearchTerm}
        />
      </Box>

      <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
        <Typography variant="h6" gutterBottom>Job Details</Typography>
        <JobDetails job={selectedJob} />
      </Box>
    </Box>
  );
}

export default Jobs;
