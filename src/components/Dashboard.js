import React, { useState, useEffect } from 'react';
import { database } from '../firebase';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const jobsRef = database.ref('jobs').orderByChild('createdAt').limitToLast(5);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % jobs.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [jobs]);

  return (
    <div className="container">
      <h1>Latest Jobs</h1>
      <div className="slider-banner">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {jobs.map((job) => (
            <div className="slide" key={job.id}>
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <a href={job.link} target="_blank" rel="noopener noreferrer">
                View Job
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
