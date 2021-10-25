// modeled after module 18 of the U of U bootcamp
const { Thought, User } = require('../models');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
    .populate({
      path: 'User',
      strictPopulate: false,
      select: '-__v'
    })
    .select('-__v')
    .sort({ _id: -1 })
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err)
    })
  },

  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
    .populate({
      path: 'user',
      strictPopulate: false,
      select: '-__v'
    })
    .select('-__v')
    .sort({ _id: -1 })
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err)
    })
  },

  addThought({ params, body }, res) {
  Thought.create(body)
    .then(({ _id }) => {
      return User.findOneAndUpdate(
        { username: body.username },
        { $push: { thoughts: _id } },
        { new: true }
      );
    })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user exists with this username' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
  },

  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  },

  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => res.json(err));
  },

  updateThought({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      body,
      { new: true, runValidators: true }
    )
    .then(updatedThought => {
      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought found with this id' })
      }
      res.json(updatedThought);
    })
    .catch(err => res.json(err));
  },

  removeThought({ params, body }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then(deletedThought => {
        if (!deletedThought) {
          return res.status(404).json({ message: 'No thought with this id' });
        }
        res.json(deletedThought);
      })
      .catch(err => res.json(err));
  }
};

module.exports = thoughtController;