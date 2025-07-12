/********* Location helpers *********/
let userLocation = { city: null, region: null };

function getLocation() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(async pos => {
    try {
      const { latitude, longitude } = pos.coords;
      // quick & free reverse geo via Nominatim
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await res.json();
      userLocation.city = data.address.city || data.address.town || data.address.village;
      userLocation.region = data.address.state || data.address.county;
    } catch (err) { console.warn('Geo lookup failed', err); }
  });
}
getLocation();

/********* Hustle logic *********/
const form       = document.getElementById('hustleForm');
const resultsDiv = document.getElementById('results');
const refineBtn  = document.getElementById('refineBtn');

const baseIdeas = {
  tech: [
    "💻 Fix devices for classmates",
    "🕹️ Sell game mods",
    "⌨️ Build custom keyboards"
  ],
  creative: [
    "🎨 Design thumbnails",
    "📓 Sell digital planners",
    "👟 Paint custom sneakers"
  ],
  social: [
    "📱 Run a local biz's TikTok",
    "🎬 Edit short-form videos",
    "🗂️ Sell Notion templates"
  ],
  hands: [
    "🚗 Car detailing",
    "🐾 Pet sitting",
    "🛍️ Flip thrifted finds"
  ]
};

function addCityFlavor(ideas) {
  // simple demo: prepend “in <city>”
  if (!userLocation.city) return ideas;
  return ideas.map(i => `${i} in ${userLocation.city}`);
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const interest = document.getElementById('interest').value;
  const ideas = addCityFlavor(baseIdeas[interest]);

  resultsDiv.innerHTML = '<h3>Try these hustles:</h3>';
  ideas.forEach(i => {
    const div = document.createElement('div');
    div.className = 'hustle';
    div.textContent = i;
    resultsDiv.appendChild(div);
  });
  resultsDiv.style.display = 'block';
  refineBtn.style.display   = 'inline-block';
});

/********* AI refine (stub) *********/
refineBtn.addEventListener('click', async () => {
  refineBtn.textContent = '🤖 Thinking...';
  refineBtn.disabled = true;

  // send ideas + quiz answers + location to your serverless endpoint
  const payload = {
    age: document.getElementById('age').value,
    time: document.getElementById('time').value,
    interest: document.getElementById('interest').value,
    city: userLocation.city,
    region: userLocation.region
  };

  /*  Replace URL with your Cloud Function / OpenAI endpoint  */
  const res = await fetch('/api/refine-hustles', {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();   // expected:  { ideas: [ ... ] }

  // update UI
  resultsDiv.innerHTML = '<h3>New curated ideas:</h3>';
  data.ideas.forEach(i => {
    const div = document.createElement('div');
    div.className = 'hustle';
    div.textContent = i;
    resultsDiv.appendChild(div);
  });

  refineBtn.textContent = 'Ask AI again';
  refineBtn.disabled = false;
});
// /api/refine-hustles.js
export default function handler(req, res) {
  // basic dummy response – replace with OpenAI later
  const { interest, city } = req.body;

  const altIdeas = {
    tech: ["🔧 Repair VR headsets", "💾 Build PCs for neighbors"],
    creative: ["🖌️ Custom mural paints", "🎞️ TikTok intro animations"],
    social: ["📷 Local Insta shoots", "📈 Grow Shopify SEO"],
    hands: ["🪴 Plant-care service", "🚴‍♂️ Bike tune-ups"]
  };

  res.status(200).json({ ideas: altIdeas[interest] || [] });
}
