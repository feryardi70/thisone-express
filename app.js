const express = require("express");
const expressLayout = require("express-ejs-layouts");
const { body, validationResult, check } = require("express-validator");

require("./db");
const Book = require("./model/contact.js");

const app = express();
const port = process.env.PORT || 10000;

//gunakan template ejs
app.set("view engine", "ejs");
app.use(expressLayout);

// built-in middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  //res.send("Hello World!");
  res.render("index", { greet: "Selamat Datang", layout: "Layouts/main-layout" });
});

app.get("/about", (req, res) => {
  //res.send("Ini adalah halaman about");
  const mahasiswa = [
    {
      nama: "Sandika",
      email: "sandhika@gmail.com",
    },
    {
      nama: "Dody F",
      email: "dodyf@gmail.com",
    },
    {
      nama: "Erik",
      email: "eriklesler@gmail.com",
    },
  ];
  res.render("about", { layout: "Layouts/main-layout", mahasiswa });
});

app.get("/contact", async (req, res) => {
  const contacts = await Book.find({}, {email: 0});
  res.render("contact", { layout: "Layouts/none", contacts });
});

// procesc add contact
app.post(
  "/contact",
  [
    body("nama").custom(async (value) => {
      const duplikat = await Book.findOne({ nama: value });
      if (duplikat) {
        throw new Error("Nama dengan kontak tersebut sudah ada");
      }
      return true;
    }),
    check("email", "email tidak valid").isEmail(),
    check("noHp", "No. Hp tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("tambah", { layout: "Layouts/none", errors: errors.array() });
    } else {
      Book.insertMany(req.body),
        (error, result) => {
          console.log(result.status.json());
          //res.redirect(301, "/contact");
          //res.render("contact", { layout: "Layouts/none", contacts });
        };
      res.redirect("/contact");
    }
  }
);

app.get("/contact/add", (req, res) => {
  res.render("tambah", { layout: "Layouts/none" });
});

// halaman detail kontak
app.get("/contact/:nama", async (req, res) => {
  const contact = await Book.findOne({ nama: req.params.nama });
  res.render("detail", { layout: "Layouts/none", contact });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}..`);
});
