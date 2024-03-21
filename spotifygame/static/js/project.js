const clientId = 'f888d92f5b7a4e99b279edaa65d4abe4'; 
// this is my Spotify dev client id
// not sure if it works yet for other spotify users
const redirectUri = 'http://127.0.0.1:8000/'; // needs to be changed once on website

document.addEventListener('DOMContentLoaded', async function () {

    document.getElementById('spotify-login').addEventListener('click', function() {    
        refreshSpotify();  
    });

    function refreshSpotify() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('authCode');
        localStorage.removeItem('code_verifier');
        window.location.href = redirectUri;
    }

    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code')
    if (code) {
        localStorage.setItem('authCode', code);
    } else {
        code = localStorage.getItem('authCode');
    }



    let token = localStorage.getItem('access_token')
   

    if (!token && code) {

        // if code in url but not token, generate the token with the code 

        const getToken = async code => {

            // stored in the previous step
            let codeVerifier = localStorage.getItem('code_verifier');

            const payload = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: clientId,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: redirectUri,
                    code_verifier: codeVerifier,
                }),
            }



            const body = await fetch('https://accounts.spotify.com/api/token', payload);
            const response = await body.json();
            console.log('parsed response from getToken', response)
            localStorage.setItem('access_token', response.access_token);
        }

        getToken(code);


    } else if (!token && !code) {

        // if neither token or code in localStorage, go through the whole process 



        const generateRandomString = (length) => {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const values = crypto.getRandomValues(new Uint8Array(length));
            return values.reduce((acc, x) => acc + possible[x % possible.length], "");
        }

        const codeVerifier = generateRandomString(64);


        const sha256 = async (plain) => {
            const encoder = new TextEncoder()
            const data = encoder.encode(plain)
            return window.crypto.subtle.digest('SHA-256', data)
        }


        const base64encode = (input) => {
            return btoa(String.fromCharCode(...new Uint8Array(input)))
                .replace(/=/g, '')
                .replace(/\+/g, '-')
                .replace(/\//g, '_');
        }


        const hashed = await sha256(codeVerifier)
        const codeChallenge = base64encode(hashed);



        const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing streaming';
        const authUrl = new URL("https://accounts.spotify.com/authorize")

        // generated in the previous step
        window.localStorage.setItem('code_verifier', codeVerifier);

        const params = {
            response_type: 'code',
            client_id: clientId,
            scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
        }

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    }
});