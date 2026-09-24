/* =========================================================
   SCREEN SWITCHING
   ========================================================= */
function showScreen(name){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-'+name).classList.add('active');
  window.scrollTo(0,0);
}

/* =========================================================
   TOAST
   ========================================================= */
function showToast(msg){
  const t=document.getElementById('toast');
  document.getElementById('toast-text').textContent=msg;
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer=setTimeout(()=>t.classList.remove('show'),2400);
}

/* =========================================================
   SMOOTH SCROLL (landing nav anchors)
   ========================================================= */
function scrollToSection(id){
  showScreen('landing');
  setTimeout(()=>{
    const el=document.getElementById(id);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
  }, 60);
}

/* =========================================================
   MODAL
   ========================================================= */
function openModal(type){
  const box=document.getElementById('modalBox');
  let html='<button class="modal-close" onclick="closeModal()">&times;</button>';
  if(type==='demo'){
    html+=`
      <div class="video-mock"><div class="play-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
      </div></div>
      <h3>See Tandem in 60 seconds</h3>
      <p class="help">A quick look at building a trip from scratch, crew voting and all.</p>
      <button class="btn btn-primary" style="width:100%;justify-content:center;" onclick="closeModal()">Got it</button>`;
  } else if(type==='invite'){
    html+=`
      <h3>Invite your crew</h3>
      <p class="help">They'll get full editor access to this trip.</p>
      <label class="field-label">Email address</label>
      <input class="field-input" id="inviteEmail" placeholder="name@email.com">
      <button class="btn btn-primary" style="width:100%;justify-content:center;margin-bottom:16px;" onclick="sendInvite()">Send invite</button>
      <div class="auth-divider">or share a link</div>
      <div class="copy-row"><span>tandem.app/t/kashmir-oct14-4f2</span>
        <button class="btn btn-secondary btn-sm" onclick="copyLink('Invite link copied')">Copy</button>
      </div>`;
  } else if(type==='share'){
    html+=`
      <h3>Share this trip</h3>
      <p class="help">Anyone with the link can view the itinerary.</p>
      <div class="copy-row"><span>tandem.app/t/kashmir-oct14-4f2</span>
        <button class="btn btn-secondary btn-sm" onclick="copyLink('Link copied')">Copy</button>
      </div>
      <button class="btn btn-primary" style="width:100%;justify-content:center;" onclick="exportPdf(); closeModal();">Export as PDF instead</button>`;
  }
  box.innerHTML=html;
  document.getElementById('modalOverlay').classList.add('show');
}
function closeModal(){ document.getElementById('modalOverlay').classList.remove('show'); }
function copyLink(msg){
  if(navigator.clipboard){ navigator.clipboard.writeText('https://tandem.app/t/kashmir-oct14-4f2').catch(()=>{}); }
  showToast(msg);
}
function sendInvite(){
  const val=document.getElementById('inviteEmail').value.trim();
  closeModal();
  showToast(val ? `Invite sent to ${val}` : 'Invite link ready to share');
}
function exportPdf(){ showToast('Exported itinerary as Kashmir-in-3-Days.pdf'); }

/* =========================================================
   AUTH (LOGIN / SIGN UP)
   ========================================================= */
function openAuth(mode){
  showScreen('login');
  setAuthMode(mode);
}
function setAuthMode(mode){
  const isLogin = mode==='login';
  document.getElementById('authTabLogin').classList.toggle('active', isLogin);
  document.getElementById('authTabSignup').classList.toggle('active', !isLogin);
  document.getElementById('authTitle').textContent = isLogin ? 'Welcome back, traveler' : 'Join the crew';
  document.getElementById('authHelp').textContent = isLogin
    ? 'Log in to pick up right where your crew left off.'
    : "We'll never spam — only trip magic.";
  document.getElementById('authNameField').style.display = isLogin ? 'none' : 'block';
  document.getElementById('authSubmitBtn').textContent = isLogin ? 'Log in' : 'Create account';
  document.getElementById('authSwitchText').innerHTML = isLogin
    ? `New here? <button onclick="setAuthMode('signup')">Sign up</button>`
    : `Already have an account? <button onclick="setAuthMode('login')">Log in</button>`;
  window._authMode = mode;
}
function submitAuth(){
  if(window._authMode==='login'){
    showToast('Welcome back!');
    showScreen('dashboard');
  } else {
    showToast('Account created');
    showScreen('onboarding');
  }
}

/* =========================================================
   ONBOARDING
   ========================================================= */
function finishOnboarding(){
  showScreen('createtrip');
}

