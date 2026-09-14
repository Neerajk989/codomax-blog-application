const starterPosts=[
{title:"Getting Started with Web Development",category:"Web Development",content:"HTML gives structure, CSS controls presentation and JavaScript adds interaction.",date:"Day 1"},
{title:"Why Responsive Design Matters",category:"Technology",content:"Responsive design helps websites adapt smoothly to phones, tablets and desktops.",date:"Day 2"},
{title:"My Codomax Internship Journey",category:"Learning",content:"This project is part of my frontend development internship task at Codomax.",date:"Day 4"}
];

function getPosts(){
  const saved=JSON.parse(localStorage.getItem("codomaxPosts")||"[]");
  return [...saved,...starterPosts];
}

function safe(value){
  return String(value).replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;","'":"&#39;"}[c]));
}

function renderPosts(id){
  const target=document.getElementById(id);
  if(!target)return;
  target.innerHTML=getPosts().map(post=>`<article class="blog-card"><span class="category">${safe(post.category)}</span><h3>${safe(post.title)}</h3><p>${safe(post.content).slice(0,180)}</p><small>${safe(post.date||"Published")}</small></article>`).join("");
}

document.getElementById("registerForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const user={
    name:document.getElementById("registerName").value.trim(),
    email:document.getElementById("registerEmail").value.trim(),
    password:document.getElementById("registerPassword").value
  };
  localStorage.setItem("codomaxUser",JSON.stringify(user));
  document.getElementById("registerMessage").textContent="Registration successful! Redirecting...";
  setTimeout(()=>location.href="login.html",700);
});

document.getElementById("loginForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const user=JSON.parse(localStorage.getItem("codomaxUser")||"null");
  const email=document.getElementById("loginEmail").value.trim();
  const password=document.getElementById("loginPassword").value;
  const msg=document.getElementById("loginMessage");
  if(user&&user.email===email&&user.password===password){
    localStorage.setItem("codomaxLoggedIn","true");
    msg.textContent="Login successful!";
    setTimeout(()=>location.href="dashboard.html",600);
  }else{
    msg.textContent="Invalid credentials. Please register first.";
  }
});

document.getElementById("blogForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const posts=JSON.parse(localStorage.getItem("codomaxPosts")||"[]");
  posts.unshift({
    title:document.getElementById("blogTitle").value.trim(),
    category:document.getElementById("blogCategory").value,
    content:document.getElementById("blogContent").value.trim(),
    date:new Date().toLocaleDateString()
  });
  localStorage.setItem("codomaxPosts",JSON.stringify(posts));
  document.getElementById("blogMessage").textContent="Blog published successfully!";
  setTimeout(()=>location.href="dashboard.html",700);
});

const user=JSON.parse(localStorage.getItem("codomaxUser")||"null");
const welcome=document.getElementById("welcomeText");
if(welcome&&user)welcome.textContent=`Welcome, ${user.name}. Manage your posts and keep writing.`;

const total=document.getElementById("totalPosts");
const published=document.getElementById("publishedPosts");
if(total)total.textContent=getPosts().length;
if(published)published.textContent=getPosts().length;

renderPosts("blogGrid");
renderPosts("dashboardPosts");