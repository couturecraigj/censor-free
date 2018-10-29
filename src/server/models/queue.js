import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * TODO: Make it so that these messages can be sent down through GraphQL subscriptions
 */

const Queue = new Schema(
  {
    job: { type: String },
    args: [Schema.Types.Mixed],
    model: { type: String },
    result: { type: String },
    finished: { type: Boolean, default: false },
    error: { type: String },
    processing: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

Queue.statics.newJob = async function(args) {
  const { Queue } = mongoose.models;

  await Queue.create(args);
  Queue.processJobs();
};
Queue.statics.processJobs = async function() {
  const { Queue } = mongoose.models;

  if (await Queue.findOne({ processing: true })) return;

  const job = await Queue.findOne({ finished: false, processing: false });

  if (!job) return;

  job.processing = true;
  await Promise.all([
    job.save(),
    mongoose.models[job.model][job.job](...job.args)
  ]);
  job.processing = false;
  job.finished = true;
  await job.save();
  Queue.processJobs();
};

if (mongoose.models && mongoose.models.Queue) delete mongoose.models.Queue;

export default mongoose.model('Queue', Queue);
