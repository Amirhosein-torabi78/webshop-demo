/** @format */

const fs = require("fs");
const path = require("path");
import corsMiddleware from "../../../../../utils/corsMiddleware";

export default async function SingleUser(req, res) {
  await corsMiddleware(req, res);
  const jsonFilePath = path.join(process.cwd(), "/src/data/db.json");
  const jsonFileContent = JSON.parse(fs.readFileSync(jsonFilePath));

  switch (req.method) {
    case "GET": {
      if (!req.query?.id) {
        return res
          .status(400)
          .json({ error: "آیدی کاربر مشخص نیست", success: false });
      }

      const user = jsonFileContent.users.find(
        (user) => user.id == req.query.id
      );
      if (!user)
        return res
          .status(404)
          .json({ error: "کاربر یافت نشد", success: false });

      return res.json({ ...user });
    }

    default: {
      return res
        .status(400)
        .json({ error: "این درخواست تعریف نشده است", success: false });
    }
  }
}
