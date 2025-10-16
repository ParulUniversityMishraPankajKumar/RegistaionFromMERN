const Counter = require('../models/counter');
const generateCustomId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { id: 'employeeId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `BWEB${counter.seq.toString().padStart(4, '0')}`;
};

module.exports = generateCustomId;
