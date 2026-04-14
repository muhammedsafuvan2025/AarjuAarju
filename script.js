// ── LOADER — letter by letter ──
(function runLoader() {
  const letters = document.querySelectorAll('.ll');
  const sub     = document.getElementById('loader-sub');

  gsap.set(letters, { opacity:0, y:80, scale:0.2, rotation:-30 });
  gsap.set(sub,     { opacity:0, y:16 });

  const tl = gsap.timeline();

  // Letters pop in one by one
  tl.to(letters, {
    opacity:1, y:0, scale:1, rotation:0,
    duration:0.55, stagger:0.13,
    ease:'back.out(2.8)'
  })
  // All letters wave bounce together
  .to(letters, {
    y: -22, duration:0.28, stagger:0.07,
    ease:'power2.out', yoyo:true, repeat:1
  }, '-=0.1')
  // Sub text fades in
  .to(sub, { opacity:1, y:0, duration:0.45, ease:'power2.out' }, '-=0.2')
  // Progress bar fills
  .to('#loader-bar', { width:'100%', duration:1.1, ease:'power2.inOut' }, '+=0.15')
  // Loader exits
  .to('#loader', { opacity:0, duration:0.45, ease:'power2.in',
    onComplete: () => {
      document.getElementById('loader').style.display = 'none';
      startHeroAnimations();
    }
  }, '+=0.1');
})();

// ── CURSOR ──
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
(function animCursor(){
  rx += (mx-rx)*0.12; ry += (my-ry)*0.12;
  dot.style.left=mx+'px'; dot.style.top=my+'px';
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animCursor);
})();

// ── SCROLL PROGRESS ──
const prog = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  prog.style.width = (pct*100)+'%';
});

// ── PARTICLES ──
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let W,H,particles=[];
const colors = ['#ff6eb4','#ffe066','#6edcc4','#c9b3ff','#74d7f7','#ffb347'];
function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
resize(); window.addEventListener('resize',resize);

class Particle {
  constructor(){
    this.x=Math.random()*W; this.y=Math.random()*H;
    this.r=Math.random()*3+1;
    this.color=colors[Math.floor(Math.random()*colors.length)];
    this.vx=(Math.random()-0.5)*0.4; this.vy=(Math.random()-0.5)*0.4;
    this.opacity=Math.random()*0.5+0.1;
  }
  update(){
    this.x+=this.vx; this.y+=this.vy;
    if(this.x<0)this.x=W; if(this.x>W)this.x=0;
    if(this.y<0)this.y=H; if(this.y>H)this.y=0;
  }
  draw(){
    ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle=this.color; ctx.globalAlpha=this.opacity; ctx.fill();
    ctx.globalAlpha=1;
  }
}
for(let i=0;i<80;i++) particles.push(new Particle());
(function animP(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{ p.update(); p.draw(); });
  requestAnimationFrame(animP);
})();

// ── HERO ANIMATIONS ──
function startHeroAnimations(){
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({ defaults:{ ease:'back.out(1.4)' }});
  tl.to('.badge',        { opacity:1, y:0, duration:0.6 })
    .to('.hero-name',    { opacity:1, y:0, duration:0.7 }, '-=0.3')
    .to('.hero-tagline', { opacity:1, y:0, duration:0.6 }, '-=0.4')
    .to('.hero-btns',    { opacity:1, y:0, duration:0.5 }, '-=0.3')
    .to('.hero-visual',  { opacity:1, x:0, duration:0.8, ease:'power3.out' }, '-=0.6');

  gsap.set('.hero-name,.hero-tagline,.hero-btns,.badge', { y:40 });
  gsap.set('.hero-visual', { x:60 });

  // SCROLL REVEALS
  gsap.utils.toArray('.reveal').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      opacity:1, y:0, duration:0.7,
      ease:'power3.out',
      delay: (i % 4) * 0.08
    });
  });

// PARALLAX HERO PHOTO
  gsap.to('.hero-visual', {
    scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true },
    y: -80, ease:'none'
  });

  // CARDS stagger
  gsap.utils.toArray('.card').forEach((card,i) => {
    gsap.fromTo(card, { rotateY:15, opacity:0 }, {
      scrollTrigger:{ trigger:card, start:'top 85%' },
      rotateY:0, opacity:1, duration:0.7, delay:i*0.1, ease:'power3.out'
    });
  });

  // FACT pills stagger
  gsap.utils.toArray('.fact').forEach((f,i) => {
    gsap.fromTo(f, { scale:0, opacity:0 }, {
      scrollTrigger:{ trigger:f, start:'top 92%' },
      scale:1, opacity:1, duration:0.4, delay:i*0.06, ease:'back.out(2)'
    });
  });
}

