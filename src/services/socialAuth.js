const loadScript = (src, id) =>
  new Promise((resolve, reject) => {
    const existing = document.getElementById(id);

    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Khong the tai SDK dang nhap.'));
    document.body.appendChild(script);
  });

export const signInWithGoogle = async () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error('Chua cau hinh VITE_GOOGLE_CLIENT_ID. Neu deploy Vercel, hay them bien nay trong Project Settings > Environment Variables.');
  }

  await loadScript('https://accounts.google.com/gsi/client', 'google-identity-sdk');

  return new Promise((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'profile email',
      callback: async (tokenResponse) => {
        try {
          if (!tokenResponse?.access_token) {
            reject(new Error('Google khong tra ve access token.'));
            return;
          }

          const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          });
          const profile = await response.json();

          if (!response.ok || !profile.email) {
            reject(new Error('Khong the lay email tu Google.'));
            return;
          }

          resolve({
            provider: 'google',
            providerId: profile.sub,
            fullName: profile.name || profile.email,
            email: profile.email,
            avatar: profile.picture || ''
          });
        } catch (error) {
          reject(error);
        }
      }
    });

    tokenClient.requestAccessToken();
  });
};

export const signInWithFacebook = async () => {
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID;

  if (!appId) {
    throw new Error('Chua cau hinh VITE_FACEBOOK_APP_ID. Neu deploy Vercel, hay them bien nay trong Project Settings > Environment Variables.');
  }

  await loadScript('https://connect.facebook.net/en_US/sdk.js', 'facebook-sdk');

  window.FB.init({
    appId,
    cookie: false,
    xfbml: false,
    version: 'v20.0'
  });

  return new Promise((resolve, reject) => {
    window.FB.login(
      (loginResponse) => {
        if (!loginResponse.authResponse) {
          reject(new Error('Facebook dang nhap khong thanh cong.'));
          return;
        }

        window.FB.api('/me', { fields: 'id,name,email,picture' }, (profile) => {
          if (!profile?.email) {
            reject(new Error('Facebook chua cap quyen email.'));
            return;
          }

          resolve({
            provider: 'facebook',
            providerId: profile.id,
            fullName: profile.name || profile.email,
            email: profile.email,
            avatar: profile.picture?.data?.url || ''
          });
        });
      },
      { scope: 'public_profile,email' }
    );
  });
};
