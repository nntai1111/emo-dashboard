import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // icon import ở đây
import IconButton from '../atoms/IconButton';

const CompletionTemplate = ({ completionSection }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white p-4 font-sans">
            <div className="flex justify-between items-center mb-4">
                <IconButton
                    icon={ArrowLeft}
                    variant="ghost"
                    size="md"
                    onClick={() => navigate('/space/challenge')}
                    title="Back"
                />
                <h1 className="text-2xl font-bold text-gray-800">
                    Challenge Completed
                </h1>
                <div className="w-6" />
            </div>
            {completionSection}
        </div>
    );
};

CompletionTemplate.propTypes = {
    completionSection: PropTypes.node.isRequired,
};

export default CompletionTemplate;
