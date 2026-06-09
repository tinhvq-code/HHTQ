import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setSessionUser } from '../services/authSession.js';

function AuthSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            navigate('/login');
            return;
        }

        localStorage.setItem('accessToken', token);

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            const user = {
                id: payload.id,
                email: payload.email || '',
                fullName: payload.fullName || 'Facebook User',
                avatar: payload.avatar || '',
                provider: payload.provider || 'facebook'
            };

            setSessionUser(user);

            navigate('/home');
        } catch (error) {
            console.error(error);
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return <div>Đang đăng nhập...</div>;
}

export default AuthSuccessPage;