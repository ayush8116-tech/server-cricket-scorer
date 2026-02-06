const updateOverCount = (overCount, ballCount) => {
  if (ballCount === undefined) {
    return { overCount, ballCount: 1 };
  }

  if(ballCount > 5) {
    return {overCount : +overCount + 1, ballCount : 0}
  }
  
  return { overCount: +overCount, ballCount : +ballCount + 1 };
}

const summariseOverDetails = (overDetails) => {
  return +`${overDetails.overCount}.${overDetails.ballCount}`
}

const updateBalls = (over) => {
  const [overCount, ballCount] = String(over).split(".");
  const overDetails = updateOverCount(overCount, ballCount);
  return summariseOverDetails(overDetails)
};

export const generateDelivery = (delivery) => {
  return {
    over: updateBalls(delivery.over),
    score: delivery.score,
    total: delivery.total + delivery.score,
  };
};
