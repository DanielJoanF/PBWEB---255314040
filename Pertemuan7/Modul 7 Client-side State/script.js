"use strict";

/* =============================================================
   MODUL 6 — CLIENT-SIDE STATE
   Bagian B — Kegiatan Praktikum (program lengkap: script.js)
   Mata Kuliah: Pemrograman Berbasis Web (PROG31W)

   File KUMULATIF (melanjutkan modul sebelumnya):
     - Basis Modul 3 (JavaScript Dasar & DOM)
     - Modul 4 (Event Handling)
     - Modul 5 (Validasi Form)
     - Modul 6 (Client-side State / localStorage)   <-- fokus modul ini

   Berpasangan dengan index.html & style.css pada paket yang sama.
   ============================================================= */


/* =========================================================
   BASIS MODUL 3 + Dark Mode (dengan persistensi Modul 6)
   ========================================================= */

const judulSitus = document.querySelector("header h1");
if (judulSitus) {
  console.log(judulSitus);
  console.log(judulSitus.textContent);
}

/* (Modul 3 · B.3 + Modul 6 · B.2) Toggle tema SEKALIGUS menyimpannya */
const tombolTema = document.querySelector("#btn-tema");
function toggleTema() {
  document.body.classList.toggle("dark-mode");
  const temaSekarang = document.body.classList.contains("dark-mode") ? "dark" : "light";
  localStorage.setItem("tema", temaSekarang);
}
if (tombolTema) {
  tombolTema.addEventListener("click", toggleTema);
}

/* (Modul 6 · B.3) Muat preferensi tema saat halaman dibuka */
function muatPreferensiTema() {
  const tema = localStorage.getItem("tema");
  if (tema === "dark") {
    document.body.classList.add("dark-mode");
  }
}
muatPreferensiTema();

/* (Modul 3 · B.4) Tampilkan/sembunyikan aside */
const tombolInfo = document.querySelector("#btn-info");
const kotakAside = document.querySelector("aside");
if (tombolInfo && kotakAside) {
  tombolInfo.addEventListener("click", () => {
    kotakAside.classList.toggle("tersembunyi");
  });
}

/* Data artikel + render dinamis */
const daftarArtikel = [
  { judul: "Mengenal HTML Semantik", tanggal: "2026-08-20", isi: "HTML semantik membantu membangun struktur halaman yang bermakna..." },
  { judul: "Dasar CSS Responsif", tanggal: "2026-08-22", isi: "CSS responsif memastikan tampilan menyesuaikan berbagai layar..." },
  { judul: "Mengenal JavaScript dan DOM", tanggal: "2026-08-24", isi: "JavaScript memungkinkan halaman web menjadi interaktif..." },
];

const containerArtikel = document.querySelector(".daftar-artikel");

if (containerArtikel) {
  /* (Modul 6 · B.4) Muat seluruh jumlah like yang tersimpan */
  const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};

  daftarArtikel.forEach((data) => {
    const article = document.createElement("article");

    const judul = document.createElement("h3");
    judul.textContent = data.judul;

    const waktu = document.createElement("time");
    waktu.textContent = data.tanggal;

    const isi = document.createElement("p");
    isi.textContent = data.isi;

    /* (Modul 4 · B.3 + Modul 6 · B.4) Tombol Like dengan nilai dari localStorage */
    const tombolLike = document.createElement("button");
    let jumlahLike = semuaLike[data.judul] || 0;
    tombolLike.textContent = `Like (${jumlahLike})`;
    tombolLike.dataset.like = jumlahLike; // sinkronkan dataset dengan nilai tersimpan

    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";

    article.appendChild(judul);
    article.appendChild(waktu);
    article.appendChild(isi);
    article.appendChild(tombolLike);
    article.appendChild(tombolHapus);

    containerArtikel.appendChild(article);
  });


  /* =======================================================
     MODUL 4 — EVENT HANDLING (+ persistensi like Modul 6)
     ======================================================= */

  containerArtikel.addEventListener("mouseover", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.add("artikel-hover");
  });
  containerArtikel.addEventListener("mouseout", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.remove("artikel-hover");
  });

  containerArtikel.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.textContent.startsWith("Like")) {
      let jumlah = parseInt(e.target.dataset.like || 0);
      jumlah++;
      e.target.dataset.like = jumlah;
      e.target.textContent = `Like (${jumlah})`;

      /* (Modul 6 · B.4) Simpan perubahan like ke localStorage */
      const judul = e.target.closest("article").querySelector("h3").textContent;
      simpanLike(judul, jumlah);
    }
  });

  containerArtikel.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.textContent === "Hapus") {
      e.target.closest("article").remove();
    }
  });
}

/* (Modul 6 · B.4) Fungsi penyimpan jumlah like per judul artikel */
function simpanLike(judulArtikel, jumlah) {
  const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};
  semuaLike[judulArtikel] = jumlah;
  localStorage.setItem("semuaLike", JSON.stringify(semuaLike));
}


