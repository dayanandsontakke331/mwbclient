import React, { useRef, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    IconButton,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const UploadResume = () => {
    const fileInputRef = useRef(null);
    const [isFileSelected, setIsFileSelected] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { user } = useAuth()

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowedTypes.includes(file.type)) {
            alert('Only PDF, DOC, or DOCX files are allowed.');
            return;
        }

        setIsFileSelected(file);
    };

    const handleRemoveFile = () => {
        setIsFileSelected(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = async () => {
        if (!isFileSelected) return;

        const formData = new FormData();
        formData.append('id', user._id);
        formData.append('file', isFileSelected);

        try {
            setUploading(true);

            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/uploadResume`, formData);

            if (res.data?.success) {
                alert(res.data.message || "Resume uploaded!");
                setIsFileSelected(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            } else {
                alert(res.data?.message || "Upload failed.");
            }

        } catch (err) {
            alert(err?.response?.data?.message || err.message || "Upload error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography fontWeight={600} fontSize={18} mb={2}>
                Upload Resume
            </Typography>

            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    textAlign: 'center',
                    borderStyle: 'dashed',
                    cursor: 'pointer',
                }}
                onClick={() => fileInputRef.current?.click()}
            >
                <Stack alignItems="center" spacing={1}>
                    <UploadFileIcon fontSize="large" color="primary" />
                    <Typography variant="body1">
                        Click or drag and drop to upload your resume
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Supported formats: PDF, DOC, DOCX
                    </Typography>
                </Stack>
                <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                />
            </Paper>

            {isFileSelected && (
                <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2">{isFileSelected.name}</Typography>
                    <IconButton color="error" onClick={handleRemoveFile}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )}

            {isFileSelected && (
                <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </Button>
            )}
        </Box>
    );
};

export default UploadResume;
