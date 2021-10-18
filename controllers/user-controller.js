// modeled after module 18 of the U of U bootcamp
const { User } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No user found with this id. Try again, you blubbering idiot, and get it right this time" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(err);
            });
    },

    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true }
            )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No user found with this id. Maybe you're just not cut out for this" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(err);
            });
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true }
            )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No user found with this id, please try to do better with your life, your mother would be so disappointed" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No user found with this id, perhaps deep down you don't actually want to delete anything at all? Best to sleep on it and decide in the morning" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    removeFriend({ params}, res) {
        User.findOneAndDelete(
            { _id: params.uderId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user found with this id. I suspect it's because you  don't actually have any friends that could be removed in the first place..." });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    }
}

module.exports = userController;