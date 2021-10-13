// modeled after module 18 of the U of U bootcamp, hence the lingering pizzas everywhere
const { Thought } = require('../models');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
    .populate({
      path: 'user',
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
    Thought.findOne({ _id: param.id })
    .populate({
      path: 'user',
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
      return Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { thoughts: _id } },
        { new: true }
      );
    })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  },

  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { replies: body } },
      { new: true, runValidators: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  },

  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => res.json(err));
  },

  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(deletedThought => {
        if (!deletedThought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        return Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  }
};

module.exports = thoughtController;