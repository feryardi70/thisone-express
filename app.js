const express = require("express");
const expressLayout = require("express-ejs-layouts");
const { loadContact, findContact, addContact, cekDuplikat } = require("./utils/contacts.js");
const { body, validationResult, check } = require("express-validator");
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

app.get("/contact", (req, res) => {
  const contacts = loadContact();
  //res.send("Ini adalah halaman contact");
  res.render("contact", { layout: "Layouts/none", contacts });
});

// procesc add contact
app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);
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
      //return res.status(400).json({ errors: errors.array() });
      res.render("tambah", { layout: "Layouts/none", errors: errors.array() });
    } else {
      addContact(req.body);
      //console.log("Berhasil menambahkan kontak baru");
      //res.send(req.body);
      res.redirect("/contact");
      //res.render("contact", { layout: "Layouts/none" });
    }
  }
);

app.get("/contact/add", (req, res) => {
  res.render("tambah", { layout: "Layouts/none" });
});

// halaman detail kontak
app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("detail", { layout: "Layouts/none", contact });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}..`);
});
