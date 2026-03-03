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
        const hash = window.location.hash;
        setDebugInfo(`URL: ${fullUrl}\nSearch: ${search}\nHash: ${hash}`);

        console.log('OAuthCallback - Full URL:', fullUrl);
        console.log('OAuthCallback - Search Params:', search);

        const qParams = new URLSearchParams(search);
        const hParams = new URLSearchParams(hash.substring(1));

        const data = qParams.get('data') || hParams.get('data');
        const error = qParams.get('error') || hParams.get('error');

        if (error) {
            console.error('OAuth Error param detected:', error);
            setDebugInfo(prev => `${prev}\n\nERROR: Server returned error: ${error}`);
            setTimeout(() => navigate(`/login?error=google_failed_${error}`), 3000);
            return;
        }

        if (!data) {
            console.warn('OAuthCallback: Data missing from both search and hash');
            setDebugInfo(prev => `${prev}\n\nERROR: No 'data' parameter found. Please check server logs.`);
            return;
        }

        try {
            console.log('OAuthCallback: Decoding data...');
            const decodedData = atob(data);
            const user = JSON.parse(decodedData);

            console.log('OAuthCallback: User data parsed successfully', user);
            // Save directly to localStorage - more reliable than going through React state for a redirect
            localStorage.setItem('user', JSON.stringify(user));
            loginWithData(user);

            // Use hard redirect to ensure the page fully reloads with new auth state
            console.log('OAuthCallback: Redirecting to dashboard...');
            window.location.href = '/dashboard';
        } catch (e) {
            console.error('OAuth Parsing Error:', e);
            setDebugInfo(prev => `${prev}\n\nPARSING ERROR: ${e.message}`);
            setTimeout(() => navigate('/login?error=google_failed_parse_error'), 5000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center max-w-2xl px-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium mb-4">Signing you in with Google...</p>
                <button
                    onClick={() => {
                        window.location.href = '/dashboard';
                    }}
                    className="text-xs text-blue-600 hover:underline font-bold mt-2 block mx-auto"
                >
                    Stuck? Click here to go to Dashboard
                </button>
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
