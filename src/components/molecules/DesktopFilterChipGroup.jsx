import PropTypes from 'prop-types';
import Chip from '../atoms/Chip';

const DesktopFilterChipGroup = ({ durationFilter, categoryFilter, toggleFilter }) => {
    const durations = ['1 Day', '3 Days', '7 Days'];
    const categories = ['Mental Health', 'PhysicalBalance', 'SocialConnection', 'Creative Relaxation', 'Combined'];

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {/* Duration filters with All option */}
            <Chip
                key="duration-all"
                label="All"
                isSelected={durationFilter === null}
                onClick={() => toggleFilter('duration', 'All')}
                type="duration"
            />
            {durations.map(duration => (
                <Chip
                    key={duration}
                    label={duration}
                    isSelected={durationFilter === duration}
                    onClick={() => toggleFilter('duration', duration)}
                    type="duration"
                />
            ))}

            {/* Category filters with All option */}
            <Chip
                key="category-all"
                label="All"
                isSelected={categoryFilter === null}
                onClick={() => toggleFilter('category', 'All')}
                type="category"
            />
            {categories.map(category => (
                <Chip
                    key={category}
                    label={category}
                    isSelected={categoryFilter === category}
                    onClick={() => toggleFilter('category', category)}
                    type="category"
                />
            ))}
        </div>
    );
};

DesktopFilterChipGroup.propTypes = {
    durationFilter: PropTypes.string, // Changed from array to single value (null means "All")
    categoryFilter: PropTypes.string, // Changed from array to single value (null means "All")
    toggleFilter: PropTypes.func.isRequired,
};

export default DesktopFilterChipGroup;

