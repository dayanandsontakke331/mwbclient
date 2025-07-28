import { useState, useMemo } from "react";
import {
  Box,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Pagination,
  Chip,
  Stack,
} from "@mui/material";

function JobsList({ jobs, onSelect, page, setPage, count }) {
  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      `${job.title} ${job.companyName} ${job.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, jobs]);

  return (
    <>
      <TextField
        label="Search jobs"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        sx={{ mb: 2 }}
      />

      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Paper variant="outlined">
          <List disablePadding>
            {filteredJobs.map((job) => (
              <ListItem
                key={job._id}
                button
                onClick={() => onSelect(job)}
                sx={{
                  borderBottom: "1px solid #eee",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  py: 1.5,
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      {job.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {job.companyName} — {job.location}
                      </Typography>

                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        ₹{job.minSalary}k - ₹{job.maxSalary}k
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {job.description.slice(0, 100)}...
                      </Typography>

                      <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                        {job.skills?.slice(0, 3).map((skill, index) => (
                          <Chip key={index} label={skill} size="small" />
                        ))}
                      </Stack>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      <Pagination
        count={count}
        page={page}
        onChange={(el, val) => setPage(val)}
        sx={{ mt: 2 }}
      />
    </>
  );
}

export default JobsList;
