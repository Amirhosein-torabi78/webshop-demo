/** @format */

const fs = require("fs");
const path = require("path");
import corsMiddleware from "../../../../utils/corsMiddleware";

export default async function Products(req, res) {
  await corsMiddleware(req, res);

  const jsonFilePath = path.join(process.cwd(), "/src/data/db.json");
  const jsonFileContent = JSON.parse(fs.readFileSync(jsonFilePath));

  switch (req.method) {
    case "GET": {
      if (req.query?.page) {
        const page = req.query.page * 10;
        const products = jsonFileContent.products.slice(page - 10, page);
        const totalPages = Math.ceil(jsonFileContent.products.length / 10);

        return res.json({ products, success: true, totalPages });
      } else {
        return res
          .status(200)
          .json({ products: jsonFileContent.products, success: true });
      }
    }
    default: {
      return res
        .status(400)
        .json({ error: "این درخواست تعریف نشده است", success: false });
    }
  }
}
