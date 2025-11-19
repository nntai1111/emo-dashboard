import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../atoms/Button';

const CheckInForm = ({ task, onSubmit }) => {
    const [note, setNote] = useState('');

    const handleSubmit = () => {
        onSubmit(note);
        setNote('');
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Today's Task</h2>
            <p className="text-gray-600 mb-4">{task}</p>
            <textarea
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter your notes..."
            />
            <Button variant="primary" className="w-full" onClick={handleSubmit}>
                Mark as Done
            </Button>
        </div>
    );
};

CheckInForm.propTypes = {
    task: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default CheckInForm;