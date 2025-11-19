import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // icon mũi tên trái
import IconButton from "../atoms/IconButton";

const CheckInTemplate = ({ checkInSection }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white p-4 font-sans">
            <div className="flex justify-between items-center mb-4">
                <IconButton
                    icon={ArrowLeft}
                    variant="ghost"
                    size="md"
                    onClick={() => navigate("/space/challenge")}
                    title="Back"
                />
                <h1 className="text-2xl font-bold text-gray-800">Daily Check-In</h1>
                <div className="w-6" />
            </div>
            {checkInSection}
        </div>
    );
};

CheckInTemplate.propTypes = {
    checkInSection: PropTypes.node.isRequired,
};

export default CheckInTemplate;
