/** @format */

const fs = require("fs");
const path = require("path");
import corsMiddleware from "../../../../utils/corsMiddleware";

export default async function Search(req, res) {
  await corsMiddleware(req, res);

  const jsonFilePath = path.join(process.cwd(), "/src/data/db.json");
  const jsonFileContent = JSON.parse(fs.readFileSync(jsonFilePath));

  const { categoryId, value } = req.body;
  if (!categoryId)
    return res
      .status(400)
      .json({ error: "آیدی دسته بندی مشخص نیست", success: false });
  if (!value)
    return res
      .status(400)
      .json({ error: "نام محصول مشخص نیست", success: false });

  switch (req.method) {
    case "POST": {
      const category = jsonFileContent.categories.find(
        (c) => c.id == categoryId
      );
      const products = category.products.filter((p) => p.title.includes(value));
      if (!category)
        return res
          .status(404)
          .json({ error: "دسته بندی یافت نشد", success: false });
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
