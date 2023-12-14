





const tl = gsap.timeline({
  defaults:{
    duration:3,
    ease:'power3.inOut'
  },
})
.from('.image_container > div',{
  x:innerWidth,
  stagger:{
    amount:0.5
  },
})
.to('.image_container > div',{
  y: innerHeight * 0.2,
  stagger:{
    // amount:0.5,
    from: 1
  },

},'-=1.5') // 1.5s 더 빠르게 시작
.from('.text_container .elem',{
  y:30,
  opacity:0,
  stagger:{
    each:0.2,
    ease:'power3.inOut'
  },
  duration:1
},'-=2') // 2s 더 빠르게 시작


tl.eventCallback('onComplete',()=>{
  gsap.set('#no-scroll',{display:'none'})
})


ScrollTrigger.create({
  trigger: '.section01',
  start: 'top top',
  end: 'bottom top',
  animation: gsap.to('.image_container',{x: -innerWidth * 0.5}),
  scrub: true,
  markers: true,
})

GSDevTools.create()


















markers()



