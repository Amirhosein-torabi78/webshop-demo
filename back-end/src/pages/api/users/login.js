/** @format */

const fs = require("fs");
const path = require("path");
import corsMiddleware from "../../../../utils/corsMiddleware";
import { verifyPassword } from "../../../../utils/passwordConf";

export default async function Login(req, res) {
  await corsMiddleware(req, res);

  if (req.method == "POST") {
    const jsonFilePath = path.join(process.cwd(), "/src/data/db.json");
    const jsonFileContent = JSON.parse(fs.readFileSync(jsonFilePath));
    const exceptedProps = ["userName", "password"];
    const isBodyPropsValid = exceptedProps.every((prop) => req.body[prop.trim()]);
    if (!isBodyPropsValid)
      return res
        .status(400)
        .json({ error: "تمامی فیلد ها باید فرستاده شوند", success: false });

    const { userName, password } = req.body;
    const user = jsonFileContent.users.find(
      (user) => user.userName == userName
    );
    if (!user) {
      return res
        .status(401)
        .json({ error: "این کاربر هنوز ثبت نام نکرده است", success: false });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword)
      return res
        .status(422)
        .json({ error: "رمز عبور اشتباه است", success: false });

    const { id } = user;
    return res.status(200).json({
      message: "ورود با موفقیت انجام شد",
      success: true,
      id,
    });
  } else {
    return res
      .status(400)
      .json({ error: "این درخواست تعریف نشده است", success: false });
  }
}
