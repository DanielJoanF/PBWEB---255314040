"use strict";

const containerArtikel = document.querySelector(".daftar-artikel");
const loading = document.querySelector("#loading");

async function ujiFetch() {
  console.log("--- Langkah 1: Memulai ujiFetch() ---");
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
    const data = await response.json();
    console.log("Data hasil ujiFetch (3 post):", data);
  } catch (error) {
    console.error("Gagal ujiFetch:", error);
  }
}

// Jalankan ujiFetch untuk verifikasi koneksi API di console
ujiFetch();

function simpanLike(judulArtikel, jumlah) {
  const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};
  semuaLike[judulArtikel] = jumlah;
  localStorage.setItem("semuaLike", JSON.stringify(semuaLike));
}

/**
 * Fungsi utama untuk memuat artikel dari JSONPlaceholder
 */
async function muatArtikelDariAPI() {
  const loadingEl = document.querySelector("#loading");
  const container = document.querySelector(".daftar-artikel");

  // 1. Tampilkan indikator loading sebelum proses fetch
  if (loadingEl) {
    loadingEl.style.display = "block";
  }

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");

    // Validasi response HTTP: fetch tidak melempar error otomatis jika 404/500
    if (!response.ok) {
      throw new Error("Status: " + response.status);
    }

    const daftarPost = await response.json();

    if (container) {
      // Bersihkan container dari konten lama (misal teks loading/statis)
      container.innerHTML = "";

      // Ambil data like yang tersimpan dari localStorage (Modul 6)
      const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};

      // Render tiap post dari API ke dalam DOM
      daftarPost.forEach((post) => {
        const article = document.createElement("article");

        const judul = document.createElement("h3");
        judul.textContent = post.title;

        const isi = document.createElement("p");
        isi.textContent = post.body;

        // Tombol Like (Modul 4 & Modul 6)
        const tombolLike = document.createElement("button");
        let jumlahLike = semuaLike[post.title] || 0;
        tombolLike.textContent = `Like (${jumlahLike})`;
        tombolLike.dataset.like = jumlahLike;
        tombolLike.className = "btn-like";

        // Tombol Hapus (Modul 4)
        const tombolHapus = document.createElement("button");
        tombolHapus.textContent = "Hapus";
        tombolHapus.className = "btn-hapus";

        // Susun elemen ke dalam <article>
        article.appendChild(judul);
        article.appendChild(isi);
        article.appendChild(tombolLike);
        article.appendChild(tombolHapus);

        // Masukkan <article> ke container
        container.appendChild(article);
      });
    }
  } catch (error) {
    // Penanganan error: tampilkan pesan ramah kepada pengguna di halaman
    if (container) {
      container.innerHTML = "<p>Gagal memuat artikel, silakan coba lagi nanti.</p>";
    }
    console.error("Gagal mengambil data:", error);
  } finally {
    // finally selalu dijalankan: matikan indikator loading baik sukses maupun gagal
    if (loadingEl) {
      loadingEl.style.display = "none";
    }
  }
}

// Jalankan fungsi pemuatan artikel
muatArtikelDariAPI();

async function muatProfilPenulis() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    if (!response.ok) {
      throw new Error("Status: " + response.status);
    }
    const user = await response.json();

    const elNama = document.querySelector("#nama-penulis");
    const elEmail = document.querySelector("#email-penulis");

    if (elNama) elNama.textContent = user.name;
    if (elEmail) elEmail.textContent = user.email;

    console.log("Profil penulis berhasil dimuat:", user.name, user.email);
  } catch (error) {
    console.error("Gagal memuat profil penulis:", error);
  }
}

// Jalankan fungsi pemuatan profil penulis
muatProfilPenulis();


/* ==========================================================================
   EVENT LISTENER TAMBAHAN (Interaksi Modul 4 & Modul 6)
   Event delegation untuk tombol Like dan Hapus pada artikel yang dimuat dari API.
   ========================================================================== */
if (containerArtikel) {
  // Event click untuk tombol Like
  containerArtikel.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.textContent.startsWith("Like")) {
      let jumlah = parseInt(e.target.dataset.like || 0);
      jumlah++;
      e.target.dataset.like = jumlah;
      e.target.textContent = `Like (${jumlah})`;

      // Simpan perubahan like ke localStorage
      const judul = e.target.closest("article").querySelector("h3").textContent;
      simpanLike(judul, jumlah);
    }
  });

  // Event click untuk tombol Hapus
  containerArtikel.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.textContent === "Hapus") {
      const article = e.target.closest("article");
      if (article) {
        article.remove();
      }
    }
  });
}
