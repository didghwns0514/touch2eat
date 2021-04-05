'use strict';
// https://anijs.github.io/examples/scrollreveal/
// https://medium.com/@matthewdtotheg/animations-with-scrollreveal-js-e4062961cbb9
// http://anijs.github.io/
// http://bootstrapk.com/examples/theme/#

// GENERAL SETTING
window.sr = ScrollReveal({ reset: true });

// Custom Settings
sr.reveal('.foo-1', { 
  duration: 200,

});

sr.reveal('.foo-2', { 
  origin: 'right', 
  duration: 2000,
  viewFactor: 0.5 
  
});

sr.reveal('.foo-3', { 
  rotate: { x: 100, y: 100, z: 0 },
  duration: 1000,
  viewFactor: 0.5
});

sr.reveal('.foo-4', { 
  viewFactor: 0.5
});

sr.reveal('.foo-5', { 
  duration: 200 
});