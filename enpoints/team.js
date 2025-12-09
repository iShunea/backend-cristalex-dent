const express = require('express');
const router = express.Router();
const { uploadTeam, updateObjectWithUploadedFiles } = require('../handleImage');
const Team = require('../schemas/team');
const path = '/images/team/';

// POST route for team
router.post('/team', uploadTeam.any(), async (req, res) => {
  try {
    const teamData = { ...req.body };

    // Iterate over req.files to assign the correct paths to teamData
    updateObjectWithUploadedFiles(req, teamData, path);

    const newTeam = new Team(teamData);
    await newTeam.save();

    res.status(201).json({ message: 'Team member created successfully', team: newTeam });
  } catch (error) {
    res.status(500).json({ message: 'Error saving team member', error });
    console.error('Error:', error);
  }
});

// GET route to retrieve all jobs
router.get('/team', async (req, res) => {
    try {
      const team = await Team.find();
      res.status(200).json(team);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving team', error });
      console.error("Error: ", error);
    }
  }
);
  
// GET route to retrieve all team for team page
router.get('/admin/team/list', async (req, res) => {
  try {
      // Use projection to only retrieve 'id' and 'jobTitle' fields
      const team = await Team.find({}, 'id fullName');

      // Use .map() to efficiently transform the result
      const returnTeam = team.map(({ id, fullName }) => ({
          id,
          fullName,
      }));

      res.status(200).json(returnTeam);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving team', error });
      console.error("Error: ", error);
  }
});

// GET route to retrieve a single team by ID
router.get('/admin/edit/team/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const team = await Team.findOne({ id: id });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving the team', error });
    console.error("Error: ", error);
  }
}
);

// PUT route to update an team
router.put('/admin/edit/team/:id', uploadTeam.any(), async (req, res) => {
  const { id } = req.params;

  try {
    const blogData = { ...req.body };

    updateObjectWithUploadedFiles(req, blogData, path);
    
    const updatedService = await Team.findOneAndUpdate({ id: id }, blogData, { new: true });

    if (!updatedService) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json({ message: 'Team updated successfully', team: updatedService });
  } catch (error) {
    res.status(500).json({ message: 'Error updating team', error });
    console.error('Error:', error);
  }
});

module.exports = router;