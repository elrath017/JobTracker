import React, { useState, useEffect } from 'react';
import { database } from '../firebase';

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const jobsRef = database.ref('jobs');
    jobsRef.on('value', (snapshot) => {
      const jobsData = snapshot.val();
      const jobsList = [];
      for (let id in jobsData) {
        jobsList.push({ id, ...jobsData[id] });
      }
      setJobs(jobsList.reverse());
    });

    return () => {
      jobsRef.off();
    };
  }, []);

  const handleDelete = (id) => {
    database.ref(`jobs/${id}`).remove();
  };

  return (
    <div className="container">
      <h1>All Jobs</h1>
      <div id="jobList">
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <div className="job-details">
                <h3>{job.title}</h3>
                <p>{job.company}</p>
                <a href={job.link} target="_blank" rel="noopener noreferrer">
                  View Job
                </a>
                <p>{job.description}</p>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(job.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllJobs;
