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

export function InputPage() {
  const [name, setName] = useState('');
  const [vol, setVol] = useState(40);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<TimeValue | undefined>();
  const [country, setCountry] = useState<string>('us');
  const [city, setCity] = useState<string | undefined>('jp');
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(3.5);

  return (
    <>
      <PageTitle title="Inputs" subtitle="Text field, search, slider, date and time pickers." />

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

      <DemoSection
        title="Search"
        code={`<Search placeholder="Search recipes" trailingIcon="tune" />`}
      >
        <Search placeholder="Search recipes" trailingIcon="tune" />
      </DemoSection>

      <DemoSection
        title="Slider"
        code={`<Slider value={v} onChange={(e) => setV(Number(e.target.value))} />`}
      >
        <Slider value={vol} onChange={(e) => setVol(Number(e.target.value))} />
      </DemoSection>

      <DemoSection
        title="Select"
        description="Popover-based picker. Use when the option set is short and fixed."
        code={`<Select label="Country" options={countries} value={c} onChange={setC} />`}
      >
        <Select label="Country" options={COUNTRIES} value={country} onChange={setCountry} />
      </DemoSection>

      <DemoSection
        title="Combobox"
        description="Typeahead with filtering. Use when the list is long or open-ended."
        code={`<Combobox label="City" options={cities} value={c} onChange={setC} />`}
      >
        <Combobox label="City" options={COUNTRIES} value={city} onChange={setCity} />
      </DemoSection>

      <DemoSection
        title="Number input"
        code={`<NumberInput value={qty} onChange={setQty} min={1} max={99} />`}
      >
        <NumberInput value={qty} onChange={setQty} min={1} max={99} />
      </DemoSection>

      <DemoSection
        title="Rating"
        code={`<Rating value={r} onChange={setR} half />`}
      >
        <Rating value={rating} onChange={setRating} half />
      </DemoSection>

      <DemoSection
        title="Date Picker"
        code={`<DatePicker value={date} onChange={setDate} />`}
      >
        <DatePicker value={date} onChange={setDate} />
      </DemoSection>

      <DemoSection
        title="Time Picker"
        code={`<TimePicker value={time} onChange={setTime} />`}
      >
        <TimePicker value={time} onChange={setTime} />
      </DemoSection>
    </>
  );
}
