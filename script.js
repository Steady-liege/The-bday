// Preloader animation
document.addEventListener('DOMContentLoaded', function() {
  const preloader = document.getElementById('preloader');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += 1;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;
    
    // Animate cake parts as loading progresses
    if (progress >= 20) {
      document.querySelector('.cake-plate').style.opacity = '1';
    }
    if (progress >= 40) {
      document.querySelector('.cake-bottom').style.opacity = '1';
    }
    if (progress >= 60) {
      document.querySelector('.cake-middle').style.opacity = '1';
    }
    if (progress >= 80) {
      document.querySelector('.cake-top').style.opacity = '1';
      document.querySelector('.candle').style.opacity = '1';
    }
    if (progress >= 90) {
      document.querySelector('.flame').style.opacity = '1';
    }
    
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
          startAnimations();
        }, 500);
      }, 300);
    }
  }, 30);
});

// Start animations after preloader
function startAnimations() {
  // Initialize AOS
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false
  });

  // Age counter animation
  const ageCounter = document.getElementById('age-counter');
  let age = 0;
  const targetAge = 20;
  const ageInterval = setInterval(() => {
    age += 1;
    ageCounter.textContent = age;
    if (age >= targetAge) {
      clearInterval(ageInterval);
      createConfetti();
    }
  }, 80);

  // Life timer
  updateLifeTimer();
  setInterval(updateLifeTimer, 1000);

  // Birthday countdown
  updateBirthdayCountdown();
  setInterval(updateBirthdayCountdown, 1000);

  // Create floating elements
  createFloatingElements();

  initCarousel();
  
  // GSAP animations
  gsap.from(".fancy-font", {
    duration: 1.5,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: "power3.out"
  });
}

// Confetti button functionality
document.getElementById('confetti-btn').addEventListener('click', function() {
  createConfetti();
  gsap.to(this, {
    scale: 1.1,
    duration: 0.3,
    yoyo: true,
    repeat: 1
  });
});

// Life timer calculation
function updateLifeTimer() {
  const birthDate = new Date('2005-05-24'); // May 24, 2005
  const now = new Date();
  
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();
  
  if (days < 0) {
    months--;
    // Get last day of previous month
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Calculate total time
  const totalDays = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor((now - birthDate) / (1000 * 60 * 60));
  const totalMinutes = Math.floor((now - birthDate) / (1000 * 60));
  
  // Update DOM
  document.getElementById('years').textContent = years;
  document.getElementById('months').textContent = months;
  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = now.getHours();
  
  document.getElementById('total-days').textContent = totalDays.toLocaleString();
  document.getElementById('total-hours').textContent = totalHours.toLocaleString();
  document.getElementById('total-minutes').textContent = totalMinutes.toLocaleString();
}

// Birthday countdown calculation
function updateBirthdayCountdown() {
  const now = new Date();
  // Next birthday (May 24 of next year if already passed this year)
  let nextBirthday = new Date(now.getFullYear(), 4, 24); // May is month 4 (0-indexed)
  
  if (now > nextBirthday) {
    nextBirthday = new Date(now.getFullYear() + 1, 4, 24);
  }
  
  const diff = nextBirthday - now;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  document.getElementById('countdown-days').textContent = days;
  document.getElementById('countdown-hours').textContent = hours;
  document.getElementById('countdown-minutes').textContent = minutes;
  document.getElementById('countdown-seconds').textContent = seconds;
}

// Book functionality
const book = document.getElementById('birthday-book');
const pages = document.querySelectorAll('.page');
const prevButtons = document.querySelectorAll('.prev-btn');
const nextButtons = document.querySelectorAll('.next-btn');
let currentPage = 0;

function showPage(index) {
  // Hide all pages
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show the selected page
  pages[index].classList.add('active');
  
  // Update button states
  updateButtons();
}

function updateButtons() {
  prevButtons.forEach(btn => {
    btn.disabled = currentPage === 0;
  });
  nextButtons.forEach(btn => {
    btn.disabled = currentPage === pages.length - 1;
  });
}

// Initialize book
function initBook() {
  showPage(0);
  updateButtons();
  
  // Book open/close
  book.addEventListener('click', function(e) {
    // Only toggle if clicking on the cover or outside page content
    if (e.target.closest('.book-cover') || (!e.target.closest('.page-content') && !e.target.closest('.page-nav'))) {
      this.classList.toggle('open');
    }
  });

  // Next page
  nextButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (currentPage < pages.length - 1) {
        currentPage++;
        showPage(currentPage);
        gsap.from(".page-content", {
          duration: 0.5,
          x: 50,
          opacity: 0,
          ease: "power2.out"
        });
      }
    });
  });

  // Previous page
  prevButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (currentPage > 0) {
        currentPage--;
        showPage(currentPage);
        gsap.from(".page-content", {
          duration: 0.5,
          x: -50,
          opacity: 0,
          ease: "power2.out"
        });
      }
    });
  });
}

