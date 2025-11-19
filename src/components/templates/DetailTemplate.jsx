import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // ví dụ bạn dùng lucide-react
import IconButton from "../atoms/IconButton";

const DetailTemplate = ({ detailSection }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8 font-sans">
            {/* Header */}
            <div className="mb-6">
                <IconButton
                    icon={ArrowLeft}
                    variant="ghost"
                    size="md"
                    onClick={() => navigate("/space/challenge")}
                    title="Quay lại"
                    className="mb-4 text-white hover:bg-white/10"
                />
            </div>

            {/* Content */}
            <div className="w-full">
                {detailSection}
            </div>
        </div>
    );
};

DetailTemplate.propTypes = {
    detailSection: PropTypes.node.isRequired,
};

export default DetailTemplate;
