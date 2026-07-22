import { useMemo, useState } from 'react';
import {
  Avatar, BivariateChoroplethMap, Button, Card, Chip, DataTable,
  Icon, IconButton, Search, TopAppBar, type BivariateFeatureData,
  type DataTableColumn,
} from '../../lib';
import { ExampleSourceSheet } from '../components/ExampleSourceSheet';
import indonesiaProvinces from './indonesia-provinces.json';
import {
  DATA_SOURCES, DATA_YEAR, PROVINCE_LABOR_DATA, REGIONS,
  type IndonesiaRegion, type ProvinceLaborDatum,
} from './IndonesiaLaborMapPage.data';
import pageSource from './IndonesiaLaborMapPage.tsx?raw';
import dataSource from './IndonesiaLaborMapPage.data.ts?raw';
import styleSource from './IndonesiaLaborMapPage.module.css?raw';
import styles from './IndonesiaLaborMapPage.module.css';

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const compactRupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact', maximumFractionDigits: 1 });

export function IndonesiaLaborMapPage() {
  const [region, setRegion] = useState<'Semua' | IndonesiaRegion>('Semua');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ProvinceLaborDatum>(PROVINCE_LABOR_DATA.find(item => item.id === '31')!);
  const [sourceOpen, setSourceOpen] = useState(false);

  const visibleData = useMemo(() => PROVINCE_LABOR_DATA.filter(item =>
    (region === 'Semua' || item.region === region) &&
    item.province.toLowerCase().includes(query.trim().toLowerCase())
  ), [region, query]);

  const mapData: BivariateFeatureData[] = visibleData.map(item => ({
    ...item,
    id: item.id,
    name: item.province,
    valueA: item.unemploymentRate,
    valueB: item.minimumWage,
  }));

  const averageTpt = PROVINCE_LABOR_DATA.reduce((sum, item) => sum + item.unemploymentRate, 0) / PROVINCE_LABOR_DATA.length;
  const averageUmp = PROVINCE_LABOR_DATA.reduce((sum, item) => sum + item.minimumWage, 0) / PROVINCE_LABOR_DATA.length;
  const highestTpt = [...PROVINCE_LABOR_DATA].sort((a, b) => b.unemploymentRate - a.unemploymentRate)[0];
  const highestUmp = [...PROVINCE_LABOR_DATA].sort((a, b) => b.minimumWage - a.minimumWage)[0];

  const columns: DataTableColumn<ProvinceLaborDatum>[] = [
    {
      id: 'province', header: 'Provinsi', sortable: true, sortValue: row => row.province,
      cell: row => <span className={styles.provinceCell}><Avatar name={row.province} size="sm" tone={2} /><span><strong>{row.province}</strong><small>{row.region}</small></span></span>,
    },
    { id: 'unemploymentRate', header: 'TPT', numeric: true, sortable: true, sortValue: row => row.unemploymentRate, cell: row => `${row.unemploymentRate.toFixed(2)}%` },
    { id: 'minimumWage', header: 'UMP', numeric: true, sortable: true, sortValue: row => row.minimumWage, cell: row => rupiah.format(row.minimumWage) },
  ];

  return (
    <div className={styles.page}>
      <TopAppBar
        title="Indonesia Labor Market"
        start={<IconButton icon="map" label="Indonesia labor map" variant="tonal" />}
        end={<Button variant="tonal" size="sm" startIcon="code" onClick={() => setSourceOpen(true)}>View source</Button>}
      />

      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>Bivariate data story · {DATA_YEAR}</span>
          <h1>Pengangguran dan upah minimum di Indonesia.</h1>
          <p>Bandingkan Tingkat Pengangguran Terbuka dan Upah Minimum Provinsi secara bersamaan pada 38 provinsi.</p>
        </div>
        <div className={styles.heroIcon}><Icon name="travel_explore" size={42} /></div>
      </section>

      <div className={styles.stats}>
        {[
          { label: 'Rata-rata TPT provinsi', value: `${averageTpt.toFixed(2)}%`, icon: 'work_off' },
          { label: 'Rata-rata UMP', value: compactRupiah.format(averageUmp), icon: 'payments' },
          { label: 'TPT tertinggi', value: highestTpt.province, supporting: `${highestTpt.unemploymentRate.toFixed(2)}%`, icon: 'trending_up' },
          { label: 'UMP tertinggi', value: highestUmp.province, supporting: compactRupiah.format(highestUmp.minimumWage), icon: 'workspace_premium' },
        ].map(item => (
          <Card key={item.label} variant="elevated" className={styles.statCard}>
            <Avatar icon={item.icon} size="md" shape="rounded" tone={1} />
            <div><span>{item.label}</span><strong>{item.value}</strong>{item.supporting && <small>{item.supporting}</small>}</div>
          </Card>
        ))}
      </div>

      <Card variant="elevated" className={styles.explorer}>
        <div className={styles.toolbar}>
          <div className={styles.regionFilters}>
            {REGIONS.map(item => <Chip key={item} kind="filter" label={item} selected={region === item} onClick={() => setRegion(item)} />)}
          </div>
          <Search value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari provinsi…" trailingIcon={query ? 'close' : undefined} onTrailingClick={() => setQuery('')} className={styles.search} />
        </div>

        <div className={styles.mapLayout}>
          <div className={styles.mapPanel}>
            <BivariateChoroplethMap
              title="TPT vs UMP per Provinsi"
              subtitle={`${visibleData.length} dari 38 provinsi · kelas warna menggunakan tertile dari data yang tampil`}
              geojson={indonesiaProvinces}
              data={mapData}
              featureIdKey="id"
              projection="mercator"
              labelA="TPT"
              labelB="UMP"
              height={560}
              valueAFormatter={value => `${value.toFixed(2)}%`}
              valueBFormatter={value => compactRupiah.format(value)}
              onFeatureClick={(_, item) => {
                if (!item) return;
                const match = PROVINCE_LABOR_DATA.find(province => province.id === String(item.id));
                if (match) setSelected(match);
              }}
            />
          </div>

          <aside className={styles.detailPanel}>
            <div className={styles.detailHeader}><Avatar name={selected.province} size="lg" shape="rounded" tone={3} /><div><span>Provinsi terpilih</span><h2>{selected.province}</h2><Chip kind="suggestion" label={selected.region} /></div></div>
            <div className={styles.metric}><span>Tingkat Pengangguran Terbuka</span><strong>{selected.unemploymentRate.toFixed(2)}%</strong><small>Persentase angkatan kerja</small></div>
            <div className={styles.metric}><span>Upah Minimum Provinsi</span><strong>{rupiah.format(selected.minimumWage)}</strong><small>Per bulan</small></div>
            <div className={styles.note}><Icon name="info" size={18} /><p>Warna menunjukkan posisi relatif berdasarkan tertile, bukan ambang kebijakan. Visualisasi tidak menyatakan hubungan sebab-akibat.</p></div>
          </aside>
        </div>
      </Card>

      <Card variant="elevated" className={styles.tableCard}>
        <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>Ranking explorer</span><h2>Data provinsi</h2></div><Chip kind="suggestion" label={`${visibleData.length} provinsi`} /></div>
        <DataTable columns={columns} rows={visibleData} rowKey={row => row.id} ariaLabel="Data pengangguran dan UMP per provinsi" />
      </Card>

      <Card variant="outlined" className={styles.sources}>
        <div><span className={styles.eyebrow}>Sumber dan metodologi</span><h2>Data resmi, geometri lokal.</h2><p>Dataset disimpan bersama Example agar cepat dan reproducible. Batas wilayah adalah GeoJSON 38 provinsi yang dirujukkan ke layanan administrasi BIG.</p></div>
        <div className={styles.sourceLinks}>{DATA_SOURCES.map(source => <a key={source.label} href={source.url} target="_blank" rel="noreferrer"><Icon name="open_in_new" size={18} /><span><strong>{source.label}</strong><small>{source.organization}</small></span></a>)}</div>
      </Card>

      <ExampleSourceSheet open={sourceOpen} onClose={() => setSourceOpen(false)} title="Indonesia Labor Map" pageSource={pageSource} dataSource={dataSource} styleSource={styleSource} />
    </div>
  );
}
