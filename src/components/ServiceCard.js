import React from 'react';
import { AccountCircle, MonetizationOn, AddShoppingCart } from '@mui/icons-material';

const ServiceCard = ({ passedService, passedIndex, onAddToCart }) => { // Removed showButton from props
  const displayIndex = passedIndex + 1;

  return (
    <div className='flex-row stretch-justify'>
      <div className='service-card'>
        <div className="flex-row left-justify">
          {/* Service image, title and details */}
          <div className='flex-col'>
            <div className="flex-row left-justify">
              <p className='circle index-circle'>{displayIndex}</p>
              <p className='para-type2'>{passedService.serviceTitle}</p>
              <div className='flex-row left-justify'>
                <AccountCircle />
                <p>By:</p>
                <p className='para-type1'>{passedService.serviceProvider}</p>
              </div>
            </div>
            <div className="flex-row left-justify">
              <p className='grey-container service-description'>{passedService.serviceDescription}</p>
            </div>
            <div className="flex-row left-justify">
              <p className='para-type3 icon-para'>
                <MonetizationOn /> Price: Rs. {passedService.servicePrice}
              </p>
              <button
                className='button-type1'
                style={{ display: 'inline-block', zIndex: 1, backgroundColor: '#fff', color: '#1fb3ee', border: '1px solid #1fb3ee', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                onClick={() => onAddToCart(passedService.serviceCategory, passedIndex)}
              >
                <AddShoppingCart style={{ marginRight: '5px' }} /> Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
