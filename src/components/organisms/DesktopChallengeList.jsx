import PropTypes from 'prop-types';
import ChallengeCard from '../molecules/ChallengeCard';

const DesktopChallengeList = ({ challenges }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-2">
                Tất cả thử thách
            </h2>
            {challenges.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
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
                <p className="text-slate-400">
                    Không tìm thấy thử thách. Hãy thử điều chỉnh bộ lọc!
                </p>
            )}
        </div>
    );
};

DesktopChallengeList.propTypes = {
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

export default DesktopChallengeList;

