/** @format */

const fs = require("fs");
const path = require("path");
import corsMiddleware from "../../../../utils/corsMiddleware";

export default async function Offs(req, res) {
  await corsMiddleware(req, res);

  const jsonFilePath = path.join(process.cwd(), "/src/data/db.json");
  const jsonFileContent = JSON.parse(fs.readFileSync(jsonFilePath));

  switch (req.method) {
    case "GET": {
      const categories = jsonFileContent.categories.flatMap((category) =>
        category.products.filter((product) => product.off)
      );
      return res.json({ categories, success: true });
    }

    default: {
      return res
        .status(400)
        .json({ error: "این درخواست تعریف نشده است", success: false });
    }
  }
}
