/** @format */

const fs = require("fs");
const path = require("path");
import corsMiddleware from "../../../../../utils/corsMiddleware";

export default async function Favorite(req, res) {
  await corsMiddleware(req, res);
  const jsonFilePath = path.join(process.cwd(), "/src/data/db.json");
  const jsonFileContent = JSON.parse(fs.readFileSync(jsonFilePath));

  if (!req.query?.id)
    return res
      .status(400)
      .json({ error: "آیدی کاربر مشخص نیست", success: false });

  const user = jsonFileContent.users.find((user) => user.id == req.query.id);

  if (!user)
    return res.status(404).json({ error: "کاربر یافت نشد", success: false });

  switch (req.method) {
    case "POST": {
      if (!req.body?.productId)
        return res
          .status(400)
          .json({ error: "آیدی محصول مشخص نیست", success: false });

      const product = jsonFileContent.products.find(
        (product) => product.id == req.body.productId
      );

      if (!product)
        return res
          .status(404)
          .json({ error: "محصول یافت نشد", success: false });

      const isDuplicate = user.favorite.some((p) => p.id == product.id);

      if (isDuplicate) {
        return res
          .status(409)
          .json({ message: "در علاقه مندی ها موجود است !!", success: false });
      }

      jsonFileContent.users.forEach((u) => {
        if (u.id == user.id) {
          u.favorite.push(product);
        }
      });

      fs.writeFileSync(jsonFilePath, JSON.stringify(jsonFileContent));

      return res
        .status(201)
        .json({ message: "به علاقه مندی ها اضافه شد", success: true });
    }

    case "DELETE": {
      if (!req.query?.productId) {
        return res
          .status(400)
          .json({ error: "آیدی محصول مشخص نیست", success: false });
      }
      const userIndex = jsonFileContent.users.findIndex((u) => u.id == user.id);
      user.favorite = user.favorite.filter((p) => p.id != req.query.productId);
      jsonFileContent.users[userIndex] = user;
      fs.writeFileSync(jsonFilePath, JSON.stringify(jsonFileContent));
      return res
        .status(200)
        .json({ message: "از علاقه مندی ها حذف شد", success: true });
    }

    default: {
      return res
        .status(400)
        .json({ error: "این درخواست تعریف نشده است", success: false });
    }
  }
}
