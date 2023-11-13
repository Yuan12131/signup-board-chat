import express from "express";
import fs from "fs";

const app = express();

const port = 8080;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", (req, res) => {
  const { name, password, email } = req.body;
  const timestamp = new Date().toLocaleTimeString();

  fs.readFile("./data/signUp.json", (err, data) => {
    if (err) {
      console.error("Error reading signUp.json:", err);
      res.status(500).send("Internal Server Error");
    } else {
      let formData = JSON.parse(data);

      if (!formData.inputRecords) {
        formData.inputRecords = [];
      }

      const newRecord = {
        name: name,
        password: password,
        email: email,
        timestamp: timestamp,
      };

      formData.inputRecords.push(newRecord);

      fs.writeFile(
        "./data/signUp.json",
        JSON.stringify(formData, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing signUp.json:", err);
            res.status(500).send("Internal Server Error");
          } else {
            res.json({
              status: "success",
              formData: { name, password, email },
            });
          }
        }
      );
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