// ── CLICK SPARKLES ──
const EMOJIS=['⭐','✨','💫','🌸','💕','🎀','🌈','💖','🩷','🌟'];
document.addEventListener('click', e => {
  for(let i=0;i<3;i++){
    const s = document.createElement('div');
    s.className='click-star';
    s.textContent = EMOJIS[Math.floor(Math.random()*EMOJIS.length)];
    s.style.left = (e.clientX + (Math.random()-0.5)*40)+'px';
    s.style.top = e.clientY+'px';
    s.style.animationDelay = (i*0.1)+'s';
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),900);
  }
});

// ── MAGNETIC BUTTONS ──
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width/2);
    const dy = e.clientY - (r.top + r.height/2);
    btn.style.transform = `translate(${dx*0.25}px, ${dy*0.25}px) scale(1.05)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ── RESUME DOWNLOAD ANIMATION ──
const resumeBtn = document.getElementById('resume-btn');
if (resumeBtn) {
  resumeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const btn = this;
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;

    // Burst emojis outward
    const burst = ['📄','✨','🎉','💕','⭐','🌸','💫','🎀'];
    burst.forEach((em, i) => {
      const el = document.createElement('div');
      el.className = 'resume-burst';
      el.textContent = em;
      const angle = (i / burst.length) * Math.PI * 2;
      const dist  = 90 + Math.random() * 60;
      el.style.left = cx + 'px';
      el.style.top  = cy + 'px';
      el.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      el.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      el.style.animationDelay = (i * 0.04) + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    });

    // Button spin + scale
    btn.classList.add('downloading');
    const origText = btn.innerHTML;
    btn.innerHTML = '🎉 Coming right up!';
    gsap.timeline()
      .to(btn, { scale:1.15, rotation:8,  duration:0.15, ease:'power2.out' })
      .to(btn, { scale:0.95, rotation:-5, duration:0.12 })
      .to(btn, { scale:1,    rotation:0,  duration:0.2,  ease:'elastic.out(1,0.5)' });

    // Trigger actual download after short delay
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = btn.getAttribute('href');
      a.download = '';
      a.click();
      setTimeout(() => {
        btn.innerHTML = origText;
        btn.classList.remove('downloading');
      }, 800);
    }, 700);
  });
}

// ── MUSIC PLAYER — Twinkle Twinkle Little Star ──
(function initMusic() {
  let audioCtx = null;
  let playing   = false;
  let stopFlag  = false;
  const btn     = document.getElementById('music-btn');

  // Note frequencies
  const NOTE = {
    C4:261.63, D4:293.66, E4:329.63, F4:349.23,
    G4:392.00, A4:440.00, B4:493.88, C5:523.25
  };

  // Twinkle Twinkle — [frequency, duration in beats]
  const song = [
    [NOTE.C4,1],[NOTE.C4,1],[NOTE.G4,1],[NOTE.G4,1],[NOTE.A4,1],[NOTE.A4,1],[NOTE.G4,2],
    [NOTE.F4,1],[NOTE.F4,1],[NOTE.E4,1],[NOTE.E4,1],[NOTE.D4,1],[NOTE.D4,1],[NOTE.C4,2],
    [NOTE.G4,1],[NOTE.G4,1],[NOTE.F4,1],[NOTE.F4,1],[NOTE.E4,1],[NOTE.E4,1],[NOTE.D4,2],
    [NOTE.G4,1],[NOTE.G4,1],[NOTE.F4,1],[NOTE.F4,1],[NOTE.E4,1],[NOTE.E4,1],[NOTE.D4,2],
    [NOTE.C4,1],[NOTE.C4,1],[NOTE.G4,1],[NOTE.G4,1],[NOTE.A4,1],[NOTE.A4,1],[NOTE.G4,2],
    [NOTE.F4,1],[NOTE.F4,1],[NOTE.E4,1],[NOTE.E4,1],[NOTE.D4,1],[NOTE.D4,1],[NOTE.C4,2]
  ];

  async function playSong() {
    stopFlag = false;
    const BPM      = 120;
    const beatSec  = 60 / BPM;

    while (!stopFlag) {
      let t = audioCtx.currentTime + 0.05;
      for (const [freq, beats] of song) {
        if (stopFlag) break;
        const dur = beats * beatSec * 0.88; // slight gap between notes

        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        // Soft attack + release envelope
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.04);
        gain.gain.setValueAtTime(0.18, t + dur - 0.06);
        gain.gain.linearRampToValueAtTime(0, t + dur);

        osc.start(t);
        osc.stop(t + dur);

        t += beats * beatSec;
      }
      // Wait for the full song to finish before looping
      const songDuration = song.reduce((s, [,b]) => s + b, 0) * beatSec * 1000;
      await new Promise(r => setTimeout(r, songDuration + 80));
    }
  }

  btn.addEventListener('click', async () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    if (playing) {
      stopFlag = true;
      playing  = false;
      btn.textContent = '🎵';
      btn.classList.remove('playing');
    } else {
      playing = true;
      btn.textContent = '🔊';
      btn.classList.add('playing');
      playSong();
    }
  });
})();