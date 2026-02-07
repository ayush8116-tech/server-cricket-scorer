const updateOverCount = (overCount, ballCount) => {
  if (ballCount === undefined) {
    return { overCount, ballCount: 1 };
  }

  if (ballCount >= 5) {
    return { overCount: +overCount + 1, ballCount: 0 };
  }

  return { overCount: +overCount, ballCount: +ballCount + 1 };
};

const summariseOverDetails = (overDetails) => {
  return +`${overDetails.overCount}.${overDetails.ballCount}`;
};

const updateBalls = (over) => {
  const [overCount, ballCount] = String(over).split(".");
  const overDetails = updateOverCount(overCount, ballCount);
  return summariseOverDetails(overDetails);
};

const startOver = (overCount, innings) => {
  const inningCount = innings.summary.inning;
  innings[inningCount].push({ over: overCount, deliveries: [] });
};

const startInning = (innings, inningNumber) => {
  const matchData = { ...innings };
  const inning = [];
  matchData[inningNumber] = inning;
  return matchData;
};

const writeToJson = (path, content) =>
  Deno.writeTextFileSync(path, JSON.stringify(content));

const readFromJson = (path) => {
  const data = Deno.readTextFileSync(path);
  return JSON.parse(data);
};

export const startMatch = () => {
  const summary = { over: 0, total: 0, inning: 0, target: 0 };
  const innings = startInning({}, 0);
  innings.summary = summary;
  startOver(0, innings);
  writeToJson("./data/match.json", innings);
  return innings.summary;
};

const hasOverEnd = (over) => over > 0 && over === Math.floor(over);

const addData = (delivery, matchData) => {
  const { inning, over } = matchData.summary;
  matchData[inning][Math.floor(over)].deliveries.push(delivery);
  matchData.summary.total += delivery.run;
  const overCount = updateBalls(over);
  matchData.summary["over"] = overCount;

  return matchData;
};

const addDelivery = (run, innings) => {
  const matchData = { ...innings };

  const { over } = matchData.summary;
  const delivery = { run };
  if (hasOverEnd(over)) {
    startOver(over, matchData);
  }
  const updatedData = addData(delivery, matchData);
  return updatedData;
};

export const processDeliveries = (run) => {
  const matchData = readFromJson("./data/match.json");
  const updatedData = addDelivery(run, matchData);
  writeToJson("./data/match.json", updatedData);
  return updatedData.summary;
};

startMatch();
