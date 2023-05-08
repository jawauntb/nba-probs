import axios from "axios";

export default async function handler(req, res) {
  const { playerName, points, rebounds } = req.query;

  const encodedCredentials = Buffer.from("6b43c070-8ee5-43f3-add5-b5cdbe:MYSPORTSFEEDS").toString("base64");
  const url = `https://api.mysportsfeeds.com/v2.1/pull/nba/2021-2022-regular/player_stats_totals.json?player=${encodeURIComponent(playerName.replace(" ", "-").toLowerCase())}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Authorization": `Basic ${encodedCredentials}`,
      },
    });

    const data = response.data;

    const player = data.players[0].player;
    const playerStats = data.players[0].stats;

    const pointProb = calculatePointProbability(playerStats.pts, points);
    const reboundProb = calculateReboundProbability(playerStats.reb, rebounds);

    res.status(200).json({ pointProb, reboundProb });
  } catch (error) {
    res.status(500).json({ message: "Error fetching player data." });
  }
}

function calculatePointProbability(points, targetPoints) {
  const mean = points.total / points.gamesPlayed;
  const variance = points.total * (1 - mean / points.total);
  const stddev = Math.sqrt(variance);

  return gaussianProbability(targetPoints, mean, stddev);
}

function calculateReboundProbability(rebounds, targetRebounds) {
  const mean = rebounds.total / rebounds.gamesPlayed;
  const variance = rebounds.total * (1 - mean / rebounds.total);
  const stddev = Math.sqrt(variance);

  return gaussianProbability(targetRebounds, mean, stddev);
}

function gaussianProbability(x, mean, stddev) {
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stddev, 2));
  const probability = (1 / (stddev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
  return probability;
}