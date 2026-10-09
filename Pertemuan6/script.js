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

// Escape HTML agar input pengguna tidak merusak tampilan
function esc(v, cadangan = '-') {
    if (v === undefined || v === null || v === '') return cadangan;
    return String(v).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
}

// Notifikasi melayang (toast)
function tampilkanNotif(pesan) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = pesan;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Unduh file dari string
function unduhFile(namaFile, isi, tipe) {
    const blob = new Blob([isi], { type: tipe });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = namaFile;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

/* HALAMAN PENDAFTARAN (pendaftaran.html)*/
const formPendaftaran = document.getElementById('form-pendaftaran');

if (formPendaftaran) {
    formPendaftaran.addEventListener('submit', function (e) {
        e.preventDefault();

        try {
            const formData = new FormData(formPendaftaran);
            const pendaftar = {};

            // Input biasa dan radio
            for (const [key, value] of formData.entries()) {
                if (key !== 'dokumen_dpp') {
                    pendaftar[key] = value;
                }
            }

            // Checkbox dokumen DPP (bisa lebih dari satu)
            pendaftar.dokumen_dpp = Array.from(
                formPendaftaran.querySelectorAll('input[name="dokumen_dpp"]:checked')
            ).map(cb => cb.value);

            // Metadata
            pendaftar.id = Date.now();
            pendaftar.waktuDaftar = new Date().toLocaleString('id-ID');

            // Simpan ke localStorage
            const listPendaftar = ambilDataPendaftar();
            listPendaftar.push(pendaftar);
            simpanDataPendaftar(listPendaftar);

            tampilkanNotif('Pendaftaran berhasil terkirim!');
            formPendaftaran.reset();

            setTimeout(() => {
                window.location.href = 'dataPendaftar.html';
            }, 1500);
        } catch (err) {
            alert('Gagal menyimpan data: ' + err.message);
        }
    });
}

/*HALAMAN DATA PENDAFTAR (dataPendaftar.html)*/
const tabelDaftar = document.getElementById('daftar');

if (tabelDaftar) {
    const inputCari = document.getElementById('cari');
    const spanJumlah = document.getElementById('jumlah');
    const btnMuatUlang = document.getElementById('muat-ulang');
    const btnEksporJson = document.getElementById('ekspor-json');
    const btnEksporCsv = document.getElementById('ekspor-csv');
    const btnHapusSemua = document.getElementById('hapus-semua');
    const containerDetail = document.getElementById('detail');
    const DETAIL_KOSONG = '<p>Pilih “Detail” pada salah satu baris.</p>';

    function renderTabel(keyword = '') {
        const listPendaftar = ambilDataPendaftar();
        const q = keyword.toLowerCase();

        const filtered = listPendaftar.filter(item =>
            (item.nama && item.nama.toLowerCase().includes(q)) ||
            (item.email && item.email.toLowerCase().includes(q)) ||
            (item.pilihan1 && item.pilihan1.toLowerCase().includes(q))
        );

        spanJumlah.textContent = `Total: ${filtered.length} data`;
        tabelDaftar.innerHTML = '';

        if (filtered.length === 0) {
            tabelDaftar.innerHTML = `
                <tr><td colspan="7" class="kosong">
                    ${listPendaftar.length === 0
                        ? 'Belum ada pendaftar.'
                        : 'Tidak ada data yang cocok dengan pencarian.'}
                </td></tr>`;
            return;
        }

        filtered.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${esc(item.nama)}</td>
                <td>${esc(item.email)}</td>
                <td>${esc(item.hp)}</td>
                <td>${esc(item.pilihan1)}</td>
                <td>${esc(item.waktuDaftar)}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="lihatDetail(${item.id})">Detail</button>
                    <button class="btn btn-danger btn-sm" onclick="hapusSatu(${item.id})">Hapus</button>
                </td>
            `;
            tabelDaftar.appendChild(tr);
        });
    }

    // Tampilkan detail satu pendaftar
    window.lihatDetail = function (id) {
        const item = ambilDataPendaftar().find(p => p.id === id);
        if (!item) return;

        const dokumen = item.dokumen_dpp && item.dokumen_dpp.length
            ? item.dokumen_dpp.map(d => esc(d)).join(', ')
            : 'Tidak ada';

        containerDetail.innerHTML = `
            <div class="detail-grid">
                <strong>Nama:</strong> <span>${esc(item.nama)}</span>
                <strong>Jenis Kelamin:</strong> <span>${esc(item.jenis_kelamin)}</span>
                <strong>Status:</strong> <span>${esc(item.status)}</span>
                <strong>Agama:</strong> <span>${esc(item.agama)}</span>
                <strong>Kewarganegaraan:</strong> <span>${esc(item.kewarganegaraan)}</span>
                <strong>Alamat Surat:</strong> <span>${esc(item.alamat_surat)}</span>
                <strong>Alamat Asal:</strong> <span>${esc(item.alamat_asal)}, ${esc(item.kota)}, ${esc(item.provinsi)}</span>
                <strong>No. HP:</strong> <span>${esc(item.hp)}</span>
                <strong>E-mail:</strong> <span>${esc(item.email)}</span>
                <strong>Orang Tua/Wali:</strong> <span>${esc(item.nama_ortu)} (${esc(item.pendidikan_ortu)})</span>
                <strong>Asal Perguruan Tinggi:</strong> <span>${esc(item.pt_asal)} (Prodi: ${esc(item.prodi_asal)})</span>
                <strong>Pilihan Prodi:</strong> <span>1. ${esc(item.pilihan1)}<br>2. ${esc(item.pilihan2)}<br>3. ${esc(item.pilihan3)}</span>
                <strong>Asal Sekolah:</strong> <span>${esc(item.sekolah)} (${esc(item.status_sekolah)}) – Jurusan ${esc(item.jurusan)}</span>
                <strong>Permohonan DPP:</strong> <span>${esc(item.dpp)} (Dokumen: ${dokumen})</span>
                <strong>Sumbangan Beasiswa:</strong> <span>${esc(item.beasiswa)} ${item.beasiswa_rp ? 'Rp ' + esc(item.beasiswa_rp) : ''}</span>
            </div>
        `;
    };

    // Hapus satu data
    window.hapusSatu = function (id) {
        if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

        const sisa = ambilDataPendaftar().filter(item => item.id !== id);
        simpanDataPendaftar(sisa);
        renderTabel(inputCari.value);
        containerDetail.innerHTML = DETAIL_KOSONG;
        tampilkanNotif('Data berhasil dihapus');
    };

    // Event handler
    inputCari.addEventListener('input', () => renderTabel(inputCari.value));

    btnMuatUlang.addEventListener('click', () => {
        inputCari.value = '';
        renderTabel();
    });

    btnHapusSemua.addEventListener('click', () => {
        if (!confirm('Apakah Anda yakin ingin menghapus SELURUH data pendaftar?')) return;

        localStorage.removeItem(STORAGE_KEY);
        renderTabel();
        containerDetail.innerHTML = DETAIL_KOSONG;
        tampilkanNotif('Semua data berhasil dihapus');
    });

    // Unduh JSON
    btnEksporJson.addEventListener('click', () => {
        const data = JSON.stringify(ambilDataPendaftar(), null, 2);
        unduhFile('data_pendaftar.json', data, 'application/json');
    });

    // Unduh CSV
    btnEksporCsv.addEventListener('click', () => {
        const listPendaftar = ambilDataPendaftar();
        if (listPendaftar.length === 0) {
            alert('Tidak ada data untuk diunduh.');
            return;
        }

        const csvCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
        const headers = ['ID', 'Nama', 'Email', 'HP', 'Pilihan 1', 'Sekolah', 'Waktu Daftar'];
        const rows = listPendaftar.map(p => [
            p.id,
            csvCell(p.nama),
            csvCell(p.email),
            csvCell(p.hp),
            csvCell(p.pilihan1),
            csvCell(p.sekolah),
            csvCell(p.waktuDaftar)
        ].join(','));

        // BOM di awal agar Excel membaca karakter UTF-8 dengan benar
        const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
        unduhFile('data_pendaftar.csv', csv, 'text/csv;charset=utf-8;');
    });

    // Inisialisasi
    renderTabel();
}