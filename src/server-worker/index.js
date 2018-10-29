import '../server/models/file';
import '../server/models/video';
import '../server/models/photo';
import '../server/models/queue';

// const fs = require('fs');
const path = require('path');

require('dotenv').config({
  path: path.join(
    process.cwd(),
    `.env.${process.env.NODE_ENV || 'development'}`
  )
});

const schedule = require('node-schedule');

const APP = {
  modelsPath: 'src/server/models',
  cancelJob: () => {
    // eslint-disable-next-line no-console
    console.log('CANCELLING JOBS');
    APP.job.cancel();
    APP.db.disconnect();
  },
  scheduleJob() {
    const rule = '* * * * *';

    this.Queue = APP.db.models.Queue;

    // Kick off the job
    this.job = schedule.scheduleJob(rule, async () => {
      try {
        const job = await APP.Queue.findOne({
          finished: false,
          processing: false,
          error: { $exists: false }
        });

        if (!job) APP.cancelJob();

        job.processing = true;
        await job.save();

        try {
          const result = await APP.db.models[job.model][job.job](...job.args);

          job.processing = false;
          job.finished = true;
          job.result = JSON.stringify(result);
          await job.save();
          await this.job.job();
          this.job.reschedule(rule);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
          job.error = `${e.message || e.description}
          
          ${e.stack}`;
          job.processing = false;
          await job.save();
          this.job.reschedule(rule);
        }
      } catch (error) {
        this.job.cancel();
      }
    });
    this.job.job();
  },

  async init() {
    const DataBase = require('../server/database').default;

    // await APP.getAllModels();
    APP.db = await DataBase.get();

    try {
      APP.scheduleJob();
    } catch (error) {
      //
    }
  }
  // async getAllModels() {
  //   const dirPath = path.join(process.cwd(), APP.modelsPath);
  //   for (const file of fs.readdirSync(dirPath)) {
  //     try {
  //       // eslint-disable-next-line import/no-dynamic-require
  //       if (/\.js/.test(file)) await import(path.join(APP.modelsPath, file));
  //     } catch (e) {
  //       // console.log(e);
  //     }
  //   }
  // }
};

(function() {
  APP.init();
})();
