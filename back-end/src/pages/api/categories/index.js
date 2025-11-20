/** @format */

const fs = require("fs");
const path = require("path");
import corsMiddleware from "../../../../utils/corsMiddleware";

export default async function Categories(req, res) {
  await corsMiddleware(req, res);

  const jsonFilePath = path.join(process.cwd(), "/src/data/db.json");
  const jsonFileContent = JSON.parse(fs.readFileSync(jsonFilePath));

  switch (req.method) {
    case "GET": {
      return res
        .status(200)
        .json({ categories: jsonFileContent.categories, success: true });
    }
    default: {
      return res
        .status(400)
        .json({ error: "این درخواست تعریف نشده است", success: false });
    }
  }
}