/* =========================================================
   Form komentar: Modul 4 (render) + Modul 5 (validasi)
   + Modul 6 (simpan & muat dari localStorage)
   ========================================================= */

const formKomentar = document.querySelector("#form-komentar");
const daftarKomentar = document.querySelector("#daftar-komentar");

/* (Modul 6 · B.5) Fungsi simpan & muat komentar */
function simpanKomentar(nama, pesan) {
  const daftar = JSON.parse(localStorage.getItem("komentar")) || [];
  daftar.push({ nama, pesan });
  localStorage.setItem("komentar", JSON.stringify(daftar));
}
function muatKomentar() {
  const daftar = JSON.parse(localStorage.getItem("komentar")) || [];
  daftar.forEach((k) => {
    const li = document.createElement("li");
    li.textContent = `${k.nama}: ${k.pesan}`;
    daftarKomentar.appendChild(li);
  });
}

if (formKomentar && daftarKomentar) {
  muatKomentar(); // render komentar tersimpan saat halaman dibuka

  formKomentar.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = document.querySelector("#input-nama").value.trim();
    const pesan = document.querySelector("#input-pesan").value.trim();
    if (nama === "" || pesan === "") {
      alert("Nama dan komentar wajib diisi!");
      return;
    }
    const itemKomentar = document.createElement("li");
    itemKomentar.textContent = `${nama}: ${pesan}`;
    daftarKomentar.appendChild(itemKomentar);

    simpanKomentar(nama, pesan); // (Modul 6 · B.5) simpan ke localStorage
    formKomentar.reset();
  });
}

/* (Modul 4 · B.6) Keyboard shortcut "d" — kini memanggil toggleTema()
   agar perubahan tema lewat keyboard ikut tersimpan. Diabaikan saat mengetik. */
document.addEventListener("keydown", (e) => {
  const tag = e.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (e.key.toLowerCase() === "d") {
    toggleTema();
  }
});


/* =========================================================
   MODUL 5 — VALIDASI FORM (tetap berlaku)
   ========================================================= */

/* B.4 — Pesan error kustom pada form komentar */
const inputNama = document.querySelector("#input-nama");
if (inputNama) {
  inputNama.addEventListener("input", () => {
    if (inputNama.validity.valueMissing) {
      inputNama.setCustomValidity("Nama wajib diisi");
    } else if (inputNama.validity.tooShort) {
      inputNama.setCustomValidity("Nama minimal 3 karakter");
    } else {
      inputNama.setCustomValidity("");
    }
  });
}

const inputPesan = document.querySelector("#input-pesan");
if (inputPesan) {
  inputPesan.addEventListener("input", () => {
    if (inputPesan.validity.valueMissing) {
      inputPesan.setCustomValidity("Komentar wajib diisi");
    } else if (inputPesan.validity.tooShort) {
      inputPesan.setCustomValidity("Komentar minimal 5 karakter");
    } else {
      inputPesan.setCustomValidity("");
    }
  });
}

/* B.5 — Form pendaftaran akun + validasi konfirmasi password */
const formDaftar = document.querySelector("#form-daftar");
const errorKonfirmasi = document.querySelector("#error-konfirmasi");
if (formDaftar && errorKonfirmasi) {
  formDaftar.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.querySelector("#password").value;
    const konfirmasi = document.querySelector("#konfirmasi").value;
    if (password !== konfirmasi) {
      errorKonfirmasi.textContent = "Konfirmasi password tidak sama dengan password";
    } else {
      errorKonfirmasi.textContent = "";
      alert("Pendaftaran berhasil (simulasi)!");
      formDaftar.reset();
    }
  });
}

/* B.6 — Pesan error per field di DOM */
function validasiField(input, errorElement) {
  if (!input.checkValidity()) {
    errorElement.textContent = input.validationMessage;
  } else {
    errorElement.textContent = "";
  }
}
[
  ["#username", "#error-username"],
  ["#email", "#error-email"],
  ["#password", "#error-password"],
].forEach(([fieldSel, errorSel]) => {
  const field = document.querySelector(fieldSel);
  const errEl = document.querySelector(errorSel);
  if (field && errEl) {
    field.addEventListener("input", () => validasiField(field, errEl));
  }
});


/* =========================================================
   MODUL 6 · B.6 — Tombol Reset seluruh data tersimpan
   ========================================================= */
const tombolReset = document.querySelector("#btn-reset");
if (tombolReset) {
  tombolReset.addEventListener("click", () => {
    const konfirmasi = confirm("Hapus semua data tersimpan (tema, like, komentar)?");
    if (konfirmasi) {
      localStorage.clear();
      location.reload(); // tampilan kembali ke kondisi awal
    }
  });
}
