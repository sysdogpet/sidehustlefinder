// --- Login / Logout buttons ---
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

if (loginBtn) loginBtn.addEventListener('click', () => auth.signInWithPopup(provider));
if (logoutBtn) logoutBtn.addEventListener('click', () => auth.signOut());

// --- Toggle UI based on auth state ---
auth.onAuthStateChanged(user => {
  if (loginBtn && logoutBtn) {
    if (user) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';

      // show post form if it exists
      const postContainer = document.getElementById('postFormContainer');
      if (postContainer) postContainer.style.display = 'block';
    } else {
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';

      const postContainer = document.getElementById('postFormContainer');
      if (postContainer) postContainer.style.display = 'none';
    }
  }
});
