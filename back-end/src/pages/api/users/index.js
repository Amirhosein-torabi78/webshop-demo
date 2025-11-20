/** @format */

const fs = require("fs");
const path = require("path");
import corsMiddleware from "../../../../utils/corsMiddleware";
import { hashPassword } from "../../../../utils/passwordConf";

export default async function usersHandler(req, res) {
  await corsMiddleware(req, res);

  const jsonFilePath = path.join(process.cwd(), "/src/data/db.json");
  const jsonFileContent = JSON.parse(fs.readFileSync(jsonFilePath));

  switch (req.method) {
    case "GET": {
      return res
        .status(200)
        .json({ users: jsonFileContent.users, success: true });
    }

    case "POST": {
      const exceptedProps = ["userName", "password", "email"];
      const isBodyPropsValid = exceptedProps.every(
        (prop) => req.body[prop.trim()]
      );
      if (!isBodyPropsValid)
        return res
          .status(400)
          .json({ error: "تمامی فیلد ها باید فرستاده شوند", success: false });

      const isUserExist = jsonFileContent.users.some(
        (user) => user.email == req.body.email
      );
      if (isUserExist)
        return res
          .status(409)
          .json({ error: "این کاربر قبلا ثبت شده است", success: false });

      const hashedPassword = await hashPassword(req.body.password);

      const newUser = {
        ...req.body,
        password: hashedPassword,
        id: crypto.randomUUID(),
        favorite: [],
        basket: [],
      };
      jsonFileContent.users.push(newUser);
      fs.writeFileSync(jsonFilePath, JSON.stringify(jsonFileContent));

      const { id } = newUser;

      return res.status(201).json({
        message: "کاربر با موفقیت ثبت نام شد",
        success: true,
        id,
      });
    }

    default: {
      return res
        .status(400)
        .json({ error: "این درخواست تعریف نشده است", success: false });
    }
  }
}
