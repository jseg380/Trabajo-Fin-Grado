import Household from '../models/Household.js';
import User from '../models/User.js';

// @desc    Get the current user's household details
// @route   GET /api/households/my-household
export const getMyHousehold = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate({
      path: 'household',
      populate: {
        path: 'members',
        select: 'name avatar avatarUrl', // Select fields to return for members
      },
    });

    if (!user || !user.household) {
      return res.status(404).json({ error: 'Household not found.' });
    }
    res.json(user.household);
  } catch (error) {
    res.status(500).json({ error: 'Server Error: ' + error.message });
  }
};

// @desc    Join an existing household
// @route   POST /api/households/join
export const joinHousehold = async (req, res) => {
  const { joinCode } = req.body;
  if (!joinCode) {
    return res.status(400).json({ error: 'Join code is required.' });
  }

  try {
    // 1. Find the target household and the current user
    const targetHousehold = await Household.findOne({ joinCode });
    if (!targetHousehold) {
      return res.status(404).json({ error: 'Household with this code not found.' });
    }

    const user = await User.findById(req.user);
    const oldHouseholdId = user.household;

    // If already in the target household, do nothing.
    if (oldHouseholdId.toString() === targetHousehold._id.toString()) {
      return res.status(200).json(targetHousehold);
    }

    // 2. Add user to the new household and update user's reference
    targetHousehold.members.addToSet(user._id); // addToSet prevents duplicates
    user.household = targetHousehold._id;

    // 3. Remove user from the old household
    const oldHousehold = await Household.findById(oldHouseholdId);
    if (oldHousehold) {
      oldHousehold.members.pull(user._id); // pull removes the item

      // 4. If the old household is now empty, delete it
      if (oldHousehold.members.length === 0) {
        await oldHousehold.deleteOne();
      } else {
        await oldHousehold.save();
      }
    }

    // 5. Save all changes
    await Promise.all([user.save(), targetHousehold.save()]);

    // Populate the response to match getMyHousehold
    await targetHousehold.populate('members', 'name avatarUrl');
    res.status(200).json(targetHousehold);
  } catch (error) {
    res.status(500).json({ error: 'Server Error: ' + error.message });
  }
};

// @desc    Leave the current household and create a new one
// @route   POST /api/households/leave
export const leaveHousehold = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('name household');
    const oldHouseholdId = user.household;

    // Find the old household
    const oldHousehold = await Household.findById(oldHouseholdId);

    // If the user is the last member, no need to do anything complex.
    // They are effectively already in their own household.
    if (oldHousehold && oldHousehold.members.length === 1) {
      return res.status(400).json({ error: "You can't leave a household you are the only member of." });
    }

    // 1. Create a new personal household for the user
    const newHousehold = await Household.create({
      name: `${user.name}'s Household`,
      owner: user._id,
      members: [user._id],
    });

    // 2. Update user's household reference
    user.household = newHousehold._id;
    await user.save();

    // 3. Remove user from the old household
    if (oldHousehold) {
      oldHousehold.members.pull(user._id);
      await oldHousehold.save();
    }

    // Populate the response to match getMyHousehold
    await newHousehold.populate('members', 'name avatarUrl');
    res.status(200).json(newHousehold);
  } catch (error) {
    res.status(500).json({ error: 'Server Error: ' + error.message });
  }
};
