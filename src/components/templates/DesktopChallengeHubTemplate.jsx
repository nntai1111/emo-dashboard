import PropTypes from 'prop-types';
import Icon from '../atoms/Icon';

const DesktopChallengeHubTemplate = ({
    filterChips,
    filterSection,
    carouselSection,
    challengeList,
}) => {
    return (
        <div className="min-h-screen p-6 font-sans max-w-7xl mx-auto bg-black text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Challenges</h1>
                <Icon name="Bell" color="text-sky-400" className="cursor-pointer" size={24} />
            </div>
            {filterChips}
            {filterSection}
            <div className="mb-8">
                {carouselSection}
            </div>
            {challengeList}
        </div>
    );
};

DesktopChallengeHubTemplate.propTypes = {
    filterChips: PropTypes.node.isRequired,
    filterSection: PropTypes.node.isRequired,
    carouselSection: PropTypes.node.isRequired,
    challengeList: PropTypes.node.isRequired,
};

export default DesktopChallengeHubTemplate;