/* =========================================================
   CREATE TRIP WIZARD
   ========================================================= */
let wizStep=1;
function renderWizard(){
  document.querySelectorAll('.wiz-step').forEach((el,i)=>el.classList.toggle('active', i+1===wizStep));
  document.querySelectorAll('.stepper .dot').forEach((el,i)=>{
    el.classList.remove('done','now');
    if(i+1<wizStep) el.classList.add('done');
    if(i+1===wizStep) el.classList.add('now');
  });
  document.querySelectorAll('.stepper .seg').forEach((el,i)=>{
    el.classList.toggle('done', i+1<wizStep);
  });
  document.getElementById('wizBackBtn').style.visibility = wizStep===1 ? 'hidden':'visible';
  document.getElementById('wizNextBtn').textContent = wizStep===4 ? 'Create trip' : 'Continue';
}
function wizardNext(){
  if(wizStep<4){ wizStep++; renderWizard(); }
  else { showToast('Trip created'); showScreen('dashboard'); wizStep=1; renderWizard(); }
}
function wizardBack(){
  if(wizStep>1){ wizStep--; renderWizard(); }
}
let travelerCount=4;
function adjustTravelers(delta){
  travelerCount=Math.max(1,Math.min(10,travelerCount+delta));
  document.getElementById('travelerCount').textContent=travelerCount;
}

/* =========================================================
   SHARED CHIP TOGGLE
   ========================================================= */
function toggleChip(el){ el.classList.toggle('active'); }

/* =========================================================
   PLACES DATA (single source for Explore / Map / Details / Collections)
   ========================================================= */
const placesData={
  1:{id:1,name:'Dal Lake Shikara Ride',rating:'4.8',tags:['Scenic','Lakes'],saved:false,grad:'135deg,#5B7CFF,#2FD6C9',top:150,left:260,
     highlights:['Best at sunrise','Very photogenic','30–45 min ride'],distance:'12 min from your houseboat'},
  2:{id:2,name:'Gulmarg Gondola',rating:'4.9',tags:['Gondola','Must-see'],saved:true,grad:'135deg,#FF6B6B,#FFC857',top:230,left:420,
     highlights:['Book Phase 2 in advance','Cold at the top — bring a jacket','Long queues after 11am'],distance:'1h 20m drive from Srinagar'},
  3:{id:3,name:'Nishat Bagh Gardens',rating:'4.6',tags:['Scenic'],saved:false,grad:'135deg,#2FD6C9,#5B7CFF',top:340,left:180,
     highlights:['Mughal-era terraces','Great for photos','Quiet in the morning'],distance:'20 min from Dal Lake'},
  4:{id:4,name:'Wazwan Kitchen',rating:'4.7',tags:['Food'],saved:true,grad:'135deg,#FFC857,#FF6B6B',top:120,left:520,
     highlights:['Try the rogan josh','Reserve ahead for groups of 4+','Cash preferred'],distance:'8 min from Boulevard Road'},
  5:{id:5,name:'Betaab Valley',rating:'4.5',tags:['Nature','Family'],saved:false,grad:'135deg,#5B7CFF,#FF6B6B',top:280,left:560,
     highlights:['Named after the 1983 film shot here','Pony rides available','Best light in late afternoon'],distance:'45 min from Pahalgam'},
};

/* ---------------- explore results ---------------- */
function renderResults(){
  const list=document.getElementById('resultsList');
  list.innerHTML='';
  Object.values(placesData).forEach(p=>{
    const div=document.createElement('div');
    div.className='place-card';
    div.innerHTML=`
      <div class="place-thumb" style="background:linear-gradient(${p.grad});" onclick="openPlaceDetails(${p.id})"></div>
      <div class="place-info" onclick="openPlaceDetails(${p.id})">
        <h4>${p.name}</h4>
        <div class="place-rating">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--accent2)" stroke="var(--accent2)"><path d="M12 2l2.9 6.9L22 9.7l-5 4.9 1.2 7.1L12 18.3l-6.2 3.4L7 14.6 2 9.7l7.1-.8z"/></svg>
          ${p.rating}
        </div>
        <div class="place-tags">${p.tags.map(t=>`<span class="mini-tag">${t}</span>`).join('')}</div>
      </div>
      <button class="save-btn ${p.saved?'saved':''}" onclick="event.stopPropagation(); toggleSaveById(${p.id}, this)">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="${p.saved?'currentColor':'none'}" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </button>`;
    list.appendChild(div);
  });
}
function toggleSaveById(id, btn){
  const p=placesData[id];
  p.saved=!p.saved;
  if(btn){
    btn.classList.toggle('saved', p.saved);
    btn.querySelector('svg').setAttribute('fill', p.saved?'currentColor':'none');
  }
  syncSaveButtons(id);
  showToast(p.saved ? 'Saved to collection: Kashmir Must-dos' : 'Removed from collection');
}
function syncSaveButtons(id){
  const p=placesData[id];
  const pin=document.getElementById('pin-'+id);
  if(pin) pin.classList.toggle('saved', p.saved);
  const detailsBtn=document.getElementById('detailsSaveBtn');
  if(detailsBtn && window._currentDetailsId===id){
    detailsBtn.textContent = p.saved ? 'Saved ✓' : 'Add to collection';
  }
}
renderResults();

