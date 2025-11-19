import PropTypes from 'prop-types';
import ChallengeCard from '../molecules/ChallengeCard';

const MobileChallengeList = ({ challenges }) => {
    return (
        <div className="space-y-3 px-2">
            <h2 className="text-base font-semibold text-white mb-2">
                Tất cả thử thách
            </h2>
            {challenges.length > 0 ? (
                <div className="space-y-3">
                    {challenges.map(challenge => (
                        <ChallengeCard
                            key={challenge.id}
                            id={challenge.id}
                            title={challenge.title}
                            description={challenge.description}
                            category={challenge.category}
                            duration={challenge.duration}
                            image={challenge.image}
                            hasAccess={challenge.hasAccess}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-slate-400 text-sm text-center py-6">
                    Không tìm thấy thử thách. Hãy thử điều chỉnh bộ lọc!
                </p>
            )}
        </div>
    );
};

MobileChallengeList.propTypes = {
    challenges: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            category: PropTypes.string.isRequired,
            duration: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default MobileChallengeList;

