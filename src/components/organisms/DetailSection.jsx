import PropTypes from 'prop-types';
import DetailCard from '../molecules/DetailCard';

// Map challengeType to duration display
const mapChallengeTypeToDuration = (challengeType) => {
    const mapping = {
        'OneDayChallenge': '1 Day',
        'ThreeDayChallenge': '3 Days',
        'SevenDayChallenge': '7 Days',
    };
    return mapping[challengeType] || '1 Day';
};

const DetailSection = ({ challenge }) => {
    // Group tasks by dayNumber
    const tasksByDay = {};
    (challenge.steps || []).forEach((step) => {
        const dayNumber = step.dayNumber || 1;
        if (!tasksByDay[dayNumber]) {
            tasksByDay[dayNumber] = [];
        }
        const activityName = step.activity?.name || 'Activity';
        tasksByDay[dayNumber].push(activityName);
    });

    // Convert to array format for DetailCard
    const tasks = Object.keys(tasksByDay)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((dayNumber) => ({
            day: parseInt(dayNumber),
            activities: tasksByDay[dayNumber],
        }));

    // Get duration from challengeType
    const duration = mapChallengeTypeToDuration(challenge.challengeType);

    return (
        <DetailCard
            title={challenge.title}
            description={challenge.description}
            duration={duration}
            tasks={tasks}
            id={challenge.id}
            mediaUrl={challenge.mediaUrl}
        />
    );
};

DetailSection.propTypes = {
    challenge: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
    }).isRequired,
};

export default DetailSection;