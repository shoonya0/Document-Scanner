const creditManager = require("../utils/creditManager");
const db = require("../models/models");

// Scan a document (this is a placeholder for any additional scan logic)
exports.scanDocument = (req, res) => {
  const userId = req.session.user.id;
  const documentId = req.body.documentId;
  creditManager.deductCredit(userId, (err) => {
    if (err) return res.status(400).send(err);

    db.get(
      `SELECT * FROM documents WHERE id = ?`,
      [documentId],
      (err, document) => {
        if (err) return res.status(500).send("Error retrieving document.");
        if (!document) return res.status(404).send("Document not found.");

        // file path
        const fs = require("fs");

        fs.readFile(document.filepath, "utf8", (err, data) => {
          if (err) {
            console.error("Error reading the file:", err);
            return res.status(500).send("Error reading the file.");
          }

          const http = require("http");

          const options = {
            hostname: "localhost",
            port: 5000,
            path: "/yake/",
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          };

          const requestData = JSON.stringify({
            language: "en",
            max_ngram_size: 3,
            number_of_keywords: 10,
            text: data,
          });

          const req = http.request(options, (response) => {
            console.log("document", document);
            let responseData = "";

            response.on("data", (chunk) => {
              responseData += chunk;
            });

            response.on("end", () => {
              console.log("Keywords extracted:", JSON.parse(responseData));

              const keywords = JSON.parse(responseData);
              const formattedKeywords = keywords.map(
                (keyword) => keyword.ngram
              );

              console.log("Formatted keywords:", formattedKeywords);

              // Update the tags field in the documents table for the given document ID
              db.run(
                `UPDATE documents SET tags = ? WHERE id = ?`,
                [JSON.stringify(formattedKeywords), documentId],
                function (err) {
                  if (err) {
                    console.error("Error updating tags in database:", err);
                    return res
                      .status(500)
                      .send("Error updating tags in database.");
                  }
                  console.log("Tags updated in database successfully.");
                }
              );
            });
          });

          req.on("error", (error) => {
            console.error("Error making request:", error);
            return res
              .status(500)
              .send("Error making request to keyword extraction service.");
          });

          req.write(requestData);
          req.end();
        });
      }
    );

    res.status(200).send("Document scanned successfully.");
  });
};
