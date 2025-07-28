import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            textAlign="center"
            px={2}
        >
            <Typography variant="h1" color="error" gutterBottom>
                404
            </Typography>
            <Typography variant="h5" gutterBottom>
                Page Not Found
            </Typography>
            <Typography variant="body1" mb={4}>
                Sorry, the page you're looking for doesn't exist.
            </Typography>
            <Button variant="contained" component={Link} to="/" color="primary">
                Go to Home
            </Button>
        </Box>
    );
};

export default NotFoundPage;
