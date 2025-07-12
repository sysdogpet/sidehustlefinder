/******** helpers ********/
const db        = firebase.firestore();
const authState = () => firebase.auth().currentUser;

/******** elements ********/
const postBtn   = document.getElementById('postBtn');
const postText  = document.getElementById('postText');
const feedDiv   = document.getElementById('feed');
const newCard   = document.getElementById('newPostCard');

/******** auth-gated form visibility ********/
firebase.auth().onAuthStateChanged(u => {
  newCard.style.display = u ? 'block' : 'none';
});

/******** create a post ********/
postBtn?.addEventListener('click', async () => {
  const text = postText.value.trim();
  const user = authState();
  if (!text || !user) return;

  await db.collection('posts').add({
    uid: user.uid,
    name: user.displayName || 'Anon',
    text,
    likes: 0,
    created: firebase.firestore.FieldValue.serverTimestamp()
  });
  postText.value = '';
});

/******** render feed real-time ********/
db.collection('posts').orderBy('created', 'desc').onSnapshot(snap => {
  feedDiv.innerHTML = '';
  snap.forEach(doc => renderPost(doc));
});

/******** render single post ********/
function renderPost(doc) {
  const d   = doc.data();
  const div = document.createElement('div');
  div.className = 'post-card';
  div.innerHTML = `
    <p>${d.text}</p>
    <small>— ${d.name}</small>
    <div class="post-actions">
      <button class="likeBtn">❤️ ${d.likes}</button>
      <button class="replyToggle">💬 Reply</button>
    </div>
    <div class="replies" style="display:none;">
      <div class="reply-list"></div>
      <textarea class="replyBox" rows="2" placeholder="Write a reply…"></textarea>
      <button class="sendReply btn green sm">Send</button>
    </div>
  `;
  feedDiv.appendChild(div);

  /* like handler */
  const likeBtn = div.querySelector('.likeBtn');
  likeBtn.addEventListener('click', () => handleLike(doc.id, likeBtn));

  /* toggle & send reply */
  const toggle   = div.querySelector('.replyToggle');
  const replies  = div.querySelector('.replies');
  const sendBtn  = div.querySelector('.sendReply');
  const replyBox = div.querySelector('.replyBox');
  const listDiv  = div.querySelector('.reply-list');

  toggle.onclick = () => replies.style.display = replies.style.display === 'none' ? 'block' : 'none';
  sendBtn.onclick = () => {
    const txt = replyBox.value.trim();
    const user = authState();
    if (!txt || !user) return;
    db.collection('posts').doc(doc.id).collection('replies').add({
      uid: user.uid, name:user.displayName||'Anon', text:txt,
      create
