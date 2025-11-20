/** @format */

const fs = require("fs");
const path = require("path");
import corsMiddleware from "../../../../utils/corsMiddleware";

export default async function SingelCategory(req, res) {
  await corsMiddleware(req, res);

  const jsonFilePath = path.join(process.cwd(), "/src/data/db.json");
  const jsonFileContent = JSON.parse(fs.readFileSync(jsonFilePath));

  if (!req.query?.id)
    return res
      .status(400)
      .json({ error: "آیدی دسته بندی مشخص نیست", success: false });

  switch (req.method) {
    case "GET": {
      const category = jsonFileContent.categories.find(
        (c) => c.id == req.query.id
      );
      if (!category)
        return res
          .status(404)
          .json({ error: "دسته بندی یافت نشد", success: false });

      return res.status(200).json({ products: category.products });
    }
    default: {
      return res
        .status(400)
        .json({ error: "این درخواست تعریف نشده است", success: false });
    }
  }
}
