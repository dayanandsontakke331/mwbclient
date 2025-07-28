import React, { useEffect, useState } from 'react';
import {
    Box, Stepper, Step, StepLabel, Button, Typography,
    Grid, TextField, Paper, CircularProgress, MenuItem
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import UploadResume from './UploadResume';
import DownloadIcon from '@mui/icons-material/Download';
import { tempValidatePreferences } from '../../configs/Validation';

const steps = ['Profile Summary', 'Skills & Roles', 'Additional Info'];

const defaultForm = {
    profileSummary: '',
    skills: '',
    additionalSkills: '',
    roles: '',
    experience: '',
    currentSalary: '',
    expectedSalary: '',
    qualifications: '',
    resume: '',
    pastWorkUrls: '',
};

const JobPreferences = ({ userId }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [form, setForm] = useState(defaultForm);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [fieldErr, setFieldErr] = useState({});

    if (!userId) {
        userId = user._id;
    }

    const getJobPreferences = async (userId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/getJobPreferencesByUser/${userId}`);

            if (response.data.success) {
                setForm(response.data.data)
                console.log('Job Preferences', response.data.data);
                return response.data.data;
            } else {
                console.warn('No preferences found');
                return null;
            }
        } catch (error) {
            console.error('Error fetching job preferences:', error);
            return null;
        }
    };

    useEffect(() => {
        getJobPreferences(user._id)
    }, [user._id]);

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);
    const toArray = (str) => {
        if (Array.isArray(str)) {
            return str.map(s => s.trim()).filter(Boolean);
        }
        if (typeof str === 'string') {
            return str.split(',').map(s => s.trim()).filter(Boolean);
        }
        return [];
    };

    const handleFinalSubmit = async () => {
        setFieldErr({});
        let errs = tempValidatePreferences(form);
        console.log("errs", errs)
        if (Object.keys(errs).length > 0) {
            setFieldErr(errs);
            toast.error("Enter all steps values");
            return;
        }
        setLoading(true);
        const payload = {
            ...form,
            userId,
            skills: toArray(form.skills),
            additionalSkills: toArray(form.additionalSkills),
            roles: toArray(form.roles),
            qualifications: toArray(form.qualifications),
            pastWorkUrls: toArray(form.pastWorkUrls),
            experience: Number(form.experience),
            currentSalary: Number(form.currentSalary),
            expectedSalary: Number(form.expectedSalary),
        };

        try {
            const url = `${import.meta.env.VITE_API_BASE_URL}/jobPreferencesSetting`;
            const method = 'post';
            console.log("payload", payload)
            // return
            const res = await axios[method](url, payload);
            console.log("res.data.data", res.data.data, res.data.success)
            if (res.data.success) {
                setForm(res.data.data)
                toast.success(res.data.message || 'Preferences saved successfully');
                setActiveStep(0);
                // setForm(defaultForm);
            } else {
                toast.error(res.data.message || 'Something went wrong');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error occurred while saving preferences');
        }

        setLoading(false);
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2} sx={{}}>
                        <Grid item xs={12} sx={{ width: '100%' }}>
                            <TextField
                                fullWidth
                                label="Profile Summary"
                                multiline
                                rows={3}
                                value={form.profileSummary}
                                onChange={handleChange('profileSummary')}
                                error={!!fieldErr.profileSummary}
                                helperText={fieldErr.profileSummary}
                            />
                        </Grid>
                    </Grid>

                );
            case 1:
                return (
                    <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Skills (comma separated)"
                                value={form.skills}
                                onChange={handleChange('skills')}
                                error={!!fieldErr.skills}
                                helperText={fieldErr.skills}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Additional Skills (comma separated)"
                                value={form.additionalSkills}
                                onChange={handleChange('additionalSkills')}
                                error={!!fieldErr.additionalSkills}
                                helperText={fieldErr.additionalSkills}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Roles Interested (comma separated)"
                                value={form.roles}
                                onChange={handleChange('roles')}
                                error={!!fieldErr.roles}
                                helperText={fieldErr.roles}
                            />
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Experience (years)"
                                type="number"
                                value={form.experience}
                                onChange={handleChange('experience')}
                                error={!!fieldErr.experience}
                                helperText={fieldErr.experience}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Current Salary"
                                type="number"
                                value={form.currentSalary}
                                onChange={handleChange('currentSalary')}
                                error={!!fieldErr.currentSalary}
                                helperText={fieldErr.currentSalary}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Expected Salary"
                                type="number"
                                value={form.expectedSalary}
                                onChange={handleChange('expectedSalary')}
                                error={!!fieldErr.expectedSalary}
                                helperText={fieldErr.expectedSalary}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            {form.resume?.includes('static_data') ? (
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<DownloadIcon />}
                                    component="a"
                                    href={`${import.meta.env.VITE_API_BASE_URL}${form.resume}`}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download Resume
                                </Button>
                            ) : (
                                <Button fullWidth variant="outlined" disabled>
                                    No Resume Available
                                </Button>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Qualifications (comma separated)"
                                value={form.qualifications}
                                onChange={handleChange('qualifications')}
                                error={!!fieldErr.qualifications}
                                helperText={fieldErr.qualifications}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Past Work URLs (comma separated)"
                                value={form.pastWorkUrls}
                                onChange={handleChange('pastWorkUrls')}
                            />
                        </Grid>
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <Box>
            <Paper elevation={3} sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {form?._id ? 'Update Job Preferences' : 'Profile Details'}
                </Typography>

                <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 3 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ mb: 2 }}>{renderStepContent(activeStep)}</Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined" color='warning'>
                        Back
                    </Button>

                    {activeStep === steps.length - 1 ? (
                        <Button
                            variant="outlined"
                            onClick={handleFinalSubmit}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {loading ? (form?._id ? 'Updating...' : 'Submitting...') : form?._id ? 'Update' : 'Submit'}
                        </Button>
                    ) : (
                        <Button variant="outlined" onClick={handleNext}>
                            Next
                        </Button>
                    )}
                </Box>
                <ToastContainer />
            </Paper>
            {user.role === 'jobseeker' && (
                <Paper elevation={3} sx={{ maxWidth: 900, mx: 'auto', p: 4, mt: 2 }}>
                    <UploadResume />
                </Paper>
            )}
        </Box>
    );
};

export default JobPreferences;
