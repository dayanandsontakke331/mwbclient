import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Card,
    Typography,
    TextField,
    MenuItem,
    CircularProgress,
    Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import axios from 'axios';

const AllJobs = ({ role, userId }) => {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [skillsFilter, setSkillsFilter] = useState('');

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/getAllJobs`, {
                params: {
                    page: page + 1,
                    limit: pageSize,
                    search,
                    skills: skillsFilter,
                    role,
                    userId
                }
            });

            setRows(res.data.data);
            setTotal(res.data.total);
        } catch (err) {
            console.error('Failed to fetch jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [page, pageSize, search, skillsFilter]);

    const updateJobStatus = async (jobId, newStatus) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/jobs/update`, {
                jobId: jobId,
                status: newStatus,
            });

            const updatedStatus = response?.data?.data?.status;
            if (updatedStatus) {
                setRows(prevRows =>
                    prevRows.map(row =>
                        row._id === jobId ? { ...row, status: updatedStatus } : row
                    )
                );
            }
        } catch (err) {
            console.error('Failed to update job status:', err);
        }
    };

    const columns = useMemo(() => [
        {
            field: 'title',
            headerName: 'Title',
            flex: 0.2,
            minWidth: 150,
        },
        {
            field: 'companyName',
            headerName: 'Company',
            flex: 0.2,
            minWidth: 150,
        },
        {
            field: 'skills',
            headerName: 'Skills',
            flex: 0.3,
            minWidth: 200,
            valueGetter: (params) => {
                return Array.isArray(params) ? params.join(', ') : 'N/A'
            }
        },
        {
            field: 'proficiencyLevel',
            headerName: 'Proficiency Level',
            flex: 0.3,
            minWidth: 200,
            valueGetter: (params) => {
                return params
            }
        },
        {
            field: 'minSalary',
            headerName: 'Min Salary',
            flex: 0.3,
            minWidth: 200,
            valueGetter: (params) => {
                return `₹${params}`
            }
        },
        {
            field: 'maxSalary',
            headerName: 'Max Salary',
            flex: 0.3,
            minWidth: 200,
            valueGetter: (params) => {
                return `${params}`
            }
        },
        {
            field: 'location',
            headerName: 'Work Mode',
            flex: 0.2,
            minWidth: 150,
        },
        {
            field: 'locations',
            headerName: 'Locations',
            flex: 0.3,
            minWidth: 200,
            valueGetter: (params) => {
                return Array.isArray(params) ? params.join(', ') : 'N/A'
            }
        },
        {
            field: 'postedByDetails',
            headerName: 'Posted By',
            flex: 0.3,
            minWidth: 200,
            valueGetter: (params) => {
                console.log("params", params)
                return `${params.firstName} ${params.lastName}`
            }
        },
        {
            field: 'status',
            headerName: 'Job Status',
            flex: 0.3,
            minWidth: 200,
            renderCell: ({ row }) => (
                <Chip
                    label={row.status}
                    color={row.status === 'Open' ? 'success' : 'error'}
                    variant="outlined"
                    size="small"
                    clickable
                    onClick={() => updateJobStatus(row._id, row.status === 'Open' ? 'Closed' : 'Open')}
                />
            )
        }
    ], []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography fontWeight={700} fontSize={24} mb={3}>
                Job Listing
            </Typography>
            <Card sx={{ p: 2, width: '100%', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        size="small"
                        label="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <TextField
                        size="small"
                        label="Skills"
                        value={skillsFilter}
                        onChange={(e) => setSkillsFilter(e.target.value)}
                    />
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ width: '100%', overflowX: 'auto' }}>
                        <Box sx={{ minWidth: 1000 }}>
                            <DataGrid
                                autoHeight
                                rows={rows}
                                getRowId={(row) => row._id}
                                columns={columns}
                                rowCount={total}
                                pagination
                                paginationMode="server"
                                page={page}
                                onPageChange={(newPage) => setPage(newPage)}
                                pageSize={pageSize}
                                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                rowsPerPageOptions={[10, 25, 50]}
                                disableSelectionOnClick
                            />
                        </Box>
                    </Box>
                )}
            </Card>

        </Box>



    );
};

export default AllJobs;
