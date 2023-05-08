import { useState } from "react";

function Home() {
  const [playerName, setPlayerName] = useState("");
  const [points, setPoints] = useState("");
  const [rebounds, setRebounds] = useState("");
  const [pointProb, setPointProb] = useState(null);
  const [reboundProb, setReboundProb] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // This fetch request sends a GET request to the /api endpoint with the playerName, points, and rebounds as query parameters.
    const res = await fetch(`/api?playerName=${playerName}&points=${points}`);

    // The response from the /api endpoint is a JSON object containing pointProb and reboundProb.
    const data = await res.json();

    // We update the state in our Home component with the pointProb and reboundProb from the response.
    setPointProb(data.pointProb);
    // setReboundProb(data.reboundProb);
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
        {/* <input
          type="number"
          placeholder="Rebounds"
          value={rebounds}
          onChange={(e) => setRebounds(e.target.value)}
        /> */}
        <button type="submit">Submit</button>
      </form>
      {pointProb !== null && <p>Point Probability: {pointProb}</p>}
      {/* {reboundProb !== null && <p>Rebound Probability: {reboundProb}</p>} */}
    </div>
  );
}

export default Home