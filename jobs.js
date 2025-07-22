// Functions for job management

function addJob(title, company, link, description) {
  const newJobRef = database.ref('jobs').push();
  newJobRef.set({
    title: title,
    company: company,
    link: link,
    description: description,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  })
  .then(() => {
    console.log('Job added successfully!');
    window.location.href = 'all-jobs.html';
  })
  .catch((error) => {
    console.error('Error adding job:', error);
  });
}

function loadJobs(callback) {
  database.ref('jobs').orderByChild('createdAt').on('value', (snapshot) => {
    const jobs = [];
    snapshot.forEach((childSnapshot) => {
      jobs.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    callback(jobs.reverse()); // Newest first
  });
}

function deleteJob(jobId) {
  database.ref(`jobs/${jobId}`).remove()
    .then(() => console.log('Job deleted successfully!'))
    .catch((error) => console.error('Error deleting job:', error));
}
