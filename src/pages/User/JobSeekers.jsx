import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  MenuItem,
  Button
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';

const JobSeekers = () => {
  const [search, setSearch] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchJobSeekers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/jobSeekers`, {
        params: {
          page: page + 1,
          limit: pageSize,
          search,
          experience: experienceFilter,
        },
      });
      setJobSeekers(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error('Error fetching job seekers', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobSeekers();
  }, [page, pageSize, search, experienceFilter]);

  const columns = useMemo(() => [
    {
      field: 'createdAt',
      headerName: 'Joined',
      flex: 0.15,
      minWidth: 120,
      renderCell: ({ row }) => moment(row.createdAt).format('DD-MM-YYYY'),
    },
    { field: 'name', headerName: 'Name', flex: 0.2, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 0.25, minWidth: 180 },
    { field: 'phone', headerName: 'Phone', flex: 0.15, minWidth: 150 },
    { field: 'skills', headerName: 'Skills', flex: 0.3, minWidth: 200 },
    {
      field: 'resume',
      headerName: 'Resume',
      flex: 0.15,
      minWidth: 130,
      renderCell: ({ row }) =>
        row?.resume ? (
          <Button
            variant="outlined"
            size="small"
            href={`${import.meta.env.VITE_API_BASE_URL}${row.resume}`}
            target="_blank"
          >
            View
          </Button>
        ) : '-',


    },
  ], []);

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%' }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography fontWeight={700} fontSize={24} mb={3}>Job Seekers</Typography>
        <Card sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              size="small"
              label="Search"
              value={search}
              onChange={e => {
                setPage(0);
                setSearch(e.target.value);
              }}
            />
            <TextField
              size="small"
              select
              label="Experience"
              value={experienceFilter}
              onChange={e => {
                setPage(0);
                setExperienceFilter(e.target.value);
              }}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All</MenuItem>
              {[1, 2, 3, 5].map(year => (
                <MenuItem key={year} value={year}>{year}+ years</MenuItem>
              ))}
            </TextField>
          </Box>

          <DataGrid
            autoHeight
            rows={jobSeekers}
            getRowId={(row) => row._id}
            columns={columns}
            rowCount={total}
            pagination
            paginationMode="server"
            pageSize={pageSize}
            page={page}
            loading={loading}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Card>
      </Box>
    </Box>
  );
};

export default JobSeekers;
