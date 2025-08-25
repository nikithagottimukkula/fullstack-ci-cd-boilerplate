import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/store';
import App from './App';

// Test wrapper with all required providers
const TestWrapper = ({ children }) => (
  <Provider store={store}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </Provider>
);

test('renders fullstack boilerplate header', () => {
  render(
    <TestWrapper>
      <App />
    </TestWrapper>
  );
  const headerElement = screen.getByText(/Fullstack CI\/CD Boilerplate/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders navigation links', () => {
  render(
    <TestWrapper>
      <App />
    </TestWrapper>
  );
  const homeLink = screen.getByText('Home');
  const usersLink = screen.getByText('Users');
  expect(homeLink).toBeInTheDocument();
  expect(usersLink).toBeInTheDocument();
});
