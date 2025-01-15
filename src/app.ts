
import express from 'express';
import routes from './routes';
import dotenv from 'dotenv';

import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

dotenv.config();

const app = express();

const path = "./data.json";

const markCommit = (x:any, y:any) => {
  const date = moment()
    .subtract(1, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format();

  const data = {
    date: date,
  };

  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { "--date": date }).push();
  });
};

const makeCommits = (n:any) => {
  if(n===0) return simpleGit().push();
  const x = random.int(0, 54);
  const y = random.int(0, 6);
  const date = moment().subtract(1, "y").add(1, "d").add(x, "w").add(y, "d").format();

  const data = {
    date: date,
  };
  console.log(date);
  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { "--date": date },makeCommits.bind(this,--n));
  });
};

makeCommits(100);

app.use(express.json());
app.use('/public', express.static('public'));

app.use('/api', routes);


export default app;