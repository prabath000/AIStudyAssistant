import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This page handles the redirect from the Google OAuth callback.
// The server redirects here with user data encoded in the URL query string.
const OAuthCallback = () => {
    const navigate = useNavigate();
    const { loginWithData } = useAuth();
    const [debugInfo, setDebugInfo] = useState('');

    useEffect(() => {
        const fullUrl = window.location.href;
        const search = window.location.search;
        setDebugInfo(`URL: ${fullUrl}\nSearch: ${search}`);

        console.log('OAuthCallback - Full URL:', fullUrl);
        console.log('OAuthCallback - Search Params:', search);

        const qParams = new URLSearchParams(search);
        const hParams = new URLSearchParams(window.location.hash.substring(1)); // Remove '#' and parse

        const data = qParams.get('data') || hParams.get('data');
        const error = qParams.get('error') || hParams.get('error');

        if (error) {
            setTimeout(() => navigate(`/login?error=google_failed_${error}`), 3000);
            return;
        }

        if (!data) {
            console.warn('OAuthCallback: Data missing from both search and hash');
            setDebugInfo(prev => `${prev}\n\nERROR: No 'data' parameter found in URL search or hash.\nPlease ensure the server redirected to the correct URL with the ?data=... parameter.`);
            // Don't redirect immediately so user can see debug info
            return;
        }

        try {
            // Decode Base64 data
            const decodedData = atob(data);
            const user = JSON.parse(decodedData);
            loginWithData(user);
            navigate('/dashboard');
        } catch (e) {
            console.error('OAuth Parsing Error:', e);
            setTimeout(() => navigate('/login?error=google_failed_parse_error'), 3000);
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center max-w-2xl px-4">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium mb-4">Signing you in with Google...</p>
                {debugInfo && (
                    <div className="mt-8 p-4 bg-slate-50 rounded-lg text-left overflow-auto border border-slate-200">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Debug Info</p>
                        <pre className="text-[10px] text-slate-600 break-all whitespace-pre-wrap">{debugInfo}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OAuthCallback;
