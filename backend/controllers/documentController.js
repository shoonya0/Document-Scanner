const db = require("../models/models");
const fs = require("fs");

exports.uploadDocument = (req, res) => {
  const userId = req.session.user.id;
  const token = req.session.token;

  let textFileData = "";

  req.on("data", (chunk) => {
    textFileData += chunk;
  });

  req.on("end", () => {
    const boundary = req.headers["content-type"].split("boundary=")[1];
    if (!boundary) {
      return res.status(400).send("No file uploaded - Invalid Content-Type");
    }

    const parts = textFileData.split(`--${boundary}`);
    const filePart = parts.find((part) =>
      part.includes('Content-Disposition: form-data; name="document"')
    );

    if (!filePart) {
      return res.status(400).send("No file uploaded - Invalid Content-Type");
    }

    const fileContentIndex = filePart.indexOf("\r\n\r\n") + 4;
    const fileContent = filePart.substring(
      fileContentIndex,
      filePart.lastIndexOf("\r\n")
    );

    // to find the file name
    const fileName = filePart.split('filename="')[1].split('"')[0];
    const cleanFileName = fileName.replace(/"/g, "");

    const fs = require("fs");
    // Define the path where the file will be saved
    const filePath = `./uploads/${cleanFileName}`;

    fs.writeFile(filePath, fileContent, (err) => {
      if (err) {
        console.log("Error saving file to disk:", err);
        return res.status(500).send("Error saving file to disk.");
      }
      console.log(`File saved to ${filePath}`);
    });

    // Save document to database
    db.run(
      `INSERT INTO documents (user_id, filename, filepath, content) VALUES (?, ?, ?, ?)`,
      [userId, fileName, filePath, fileContent],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Error saving document" });
        }
        const documentId = this.lastID;
        return res.status(200).json({
          message: "Document uploaded successfully",
          documentId: documentId,
        });
      }
    );
  });
};

exports.matchDocument = async (req, res) => {
  const userId = req.session.user.id;
  const docId = req.params.docId;

  try {
    const document = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM documents WHERE id = ? AND user_id = ?`,
        [docId, userId],
        (err, doc) => {
          if (err) {
            return reject({ error: "Database error" });
          }
          if (!doc) {
            return reject({ error: "Document not found" });
          }
          resolve(doc);
        }
      );
    });

    const tags = JSON.parse(document.tags);
    const docMatches = new Map();

    const documentPromises = tags.map((tag) => {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT * FROM documents WHERE id != ?`,
          [docId],
          (err, docu) => {
            if (err) {
              return reject({ error: "Error finding matches" });
            }
            resolve(docu);
          }
        );
      });
    });

    const allDocuments = await Promise.all(documentPromises);
    // Flatten the array of arrays
    const documents = allDocuments.flat();

    for (const docs of documents) {
      let matches = 0;
      const docTags = JSON.parse(docs.tags);

      for (const docTag of docTags) {
        for (const tag of tags) {
          if (tag === docTag) {
            matches++;
          }
        }
      }
      if (matches >= 10) {
        docMatches.set(
          {
            id: docs.id,
            filename: docs.filename,
          },
          matches
        );
      }
    }

    const localJson = Array.from(docMatches.entries()).map(([key, value]) => ({
      document: key,
      matches: value,
    }));

    res.status(200).json(localJson);
  } catch (error) {
    res.status(500).json(error);
  }
};
