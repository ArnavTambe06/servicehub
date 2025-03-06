import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { Widgets, MonetizationOn, Delete } from '@mui/icons-material';

const ServiceCard2 = ({ passedService, passedIndex, onDeleteItem, showDelete }) => {
    return (
        <Card
            elevation={2}
            sx={{
                mb: 2,
                '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                }
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {passedService.serviceTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {passedService.serviceDescription}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Widgets sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="body2">
                                {passedService.serviceCategory}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MonetizationOn sx={{ mr: 1, color: 'success.main' }} />
                            <Typography variant="body2">
                                Rs. {passedService.servicePrice}
                            </Typography>
                        </Box>
                    </Box>
                    {showDelete && (
                        <IconButton
                            color="error"
                            onClick={() => onDeleteItem(passedService.serviceId)}
                        >
                            <Delete />
                        </IconButton>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ServiceCard2;
