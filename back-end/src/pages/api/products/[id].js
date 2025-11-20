/** @format */

const fs = require("fs");
const path = require("path");
import corsMiddleware from "../../../../utils/corsMiddleware";

export default async function SingleProduct(req, res) {
  await corsMiddleware(req, res);

  const jsonFilePath = path.join(process.cwd(), "/src/data/db.json");
  const jsonFileContent = JSON.parse(fs.readFileSync(jsonFilePath));

  switch (req.method) {
    case "GET": {
      if (!req.query?.id) {
        return res
          .status(400)
          .json({ error: "آیدی محصول مشخص نیست", success: false });
      }

      const product = jsonFileContent.products.find(
        (product) => product.id == req.query.id
      );
      
      if (!product)
        return res
          .status(404)
          .json({ error: "محصول یافت نشد", success: false });

      return res.json({ ...product });
    }

    default: {
      return res
        .status(400)
        .json({ error: "این درخواست تعریف نشده است", success: false });
    }
  }
}
