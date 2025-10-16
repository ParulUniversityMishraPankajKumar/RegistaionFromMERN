const Counter = require('models/counter');

async function getNextId(prefix = 'EMP', counterId = 'employeeId') {
  const counter = await Counter.findOneAndUpdate(
    { id: counterId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `${prefix}${counter.seq.toString().padStart(3, '0')}`;
}

module.exports = getNextId;
