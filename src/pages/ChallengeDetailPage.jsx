import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DetailSection from '../components/organisms/DetailSection';
import DetailTemplate from '../components/templates/DetailTemplate';
import { getChallenges } from '../services/challengeService';

const ChallengeDetailPage = () => {
    const { id } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChallenge = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch all challenges and find the one with matching ID
                // Note: In a real scenario, you might want a GET /v1/challenges/{id} endpoint
                const response = await getChallenges(
                    null, // challengeType - get all
                    null, // improvementTag - get all
                    1,
                    100, // Get more to find the challenge
                    'vi'
                );

                const challenges = response.data || [];
                const foundChallenge = challenges.find(ch => ch.id === id);

                if (!foundChallenge) {
                    throw new Error('Challenge not found');
                }

                setChallenge(foundChallenge);
            } catch (err) {
                console.error('Error fetching challenge:', err);
                setError(err.message || 'Failed to load challenge');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchChallenge();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang tải thử thách...</p>
                </div>
            </div>
        );
    }

    if (error || !challenge) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">
                        {error || 'Không tìm thấy thử thách'}
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <DetailTemplate
            detailSection={<DetailSection challenge={challenge} />}
        />
    );
};

export default ChallengeDetailPage;