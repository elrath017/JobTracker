document.addEventListener('DOMContentLoaded', () => {
  // Load Navbar
  fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar-container').innerHTML = data;
      // Set active link
      const currentPage = window.location.pathname.split('/').pop();
      const navLinks = document.querySelectorAll('nav a');
      navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
          link.classList.add('active');
        }
      });
    });

  const path = window.location.pathname;

  if (path.includes('dashboard.html')) {
    loadJobs(jobs => {
      const latestJobs = jobs.slice(0, 5);
      const slider = document.getElementById('job-slider');
      slider.innerHTML = '';
      latestJobs.forEach(job => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `
          <h3>${job.title}</h3>
          <p>${job.company}</p>
          <a href="${job.link}" target="_blank">View Job</a>
        `;
        slider.appendChild(slide);
      });

      // Simple slider logic
      let currentIndex = 0;
      const slides = document.querySelectorAll('.slide');
      const slideWidth = slides[0].clientWidth;

      setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      }, 6000);
    });
  }

  if (path.includes('add-job.html')) {
    const form = document.getElementById('addJobForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('jobTitle').value;
      const company = document.getElementById('company').value;
      const link = document.getElementById('jobLink').value;
      const description = document.getElementById('jobDescription').value;
      addJob(title, company, link, description);
    });
  }

  if (path.includes('all-jobs.html')) {
    const jobList = document.getElementById('jobs');
    loadJobs(jobs => {
      jobList.innerHTML = '';
      jobs.forEach(job => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="job-details">
            <h3>${job.title}</h3>
            <p>${job.company}</p>
            <a href="${job.link}" target="_blank">View Job</a>
            <p>${job.description}</p>
          </div>
          <button class="delete-btn" onclick="deleteJob('${job.id}')">Delete</button>
        `;
        jobList.appendChild(li);
      });
    });
  }
});
