// Add Firebase SDK to your HTML (before script.js)
<script src="https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js"></script>

// Initialize Firebase (replace with your config)
const firebaseConfig = {
  apiKey: "AIzaSyChgIplaH3unUvrugbHwjSNGxbEaNuj27k",
  authDomain: "jobtracker-5caf6.firebaseapp.com",
  databaseURL: "https://jobtracker-5caf6-default-rtdb.firebaseio.com",
  projectId: "jobtracker-5caf6",
  storageBucket: "jobtracker-5caf6.firebasestorage.app",
  messagingSenderId: "73553516904",
  appId: "1:73553516904:web:cdce46b98cdd52a9a15edd"
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('jobForm');
  const jobList = document.getElementById('jobs');

  // Load jobs from Firebase
  loadJobs();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const jobLink = document.getElementById('jobLink').value;
    const whatsappMessage = document.getElementById('whatsappMessage').value;

    if (jobLink) {
      const preview = await fetchLinkPreview(jobLink);
      addJob(jobLink, whatsappMessage, preview);
      form.reset();
    }
  });

  async function fetchLinkPreview(url) {
    try {
      const response = await fetch(`https://api.linkpreview.net/?key=YOUR_API_KEY&q=${url}`);
      const data = await response.json();
      return {
        title: data.title,
        description: data.description,
        image: data.image
      };
    } catch (error) {
      console.error('Error fetching link preview:', error);
      return null;
    }
  }

  function addJob(link, message, preview) {
    const job = {
      link,
      message,
      preview,
      appliedByMe: false,
      appliedByFriend: false
    };

    // Save to Firebase
    const newJobRef = database.ref('jobs').push();
    newJobRef.set(job);
  }

  function displayJob(job, jobId) {
    const li = document.createElement('li');
    li.id = jobId;

    const jobInfo = document.createElement('div');
    jobInfo.innerHTML = `<strong>Link:</strong> <a href="${job.link}" target="_blank">${job.link}</a><br>
                         <strong>Message:</strong> ${job.message}`;

    if (job.preview) {
      const previewDiv = document.createElement('div');
      previewDiv.className = 'preview';
      previewDiv.innerHTML = `<strong>Preview:</strong><br>
                              <strong>Title:</strong> ${job.preview.title}<br>
                              <strong>Description:</strong> ${job.preview.description}`;
      jobInfo.appendChild(previewDiv);
    }

    const checkboxes = document.createElement('div');
    checkboxes.className = 'checkboxes';

    const appliedByMe = document.createElement('input');
    appliedByMe.type = 'checkbox';
    appliedByMe.checked = job.appliedByMe;
    appliedByMe.addEventListener('change', () => {
      database.ref(`jobs/${jobId}`).update({ appliedByMe: appliedByMe.checked });
    });

    const appliedByFriend = document.createElement('input');
    appliedByFriend.type = 'checkbox';
    appliedByFriend.checked = job.appliedByFriend;
    appliedByFriend.addEventListener('change', () => {
      database.ref(`jobs/${jobId}`).update({ appliedByFriend: appliedByFriend.checked });
    });

    checkboxes.appendChild(document.createTextNode('Applied by Me: '));
    checkboxes.appendChild(appliedByMe);
    checkboxes.appendChild(document.createTextNode(' Applied by Friend: '));
    checkboxes.appendChild(appliedByFriend);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      database.ref(`jobs/${jobId}`).remove();
    });

    li.appendChild(jobInfo);
    li.appendChild(checkboxes);
    li.appendChild(deleteBtn);
    jobList.appendChild(li);
  }

  function loadJobs() {
    database.ref('jobs').on('value', (snapshot) => {
      jobList.innerHTML = ''; // Clear the list
      const jobs = snapshot.val();
      if (jobs) {
        Object.keys(jobs).forEach((jobId) => {
          displayJob(jobs[jobId], jobId);
        });
      }
    });
  }
});