/* ---------------- map popover ---------------- */
function openPopover(id){
  const pin=document.getElementById('pin-'+id);
  const pop=document.getElementById('mapPopover');
  const rect=pin.getBoundingClientRect();
  const mapRect=document.getElementById('exploreMap').getBoundingClientRect();
  pop.style.top=(rect.top-mapRect.top-10)+'px';
  pop.style.left=(rect.left-mapRect.left+40)+'px';
  const p=placesData[id];
  document.getElementById('popTitle').textContent=p.name;
  document.getElementById('popMeta').textContent=`${p.rating} ★ · ${p.tags.join(' · ')}`;
  pop.dataset.placeId=id;
  pop.classList.add('show');
}
document.getElementById('exploreMap').addEventListener('click',(e)=>{
  if(!e.target.closest('.pin') && !e.target.closest('.map-popover')){
    document.getElementById('mapPopover').classList.remove('show');
  }
});
function quickSaveFromPopover(){
  const id=Number(document.getElementById('mapPopover').dataset.placeId);
  toggleSaveById(id);
  document.getElementById('mapPopover').classList.remove('show');
}
function viewDetailsFromPopover(){
  const id=Number(document.getElementById('mapPopover').dataset.placeId);
  document.getElementById('mapPopover').classList.remove('show');
  openPlaceDetails(id);
}

/* =========================================================
   PLACE DETAILS
   ========================================================= */
function openPlaceDetails(id){
  window._currentDetailsId=id;
  const p=placesData[id];
  document.getElementById('detailsHero').style.background=`linear-gradient(160deg,${p.grad.replace('135deg,','')})`;
  document.getElementById('detailsName').textContent=p.name;
  document.getElementById('detailsMeta').textContent=`${p.rating} ★ · ${p.tags.join(' · ')}`;
  document.getElementById('detailsDistance').textContent=p.distance;
  document.getElementById('detailsHighlights').innerHTML=p.highlights.map(h=>`<span class="mini-tag">${h}</span>`).join('');
  const saveBtn=document.getElementById('detailsSaveBtn');
  saveBtn.textContent = p.saved ? 'Saved ✓' : 'Add to collection';
  showScreen('placedetails');
}
function detailsToggleSave(){
  toggleSaveById(window._currentDetailsId);
  renderResults();
}
function addPlaceToDay(day){
  const id=window._currentDetailsId;
  const p=placesData[id];
  const dayPanel=document.getElementById('day-'+day);
  let zone=dayPanel.querySelector('.time-block:last-child .dropzone');
  const empty=zone.querySelector('.dropzone-empty');
  if(empty) empty.remove();
  const item=document.createElement('div');
  item.className='itin-item';
  item.draggable=true;
  item.setAttribute('ondragstart','dragStart(event)');
  item.innerHTML=`<div class="ico"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg></div><div><h5>${p.name}</h5><p>${p.distance}</p></div>`;
  zone.appendChild(item);
  showToast(`Added "${p.name}" to Day ${day}`);
  document.querySelectorAll('.day-tab').forEach((b,i)=>b.classList.toggle('active', i+1===day));
  document.querySelectorAll('.day-panel').forEach((pnl,i)=>pnl.classList.toggle('active', i+1===day));
  showScreen('itinerary');
}

/* =========================================================
   DASHBOARD
   ========================================================= */
/* handled via showScreen() calls from buttons */

/* =========================================================
   COLLECTIONS
   ========================================================= */
