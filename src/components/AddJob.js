import React, { useState } from 'react';
import { database } from '../firebase';
import { useNavigate } from 'react-router-dom';

const AddJob = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newJobRef = database.ref('jobs').push();
    newJobRef.set({
      title,
      company,
      link,
      description,
      createdAt: Date.now(),
    });
    navigate('/all');
  };

  return (
    <div className="container">
      <h1>Add a New Job</h1>
      <form id="addJobForm" onSubmit={handleSubmit}>
        <label htmlFor="jobTitle">Job Title:</label>
        <input
          type="text"
          id="jobTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="company">Company:</label>
        <input
          type="text"
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />

        <label htmlFor="jobLink">Job Posting Link:</label>
        <input
          type="text"
          id="jobLink"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />

        <label htmlFor="jobDescription">Job Description/Details:</label>
        <textarea
          id="jobDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button type="submit">Add Job</button>
      </form>
    </div>
  );
};

export default AddJob;
