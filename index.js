const express = require("express");
const cors = require('cors');
const { QuickDB } = require("quick.db");
const db = new QuickDB(); // will make a json.sqlite in the root folder

const app = express();

app.use(cors({
  origin: '*',
}));

app.get("/shapes/:busID", async (req, res) => {
  const busID = req.params.busID;
  const maslol = await db.get(busID);
  //if maslol does not exist
  if (maslol === null) {
    let routeAddition = "";
    let response;

    // Try all combinations of route additions
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        routeAddition = `${i}-${j}`;
        response = await fetch(
          `https://www.markav.net/shapes/?q=${busID}-${routeAddition}`
        );
        //
        const responseText = await response.text();
        console.log(responseText)
        if (response.ok) {
          // Found a valid route addition, save it to the database
          res.send(responseText);
          await db.set(busID, responseText);
          break;
        }
      }
    }

    if (!response.ok) { 
        res.status(500).send("Route not found"); // Send 404 Not Found if no valid route addition is found
    }
  } else {
    res.send(maslol);
  }
});


app.get("/map/:z/:x/:y", async (req, res) => {
    let response;
  
          response = await fetch(
            `https://api.maptiler.com/maps/streets-v2/256/{${req.params.z}}/{${req.params.x}}/{${req.params.y}}.png?key=7X6SbnAx8zQNFBXNUCwe`
          );
          //
          const responseText = await response.text();
          console.log(responseText)
          if (response.ok) {
            // Found a valid route addition, save it to the database
            res.send(responseText);
            await db.set(busID, responseText);
          }
  
      if (!response.ok) { 
          res.status(500).send("Tile not found"); // Send 404 Not Found if no valid route addition is found
      }

  });


app.listen(7145);