function toggleCollection(el, tagFilter){
  const body=el.nextElementSibling;
  const isShowing=body.classList.contains('show');
  document.querySelectorAll('.collection-body-list').forEach(b=>b.classList.remove('show'));
  if(!isShowing){
    body.innerHTML=Object.values(placesData)
      .filter(p=> tagFilter==='all' ? true : p.tags.includes(tagFilter))
      .map(p=>`
        <div class="place-card" style="background:var(--white);border-radius:12px;box-shadow:var(--shadow-soft);margin-bottom:10px;" onclick="openPlaceDetails(${p.id})">
          <div class="place-thumb" style="background:linear-gradient(${p.grad});"></div>
          <div class="place-info">
            <h4>${p.name}</h4>
            <div class="place-tags">${p.tags.map(t=>`<span class="mini-tag">${t}</span>`).join('')}</div>
          </div>
        </div>`).join('') || '<p style="color:var(--slate);font-size:13.5px;padding:10px 0;">No places here yet.</p>';
    body.classList.add('show');
  }
}
let newCollectionCount=0;
function addCollection(){
  newCollectionCount++;
  const grid=document.getElementById('collectionsGrid');
  const card=document.createElement('div');
  card.className='card collection-card';
  card.innerHTML=`
    <div class="collection-cover" style="background:linear-gradient(135deg,#5B7CFF,#FFC857);"></div>
    <h4 style="font-size:15px;">Untitled collection ${newCollectionCount}</h4>
    <p style="font-size:12.5px;color:var(--slate);margin-top:4px;">0 saved</p>`;
  grid.insertBefore(card, document.getElementById('addCollectionCard'));
  showToast('New collection created');
}

/* =========================================================
   CREW / COLLABORATION
   ========================================================= */
const voteCounts={want:12, skip:1, mustdo:7};
let myVote=null;
function castVote(choice, btn){
  if(myVote) voteCounts[myVote]--;
  if(myVote===choice){ myVote=null; } else { voteCounts[choice]++; myVote=choice; }
  document.getElementById('voteWant').textContent=`Want · ${voteCounts.want}`;
  document.getElementById('voteSkip').textContent=`Skip · ${voteCounts.skip}`;
  document.getElementById('voteMustdo').textContent=`Must-do · ${voteCounts.mustdo}`;
  document.querySelectorAll('.vote-btn').forEach(b=>b.classList.remove('active'));
  if(myVote) btn.classList.add('active');
}
function sendChatMessage(){
  const input=document.getElementById('chatInput');
  const text=input.value.trim();
  if(!text) return;
  const scroll=document.getElementById('chatScroll');
  const row=document.createElement('div');
  row.className='msg-row mine';
  row.innerHTML=`<div class="avatar" style="background:var(--primary);width:30px;height:30px;font-size:11px;">YOU</div>
    <div><div class="who">You</div><div class="bubble">${text.replace(/</g,'&lt;')}</div></div>`;
  scroll.appendChild(row);
  input.value='';
  scroll.scrollTop=scroll.scrollHeight;
}
function chatKeydown(e){ if(e.key==='Enter') sendChatMessage(); }
function mentionAssistant(){
  const scroll=document.getElementById('chatScroll');
  const row1=document.createElement('div');
  row1.className='msg-row mine';
  row1.innerHTML=`<div class="avatar" style="background:var(--primary);width:30px;height:30px;font-size:11px;">YOU</div>
    <div><div class="who">You</div><div class="bubble">@Trip Assistant suggest photo spots near Dal Lake</div></div>`;
  scroll.appendChild(row1);
  const row2=document.createElement('div');
  row2.className='msg-row';
  row2.innerHTML=`<div class="avatar" style="background:var(--ink);width:30px;height:30px;font-size:11px;">🤖</div>
    <div><div class="who">Trip Assistant</div><div class="bubble bot-bubble">Try the Nishat Bagh terraces at golden hour, and the houseboat deck just after sunrise — both are close to Day 1's route.</div></div>`;
  scroll.appendChild(row2);
  scroll.scrollTop=scroll.scrollHeight;
}

/* =========================================================
   BOOKINGS
   ========================================================= */
