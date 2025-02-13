// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyChgIplaH3unUvrugbHwjSNGxbEaNuj27k",
  authDomain: "jobtracker-5caf6.firebaseapp.com",
  databaseURL: "https://jobtracker-5caf6-default-rtdb.firebaseio.com",
  projectId: "jobtracker-5caf6",
  storageBucket: "jobtracker-5caf6.appspot.com",
  messagingSenderId: "73553516904",
  appId: "1:73553516904:web:cdce46b98cdd52a9a15edd"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
const database = firebase.database();
console.log("Firebase initialized:", firebase.apps.length > 0); // Debugging Firebase connection

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('jobForm');
  const jobList = document.getElementById('jobs');

  // Load jobs from Firebase on page load
  loadJobs();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const jobLink = document.getElementById('jobLink').value;
    const whatsappMessage = document.getElementById('whatsappMessage').value;

    if (jobLink) {
      console.log('Adding job:', jobLink, whatsappMessage); // Debug
      const preview = await fetchLinkPreview(jobLink);
      console.log('Link preview:', preview); // Debug
      addJob(jobLink, whatsappMessage, preview);
      form.reset();
    }
  });

  async function fetchLinkPreview(url) {
    try {
      const response = await fetch(`https://api.linkpreview.net/?key=d694a6a99e7adc5d9443a4865047de49&q=${url}`);
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
      appliedbyRKP: false,
      appliedbyRKS: false
    };

    console.log('Saving job to Firebase:', job); // Debug

    // Save to Firebase
    const newJobRef = database.ref('jobs').push();
    newJobRef.set(job)
      .then(() => console.log('Job saved successfully!'))
      .catch((error) => console.error('Error saving job:', error));
  }

  function displayJob(job, jobId) {
    console.log('Displaying job:', job); // Debug

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

    const appliedbyRKP = document.createElement('input');
    appliedbyRKP.type = 'checkbox';
    appliedbyRKP.checked = job.appliedbyRKP;
    appliedbyRKP.addEventListener('change', () => {
      database.ref(`jobs/${jobId}`).update({ appliedbyRKP: appliedbyRKP.checked });
    });

    const appliedbyRKS = document.createElement('input');
    appliedbyRKS.type = 'checkbox';
    appliedbyRKS.checked = job.appliedbyRKS;
    appliedbyRKS.addEventListener('change', () => {
      database.ref(`jobs/${jobId}`).update({ appliedbyRKS: appliedbyRKS.checked });
    });

    checkboxes.appendChild(document.createTextNode('Applied by RKP: '));
    checkboxes.appendChild(appliedbyRKP);
    checkboxes.appendChild(document.createTextNode(' Applied by RKS: '));
    checkboxes.appendChild(appliedbyRKS);

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
    console.log('Loading jobs from Firebase...'); // Debug
    database.ref('jobs').on('value', (snapshot) => {
      jobList.innerHTML = ''; // Clear the list
      const jobs = snapshot.val();
      if (jobs) {
        console.log('Jobs found:', jobs); // Debug
        Object.keys(jobs).forEach((jobId) => {
          displayJob(jobs[jobId], jobId);
        });
      } else {
        console.log('No jobs found.'); // Debug
      }
    });
  }
});
