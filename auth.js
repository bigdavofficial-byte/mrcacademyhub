// auth.js - ONE LOGIN FOR WHOLE WEBSITE
function getUsers(){return JSON.parse(localStorage.getItem('mrc_users_db')||'{}')}
function saveUsers(u){localStorage.setItem('mrc_users_db',JSON.stringify(u))}
function getCurrentUser(){return JSON.parse(localStorage.getItem('mrc_current_user')||'null')}
function isLoggedIn(){return getCurrentUser()!==null}
function loginOrRegister(email,pass){
 email=email.toLowerCase().trim();let users=getUsers();
 if(users[email]){
  if(users[email].password===pass){
   localStorage.setItem('mrc_current_user',JSON.stringify({email:email,name:users[email].name}));
   return{ok:true,newUser:false,email:email}
  }else{return{ok:false,error:'Wrong password for '+email}}
 }else{
  users[email]={password:pass,name:email.split('@')[0],created:Date.now()};
  saveUsers(users);
  localStorage.setItem('mrc_current_user',JSON.stringify({email:email,name:email.split('@')[0]}));
  return{ok:true,newUser:true,email:email}
 }
}
function doLogout(){localStorage.removeItem('mrc_current_user');location.reload()}
function updateAllHeaders(){
 const user=getCurrentUser();
 document.querySelectorAll('#headerLoginBtn').forEach(btn=>{
  if(user){btn.textContent=user.email.split('@')[0];btn.href="#";btn.onclick=(e)=>{e.preventDefault();return false};btn.style.background='#E8F5E9'}
  else{btn.textContent='Login';btn.onclick=(e)=>{e.preventDefault();openGlobalLogin();return false}}
 });
 document.querySelectorAll('#loggedInfo').forEach(el=>{
  if(user){el.style.display='inline';el.innerHTML=`👤 ${user.email} | <span style="color:#ff5252;cursor:pointer;font-weight:800" onclick="doLogout()">Logout</span>`}
  else{el.style.display='none'}
 });
}
function openGlobalLogin(){document.getElementById('globalLoginModal')?.classList.add('show')}
function closeGlobalLogin(){document.getElementById('globalLoginModal')?.classList.remove('show')}
function handleGlobalLogin(){
 let email=document.getElementById('globalEmail').value.trim();
 let pass=document.getElementById('globalPass').value.trim();
 let msg=document.getElementById('globalLoginMsg');
 if(!email.includes('@')){msg.textContent='Enter valid email';msg.style.display='block';return}
 if(pass.length<4){msg.textContent='Password min 4 chars';msg.style.display='block';return}
 let res=loginOrRegister(email,pass);
 if(!res.ok){msg.textContent=res.error;msg.style.display='block'}
 else{closeGlobalLogin();updateAllHeaders();alert(res.newUser?'Account created! Welcome '+res.email:'Welcome back '+res.email);if(window.pendingCourse && typeof startCourseAfterLogin==='function'){startCourseAfterLogin(window.pendingCourse)}}
}
document.addEventListener('DOMContentLoaded',updateAllHeaders);