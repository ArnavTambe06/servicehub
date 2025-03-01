import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import cleaningImg from '../assets/images/cleaning.jpg';
import electricianImg from '../assets/images/electrician.jpeg';
import plumberImg from '../assets/images/plumber.jpeg';
import carpenterImg from '../assets/images/carpenter.jpeg';
import pestcontImg from '../assets/images/pest_cont.jpg';
import womensalonImg from '../assets/images/women_salon.jpg';
import mensalonImg from '../assets/images/men_salon.jpg';
import massageImg from '../assets/images/massage.jpg';

const categories = [
    { title: 'Cleaning' },
    { title: 'Electricians' },
    { title: 'Plumbers' },
    { title: 'Carpenters' },
    { title: 'Pest Control' },
    { title: 'Salon for Women' },
    { title: 'Salon for Men' },
    { title: 'Massage' }
];

const categoryImages = {
    'Cleaning': cleaningImg,
    'Electricians': electricianImg,
    'Plumbers': plumberImg,
    'Carpenters': carpenterImg,
    'Pest Control': pestcontImg,
    'Salon for Women': womensalonImg,
    'Salon for Men': mensalonImg,
    'Massage': massageImg,
};

const Categories = () => {
    return (
        <div className='category-main'>
            <div className='ninetyfiveperc-container'>
                <h2 className='heading-type3'>Categories:</h2>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '10px',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    {categories.map((cat) => (
                        <Link
                            key={cat.title}
                            to={`/services/${encodeURIComponent(cat.title)}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                variant="outlined"
                                sx={{
                                    m: 0.5,
                                    p: 0,
                                    width: '300px',  // Smaller fixed width
                                    height: '300px', // Smaller fixed height
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderRadius: '8px',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        transition: 'transform 0.2s'
                                    }
                                }}
                            >
                                <img
                                    src={categoryImages[cat.title]}
                                    alt={cat.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <span
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                        color: '#fff',
                                        textAlign: 'center',
                                        padding: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {cat.title}
                                </span>
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;
