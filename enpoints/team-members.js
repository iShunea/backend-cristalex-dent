const express = require('express');
const router = express.Router();
const multer = require('multer');
const TeamMember = require('../schemas/team-member');
const { uploadToR2 } = require('../handleImage');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/team-members', async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ orderIndex: 1 });
    res.status(200).json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving team members', error: error.message });
  }
});

router.get('/team-members/:id', async (req, res) => {
  try {
    const paramId = req.params.id;
    let teamMember;

    // Check if it's a MongoDB ObjectId or numeric id
    if (paramId.match(/^[0-9a-fA-F]{24}$/)) {
      teamMember = await TeamMember.findById(paramId);
    } else {
      teamMember = await TeamMember.findOne({ id: parseInt(paramId) });
    }

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.status(200).json(teamMember);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving team member', error: error.message });
  }
});

router.post('/team-members', upload.single('image'), async (req, res) => {
  try {
    const teamMemberData = { ...req.body };
    if (req.file) {
      teamMemberData.imageUrl = await uploadToR2(req.file, 'team-members');
    }
    const newTeamMember = new TeamMember(teamMemberData);
    await newTeamMember.save();
    res.status(201).json({ message: 'Team member created successfully', teamMember: newTeamMember });
  } catch (error) {
    res.status(500).json({ message: 'Error creating team member', error: error.message });
  }
});

router.put('/team-members/:id', upload.single('image'), async (req, res) => {
  try {
    const paramId = req.params.id;
    const teamMemberData = { ...req.body };
    if (req.file) {
      teamMemberData.imageUrl = await uploadToR2(req.file, 'team-members');
    }

    let updatedTeamMember;
    if (paramId.match(/^[0-9a-fA-F]{24}$/)) {
      updatedTeamMember = await TeamMember.findByIdAndUpdate(paramId, teamMemberData, { new: true });
    } else {
      updatedTeamMember = await TeamMember.findOneAndUpdate(
        { id: parseInt(paramId) },
        teamMemberData,
        { new: true }
      );
    }

    if (!updatedTeamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.status(200).json({ message: 'Team member updated successfully', teamMember: updatedTeamMember });
  } catch (error) {
    res.status(500).json({ message: 'Error updating team member', error: error.message });
  }
});

router.delete('/team-members/:id', async (req, res) => {
  try {
    const paramId = req.params.id;
    let deletedTeamMember;

    if (paramId.match(/^[0-9a-fA-F]{24}$/)) {
      deletedTeamMember = await TeamMember.findByIdAndDelete(paramId);
    } else {
      deletedTeamMember = await TeamMember.findOneAndDelete({ id: parseInt(paramId) });
    }

    if (!deletedTeamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.status(200).json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team member', error: error.message });
  }
});

module.exports = router;
