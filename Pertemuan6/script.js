const STORAGE_KEY = 'dataCalonMhs';

// Membaca dari localStorage
function ambilDataPendaftar() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Menyimpan data ke localStorage
function simpanDataPendaftar(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const formPendaftaran = document.getElementById('form-pendaftaran');

if (formPendaftaran) {
  formPendaftaran.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(formPendaftaran);
    const pendaftar = {};

    // Membaca input biasa dan radio
    for (let [key, value] of formData.entries()) {
      if (key !== 'dokumen_dpp') {
        pendaftar[key] = value;
      }
    }

    // Membaca multiple checkbox untuk dokumen DPP
    const dokumenChecked = Array.from(
      formPendaftaran.querySelectorAll('input[name="dokumen_dpp"]:checked')
    ).map(cb => cb.value);
    pendaftar.dokumen_dpp = dokumenChecked;

    // Menambahkan metadata waktu pendaftaran
    pendaftar.id = Date.now();
    pendaftar.waktuDaftar = new Date().toLocaleString('id-ID');

    // Simpan ke array localStorage
    const listPendaftar = ambilDataPendaftar();
    listPendaftar.push(pendaftar);
    simpanDataPendaftar(listPendaftar);

    alert('Pendaftaran berhasil disimpan!');
    formPendaftaran.reset();
    window.location.href = 'dataPendaftar.html';
  });
}

const tabelDaftar = document.getElementById('daftar');

if (tabelDaftar) {
  const inputCari = document.getElementById('cari');
  const spanJumlah = document.getElementById('jumlah');
  const btnMuatUlang = document.getElementById('muat-ulang');
  const btnEksporJson = document.getElementById('ekspor-json');
  const btnEksporCsv = document.getElementById('ekspor-csv');
  const btnHapusSemua = document.getElementById('hapus-semua');
  const containerDetail = document.getElementById('detail');

  function renderTabel(keyword = '') {
    const listPendaftar = ambilDataPendaftar();
    tabelDaftar.innerHTML = '';

    const filtered = listPendaftar.filter(item => {
      const q = keyword.toLowerCase();
      return (
        (item.nama && item.nama.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.pilihan1 && item.pilihan1.toLowerCase().includes(q))
      );
    });

    spanJumlah.textContent = `Total: ${filtered.length} data`;

    if (filtered.length === 0) {
      tabelDaftar.innerHTML = `<tr><td colspan="7" style="text-align:center;">Tidak ada data pendaftar.</td></tr>`;
      return;
    }

    filtered.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.nama || '-'}</td>
        <td>${item.email || '-'}</td>
        <td>${item.hp || '-'}</td>
        <td>${item.pilihan1 || '-'}</td>
        <td>${item.waktuDaftar || '-'}</td>
        <td>
          <button class="btn btn-info btn-sm" onclick="lihatDetail(${item.id})">Detail</button>
          <button class="btn btn-danger btn-sm" onclick="hapusSatu(${item.id})">Hapus</button>
        </td>
      `;
      tabelDaftar.appendChild(tr);
    });
  }

  // Tampilkan Detail
  window.lihatDetail = function (id) {
    const listPendaftar = ambilDataPendaftar();
    const item = listPendaftar.find(p => p.id === id);

    if (!item) return;

    containerDetail.innerHTML = `
      <div class="detail-grid">
        <strong>Nama:</strong> <span>${item.nama || '-'}</span>
        <strong>Jenis Kelamin:</strong> <span>${item.jenis_kelamin || '-'}</span>
        <strong>Status:</strong> <span>${item.status || '-'}</span>
        <strong>Agama:</strong> <span>${item.agama || '-'}</span>
        <strong>Kewarganegaraan:</strong> <span>${item.kewarganegaraan || '-'}</span>
        <strong>Alamat Surat:</strong> <span>${item.alamat_surat || '-'}</span>
        <strong>Alamat Asal:</strong> <span>${item.alamat_asal || '-'}, ${item.kota || '-'}, ${item.provinsi || '-'}</span>
        <strong>No. HP:</strong> <span>${item.hp || '-'}</span>
        <strong>E-mail:</strong> <span>${item.email || '-'}</span>
        <strong>Orang Tua/Wali:</strong> <span>${item.nama_ortu || '-'} (${item.pendidikan_ortu || '-'})</span>
        <strong>Asal Perguruan Tinggi:</strong> <span>${item.pt_asal || '-'} (Prodi: ${item.prodi_asal || '-'})</span>
        <strong>Pilihan Prodi:</strong> <span>1. ${item.pilihan1 || '-'}<br>2. ${item.pilihan2 || '-'}<br>3. ${item.pilihan3 || '-'}</span>
        <strong>Asal Sekolah:</strong> <span>${item.sekolah || '-'} (${item.status_sekolah || '-'}) - Jurusan ${item.jurusan || '-'}</span>
        <strong>Permohonan DPP:</strong> <span>${item.dpp || '-'} (Dokumen: ${item.dokumen_dpp ? item.dokumen_dpp.join(', ') : 'Tidak ada'})</span>
        <strong>Sumbangan Beasiswa:</strong> <span>${item.beasiswa || '-'} ${item.beasiswa_rp ? 'Rp ' + item.beasiswa_rp : ''}</span>
      </div>
    `;
  };

  // Hapus Satu Data
  window.hapusSatu = function (id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      let listPendaftar = ambilDataPendaftar();
      listPendaftar = listPendaftar.filter(item => item.id !== id);
      simpanDataPendaftar(listPendaftar);
      renderTabel(inputCari.value);
      containerDetail.innerHTML = '<p>Pilih “Detail” pada salah satu baris.</p>';
    }
  };

  // Event Handlers
  inputCari.addEventListener('input', () => renderTabel(inputCari.value));

  btnMuatUlang.addEventListener('click', () => {
    inputCari.value = '';
    renderTabel();
  });

  btnHapusSemua.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin menghapus SELURUH data pendaftar?')) {
      localStorage.removeItem(STORAGE_KEY);
      renderTabel();
      containerDetail.innerHTML = '<p>Pilih “Detail” pada salah satu baris.</p>';
    }
  });

  // Unduh Data JSON
  btnEksporJson.addEventListener('click', () => {
    const data = JSON.stringify(ambilDataPendaftar(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data_pendaftar.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Unduh Data CSV
  btnEksporCsv.addEventListener('click', () => {
    const listPendaftar = ambilDataPendaftar();
    if (listPendaftar.length === 0) {
      alert('Tidak ada data untuk diunduh.');
      return;
    }

    const headers = ['ID', 'Nama', 'Email', 'HP', 'Pilihan 1', 'Sekolah', 'Waktu Daftar'];
    const rows = listPendaftar.map(p => [
      p.id,
      `"${p.nama || ''}"`,
      `"${p.email || ''}"`,
      `"${p.hp || ''}"`,
      `"${p.pilihan1 || ''}"`,
      `"${p.sekolah || ''}"`,
      `"${p.waktuDaftar || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data_pendaftar.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Inisialisasi awal
  renderTabel();
}