// Initialize the book
initBook();

// Create confetti effect
function createConfetti() {
  const container = document.getElementById('sparkle-container');
  const colors = ['#ff6b6b', '#ffa502', '#2ed573', '#1e90ff', '#ff4757', '#ff6348', '#ff7f50', '#ffa502'];
  
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = `-10px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = `${8 + Math.random() * 8}px`;
    confetti.style.height = `${8 + Math.random() * 8}px`;
    confetti.style.borderRadius = `${Math.random() * 50}%`;
    
    // Random shape - some as squares, some as circles
    if (Math.random() > 0.5) {
      confetti.style.borderRadius = '0';
    }
    
    // Random animation
    if (Math.random() > 0.5) {
      confetti.style.animation = `confetti-fall ${2 + Math.random() * 3}s linear forwards`;
    } else {
      confetti.style.animation = `confetti-side ${2 + Math.random() * 3}s linear forwards`;
    }
    
    container.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

// Create floating elements (hearts, balloons)
function createFloatingElements() {
  const container = document.getElementById('floating-elements');
  const colors = ['#ff6b6b', '#ffa502', '#2ed573', '#1e90ff', '#ff4757'];
  
  for (let i = 0; i < 15; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'heart-balloon';
    balloon.style.left = `${Math.random() * 100}vw`;
    balloon.style.top = `${100 + Math.random() * 20}vh`;
    balloon.style.animationDuration = `${8 + Math.random() * 7}s`;
    balloon.style.opacity = '0.8';
    balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    const string = document.createElement('div');
    string.className = 'heart-string';
    
    balloon.appendChild(string);
    container.appendChild(balloon);
    
    // Animate balloon floating up
    setTimeout(() => {
      balloon.style.top = `${-20 - Math.random() * 20}vh`;
      balloon.style.left = `${parseFloat(balloon.style.left) + (Math.random() * 20 - 10)}vw`;
    }, 50);
  }
}

// Cake interactions
const blowCandle = document.getElementById('blow-candle');
const cutCake = document.getElementById('cut-cake');
const resetCake = document.getElementById('reset-cake');
const cakeMessage = document.getElementById('cake-message');
const flame = document.getElementById('flame');
const knife = document.getElementById('cake-knife');
const slice1 = document.getElementById('slice-1');
const slice2 = document.getElementById('slice-2');
const cakeBottom = document.getElementById('cake-bottom');
const cakeMiddle = document.getElementById('cake-middle');
const cakeTop = document.getElementById('cake-top');

blowCandle.addEventListener('click', function() {
  flame.style.opacity = '0';
  cakeMessage.textContent = 'Your wish will come true! ✨';
  createConfetti();
  gsap.to(this, {
    scale: 1.1,
    duration: 0.3,
    yoyo: true,
    repeat: 1
  });
});

cutCake.addEventListener('click', function() {
  knife.style.opacity = '1';
  knife.style.left = '70px';
  
  setTimeout(() => {
    // Hide the original cake
    cakeBottom.style.opacity = '0';
    cakeMiddle.style.opacity = '0';
    cakeTop.style.opacity = '0';
    
    // Show the slices
    slice1.style.opacity = '1';
    slice2.style.opacity = '1';
    slice1.style.left = '-180px';
    slice2.style.right = '-180px';
    cakeMessage.textContent = 'Enjoy your cake! 🍰';
    createConfetti();
  }, 800);
  
  gsap.to(this, {
    scale: 1.1,
    duration: 0.3,
    yoyo: true,
    repeat: 1
  });
});

resetCake.addEventListener('click', function() {
  flame.style.opacity = '1';
  knife.style.opacity = '0';
  knife.style.left = '-150px';
  slice1.style.opacity = '0';
  slice2.style.opacity = '0';
  slice1.style.left = '-80px';
  slice2.style.right = '-80px';
  
  // Restore the original cake
  cakeBottom.style.opacity = '1';
  cakeMiddle.style.opacity = '1';
  cakeTop.style.opacity = '1';
  
  cakeMessage.textContent = 'Make a wish and blow the candle! ✨';
  
  gsap.to(this, {
    scale: 1.1,
    duration: 0.3,
    yoyo: true,
    repeat: 1
  });
});

// Gift box animation
const giftBox = document.getElementById('gift-box');
const openGift = document.getElementById('open-gift');
const giftMessage = document.getElementById('gift-message');

openGift.addEventListener('click', function() {
  giftBox.classList.add('open-gift');
  setTimeout(() => {
    giftMessage.classList.remove('hidden');
    createConfetti();
  }, 1000);
  
  gsap.to(this, {
    scale: 1.1,
    duration: 0.3,
    yoyo: true,
    repeat: 1
  });
});

// More memories button
document.getElementById('more-memories').addEventListener('click', function() {
  alert('More wonderful memories coming soon! Check back later for updates.');
  gsap.to(this, {
    scale: 1.1,
    duration: 0.3,
    yoyo: true,
    repeat: 1
  });
});

// Initialize carousel after preloader
function initCarousel() {
  const carouselTrack = document.getElementById('carousel-track');
  const unusedImages = [
    '20250114_111856.jpg',
    '20250326_131026.jpg',
    '20250326_131100.jpg',
    '20250326_131104.jpg',
    '20250416_093352.jpg',
    '20250416_093601.jpg',
    'Screenshot_20200129-134802.png',
    'Screenshot_20210519-123607.png',
    'Screenshot_20210524-085617_1.png',
    'Snapchat-1768364337.jpg',
    'Snapchat-2027277404.jpg',
    'Snapchat-443588255.jpg',
    'Snapchat-485371721.jpg',
    'Snapchat-640662273.jpg',
    'Snapchat-662772927.jpg',
    'Snapchat-937909065.jpg'
  ];

  // Clear any existing content
  carouselTrack.innerHTML = '';

  // Create image elements for all images
  unusedImages.forEach(img => {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'carousel-img-container';
    
    const imgElement = document.createElement('img');
    imgElement.src = `assets/${img}`;
    imgElement.alt = "Snapchat memory";
    imgElement.loading = "lazy";
    
    imgContainer.appendChild(imgElement);
    carouselTrack.appendChild(imgContainer);
    
    // Add click event for enlarging
    imgContainer.addEventListener('click', () => {
      enlargeImage(imgElement.src);
    });
  });

  // Clone containers for seamless looping
  const carouselContainers = carouselTrack.querySelectorAll('.carousel-img-container');
  carouselContainers.forEach(container => {
    const clone = container.cloneNode(true);
    // Make sure the clones also have click handlers
    const cloneImg = clone.querySelector('img');
    clone.addEventListener('click', () => {
      enlargeImage(cloneImg.src);
    });
    carouselTrack.appendChild(clone);
  });

  // Create modal for enlarged images if it doesn't exist
  if (!document.getElementById('image-modal')) {
    createImageModal();
  }

  // Set up animation variables
  let animationId;
  let speed = 1; // pixels per frame
  let position = 0;
  let isPaused = false;
  let isPageVisible = true;
  let isTouchDevice = false;

  // Detect touch devices
  window.addEventListener('touchstart', function() {
    isTouchDevice = true;
  }, {once: true});

  // Handle visibility changes
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    if (isPageVisible && !isPaused) {
      animate();
    } else {
      cancelAnimationFrame(animationId);
    }
  });

  // Handle hover events - only on non-touch devices
  carouselTrack.addEventListener('mouseenter', () => {
    if (!isTouchDevice) {
      isPaused = true;
      cancelAnimationFrame(animationId);
    }
  });

  carouselTrack.addEventListener('mouseleave', () => {
    if (isPageVisible && !isTouchDevice) {
      isPaused = false;
      animate();
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    // Reset position on resize to prevent jumps
    position = 0;
    carouselTrack.style.transform = `translateX(0px)`;
  });

  // Animation function
  function animate() {
    if (isPaused || !isPageVisible) return;

    const firstContainer = carouselTrack.querySelector('.carousel-img-container');
    const containerWidth = firstContainer.offsetWidth + 20; // including gap/margin
    
    position -= speed;
    
    // When we've scrolled all original images, reset to start
    if (position < -containerWidth * unusedImages.length) {
      position = 0;
    }

    carouselTrack.style.transform = `translateX(${position}px)`;
    animationId = requestAnimationFrame(animate);
  }

  // Function to create the image modal
  function createImageModal() {
    const modal = document.createElement('div');
    modal.id = 'image-modal';
    modal.className = 'image-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const enlargedImg = document.createElement('img');
    enlargedImg.className = 'enlarged-img';
    enlargedImg.id = 'enlarged-img';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-modal';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = closeModal;
    
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(enlargedImg);
    modal.appendChild(modalContent);
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeModal();
      }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    });
    
    document.body.appendChild(modal);
  }

  // Function to enlarge image
  function enlargeImage(src) {
    const modal = document.getElementById('image-modal');
    const enlargedImg = document.getElementById('enlarged-img');
    
    // Set image source
    enlargedImg.src = src;
    
    // Show modal with fade-in effect
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.style.opacity = 1;
    }, 10);
    
    // Pause carousel animation
    isPaused = true;
    cancelAnimationFrame(animationId);
  }

  // Function to close modal
  function closeModal() {
    const modal = document.getElementById('image-modal');
    modal.style.opacity = 0;
    
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
    
    // Resume carousel animation if not hovering (and not on touch device)
    const isHovering = document.querySelector('.carousel-track:hover');
    if ((!isHovering || isTouchDevice) && isPageVisible) {
      isPaused = false;
      animate();
    }
  }

  // Start animation
  animate();

  // Cleanup function to avoid memory leaks
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationId);
  });
}