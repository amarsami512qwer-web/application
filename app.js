/* ============================================
   BLOCKCRAFT STUDIO — app.js
   Users + lesson progress: localStorage (per-device).
   Community posts: Firebase Realtime Database (shared —
   everyone who visits the site sees the same posts, live).
   ============================================ */


const firebaseConfig = {
  apiKey: "AIzaSyAk5KUEWvbTHS0wvpURqxFkBZEK0-gNwJ8",
  authDomain: "t9-os-3b3ba.firebaseapp.com",
  databaseURL: "https://t9-os-3b3ba-default-rtdb.firebaseio.com",
  projectId: "t9-os-3b3ba",
  storageBucket: "t9-os-3b3ba.firebasestorage.app",
  messagingSenderId: "263567071189",
  appId: "1:263567071189:web:9c0007563982992e2a8f5c",
  measurementId: "G-JLQR3X28BW"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const postsRef = db.ref("posts");

const BC = {
  STAGES: [
    { name: "Block Basics", desc: "Learn the 3D viewport, moving the camera, and placing your first cube." },
    { name: "Shapes & Modeling", desc: "Combine simple shapes into characters, props, and tiny builds." },
    { name: "Texturing & Color", desc: "Paint your models and learn how materials make things feel real." },
    { name: "Lighting & Scenes", desc: "Light a scene like a game level — mood, shadows, and atmosphere." },
    { name: "Animation", desc: "Make things move: walk cycles, spinning items, simple rigs." },
    { name: "First Full Build", desc: "Finish one complete scene or character, start to end, and publish it." },
  ],

  colors: ["#2F8F5B","#5FB4E0","#F2994A","#8B5A2B","#9B59B6","#E0644C","#3A8FBE"],

  colorFor(name){
    let h = 0;
    for(const c of name) h = (h*31 + c.charCodeAt(0)) % this.colors.length;
    return this.colors[h];
  },

  initials(name){
    return name.trim().split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase();
  },

  users(){ return JSON.parse(localStorage.getItem("bc_users") || "[]"); },
  saveUsers(u){ localStorage.setItem("bc_users", JSON.stringify(u)); },

  progress(){ return JSON.parse(localStorage.getItem("bc_progress") || "{}"); },
  saveProgress(p){ localStorage.setItem("bc_progress", JSON.stringify(p)); },

  currentUser(){
    const uname = localStorage.getItem("bc_session");
    if(!uname) return null;
    return this.users().find(u=>u.username===uname) || null;
  },

  logout(){ localStorage.removeItem("bc_session"); location.href="community.html"; },

  register(username, displayName, password){
    const users = this.users();
    if(users.some(u=>u.username.toLowerCase()===username.toLowerCase())){
      return { ok:false, error:"That username is already taken — try another one." };
    }
    if(username.length < 3 || password.length < 4){
      return { ok:false, error:"Username needs 3+ letters and password needs 4+ characters." };
    }
    users.push({ username, displayName: displayName || username, password, joined: new Date().toISOString(), isAdmin: users.length===0 });
    this.saveUsers(users);
    localStorage.setItem("bc_session", username);
    return { ok:true };
  },

  login(username, password){
    const users = this.users();
    const u = users.find(u=>u.username.toLowerCase()===username.toLowerCase() && u.password===password);
    if(!u) return { ok:false, error:"That username and password don't match. Try again." };
    localStorage.setItem("bc_session", u.username);
    return { ok:true };
  },


  _postsCache: [],
  _postsListeners: [],

  onPostsChange(cb){
    this._postsListeners.push(cb);
    cb(this._postsCache);
  },

  posts(){

    return this._postsCache;
  },

  _startPostsSync(){
    postsRef.orderByChild("date").on("value", snapshot => {
      const val = snapshot.val() || {};
      const list = Object.keys(val).map(key => ({ id: key, ...val[key] }));
      list.sort((a,b) => new Date(b.date) - new Date(a.date)); // newest first
      this._postsCache = list;
      this._postsListeners.forEach(cb => cb(list));
    });
  },

  addPost(text, yt){
    const user = this.currentUser();
    if(!user) return { ok:false, error:"Log in to share a post." };
    if(!text || !text.trim()) return { ok:false, error:"Write something before posting." };

    postsRef.push({
      username: user.username,
      displayName: user.displayName,
      text: text.trim(),
      yt: yt || "",
      date: new Date().toISOString(),
    });
    return { ok:true };
  },

  deletePost(id){
    postsRef.child(id).remove();
  },

  setStage(username, stageIndex){
    const p = this.progress();
    p[username] = stageIndex;
    this.saveProgress(p);
  },

  ytEmbed(url){
    if(!url) return "";
    let id = "";
    const m1 = url.match(/(?:youtu\.be\/|v=)([A-Za-z0-9_-]{6,})/);
    if(m1) id = m1[1];
    if(!id) return "";
    return `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${id}" title="YouTube video" allowfullscreen></iframe></div>`;
  },

  timeAgo(iso){
    const diff = (Date.now() - new Date(iso).getTime())/1000;
    if(diff < 60) return "just now";
    if(diff < 3600) return Math.floor(diff/60)+"m ago";
    if(diff < 86400) return Math.floor(diff/3600)+"h ago";
    return Math.floor(diff/86400)+"d ago";
  },

  mountHeader(){
    const authEl = document.getElementById("nav-auth");
    if(!authEl) return;
    const user = this.currentUser();
    if(user){
      authEl.innerHTML = `<a href="profile.html">👤 ${user.displayName}</a> <a href="#" id="logout-link" style="background:#e0644c;">Log out</a>`;
      const lo = document.getElementById("logout-link");
      if(lo) lo.addEventListener("click", e=>{ e.preventDefault(); this.logout(); });
    } else {
      authEl.innerHTML = `<a href="community.html">Log in / Join</a>`;
    }
    const here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(a=>{
      if(a.getAttribute("href") === here) a.classList.add("active");
    });
  },
};

BC._startPostsSync();
document.addEventListener("DOMContentLoaded", ()=> BC.mountHeader());
