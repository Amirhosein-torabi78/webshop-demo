/** @format */

const fs = require("fs");
const path = require("path");
import corsMiddleware from "../../../../utils/corsMiddleware";

async function Filter(req, res) {
  await corsMiddleware(req, res);

  const jsonFilePath = path.join(process.cwd(), "/src/data/db.json");
  const jsonFileContent = JSON.parse(fs.readFileSync(jsonFilePath));

  if (req.method == "GET") {
    let products = jsonFileContent.products;
    for (let key in req.query) {
      switch (key) {
        case "maxPrice": {
          products = products
            .filter((product) => product.price <= req.query[key])
            .sort((a, b) => a.price - b.price);
          break;
        }
        case "minPrice": {
          products = products
            .filter((product) => product.price >= req.query[key])
            .sort((a, b) => b.price - a.price);
          break;
        }
        case "brand": {
          products = products.filter((product) =>
            product.brands.includes(req.query[key])
          );
          break;
        }
        case "categoryId": {
          products = jsonFileContent.categories.filter(
            (category) => category.id == req.query[key]
          ).products;
          break;
        }
        case "color": {
          products = products.filter((product) =>
            product.colors.includes(req.query[key])
          );
          break;
        }
        case "inStash": {
          const inStash = req.query[key] == "true" ? true : false;
          if (inStash) {
            products = products.filter((product) => product.count);
          } else {
            products = products.filter((product) => !product.count);
          }
          break;
        }
        case "auction": {
          const auction = req.query[key] == "true" ? true : false;
          if (auction) {
            products = products.filter((product) => product.off);
          } else {
            products = products.filter((product) => !product.off);
          }
          break;
        }
      }
    }

    return res.json({ products, success: true });
  } else {
    return res
      .status(400)
      .json({ error: "این درخواست تعریف نشده است", success: false });
  }
}

export default Filter;
