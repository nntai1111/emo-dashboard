import CompletionSummary from '../molecules/CompletionSummary';

const CompletionSection = () => {
    return (
        <CompletionSummary
            streak={7}
            xp={100}
            badge="Challenge Master"
        />
    );
};

export default CompletionSection;