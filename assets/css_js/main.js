/* =========================
   PORTFOLIO MAIN SCRIPT
========================= */

(function(){

"use strict";

/* =========================
   SELECT HELPER
========================= */

const select=(el,all=false)=>{

el=el.trim()

if(all){

return [...document.querySelectorAll(el)]

}

return document.querySelector(el)

}


/* =========================
   EVENT HELPER
========================= */

const on=(type,el,listener,all=false)=>{

let elements=select(el,all)

if(!elements)return

if(all){

elements.forEach(e=>e.addEventListener(type,listener))

}else{

elements.addEventListener(type,listener)

}

}


/* =========================
   NAVBAR ACTIVE LINK
========================= */

let navbarlinks=select('#navbar .scrollto',true)

const navbarlinksActive=()=>{

let position=window.scrollY+200

navbarlinks.forEach(navbarlink=>{

if(!navbarlink.hash)return

let section=select(navbarlink.hash)

if(!section)return

if(position>=section.offsetTop &&
position<=section.offsetTop+section.offsetHeight){

navbarlink.classList.add('active')

}

else{

navbarlink.classList.remove('active')

}

})

}

window.addEventListener('load',navbarlinksActive)

document.addEventListener('scroll',navbarlinksActive)



/* =========================
   SMOOTH SCROLL
========================= */

const scrollto=(el)=>{

let header=select('#header')

if(!header)return

let offset=header.offsetHeight

let elementPos=select(el).offsetTop

window.scrollTo({

top:elementPos-offset,

behavior:'smooth'

})

}


on('click','.scrollto',function(e){

if(select(this.hash)){

e.preventDefault()

scrollto(this.hash)

}

},true)



/* =========================
   MOBILE NAV
========================= */

on('click','.mobile-nav-toggle',function(){

let navbar=select('#navbar')

navbar.classList.toggle('navbar-mobile')

this.classList.toggle('bi-list')

this.classList.toggle('bi-x')

})


/* =========================
   BACK TO TOP
========================= */

let backtotop=select('.back-to-top')

if(backtotop){

const toggle=()=>{

if(window.scrollY>100){

backtotop.classList.add('active')

}

else{

backtotop.classList.remove('active')

}

}

window.addEventListener('load',toggle)

document.addEventListener('scroll',toggle)

}

})();



/* =========================
   BLOG MODAL
========================= */

/* LOAD BLOG CARDS */

function loadBlogs(){

const container=document.getElementById('blog-container')

if(!container) return

for(const id in blogs){

const blog=blogs[id]

const card=`

<div class="col-lg-4 col-md-6">

<div class="blog-card">

<h4>${blog.title}</h4>

<p class="blog-date">

${blog.date}

</p>

<p>

${blog.desc}

</p>

<button class="btn btn-outline-primary"
onclick="openBlog('${id}')">

Read More

</button>

</div>

</div>

`

container.innerHTML+=card

}

}

document.addEventListener("DOMContentLoaded",loadBlogs)



/* OPEN BLOG */

function openBlog(blogId){

const blog=blogs[blogId]

if(!blog) return

document.getElementById('modal-title').textContent=
blog.title

document.getElementById('modal-date').textContent=
blog.date

document.getElementById('modal-body').innerHTML=
blog.content

document.getElementById('blogModal').style.display="block"

}



/* CLOSE BLOG */

function closeBlogModal(){

document.getElementById('blogModal').style.display="none"

}



/* CLOSE OUTSIDE */

window.addEventListener('click',function(e){

let modal=document.getElementById('blogModal')

if(e.target===modal){

closeBlogModal()

}

})


/* =========================
   CERTIFICATE MODAL
========================= */

const certificateImages={

nde:"assets/images/nde.png",

sql:"assets/images/sql.png",

mastercard:"assets/images/mastercard.png",

freecodecamp:"assets/images/freecodecamp.png",

wogleTech:"assets/images/wogleTech.png",

css:"assets/images/css.png",

ehe:"assets/images/ehe.png",

tcs:"assets/images/tcs.png",

cisco:"assets/images/cisco.png"

}



function openCert(certId){

let modal=document.getElementById('certModal')

let img=document.getElementById('modal-img')

if(!certificateImages[certId]) return

img.src=certificateImages[certId]

modal.style.display="block"

}



function closeCertModal(){

document.getElementById('certModal').style.display="none"

}



/* =========================
   CLOSE MODALS OUTSIDE CLICK
========================= */

window.addEventListener('click',function(e){

let blogModal=document.getElementById('blogModal')

let certModal=document.getElementById('certModal')

if(e.target===blogModal){

closeBlogModal()

}

if(e.target===certModal){

closeCertModal()

}

})



/* =========================
   HERO TEXT SCRAMBLE
========================= */

class TextScramble{

constructor(el){

this.el=el

this.chars='!<>-_\\/[]{}—=+*^?#'

this.update=this.update.bind(this)

}

setText(newText){

const oldText=this.el.innerText

const length=Math.max(oldText.length,newText.length)

const promise=new Promise(resolve=>this.resolve=resolve)

this.queue=[]

for(let i=0;i<length;i++){

const from=oldText[i]||''

const to=newText[i]||''

const start=Math.floor(Math.random()*20)

const end=start+Math.floor(Math.random()*20)

this.queue.push({from,to,start,end})

}

cancelAnimationFrame(this.frameRequest)

this.frame=0

this.update()

return promise

}

update(){

let output=''

let complete=0

for(let i=0;i<this.queue.length;i++){

let {from,to,start,end,char}=this.queue[i]

if(this.frame>=end){

complete++

output+=to

}

else if(this.frame>=start){

if(!char||Math.random()<0.3){

char=this.randomChar()

this.queue[i].char=char

}

output+=`<span class="dud">${char}</span>`

}

else{

output+=from

}

}

this.el.innerHTML=output

if(complete===this.queue.length){

this.resolve()

}

else{

this.frameRequest=requestAnimationFrame(this.update)

this.frame++

}

}

randomChar(){

return this.chars[Math.floor(Math.random()*this.chars.length)]

}

}



/* =========================
   RUN HERO ANIMATION
========================= */

const hero=document.querySelector('.text')

if(hero){

const phrases=[

"IT Support Specialist",

"Cybersecurity Enthusiast",

"Networking Fundamentals",

"SOC Analyst Path",

"Security+ Candidate"

]

const fx=new TextScramble(hero)

let counter=0

const next=()=>{

fx.setText(phrases[counter]).then(()=>{

setTimeout(next,1500)

})

counter=(counter+1)%phrases.length

}

next()

}