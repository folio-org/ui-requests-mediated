import PropTypes from 'prop-types';

const AddressDetails = ({ address = {} }) => {
  const NO_VALUE = '';
  const getValue = (fieldName) => address[fieldName] || NO_VALUE;

  return (
    <div>
      <div>{getValue('addressLine1')}</div>
      <div>{getValue('addressLine2')}</div>
      <div>{getValue('city')}</div>
      <div>{getValue('region')}</div>
      <div>{getValue('postalCode')}</div>
    </div>
  );
};

AddressDetails.propTypes = {
  address: PropTypes.shape({
    addressLine1: PropTypes.string,
    addressLine2: PropTypes.string,
    city: PropTypes.string,
    region: PropTypes.string,
    postalCode: PropTypes.string,
  }).isRequired,
};

export default AddressDetails;
