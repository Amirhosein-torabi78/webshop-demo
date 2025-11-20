/** @format */

const fs = require("fs");
const path = require("path");
import corsMiddleware from "../../../../utils/corsMiddleware";
import { hashPassword } from "../../../../utils/passwordConf";

export default async function ResetPassword(req, res) {
  await corsMiddleware(req, res);

  if (req.method == "POST") {
    const jsonFilePath = path.join(process.cwd(), "/src/data/db.json");
    const jsonFileContent = JSON.parse(fs.readFileSync(jsonFilePath));
    const exceptedProps = ["email", "newPassword"];
    const isBodyPropsValid = exceptedProps.every(
      (prop) => req.body[prop.trim()]
    );
    if (!isBodyPropsValid)
      return res
        .status(400)
        .json({ error: "تمامی فیلد ها باید فرستاده شوند", success: false });
    const userIndex = jsonFileContent.users.findIndex(
      (user) => user.email == req.body?.email
    );

    if (userIndex == -1)
      return res.status(404).json({ error: "کاربر یافت نشد", success: false });
    const hashedPassword = await hashPassword(req.body?.newPassword);
    jsonFileContent.users[userIndex].password = hashedPassword;
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonFileContent));

    return res.json({ message: "رمز عبور با موفقیت تغییر کرد", success: true });
  } else {
    return res
      .status(400)
      .json({ error: "این درخواست تعریف نشده است", success: false });
  }
}
