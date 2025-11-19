import PropTypes from 'prop-types';
import Icon from '../atoms/Icon';

const MobileChallengeHubTemplate = ({
    filterChips,
    filterSection,
    carouselSection,
    challengeList,
}) => {
    return (
        <div className="min-h-screen p-4 font-sans pb-20 bg-black text-white">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Challenges</h1>
                <button className="min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <Icon name="Bell" color="text-sky-400" className="cursor-pointer" size={24} />
                </button>
            </div>
            {filterChips}
            {filterSection}
            <div className="mb-6">
                {carouselSection}
            </div>
            {challengeList}
        </div>
    );
};

MobileChallengeHubTemplate.propTypes = {
    filterChips: PropTypes.node.isRequired,
    filterSection: PropTypes.node.isRequired,
    carouselSection: PropTypes.node.isRequired,
    challengeList: PropTypes.node.isRequired,
};

export default MobileChallengeHubTemplate;

