const Counter = require('./counter');


const counter = await Counter.findOneAndUpdate(
  { id: 'bwebId' },
  { $inc: { seq: 1 } },
  { new: true, upsert: true }
);
this.customId = `Bweb${counter.seq.toString().padStart(3, '0')}`;
