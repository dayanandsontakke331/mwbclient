import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Grid,
    TextField,
    Checkbox,
    MenuItem,
    FormControlLabel,
    Paper,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import custom from '../../configs/custom';
import { validatePostJob } from '../../configs/Validation';

const steps = ['Basic Details', 'Job Details', /*'Placement Structure', */ 'Settings'];

const defaultForm = {
    title: '',
    description: '',
    companyName: '',
    skills: '',
    additionalSkills: '',
    location: '',
    employmentType: [],
    proficiencyLevel: '',
    openings: 1,
    locations: '',
    minSalary: '',
    maxSalary: '',
    isLive: false,
    status: 'Open',
};

const PostJob = ({ initialData = null }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [form, setForm] = useState(defaultForm);
    const [loading, setLoading] = useState(false);
    const toArray = str => str.split(',').map(str => str.trim()).filter(Boolean);
    const [fieldErr, setFieldErr] = useState({})

    useEffect(() => {
        if (initialData) {
            setForm({
                ...defaultForm,
                ...initialData,
                skills: Array.isArray(initialData.skills) ? initialData.skills.join(', ') : '',
                additionalSkills: Array.isArray(initialData.additionalSkills) ? initialData.additionalSkills.join(', ') : '',
                locations: Array.isArray(initialData.locations) ? initialData.locations.join(', ') : '',
            });
        }
    }, [initialData]);

    const handleChange = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleMultiSelectChange = (field, option) => () => {
        setForm((prev) => {
            const updated = prev[field].includes(option)
                ? prev[field].filter((item) => item !== option)
                : [...prev[field], option];
            return { ...prev, [field]: updated };
        });
    };

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setFieldErr({});
        const errs = validatePostJob(form);
        if (Object.keys(errs).length > 0) {
            setFieldErr(errs);
            return
        }
        setLoading(true);
        const payload = {
            ...form,
            skills: toArray(form.skills),
            additionalSkills: toArray(form.additionalSkills),
            locations: toArray(form.locations),
        };
        console.log("payload", payload);
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/jobs/post`, payload);
        console.log("response", response)
        if (response?.data?.success) {
            toast.success(response.data.message);
            setLoading(false);
            setForm(defaultForm);
            setActiveStep(0)
            return;
        }
        toast.success("Error occured while posting job");
        setLoading(false);
        return;
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {[
                            { label: 'Job Title', field: 'title' },
                            { label: 'Company Name', field: 'companyName' },
                            { label: 'Description', field: 'description', multiline: true, rows: 1 },
                        ].map(({ label, field, ...rest }) => (
                            <Grid item xs={12} sm={6} key={field}>
                                <TextField
                                    size='small'
                                    fullWidth
                                    label={label}
                                    value={form[field]}
                                    onChange={handleChange(field)}
                                    error={!!fieldErr[field]}
                                    helperText={fieldErr[field]}
                                    {...rest}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 1:
                return (
                    <form noValidate autoComplete="off" onSubmit={e => e.preventDefault()}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Skills (comma separated)"
                            value={form.skills}
                            onChange={handleChange('skills')}
                            sx={{ mb: 4 }}
                            error={!!fieldErr.skills}
                            helperText={fieldErr.skills}
                        />
                        <TextField
                            fullWidth
                            size="small"
                            label="Additional Skills"
                            value={form.additionalSkills}
                            onChange={handleChange('additionalSkills')}
                            error={!!fieldErr.additionalSkills}
                            helperText={fieldErr.additionalSkills}
                            sx={{ mb: 4 }}
                        />
                        <TextField
                            fullWidth
                            size="small"
                            select
                            label="Proficiency Level"
                            value={form.proficiencyLevel}
                            onChange={handleChange('proficiencyLevel')}
                            error={!!fieldErr.proficiencyLevel}
                            helperText={fieldErr.proficiencyLevel}
                            sx={{ mb: 4 }}
                        >
                            {Object.entries(custom.proficiencyLevels).map(([key, value]) => (
                                <MenuItem key={key} value={key}>{value}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            size="small"
                            label="Locations (comma separated)"
                            value={form.locations}
                            onChange={handleChange('locations')}
                            error={!!fieldErr.locations}
                            helperText={fieldErr.locations}
                            sx={{ mb: 4 }}
                        />
                        <TextField
                            fullWidth
                            size="small"
                            select
                            label="Location"
                            value={form.location}
                            onChange={handleChange('location')}
                            error={!!fieldErr.location}
                            helperText={fieldErr.location}
                            sx={{ mb: 4 }}
                        >
                            {Object.entries(custom.location).map(([key, value]) => (
                                <MenuItem key={key} value={key}>{value}</MenuItem>
                            ))}
                        </TextField>
                        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Openings"
                                value={form.openings}
                                onChange={handleChange('openings')}
                                error={!!fieldErr.openings}
                                helperText={fieldErr.openings}
                            />
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Min Salary"
                                value={form.minSalary}
                                onChange={handleChange('minSalary')}
                                error={!!fieldErr.minSalary}
                                helperText={fieldErr.minSalary}
                            />
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Max Salary"
                                value={form.maxSalary}
                                onChange={handleChange('maxSalary')}
                                error={!!fieldErr.maxSalary}
                                helperText={fieldErr.maxSalary}
                            />
                        </Box>
                    </form>
                );
            case 2:
                return (
                    <Grid container spacing={2} sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Employment Type
                            </Typography>
                            <Grid container spacing={2}>
                                {Object.keys(custom.employmentType).map((type) => (
                                    <Grid item xs={12} sm={4} key={type}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={form.employmentType.includes(type)}
                                                    onChange={handleMultiSelectChange('employmentType', type)}
                                                />
                                            }
                                            label={custom.employmentType[type]}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Direct Job Live
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.isLive}
                                        onChange={handleChange('isLive')}
                                    />
                                }
                                label="Make Job Live"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Job Status
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                select
                                label="Status"
                                value={form.status}
                                onChange={handleChange('status')}
                            >
                                {['Open', 'Closed'].map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                );
            default:
                return null;
        }
    };

    return (
        <Paper elevation={3} sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
            <Typography variant="h5" gutterBottom>
                {initialData ? 'Update Job Posting' : 'Post a New Job'}
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
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                >
                    Back
                </Button>

                {activeStep === steps.length - 1 ? (
                    <Button
                        variant="outlined"
                        onClick={handleFinalSubmit}
                        disabled={loading}
                        startIcon={
                            loading ? <CircularProgress size={20} color="inherit" /> : null
                        }
                    >
                        {loading ? (initialData ? 'Updating...' : 'Posting...') : initialData ? 'Update Job' : 'Post Job'}
                    </Button>
                ) : (
                    <Button variant="outlined" onClick={handleNext}>
                        Next
                    </Button>
                )}
            </Box>
        </Paper>
    );
};

export default PostJob;
