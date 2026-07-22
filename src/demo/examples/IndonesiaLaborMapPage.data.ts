export type IndonesiaRegion = 'Sumatra' | 'Jawa & Bali' | 'Nusa Tenggara' | 'Kalimantan' | 'Sulawesi' | 'Maluku' | 'Papua';

export interface ProvinceLaborDatum {
  id: string;
  province: string;
  region: IndonesiaRegion;
  unemploymentRate: number;
  minimumWage: number;
}

export const DATA_YEAR = 2024;

// TPT: BPS, keadaan ketenagakerjaan Agustus 2024.
// UMP: BPS/Kementerian Ketenagakerjaan, Upah Minimum Provinsi 2024.
// The Papua DOB entries use the applicable provincial minimum-wage decree
// inherited/published for their administrative area in the reference year.
export const PROVINCE_LABOR_DATA: ProvinceLaborDatum[] = [
  { id: '11', province: 'Aceh', region: 'Sumatra', unemploymentRate: 5.75, minimumWage: 3460672 },
  { id: '12', province: 'Sumatera Utara', region: 'Sumatra', unemploymentRate: 5.60, minimumWage: 2809915 },
  { id: '13', province: 'Sumatera Barat', region: 'Sumatra', unemploymentRate: 5.75, minimumWage: 2811449 },
  { id: '14', province: 'Riau', region: 'Sumatra', unemploymentRate: 4.42, minimumWage: 3294625 },
  { id: '15', province: 'Jambi', region: 'Sumatra', unemploymentRate: 4.48, minimumWage: 3037121 },
  { id: '16', province: 'Sumatera Selatan', region: 'Sumatra', unemploymentRate: 3.97, minimumWage: 3456874 },
  { id: '17', province: 'Bengkulu', region: 'Sumatra', unemploymentRate: 3.11, minimumWage: 2507079 },
  { id: '18', province: 'Lampung', region: 'Sumatra', unemploymentRate: 4.19, minimumWage: 2716497 },
  { id: '19', province: 'Kepulauan Bangka Belitung', region: 'Sumatra', unemploymentRate: 4.63, minimumWage: 3640000 },
  { id: '21', province: 'Kepulauan Riau', region: 'Sumatra', unemploymentRate: 6.39, minimumWage: 3402492 },
  { id: '31', province: 'DKI Jakarta', region: 'Jawa & Bali', unemploymentRate: 6.21, minimumWage: 5067381 },
  { id: '32', province: 'Jawa Barat', region: 'Jawa & Bali', unemploymentRate: 6.75, minimumWage: 2057495 },
  { id: '33', province: 'Jawa Tengah', region: 'Jawa & Bali', unemploymentRate: 4.78, minimumWage: 2036947 },
  { id: '34', province: 'Daerah Istimewa Yogyakarta', region: 'Jawa & Bali', unemploymentRate: 3.48, minimumWage: 2125897 },
  { id: '35', province: 'Jawa Timur', region: 'Jawa & Bali', unemploymentRate: 4.19, minimumWage: 2165244 },
  { id: '36', province: 'Banten', region: 'Jawa & Bali', unemploymentRate: 6.68, minimumWage: 2727812 },
  { id: '51', province: 'Bali', region: 'Jawa & Bali', unemploymentRate: 1.79, minimumWage: 2813672 },
  { id: '52', province: 'Nusa Tenggara Barat', region: 'Nusa Tenggara', unemploymentRate: 3.22, minimumWage: 2444067 },
  { id: '53', province: 'Nusa Tenggara Timur', region: 'Nusa Tenggara', unemploymentRate: 3.02, minimumWage: 2186826 },
  { id: '61', province: 'Kalimantan Barat', region: 'Kalimantan', unemploymentRate: 4.86, minimumWage: 2702616 },
  { id: '62', province: 'Kalimantan Tengah', region: 'Kalimantan', unemploymentRate: 4.01, minimumWage: 3261616 },
  { id: '63', province: 'Kalimantan Selatan', region: 'Kalimantan', unemploymentRate: 4.20, minimumWage: 3282812 },
  { id: '64', province: 'Kalimantan Timur', region: 'Kalimantan', unemploymentRate: 5.14, minimumWage: 3360858 },
  { id: '65', province: 'Kalimantan Utara', region: 'Kalimantan', unemploymentRate: 4.01, minimumWage: 3361653 },
  { id: '71', province: 'Sulawesi Utara', region: 'Sulawesi', unemploymentRate: 6.03, minimumWage: 3545000 },
  { id: '72', province: 'Sulawesi Tengah', region: 'Sulawesi', unemploymentRate: 3.15, minimumWage: 2736698 },
  { id: '73', province: 'Sulawesi Selatan', region: 'Sulawesi', unemploymentRate: 4.19, minimumWage: 3434298 },
  { id: '74', province: 'Sulawesi Tenggara', region: 'Sulawesi', unemploymentRate: 3.09, minimumWage: 2885964 },
  { id: '75', province: 'Gorontalo', region: 'Sulawesi', unemploymentRate: 3.13, minimumWage: 3025100 },
  { id: '76', province: 'Sulawesi Barat', region: 'Sulawesi', unemploymentRate: 3.14, minimumWage: 2914958 },
  { id: '81', province: 'Maluku', region: 'Maluku', unemploymentRate: 6.11, minimumWage: 2949953 },
  { id: '82', province: 'Maluku Utara', region: 'Maluku', unemploymentRate: 4.03, minimumWage: 3200000 },
  { id: '91-A', province: 'Papua', region: 'Papua', unemploymentRate: 6.48, minimumWage: 4024270 },
  { id: '92-A', province: 'Papua Barat', region: 'Papua', unemploymentRate: 4.13, minimumWage: 3393500 },
  { id: '92-B', province: 'Papua Barat Daya', region: 'Papua', unemploymentRate: 6.50, minimumWage: 3393500 },
  { id: '91-B', province: 'Papua Pegunungan', region: 'Papua', unemploymentRate: 1.68, minimumWage: 4024270 },
  { id: '91-C', province: 'Papua Selatan', region: 'Papua', unemploymentRate: 4.47, minimumWage: 4024270 },
  { id: '91-D', province: 'Papua Tengah', region: 'Papua', unemploymentRate: 2.80, minimumWage: 4024270 },
];

export const REGIONS: Array<'Semua' | IndonesiaRegion> = ['Semua', 'Sumatra', 'Jawa & Bali', 'Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku', 'Papua'];

export const DATA_SOURCES = [
  { label: 'TPT Agustus 2024', organization: 'Badan Pusat Statistik', url: 'https://www.bps.go.id/id/statistics-table/2/NTQzIzI=/tingkat-pengangguran-terbuka-menurut-provinsi.html' },
  { label: 'Upah Minimum Provinsi 2024', organization: 'Badan Pusat Statistik', url: 'https://www.bps.go.id/id/statistics-table/2/MjIwIzI=/upah-minimum-regional-propinsi.html' },
  { label: 'Batas administrasi provinsi', organization: 'Badan Informasi Geospasial', url: 'https://geoservices.big.go.id/gis/rest/services/STIG/Batas_Provinsi/MapServer/0' },
];
