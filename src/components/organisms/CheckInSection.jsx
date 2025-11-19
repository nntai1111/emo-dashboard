import PropTypes from 'prop-types';
import CheckInForm from '../molecules/CheckInForm';

const CheckInSection = ({ task, onCheckIn }) => {
    return <CheckInForm task={task} onSubmit={onCheckIn} />;
};

CheckInSection.propTypes = {
    task: PropTypes.string.isRequired,
    onCheckIn: PropTypes.func.isRequired,
};

export default CheckInSection;