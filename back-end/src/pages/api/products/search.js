/** @format */

const fs = require("fs");
const path = require("path");
import corsMiddleware from "../../../../utils/corsMiddleware";

export default async function Search(req, res) {
  await corsMiddleware(req, res);

  const jsonFilePath = path.join(process.cwd(), "/src/data/db.json");
  const jsonFileContent = JSON.parse(fs.readFileSync(jsonFilePath));

  const { value } = req.body;
  if (!value)
    return res
      .status(400)
      .json({ error: "نام محصول مشخص نیست", success: false });

  switch (req.method) {
    case "POST": {
      const products = jsonFileContent.products.filter((p) =>
        p.title.includes(value)
      );

      if (!products || products.length < 1)
        return res
          .status(404)
          .json({ errro: "محصول یافت نشد", success: false });

      return res.status(200).json({ products: products, success: true });
    }
    default: {
      return res
        .status(400)
        .json({ error: "این درخواست تعریف نشده است", success: false });
    }
  }
}
