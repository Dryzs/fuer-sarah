(() => {
const page=document.getElementById('memory-page'), shell=document.querySelector('.app-shell'), box=document.getElementById('photo-lightbox');let opener,scrollY=0;
document.querySelectorAll('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{opener=b;scrollY=window.scrollY;shell.hidden=true;page.hidden=false;window.scrollTo(0,0);document.getElementById('memory-title').focus({preventScroll:true});}));
function back(){page.querySelectorAll('video').forEach(v=>v.pause());page.hidden=true;shell.hidden=false;window.scrollTo(0,scrollY);opener?.focus({preventScroll:true});}
document.getElementById('memory-back').addEventListener('click',back);document.querySelector('.memory-bottom-back').addEventListener('click',back);
document.querySelectorAll('.memory-open').forEach(b=>b.addEventListener('click',()=>{document.getElementById('photo-large').src=b.dataset.photo;document.getElementById('photo-large').alt=b.dataset.caption;document.getElementById('photo-caption').textContent=b.dataset.caption;box.showModal();}));
document.getElementById('photo-close').addEventListener('click',()=>box.close());box.addEventListener('click',e=>{if(e.target===box)box.close();});
})();