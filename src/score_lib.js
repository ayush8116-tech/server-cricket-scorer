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

export const generateDelivery = (delivery) => {
  return {
    over: updateBalls(delivery.over),
    score: delivery.score,
    total: delivery.total + delivery.score,
  };
};

const startOver = (overCount, innings) => {
  const inningCount = innings.summary.inning
  innings[inningCount].push({ over: overCount, deliveries: [] })
};

const startInning = (innings, inningNumber) => {
  const matchData = { ...innings };
  const inning = [];
  matchData[inningNumber] = inning;
  return matchData;
};

const startMatch = () => {
  const summary = { over: 0, total: 0,inning : 0, target: 0 };
  const innings = startInning({}, 0);
  innings.summary = summary;
  startOver(0, innings);
  return innings;
};

const match = startMatch();

Deno.writeTextFileSync("./data/match.json", JSON.stringify(match));
