import { useState } from 'react';
import {
  TextField, Search, Slider, DatePicker, TimePicker, type TimeValue,
  Select, Combobox, NumberInput, Rating,
} from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';

const COUNTRIES = [
  { value: 'us', label: 'United States', icon: 'flag' },
  { value: 'ca', label: 'Canada', icon: 'flag' },
  { value: 'mx', label: 'Mexico', icon: 'flag' },
  { value: 'gb', label: 'United Kingdom', icon: 'flag' },
  { value: 'de', label: 'Germany', icon: 'flag' },
  { value: 'jp', label: 'Japan', icon: 'flag' },
];

const FLAG_OPTIONS = [
  { value: 'id', label: 'Indonesia', image: 'https://flagcdn.com/w40/id.png' },
  { value: 'us', label: 'United States', image: 'https://flagcdn.com/w40/us.png' },
  { value: 'jp', label: 'Japan', image: 'https://flagcdn.com/w40/jp.png' },
  { value: 'gb', label: 'United Kingdom', image: 'https://flagcdn.com/w40/gb.png' },
  { value: 'de', label: 'Germany', image: 'https://flagcdn.com/w40/de.png' },
];

export function InputPage({ activeComponent }: { activeComponent?: string }) {
  const [name, setName] = useState('');
  const [vol, setVol] = useState(40);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<TimeValue | undefined>();
  const [country, setCountry] = useState<string>('us');
  const [multiCountries, setMultiCountries] = useState<string[]>(['us', 'ca']);
  const [searchableCountry, setSearchableCountry] = useState<string>('us');
  const [flagCountry, setFlagCountry] = useState<string>('id');
  const [city, setCity] = useState<string | undefined>('jp');
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(3.5);

  const showAll = !activeComponent;

  return (
    <>
      <PageTitle title="Inputs" subtitle="Text field, search, slider, date and time pickers." />

      {(showAll || activeComponent === 'text-field') && (
        <DemoSection
          title="Text Field"
          code={`<TextField label="Name" />
<TextField variant="filled" label="Email" leadingIcon="mail" />
<TextField label="Password" type="password" trailingIcon="visibility" />
<TextField label="Error" error helperText="Invalid value" />`}
        >
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField variant="filled" label="Email" leadingIcon="mail" />
          <TextField label="Password" type="password" trailingIcon="visibility" />
          <TextField label="Error" error helperText="Invalid value" defaultValue="bad" />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'search') && (
        <DemoSection
          title="Search"
          code={`<Search placeholder="Search recipes" trailingIcon="tune" />`}
        >
          <Search placeholder="Search recipes" trailingIcon="tune" />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'slider') && (
        <DemoSection
          title="Slider"
          code={`<Slider value={v} onChange={(e) => setV(Number(e.target.value))} />`}
        >
          <Slider value={vol} onChange={(e) => setVol(Number(e.target.value))} />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'select') && (
        <DemoSection
          title="Select (Single, Multi, Searchable & Prefix Image Select)"
          description="Popover-based picker supporting single selection, multi-selection with checkboxes, real-time search filtering, and custom prefix avatar/flag images."
          code={`{/* Single Select */}
<Select label="Single Country" options={countries} value={country} onChange={setCountry} />

{/* Multi Select */}
<Select multiple label="Multiple Countries" options={countries} value={multiCountries} onChange={setMultiCountries} />

{/* Searchable Select */}
<Select searchable label="Searchable Country" options={countries} value={searchableCountry} onChange={setSearchableCountry} />

{/* Select with Prefix Image */}
<Select searchable label="Country with Flag Image" options={FLAG_OPTIONS} value={flagCountry} onChange={setFlagCountry} />`}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, width: '100%' }}>
            <Select label="Single Country" options={COUNTRIES} value={country} onChange={setCountry} width="100%" />
            <Select multiple label="Multiple Countries" options={COUNTRIES} value={multiCountries} onChange={setMultiCountries} width="100%" />
            <Select searchable label="Searchable Country" options={COUNTRIES} value={searchableCountry} onChange={setSearchableCountry} width="100%" />
            <Select searchable label="Country with Flag Image" options={FLAG_OPTIONS} value={flagCountry} onChange={setFlagCountry} width="100%" />
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'combobox') && (
        <DemoSection
          title="Combobox"
          description="Typeahead with filtering. Use when the list is long or open-ended."
          code={`<Combobox label="City" options={cities} value={c} onChange={setC} />`}
        >
          <Combobox label="City" options={COUNTRIES} value={city} onChange={setCity} />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'number-input') && (
        <DemoSection
          title="Number input"
          code={`<NumberInput value={qty} onChange={setQty} min={1} max={99} />`}
        >
          <NumberInput value={qty} onChange={setQty} min={1} max={99} />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'rating') && (
        <DemoSection
          title="Rating"
          code={`<Rating value={r} onChange={setR} half />`}
        >
          <Rating value={rating} onChange={setRating} half />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'date-picker') && (
        <DemoSection
          title="Date Picker"
          code={`<DatePicker value={date} onChange={setDate} />`}
        >
          <DatePicker value={date} onChange={setDate} />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'time-picker') && (
        <DemoSection
          title="Time Picker"
          code={`<TimePicker value={time} onChange={setTime} />`}
        >
          <TimePicker value={time} onChange={setTime} />
        </DemoSection>
      )}
    </>
  );
}
