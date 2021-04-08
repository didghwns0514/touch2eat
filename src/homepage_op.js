'use strict';
// https://anijs.github.io/examples/scrollreveal/
// https://medium.com/@matthewdtotheg/animations-with-scrollreveal-js-e4062961cbb9
// http://anijs.github.io/
// http://bootstrapk.com/examples/theme/#

// GENERAL SETTING
window.sr = ScrollReveal({ reset: true });

sr.reveal('.searchwrap', {

  origin: 'right', 
  duration: 2500,
  scale:0.85,
  reset:true,
});


// Custom Settings
sr.reveal('.col-right', { 
  origin: 'right', 
  duration: 1000,
  viewFactor: 0.5
});

sr.reveal('.search', { 
  origin: 'right', 
  duration: 2000,
  viewFactor: 0.5 
  
});

sr.reveal('.login', { 
  origin: 'right', 
  duration: 2000,
  viewFactor: 0.5 
  
});

sr.reveal('.map', { 
  origin: 'right', 
  duration: 2000,
  viewFactor: 0.5 
  
});

sr.reveal('.searchwrap', { 
  origin: 'right', 
  duration: 2100,
  viewFactor: 0.5 
  
});

sr.reveal('.footer', { 
  origin: 'top', 
  duration: 2100,
  viewFactor: 0.5 
  
});

// sr.reveal('.footer', { 
//   origin: 'top', 
//   duration: 3000,
//   viewFactor: 0.7 
  
// });

// sr.reveal('.foo-3', { 
//   rotate: { x: 100, y: 100, z: 0 },
//   duration: 1000,
//   viewFactor: 0.5
// });

// sr.reveal('.foo-4', { 
//   viewFactor: 0.5
// });

// sr.reveal('.foo-5', { 
//   duration: 200 
// });