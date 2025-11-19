import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CheckInSection from '../components/organisms/CheckInSection';
import CheckInTemplate from '../components/templates/CheckInTemplate';
import challengesData from '../data/challenges.json';

const DailyCheckInPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);

    useEffect(() => {
        const foundChallenge = challengesData.find(ch => ch.id === parseInt(id));
        setChallenge(foundChallenge);
    }, [id]);

    const handleCheckIn = (note) => {
        console.log(`Checked in for challenge ${id} with note: ${note}`);
        navigate(`/completion/${id}`);
    };

    if (!challenge) return <p>Loading...</p>;

    return (
        <CheckInTemplate
            checkInSection={<CheckInSection task={`Complete today's task for ${challenge.title}`} onCheckIn={handleCheckIn} />}
        />
    );
};

export default DailyCheckInPage;