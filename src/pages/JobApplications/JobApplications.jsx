import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Card, Typography, TextField, MenuItem, Button
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/jobApplications`, {
        params: {
          page: page + 1,
          limit: pageSize,
          search,
          status: statusFilter
        }
      });
      setApplications(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, pageSize, search, statusFilter]);

  const columns = useMemo(() => [
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 0.15,
      minWidth: 120,
      renderCell: ({ row }) => moment(row.createdAt).format('DD-MM-YYYY'),
    },
    {
      field: 'job',
      headerName: 'Job Title',
      flex: 0.15,
      minWidth: 120,
      renderCell: ({ row }) => row.job.title,
    },
    { field: 'name',
      headerName: 'Name',
      flex: 0.2, 
      minWidth: 150 ,
      renderCell: ({ row }) => `${row.user.firstName} ${row.user.lastName}`,

    },
    { 
      field: 'phone', 
      headerName: 'Phone', 
      flex: 0.2, minWidth: 180,
      renderCell: ({ row }) => `${row.user.phone}`,
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 0.2, minWidth: 180,
      renderCell: ({ row }) => `${row.user.email}`,

    },
    { field: 'appliedFor', 
      headerName: 'Applied For', 
      flex: 0.2, minWidth: 180 
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 0.15, 
      minWidth: 120 
    },
    {
      field: 'preferences',
      headerName: 'Resume',
      flex: 0.15,
      minWidth: 120,
      renderCell: ({ row }) =>
        row?.preferences.resume ? (
          <Button
            variant="outlined"
            size="small"
            href={`${import.meta.env.VITE_API_BASE_URL}${row.preferences.resume}`}
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
        <Typography fontWeight={700} fontSize={24} mb={3}>Job Applications</Typography>
        <Card sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              size="small"
              label="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <TextField
              size="small"
              select
              label="Status"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Applied">Applied</MenuItem>
              <MenuItem value="Reviewed">Reviewed</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
          </Box>
          <DataGrid
            autoHeight
            loading={loading}
            rows={applications}
            getRowId={(row) => row._id}
            columns={columns}
            pageSize={pageSize}
            page={page}
            rowCount={total}
            pagination
            paginationMode="server"
            onPageChange={newPage => setPage(newPage)}
            onPageSizeChange={newSize => {
              setPageSize(newSize);
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
          />
        </Card>
      </Box>
    </Box>
  );
};

export default JobApplications;
