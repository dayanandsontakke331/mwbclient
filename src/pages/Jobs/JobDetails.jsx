import { Card, CardContent, Typography, Box, Chip, Stack, Button } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
const JobDetails = ({ job }) => {
    const { user } = useAuth();

    if (!job) return <Typography>Select a job to view details.</Typography>;

    const handleApply = async () => {
        try {
            // console.log("apply", {
            //     jobId: job._id,
            //     userId: user ? user._id : ""
            // });
            // return
 
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/applyForJob`, {
                jobId: job._id,
                userId: user ? user._id : ""
            });
    
            console.log(response.status)


            console.log("response.data.success", response.data.success)


            if (response.data.success === false && response.status == 409) {
                alert("Already applied for this job!", { position: "top-right" });
            }

            if (response.data.success) {
                alert("Applied successfully!", { position: "top-right" });
            }
        } catch (err) {
            console.log("error", err?.response?.data?.message)
            alert(err?.response?.data?.message || "Error occured while apply job", { position: "top-right" });
        }
    };

    useEffect(() => {
        return () => {
            toast.dismiss();
        };
    }, []);

    return (
        <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <Typography variant="h5" gutterBottom>{job.title}</Typography>
                <Typography variant="subtitle1" gutterBottom>
                    {job.companyName} — {job.location}
                </Typography>
                <Typography variant="body2" gutterBottom>
                    Salary: ₹{job.minSalary}k - ₹{job.maxSalary}k
                </Typography>

                <Box>
                    <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={handleApply}
                        sx={{ px: 4 }}
                    >
                        Apply
                    </Button>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Skills</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                        {job.skills?.map((skill, index) => (
                            <Chip key={index} label={skill} size="small" color="primary" />
                        ))}
                    </Stack>

                    {job.additionalSkills?.length > 0 && (
                        <>
                            <Typography variant="subtitle2" gutterBottom>Additional Skills</Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                                {job.additionalSkills.map((skill, index) => (
                                    <Chip key={index} label={skill} size="small" color="secondary" />
                                ))}
                            </Stack>
                        </>
                    )}
                </Box>

                <Box sx={{ mt: 2, overflowY: "auto", flex: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>Description</Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                        }}
                    >
                        {job.description}
                    </Typography>
                </Box>

                {job.locations?.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Available Locations</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {job.locations.map((loc, index) => (
                                <Chip key={index} label={loc} size="small" variant="outlined" />
                            ))}
                        </Stack>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default JobDetails;
