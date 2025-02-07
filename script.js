document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('jobForm');
  const jobList = document.getElementById('jobs');

  // Load saved jobs from localStorage
  loadJobs();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const jobLink = document.getElementById('jobLink').value;
    const whatsappMessage = document.getElementById('whatsappMessage').value;

    if (jobLink) {
      addJob(jobLink, whatsappMessage);
      form.reset();
    }
  });

  function addJob(link, message) {
    const job = {
      link,
      message,
      appliedByMe: false,
      appliedByFriend: false
    };

    // Save to localStorage
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    jobs.push(job);
    localStorage.setItem('jobs', JSON.stringify(jobs));

    // Display the job
    displayJob(job);
  }

  function displayJob(job) {
    const li = document.createElement('li');

    const jobInfo = document.createElement('div');
    jobInfo.innerHTML = `<strong>Link:</strong> <a href="${job.link}" target="_blank">${job.link}</a><br>
                         <strong>Message:</strong> ${job.message}`;

    const checkboxes = document.createElement('div');
    checkboxes.className = 'checkboxes';

    const appliedByMe = document.createElement('input');
    appliedByMe.type = 'checkbox';
    appliedByMe.checked = job.appliedByMe;
    appliedByMe.addEventListener('change', () => {
      job.appliedByMe = appliedByMe.checked;
      saveJobs();
    });

    const appliedByFriend = document.createElement('input');
    appliedByFriend.type = 'checkbox';
    appliedByFriend.checked = job.appliedByFriend;
    appliedByFriend.addEventListener('change', () => {
      job.appliedByFriend = appliedByFriend.checked;
      saveJobs();
    });

    checkboxes.appendChild(document.createTextNode('Applied by Me: '));
    checkboxes.appendChild(appliedByMe);
    checkboxes.appendChild(document.createTextNode(' Applied by Friend: '));
    checkboxes.appendChild(appliedByFriend);

    li.appendChild(jobInfo);
    li.appendChild(checkboxes);
    jobList.appendChild(li);
  }

  function loadJobs() {
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    jobs.forEach(job => displayJob(job));
  }

  function saveJobs() {
    const jobs = [];
    document.querySelectorAll('#jobs li').forEach(li => {
      const link = li.querySelector('a').href;
      const message = li.querySelector('div').textContent.split('Message: ')[1];
      const appliedByMe = li.querySelectorAll('input')[0].checked;
      const appliedByFriend = li.querySelectorAll('input')[1].checked;
      jobs.push({ link, message, appliedByMe, appliedByFriend });
    });
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }
});