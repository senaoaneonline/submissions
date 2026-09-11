
// Senaoane GitHub Pages - No Backend Demo (localStorage)
// Swap with Supabase for production - code examples in comments

const DB = {
  getUsers: () => JSON.parse(localStorage.getItem('senaoane_users') || '[]'),
  saveUser: (u) => {
    const users = DB.getUsers();
    users.push({...u, id: Date.now(), created_at: new Date().toISOString()});
    localStorage.setItem('senaoane_users', JSON.stringify(users));
    localStorage.setItem('senaoane_current_user', JSON.stringify(u));
  },
  currentUser: () => JSON.parse(localStorage.getItem('senaoane_current_user') || 'null'),
  logout: () => localStorage.removeItem('senaoane_current_user'),
  getPosts: () => JSON.parse(localStorage.getItem('senaoane_posts') || '[]'),
  savePost: (p) => {
    const posts = DB.getPosts();
    posts.unshift({...p, id: Date.now(), created_at: new Date().toISOString()});
    localStorage.setItem('senaoane_posts', JSON.stringify(posts));
  }
};

function extractYouTubeID(url){
  if(!url) return '';
  const reg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const m = url.match(reg);
  return m ? m[1] : '';
}

function requireAuth(){
  const user = DB.currentUser();
  if(!user){
    alert('Please register / login before uploading. You will be redirected to registration.');
    window.location.href = 'register.html';
    return null;
  }
  return user;
}

function renderPosts(containerId, filterCat=null){
  const container = document.getElementById(containerId);
  if(!container) return;
  let posts = DB.getPosts();
  // Merge with sample from data/posts.json (fetch)
  if(filterCat) posts = posts.filter(p=>p.category===filterCat);
  if(posts.length===0){
    container.innerHTML = '<p style="opacity:0.6">No posts yet. Be the first to post!</p>';
    return;
  }
  container.innerHTML = posts.map(p=>`
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span class="badge">${p.category||'GENERAL'}</span>
        <small style="opacity:0.6">${new Date(p.created_at).toLocaleDateString()}</small>
      </div>
      <h3>${p.title}</h3>
      <p style="opacity:0.8;margin:8px 0">${p.description||''}</p>
      ${p.youtube_id ? `<div style="aspect-ratio:16/9;margin:10px 0;border-radius:8px;overflow:hidden"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/${p.youtube_id}" frameborder="0" allowfullscreen></iframe></div><small style="opacity:0.5">Original: ${p.youtube_url}</small>` : ''}
      ${p.image_data ? `<img src="${p.image_data}" style="width:100%;border-radius:8px;margin-top:10px;max-height:400px;object-fit:cover">` : ''}
      ${p.image_url ? `<img src="${p.image_url}" style="width:100%;border-radius:8px;margin-top:10px">` : ''}
      <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
        <small>By ${p.user_name||'Anonymous'}</small>
        <a href="https://wa.me/27765269828?text=Hi, I saw post: ${encodeURIComponent(p.title)}" class="btn btn-green" style="padding:4px 8px;font-size:12px;margin-left:auto">WhatsApp 0765269828</a>
      </div>
    </div>
  `).join('');
}

// Countdown to next Friday 9am SAST
function getNextFriday9am(){
  const now = new Date();
  const day = now.getDay();
  let daysUntilFriday = (5 - day + 7) % 7;
  const sastNow = new Date(now.toLocaleString("en-US", {timeZone:"Africa/Johannesburg"}));
  if(daysUntilFriday===0 && sastNow.getHours()>=9) daysUntilFriday=7;
  if(daysUntilFriday===0 && daysUntilFriday===0) {} // today
  const target = new Date();
  target.setDate(now.getDate()+daysUntilFriday);
  const y=target.getFullYear(), m=target.getMonth(), d=target.getDate();
  return new Date(Date.UTC(y,m,d,7,0,0)); // 9am SAST = 7am UTC
}
function initCountdown(){
  const el = document.getElementById('countdown');
  const label = document.getElementById('countdown-label');
  if(!el) return;
  function tick(){
    const target = getNextFriday9am();
    if(label){
      const opts={weekday:'long', day:'numeric', month:'short', year:'numeric', timeZone:'Africa/Johannesburg'};
      label.textContent = `Launching: ${target.toLocaleDateString('en-ZA', opts)} at 9:00 AM SAST (Next Friday)`;
    }
    const diff = target - new Date();
    if(diff<=0){el.innerHTML='<h2>We Are Live! 🚀</h2>'; return;}
    const days=Math.floor(diff/86400000);
    const hrs=Math.floor((diff%86400000)/3600000);
    const mins=Math.floor((diff%3600000)/60000);
    const secs=Math.floor((diff%60000)/1000);
    el.innerHTML = `
      <div class="count-box"><span>${days}</span>Days</div>
      <div class="count-box"><span>${hrs}</span>Hours</div>
      <div class="count-box"><span>${mins}</span>Mins</div>
      <div class="count-box"><span>${secs}</span>Secs</div>
    `;
  }
  tick(); setInterval(tick,1000);
}
document.addEventListener('DOMContentLoaded', initCountdown);
