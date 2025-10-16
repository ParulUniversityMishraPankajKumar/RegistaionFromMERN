
const Counter = require('../models/counter');

const generateCustomId = async () => {
  // Find counter for employees and increment it
  const counter = await Counter.findOneAndUpdate(
    { id: 'employeeId' },       // counter identifier
    { $inc: { seq: 1 } },       // increment seq by 1
    { new: true, upsert: true } // create if it doesn't exist
  );

  // Return formatted ID like .
  return `BWEB${counter.seq.toString().padStart(3, '0')}`;
};

module.exports = generateCustomId;
