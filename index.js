const express = require("express");
const cors = require('cors');
const { QuickDB } = require("quick.db");
const db = new QuickDB(); // will make a json.sqlite in the root folder
const PORT = process.env.PORT || 7145;

const app = express();

app.use(cors({
  origin: '*',
}));

app.get("/", async (req, res) => {
  res.send("🎈🎈🎈")
});


app.get("/shapes/:busID", async (req, res) => {
  const busID = req.params.busID;
  const maslol = await db.get(busID);
  //if maslol does not exist
  if (maslol === null) {
    let routeAddition = "";
    let response;

    // Try all combinations of route additions
    extraadds = [0,1,2,3,4,5,6,7,8,9,"א","ב","ג","ד","ה","ו","ז","ח","#"]
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < extraadds.length; j++) {
        routeAddition = `${i}-${extraadds[j]}`;
        console.log(routeAddition)
        response = await fetch(
          `https://www.markav.net/shapes/?q=${busID}-${routeAddition}`
        );
        //
        var responseText = await response.text();
        //console.log(responseText)
        if (response.ok) {
          // Found a valid route addition, save it to the database
          await db.set(busID, responseText);
          res.status(200).send(responseText);
          console.log("OK");
          j = 9999;
          i = 9999;
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

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});