function showBookTab(name, btn){
  document.querySelectorAll('.book-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.book-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('book-'+name).classList.add('active');
}
function triggerUpload(){ document.getElementById('fileInput').click(); }
function handleFileSelected(e){
  const file=e.target.files[0];
  if(!file) return;
  const list=document.getElementById('receiptsList');
  const card=document.createElement('div');
  card.className='card booking-card';
  card.innerHTML=`
    <div class="booking-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></div>
    <div class="booking-fields"><div><div class="f-lbl">File</div><div class="f-val">${file.name}</div></div></div>`;
  list.prepend(card);
  showToast('Confirmation uploaded');
  e.target.value='';
}
function toggleAddBooking(id){ document.getElementById(id).classList.toggle('show'); }
function addBookingCard(listId, formId){
  const form=document.getElementById(formId);
  const provider=form.querySelector('.b-provider').value.trim() || 'New booking';
  const date=form.querySelector('.b-date').value.trim() || '—';
  const ref=form.querySelector('.b-ref').value.trim() || '—';
  const list=document.getElementById(listId);
  const card=document.createElement('div');
  card.className='card booking-card';
  card.innerHTML=`
    <div class="booking-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg></div>
    <div class="booking-fields">
      <div><div class="f-lbl">Provider</div><div class="f-val">${provider}</div></div>
      <div><div class="f-lbl">Date</div><div class="f-val">${date}</div></div>
      <div><div class="f-lbl">Reference</div><div class="f-val">${ref}</div></div>
    </div>`;
  list.appendChild(card);
  form.classList.remove('show');
  form.querySelectorAll('input').forEach(i=>i.value='');
  showToast('Booking added');
}

/* =========================================================
   STATIC PAGES
   ========================================================= */
const staticContent={
  about:{title:'About Tandem', body:`
    <p>Tandem started as a shared spreadsheet that got out of hand. Three friends, one Kashmir trip, and forty tabs of screenshots later, we decided a group trip deserved its own tool.</p>
    <h2>What we're building</h2>
    <p>A place where the planner and the crew can work from the same map, the same day-by-day plan, and the same set of bookings — without another 200-message group chat.</p>`},
  privacy:{title:'Privacy policy', body:`
    <p>We only collect what's needed to run your trips: your account details, the places you save, and anything you choose to upload as a booking confirmation.</p>
    <h2>What we don't do</h2>
    <p>We don't sell trip data to third parties, and crew members only see trips they've been invited to.</p>`},
  terms:{title:'Terms of service', body:`
    <p>By using Tandem, you agree to keep your account details accurate and to use the app for planning real trips with people you actually know.</p>
    <h2>Content you add</h2>
    <p>Photos, notes and bookings you upload remain yours — we just store them so your crew can see them too.</p>`},
  contact:{title:'Contact us', body:`
    <p>Have a question, a bug to report, or a feature you wish existed? Send us a note below.</p>`},
};
function openStatic(key){
  const data=staticContent[key];
  document.getElementById('staticTitle').textContent=data.title;
  let bodyHtml=data.body;
  if(key==='contact'){
    bodyHtml+=`
      <div class="contact-form" style="max-width:440px;margin-top:20px;">
        <label class="field-label">Name</label>
        <input class="field-input" id="contactName" placeholder="Your name">
        <label class="field-label">Email</label>
        <input class="field-input" id="contactEmail" placeholder="name@email.com">
        <label class="field-label">Message</label>
        <textarea class="field-input" id="contactMsg" rows="4" placeholder="How can we help?" style="resize:vertical;"></textarea>
        <button class="btn btn-primary" onclick="submitContact()">Send message</button>
      </div>`;
  }
  document.getElementById('staticBody').innerHTML=bodyHtml;
  showScreen('static');
}
function submitContact(){
  showToast("Message sent — we'll reply within 1 business day.");
  ['contactName','contactEmail','contactMsg'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
}

/* =========================================================
   ITINERARY DAY TABS
   ========================================================= */
function showDay(n, btn){
  document.querySelectorAll('.day-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.day-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('day-'+n).classList.add('active');
}

/* =========================================================
   DRAG AND DROP (itinerary)
   ========================================================= */
let dragEl=null;
function dragStart(e){
  dragEl = e.target.closest('.itin-item, .drawer-card');
  e.dataTransfer.effectAllowed='move';
  e.dataTransfer.setData('text/plain','drag');
}
function allowDrop(e){ e.preventDefault(); e.currentTarget.classList.add('dragover'); }
function dragLeave(e){ e.currentTarget.classList.remove('dragover'); }
function handleDrop(e,zone){
  e.preventDefault();
  zone.classList.remove('dragover');
  if(!dragEl) return;
  const empty=zone.querySelector('.dropzone-empty');
  if(empty) empty.remove();

  let newItem;
  if(dragEl.classList.contains('drawer-card')){
    const title=dragEl.querySelector('h5').textContent;
    const meta=dragEl.querySelector('p').textContent;
    newItem=document.createElement('div');
    newItem.className='itin-item';
    newItem.draggable=true;
    newItem.setAttribute('ondragstart','dragStart(event)');
    newItem.innerHTML=`<div class="ico"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg></div><div><h5>${title}</h5><p>${meta}</p></div>`;
  } else {
    newItem=dragEl;
  }
  zone.appendChild(newItem);
  newItem.style.animation='fadeUp .3s cubic-bezier(.34,1.56,.64,1) both';
  showToast('Added to itinerary');
  dragEl=null;
}
