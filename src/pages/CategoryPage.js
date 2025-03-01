import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
    const { category } = useParams();

    return (
        <div style={{ padding: '2rem' }}>
            <h2>{category} Services</h2>
            <p>Here you can display all services for the "{category}" category.</p>
            {/* You can fetch and render category-specific services here */}
        </div>
    );
};

export default CategoryPage;
