import { Calendar } from 'reshaped';

const HomePage = () => {
  return (
    <div>
      <h1>First Page</h1>

      <Calendar
        defaultMonth={new Date(2025, 0)}
        defaultValue={new Date(2025, 0, 10)}
      />
    </div>
  );
};

export default HomePage;
