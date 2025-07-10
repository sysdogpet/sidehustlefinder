const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

// Firebase auth
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Sign in with popup
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    auth.signInWithPopup(provider).catch(err => {
      console.error('Login failed:', err);
    });
  });
}

// Sign out
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    auth.signOut();
  });
}

// Toggle UI on login state change
auth.onAuthStateChanged(user => {
  if (loginBtn && logoutBtn) {
    if (user) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
    } else {
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
    }
  }

  // Optional: personalize greeting or unlock features
  console.log("User status:", user ? `Signed in as ${user.displayName}` : "Signed out");
});
