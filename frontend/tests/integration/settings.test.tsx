import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import SettingsPage from '../../src/pages/SettingsPage';
import { mockQuestionerData, mockProductData } from '../../src/data/mockData';

// Mock data for testing
const mockData = {
  questioners: mockQuestionerData,
  products: mockProductData,
};

// Mock the data service
vi.mock('../../src/services/dataService', () => ({
  getQuestionerList: vi.fn(() => Promise.resolve(mockData.questioners)),
  getProductList: vi.fn(() => Promise.resolve(mockData.products)),
  updateSettings: vi.fn(() => Promise.resolve()),
}));

describe('Settings Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display settings page with two sections', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('설정')).toBeInTheDocument();
    });

    // Check two main sections
    expect(screen.getByText('서브메뉴')).toBeInTheDocument();
    expect(screen.getByText('질문자 리스트')).toBeInTheDocument();
    expect(screen.getByText('상품 리스트')).toBeInTheDocument();
  });

  it('should toggle questioner editability and apply immediately', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('설정')).toBeInTheDocument();
    });

    // Click on 기본 설정
    const basicSettingsButton = screen.getByRole('button', { name: /기본 설정/i });
    fireEvent.click(basicSettingsButton);

    // Toggle questioner editability
    const questionerEditToggle = screen.getByLabelText('질문자 수정가능여부');
    fireEvent.click(questionerEditToggle);

    // Should apply immediately
    await waitFor(() => {
      expect(questionerEditToggle).toBeChecked();
    });
  });

  it('should toggle product editability and apply immediately', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('설정')).toBeInTheDocument();
    });

    // Click on 기본 설정
    const basicSettingsButton = screen.getByRole('button', { name: /기본 설정/i });
    fireEvent.click(basicSettingsButton);

    // Toggle product editability
    const productEditToggle = screen.getByLabelText('상품 수정가능여부');
    fireEvent.click(productEditToggle);

    // Should apply immediately
    await waitFor(() => {
      expect(productEditToggle).toBeChecked();
    });
  });

  it('should change font size and apply immediately', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('설정')).toBeInTheDocument();
    });

    // Click on 기본 설정
    const basicSettingsButton = screen.getByRole('button', { name: /기본 설정/i });
    fireEvent.click(basicSettingsButton);

    // Change font size
    const fontSizeSlider = screen.getByLabelText(/글꼴 크기/);
    fireEvent.change(fontSizeSlider, { target: { value: '18' } });

    // Should apply immediately
    await waitFor(() => {
      expect(document.documentElement.style.fontSize).toBe('18px');
    });
  });

  it('should toggle light/dark mode and apply immediately', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('설정')).toBeInTheDocument();
    });

    // Click on 기본 설정
    const basicSettingsButton = screen.getByRole('button', { name: /기본 설정/i });
    fireEvent.click(basicSettingsButton);

    // Toggle dark mode
    const darkModeToggle = screen.getByLabelText('다크 모드');
    fireEvent.click(darkModeToggle);

    // Should apply immediately
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  it('should display questioner list with filters', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('설정')).toBeInTheDocument();
    });

    // Click on 질문자 리스트
    const questionerListButton = screen.getByRole('button', { name: /질문자 리스트/i });
    fireEvent.click(questionerListButton);

    // Should show questioner list with filters
    await waitFor(() => {
      expect(screen.getByText('질문자 목록')).toBeInTheDocument();
      expect(screen.getByLabelText('상품분류')).toBeInTheDocument();
      expect(screen.getByLabelText('성별')).toBeInTheDocument();
      expect(screen.getByLabelText('연령대')).toBeInTheDocument();
    });
  });

  it('should filter questioner list by product category', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('설정')).toBeInTheDocument();
    });

    // Click on 질문자 리스트
    const questionerListButton = screen.getByRole('button', { name: /질문자 리스트/i });
    fireEvent.click(questionerListButton);

    // Filter by product category
    const categoryFilter = screen.getByLabelText('상품분류');
    fireEvent.change(categoryFilter, { target: { value: 'SECURITIES' } });

    // Should show filtered results
    await waitFor(() => {
      const questionerRows = screen.getAllByRole('row');
      expect(questionerRows.length - 1).toBeGreaterThan(0); // 헤더 제외
    });
  });

  it('should navigate to questioner detail page', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('설정')).toBeInTheDocument();
    });

    // Click on 질문자 리스트
    const questionerListButton = screen.getByRole('button', { name: /질문자 리스트/i });
    fireEvent.click(questionerListButton);

    // Click on first questioner row
    await waitFor(() => {
      const questionerRows = screen.getAllByRole('row');
      if (questionerRows.length > 1) {
        fireEvent.click(questionerRows[1]); // Skip header row

        // Should navigate to questioner detail
        expect(window.location.pathname).toMatch(/\/questioner\/\w+/);
      }
    });
  });

  it('should display product list with filters', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('설정')).toBeInTheDocument();
    });

    // Click on 상품 리스트
    const productListButton = screen.getByRole('button', { name: /상품 리스트/i });
    fireEvent.click(productListButton);

    // Should show product list with filters
    await waitFor(() => {
      expect(screen.getByText('상품 목록')).toBeInTheDocument();
      expect(screen.getByLabelText('상품분류')).toBeInTheDocument();
      expect(screen.getByLabelText('상품유형')).toBeInTheDocument();
    });
  });

  it('should filter product list by product type', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('설정')).toBeInTheDocument();
    });

    // Click on 상품 리스트
    const productListButton = screen.getByRole('button', { name: /상품 리스트/i });
    fireEvent.click(productListButton);

    // Filter by product type
    const typeFilter = screen.getByLabelText('상품유형');
    fireEvent.change(typeFilter, { target: { value: 'EQUITY' } });

    // Should show filtered results
    await waitFor(() => {
      const productRows = screen.getAllByRole('row');
      expect(productRows.length - 1).toBeGreaterThan(0); // 헤더 제외
    });
  });

  it('should navigate to product detail page', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('설정')).toBeInTheDocument();
    });

    // Click on 상품 리스트
    const productListButton = screen.getByRole('button', { name: /상품 리스트/i });
    fireEvent.click(productListButton);

    // Click on first product row
    await waitFor(() => {
      const productRows = screen.getAllByRole('row');
      if (productRows.length > 1) {
        fireEvent.click(productRows[1]); // Skip header row

        // Should navigate to product detail
        expect(window.location.pathname).toMatch(/\/product\/\w+/);
      }
    });
  });

  it('should persist settings changes', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('설정')).toBeInTheDocument();
    });

    // Click on 기본 설정
    const basicSettingsButton = screen.getByRole('button', { name: /기본 설정/i });
    fireEvent.click(basicSettingsButton);

    // Change settings
    const questionerEditToggle = screen.getByLabelText('질문자 수정가능여부');
    fireEvent.click(questionerEditToggle);

    const fontSizeSlider = screen.getByLabelText(/글꼴 크기/);
    fireEvent.change(fontSizeSlider, { target: { value: '16' } });

    // Settings should be persisted
    await waitFor(() => {
      expect(questionerEditToggle).toBeChecked();
      expect(fontSizeSlider).toHaveValue('16');
    });
  });
});
