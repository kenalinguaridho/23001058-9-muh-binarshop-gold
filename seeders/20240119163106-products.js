'use strict';
const {v4: uuid} = require('uuid')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('Products', [
      {
        id: uuid(),
        sku: 'FS-0001',
        categoryId: 1,
        name: 'Kemeja Flanel',
        description: 'Kemeja berbahan flanel dengan motif kotak-kotak',
        price: 150_000.00,
        stock : 25
      },
      {
        id: uuid(),
        sku: 'FS-0002',
        categoryId: 1,
        name: 'Kemeja Polos',
        description: 'Kemeja berbahan flanel tanpa motif terselubung',
        price: 150_000.00,
        stock : 25
      },
      {
        id: uuid(),
        sku: 'FS-0003',
        categoryId: 1,
        name: 'Kaos Band',
        description: 'Kaos band custom dengan gambar yang bisa kamu pilih sendiri',
        price: 125_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 1,
        name: 'Celana Cargo Panjang',
        sku: 'FS-0004',
        description: 'Celana Cargo Panjang sampe mata kaki',
        price: 175_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 1,
        name: 'Celana Cargo Pendek',
        sku: 'FS-0005',
        description: 'Celana Cargo tapi pendek se lutut',
        price: 100_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 1,
        name: 'Kolor Bola',
        sku: 'FS-0006',
        description: 'Celana pendek bahan adem dengan logo tim favorit kamu',
        price: 25_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 2,
        name: 'Sepatu Sekolah Tanpa Merek',
        sku: 'SAS-0001',
        description: 'Sepatu Sekolah anti air dan kebal razia',
        price: 135_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 2,
        name: 'Sepatu Olahraga',
        sku: 'SAS-0002',
        description: 'Sepatu buat olahraga',
        price: 200_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 2,
        name: 'Sepatu Futsal Bagus',
        sku: 'SAS-0003',
        description: 'Sepatu buat main futsal, bukan buat kondangan',
        price: 250_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 2,
        name: 'Sepatu Pantofel Pria',
        sku: 'SAS-0004',
        description: 'Sepatu rapih berbahan kulit sintetis buat acara resmi, bukan buat main futsal',
        price: 350_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 2,
        name: 'Sepatu Pantofel Wanita',
        sku: 'SAS-0005',
        description: 'Sama kaya sepatu pantofel pria, tapi buat wanita',
        price: 350_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 2,
        name: 'Sandal Jepit Swallow',
        sku: 'SAS-0006',
        description: 'Sandal swallow, gak ada yang spesial',
        price: 15_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 3,
        name: 'TV LED 29 inch',
        sku: 'ELT-0001',
        description: 'Televisi layar datar dengan ukuran 29 inch',
        price: 2_250_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 3,
        name: 'Set Top Box',
        sku: 'ELT-0002',
        description: 'Set Top Box untuk kamu yang masih mau nonton TV',
        price: 135_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 3,
        name: 'Microwave',
        sku: 'ELT-0003',
        description: 'Microwave untuk bantu masak dan menghangatkan makanan',
        price: 775_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 3,
        name: 'Air Fryer',
        sku: 'ELT-0004',
        description: 'Alat untuk bantu kamu memasak dengan tenaga listrik',
        price: 650_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 3,
        name: 'Oven Listrik',
        sku: 'ELT-0005',
        description: 'Oven seperti biasa, tapi nyalain pake listrik',
        price: 785_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 3,
        name: 'Blender',
        sku: 'ELT-0006',
        description: 'Blender yang akan bantu kamu mengahasluskan bummbu dan buah tanpa bikin kamu capek',
        price: 550_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 4,
        name: 'Gelang Power Balance',
        sku: 'ACC-0001',
        description: 'Gelang yang bisa bikin kamu seimbang anti jatuh',
        price: 125_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 4,
        name: 'Cincin Warna Emas',
        sku: 'ACC-0002',
        description: 'Cincin logam berwarna seperti emas, bukan emas',
        price: 75_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 4,
        name: 'Kalung Warna Emas',
        sku: 'ACC-0003',
        description: 'Kalung logam berwarna seperti emas, bukan emas',
        price: 135_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 4,
        name: 'Gelang Warna Emas',
        sku: 'ACC-0004',
        description: 'Galung logam berwarna seperti emas, bukan emas',
        price: 105_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 4,
        name: 'Bros Motif Bunga',
        sku: 'ACC-0005',
        description: 'Bros yang akan membuat hijabmu makin cantik',
        price: 15_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 4,
        name: 'Kacamata',
        sku: 'ACC-0006',
        description: 'Aksesoris yang akan membuatmu kebal dari cahaya',
        price: 145_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 5,
        name: 'Mobil RC Offroad',
        sku: 'MAH-0001',
        description: 'Mobil mainan dengan remote control hingga 50 meter',
        price: 245_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 5,
        name: 'MobilRC Drift',
        sku: 'MAH-0002',
        description: 'Mobil mainan dengan remote control yang akan membuatmu seperti seorang drifter',
        price: 455_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 5,
        name: 'Set Mainan Rumah-Rumahan',
        sku: 'MAH-0003',
        description: 'Set mainan dengan rumah-rumahan dan karakter yang lucu untuk mainan anak',
        price: 225_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 5,
        name: 'Mainan Bongkar Pasang',
        sku: 'MAH-0004',
        description: 'Mainan bongkar pasang yang bisa melatih daya nalar anak anda',
        price: 85_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 5,
        name: 'Boneka Barbie',
        sku: 'MAH-0005',
        description: 'Boneka karakter Barbie yang bisa dibongkar pasang dan bisa distyling sendiri oleh anak anda',
        price : 200_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 6,
        name: 'Panci Stainless',
        sku: 'KTC-0001',
        description: 'Panci untuk masak berbahan stainless steel',
        price : 135_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 6,
        name: 'Wajan Stainless',
        sku: 'KTC-0002',
        description: 'Wajan untuk masak berbahan stainless steel',
        price : 165_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 6,
        name: 'Spatula Stainless',
        sku: 'KTC-0003',
        description: 'Spatula berbahan dasar stainless untuk membantu anda membolak-balik masakan anda',
        price : 65_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 6,
        name: 'Capitan Stainless',
        sku: 'KTC-0004',
        description: 'Capitan untuk mengangkat masakan anda sebelum gosong',
        price : 45_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 6,
        name: 'Saringan stainless',
        sku: 'KTC-0005',
        description: 'Saringan untuk membantu anda menyaring santan dari kelapa',
        price : 35_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 6,
        name: 'Wadah Minyak Stainless',
        sku: 'KTC-0006',
        description: 'Wadah untuk menampung minyak yang sudah selesai pakai dengan saringan agar minyak bebas kotoran',
        price : 85_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 7,
        name: 'Gergaji',
        sku: 'CPT-0001',
        description: 'Gergaji tajam tanpa perlu diasah untuk memotong kayu',
        price : 135_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 7,
        name: 'Tang Buaya',
        sku: 'CPT-0002',
        description: 'Tang untuk menjepit kabel',
        price : 65_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 7,
        name: 'Palu',
        sku: 'CPT-0003',
        description: 'Alat untuk memukul paku agar bisa masuk maksimal anti meleset',
        price : 55_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 7,
        name: 'Obeng Plus',
        sku: 'CPT-0004',
        description: 'Obeng dengan mata berbentuk plus',
        price : 55_000.00,
        stock : 25
      },
      {
        id: uuid(),
        categoryId: 7,
        name: 'Obeng Min',
        sku: 'CPT-0005',
        description: 'Obeng dengan mata berbentuk minus',
        price : 55_000.00,
        stock : 25
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Products', null, {});
  }
};
