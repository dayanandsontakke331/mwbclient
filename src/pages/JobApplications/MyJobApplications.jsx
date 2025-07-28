import React, { useState, useEffect } from 'react';
import {
    Box, Card, Typography, Button, TextField, Chip, Pagination
} from '@mui/material';
import axios from 'axios';

const MyJobApplications = () => {
    const [applications, setApplications] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchData = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/myApplications`, {
                params: { search, page, limit: 5 },
            });
            setApplications(data.data);
            setTotal(data.total);
        } catch (err) {
            console.error("Failed to fetch applications:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, search]);

    return (
        <Box sx={{ p: 3 }}>
            <Box mb={3}>
                <TextField
                    fullWidth
                    label="Search Job Title"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />
            </Box>
            {applications.map((app, index) => {
                const job = app.jobDetails || {};
                return (
                    <Card
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 2,
                            mb: 2,
                            borderBottom: '2px solid #7f56da',
                        }}
                    >
                        <Box>
                            <Typography fontWeight={700} fontSize={18}>
                                {job.title || 'Untitled Job'}
                            </Typography>
                            <Typography color="text.secondary">
                                {job.companyName || 'Unknown Company'}
                            </Typography>

                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                                <Chip
                                    label={job.employmentType?.[0] || 'N/A'}
                                    sx={{
                                        backgroundColor:
                                            job.employmentType?.[0] === 'Full-time'
                                                ? 'green'
                                                : job.employmentType?.[0] === 'Free Lancer'
                                                    ? 'red'
                                                    : 'orange',
                                        color: '#fff',
                                        fontWeight: 600,
                                    }}
                                />
                                <Typography color="text.secondary">- {job.location || 'N/A'}</Typography>
                            </Box>

                            <Box mt={1}>
                                <Typography variant="body2" color="text.secondary">
                                    Status: <strong>{app.status}</strong>
                                </Typography>
                            </Box>
                        </Box>
                        
                    </Card>
                );
            })}
            <Box mt={3} display="flex" justifyContent="center">
                <Pagination
                    count={Math.ceil(total / 5)}
                    page={page}
                    onChange={(e, val) => setPage(val)}
                    variant="tonal"
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default MyJobApplications;
